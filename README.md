# kaikk-web

Corporate website for KAI株式会社 (KAI Inc.) — a Tokyo-based AI & IT systems development company.

- Production: https://kaikk.jp
- Stack: Next.js (App Router, static export), React, Tailwind CSS v4, TypeScript
- Hosting: Cloudflare Pages project `kaikk-jp` (direct upload) + one Pages Function (`/api/inquiry`) + D1 (`kaikk-inquiries`)
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
- `functions/api/inquiry.ts` — inquiry API (Pages Function): origin check, honeypot, Turnstile, per-IP rate limit, D1 insert, optional email. See `docs/inquiry-backend.md`
- `src/lib/inquiry-rules.ts` — limits, topics, retention period and Turnstile sitekey shared by the form and the API
- `src/lib/inquiry.ts` — email-draft fallback (mailto + Gmail/Outlook drafts) used when sending fails or JavaScript is off
- `src/lib/privacy.ts` — privacy policy text (`/privacy`, `/en/privacy`)
- `migrations/` — D1 schema; `wrangler.toml` — Pages bindings; `public/_headers` — security and cache headers
- `workers/inquiry-mailer/` — optional email-notification Worker (not deployed; needs Workers Paid)
- `src/lib/site.ts` — site URL, canonical/hreflang helpers, JSON-LD structured data
- `src/app/sitemap.ts`, `src/app/robots.ts` — generated at build
- `docs/seo-geo-ideas.md` — backlog of SEO/GEO improvements requiring external action
- `docs/conversion-review.md` — conversion/SEO review with QA evidence (`docs/qa/<date>/`)
- `scripts/optimize-images.py` — regenerates grayscale AVIF/WebP/JPEG hero variants

## Deploy (Cloudflare Pages)

Run from the repository root so `functions/` is included. Full steps, D1 queries and how to enable email: `docs/inquiry-backend.md`.

```bash
npm run build
npx wrangler d1 migrations apply kaikk-inquiries --remote          # only when migrations/ changed
npx wrangler pages deploy out --project-name kaikk-jp --branch <preview-branch>   # preview
npx wrangler pages deploy out --project-name kaikk-jp --branch main               # production
```

New inquiries (email notification is off; check regularly):

```bash
npx wrangler d1 execute kaikk-inquiries --remote --command "SELECT ref, created_at, locale, topic, name, email, company, message FROM inquiries WHERE notified_at IS NULL ORDER BY created_at"
```

## Tests

```bash
npm run build
node --experimental-strip-types --test tests/*.test.mjs   # export contract + inquiry API (SQLite-backed D1 fake)
npx wrangler pages functions build --outdir /tmp/kai-fn   # compile check of the Function
```
