import { content } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | 株式会社KAI",
};

export default function ContactPage() {
  const t = content.ja.contact;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-10 text-2xl font-bold text-navy">{t.title}</h1>

        <form
          action={`mailto:info@kaikk.co.jp`}
          method="POST"
          encType="text/plain"
          className="space-y-6"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-navy">
              {t.fields.companyName}
            </label>
            <input
              type="text"
              name="company"
              required
              className="w-full rounded border border-gray-border px-4 py-2 text-sm outline-none focus:border-blue-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-navy">
              {t.fields.contactPerson}
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded border border-gray-border px-4 py-2 text-sm outline-none focus:border-blue-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-navy">
              {t.fields.email}
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded border border-gray-border px-4 py-2 text-sm outline-none focus:border-blue-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-navy">
              {t.fields.message}
            </label>
            <textarea
              name="message"
              rows={6}
              required
              className="w-full rounded border border-gray-border px-4 py-2 text-sm outline-none focus:border-blue-accent"
            />
          </div>

          <button
            type="submit"
            className="rounded bg-blue-accent px-8 py-3 text-sm font-medium text-white hover:bg-blue-muted"
          >
            {t.submit}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-sub">{t.note}</p>
        <p className="mt-2 text-sm text-gray-sub">
          Email:{" "}
          <a
            href="mailto:info@kaikk.co.jp"
            className="text-blue-accent hover:underline"
          >
            info@kaikk.co.jp
          </a>
        </p>
      </div>
    </section>
  );
}
