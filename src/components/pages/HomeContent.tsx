import Link from "next/link";
import { content, Locale } from "@/lib/content";
import ServiceIcon from "@/components/ServiceIcon";
import FadeIn from "@/components/FadeIn";

export default function HomeContent({ locale }: { locale: Locale }) {
  const t = content[locale];
  const prefix = locale === "en" ? "/en" : "";

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-36">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <FadeIn>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-badge-bg px-4 py-1.5 text-xs font-medium tracking-wide text-badge-ink uppercase shadow-sm">
              {t.hero.badge}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="mx-auto mb-6 max-w-3xl whitespace-pre-line text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              {t.hero.headline}
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
              {t.hero.subtitle}
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`${prefix}/services`}
                className="btn-press inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-md hover:bg-primary-hover hover:shadow-lg"
              >
                {t.hero.cta1}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href={`${prefix}/contact`}
                className="btn-press inline-flex items-center gap-2 rounded-full border border-edge bg-surface-card px-8 py-3.5 text-sm font-medium text-ink shadow-sm hover:bg-surface hover:shadow-md"
              >
                {t.hero.cta2}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
              {t.servicesOverview.title}
            </h2>
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-2">
            {t.servicesOverview.items.map((item, i) => (
              <FadeIn key={item.title} delay={i * 100}>
                <div className="card-hover rounded-2xl bg-surface-card p-8 shadow-sm">
                  <ServiceIcon name={item.icon} />
                  <h3 className="mt-6 mb-2 text-lg font-bold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <div className="rounded-2xl bg-surface-card p-8 shadow-sm md:p-12">
              <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">
                {t.strengths.title}
              </h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {t.strengths.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-ink-muted">
                    <svg className="h-5 w-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn>
            <div className="overflow-hidden rounded-2xl bg-ink px-8 py-16 text-center text-white shadow-lg md:px-16 md:py-20">
              <h2 className="mx-auto mb-8 max-w-2xl whitespace-pre-line text-2xl font-bold leading-tight md:text-4xl">
                {t.cta.headline}
              </h2>
              <Link
                href={`${prefix}/contact`}
                className="btn-press inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-md hover:bg-primary-light hover:shadow-lg"
              >
                {t.cta.button}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
