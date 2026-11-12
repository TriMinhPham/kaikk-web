import Link from "next/link";
import { type Locale } from "@/lib/content";
import { marketing } from "@/lib/marketing";

export default function Expertise({ locale }: { locale: Locale }) {
  const m = marketing[locale];
  return (
    <section className="site-section expertise" aria-labelledby="expertise-title">
      <div className="section-heading">
        <p className="eyebrow">{m.expertiseLabel}</p>
        <div><h2 id="expertise-title">{m.expertiseTitle}</h2><p className="section-intro">{m.expertiseIntro}</p></div>
      </div>
      <div className="expertise-grid">
        <div className="founder-story">
          <p className="eyebrow">{m.founderRole}</p>
          <h3>{m.founderName}</h3>
          <p>{m.founderDesc}</p>
          <Link className="text-link" href="https://phamminhtri.com/">{m.founderLink}<span aria-hidden="true">↗</span></Link>
        </div>
        <div className="proof-list">
          {m.proofs.map(proof => (
            <article className="proof" key={proof.title}>
              <p className="eyebrow">{proof.category}</p>
              <h3>{proof.title}</h3>
              <p>{proof.desc}</p>
              <a className="text-link" href={proof.href}>{proof.link}<span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </div>
      <p className="proof-note">{m.proofNote}</p>
    </section>
  );
}
