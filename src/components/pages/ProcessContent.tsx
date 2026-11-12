import { content, type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBlock from "@/components/CtaBlock";

export default function ProcessContent({ locale }: { locale: Locale }) {
  const t = content[locale].process;
  const m = marketing[locale];
  const ja = locale === "ja";
  return (
    <>
      <Breadcrumbs locale={locale} trail={[{ name: t.title, path: "/process" }]} />
      <section className="page-heading site-width"><p className="eyebrow">{m.approachLabel}</p><h1>{t.title}</h1><p>{m.approachIntro}</p></section>
      <section className="site-width process-section" aria-label={t.title}>
        <ol className="process-steps">
          {t.steps.map(step => (
            <li key={step.num}>
              <span className="step-number">STEP {step.num}</span>
              <h2>{step.label}</h2>
              <p>{step.desc}</p>
            </li>
          ))}
        </ol>
        <dl className="process-notes">
          <div><dt>{ja ? "費用について" : "Cost"}</dt><dd>{content[locale].services.note}</dd></div>
          <div><dt>{ja ? "契約と機密保持" : "Contracts and confidentiality"}</dt><dd>{ja ? "KAI株式会社として正式に契約を締結します。機密情報を扱う場合は、NDA（秘密保持契約）を締結したうえで詳細を伺います。" : "KAI Inc. signs formal contracts as a Japanese corporation. Where confidential information is involved, we sign an NDA before discussing details."}</dd></div>
          <div><dt>{ja ? "PoCを省略する場合" : "When a PoC is not needed"}</dt><dd>{ja ? "要件や技術的な見通しが明確な場合は、PoCを行わずに設計・開発へ進むこともあります。" : "If requirements and technical feasibility are already clear, we can move straight to design and development."}</dd></div>
        </dl>
      </section>
      <CtaBlock locale={locale} headingId="process-cta" />
    </>
  );
}
