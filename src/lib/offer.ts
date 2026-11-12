/**
 * Commercial promises shown to prospects.
 *
 * FOUNDER DECISION REQUIRED. Every value here is a business commitment
 * (price, free-of-charge scope, response time). They are all OFF / null by
 * default, so the site makes no promise until the Representative Director
 * approves one. Changing a value here is the ONLY switch needed: components
 * render the matching copy only when the value is set.
 */
export const offer = {
  /** e.g. 30 → "初回のご相談（30分・オンライン）は無料です". null = no free-consultation claim. */
  freeConsultationMinutes: null as number | null,
  /** e.g. 2 → "通常2営業日以内にご返信します". null = no response-time claim. */
  replyWithinBusinessDays: null as number | null,
  /** e.g. "300,000" → "PoCは30万円（税別）から". null = no price shown. */
  pocPriceFromJpy: null as string | null,
} as const;

export function offerLines(locale: "ja" | "en"): string[] {
  const ja = locale === "ja";
  const lines: string[] = [];
  if (offer.freeConsultationMinutes)
    lines.push(ja ? `初回のご相談（${offer.freeConsultationMinutes}分・オンライン）は無料です。` : `Your first ${offer.freeConsultationMinutes}-minute online consultation is free of charge.`);
  if (offer.replyWithinBusinessDays)
    lines.push(ja ? `通常${offer.replyWithinBusinessDays}営業日以内にご返信します。` : `We usually reply within ${offer.replyWithinBusinessDays} business days.`);
  if (offer.pocPriceFromJpy)
    lines.push(ja ? `PoC（小規模検証）は${offer.pocPriceFromJpy}円（税別）からお受けしています。` : `Proof-of-concept projects start from JPY ${offer.pocPriceFromJpy} (excl. tax).`);
  return lines;
}
