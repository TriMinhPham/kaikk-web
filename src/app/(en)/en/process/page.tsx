import ProcessContent from "@/components/pages/ProcessContent";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How projects run at KAI Inc.: inquiry, requirement discussion, proposal and quotation, optional PoC, full development, then delivery and operation.",
  alternates: pageAlternates("/process", "en"),
};

export default function ProcessPageEn() {
  return <ProcessContent locale="en" />;
}
