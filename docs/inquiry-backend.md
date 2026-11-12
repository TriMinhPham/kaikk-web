# Inquiry backend (contact form → Cloudflare Pages Function → D1)

## How it works

```
/contact (static page)
  ├─ Turnstile widget (explicit render; script loaded only on /contact and /en/contact)
  └─ fetch POST /api/inquiry  (JSON)
        functions/api/inquiry.ts  (Pages Function)
          1. method POST, same-origin Origin (kaikk.jp, www.kaikk.jp, *.kaikk-jp.pages.dev, localhost), Sec-Fetch-Site
          2. JSON only, body ≤ 16 KB
          3. honeypot `website` empty, fill time ≥ 3 s
          4. field rules (src/lib/inquiry-rules.ts): name ≤160, email (format, ≤254), company ≤160 optional,
             topic ∈ fixed list optional, message ≤3000, locale ja|en
          5. rate limit: 5 attempts / hour per HMAC-SHA-256(IP) in D1 `rate_events` (raw IP never stored, rows purged after 24 h)
          6. Turnstile siteverify (secret, token, remoteip; checks action and hostname)
          7. INSERT into D1 `inquiries` → only then {ok:true, ref:"KAI-XXXX-XXXX"}
          8. optional EMAIL notification (disabled; see below)
          9. purge inquiries older than INQUIRY_RETENTION_MONTHS (24) and rate events older than 24 h
```

The browser says 「送信しました」/"Sent" only after `{ok:true, ref}`. Any other answer (validation, Turnstile, rate limit, storage, network, timeout, Turnstile script blocked) shows the email-draft fallback (mailto, Gmail, Outlook, copy), with the visitor's text kept. Without JavaScript the form is the original `mailto:` POST form.

Error codes: `method_not_allowed` 405, `forbidden_origin` 403, `unsupported_media_type` 415, `payload_too_large` 413, `invalid_json` 400, `spam_suspected` 400, `too_fast` 400, `invalid_field` 400 (+`field`), `turnstile_missing` 400, `turnstile_failed` 403, `turnstile_unavailable` 502, `rate_limited` 429, `not_configured` 503, `storage_failed` 500. Logs contain only event names and these codes; no names, emails, messages or IPs.

## Resources

| Item | Value |
|---|---|
| D1 database | `kaikk-inquiries`, id `69754064-3bf1-493a-8721-2e2f0d994c42`, region APAC |
| Migrations | `migrations/` (`0001_inquiries.sql`, applied to remote on 2026-11-12) |
| Pages config | `wrangler.toml` (binding `DB`; `pages_build_output_dir = "out"`) |
| Turnstile | sitekey `0x4AAAAAAF9puhYoA_2XeJzt` (public, in `src/lib/inquiry-rules.ts`), secret in Pages secret `TURNSTILE_SECRET` (production and preview) |
| Optional secret | `IP_HASH_SALT` (HMAC key for IPs). If unset, `TURNSTILE_SECRET` is used as the key |
| Headers | `public/_headers` (CSP, HSTS, X-Frame-Options, Permissions-Policy, immutable cache for `/_next/static/*`) |

`wrangler.toml` becomes the source of truth for bindings: a deployment on a non-`main` branch sets the configuration of all preview deployments, a deployment on `main` sets production. Secrets are not in the file and are not changed by deployments.

## Deploy

Run from the repository root so `functions/` is bundled.

```sh
npm ci
npm run lint && npm run build
node --experimental-strip-types --test tests/*.test.mjs
npx wrangler pages functions build --outdir /tmp/kai-fn     # compile check of the Function

# Only when migrations/ changed (idempotent; lists nothing to apply if up to date):
npx wrangler d1 migrations apply kaikk-inquiries --remote

# Preview (https://<branch>.kaikk-jp.pages.dev):
npx wrangler pages deploy out --project-name kaikk-jp --branch conversion
# Production:
npx wrangler pages deploy out --project-name kaikk-jp --branch main
```

Local development with the Function: create `.dev.vars` (git-ignored) with Cloudflare's always-pass test secret `TURNSTILE_SECRET=1x0000000000000000000000000000000AA`, run `npx wrangler d1 migrations apply kaikk-inquiries --local`, then `npx wrangler pages dev out`. The real sitekey does not work on localhost, so the browser form falls back to email locally; test the API with `curl -H 'origin: http://localhost:8788' …`.

## Reading inquiries

**Email notification is off, so new inquiries are only in D1. Someone must check D1 (or run a poller) or inquiries will go unanswered.**

New since last check (not yet marked notified), one line:

