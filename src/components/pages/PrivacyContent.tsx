import type { Locale } from "@/lib/content";
import { privacy } from "@/lib/privacy";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function PrivacyContent({ locale }: { locale: Locale }) {
  const p = privacy[locale];
  return (
    <>
      <Breadcrumbs locale={locale} trail={[{ name: p.title, path: "/privacy" }]} />
      <section className="page-heading site-width"><p className="eyebrow">{locale === "ja" ? "Privacy" : "KAI INC."}</p><h1>{p.title}</h1><p>{p.intro}</p></section>
      <div className="site-width"><div className="policy">
        {p.sections.map(section => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {section.facts && (
              <dl>{section.facts.map(fact => (
                <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value.includes("@") ? <a className="inline-link" href={`mailto:${fact.value}`}>{fact.value}</a> : fact.value}</dd></div>
              ))}</dl>
            )}
            {section.paragraphs?.map(text => <p key={text}>{text}</p>)}
            {section.items && <ul>{section.items.map(text => <li key={text}>{text}</li>)}</ul>}
            {section.after?.map(text => <p key={text}>{text}</p>)}
            {section.links && <ul>{section.links.map(link => <li key={link.href}><a className="inline-link" href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<span aria-hidden="true">{"\u00a0↗"}</span></a></li>)}</ul>}
          </section>
        ))}
        <p className="policy-meta">{p.effective}{p.languageNote && <><br />{p.languageNote}</>}</p>
      </div></div>
    </>
  );
}
