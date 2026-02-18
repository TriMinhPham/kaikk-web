import { content } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process | KAI Inc.",
};

export default function ProcessPageEn() {
  const t = content.en.process;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-12 text-2xl font-bold text-navy">{t.title}</h1>

        <div className="space-y-0">
          {t.steps.map((step, i) => (
            <div key={step.num} className="flex items-stretch gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-accent text-sm font-bold text-white">
                  {step.num}
                </div>
                {i < t.steps.length - 1 && (
                  <div className="w-px grow bg-gray-border" />
                )}
              </div>
              <div className="pb-10">
                <p className="pt-2 text-base font-medium text-navy">
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
