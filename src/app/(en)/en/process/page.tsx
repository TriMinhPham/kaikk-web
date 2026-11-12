import ProcessContent from "@/components/pages/ProcessContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/process",
  locale: "en",
  title: "Project Process: From First Call to Operation",
  description: "How projects run at KAI Inc.: inquiry, requirement discussion, proposal and quotation, optional PoC, development, then delivery and operation — plus how cost, contracts and NDAs work.",
});

export default function ProcessPageEn() {
  return <ProcessContent locale="en" />;
}
