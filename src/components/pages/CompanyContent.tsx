import { content, type Locale } from "@/lib/content";
import Expertise from "@/components/Expertise";

export default function CompanyContent({ locale }: { locale: Locale }) {
  const t = content[locale].company;
  return (
    <>
      <section className="page-heading site-width"><p className="eyebrow">KAI INC.</p><h1>{t.title}</h1></section>
      <section className="company-profile site-width"><dl>{t.rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl></section>
      <Expertise locale={locale} />
    </>
  );
}
