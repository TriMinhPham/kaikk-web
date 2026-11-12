# KAI website: conversion, SEO/GEO and performance review

- Reviewed: `feat/seo-geo` at `1394015` (2026-11-12). Changes made on local branch `feat/conversion`.
- Reviewer: Claude Opus 5.5 (`claude-opus-5-5`), at the founder's request.
- Method: read all source under `src/`, `docs/`, `tests/`, `public/`; ran the build and tests; browsed every route (JA and EN) in headless Chrome at 1440×1000, 390×844 and 320×740, with axe-core 4.10.3 (WCAG 2.0/2.1 A and AA) and Lighthouse 12 (mobile and desktop presets). Evidence is in `docs/qa/2026-11-12/`.
- Line numbers below refer to `1394015` (the code before this branch).

## Priorities at a glance

| # | Priority | Area | Finding | Status on `feat/conversion` |
|---|---|---|---|---|
| 1 | P0 | Conversion | Hero says what KAI aspires to, not who it serves or what changes for them | Rewritten (founder to approve copy) |
| 2 | P0 | Conversion | Inquiry needs a configured desktop mail app. If none opens, there is no visible fallback except "copy" | Webmail draft links, "not sent yet" panel, focus management |
| 3 | P0 | SEO/GEO | Only 5 indexable pages per locale; nothing matches what SME buyers search for (中小企業 AI導入, 業務自動化, 生成AI 社内活用) | 3 use-case pages × 2 locales |
| 4 | P1 | Trust | 法人番号 (verifiable on the NTA public site) not shown; only 会社法人等番号, which the public cannot look up easily | Shown with NTA link on home, company page, footer, JSON-LD, llms.txt |
| 5 | P1 | Conversion | Company page is a dead end (0 links in main); generic "お問い合わせ" CTA everywhere | One primary CTA ("まずは相談する" / "Discuss your project") at each decision point, on every page |
| 6 | P1 | Performance | 297 KB 1400px hero JPEG plus CSS grayscale filter; mobile LCP 3.5 s. The JPEG was also downloaded on `/contact` | AVIF/WebP/JPEG responsive variants, pre-rendered grayscale; mobile LCP 2.5–2.6 s |
| 7 | P1 | Bug | `out/404.html` has no `<html>`, `<head>` or `lang` | Proper bilingual 404 |
| 8 | P2 | SEO | `og:url` missing on every page; no FAQPage/BreadcrumbList/Service structured data; generic title tags | Fixed |
| 9 | P2 | UX | `/process` still uses the legacy design (centred, rounded pill CTA, English "Step 1" in JA, h1→h3 skip) | Rebuilt in the current design system, with cost/contract/NDA notes |
| 10 | P2 | Docs | `docs/seo-geo-ideas.md` still says kaikk.co.jp and 「株式会社KAI」 (wrong name order) | Corrected |

## 1. Conversion blockers

1. **Abstract value proposition.** `src/lib/marketing.ts:4-5` — 「AIを、事業の確かな力に。」/「業務を理解し、小さく検証する。…」. A Japanese SME owner cannot tell from the hero whether KAI is for them or what it will change. EN `:49` "Make AI work. For your business." is generic. Evidence: `before-ja-home-1440.png`.
2. **Mail-app dependency without a visible fallback.** `src/components/pages/ContactContent.tsx:15-20` sets `window.location.href` to a `mailto:` URL and shows 「メールアプリで送信を完了してください」. Visitors who use Gmail/Outlook in the browser, which is common in small offices, see nothing open. The only fallback is "copy". The status text also assumes the app opened.
3. **Friction in the form.** `ContactContent.tsx:36` — all four fields required, including 会社名 (sole proprietors and early-stage enquirers drop out). There is no way to say what the enquiry is about, so it cannot be triaged. On mobile the guide `<aside>` sits before the form and pushes the first field about 560 px down (`before-contact-390-full.png`).
4. **CTA is generic and missing at decision points.** "お問い合わせ" (`HomeContent.tsx:18,66`) is a navigation label, not an invitation to a low-commitment first step. The company page (`CompanyContent.tsx:1-13`), where buyers go to check credibility, has no CTA at all. The services page only has one at the bottom.
5. **No content for buyer search intent.** Only home/services/process/company/contact exist. The services copy is thin, and the EN services page lacks most of the JA bullet lists (`content.ts:264-288`). Nothing answers "how do I start with AI", "can you automate our spreadsheets", "how do we use ChatGPT safely".
6. **No process transparency after inquiry.** Visitors are not told what happens after they write (reply → meeting → proposal → decide).

