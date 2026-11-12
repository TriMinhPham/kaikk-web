import { notFound } from "next/navigation";
import SolutionContent from "@/components/pages/SolutionContent";
import { solutions, solutionSlugs, type SolutionSlug } from "@/lib/solutions";
import { pageMetadata } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return solutionSlugs.map(slug => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = solutions.ja[slug as SolutionSlug];
  return pageMetadata({ path: `/solutions/${slug}`, locale: "ja", title: s.metaTitle, description: s.description });
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  if (!solutionSlugs.includes(slug as SolutionSlug)) notFound();
  return <SolutionContent locale="ja" slug={slug as SolutionSlug} />;
}
