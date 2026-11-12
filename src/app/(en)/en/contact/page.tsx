import ContactContent from "@/components/pages/ContactContent";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact KAI Inc. about AI implementation, business automation, or web system development. Start with your business problem, even before defining requirements.",
  alternates: pageAlternates("/contact", "en"),
};

export default function ContactPageEn() {
  return <ContactContent locale="en" />;
}
