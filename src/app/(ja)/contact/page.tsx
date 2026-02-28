import ContactContent from "@/components/pages/ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | KAI株式会社",
};

export default function ContactPage() {
  return <ContactContent locale="ja" />;
}
