import Link from "next/link";
import { content, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";
import Expertise from "@/components/Expertise";

export default function HomeContent({ locale }: { locale: Locale }) {
  const t = content[locale];
  const m = marketing[locale];
  const prefix = locale === "en" ? "/en" : "";
  return (
    <>
      <section className="hero site-width" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">{m.eyebrow}</p>
          <h1 id="home-title">{m.headline}</h1>
          <p className="hero-intro">{m.intro}</p>
          <div className="hero-actions">
            <Link href={`${prefix}/contact`} className="button-primary" data-primary-cta>{t.nav.contact}<span aria-hidden="true">↗</span></Link>
            <Link href={`${prefix}/services`} className="text-link">{t.hero.cta1}<span aria-hidden="true">→</span></Link>
          </div>
          <p className="hero-location">{m.location}</p>
        </div>
        <figure className="hero-photo">
          {/* A city-context photograph, not a representation of KAI’s office. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/tokyo.jpg" alt={m.photoAlt} width="1400" height="933" fetchPriority="high" />
          <figcaption>Tokyo, Japan</figcaption>
        </figure>
      </section>
      <div className="company-facts site-width">
        {m.facts.map(fact => <div key={fact.value}><p>{fact.value}</p><span>{fact.label}</span></div>)}
      </div>
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
      <Expertise locale={locale} />
      <section className="site-section approach" aria-labelledby="approach-title">
        <div className="section-heading">
          <p className="eyebrow">{m.approachLabel}</p>
          <div><h2 id="approach-title">{m.approachTitle}</h2><p className="section-intro">{m.approachIntro}</p></div>
        </div>
        <ol className="approach-steps">
          {m.stages.map((step, i) => <li key={step.title}><span className="step-number">{i + 1}</span><h3>{step.title}</h3><p>{step.desc}</p></li>)}
        </ol>
        <Link className="text-link" href={`${prefix}/process`}>{m.processLink}<span aria-hidden="true">→</span></Link>
      </section>
      <section className="site-section faq-section" aria-labelledby="faq-title">
        <div><p className="eyebrow">{m.faqLabel}</p><h2 id="faq-title">{m.faqTitle}</h2></div>
        <div className="faq-list">{m.faqs.map(faq => <details key={faq.q}><summary>{faq.q}<span aria-hidden="true">+</span></summary><p>{faq.a}</p></details>)}</div>
      </section>
      <section className="site-section final-cta" aria-labelledby="contact-title">
        <div><p className="eyebrow">{m.ctaLabel}</p><h2 id="contact-title">{m.ctaTitle}</h2><p className="section-intro">{m.ctaDesc}</p></div>
        <Link href={`${prefix}/contact`} className="button-primary">{t.nav.contact}<span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
