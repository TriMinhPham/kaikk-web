import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import { pageAlternates, siteJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "KAI株式会社｜中小企業のAI導入支援・業務自動化（東京・有楽町）",
    template: "%s｜KAI株式会社",
  },
  description:
    "KAI株式会社は、東京都を拠点とするAI・ITシステム開発会社です。中小企業様向けに、AI導入支援・業務自動化システムの設計から構築まで段階的な導入を支援します。",
  alternates: pageAlternates("", "ja"),
  openGraph: {
    type: "website",
    siteName: "KAI株式会社",
    locale: "ja_JP",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "KAI Inc. | AI & IT Systems Development in Tokyo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function JaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <JsonLd data={siteJsonLd("ja")} />
        <a href="#main-content" className="skip-link">本文へスキップ</a>
        <Header locale="ja" />
        <main id="main-content">{children}</main>
        <Footer locale="ja" />
      </body>
    </html>
  );
}
