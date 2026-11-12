import ContactContent from "@/components/pages/ContactContent";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "KAI株式会社へのお問い合わせ。AI導入・業務自動化・Webシステム開発のご相談を承ります。要件が未定でもご相談いただけます。",
  alternates: pageAlternates("/contact", "ja"),
};

export default function ContactPage() {
  return <ContactContent locale="ja" />;
}
