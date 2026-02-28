import CompanyContent from "@/components/pages/CompanyContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company | KAI Inc.",
};

export default function CompanyPageEn() {
  return <CompanyContent locale="en" />;
}
