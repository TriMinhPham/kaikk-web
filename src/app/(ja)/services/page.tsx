import ServicesContent from "@/components/pages/ServicesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "事業内容 | KAI株式会社",
};

export default function ServicesPage() {
  return <ServicesContent locale="ja" />;
}
