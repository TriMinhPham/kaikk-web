import HomeContent from "@/components/pages/HomeContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "",
  locale: "ja",
  title: "KAI株式会社｜中小企業のAI導入支援・業務自動化（東京・有楽町）",
  description: "東京・有楽町のKAI株式会社は、中小企業様向けにAI導入支援（PoC）、業務自動化・システム連携、生成AIの社内活用、Webシステム開発を行っています。要件が固まっていない段階からご相談いただけます。",
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeContent locale="ja" />;
}
