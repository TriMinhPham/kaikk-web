export const CONTACT_EMAIL = "info@kaikk.jp";

/** `company` and `topic` are optional to keep the first step low-friction. */
export type Inquiry = { company: string; name: string; email: string; message: string; topic?: string };

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

/**
 * Prepare a draft only. This static site does not send or store inquiries:
 * every href below opens a draft the visitor must review and send themselves.
 */
export function buildInquiry(values: Inquiry, locale: "ja" | "en") {
  const ja = locale === "ja";
  const company = oneLine(values.company);
  const topic = oneLine(values.topic ?? "");
  const who = company || oneLine(values.name);
  const subject = [
    topic ? (ja ? `【${topic}】` : `[${topic}] `) : "",
    ja ? "KAIへのお問い合わせ" : "Project inquiry to KAI",
    who ? `: ${who}` : "",
  ].join("");
  const body = [
    `${ja ? "会社名" : "Company"}: ${values.company.trim() || (ja ? "（未記入）" : "(not provided)")}`,
    `${ja ? "ご担当者名" : "Name"}: ${values.name.trim()}`,
    `${ja ? "メールアドレス" : "Email"}: ${values.email.trim()}`,
    ...(topic ? [`${ja ? "ご相談の種類" : "Topic"}: ${topic}`] : []),
    "",
    values.message.trim(),
  ].join("\n");
  const s = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  const to = encodeURIComponent(CONTACT_EMAIL);
  return {
    subject,
    body,
    href: `mailto:${CONTACT_EMAIL}?subject=${s}&body=${b}`,
    // Webmail compose links for visitors without a configured mail app. They open a draft; nothing is sent.
    gmailHref: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${s}&body=${b}`,
    outlookHref: `https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${s}&body=${b}`,
  };
}

/** Topic preselection from `?topic=` links. Unknown values are ignored. */
export function topicFromSearch(search: string, allowed: readonly string[]) {
  const value = new URLSearchParams(search).get("topic") ?? "";
  return allowed.includes(value) ? value : "";
}
