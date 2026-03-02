import { content, Locale } from "@/lib/content";
import FadeIn from "@/components/FadeIn";

const inputClass =
  "w-full rounded-lg border border-edge bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary";

export default function ContactContent({ locale }: { locale: Locale }) {
  const t = content[locale].contact;

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
          <FadeIn>
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-press w-full rounded-full bg-primary px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-hover hover:shadow-md"
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
          </FadeIn>
        </div>
      </section>
    </>
  );
}
