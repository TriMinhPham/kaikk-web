/**
 * POST /api/inquiry — Cloudflare Pages Function.
 *
 * Accepts a contact-form inquiry as JSON from this site only, checks it
 * (origin, honeypot, fill time, field rules, per-IP rate limit, Cloudflare
 * Turnstile), stores it in D1 and, when an EMAIL binding is configured,
 * notifies info@kaikk.jp. It answers {ok:true, ref} only after the row is
 * stored. Raw IP addresses are never stored and nothing personal is logged.
 *
 * Bindings (wrangler.toml / Pages settings):
 *   DB               D1 database `kaikk-inquiries` (required)
 *   TURNSTILE_SECRET Pages secret (required)
 *   IP_HASH_SALT     optional Pages secret; falls back to TURNSTILE_SECRET as HMAC key
 *   EMAIL            optional; object with send({to, from, subject, text, replyTo}).
 *                    See docs/inquiry-backend.md for how to enable it.
 */
import {
  INQUIRY_LIMITS,
  INQUIRY_MIN_FILL_MS,
  INQUIRY_NOTIFY_FROM,
  INQUIRY_NOTIFY_TO,
  INQUIRY_RATE_LIMIT,
  INQUIRY_RETENTION_MONTHS,
  INQUIRY_TOPICS,
  RATE_EVENT_RETENTION_HOURS,
  TURNSTILE_ACTION,
} from "../../src/lib/inquiry-rules.ts";

// Minimal structural types, so this file needs no @cloudflare/workers-types.
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
export interface EmailBinding {
  send(message: { to: string; from: string | { email: string; name?: string }; subject: string; text: string; replyTo?: string }): Promise<unknown>;
}
export interface Env {
  DB?: D1Database;
  TURNSTILE_SECRET?: string;
  IP_HASH_SALT?: string;
  EMAIL?: EmailBinding;
}
interface PagesContext {
  request: Request;
  env: Env;
  waitUntil?: (promise: Promise<unknown>) => void;
}
export interface Deps {
  fetch: typeof fetch;
  now: () => number;
  log: (event: Record<string, string | number | boolean>) => void;
}

export const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_BODY_BYTES = 16 * 1024;
const PRODUCTION_HOSTS = ["kaikk.jp", "www.kaikk.jp", "kaikk-jp.pages.dev"];
const PREVIEW_SUFFIX = ".kaikk-jp.pages.dev";
const DEV_HOSTS = ["localhost", "127.0.0.1"];
// Cloudflare's documented always-pass test secret reports hostname "example.com".
const TURNSTILE_TEST_SECRET_PREFIX = "1x0000000000000000000000000000000";

export function isAllowedHost(hostname: string, protocol: string) {
  if (protocol === "https:") return PRODUCTION_HOSTS.includes(hostname) || hostname.endsWith(PREVIEW_SUFFIX);
  if (protocol === "http:") return DEV_HOSTS.includes(hostname);
  return false;
}

/** Same-origin only: the Origin header must equal this request's own origin, and that origin must be KAI's. */
export function isAllowedOrigin(origin: string | null, requestUrl: string) {
  if (!origin) return false;
  let parsed: URL;
  try { parsed = new URL(origin); } catch { return false; }
  const self = new URL(requestUrl);
  return parsed.origin === origin && parsed.origin === self.origin && isAllowedHost(parsed.hostname, parsed.protocol);
}

export type Inquiry = { name: string; email: string; company: string; topic: string; message: string; locale: "ja" | "en" };
type Validation = { ok: true; value: Inquiry } | { ok: false; field: string };

// Control characters except tab and newline; also bidi overrides that could disguise text in the inbox.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g;
const singleLine = (v: string) => v.normalize("NFC").replace(CONTROL, "").replace(/[\r\n\t\u2028\u2029]+/g, " ").replace(/\s{2,}/g, " ").trim();
const multiLine = (v: string) => v.normalize("NFC").replace(/\r\n?/g, "\n").replace(CONTROL, "").replace(/\n{4,}/g, "\n\n\n").trim();
const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function isValidEmail(email: string) {
  return email.length <= INQUIRY_LIMITS.email && EMAIL_RE.test(email) && !email.includes("..") && !email.startsWith(".") && !email.includes(".@");
}

