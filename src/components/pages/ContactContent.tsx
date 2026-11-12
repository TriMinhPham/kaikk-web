"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { content, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";
import { offerLines } from "@/lib/offer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildInquiry, CONTACT_EMAIL, topicFromSearch, type Inquiry } from "@/lib/inquiry";

export default function ContactContent({ locale }: { locale: Locale }) {
  const t = content[locale].contact;
  const m = marketing[locale];
  const [values, setValues] = useState<Inquiry>({ company: "", name: "", email: "", message: "" });
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("");
  const [drafts, setDrafts] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const topicLabel = m.topics.find(item => item.value === topic)?.label ?? "";
  const draft = buildInquiry({ ...values, topic: topicLabel }, locale);
  const offers = offerLines(locale);

  // Links such as /contact?topic=generative-ai preselect the topic. Read after hydration: the page is statically exported.
  useEffect(() => {
    const preset = topicFromSearch(window.location.search, m.topics.map(item => item.value));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL, unavailable during static prerender
    if (preset) setTopic(preset);
  }, [m.topics]);

  // After each draft, move focus to the "not sent yet" panel so keyboard users reach the webmail fallbacks.
  useEffect(() => { if (drafts > 0) panelRef.current?.focus(); }, [drafts]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDrafts(count => count + 1);
    setStatus(m.draftReady);
    // The visitor must complete sending in their own mail client. Never claim delivery.
    window.location.href = draft.href;
  }
  async function copy() {
    try { await navigator.clipboard.writeText(`${CONTACT_EMAIL}\n${draft.subject}\n\n${draft.body}`); setStatus(m.copied); }
    catch { setPreviewOpen(true); setStatus(m.copyFailed); }
  }
  const field = (key: "company" | "name" | "email", label: string, type: string, autoComplete: string, required: boolean) => (
    <div key={key}>
      <label htmlFor={`inquiry-${key}`}>{label}<span className={required ? "field-required" : "field-optional"}>{required ? m.required : m.optional}</span></label>
      <input id={`inquiry-${key}`} name={key} type={type} required={required} autoComplete={autoComplete} maxLength={key === "email" ? 254 : 160} value={values[key]} onChange={event => setValues({ ...values, [key]: event.target.value })} />
    </div>
  );
  return (
    <>
      <Breadcrumbs locale={locale} trail={[{ name: t.title, path: "/contact" }]} />
      <section className="page-heading site-width"><p className="eyebrow">{m.ctaLabel}</p><h1>{t.title}</h1><p>{m.contactIntro}</p></section>
      {offers.length > 0 && <ul className="reassurance site-width">{offers.map(line => <li key={line}>{line}</li>)}</ul>}
      <section className="contact-layout site-width" aria-label={t.title}>
        <div>
          <form className="inquiry-form" action={`mailto:${CONTACT_EMAIL}`} method="POST" encType="text/plain" onSubmit={submit}>
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
              <textarea id="inquiry-message" name="message" rows={6} required maxLength={3000} aria-describedby="inquiry-message-hint" placeholder={m.messagePlaceholder} value={values.message} onChange={event => setValues({ ...values, message: event.target.value })} />
            </div>
            <p className="form-notice" id="inquiry-notice">{m.contactPrivacy}</p>
            <div className="form-actions"><button className="button-primary" type="submit" aria-describedby="inquiry-notice">{m.openEmail}<span aria-hidden="true">↗</span></button><button className="text-link" type="button" onClick={copy}>{m.copy}</button></div>
          </form>
          <p role="status" className="form-status">{status}</p>
          {drafts > 0 && (
            <div className="draft-panel" ref={panelRef} tabIndex={-1}>
              <p className="draft-panel-title">{m.notSent}</p>
              <p>{m.webmailIntro}</p>
              <div className="draft-links">
                <a className="text-link" href={draft.gmailHref} target="_blank" rel="noopener noreferrer">{m.gmail}<span aria-hidden="true">↗</span></a>
                <a className="text-link" href={draft.outlookHref} target="_blank" rel="noopener noreferrer">{m.outlook}<span aria-hidden="true">↗</span></a>
              </div>
            </div>
          )}
          <details className="draft-preview" open={previewOpen} onToggle={event => setPreviewOpen(event.currentTarget.open)}><summary>{m.preview}</summary><pre>{`To: ${CONTACT_EMAIL}\n${draft.subject}\n\n${draft.body}`}</pre></details>
          <noscript><p className="form-notice"><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p></noscript>
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
