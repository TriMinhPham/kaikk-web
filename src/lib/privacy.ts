import { INQUIRY_RETENTION_MONTHS, RATE_EVENT_RETENTION_HOURS } from "@/lib/inquiry-rules";

/**
 * Privacy policy text (個人情報の取扱い). DRAFT pending founder approval and,
 * ideally, review by a Japanese lawyer. Retention numbers come from
 * src/lib/inquiry-rules.ts so the policy and the code cannot drift apart.
 */
export const PRIVACY_EFFECTIVE = { ja: "2026年11月12日", en: "12 November 2026" } as const;

export type PolicySection = { id: string; title: string; paragraphs?: string[]; items?: string[]; after?: string[]; links?: { label: string; href: string }[]; facts?: { label: string; value: string }[] };

const PPC_FOREIGN = "https://www.ppc.go.jp/personalinfo/legal/kaiseihogohou/#gaikoku";
const CF_PRIVACY = "https://www.cloudflare.com/privacypolicy/";
const TURNSTILE_PRIVACY = "https://www.cloudflare.com/turnstile-privacy-policy/";
const GOOGLE_PRIVACY = "https://policies.google.com/privacy";

export type PolicyPage = { title: string; navLabel: string; intro: string; sections: PolicySection[]; effective: string; languageNote: string };

