import { Fragment } from "react";
import { content, type Locale } from "@/lib/content";
import { CORPORATE_NUMBER, CORPORATE_NUMBER_URL } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBlock from "@/components/CtaBlock";
import Expertise from "@/components/Expertise";

export default function CompanyContent({ locale }: { locale: Locale }) {
  const t = content[locale].company;
  const ja = locale === "ja";
  return (
    <>
      <Breadcrumbs locale={locale} trail={[{ name: t.title, path: "/company" }]} />
      <section className="page-heading site-width"><p className="eyebrow">KAI INC.</p><h1>{t.title}</h1></section>
      <section className="company-profile site-width" aria-label={t.title}>
        <dl>
          {t.rows.map(row => (
            <Fragment key={row.label}>
              <div><dt>{row.label}</dt><dd>{row.value}</dd></div>
              {/* The corporate number sits next to the registry number it is derived from. */}
              {(row.label === "会社法人等番号" || row.label === "Company Registration Number") && (
                <div>
                  <dt>{ja ? "法人番号" : "Corporate Number"}</dt>
                  <dd>{CORPORATE_NUMBER}<br /><a className="inline-link" href={CORPORATE_NUMBER_URL} target="_blank" rel="noopener noreferrer">{ja ? "国税庁 法人番号公表サイトで確認する" : "Verify on the National Tax Agency registry (Japanese)"}<span aria-hidden="true">{"\u00a0↗"}</span></a></dd>
                </div>
              )}
            </Fragment>
          ))}
          <div><dt>{ja ? "お問い合わせ" : "Contact"}</dt><dd><a className="inline-link" href="mailto:info@kaikk.jp">info@kaikk.jp</a></dd></div>
          <div><dt>{ja ? "対応言語" : "Languages"}</dt><dd>{ja ? "日本語・英語" : "Japanese and English"}</dd></div>
        </dl>
      </section>
      <Expertise locale={locale} />
      <CtaBlock locale={locale} headingId="company-cta" />
    </>
  );
}
