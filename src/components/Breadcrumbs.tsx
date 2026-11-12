import Link from "next/link";
import type { Locale } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. Last item is the current page. */
export default function Breadcrumbs({ locale, trail }: { locale: Locale; trail: { name: string; path: string }[] }) {
  const prefix = locale === "en" ? "/en" : "";
  const items = [{ name: locale === "ja" ? "ホーム" : "Home", path: "" }, ...trail];
  return (
    <>
      <nav className="breadcrumbs site-width" aria-label={locale === "ja" ? "パンくずリスト" : "Breadcrumb"}>
        <ol>
          {items.map((item, i) => (
            <li key={item.path || "home"}>
              {i < items.length - 1 ? <Link href={`${prefix}${item.path}` || "/"}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(locale, trail)} />
    </>
  );
}
