import { content } from "@/lib/content";
import FadeIn from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | 株式会社KAI",
};

export default function ContactPage() {
  const t = content.ja.contact;

  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <FadeIn>
            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
              {t.title}
            </h1>
            <p className="text-ink-muted">{t.subtitle}</p>
          </FadeIn>
        </div>
      </section>

      {/* Contact form */}
      <section className="pb-20">
        <div className="mx-auto max-w-xl px-6">
          <FadeIn delay={100}>
            <div className="rounded-2xl bg-surface-card p-8 shadow-sm">
              <form
                action="mailto:info@kaikk.co.jp"
                method="POST"
                encType="text/plain"
                className="space-y-5"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {t.fields.companyName}
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    className="w-full rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-ink-muted/40 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {t.fields.contactPerson}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-ink-muted/40 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {t.fields.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-ink-muted/40 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {t.fields.message}
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    className="w-full rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-ink-muted/40 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-press w-full rounded-full bg-primary px-8 py-3 text-sm font-medium text-white shadow-md hover:bg-primary-hover hover:shadow-lg"
                >
                  {t.submit}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-ink-muted">
                Email:{" "}
                <a
                  href="mailto:info@kaikk.co.jp"
                  className="text-primary transition-colors hover:text-primary-hover hover:underline"
                >
                  info@kaikk.co.jp
                </a>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
