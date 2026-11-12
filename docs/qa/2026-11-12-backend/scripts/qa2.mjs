// Usage: node qa.mjs <outDir> <tag> [routes comma-separated]
import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const [outDir, tag = 'run', routeArg] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const base = process.env.BASE || 'http://127.0.0.1:4399';
const axeSrc = readFileSync(new URL('./node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const routes = routeArg ? routeArg.split(',') : ['/', '/services', '/process', '/company', '/contact', '/en', '/en/services', '/en/process', '/en/company', '/en/contact'];
const viewports = (process.env.VPS || '1440x1000,390x844,320x740').split(',').map(v => v.split('x').map(Number));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
for (const [w, h] of viewports) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  for (const route of routes) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    const res = await page.goto(base + route, { waitUntil: 'load' }); await page.waitForTimeout(route.endsWith('/contact') ? 3000 : 800);
    const info = await page.evaluate(() => {
      const q = s => document.querySelector(s);
      const cta = q('[data-primary-cta]');
      const r = cta?.getBoundingClientRect();
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); return (j['@graph'] || [j]).map(n => n['@type']).flat(); } catch { return ['INVALID']; } }).flat();
      return {
        title: document.title,
        description: q('meta[name=description]')?.content,
        canonical: q('link[rel=canonical]')?.href,
        hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map(l => `${l.hreflang}=${l.href}`),
        ogTitle: q('meta[property="og:title"]')?.content, ogUrl: q('meta[property="og:url"]')?.content, ogImage: q('meta[property="og:image"]')?.content,
        h1: [...document.querySelectorAll('h1')].map(x => x.innerText.replace(/\n/g, ' / ')),
        scrollWidth: document.documentElement.scrollWidth, width: innerWidth,
        primaryCta: cta ? { text: cta.innerText, bottom: Math.round(r.bottom), visible: r.bottom <= innerHeight } : null,
        jsonLdTypes: ld,
        images: [...document.images].map(i => ({ src: i.currentSrc.replace(location.origin, ''), loaded: i.complete && i.naturalWidth > 0, natural: `${i.naturalWidth}x${i.naturalHeight}`, rendered: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}` })),
        internalLinks: new Set([...document.querySelectorAll('main a[href^="/"]')].map(a => a.getAttribute('href'))).size,
      };
    });
    await page.addScriptTag({ content: axeSrc });
    const axe = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, target: v.nodes[0]?.target })));
    const name = `${tag}-${route === '/' ? 'ja-home' : route.replace(/^\//, '').replace(/\//g, '-')}${route.startsWith('/en') || route === '/' ? '' : ''}-${w}`.replace('-en-', '-en-');
    await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: w !== 1440 || process.env.FULL === '1' });
    await page.screenshot({ path: `${outDir}/${name}-fold.png`, fullPage: false });
    results.push({ route, viewport: [w, h], status: res.status(), ...info, overflow: info.scrollWidth > info.width, axe, consoleErrors: errors, screenshot: `${name}.png` });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
writeFileSync(`${outDir}/${tag}-results.json`, JSON.stringify(results, null, 2));
for (const r of results) console.log(r.route, r.viewport.join('x'), r.status, 'h1=' + r.h1.length, 'overflow=' + r.overflow, 'cta=' + JSON.stringify(r.primaryCta), 'axe=' + r.axe.length, r.axe.map(a => a.id).join(','), 'err=' + r.consoleErrors.length, r.title);
