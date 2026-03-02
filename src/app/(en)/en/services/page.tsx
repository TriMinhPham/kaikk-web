import ServicesContent from "@/components/pages/ServicesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | KAI Inc.",
};

export default function ServicesPageEn() {
  return <ServicesContent locale="en" />;
}
