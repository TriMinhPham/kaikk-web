import PrivacyContent from "@/components/pages/PrivacyContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/privacy",
  locale: "ja",
  title: "個人情報の取扱い（プライバシーポリシー）",
  description: "KAI株式会社の個人情報の取扱いについて。お問い合わせで取得する情報、利用目的、保管場所（Cloudflare・Google Workspace）、保存期間、開示などのご請求方法をご案内します。",
});

export default function PrivacyPage() {
  return <PrivacyContent locale="ja" />;
}
