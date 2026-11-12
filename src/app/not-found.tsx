import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ページが見つかりません / Page not found｜KAI株式会社",
  robots: { index: false },
};

// The root layout renders no <html>, so the static 404.html needs its own document shell.
export default function NotFound() {
  return (
    <html lang="ja">
      <body className="antialiased">
        <main id="main-content" className="not-found site-width">
          <p className="eyebrow">404</p>
          <h1>ページが見つかりません</h1>
          <p>お探しのページは移動または削除された可能性があります。</p>
          <p lang="en">The page you are looking for could not be found.</p>
          <ul>
            <li><Link className="text-link" href="/">KAI株式会社 ホーム<span aria-hidden="true">→</span></Link></li>
            <li><Link className="text-link" href="/contact">お問い合わせ・ご相談<span aria-hidden="true">→</span></Link></li>
            <li lang="en"><Link className="text-link" href="/en">KAI Inc. (English)<span aria-hidden="true">→</span></Link></li>
          </ul>
        </main>
      </body>
    </html>
  );
}