```sh
npx wrangler d1 execute kaikk-inquiries --remote --command "SELECT ref, created_at, locale, topic, name, email, company, message FROM inquiries WHERE notified_at IS NULL ORDER BY created_at"
```

Mark them as seen (use the `created_at` of the newest row you processed, so rows that arrived meanwhile stay unmarked):

```sh
npx wrangler d1 execute kaikk-inquiries --remote --command "UPDATE inquiries SET notified_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE notified_at IS NULL AND created_at <= '2026-11-12T03:48:52.385Z'"
```

Other useful queries:

```sh
# Everything since a timestamp (index on created_at):
npx wrangler d1 execute kaikk-inquiries --remote --command "SELECT ref, created_at, name, email, topic FROM inquiries WHERE created_at > '2026-11-01T00:00:00Z' ORDER BY created_at"
# One inquiry by the reference the visitor quotes:
npx wrangler d1 execute kaikk-inquiries --remote --command "SELECT * FROM inquiries WHERE ref = 'KAI-XXXX-XXXX'"
# Mark answered:
npx wrangler d1 execute kaikk-inquiries --remote --command "UPDATE inquiries SET handled_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE ref = 'KAI-XXXX-XXXX'"
# Deletion request (APPI): delete by email
npx wrangler d1 execute kaikk-inquiries --remote --command "DELETE FROM inquiries WHERE email = 'person@example.com'"
```

An external poller (cron on a trusted machine with `wrangler` logged in, or a D1 REST API token scoped to D1 read/write) can run the first query, forward each row to info@kaikk.jp by its own means, then run the update. `notified_at` is nullable and indexed together with `created_at` (`inquiries_unnotified`).

## Email notification (disabled)

Decision (2026-11-12): no Workers Paid upgrade, so Cloudflare Email Service sending stays off. Do not enable Cloudflare Email Routing either: it requires Cloudflare MX records and would take kaikk.jp mail away from Google Workspace.

The code already supports it. When `env.EMAIL` exists, the Function sends a plain-text message to `info@kaikk.jp` from `inquiry@kaikk.jp`, `replyTo` = the visitor's validated address, subject with the reference and a single-line name. The visitor cannot choose the recipient. If sending throws, the inquiry stays stored, the visitor still gets `{ok:true, ref}`, and the row gets `email_status = 'failed'`; on success `email_status = 'sent'` and `notified_at` is set.

Pages Functions cannot hold a `send_email` binding, so enabling it later takes a small Worker:

1. Upgrade to Workers Paid and onboard `kaikk.jp` as an Email Service sending domain (adds SPF/DKIM records for sending; MX stays with Google).
2. `cd workers/inquiry-mailer && npx wrangler deploy` (its `wrangler.toml` restricts the binding to destination `info@kaikk.jp` and sender `inquiry@kaikk.jp`).
3. Uncomment the `[[services]] binding = "EMAIL"` block in the root `wrangler.toml` and redeploy Pages.

The mailer Worker has not been deployed or run (it needs the paid plan); treat it as untested.

## Retention and privacy

- `INQUIRY_RETENTION_MONTHS = 24` in `src/lib/inquiry-rules.ts` (needs founder approval). The privacy pages render this number. The Function deletes D1 rows older than this, counted from receipt (never later than the last contact). Copies in Google Workspace mail must be deleted by hand.
- `RATE_EVENT_RETENTION_HOURS = 24` for hashed IPs.
- Privacy policy: `src/lib/privacy.ts` → `/privacy`, `/en/privacy`.

## Security headers

`public/_headers` applies to static files only (Functions set `cache-control: no-store` and `x-content-type-options` themselves). The CSP allows `challenges.cloudflare.com` (script, frame), `static.cloudflareinsights.com` (script) and `cloudflareinsights.com` (connect) for the Web Analytics beacon Cloudflare auto-injects on kaikk.jp, and `/cdn-cgi/` scripts (same origin, Cloudflare email obfuscation). `'unsafe-inline'` scripts are required by the Next.js static export. `form-action` allows `mailto:` for the no-JavaScript form.

## Not done / known limits

- `www.kaikk.jp` → `kaikk.jp` redirect: Pages `_redirects` cannot match on hostname. Use a Cloudflare Bulk Redirect or Redirect Rule if wanted. Canonical tags already point to `https://kaikk.jp`.
- Turnstile does not issue tokens to automation-flagged browsers (Playwright-launched Chrome, headless). Real submissions were verified in a normal Chrome profile driven over the DevTools protocol; see `docs/qa/2026-11-12-backend/`.
