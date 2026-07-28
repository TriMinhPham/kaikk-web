import ServicesContent from "@/components/pages/ServicesContent";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Services offered by KAI Inc.: AI introduction (PoC), custom AI system development, operations & maintenance, and web system development.",
  alternates: pageAlternates("/services", "en"),
};

export default function ServicesPageEn() {
  return <ServicesContent locale="en" />;
}
