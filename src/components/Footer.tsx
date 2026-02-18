import Link from "next/link";
import { content, Locale } from "@/lib/content";

export default function Footer({ locale }: { locale: Locale }) {
  const t = content[locale].footer;
  const nav = content[locale].nav;
  const prefix = locale === "en" ? "/en" : "";

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Left: Logo + info */}
          <div>
            <p className="mb-3 text-lg font-bold">KAI</p>
            <p className="whitespace-pre-line text-xs leading-relaxed text-white/60">
              {t.address}
            </p>
            <p className="mt-2 text-xs text-white/60">
              <a href={`mailto:${t.email}`} className="hover:text-white">
                {t.email}
              </a>
            </p>
          </div>

          {/* Right: Nav links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60">
            <Link href={`${prefix}/services`} className="hover:text-white">{nav.services}</Link>
            <Link href={`${prefix}/process`} className="hover:text-white">{nav.process}</Link>
            <Link href={`${prefix}/company`} className="hover:text-white">{nav.company}</Link>
            <Link href={`${prefix}/contact`} className="hover:text-white">{nav.contact}</Link>
            <span>
              <Link href="/" className={`${locale === "ja" ? "text-white" : ""} hover:text-white`}>JP</Link>
              {" / "}
              <Link href="/en" className={`${locale === "en" ? "text-white" : ""} hover:text-white`}>EN</Link>
            </span>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
          {t.copyright}
        </div>
      </div>
    </footer>
  );
}