export const privacy: Record<"ja" | "en", PolicyPage> = {
  ja: {
    title: "個人情報の取扱い",
    navLabel: "個人情報の取扱い",
    intro: "KAI株式会社（以下「当社」）は、個人情報の保護に関する法律（以下「個人情報保護法」）その他の関係法令を守り、本ウェブサイト（https://kaikk.jp）およびお問い合わせを通じてお預かりする個人情報を、以下のとおり取り扱います。",
    sections: [
      {
        id: "operator",
        title: "1. 事業者",
        facts: [
          { label: "名称", value: "KAI株式会社" },
          { label: "住所", value: "〒100-0006\n東京都千代田区有楽町一丁目5番2号\n東宝日比谷プロムナードビル11階" },
          { label: "代表者", value: "代表取締役 PHAM MINH TRI" },
          { label: "お問い合わせ", value: "info@kaikk.jp" },
        ],
      },
      {
        id: "collected",
        title: "2. 取得する情報",
        items: [
          "お問い合わせフォーム：お名前、メールアドレス、会社名（任意）、ご相談の種類（任意）、お問い合わせ内容、表示言語、受付日時",
          "メールでのお問い合わせ：メールアドレス、お名前・署名、本文など、お送りいただいた内容",
          `不正な送信の防止：フォーム送信時のIPアドレスを、送信回数の制限のためだけに、元に戻せない値（鍵付きハッシュ値）に変換して保存し、${RATE_EVENT_RETENTION_HOURS}時間以内に削除します。IPアドレスそのものは保存しません。`,
          "Cloudflare Turnstile および Cloudflare Web Analytics が処理する情報（第5項）",
        ],
      },
      {
        id: "purpose",
        title: "3. 利用目的",
        paragraphs: ["取得した個人情報は、次の目的に限って利用します。"],
        items: [
          "お問い合わせへの回答と、そのためのご連絡",
          "ご相談内容に関するご提案、お見積り、打ち合わせの日程調整",
          "不正な送信やスパムの防止、本ウェブサイトの安全の確保",
          "本ウェブサイトの改善（個人を特定しない集計情報に限ります）",
        ],
        after: ["利用目的を変更する場合は、変更前の目的と関連性があると合理的に認められる範囲で行い、本ページで公表します。"],
      },
      {
        id: "storage",
        title: "4. 保管場所と安全管理措置",
        items: [
          "お問い合わせフォームの内容は、Cloudflare, Inc.（米国）が提供するデータベース（Cloudflare D1）に保存します。",
          "当社からのご返信とその後のやり取りは、Google LLC（米国）が提供する Google Workspace のメール（info@kaikk.jp）で行い、保管します。",
          "これらのサーバーは日本国外にある場合があります。米国の個人情報保護制度については、個人情報保護委員会が公表している情報をご参照ください。",
          "保存した情報を閲覧できるのは、お問い合わせに対応する当社の担当者に限ります。通信は暗号化（HTTPS）します。",
        ],
        links: [{ label: "個人情報保護委員会：外国における個人情報の保護に関する制度等の調査", href: PPC_FOREIGN }],
      },
      {
        id: "services",
        title: "5. 外部サービスの利用",
        items: [
          "Cloudflare Turnstile（Cloudflare, Inc.）：お問い合わせフォームが自動プログラムから送信されることを防ぐために利用します。確認のため、Cloudflareがブラウザや端末の情報、IPアドレスなどを処理します。",
          "Cloudflare Web Analytics（Cloudflare, Inc.）：閲覧されたページ、参照元、ブラウザの種類、国・地域などを集計し、サイトの改善に利用します。Cookieなどの情報を端末に保存せず、個人を特定する目的では利用しません。",
        ],
        links: [
          { label: "Cloudflare プライバシーポリシー（英語）", href: CF_PRIVACY },
          { label: "Cloudflare Turnstile プライバシーに関する追補（英語）", href: TURNSTILE_PRIVACY },
          { label: "Google プライバシーポリシー", href: GOOGLE_PRIVACY },
        ],
      },
      {
        id: "third-parties",
        title: "6. 第三者への提供",
        paragraphs: [
          "法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供しません。個人情報を販売することはありません。",
          "第4項・第5項のクラウドサービスは、当社が情報を保管・処理するために利用するものです。個人情報の取扱いを外部に委託する場合は、委託先を適切に監督します。",
        ],
      },
      {
        id: "retention",
        title: "7. 保存期間",
        paragraphs: [
          `お問い合わせの内容は、最後のご連絡から${INQUIRY_RETENTION_MONTHS}か月を経過した後に削除します。ただし、ご契約に至った場合の契約関連の記録など、法令や契約により保存が必要なものを除きます。`,
          `送信回数の制限に使うハッシュ値は、${RATE_EVENT_RETENTION_HOURS}時間以内に削除します。`,
        ],
      },
      {
        id: "requests",
        title: "8. 開示などのご請求",
        paragraphs: ["当社が保有するご自身の個人情報について、利用目的の通知、開示、内容の訂正・追加・削除、利用の停止・消去、第三者への提供の停止、第三者提供記録の開示をご請求いただけます。info@kaikk.jp までご連絡ください。ご本人であることを確認したうえで、法令に従い、遅滞なく対応します。"],
      },
      {
        id: "contact",
        title: "9. お問い合わせ窓口",
        paragraphs: ["個人情報の取扱いに関するご質問・苦情は、KAI株式会社（info@kaikk.jp）までご連絡ください。"],
      },
      {
        id: "changes",
        title: "10. 改定",
        paragraphs: ["本方針の内容は、法令の改正や当社の取扱いの変更に応じて改定することがあります。改定後の内容は本ページで公表します。"],
      },
    ],
    effective: `制定日：${PRIVACY_EFFECTIVE.ja}`,
    languageNote: "",
  },
  en: {
    title: "Privacy Policy",
    navLabel: "Privacy Policy",
    intro: "KAI Inc. (\"KAI\", \"we\") complies with Japan's Act on the Protection of Personal Information (APPI) and related laws. This policy explains how we handle personal information received through this website (https://kaikk.jp) and through inquiries.",
    sections: [
      {
        id: "operator",
        title: "1. Who we are",
        facts: [
          { label: "Company", value: "KAI Inc. (KAI株式会社)" },
          { label: "Address", value: "Toho Hibiya Promenade Building 11F\n1-5-2 Yurakucho, Chiyoda-ku\nTokyo 100-0006, Japan" },
          { label: "Representative", value: "PHAM MINH TRI, Representative Director" },
          { label: "Contact", value: "info@kaikk.jp" },
        ],
      },
      {
        id: "collected",
        title: "2. Information we collect",
        items: [
          "Contact form: your name, email address, company (optional), topic (optional), message, page language and the time we received it.",
          "Email inquiries: your email address, name and signature, and whatever else you include.",
          `Abuse prevention: when the form is sent, your IP address is converted into a keyed hash that cannot be reversed, used only to limit repeated submissions, and deleted within ${RATE_EVENT_RETENTION_HOURS} hours. We do not store the IP address itself.`,
          "Information processed by Cloudflare Turnstile and Cloudflare Web Analytics (section 5).",
        ],
      },
      {
        id: "purpose",
        title: "3. Why we use it",
        paragraphs: ["We use personal information only to:"],
        items: [
          "reply to your inquiry and contact you about it;",
          "make proposals and quotations related to your inquiry, and arrange meetings;",
          "prevent spam and abuse, and keep this website secure;",
          "improve this website, using aggregated information that does not identify you.",
        ],
        after: ["If these purposes change, the change will stay reasonably related to the original purposes and will be published on this page."],
      },
      {
        id: "storage",
        title: "4. Where it is stored and how it is protected",
        items: [
          "Contact form submissions are stored in a database (Cloudflare D1) provided by Cloudflare, Inc. (United States).",
          "Our replies and any further correspondence take place in, and are kept in, Google Workspace email (info@kaikk.jp) provided by Google LLC (United States).",
          "These servers may be located outside Japan. For information on the data protection regime in the United States, see the material published by Japan's Personal Information Protection Commission.",
          "Only KAI staff who handle inquiries can access stored information. Data is encrypted in transit (HTTPS).",
        ],
        links: [{ label: "Personal Information Protection Commission: foreign data protection systems (Japanese)", href: PPC_FOREIGN }],
      },
      {
        id: "services",
        title: "5. Third-party services on this website",
        items: [
          "Cloudflare Turnstile (Cloudflare, Inc.) checks that the contact form is not being sent by an automated program. To do this, Cloudflare processes information about your browser and device, and your IP address.",
          "Cloudflare Web Analytics (Cloudflare, Inc.) counts pages viewed, referrers, browser types and countries so we can improve the site. It does not store cookies or similar data on your device and is not used to identify you.",
        ],
        links: [
          { label: "Cloudflare Privacy Policy", href: CF_PRIVACY },
          { label: "Cloudflare Turnstile Privacy Addendum", href: TURNSTILE_PRIVACY },
          { label: "Google Privacy Policy", href: GOOGLE_PRIVACY },
        ],
      },
      {
        id: "third-parties",
        title: "6. Sharing",
        paragraphs: [
          "We do not provide your personal information to third parties without your consent, except where required by law. We never sell personal information.",
          "The cloud services in sections 4 and 5 are used to store and process information on our behalf. Where we entrust the handling of personal information to a contractor, we supervise it appropriately.",
        ],
      },
      {
        id: "retention",
        title: "7. How long we keep it",
        paragraphs: [
          `Inquiries are deleted ${INQUIRY_RETENTION_MONTHS} months after our last contact with you, except records we must keep by law or under a contract, such as records of a contract you enter into with us.`,
          `Hashes used to limit repeated submissions are deleted within ${RATE_EVENT_RETENTION_HOURS} hours.`,
        ],
      },
      {
        id: "requests",
        title: "8. Your rights",
        paragraphs: ["You can ask us to tell you the purposes of use of the personal information we hold about you, to disclose it, to correct, add to or delete it, to stop using or erase it, to stop providing it to third parties, and to disclose records of any such provision. Email info@kaikk.jp. After confirming your identity, we will respond without delay as required by law."],
      },
      {
        id: "contact",
        title: "9. Contact",
        paragraphs: ["Questions or complaints about how we handle personal information: KAI Inc., info@kaikk.jp."],
      },
      {
        id: "changes",
        title: "10. Changes",
        paragraphs: ["We may update this policy when laws or our practices change. The current version is always published on this page."],
      },
    ],
    effective: `Effective: ${PRIVACY_EFFECTIVE.en}`,
    languageNote: "This is a translation of the Japanese policy. If the two differ, the Japanese version prevails.",
  },
};
