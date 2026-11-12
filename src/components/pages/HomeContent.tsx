import Link from "next/link";
import { content, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";
import { solutions, solutionSlugs } from "@/lib/solutions";
import { faqJsonLd } from "@/lib/site";
import Expertise from "@/components/Expertise";
import CtaBlock from "@/components/CtaBlock";
import HeroPhoto from "@/components/HeroPhoto";
import JsonLd from "@/components/JsonLd";

export default function HomeContent({ locale }: { locale: Locale }) {
  const t = content[locale];
  const m = marketing[locale];
  const s = solutions[locale];
  const prefix = locale === "en" ? "/en" : "";
  return (
    <>
      <JsonLd data={faqJsonLd(m.faqs)} />
      <section className="hero site-width" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">{m.eyebrow}</p>
          <h1 id="home-title">{m.headline}</h1>
          <p className="hero-intro">{m.intro}</p>
          <div className="hero-actions">
            <Link href={`${prefix}/contact`} className="button-primary" data-primary-cta>{m.primaryCta}<span aria-hidden="true">→</span></Link>
            <Link href={`${prefix}/services`} className="text-link">{t.hero.cta1}<span aria-hidden="true">→</span></Link>
          </div>
          <ul className="reassurance hero-reassurance" aria-label={m.reassuranceLabel}>{m.reassurance.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
        <HeroPhoto alt={m.photoAlt} />
      </section>
      <ul className="company-facts site-width">
        {m.facts.map(fact => (
          <li key={fact.value}>
            <p>{fact.value}</p>
            {"href" in fact ? <a href={fact.href} target="_blank" rel="noopener noreferrer">{fact.label}<span aria-hidden="true">{"\u00a0↗"}</span></a> : <span>{fact.label}</span>}
          </li>
        ))}
      </ul>
      <section className="site-section services-section" aria-labelledby="services-title">
        <div className="services-intro">
          <p className="eyebrow">{m.servicesLabel}</p>
          <h2 id="services-title">{m.servicesTitle}</h2>
          <p className="section-intro">{m.servicesIntro}</p>
          <Link className="text-link" href={`${prefix}/services`}>{t.hero.cta1}<span aria-hidden="true">→</span></Link>
        </div>
        <div className="service-list">
          {t.servicesOverview.items.map((item, i) => (
            <Link href={`${prefix}/services#service-${i + 1}`} className="service-row" key={item.title}>
              <div><h3>{item.title}</h3><p>{m.examples[i]}</p></div>
              <span className="service-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="site-section solutions-section" aria-labelledby="solutions-title">
        <div className="section-heading">
          <p className="eyebrow">{m.solutionsLabel}</p>
          <div><h2 id="solutions-title">{m.solutionsTitle}</h2><p className="section-intro">{m.solutionsIntro}</p></div>
        </div>
        <ul className="solution-cards">
          {solutionSlugs.map(slug => (
            <li key={slug}>
              <Link href={`${prefix}/solutions/${slug}`} className="solution-card">
                <h3>{s[slug].title}</h3>
                <p>{s[slug].summary}</p>
                <span className="solution-card-link">{m.solutionsLink}<span aria-hidden="true"> →</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Expertise locale={locale} />
      <section className="site-section approach" aria-labelledby="approach-title">
        <div className="section-heading">
          <p className="eyebrow">{m.approachLabel}</p>
          <div><h2 id="approach-title">{m.approachTitle}</h2><p className="section-intro">{m.approachIntro}</p></div>
        </div>
        <ol className="approach-steps">
          {m.stages.map((step, i) => <li key={step.title}><span className="step-number">{i + 1}</span><h3>{step.title}</h3><p>{step.desc}</p></li>)}
        </ol>
        <div className="inline-actions">
          <Link className="button-primary" href={`${prefix}/contact`}>{m.primaryCta}<span aria-hidden="true">→</span></Link>
          <Link className="text-link" href={`${prefix}/process`}>{m.processLink}<span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="site-section faq-section" aria-labelledby="faq-title">
        <div><p className="eyebrow">{m.faqLabel}</p><h2 id="faq-title">{m.faqTitle}</h2></div>
        <div className="faq-list">{m.faqs.map(faq => <details key={faq.q}><summary>{faq.q}<span aria-hidden="true">+</span></summary><p>{faq.a}</p></details>)}</div>
      </section>
      <CtaBlock locale={locale} headingId="contact-title" />
    </>
  );
}
