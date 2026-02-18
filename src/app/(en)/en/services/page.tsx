import { content } from "@/lib/content";
import ServiceIcon from "@/components/ServiceIcon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | KAI Inc.",
};

export default function ServicesPageEn() {
  const t = content.en.services;
  const overview = content.en.servicesOverview;

  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            {t.title}
          </h1>
          <p className="text-ink-muted">{t.note}</p>
        </div>
      </section>

      {/* Service cards */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 md:grid-cols-2">
            {overview.items.map((item, i) => {
              const section = t.sections[i];
              return (
                <div key={item.title} className="rounded-2xl bg-surface-card p-8">
                  <ServiceIcon name={item.icon} />
                  <h2 className="mt-6 mb-2 text-lg font-bold">{section.title}</h2>
                  {section.desc && (
                    <p className="mb-4 text-sm leading-relaxed text-ink-muted">
                      {section.desc}
                    </p>
                  )}
                  {"items" in section && section.items && (
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-ink-muted">
                          <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
