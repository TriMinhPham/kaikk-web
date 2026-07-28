import ServicesContent from "@/components/pages/ServicesContent";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "事業内容",
  description:
    "株式会社KAIの事業内容のご案内。AI導入支援（PoC）、業務特化型AIシステム開発、運用・保守サポート、Webシステム開発を提供しています。",
  alternates: pageAlternates("/services", "ja"),
};

export default function ServicesPage() {
  return <ServicesContent locale="ja" />;
}