export function validateInquiry(body: Record<string, unknown>): Validation {
  const str = (key: string) => (typeof body[key] === "string" ? (body[key] as string) : body[key] == null ? "" : null);
  const raw = { name: str("name"), email: str("email"), company: str("company"), topic: str("topic"), message: str("message"), locale: str("locale") };
  for (const [key, value] of Object.entries(raw)) if (value === null) return { ok: false, field: key };
  const name = singleLine(raw.name!);
  const email = singleLine(raw.email!);
  const company = singleLine(raw.company!);
  const topic = singleLine(raw.topic!);
  const message = multiLine(raw.message!);
  const locale = raw.locale;
  if (locale !== "ja" && locale !== "en") return { ok: false, field: "locale" };
  if (!name || name.length > INQUIRY_LIMITS.name) return { ok: false, field: "name" };
  if (!isValidEmail(email)) return { ok: false, field: "email" };
  if (company.length > INQUIRY_LIMITS.company) return { ok: false, field: "company" };
  if (topic && !(INQUIRY_TOPICS as readonly string[]).includes(topic)) return { ok: false, field: "topic" };
  if (!message || message.length > INQUIRY_LIMITS.message) return { ok: false, field: "message" };
  return { ok: true, value: { name, email, company, topic, message, locale } };
}

/** HMAC-SHA-256 of the IP with a secret key, hex. The raw IP is never stored. */
export async function hashIp(ip: string, key: string) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(`kaikk-inquiry-ip:${key}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(ip));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}

const REF_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32: no I, L, O, U
export function newRef() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const chars = [...bytes].map(b => REF_ALPHABET[b % 32]).join("");
  return `KAI-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...(status === 405 ? { allow: "POST" } : {}),
    },
  });
}

async function verifyTurnstile(token: string, ip: string | null, secret: string, expectedHost: string, deps: Deps) {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  let res: Response;
  try {
    res = await deps.fetch(SITEVERIFY_URL, { method: "POST", body: form });
  } catch {
    return "turnstile_unavailable";
  }
  if (!res.ok) return "turnstile_unavailable";
  const data = (await res.json().catch(() => null)) as { success?: boolean; action?: string; hostname?: string } | null;
  if (!data || data.success !== true) return "turnstile_failed";
  if (data.action && data.action !== TURNSTILE_ACTION) return "turnstile_failed";
  const testSecret = secret.startsWith(TURNSTILE_TEST_SECRET_PREFIX);
  if (!testSecret && data.hostname && data.hostname !== expectedHost) return "turnstile_failed";
  return null;
}

const TOPIC_LABELS: Record<string, string> = {
  "ai-adoption": "AI導入の進め方 / Getting started with AI",
  "business-automation": "業務自動化・システム連携 / Business automation",
  "generative-ai": "生成AIの社内活用 / Generative AI at work",
  web: "Webシステム開発 / Web systems",
  other: "その他・未定 / Other",
};

export function notificationEmail(ref: string, v: Inquiry, receivedAt: string) {
  const topic = v.topic ? TOPIC_LABELS[v.topic] ?? v.topic : "（未選択 / not selected）";
  const subjectName = v.name.slice(0, 60);
  return {
    to: INQUIRY_NOTIFY_TO,
    from: { email: INQUIRY_NOTIFY_FROM, name: "KAI website" },
    // Every visitor-supplied value here is single-line (CR/LF removed in validation).
    subject: `[KAI問い合わせ ${ref}] ${subjectName}`,
    replyTo: v.email,
    text: [
      `受付番号 / Ref: ${ref}`,
      `受信日時 / Received (UTC): ${receivedAt}`,
      `言語 / Locale: ${v.locale}`,
      `ご相談の種類 / Topic: ${topic}`,
      `会社名 / Company: ${v.company || "（未記入 / not provided）"}`,
      `お名前 / Name: ${v.name}`,
      `メール / Email: ${v.email}`,
      "",
      "お問い合わせ内容 / Message:",
      v.message,
      "",
      "---",
      "このメールにそのまま返信すると、問い合わせ者に届きます。/ Reply to this email to answer the visitor.",
      "D1: kaikk-inquiries / inquiries (ref above)",
    ].join("\n"),
  };
}

