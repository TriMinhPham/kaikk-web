import Link from "next/link";
import { content, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";

export default function ServicesContent({ locale }: { locale: Locale }) {
  const t = content[locale].services;
  const m = marketing[locale];
  const prefix = locale === "en" ? "/en" : "";
  return (
    <>
      <section className="page-heading site-width"><p className="eyebrow">{m.servicesLabel}</p><h1>{t.title}</h1><p>{m.servicesIntro}</p></section>
      <section className="site-width">
        {t.sections.map((section, i) => <article className="service-detail" id={`service-${i + 1}`} key={section.title}>
          <h2>{section.title}</h2>
          <div><p>{section.desc || m.examples[i]}</p>{"items" in section && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
            <div className="deliverable"><p className="eyebrow">{m.outputLabel}</p><p>{m.deliverables[i]}</p></div>
          </div>
        </article>)}
        <p className="form-notice">{t.note}</p>
      </section>
      <section className="site-section final-cta"><div><p className="eyebrow">{m.ctaLabel}</p><h2>{m.ctaTitle}</h2><p className="section-intro">{m.ctaDesc}</p></div><Link href={`${prefix}/contact`} className="button-primary">{content[locale].nav.contact}<span aria-hidden="true">↗</span></Link></section>
    </>
  );
}
