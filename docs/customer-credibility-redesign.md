# KAI website: customer acquisition and credibility revision

Status: verified build and private review preview. Publishing this branch to GitHub does not merge it into the production branch.

## Confirmed identity

- Public origin: https://kaikk.jp. Director confirmed the company does not yet have kaikk.co.jp.
- Public contact: info@kaikk.jp, explicitly corrected/confirmed by Director. No email delivery test was sent.
- Legal name: KAI株式会社; incorporation 2026-02-05; capital JPY5,000,000; company registration 0100-01-262744.
- Corporate details were checked against registry evidence. No personal address or private financial evidence is included.

## Design read

Trust-first bilingual corporate development consultancy for Japanese SMEs. Restrained editorial aesthetic, existing royal-blue accent, warm light background, consistent sharp/3px geometry. Variance 5/10; motion 2/10; density 4/10. No new design-system dependency.

## Changes

- Replaced generic centered hero/card grid with customer-focused split hero, Tokyo city photography and clear contact CTA.
- Added concrete service examples and proposed deliverables, not unverified claims of achieved customer results.
- Added founder background with independent VnExpress and official IP Vietnam source links. Explicitly separated founder prior credentials from KAI client engagements.
- Added practical project approach and FAQs covering unclear requirements, estimates, confidential data and existing-tool integrations.
- Reworked services, company and contact pages, header and footer in Japanese and English; preserved routes and primary navigation labels.
- Corrected canonical origin, sitemap/robots source origin, structured data, discovery text and public contact address.
- Removed unsubstantiated subsidy marketing from retained content and removed hydration-dependent hidden content.
- Inquiry form honestly opens an email draft. Copy + selectable-preview fallbacks remain available. No backend submission or sent-success claim. Original company/name/email/message field order retained; accessible labels and native validation added. No-JavaScript mailto POST fallback prevents form data becoming GET query parameters.
- Added skip links, keyboard-safe mobile navigation and keyboard focusability for legacy /isekai code scroll regions. /isekai remains noindex.

## Credential sources

1. https://e.vnexpress.net/news/business/kardiachain-ceo-aims-to-popularize-blockchain-in-vietnam-4216634.html
   - Direct extraction confirmed historical KardiaChain co-founder role in 2018. Google employment belongs to co-founder Huy Nguyen, not PHAM MINH TRI. No current CEO title claimed.
2. https://ipvietnam.gov.vn/documents/20182/2190733/53047.pdf/a27b9eb3-e5ac-40bd-9043-d549420fb463
   - Official Vietnam patent record 1-0053047; research corroborated indexed patent number, title and co-inventor names. Full PDF extraction timed out in the credential review; do not claim a direct full-document legal review.
3. https://phamminhtri.com/dual-node-patent
   - Direct extraction corroborated patent identifier, technical title and co-inventors. Founder-owned supporting page, not independent validation.

## Asset provenance

`public/images/tokyo.jpg`: downloaded from https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1400&q=85. Tokyo city-context photo, not presented as a KAI office or project. Existing KAI brand SVGs retained. No AI-generated office, fabricated dashboard or customer logos.

## Verification executed

From the repository root:

```sh
npm run lint
npm run build
node --experimental-strip-types --test tests/inquiry.test.mjs tests/export.test.mjs
git diff --check
```

Results: lint passed; optimized Next.js static build and TypeScript passed; 15 Node tests passed; diff whitespace check passed. Node emitted a non-blocking MODULE_TYPELESS_PACKAGE_JSON warning when directly loading TypeScript test code; no dependency changes were made for this warning.

Real-Chrome QA results are stored in `docs/qa/2026-11-10/browser-results.json`, alongside screenshots:

- 15 browser cases across 11 unique routes, including preserved /isekai.
- Both homepages checked at actual 1440x1000, 390x844 and 320x740 viewports. Headline remains two lines; primary contact CTA visible without scrolling.
- No horizontal overflow in tested cases.
- axe-core 4.10.3 WCAG2 A/AA and WCAG2.1 A/AA automated checks: zero violations in tested cases. This is automated evidence, not a complete accessibility certification.
- Japanese/English FAQ expansion and mobile menu open/close passed.
- Both inquiry pages: associated labels, required-field validation, copy behavior and denied-clipboard fallback passed. Clipboard was stubbed in-page; no system clipboard overwrite or inquiry send occurred.
- Every page has one H1, expected canonical/hreflang, valid organization JSON-LD and no obsolete domain in exported marketing HTML.
- Browser task wrapper confirmed session closure.
- Independent image review was unavailable. Screenshot capture, measured layout, interaction and axe results remain verified, but do not replace aesthetic approval.

## Local preview

```sh
python3 scripts/preview.py --port 4399
```

Loopback only: http://127.0.0.1:4399 and /en. Serves the production static export with extensionless paths. A separately configured private-network proxy can provide remote review access; this command alone does not expose the server externally.

## Remaining release decisions

- Director approval is required to publish the revised site.
- Mailto is deliberately honest but higher-friction than a real inquiry backend. A production contact endpoint needs approved delivery provider, privacy/retention copy, validation, spam controls and end-to-end delivery verification. Do not imply this revision solved server-side lead delivery.
- No invented case studies were added. Highest-value further credibility asset: one Director-approved customer/internal demonstration with a real screenshot, scoped problem and measured result, clearly labeled by provenance.
- No acquisition or conversion improvement is measured yet; that requires deployment approval and actual visitor/inquiry evidence.
