import ContactContent from "@/components/pages/ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | KAI Inc.",
};

export default function ContactPageEn() {
  return <ContactContent locale="en" />;
}
