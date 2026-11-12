import PrivacyContent from "@/components/pages/PrivacyContent";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/privacy",
  locale: "en",
  title: "Privacy Policy",
  description: "How KAI Inc. handles personal information: what the contact form collects, why, where it is stored (Cloudflare, Google Workspace), how long we keep it, and how to request access or deletion.",
});

export default function PrivacyPageEn() {
  return <PrivacyContent locale="en" />;
}
