import ContactContent from "@/components/pages/ContactContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/contact",
  locale: "en",
  title: "Contact & Project Inquiries",
  description: "Contact KAI Inc. about AI adoption, business automation, generative AI or web systems. Start with your business problem — no finished specification needed.",
});

export default function ContactPageEn() {
  return <ContactContent locale="en" />;
}
