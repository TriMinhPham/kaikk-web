import { chromium } from 'playwright-core';
const browser = await chromium.connectOverCDP('http://localhost:9333');
const page = await browser.contexts()[0].newPage();
for (const [w, h, path] of [[390, 844, '/contact'], [320, 740, '/contact'], [1440, 1000, '/en/contact']]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto('https://conversion.kaikk-jp.pages.dev' + path, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('[name="cf-turnstile-response"]')?.value?.length > 10, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.locator('.turnstile-field').scrollIntoViewIfNeeded();
  const box = await page.locator('.turnstile-box').boundingBox();
  const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  console.log(w, JSON.stringify(box), 'scroll', sw);
  await page.screenshot({ path: `/Users/user/AI/kaikk-web/docs/qa/2026-11-12-backend/turnstile-widget-${w}.png` });
}
await browser.close().catch(() => {});
