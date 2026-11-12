# QA: inquiry backend, privacy pages, headers (2026-11-12)

Target: Cloudflare Pages preview `https://conversion.kaikk-jp.pages.dev` (branch `conversion`; final deployment `7b4cc505`). Production was not touched. Scripts: `scripts/` (Playwright + axe-core 4.10.3, run from a scratch dir with `playwright-core` and `axe-core` installed).

## Local checks

- `npm run lint`: 0 problems. `npm run build`: 24 static pages. `node --experimental-strip-types --test tests/*.test.mjs`: 51/51 pass (15 of them for the Function, against a SQLite-backed D1 fake that loads `migrations/0001_inquiries.sql`). `npx wrangler pages functions build`: compiled. `git diff --check`: clean.
- `wrangler pages dev out` with the Turnstile test secret: `/api/inquiry` returned `{ok:true, ref}` twice and stored the rows in local D1; a foreign Origin returned `forbidden_origin`; GET returned 405.

## Preview, API (curl)

| Request | Result |
|---|---|
| invalid Turnstile token | 403 `turnstile_failed` (proves `TURNSTILE_SECRET` is bound and siteverify is called) |
| no token | 400 `turnstile_missing` |
| honeypot filled | 400 `spam_suspected` |
| Origin `https://evil.example` | 403 `forbidden_origin` |
| GET | 405 |
| 6th attempt within an hour from one IP | 429 `rate_limited` |

D1 dump after these: `rate_events.ip_hash` 64 hex chars; the tester's public IP did not appear anywhere in D1.

## Preview, browser end-to-end

Turnstile does not issue tokens to automation-flagged Chrome (Playwright-launched, headless or headed: widget stays pending, `navigator.webdriver = true`). A normal Chrome 157 with a fresh profile, driven over the DevTools protocol (`navigator.webdriver = false`), passed the managed challenge without any click in about 1 s.

- `e2e-ja.json`, `e2e-en.json`: `?topic=business-automation` preselected; Turnstile token obtained; `POST /api/inquiry` 200 `{ok:true, ref}`; confirmation panel 「送信しました」/"Sent" with the reference, focused; no CSP violations on the page. Rows (marked 【テスト】/[TEST], `qa-test@example.com`) were confirmed with `wrangler d1 execute --remote`, `email_status = 'disabled'`, `notified_at = NULL`; the documented "new since last check" query returned the row and the `UPDATE … notified_at` worked. All test rows and rate events were then deleted (`inquiries` 0, `rate_events` 0).
- `fallback-results.json`: API forced to 500 (JA/EN) → failure panel, never "sent", focus moved, mailto/Gmail/Outlook drafts addressed to info@kaikk.jp, text kept, axe 0. Turnstile script blocked → submit goes straight to the email fallback, 0 API calls, axe 0. Token still pending → "please wait" message, nothing sent. "Send by email instead" → "not sent yet" panel. No JS → `mailto:` POST form, privacy link, noscript note.
- `sent-results.json`: confirmation state at 1440/390/320, JA/EN (Turnstile and API stubbed): payload has only the expected keys, topic sent as the fixed value, elapsed ≥ 3 s, focus on the panel, no overflow, axe 0.
- `turnstile-widget-*.png`: widget renders normal size at 390 and 1440 and compact at 320 (272 px column), no horizontal overflow.

## Preview, full-site browser QA

`browser/preview-results.json`: 18 routes (9 JA + 9 EN incl. `/privacy`) × 1440×1000, 390×844, 320×740 = 54 cases. All HTTP 200, one H1, no horizontal overflow, all images loaded, primary CTA above the fold where present, axe 0 violations (WCAG 2.0/2.1 A/AA). Privacy pages re-run after a layout fix (`browser/privacy-results.json`, 6 cases, same results).

Console errors appear only on the contact pages and come from inside the Turnstile iframe (Cloudflare's own CSP, which lists `hagen.challenges.cloudflare.com` etc., blocking a `data:` fetch). The page's own `securitypolicyviolation` listener recorded none.

## Headers (preview)

`curl -I`: `content-security-policy`, `strict-transport-security: max-age=31536000`, `x-frame-options: DENY`, `permissions-policy` on HTML; `cache-control: public, max-age=31536000, immutable` on `/_next/static/*`. In the browser, Turnstile loaded and passed under the CSP, and loading `https://static.cloudflareinsights.com/beacon.min.js` plus a no-cors request to `https://cloudflareinsights.com/` raised no CSP violation. The real auto-injected beacon only exists on kaikk.jp, so it is checked after the production deploy, not here.

Screenshots reviewed by eye: contact form with widget, success panel, failure panel, privacy pages (JA/EN, three sizes).

Not done: Safari/Firefox; screen reader; real email delivery (disabled by decision); production.
