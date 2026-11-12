// Fallback flows on the preview: API failure, Turnstile blocked, no-JS.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const [outDir] = process.argv.slice(2);
const base = process.env.BASE;
const axeSrc = readFileSync(new URL('./node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const axeRun = async page => { await page.addScriptTag({ content: axeSrc }); return page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(v => v.id)); };
const results = {};
const fill = async (page, loc) => {
  await page.fill('#inquiry-name', loc === 'ja' ? '山田 太郎' : 'Sam Lee');
  await page.fill('#inquiry-email', 'test@example.com');
  await page.fill('#inquiry-message', loc === 'ja' ? '毎週の集計を自動化したいです。' : 'We want to automate weekly reports.');
};
// 1. Real Chrome (Turnstile passes), API answers 500: fallback panel, no "sent" claim. Nothing reaches the server.
{
  const browser = await chromium.connectOverCDP(process.env.CDP);
  const ctx = browser.contexts()[0];
  for (const loc of ['ja', 'en']) {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route('**/api/inquiry', route => route.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false,"error":"storage_failed"}' }));
    await page.goto(`${base}${loc === 'ja' ? '' : '/en'}/contact`, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[name="cf-turnstile-response"]')?.value?.length > 10, null, { timeout: 30000 });
    await fill(page, loc);
    await page.waitForTimeout(3200);
    await page.click('button[type=submit]');
    await page.waitForSelector('.draft-panel');
    const r = {};
    r.sentPanel = await page.locator('.sent-panel').count();
    r.panel = await page.locator('.draft-panel').innerText();
    r.failure = await page.locator('.draft-panel').getAttribute('data-failure');
    r.status = await page.locator('p[role=status]').innerText();
    r.focused = await page.evaluate(() => document.activeElement?.classList.contains('draft-panel'));
    r.mailto = (await page.locator('.draft-panel a[href^="mailto:"]').getAttribute('href')).slice(0, 40);
    r.gmailTo = new URL(await page.locator('.draft-panel a[href*="mail.google.com"]').getAttribute('href')).searchParams.get('to');
    r.formStillFilled = await page.inputValue('#inquiry-message');
    r.axe = await axeRun(page);
    await page.screenshot({ path: `${outDir}/fallback-${loc}-api500-390.png`, fullPage: true });
    results[`api500_${loc}`] = r;
    await page.close();
  }
  await browser.close().catch(() => {});
}
// 2. Turnstile script blocked (headless): submit goes straight to the email fallback.
{
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 320, height: 740 } });
  const page = await ctx.newPage();
  await page.route('https://challenges.cloudflare.com/**', route => route.abort());
  let apiCalls = 0; page.on('request', q => { if (q.url().includes('/api/inquiry')) apiCalls++; });
  await page.goto(`${base}/contact`, { waitUntil: 'load' });
  await fill(page, 'ja');
  await page.waitForTimeout(1500);
  await page.click('button[type=submit]');
  await page.waitForSelector('.draft-panel', { timeout: 20000 });
  results.turnstileBlocked = { failure: await page.locator('.draft-panel').getAttribute('data-failure'), apiCalls, title: await page.locator('.draft-panel-title').innerText(), axe: await axeRun(page) };
  await page.screenshot({ path: `${outDir}/fallback-ja-turnstile-blocked-320.png`, fullPage: true });
  // Turnstile still pending (not blocked): submit asks to wait instead of sending.
  const p2 = await ctx.newPage();
  await p2.goto(`${base}/en/contact`, { waitUntil: 'load' });
  await fill(p2, 'en');
  await p2.click('button[type=submit]');
  await p2.waitForTimeout(500);
  results.turnstilePending = { status: await p2.locator('p[role=status]').innerText(), panels: await p2.locator('.draft-panel, .sent-panel').count() };
  // "Send by email instead" path.
  await p2.click('.form-actions button[type=button]').catch(() => {});
  await p2.waitForSelector('.draft-panel');
  results.emailPath = { title: await p2.locator('.draft-panel-title').innerText(), status: await p2.locator('p[role=status]').innerText() };
  // 3. No JavaScript: mailto POST form, no Turnstile.
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const p3 = await nojs.newPage();
  await p3.goto(`${base}/contact`);
  results.noJs = await p3.evaluate(() => { const f = document.querySelector('form.inquiry-form'); return { action: f.getAttribute('action'), method: f.getAttribute('method'), enctype: f.getAttribute('enctype'), privacyLink: !!f.querySelector('a[href="/privacy"]'), noscript: document.querySelector('noscript')?.textContent }; });
  await browser.close();
}
writeFileSync(`${outDir}/fallback-results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
