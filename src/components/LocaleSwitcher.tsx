"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/content";
import { solutionSlugs } from "@/lib/solutions";

// Paths that exist in both locales. Anything else falls back to the locale root.
const SHARED_PATHS = [
  "/",
  "/services",
  "/process",
  "/company",
  "/contact",
  ...solutionSlugs.map(slug => `/solutions/${slug}`),
  "/privacy",
];

export default function LocaleSwitcher({
  locale,
  linkClass = "",
  activeClass = "",
}: {
  locale: Locale;
  linkClass?: string;
  activeClass?: string;
}) {
  const pathname = usePathname() ?? "/";
  const basePath =
    locale === "en" ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;
  const shared = SHARED_PATHS.includes(basePath);
  const jaHref = shared ? basePath : "/";
  const enHref = shared ? `/en${basePath === "/" ? "" : basePath}` : "/en";

  return (
    <>
      <Link
        href={jaHref}
        className={`${linkClass} ${locale === "ja" ? activeClass : ""}`}
      >
        JP
      </Link>
      {" / "}
      <Link
        href={enHref}
        className={`${linkClass} ${locale === "en" ? activeClass : ""}`}
      >
        EN
      </Link>
    </>
  );
}
