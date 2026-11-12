import ServicesContent from "@/components/pages/ServicesContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/services",
  locale: "ja",
  title: "事業内容｜AI導入支援・業務自動化・Webシステム開発",
  description: "KAI株式会社の事業内容。AI導入支援（PoC）、業務特化型AIシステム開発、運用・保守サポート、Webシステム開発について、内容と成果物をご紹介します。",
});

export default function ServicesPage() {
  return <ServicesContent locale="ja" />;
}
