import Link from "next/link";
import { content, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";
import { solutions, solutionSlugs, type SolutionSlug } from "@/lib/solutions";
import { faqJsonLd, serviceJsonLd } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";

export default function SolutionContent({ locale, slug }: { locale: Locale; slug: SolutionSlug }) {
  const s = solutions[locale][slug];
  const m = marketing[locale];
  const prefix = locale === "en" ? "/en" : "";
  const path = `/solutions/${slug}`;
  const ja = locale === "ja";
  return (
    <>
      <JsonLd data={serviceJsonLd(locale, [{ name: s.title, description: s.description, serviceType: s.serviceType, path }])} />
      <JsonLd data={faqJsonLd(s.faqs)} />
      <Breadcrumbs locale={locale} trail={[{ name: content[locale].nav.services, path: "/services" }, { name: s.title, path }]} />
      <section className="page-heading site-width">
        <p className="eyebrow">{m.solutionsLabel}</p>
        <h1>{s.title}</h1>
        <p>{s.lead}</p>
        <div className="hero-actions"><Link href={`${prefix}/contact?topic=${slug}`} className="button-primary" data-primary-cta>{m.primaryCta}<span aria-hidden="true">→</span></Link></div>
      </section>
      <section className="site-section solution-block" aria-labelledby="concerns-title">
        <h2 id="concerns-title">{s.concernsTitle}</h2>
        <ul className="check-list">{s.concerns.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="site-section solution-block" aria-labelledby="examples-title">
        <h2 id="examples-title">{s.examplesTitle}</h2>
        <ul className="plain-list">{s.examples.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="site-section approach" aria-labelledby="steps-title">
        <h2 id="steps-title">{s.stepsTitle}</h2>
        <ol className="approach-steps">{s.steps.map((step, i) => <li key={step.title}><span className="step-number">{i + 1}</span><h3>{step.title}</h3><p>{step.desc}</p></li>)}</ol>
        <div className="deliverable"><p className="eyebrow">{s.deliverablesTitle}</p><ul>{s.deliverables.map(item => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <section className="site-section solution-block" aria-labelledby="cautions-title">
        <h2 id="cautions-title">{s.cautionsTitle}</h2>
        <ul className="plain-list">{s.cautions.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="proof-note">{ja ? "KAI株式会社は2026年設立のため、公開できる導入事例はまだありません。代表者の技術的な経歴は" : "KAI Inc. was founded in 2026 and has no published client case studies yet. Our founder’s technical background is described on the "}<Link className="inline-link" href={`${prefix}/company`}>{ja ? "会社概要" : "company page"}</Link>{ja ? "でご紹介しています。" : "."}</p>
      </section>
      <section className="site-section faq-section" aria-labelledby="faq-title">
        <div><p className="eyebrow">{m.faqLabel}</p><h2 id="faq-title">{m.faqTitle}</h2></div>
        <div className="faq-list">{s.faqs.map(faq => <details key={faq.q}><summary>{faq.q}<span aria-hidden="true">+</span></summary><p>{faq.a}</p></details>)}</div>
      </section>
      <nav className="site-section related-solutions" aria-labelledby="related-title">
        <h2 id="related-title">{ja ? "その他のご相談" : "Related topics"}</h2>
        <ul>{solutionSlugs.filter(other => other !== slug).map(other => <li key={other}><Link className="text-link" href={`${prefix}/solutions/${other}`}>{solutions[locale][other].title}<span aria-hidden="true">→</span></Link></li>)}<li><Link className="text-link" href={`${prefix}/services`}>{content[locale].nav.services}<span aria-hidden="true">→</span></Link></li></ul>
      </nav>
      <CtaBlock locale={locale} topic={slug} headingId="solution-cta" />
    </>
  );
}