## 2. Trust gaps (all fixes use verifiable facts only)

1. **法人番号 missing.** The registry number on the company page (`content.ts:140`) is 会社法人等番号. The public 13-digit 法人番号 1010001262744 (check digit + 会社法人等番号) appears on the National Tax Agency site with KAI株式会社 and the Yurakucho address (checked 2026-11-12: https://www.houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=1010001262744). It is the standard way Japanese buyers check a new company.
2. **Unrendered response-time promise.** `content.ts:152,160,312,320` — 「通常2営業日以内にご返信いたします」/"within two business days". It is not currently shown, but it is a commitment waiting to be reused by accident. Removed. The founder can now enable it in one place (`src/lib/offer.ts`).
3. **New-company status should be stated plainly, not hidden.** No case studies exist. Silence makes visitors guess. The new pages say once, plainly, that KAI was founded in 2026 and has no published case studies yet, and point to the sourced founder background. This matches the existing proof note (`marketing.ts:22,67`) and helps answer engines cite KAI accurately.
4. **Kept as-is (good):** founder credentials with independent sources and an explicit "not KAI client work" note (`Expertise.tsx`), NDA/contract statements, no fabricated proof, honest form.

## 3. SEO / GEO technical

1. `og:url` absent on all pages (layouts set `openGraph` without `url`). Shared links carry no canonical URL.
2. Structured data: Organization/WebSite only. No `FAQPage` for the visible home FAQ, no `BreadcrumbList`, no `Service`. Organization lacked `identifier` (法人番号), `contactPoint`, `knowsLanguage`. Note: Google has shown FAQ rich results only for authoritative government and health sites since 2023, so the value of FAQPage here is entity/answer-engine understanding, not SERP snippets.
3. Title tags: home 「KAI株式会社｜AI・ITシステム開発」 does not include 中小企業 / AI導入 / 業務自動化.
4. `out/404.html` started with `<script …>`: no `<html lang>`, `<head>` or body styles, because the root layout (`src/app/layout.tsx`) returns bare children. Cloudflare Pages serves this file for unknown URLs.
5. `public/llms.txt` lacked the corporate number and incorporation date ("Founded: 2026"), and gave no guidance against citing founder history as client work.
6. Sitemap alternates lacked `x-default` (pages have it). Minor.
7. Japanese headings and paragraphs break mid-word (「このようなお悩/みは」). Fixed with `word-break: auto-phrase` (Chrome 119+; other browsers keep current behaviour).
8. `docs/seo-geo-ideas.md` items 1, 2, 3, 13 and the final assumption were stale (kaikk.co.jp, 「株式会社KAI」, "mailto silently fails").

## 4. Performance (Core Web Vitals)

Lighthouse 12.x, simulated throttling, static export served by `serve` (gzip on, like Cloudflare). Full numbers: `docs/qa/2026-11-12/lighthouse-summary.json`.

| Page | Preset | Before perf / LCP / transfer | After perf / LCP / transfer |
|---|---|---|---|
| `/` | mobile | 91 / 3.5 s / 484 KiB | 97 / 2.6 s / 236 KiB |
| `/en` | mobile | 91 / 3.5 s / 482 KiB | 97 / 2.6 s / 235 KiB |
| `/contact` | mobile | 98 / 2.3 s / 472 KiB | 98 / 2.3 s / 188 KiB |
| `/services` | mobile | 99 / 2.2 s / 465 KiB | 98 / 2.3 s / 180 KiB |
| `/` | desktop | 100 / 0.8 s / 503 KiB | 100 / 0.5 s / 258 KiB |

CLS 0 and TBT ≤ 40 ms before and after. Accessibility, Best Practices and SEO scored 100 in every run. A one-point difference is within run-to-run noise.

- The LCP element on mobile home was the hero photo: `/images/tokyo.jpg`, 1400 px and 297 KB, rendered at 364 px wide with `filter: grayscale(100%) contrast(.9)` (`globals.css:44`).
- **The 297 KB JPEG was also downloaded on `/contact` and `/services`** (Lighthouse network log, before). The likely cause is the image preload hint inside the prefetched home RSC payload (`fetchPriority="high"` `<img>`). With `<picture>`/`srcset` it no longer happens (after: no hero bytes on those pages).
- Remaining: about 190 KiB of framework JS is reported as unused (React/Next runtime). Not addressed: no low-risk change was available. Cache headers depend on Cloudflare (see next steps).

## 5. Accessibility

- axe-core: 0 violations before and after on all tested cases (48 after: 16 routes × 3 viewports; plus the contact page after submission and the 404 page).
- Before: `/process` jumped h1→h3 (`ProcessContent.tsx:44`). After submission, focus was not moved, so keyboard users had no path to a fallback. Both fixed.
- This is automated evidence only. No screen-reader session was run.

## 6. Copy quality

- JA copy is mostly natural, polite B2B Japanese. Issues: the hero (above); 「PoC」 used without explanation for owners unfamiliar with the term (now 「小規模な検証（PoC）」); the eyebrow 「AI・ITシステム開発 / KAI株式会社」 repeats the logo and could carry the audience instead (now 「中小企業のAI導入・業務自動化」).
- EN: hero fragments ("Make AI work. For your business.") read as filler. The rest of the EN copy reads idiomatically.

## 7. Bugs found

1. `out/404.html` incomplete document (above).
2. `scripts/preview.py` rewrote extensionless paths for GET but not HEAD, so `curl -I /contact` returned 301 while GET returned 200. Fixed.
3. Environment only (not a repo bug): `next build` warns about extra lockfiles in `/Users/user` and `/Users/user/AI` and infers the wrong workspace root. Left alone: removing someone's home-directory lockfile is out of scope.

## What changed on `feat/conversion`

- **Hero and CTA:** audience-first hero (`marketing.ts`); one primary CTA label, 「まずは相談する」 / "Discuss your project", in the hero, after the approach section, and in a shared `CtaBlock` at the end of every page except contact. Reassurance chips use only confirmed facts: no specification needed, NDA, JA/EN.
- **Trust strip:** Tokyo/founded Feb 2026, 法人番号 with NTA link, NDA and formal contracts, JA/EN.
- **Use-case pages:** `/solutions/{ai-adoption,business-automation,generative-ai}` and the `/en` equivalents (`src/lib/solutions.ts`, `SolutionContent.tsx`). Each has concerns, examples, steps, deliverables, honest caveats, 3 FAQs, related links and a CTA that preselects the topic. No clients, results, prices or guarantees.
- **Inquiry flow:** company optional; optional topic chips (also set via `?topic=`); hint text replaces the pre-form guide; after submit, a focused panel says the inquiry **has not been sent** and offers Gmail and Outlook (Microsoft 365) draft links; copy includes the address and subject; the no-JS `mailto` POST fallback is kept; "what happens next" is shown beside the form.
- **Commercial promises isolated:** `src/lib/offer.ts` (all `null`). A test fails if any appears in the export while they are off.
- **SEO/GEO:** `pageMetadata()` gives every page a full OG/Twitter set, including `og:url`; new titles and descriptions; Organization `identifier`/`contactPoint`/`knowsLanguage`; `BreadcrumbList` on all subpages; `FAQPage` only where FAQs are visible; `Service` on services and solution pages; sitemap with new routes and `x-default`; llms.txt rewritten with citation notes; footer links to solution pages; locale switcher covers the new routes.
- **Performance:** `scripts/optimize-images.py` generates grayscale 480/800/1200 AVIF and WebP plus a 1200 JPEG fallback; `HeroPhoto` uses `<picture>`; the CSS filter is removed.
- **Process/company pages:** current design, breadcrumbs, cost/contract/NDA/PoC-optional notes, CTA; 法人番号 placed beside 会社法人等番号.
- **404:** complete bilingual document with links home, to contact and to EN.
- **Tests:** 15 → 31 (export contract for 16 routes incl. og:url and breadcrumb; FAQ JSON-LD equals visible FAQ; Service provider link; banned-claims scan; sitemap and llms coverage; responsive image variants; 404; company registry numbers; inquiry topic/optional company/webmail/injection; offer defaults).

## Needs founder approval before merge

1. New positioning copy: 「定型業務を、AIで軽く。」 plus the intro, and EN "Cut the busywork. Keep what works."
2. Operational statements on new pages. Please confirm each is true for how KAI works:
   - PoC-only engagements accepted.
   - Replies come from info@kaikk.jp.
   - A meeting (打ち合わせ) follows the first reply.
   - PoC can be skipped when requirements are clear.
   - Maintenance covers changes after automation.
   - KAI does not assume a specific AI vendor.
   - Human review is designed in.
3. Public disclosure lines: 「2026年2月設立」 on the home trust strip, and 「公開できる導入事例はまだありません」 on solution pages.
4. Gmail and Outlook draft links. They go to third-party domains, but only when the visitor clicks. No tracking, nothing sent.
5. `src/lib/offer.ts` values (free consultation length, reply time, PoC starting price). All are off. Turning any on is a commercial promise.

## Recommended next steps (not implemented)

| Step | Expected impact | Why not done here |
|---|---|---|
| Real inquiry endpoint (Cloudflare Worker + Turnstile + transactional email), with privacy notice and retention policy | Highest conversion lever. Removes mail-app dependence entirely | Needs provider choice, APPI privacy text and delivery testing |
| Privacy policy page (個人情報の取扱い) | Expected on JP corporate sites. Required before any backend | Needs legal review |
| Cookieless Cloudflare Web Analytics (no cookies, no personal data) | Makes conversion measurable (CTA clicks → contact page → draft opened) | Third-party script needs founder approval |
| Search Console and Bing Webmaster: submit `https://kaikk.jp/sitemap.xml`; request indexing of the 6 new pages | Faster discovery. Bing feeds several answer engines | Requires account access |
| One real, provenance-labelled demonstration (internal tool or anonymised PoC) with a screenshot | Strongest credibility asset for a new company | Requires real work and Director approval |
| Japanese per-page OG images (Noto Sans JP, OFL) | Better LINE/Slack/X share previews in Japanese | Design decision; current OG is Latin-only |
| Booking link for the first meeting (e.g. a scheduling tool) | Lowers friction from email ping-pong | Vendor and privacy decision |
| `_headers` / Cloudflare cache rule: `Cache-Control: public, max-age=31536000, immutable` for `/_next/static/*` | Faster repeat visits | Needs a check of the live Cloudflare config |
| 適格請求書発行事業者登録番号, phone number, `sameAs` profiles (LinkedIn etc.) | B2B buyers check invoice registration. Stronger entity signals for GEO | Facts not provided |

## Verification (this branch)

```sh
npm ci
npm run lint                     # 0 problems
npm run build                    # 22 static pages
node --experimental-strip-types --test tests/*.test.mjs   # 31/31 pass
git diff --check                 # clean
```

Browser QA, headless Chrome via Playwright, run against `serve out`:

- 16 routes × 3 viewports = 48 cases: HTTP 200, one H1, no horizontal overflow, no console errors, all images loaded, axe 0 violations. Primary CTA visible without scrolling on all home and solution pages at 1440, 390 and 320 (`browser-results.json`).
- Inquiry flows, JA and EN (`flow-results.json`):
  - `?topic=` preselects the topic; unknown values are ignored.
  - Empty submit is blocked by native validation.
  - Valid submit stays on the page, shows the "not sent yet" panel and moves focus to it.
  - Gmail link carries the address, subject and body.
  - Copy works; clipboard permission was granted in a test browser profile, not the system clipboard.
  - axe after submit: 0.
  - No-JS: form posts `mailto:` with `text/plain`.
  - Mobile menu opens and closes; FAQ expands; EN switch keeps the path.
  - Solution CTA lands on `/contact?topic=…` with the topic selected.
  - 404 is a full document with axe 0.
- Screenshots reviewed visually: `docs/qa/2026-11-12/*.png` (before and after).
- Not done: real email delivery; Gmail/Outlook compose while signed in; Safari/WebKit and Firefox; Google Rich Results Test on the live site; screen-reader testing.
