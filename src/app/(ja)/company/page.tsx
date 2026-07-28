import CompanyContent from "@/components/pages/CompanyContent";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "株式会社KAIの会社概要。東京都千代田区有楽町を拠点に、AIシステム開発・業務自動化システム開発・Webシステム開発を行っています。",
  alternates: pageAlternates("/company", "ja"),
};

export default function CompanyPage() {
  return <CompanyContent locale="ja" />;
}
