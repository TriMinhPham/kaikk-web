import ServicesContent from "@/components/pages/ServicesContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/services",
  locale: "en",
  title: "Services: AI Adoption, Automation & Web Systems",
  description: "Services from KAI Inc.: AI introduction (proof of concept), custom AI system development, operations and maintenance, and web systems — with the deliverables for each.",
});

export default function ServicesPageEn() {
  return <ServicesContent locale="en" />;
}
