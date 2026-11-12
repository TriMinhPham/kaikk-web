import CompanyContent from "@/components/pages/CompanyContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/company",
  locale: "en",
  title: "Company Profile",
  description: "Company profile of KAI Inc. (Japanese Corporate Number 1010001262744), an AI and software development company in Yurakucho, Chiyoda-ku, Tokyo, including our founder’s background.",
});

export default function CompanyPageEn() {
  return <CompanyContent locale="en" />;
}
