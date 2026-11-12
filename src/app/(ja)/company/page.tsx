import CompanyContent from "@/components/pages/CompanyContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/company",
  locale: "ja",
  title: "会社概要",
  description: "KAI株式会社（法人番号1010001262744）の会社概要。東京都千代田区有楽町を拠点に、AIシステム開発・業務自動化システム開発・Webシステム開発を行っています。代表取締役の経歴もご紹介します。",
});

export default function CompanyPage() {
  return <CompanyContent locale="ja" />;
}
