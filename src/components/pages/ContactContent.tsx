"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { content, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";
import { offerLines } from "@/lib/offer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildInquiry, CONTACT_EMAIL, topicFromSearch, type Inquiry } from "@/lib/inquiry";
import { INQUIRY_ENDPOINT, INQUIRY_LIMITS, TURNSTILE_ACTION, TURNSTILE_SITEKEY } from "@/lib/inquiry-rules";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
type Phase = "idle" | "sending" | "sent" | "failed" | "email";
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TURNSTILE_SCRIPT_ID = "cf-turnstile-api";

/**
 * Contact form. With JavaScript it sends to /api/inquiry (Pages Function: Turnstile, D1).
 * It says "sent" only after the API answers {ok:true, ref}. Any failure, and the
 * no-JS form (mailto POST), fall back to an email draft so no inquiry is lost.
 */
export default function ContactContent({ locale }: { locale: Locale }) {
  const t = content[locale].contact;
  const m = marketing[locale];
  const prefix = locale === "en" ? "/en" : "";
  const [values, setValues] = useState<Inquiry>({ company: "", name: "", email: "", message: "" });
  const [topic, setTopic] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [failure, setFailure] = useState("");
  const [ref, setRef] = useState("");
  const [panels, setPanels] = useState(0);
  const [captcha, setCaptcha] = useState<"loading" | "ready" | "error">("loading");
  const [previewOpen, setPreviewOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const widgetBox = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const token = useRef("");
  const shownAt = useRef(0);
  const topicLabel = m.topics.find(item => item.value === topic)?.label ?? "";
  const draft = buildInquiry({ ...values, topic: topicLabel }, locale);
  const offers = offerLines(locale);

  // Links such as /contact?topic=generative-ai preselect the topic. Read after hydration: the page is statically exported.
  useEffect(() => {
    shownAt.current = Date.now();
    const preset = topicFromSearch(window.location.search, m.topics.map(item => item.value));
    if (preset) setTopic(preset);
  }, [m.topics]);

  // Cloudflare Turnstile: loaded only on the contact pages, rendered explicitly into our container.
  useEffect(() => {
    const w = window as unknown as { turnstile?: TurnstileApi };
    let cancelled = false;
    const render = () => {
      const box = widgetBox.current;
      if (cancelled || !box || !w.turnstile || widgetId.current) return;
      widgetId.current = w.turnstile.render(box, {
        sitekey: TURNSTILE_SITEKEY,
        action: TURNSTILE_ACTION,
        language: locale,
        theme: "light",
        size: box.offsetWidth < 300 ? "compact" : "normal",
        "refresh-expired": "auto",
        callback: (value: string) => { token.current = value; setCaptcha("ready"); },
        "expired-callback": () => { token.current = ""; setCaptcha("loading"); },
        "error-callback": () => { token.current = ""; setCaptcha("error"); },
      });
    };
    const fail = () => { if (!cancelled) setCaptcha("error"); };
    // If the script never arrives (blocked, offline), the email fallback takes over.
    const timer = window.setTimeout(() => { if (!w.turnstile) fail(); }, 15000);
    let script: HTMLScriptElement | null = null;
    if (w.turnstile) render();
    else {
      script = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
      script.addEventListener("error", fail);
    }
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      script?.removeEventListener("load", render);
      script?.removeEventListener("error", fail);
      if (widgetId.current && w.turnstile) w.turnstile.remove(widgetId.current);
      widgetId.current = undefined;
      token.current = "";
    };
  }, [locale]);

  // Move focus to the result so keyboard and screen-reader users reach it.
  useEffect(() => { if (panels > 0) panelRef.current?.focus(); }, [panels]);
  useEffect(() => { if (phase === "sent") sentRef.current?.focus(); }, [phase]);

  function showEmailFallback(reason: string) {
    setFailure(reason);
    setPhase("failed");
    setStatus(m.sendFailed);
    setPanels(count => count + 1);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase === "sending") return;
    if (!token.current) {
      if (captcha === "error") showEmailFallback("captcha_unavailable");
      else setStatus(m.verifyWait);
      return;
    }
    setPhase("sending");
    setStatus(m.sending);
    try {
      const res = await fetch(INQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, topic, locale, website, elapsedMs: Date.now() - shownAt.current, turnstileToken: token.current }),
        signal: AbortSignal.timeout(20000),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; ref?: string; error?: string } | null;
      if (res.ok && data?.ok === true && typeof data.ref === "string") {
        setRef(data.ref);
        setStatus("");
        setPhase("sent");
        return;
      }
      showEmailFallback(data?.error ?? `http_${res.status}`);
    } catch {
      showEmailFallback("network");
    } finally {
      // Turnstile tokens are single-use.
      token.current = "";
      const w = window as unknown as { turnstile?: TurnstileApi };
      if (widgetId.current && w.turnstile) { w.turnstile.reset(widgetId.current); setCaptcha("loading"); }
    }
  }

  function sendByEmail() {
    setFailure("");
    setPhase("email");
    setStatus(m.draftReady);
    setPanels(count => count + 1);
    // The visitor completes sending in their own mail client. Never claim delivery.
    window.location.href = draft.href;
  }

  async function copy() {
    try { await navigator.clipboard.writeText(`${CONTACT_EMAIL}\n${draft.subject}\n\n${draft.body}`); setStatus(m.copied); }
    catch { setPreviewOpen(true); setStatus(m.copyFailed); }
  }

  const field = (key: "company" | "name" | "email", label: string, type: string, autoComplete: string, required: boolean) => (
    <div key={key}>
      <label htmlFor={`inquiry-${key}`}>{label}<span className={required ? "field-required" : "field-optional"}>{required ? m.required : m.optional}</span></label>
      <input id={`inquiry-${key}`} name={key} type={type} required={required} autoComplete={autoComplete} maxLength={INQUIRY_LIMITS[key]} value={values[key]} onChange={event => setValues({ ...values, [key]: event.target.value })} />
    </div>
  );

  return (
    <>
      <Breadcrumbs locale={locale} trail={[{ name: t.title, path: "/contact" }]} />
      <section className="page-heading site-width"><p className="eyebrow">{m.ctaLabel}</p><h1>{t.title}</h1><p>{m.contactIntro}</p></section>
      {offers.length > 0 && <ul className="reassurance site-width">{offers.map(line => <li key={line}>{line}</li>)}</ul>}
      <section className="contact-layout site-width" aria-label={t.title}>
        <div>
          {phase === "sent" ? (
            <div className="sent-panel" ref={sentRef} tabIndex={-1}>
              <h2>{m.sentTitle}</h2>
              <p className="sent-ref">{m.sentRef}: <strong>{ref}</strong></p>
              <p>{m.sentBody}</p>
              <p className="field-hint">{m.sentHelp}</p>
            </div>
          ) : (
            <form className="inquiry-form" action={`mailto:${CONTACT_EMAIL}`} method="POST" encType="text/plain" onSubmit={submit} aria-busy={phase === "sending"}>
              {field("company", t.fields.companyName, "text", "organization", false)}
              {field("name", t.fields.contactPerson, "text", "name", true)}
              {field("email", t.fields.email, "email", "email", true)}
              <fieldset className="topic-field">
                <legend>{m.topicLabel}<span className="field-optional">{m.optional}</span></legend>
                <div className="topic-options">
                  {m.topics.map(item => (
                    <label key={item.value} className="topic-option">
                      <input type="radio" name="topic" value={item.label} checked={topic === item.value} onChange={() => setTopic(item.value)} />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="inquiry-message">{t.fields.message}<span className="field-required">{m.required}</span></label>
                <p className="field-hint" id="inquiry-message-hint">{m.messageHint}</p>
                <textarea id="inquiry-message" name="message" rows={6} required maxLength={INQUIRY_LIMITS.message} aria-describedby="inquiry-message-hint" placeholder={m.messagePlaceholder} value={values.message} onChange={event => setValues({ ...values, message: event.target.value })} />
              </div>
              {/* Honeypot: hidden from people and assistive technology; bots that fill every field are rejected. */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="inquiry-website">Website</label>
                <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} />
              </div>
              <div className="turnstile-field">
                <p className="field-hint">{m.verifyNote}</p>
                <div ref={widgetBox} className="turnstile-box" />
              </div>
              <p className="form-notice" id="inquiry-notice">
                {m.consent[0]}<Link className="inline-link" href={`${prefix}/privacy`}>{m.consent[1]}</Link>{m.consent[2]} {m.contactPrivacy}
              </p>
              <noscript><p className="form-notice">{m.noScript}</p></noscript>
              <div className="form-actions">
                <button className="button-primary" type="submit" aria-describedby="inquiry-notice" disabled={phase === "sending"}>{phase === "sending" ? m.sending : m.submit}<span aria-hidden="true">→</span></button>
                <button className="text-link" type="button" onClick={sendByEmail}>{m.mailInstead}</button>
              </div>
            </form>
          )}
          <p role="status" className="form-status">{status}</p>
          {(phase === "failed" || phase === "email") && (
            <div className="draft-panel" ref={panelRef} tabIndex={-1} data-failure={failure || undefined}>
              <p className="draft-panel-title">{phase === "failed" ? m.failTitle : m.notSent}</p>
              {phase === "failed" && <p>{failure === "rate_limited" ? `${m.failRate} ` : ""}{m.failIntro}</p>}
              <div className="draft-links">
                {phase === "failed" && <a className="text-link" href={draft.href}>{m.openEmail}<span aria-hidden="true">↗</span></a>}
                <button className="text-link" type="button" onClick={copy}>{m.copy}</button>
              </div>
              <p>{m.webmailIntro}</p>
              <div className="draft-links">
                <a className="text-link" href={draft.gmailHref} target="_blank" rel="noopener noreferrer">{m.gmail}<span aria-hidden="true">↗</span></a>
                <a className="text-link" href={draft.outlookHref} target="_blank" rel="noopener noreferrer">{m.outlook}<span aria-hidden="true">↗</span></a>
              </div>
              <details className="draft-preview" open={previewOpen} onToggle={event => setPreviewOpen(event.currentTarget.open)}><summary>{m.preview}</summary><pre>{`To: ${CONTACT_EMAIL}\n${draft.subject}\n\n${draft.body}`}</pre></details>
            </div>
          )}
        </div>
        <aside className="contact-guide">
          <h2>{m.nextTitle}</h2>
          <ol>{m.nextSteps.map(step => <li key={step}>{step}</li>)}</ol>
          <p className="contact-direct">{locale === "ja" ? "メールで直接ご連絡いただくこともできます。" : "You can also email us directly."}</p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </aside>
      </section>
    </>
  );
}
