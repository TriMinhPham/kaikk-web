import type { Locale } from "@/lib/content";

// Production origin. Update here if the domain ever changes.
export const SITE_URL = "https://kaikk.co.jp";

// Locale-agnostic path ("" for home, "/services", ...) -> canonical + hreflang set.
export function pageAlternates(path: string, locale: Locale) {
  const ja = path || "/";
  const en = `/en${path}`;
  return {
    canonical: locale === "ja" ? ja : en,
    languages: {
      ja,
      en,
      "x-default": ja,
    },
  };
}

// Organization + WebSite structured data (JSON-LD), rendered once per locale layout.
export function siteJsonLd(locale: Locale) {
  const isJa = locale === "ja";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: isJa ? "株式会社KAI" : "KAI Inc.",
        alternateName: isJa ? "KAI Inc." : "株式会社KAI",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/symbol_kai.svg`,
        email: "info@kaikk.co.jp",
        foundingDate: "2026",
        founder: { "@type": "Person", name: "Pham Minh Tri" },
        description: isJa
          ? "株式会社KAIは、東京都を拠点とするAI・ITシステム開発会社です。中小企業様向けに、AI導入支援・業務自動化システムの設計から構築まで段階的な導入を支援します。"
          : "KAI Inc. is a Tokyo-based AI & IT development company providing AI implementation and business automation services for small and medium-sized enterprises.",
        address: {
          "@type": "PostalAddress",
          postalCode: "100-0006",
          addressCountry: "JP",
          addressRegion: isJa ? "東京都" : "Tokyo",
          addressLocality: isJa ? "千代田区" : "Chiyoda-ku",
          streetAddress: isJa
            ? "有楽町一丁目5番2号 東宝日比谷プロムナードビル11階"
            : "Toho Hibiya Promenade Building 11F, 1-5-2 Yurakucho",
        },
        areaServed: "JP",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: isJa ? "株式会社KAI" : "KAI Inc.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["ja", "en"],
      },
    ],
  };
}
