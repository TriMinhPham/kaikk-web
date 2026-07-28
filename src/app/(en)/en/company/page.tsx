import CompanyContent from "@/components/pages/CompanyContent";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Company",
  description:
    "Company profile of KAI Inc., an AI & IT development company based in Yurakucho, Chiyoda-ku, Tokyo.",
  alternates: pageAlternates("/company", "en"),
};

export default function CompanyPageEn() {
  return <CompanyContent locale="en" />;
}
