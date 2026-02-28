import CompanyContent from "@/components/pages/CompanyContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社概要 | KAI株式会社",
};

export default function CompanyPage() {
  return <CompanyContent locale="ja" />;
}
