import { content } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | KAI Inc.",
};

export default function ServicesPageEn() {
  const t = content.en.services;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-12 text-2xl font-bold text-navy">{t.title}</h1>

        <div className="space-y-12">
          {t.sections.map((section) => (
            <div
              key={section.title}
              className="border-b border-gray-border pb-10 last:border-b-0"
            >
              <h2 className="mb-3 text-lg font-bold text-navy">
                {section.title}
              </h2>
              {section.desc && (
                <p className="mb-4 text-sm text-gray-sub">{section.desc}</p>
              )}
              {"items" in section && section.items && (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-gray-sub"
                    >
                      <span className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-blue-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-gray-sub">{t.note}</p>
      </div>
    </section>
  );
}
