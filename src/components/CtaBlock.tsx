import Link from "next/link";
import type { Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";
import { offerLines } from "@/lib/offer";

/** The single primary conversion action, repeated at each decision point. */
export default function CtaBlock({ locale, topic, headingId }: { locale: Locale; topic?: string; headingId?: string }) {
  const m = marketing[locale];
  const prefix = locale === "en" ? "/en" : "";
  const href = `${prefix}/contact${topic ? `?topic=${topic}` : ""}`;
  const offers = offerLines(locale);
  return (
    <section className="site-section final-cta" aria-labelledby={headingId}>
      <div>
        <p className="eyebrow">{m.ctaLabel}</p>
        <h2 id={headingId}>{m.ctaTitle}</h2>
        <p className="section-intro">{m.ctaDesc}</p>
        <ul className="reassurance" aria-label={m.reassuranceLabel}>{[...offers, ...m.reassurance].map(item => <li key={item}>{item}</li>)}</ul>
      </div>
      <Link href={href} className="button-primary">{m.primaryCta}<span aria-hidden="true">→</span></Link>
    </section>
  );
}
