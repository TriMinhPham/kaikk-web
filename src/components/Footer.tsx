import Link from "next/link";
import { content, Locale } from "@/lib/content";

export default function Footer({ locale }: { locale: Locale }) {
  const t = content[locale].footer;

  return (
    <footer className="border-t border-gray-border bg-gray-light">
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-gray-sub">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 font-bold text-navy">{t.companyName}</p>
            <p className="whitespace-pre-line text-xs leading-relaxed">
              {t.address}
            </p>
            <p className="mt-2 text-xs">{t.representative}</p>
            <p className="text-xs">{t.capital}</p>
            <p className="mt-2 text-xs">
              Email:{" "}
              <a
                href={`mailto:${t.email}`}
                className="text-blue-accent hover:underline"
              >
                {t.email}
              </a>
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-xs md:items-end">
            <span className="text-gray-sub">
              <Link
                href="/"
                className={`${locale === "ja" ? "font-bold text-navy" : ""} hover:text-blue-accent`}
              >
                JP
              </Link>
              {" | "}
              <Link
                href="/en"
                className={`${locale === "en" ? "font-bold text-navy" : ""} hover:text-blue-accent`}
              >
                EN
              </Link>
            </span>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-border pt-4 text-center text-xs text-gray-sub">
          {t.copyright}
        </div>
      </div>
    </footer>
  );
}
