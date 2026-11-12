"use client";

import { useState, type FormEvent } from "react";
import { content, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";
import { buildInquiry, CONTACT_EMAIL, type Inquiry } from "@/lib/inquiry";

export default function ContactContent({ locale }: { locale: Locale }) {
  const t = content[locale].contact;
  const m = marketing[locale];
  const [values, setValues] = useState<Inquiry>({ company: "", name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const draft = buildInquiry(values, locale);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(m.draftReady);
    // The user must complete sending in their own mail client. Never claim delivery.
    window.location.href = draft.href;
  }
  async function copy() {
    try { await navigator.clipboard.writeText(draft.body); setStatus(m.copied); }
    catch { setPreviewOpen(true); setStatus(m.copyFailed); }
  }
  return (
    <>
      <section className="page-heading site-width"><p className="eyebrow">{m.ctaLabel}</p><h1>{t.title}</h1><p>{m.contactIntro}</p></section>
      <section className="contact-layout site-width">
        <aside className="contact-guide"><h2>{m.contactGuide}</h2><ul>{m.contactPoints.map(point => <li key={point}>{point}</li>)}</ul><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></aside>
        <div>
          <form className="inquiry-form" action={`mailto:${CONTACT_EMAIL}`} method="POST" encType="text/plain" onSubmit={submit}>
            {([
              { key: "company", label: t.fields.companyName, type: "text", autoComplete: "organization" },
              { key: "name", label: t.fields.contactPerson, type: "text", autoComplete: "name" },
              { key: "email", label: t.fields.email, type: "email", autoComplete: "email" },
            ] as const).map(field => <div key={field.key}><label htmlFor={`inquiry-${field.key}`}>{field.label}</label><input id={`inquiry-${field.key}`} name={field.key} type={field.type} required autoComplete={field.autoComplete} maxLength={field.key === "email" ? 254 : 160} value={values[field.key]} onChange={event => setValues({ ...values, [field.key]: event.target.value })} /></div>)}
            <div><label htmlFor="inquiry-message">{t.fields.message}</label><textarea id="inquiry-message" name="message" rows={6} required maxLength={3000} placeholder={m.messagePlaceholder} value={values.message} onChange={event => setValues({ ...values, message: event.target.value })} /></div>
            <p className="form-notice" id="inquiry-notice">{m.contactPrivacy}</p>
            <div className="form-actions"><button className="button-primary" type="submit" aria-describedby="inquiry-notice">{m.openEmail}<span aria-hidden="true">↗</span></button><button className="text-link" type="button" onClick={copy}>{m.copy}</button></div>
          </form>
          <p role="status" className="form-status">{status}</p>
          <details className="draft-preview" open={previewOpen} onToggle={event => setPreviewOpen(event.currentTarget.open)}><summary>{m.preview}</summary><pre>{draft.body}</pre></details>
          <noscript><p className="form-notice"><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p></noscript>
        </div>
      </section>
    </>
  );
}
