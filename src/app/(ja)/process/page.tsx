import ProcessContent from "@/components/pages/ProcessContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/process",
  locale: "ja",
  title: "導入の流れ｜ご相談から開発・運用まで",
  description: "KAI株式会社にご相談いただいてから、ヒアリング、要件整理・お見積り、PoC、本格開発、納品・運用開始までの流れと、費用・契約・NDAについてご説明します。",
});

export default function ProcessPage() {
  return <ProcessContent locale="ja" />;
}
