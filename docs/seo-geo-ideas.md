# SEO / GEO ideas — needs external action or a decision

Backlog of improvements that could not be done in code alone (accounts, services, content, or business decisions required). Done in code already: sitemap, robots.txt, canonical + hreflang, per-page titles/descriptions, OG/Twitter meta, build-time OG image, JSON-LD (Organization/ProfessionalService/WebSite), llms.txt, noindex on /isekai.

## High impact

1. **Google Search Console + Bing Webmaster Tools** — verify kaikk.co.jp ownership, submit `https://kaikk.co.jp/sitemap.xml`. Without this, indexing is slow and invisible. Bing powers ChatGPT search — matters for GEO too.
2. **Google Business Profile** — register 株式会社KAI at the Yurakucho address. Biggest lever for local ("geo") searches like「AI開発 東京」and Google Maps visibility. Needs postcard/phone verification at the office.
3. **Contact form backend** — current form posts to `mailto:`, which silently fails in most browsers. Static export has no server, so use Formspree, Basin, or a small Cloudflare Worker/API endpoint. A broken contact form loses every lead SEO wins.
4. **Content/blog section** — the single biggest ongoing SEO+GEO lever. Case studies (導入事例) and short articles targeting queries like「中小企業 AI導入 補助金」「業務自動化 事例」. AI engines cite pages with concrete, factual content.

## Medium impact

5. **Exact geo coordinates in JSON-LD** — add `geo` (latitude/longitude) to the ProfessionalService schema once confirmed from Google Maps for the Toho Hibiya Promenade Building. Left out to avoid publishing approximate coordinates.
6. **Phone number** — schema and footer have email only. A phone number (`telephone` in JSON-LD + `contactPoint`) increases trust signals for local SEO. Business decision.
7. **Designed OG image** — current one is generated at build (KAI wordmark + tagline, Latin text only, since Japanese glyphs need an embedded font). A designer-made 1200×630 with Japanese copy would look better in Slack/LINE/X shares. Replace `src/app/opengraph-image.tsx` or drop a static `opengraph-image.png` in `src/app/`.
8. **Privacy policy page (プライバシーポリシー)** — expected on Japanese corporate sites, needed once the contact form stores data, and a trust signal for both users and search engines. Needs legal review of the text.
9. **Analytics** — GA4 or privacy-friendly (Plausible/Umami) to see which queries/pages convert. Needs account + script.
10. **sameAs links in JSON-LD** — add LinkedIn / X / GitHub / Wantedly profiles once they exist. Strong entity signal for GEO (helps AI engines connect the company across sources).

## Lower impact / later

11. **Backlinks & citations** — Japanese business directories, PR TIMES press release for company founding, partner sites, 法人番号公表サイト presence. Consistent NAP (name/address) everywhere.
12. **IndexNow** — instant Bing/Naver indexing on deploy; small script in CI.
13. **Hosting-level canonicalization** — 301 www→apex (or reverse), enforce https, correct 404 handling for the static export at whatever host serves kaikk.co.jp (currently a domain/host decision, not repo code).
14. **FAQ section + FAQPage schema** — real customer questions (料金、開発期間、補助金対応…) on services or a dedicated page. Good for both featured snippets and AI answers.
15. **Case-study rich results** — once 導入事例 exist, mark up with appropriate schema.
16. **Multilingual expansion of llms.txt** — keep `public/llms.txt` updated as pages/services change; consider llms-full.txt with page contents.

## Assumption made in code

- Production URL assumed to be `https://kaikk.co.jp` (from info@kaikk.co.jp). If the site will live on `www.kaikk.co.jp` or another domain, change `SITE_URL` in `src/lib/site.ts`.
