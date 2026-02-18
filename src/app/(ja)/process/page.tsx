import Link from "next/link";
import { content } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "導入の流れ | 株式会社KAI",
};

export default function ProcessPage() {
  const t = content.ja.process;

  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            {t.title}
          </h1>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-0">
            {t.steps.map((step, i) => (
              <div key={step.num} className="flex gap-6">
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
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white hover:bg-primary-hover"
            >
              {content.ja.hero.cta2}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
