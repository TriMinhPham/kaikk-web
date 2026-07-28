import ProcessContent from "@/components/pages/ProcessContent";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "導入の流れ",
  description:
    "株式会社KAIにおけるシステム導入の流れをご紹介。お問い合わせからヒアリング、お見積り、PoC、本格開発、納品・運用開始までの6ステップです。",
  alternates: pageAlternates("/process", "ja"),
};

export default function ProcessPage() {
  return <ProcessContent locale="ja" />;
}
