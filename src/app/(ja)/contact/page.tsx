import ContactContent from "@/components/pages/ContactContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/contact",
  locale: "ja",
  title: "お問い合わせ・ご相談",
  description: "KAI株式会社へのお問い合わせ・ご相談。AI導入、業務自動化、生成AIの社内活用、Webシステム開発について、要件が未定の段階からご相談いただけます。",
});

export default function ContactPage() {
  return <ContactContent locale="ja" />;
}
