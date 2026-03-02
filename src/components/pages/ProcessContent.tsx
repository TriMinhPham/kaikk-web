import Link from "next/link";
import { content, Locale } from "@/lib/content";
import FadeIn from "@/components/FadeIn";

export default function ProcessContent({ locale }: { locale: Locale }) {
  const t = content[locale].process;
  const prefix = locale === "en" ? "/en" : "";

  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <FadeIn>
            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
              {t.title}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-0">
            {t.steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 80}>
                <div className="flex gap-6">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {step.num}
                    </div>
                    {i < t.steps.length - 1 && (
                      <div className="w-px grow bg-edge" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-12">
                    <p className="text-sm font-medium text-primary">
                      Step {step.num}
                    </p>
                    <h3 className="mt-1 text-xl font-bold">{step.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-8 text-center">
              <Link
                href={`${prefix}/contact`}
                className="btn-press inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white shadow-md hover:bg-primary-hover hover:shadow-lg"
              >
                {content[locale].hero.cta2}
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
