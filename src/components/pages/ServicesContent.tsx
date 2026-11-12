import Link from "next/link";
import { content, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";
import { solutions, solutionSlugs } from "@/lib/solutions";
import { serviceJsonLd } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";

export default function ServicesContent({ locale }: { locale: Locale }) {
  const t = content[locale].services;
  const m = marketing[locale];
  const s = solutions[locale];
  const prefix = locale === "en" ? "/en" : "";
  return (
    <>
      <JsonLd data={serviceJsonLd(locale, t.sections.map((section, i) => ({ name: section.title, description: section.desc || m.examples[i], path: `/services#service-${i + 1}` })))} />
      <Breadcrumbs locale={locale} trail={[{ name: t.title, path: "/services" }]} />
      <section className="page-heading site-width"><p className="eyebrow">{m.servicesLabel}</p><h1>{t.title}</h1><p>{m.servicesIntro}</p></section>
      <section className="site-width" aria-label={t.title}>
        {t.sections.map((section, i) => <article className="service-detail" id={`service-${i + 1}`} key={section.title}>
          <h2>{section.title}</h2>
          <div><p>{section.desc || m.examples[i]}</p>{"items" in section && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
            <div className="deliverable"><p className="eyebrow">{m.outputLabel}</p><p>{m.deliverables[i]}</p></div>
          </div>
        </article>)}
        <p className="form-notice">{t.note}</p>
      </section>
      <section className="site-section solutions-section" aria-labelledby="solutions-title">
        <div className="section-heading">
          <p className="eyebrow">{m.solutionsLabel}</p>
          <div><h2 id="solutions-title">{m.solutionsTitle}</h2><p className="section-intro">{m.solutionsIntro}</p></div>
        </div>
        <ul className="solution-cards">
          {solutionSlugs.map(slug => (
            <li key={slug}><Link href={`${prefix}/solutions/${slug}`} className="solution-card"><h3>{s[slug].title}</h3><p>{s[slug].summary}</p><span className="solution-card-link">{m.solutionsLink}<span aria-hidden="true"> →</span></span></Link></li>
          ))}
        </ul>
      </section>
      <CtaBlock locale={locale} headingId="services-cta" />
    </>
  );
}
