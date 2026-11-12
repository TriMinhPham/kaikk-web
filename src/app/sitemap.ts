import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { solutionSlugs } from "@/lib/solutions";

export const dynamic = "force-static";

// Locale-agnostic paths. /isekai is an internal reference doc and stays out.
const paths = ["", "/services", "/process", "/company", "/contact", ...solutionSlugs.map(slug => `/solutions/${slug}`), "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) => {
    const ja = `${SITE_URL}${path || "/"}`;
    const en = `${SITE_URL}/en${path}`;
    const alternates = { languages: { ja, en, "x-default": ja } };
    return [
      {
        url: ja,
        alternates,
        changeFrequency: "monthly" as const,
        priority: path === "" ? 1 : path === "/privacy" ? 0.3 : 0.7,
      },
      {
        url: en,
        alternates,
        changeFrequency: "monthly" as const,
        priority: path === "" ? 0.8 : path === "/privacy" ? 0.2 : 0.6,
      },
    ];
  });
}
