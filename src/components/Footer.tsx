import Link from "next/link";
import { content, type Locale } from "@/lib/content";
import { CONTACT_EMAIL } from "@/lib/inquiry";
import { solutions, solutionSlugs } from "@/lib/solutions";
import { CORPORATE_NUMBER } from "@/lib/site";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Footer({ locale }: { locale: Locale }) {
  const t = content[locale].footer;
  const nav = content[locale].nav;
  const ja = locale === "ja";
  const prefix = locale === "en" ? "/en" : "";
  return (
    <footer className="site-footer">
      <div className="site-width">
        <div className="footer-top">
          <div>
            <p className="footer-name">{t.companyName}</p>
            <p className="footer-address">{t.address}</p>
            <p className="footer-address">{ja ? "法人番号" : "Corporate No."} {CORPORATE_NUMBER}</p>
            <a className="footer-email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
          <div className="footer-columns">
            <nav className="footer-nav" aria-label={ja ? "フッターナビゲーション" : "Footer navigation"}>
              <Link href={`${prefix}/services`}>{nav.services}</Link>
              <Link href={`${prefix}/process`}>{nav.process}</Link>
              <Link href={`${prefix}/company`}>{nav.company}</Link>
              <Link href={`${prefix}/contact`}>{nav.contact}</Link>
              <span><LocaleSwitcher locale={locale} linkClass="hover:text-primary" activeClass="text-ink" /></span>
            </nav>
            <nav className="footer-nav" aria-label={ja ? "課題別のご案内" : "Solutions"}>
              {solutionSlugs.map(slug => <Link key={slug} href={`${prefix}/solutions/${slug}`}>{solutions[locale][slug].navLabel}</Link>)}
            </nav>
          </div>
        </div>
        <div className="footer-bottom">{t.copyright}</div>
      </div>
    </footer>
  );
}
