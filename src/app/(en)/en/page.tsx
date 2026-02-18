import Link from "next/link";
import { content } from "@/lib/content";

export default function HomePageEn() {
  const t = content.en;

  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="mb-6 text-2xl font-bold leading-tight text-navy md:text-3xl">
            {t.hero.headline}
          </h1>
          <p className="mb-2 text-base text-gray-sub">{t.hero.sub1}</p>
          {t.hero.sub2 && (
            <p className="mb-2 text-base text-gray-sub">{t.hero.sub2}</p>
          )}
          <p className="mb-8 text-base text-gray-sub">{t.hero.sub3}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/en/services"
              className="inline-block rounded border border-blue-accent bg-blue-accent px-6 py-3 text-center text-sm font-medium text-white hover:bg-blue-muted"
            >
              {t.hero.cta1}
            </Link>
            <Link
              href="/en/contact"
              className="inline-block rounded border border-blue-accent px-6 py-3 text-center text-sm font-medium text-blue-accent hover:bg-gray-light"
            >
              {t.hero.cta2}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="border-t border-gray-border bg-gray-light py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-xl font-bold text-navy">
            {t.servicesOverview.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {t.servicesOverview.items.map((item) => (
              <div
                key={item.title}
                className="rounded border border-gray-border bg-white p-6"
              >
                <h3 className="mb-2 font-bold text-navy">{item.title}</h3>
                <p className="text-sm text-gray-sub">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="border-t border-gray-border bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-xl font-bold text-navy">
            {t.strengths.title}
          </h2>
          <ul className="space-y-3">
            {t.strengths.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-gray-sub"
              >
                <span className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-blue-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