export async function handleInquiry(request: Request, env: Env, deps: Deps, waitUntil?: (p: Promise<unknown>) => void): Promise<Response> {
  const reject = (status: number, error: string, extra: Record<string, string> = {}) => {
    deps.log({ event: "inquiry_rejected", error, ...extra });
    return json(status, { ok: false, error, ...extra });
  };
  if (request.method !== "POST") return reject(405, "method_not_allowed");
  const url = new URL(request.url);
  if (!isAllowedOrigin(request.headers.get("origin"), request.url)) return reject(403, "forbidden_origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return reject(403, "forbidden_origin");
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return reject(415, "unsupported_media_type");
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return reject(413, "payload_too_large");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return reject(413, "payload_too_large");
  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return reject(400, "invalid_json");
  }

  // Bot traps first: a hidden field humans leave empty, and a minimum time on the form.
  if (typeof body.website === "string" ? body.website.trim() !== "" : body.website != null) return reject(400, "spam_suspected");
  const elapsed = Number(body.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < INQUIRY_MIN_FILL_MS) return reject(400, "too_fast");

  const checked = validateInquiry(body);
  if (!checked.ok) return reject(400, "invalid_field", { field: checked.field });
  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  if (!token || token.length > 2048) return reject(400, "turnstile_missing");

  if (!env.DB || !env.TURNSTILE_SECRET) return reject(503, "not_configured");
  const db = env.DB;
  const ip = request.headers.get("cf-connecting-ip");
  const now = deps.now();

  // Rate limit per hashed IP. Every attempt that reaches this point counts.
  try {
    const ipHash = await hashIp(ip ?? "unknown", env.IP_HASH_SALT || env.TURNSTILE_SECRET);
    const row = await db.prepare("SELECT COUNT(*) AS n FROM rate_events WHERE ip_hash = ?1 AND created_at > ?2").bind(ipHash, now - INQUIRY_RATE_LIMIT.windowMs).first<{ n: number }>();
    if ((row?.n ?? 0) >= INQUIRY_RATE_LIMIT.max) return reject(429, "rate_limited");
    await db.prepare("INSERT INTO rate_events (ip_hash, created_at) VALUES (?1, ?2)").bind(ipHash, now).run();
  } catch {
    return reject(500, "storage_failed", { stage: "rate_limit" });
  }

  const turnstileError = await verifyTurnstile(token, ip, env.TURNSTILE_SECRET, url.hostname, deps);
  if (turnstileError) return reject(turnstileError === "turnstile_unavailable" ? 502 : 403, turnstileError);

  const v = checked.value;
  const receivedAt = new Date(now).toISOString();
  const emailStatus = env.EMAIL ? "pending" : "disabled";
  let ref = "";
  for (let attempt = 0; attempt < 3 && !ref; attempt++) {
    const candidate = newRef();
    try {
      await db
        .prepare("INSERT INTO inquiries (ref, created_at, locale, topic, name, email, company, message, email_status) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)")
        .bind(candidate, receivedAt, v.locale, v.topic || null, v.name, v.email, v.company || null, v.message, emailStatus)
        .run();
      ref = candidate;
    } catch (error) {
      // Retry only on a ref collision; anything else is a storage failure.
      if (!/UNIQUE/i.test(String(error))) break;
    }
  }
  if (!ref) return reject(500, "storage_failed", { stage: "insert" });

  let notified = false;
  if (env.EMAIL) {
    let status = "failed";
    try {
      await env.EMAIL.send(notificationEmail(ref, v, receivedAt));
      status = "sent";
      notified = true;
    } catch {
      deps.log({ event: "inquiry_notify_failed" });
    }
    try {
      await db.prepare("UPDATE inquiries SET email_status = ?1, notified_at = ?2 WHERE ref = ?3").bind(status, notified ? new Date(deps.now()).toISOString() : null, ref).run();
    } catch { /* the inquiry itself is stored */ }
  }

  // Housekeeping: drop expired rate-limit events and inquiries past the retention period.
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - INQUIRY_RETENTION_MONTHS);
  const purge = Promise.all([
    db.prepare("DELETE FROM rate_events WHERE created_at < ?1").bind(now - RATE_EVENT_RETENTION_HOURS * 3600 * 1000).run(),
    db.prepare("DELETE FROM inquiries WHERE created_at < ?1").bind(cutoff.toISOString()).run(),
  ]).catch(() => deps.log({ event: "inquiry_purge_failed" }));
  if (waitUntil) waitUntil(purge); else await purge;

  deps.log({ event: "inquiry_stored", notified });
  return json(200, { ok: true, ref });
}

export const defaultDeps: Deps = {
  fetch: (...args) => fetch(...args),
  now: () => Date.now(),
  log: event => console.log(JSON.stringify(event)),
};

export const onRequest = (context: PagesContext) => handleInquiry(context.request, context.env, defaultDeps, context.waitUntil?.bind(context));
