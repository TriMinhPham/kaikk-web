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
- `src/lib/content.ts` — all page copy for both locales
- `src/lib/site.ts` — site URL, canonical/hreflang helpers, JSON-LD structured data
- `src/app/sitemap.ts`, `src/app/robots.ts` — generated at build
- `docs/seo-geo-ideas.md` — backlog of SEO/GEO improvements requiring external action
