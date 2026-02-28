import ProcessContent from "@/components/pages/ProcessContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process | KAI Inc.",
};

export default function ProcessPageEn() {
  return <ProcessContent locale="en" />;
}
