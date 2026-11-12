// Success-state visual + axe QA at three sizes. Turnstile and the API are stubbed
// (real end-to-end submission is covered by e2e.mjs in a real Chrome).
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const [outDir] = process.argv.slice(2);
const base = process.env.BASE;
const axeSrc = readFileSync(new URL('./node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
for (const [w, h] of [[1440, 1000], [390, 844], [320, 740]]) for (const loc of ['ja', 'en']) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { window.turnstile = { render: (el, o) => { setTimeout(() => o.callback('stub-token'), 50); return 'w1'; }, reset() {}, remove() {} }; });
  let body = null;
  await page.route('**/api/inquiry', async route => { body = JSON.parse(route.request().postData()); await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"ref":"KAI-TEST-0000"}' }); });
  await page.goto(`${base}${loc === 'ja' ? '' : '/en'}/contact?topic=web`, { waitUntil: 'load' });
  await page.fill('#inquiry-name', 'QA'); await page.fill('#inquiry-email', 'qa@example.com'); await page.fill('#inquiry-message', 'QA message');
  await page.waitForTimeout(3100);
  await page.click('button[type=submit]');
  await page.waitForSelector('.sent-panel');
  await page.addScriptTag({ content: axeSrc });
  const axe = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(v => v.id));
  const r = { loc, viewport: `${w}x${h}`, payloadKeys: Object.keys(body).sort(), topic: body.topic, elapsedOk: body.elapsedMs >= 3000, focused: await page.evaluate(() => document.activeElement?.classList.contains('sent-panel')), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), axe };
  await page.screenshot({ path: `${outDir}/sent-${loc}-${w}.png` });
  results.push(r); console.log(JSON.stringify(r));
  await ctx.close();
}
await browser.close();
writeFileSync(`${outDir}/sent-results.json`, JSON.stringify(results, null, 2));
