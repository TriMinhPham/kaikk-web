import type { Metadata } from "next";
import type { Locale } from "@/lib/content";

// Production origin. Update here if the domain ever changes.
export const SITE_URL = "https://kaikk.jp";

/** Registry facts. Corporate number verified on the National Tax Agency site (国税庁法人番号公表サイト). */
export const CORPORATE_NUMBER = "1010001262744";
export const CORPORATE_NUMBER_URL = `https://www.houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=${CORPORATE_NUMBER}`;

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "KAI Inc. | AI & IT Systems Development in Tokyo",
};

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

export function absoluteUrl(path: string, locale: Locale) {
  return locale === "ja" ? `${SITE_URL}${path || "/"}` : `${SITE_URL}/en${path}`;
}

/**
 * Full per-page metadata. Next.js replaces (not merges) a layout's openGraph
 * object when a page defines one, so every page gets the complete set here,
 * including og:url, which was previously missing.
 */
export function pageMetadata({ path, locale, title, description, absoluteTitle = false }: { path: string; locale: Locale; title: string; description: string; absoluteTitle?: boolean }): Metadata {
  const ja = locale === "ja";
  const siteName = ja ? "KAI株式会社" : "KAI Inc.";
  const fullTitle = absoluteTitle ? title : `${title}${ja ? "｜" : " | "}${siteName}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: pageAlternates(path, locale),
    openGraph: {
      type: "website",
      siteName,
      locale: ja ? "ja_JP" : "en_US",
      alternateLocale: ja ? "en_US" : "ja_JP",
      url: absoluteUrl(path, locale),
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
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
        name: isJa ? "KAI株式会社" : "KAI Inc.",
        legalName: "KAI株式会社",
        alternateName: isJa ? "KAI Inc." : "KAI株式会社",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/symbol_kai.svg`,
        image: `${SITE_URL}/og.png`,
        email: "info@kaikk.jp",
        foundingDate: "2026-02-05",
        founder: { "@type": "Person", name: "Pham Minh Tri", jobTitle: isJa ? "代表取締役" : "Representative Director", url: "https://phamminhtri.com/" },
        identifier: {
          "@type": "PropertyValue",
          propertyID: isJa ? "法人番号" : "Corporate Number (Japan)",
          value: CORPORATE_NUMBER,
          url: CORPORATE_NUMBER_URL,
        },
        description: isJa
          ? "KAI株式会社は、東京都千代田区を拠点とするAI・ITシステム開発会社です。中小企業様向けに、AI導入支援（PoC）、業務自動化・システム連携、生成AIの社内活用、Webシステム開発を、業務の整理から運用まで支援します。"
          : "KAI Inc. is a Tokyo-based AI and software development company. It helps small and medium-sized businesses in Japan with AI adoption (proof of concept), business automation and integration, internal use of generative AI, and web systems — from scoping to operation.",
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
        contactPoint: {
          "@type": "ContactPoint",
          contactType: isJa ? "お問い合わせ" : "sales",
          email: "info@kaikk.jp",
          url: absoluteUrl("/contact", locale),
          availableLanguage: ["ja", "en"],
        },
        knowsLanguage: ["ja", "en"],
        knowsAbout: ["AI導入支援", "業務自動化", "生成AI", "RAG", "システム連携", "Webシステム開発"],
        areaServed: { "@type": "Country", name: "Japan" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: isJa ? "KAI株式会社" : "KAI Inc.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["ja", "en"],
      },
    ],
  };
}

export function breadcrumbJsonLd(locale: Locale, trail: { name: string; path: string }[]) {
  const home = { name: locale === "ja" ? "ホーム" : "Home", path: "" };
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [home, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path, locale),
    })),
  };
}

/** Only for FAQs that are visible on the same page. */
export function faqJsonLd(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
  };
}

export function serviceJsonLd(locale: Locale, items: { name: string; description: string; serviceType?: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@graph": items.map(item => ({
      "@type": "Service",
      name: item.name,
      description: item.description,
      serviceType: item.serviceType ?? item.name,
      url: absoluteUrl(item.path, locale),
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Japan" },
      availableLanguage: ["ja", "en"],
    })),
  };
}
