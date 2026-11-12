/**
 * Rules shared by the contact form (browser) and the inquiry API
 * (`functions/api/inquiry.ts`, Cloudflare Pages Function). No imports, so the
 * same file runs in Next.js, in the Workers runtime and under `node --test`.
 */

/** The only address that ever receives inquiry notifications. Visitors cannot change it. */
export const INQUIRY_NOTIFY_TO = "info@kaikk.jp";
/** Sender for notifications once Cloudflare Email Service is enabled (see docs/inquiry-backend.md). */
export const INQUIRY_NOTIFY_FROM = "inquiry@kaikk.jp";

/** Fixed topic values. Labels live in src/lib/marketing.ts. */
export const INQUIRY_TOPICS = ["ai-adoption", "business-automation", "generative-ai", "web", "other"] as const;
export type InquiryTopic = (typeof INQUIRY_TOPICS)[number];

/** Character limits (UTF-16 code units, as counted by the browser's maxLength). */
export const INQUIRY_LIMITS = { name: 160, company: 160, email: 254, message: 3000 } as const;

/** Submissions faster than this after the form was shown are treated as automated. */
export const INQUIRY_MIN_FILL_MS = 3000;

/** At most this many submission attempts per hashed IP address per window. */
export const INQUIRY_RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 } as const;

/**
 * Retention. NEEDS FOUNDER APPROVAL: inquiries are deleted this many months
 * after the last contact. The privacy policy pages render this number, and the
 * API deletes stored inquiries older than this (counted from receipt, which is
 * never later than the last contact).
 */
export const INQUIRY_RETENTION_MONTHS = 24;
/** Hashed IP addresses used only for rate limiting are kept this long. */
export const RATE_EVENT_RETENTION_HOURS = 24;

/** Cloudflare Turnstile site key (public). Widget: managed mode, kaikk.jp / www.kaikk.jp / kaikk-jp.pages.dev. */
export const TURNSTILE_SITEKEY = "0x4AAAAAAF9puhYoA_2XeJzt";
export const TURNSTILE_ACTION = "inquiry";
export const INQUIRY_ENDPOINT = "/api/inquiry";
