// Usage: BASE=... HEADLESS=1 node e2e.mjs <outDir> <ja|en>
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const [outDir, loc = 'ja'] = process.argv.slice(2);
const base = process.env.BASE;
const browser = process.env.CDP ? await chromium.connectOverCDP(process.env.CDP) : await chromium.launch({ channel: 'chrome', headless: process.env.HEADLESS !== '0' });
const ctx = process.env.CDP ? browser.contexts()[0] : await browser.newContext({ viewport: { width: 390, height: 844 }, locale: loc === 'ja' ? 'ja-JP' : 'en-US' });
const page = await ctx.newPage();
const r = { loc, errors: [], csp: [], requests: [] };
page.on('pageerror', e => r.errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') r.errors.push(m.text()); });
page.on('request', q => { if (/challenges\.cloudflare|\/api\/inquiry/.test(q.url())) r.requests.push(q.method() + ' ' + q.url().split('?')[0]); });
await page.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', e => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`)); });
const path = loc === 'ja' ? '/contact?topic=business-automation' : '/en/contact?topic=business-automation';
await page.goto(base + path, { waitUntil: 'load' }); await page.waitForTimeout(1500);
r.topicPreselected = await page.locator('input[name=topic]:checked').evaluate(el => el.value).catch(() => null);
const t0 = Date.now();
await page.waitForFunction(() => document.querySelector('[name="cf-turnstile-response"]')?.value?.length > 10, null, { timeout: 60000 }).then(() => { r.turnstileToken = true; }).catch(() => { r.turnstileToken = false; });
r.turnstileMs = Date.now() - t0;
r.webdriver = await page.evaluate(() => navigator.webdriver);
r.turnstileIframe = await page.locator('iframe[src*="challenges.cloudflare.com"]').count();
await page.screenshot({ path: `${outDir}/e2e-${loc}-turnstile-390.png`, fullPage: true });
await page.fill('#inquiry-name', loc === 'ja' ? '【テスト】QA 自動テスト（削除予定）' : '[TEST] QA automated test (to be deleted)');
await page.fill('#inquiry-email', 'qa-test@example.com');
await page.fill('#inquiry-company', 'TEST-DELETE-ME');
await page.fill('#inquiry-message', loc === 'ja' ? 'これはKAIサイトの動作確認用テスト送信です。削除してください。' : 'This is an automated QA submission for the KAI site. Please delete.');
await page.waitForTimeout(3500);
if (r.turnstileToken) {
  const [resp] = await Promise.all([page.waitForResponse(x => x.url().endsWith('/api/inquiry'), { timeout: 30000 }), page.click('button[type=submit]')]);
  r.apiStatus = resp.status();
  r.apiBody = await resp.json().catch(() => null);
  await page.waitForTimeout(800);
  r.sentPanel = await page.locator('.sent-panel').innerText().catch(() => null);
  r.sentFocused = await page.evaluate(() => document.activeElement?.classList.contains('sent-panel'));
  await page.screenshot({ path: `${outDir}/e2e-${loc}-sent-390.png`, fullPage: true });
}
// CSP check for the Web Analytics endpoints (no data sent: beacon has no token here; fetch is to the root, not /cdn-cgi/rum).
r.analyticsCsp = await page.evaluate(async () => {
  const s = document.createElement('script'); s.src = 'https://static.cloudflareinsights.com/beacon.min.js'; s.defer = true;
  const loaded = await new Promise(res => { s.onload = () => res('loaded'); s.onerror = () => res('error'); document.head.appendChild(s); setTimeout(() => res('timeout'), 8000); });
  let fetchRes; try { await fetch('https://cloudflareinsights.com/', { mode: 'no-cors' }); fetchRes = 'ok'; } catch (e) { fetchRes = String(e); }
  await new Promise(res => setTimeout(res, 300));
  return { beaconScript: loaded, connect: fetchRes };
});
r.csp = await page.evaluate(() => window.__csp);
writeFileSync(`${outDir}/e2e-${loc}.json`, JSON.stringify(r, null, 2));
console.log(JSON.stringify(r, null, 2));
if (process.env.CDP) await browser.close().catch(() => {}); else await browser.close();
