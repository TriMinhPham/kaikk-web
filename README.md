# kaikk-web

Corporate website for KAI株式会社 (KAI Inc.) — a Tokyo-based AI & IT systems development company.

- Production: https://kaikk.jp
- Stack: Next.js (App Router, static export), React, Tailwind CSS v4, TypeScript
- Locales: Japanese (default, `/`) and English (`/en`)

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run lint
npm run build  # static export to ./out
```

## Structure

- `src/app/(ja)` / `src/app/(en)/en` — locale route groups (same content components, different locale prop)
- `src/lib/content.ts`, `src/lib/marketing.ts` — page copy for both locales
- `src/lib/solutions.ts` — use-case pages (`/solutions/*`: AI adoption, business automation, generative AI)
- `src/lib/offer.ts` — commercial promises (free consultation, reply time, prices). All off by default; founder approval required to enable
- `src/lib/inquiry.ts` — contact form draft builder (mailto + Gmail/Outlook webmail drafts; nothing is sent by the site)
- `src/lib/site.ts` — site URL, canonical/hreflang helpers, JSON-LD structured data
- `src/app/sitemap.ts`, `src/app/robots.ts` — generated at build
- `docs/seo-geo-ideas.md` — backlog of SEO/GEO improvements requiring external action
- `docs/conversion-review.md` — conversion/SEO review with QA evidence (`docs/qa/<date>/`)
- `scripts/optimize-images.py` — regenerates grayscale AVIF/WebP/JPEG hero variants

## Tests

```bash
npm run build
node --experimental-strip-types --test tests/*.test.mjs
```
