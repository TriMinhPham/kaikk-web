import HomeContent from "@/components/pages/HomeContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "",
  locale: "en",
  title: "KAI Inc. | AI Adoption & Business Automation for SMEs in Tokyo",
  description: "KAI Inc. helps small and medium-sized businesses in Japan adopt AI and reduce manual work: proof of concept, custom AI systems, integration and ongoing support. Tokyo-based, working in Japanese and English.",
  absoluteTitle: true,
});

export default function HomePageEn() {
  return <HomeContent locale="en" />;
}
