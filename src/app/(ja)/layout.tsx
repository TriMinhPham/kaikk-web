import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { pageAlternates, siteJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "株式会社KAI｜AI・ITシステム開発",
    template: "%s｜株式会社KAI",
  },
  description:
    "株式会社KAIは、東京都を拠点とするAI・ITシステム開発会社です。中小企業様向けに、AI導入支援・業務自動化システムの設計から構築まで段階的な導入を支援します。",
  alternates: pageAlternates("", "ja"),
  openGraph: {
    type: "website",
    siteName: "株式会社KAI",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd("ja")) }}
        />
        <Header locale="ja" />
        <main>{children}</main>
        <Footer locale="ja" />
      </body>
    </html>
  );
}
