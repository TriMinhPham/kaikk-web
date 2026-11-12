import Link from "next/link";
import { content, type Locale } from "@/lib/content";
import { CONTACT_EMAIL } from "@/lib/inquiry";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Footer({ locale }: { locale: Locale }) {
  const t = content[locale].footer;
  const nav = content[locale].nav;
  const prefix = locale === "en" ? "/en" : "";
  return (
    <footer className="site-footer">
      <div className="site-width">
        <div className="footer-top">
          <div><p className="footer-name">{t.companyName}</p><p className="footer-address">{t.address}</p><a className="footer-email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div>
          <nav className="footer-nav" aria-label={locale === "ja" ? "フッターナビゲーション" : "Footer navigation"}>
            <Link href={`${prefix}/services`}>{nav.services}</Link>
            <Link href={`${prefix}/process`}>{nav.process}</Link>
            <Link href={`${prefix}/company`}>{nav.company}</Link>
            <Link href={`${prefix}/contact`}>{nav.contact}</Link>
            <span><LocaleSwitcher locale={locale} linkClass="hover:text-primary" activeClass="text-ink" /></span>
          </nav>
        </div>
        <div className="footer-bottom">{t.copyright}</div>
      </div>
    </footer>
  );
}
