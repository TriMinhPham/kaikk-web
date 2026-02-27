import { content } from "@/lib/content";
import FadeIn from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company | KAI Inc.",
};

export default function CompanyPageEn() {
  const t = content.en.company;

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

      {/* Company info */}
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <FadeIn delay={100}>
            <div className="overflow-hidden rounded-2xl bg-surface-card shadow-sm">
              {t.rows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex flex-col gap-1 px-8 py-5 transition-colors hover:bg-surface/50 sm:flex-row sm:gap-8 ${
                    i < t.rows.length - 1 ? "border-b border-edge" : ""
                  }`}
                >
                  <dt className="w-44 shrink-0 text-sm font-medium text-ink-muted">
                    {row.label}
                  </dt>
                  <dd className="whitespace-pre-line text-sm">{row.value}</dd>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
