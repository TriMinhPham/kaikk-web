import ContactContent from "@/components/pages/ContactContent";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "株式会社KAIへのお問い合わせはこちら。AI導入・業務自動化・Webシステム開発のご相談を承ります。通常2営業日以内にご返信いたします。",
  alternates: pageAlternates("/contact", "ja"),
};

export default function ContactPage() {
  return <ContactContent locale="ja" />;
}
