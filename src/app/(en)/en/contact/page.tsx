import { content } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | KAI Inc.",
};

export default function ContactPageEn() {
  const t = content.en.contact;

  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            {t.title}
          </h1>
          <p className="text-ink-muted">{t.subtitle}</p>
        </div>
      </section>

      {/* Contact form */}
      <section className="pb-20">
        <div className="mx-auto max-w-xl px-6">
          <div className="rounded-2xl bg-surface-card p-8">
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
                  className="w-full rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                  className="w-full rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                  className="w-full rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                  className="w-full rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-hover"
              >
                {t.submit}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-ink-muted">
              Email:{" "}
              <a
                href="mailto:info@kaikk.co.jp"
                className="text-primary hover:underline"
              >
                info@kaikk.co.jp
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
