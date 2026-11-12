import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { pageAlternates, siteJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "KAI Inc. | AI & IT Systems Development in Tokyo",
    template: "%s | KAI Inc.",
  },
  description:
    "KAI Inc. is a Tokyo-based AI & IT development company providing AI implementation and business automation services for small and medium-sized enterprises.",
  alternates: pageAlternates("", "en"),
  openGraph: {
    type: "website",
    siteName: "KAI Inc.",
    locale: "en_US",
    alternateLocale: "ja_JP",
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

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd("en")) }}
        />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Header locale="en" />
        <main id="main-content">{children}</main>
        <Footer locale="en" />
      </body>
    </html>
  );
}
