import ProcessContent from "@/components/pages/ProcessContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "導入の流れ | KAI株式会社",
};

export default function ProcessPage() {
  return <ProcessContent locale="ja" />;
}
