export const CONTACT_EMAIL = "info@kaikk.jp";

export type Inquiry = { company: string; name: string; email: string; message: string };

/** Prepare a draft only. This static site does not send or store inquiries. */
export function buildInquiry(values: Inquiry, locale: "ja" | "en") {
  const ja = locale === "ja";
  const company = values.company.replace(/[\r\n]+/g, " ").trim();
  const subject = `${ja ? "KAIへのお問い合わせ" : "Project inquiry to KAI"}: ${company}`;
  const body = [
    `${ja ? "会社名" : "Company"}: ${values.company.trim()}`,
    `${ja ? "ご担当者名" : "Name"}: ${values.name.trim()}`,
    `${ja ? "メールアドレス" : "Email"}: ${values.email.trim()}`,
    "",
    values.message.trim(),
  ].join("\n");
  return { body, href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
