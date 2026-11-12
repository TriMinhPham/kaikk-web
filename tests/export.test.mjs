import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const out = resolve('out');
const solutionPaths = ['/solutions/ai-adoption', '/solutions/business-automation', '/solutions/generative-ai'];
const basePaths = ['/', '/services', '/process', '/company', '/contact', ...solutionPaths, '/privacy'];
const routes = [...basePaths, ...basePaths.map(p => (p === '/' ? '/en' : `/en${p}`))];
const read = route => readFileSync(resolve(out, route === '/' ? 'index.html' : `${route.slice(1)}.html`), 'utf8');
const jsonLd = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const nodes = html => jsonLd(html).flatMap(s => s['@graph'] ?? [s]);
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');

for (const route of routes) {
  test(`export contract: ${route}`, () => {
    const html = read(route);
    const url = `https://kaikk.jp${route === '/' ? '/' : route}`;
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(canonical && new URL(canonical).href === new URL(url).href, `canonical ${canonical}`);
    for (const lang of ['ja', 'en', 'x-default']) assert.ok(html.includes(`hrefLang="${lang}"`), lang);
    const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
    assert.ok(ogUrl && new URL(ogUrl).href === new URL(url).href, `og:url ${ogUrl}`);
    assert.match(html, /property="og:image" content="https:\/\/kaikk\.jp\/og\.png"/);
    assert.match(html, /property="og:title" content="[^"]+"/);
    assert.match(html, /<meta name="description" content="[^"]{50,}"/);
    assert.doesNotMatch(html, /kaikk\.co\.jp|株式会社KAI/);
    assert.ok(html.includes('id="main-content"'));
    const all = nodes(html);
    assert.ok(all.some(n => n.url === 'https://kaikk.jp/' && n['@id'] === 'https://kaikk.jp/#organization'));
    const org = all.find(n => n['@id'] === 'https://kaikk.jp/#organization');
    assert.equal(org.identifier.value, '1010001262744');
    if (route !== '/' && route !== '/en') {
      const crumbs = all.find(n => n['@type'] === 'BreadcrumbList');
      assert.ok(crumbs, 'breadcrumb');
      assert.equal(crumbs.itemListElement.at(-1).item, url);
      crumbs.itemListElement.forEach((item, i) => assert.equal(item.position, i + 1));
    }
    assert.ok(html.includes(`href="${route.startsWith('/en') ? '/en' : ''}/privacy"`), 'footer privacy link');
    if (!route.endsWith('/contact') && !route.endsWith('/privacy')) assert.ok(/href="(\/en)?\/contact(\?topic=[a-z-]+)?"[^>]*class="button-primary"|class="button-primary"[^>]*href="(\/en)?\/contact/.test(html), 'primary CTA to contact');
    if (route.endsWith('/contact')) {
      assert.ok(html.includes('action="mailto:info@kaikk.jp"'));
      assert.ok(html.includes('method="POST"'));
      assert.ok(html.includes('for="inquiry-email"'));
      assert.ok(html.includes('role="status"'));
      assert.match(html, /id="inquiry-name"[^>]*required/);
      assert.match(html, /id="inquiry-email"[^>]*required/);
      assert.doesNotMatch(html.match(/<input[^>]*id="inquiry-company"[^>]*>/)[0], /required/);
      assert.equal((html.match(/type="radio" name="topic"/g) || []).length, 5);
      // Consent text links to the privacy policy; honeypot is hidden from assistive tech; old "nothing is sent" copy is gone.
      assert.match(html, /id="inquiry-notice"[^>]*>[\s\S]*?href="(\/en)?\/privacy"/);
      assert.match(html, /class="hp-field" aria-hidden="true"[\s\S]*?id="inquiry-website"[^>]*tabindex="-1"/i);
      assert.doesNotMatch(html, /送信・保存されません|does not send or store/);
    }
  });
}

test('visible FAQs and FAQPage structured data match exactly', () => {
  for (const route of ['/', '/en', ...solutionPaths, ...solutionPaths.map(p => `/en${p}`)]) {
    const html = read(route);
    const faq = nodes(html).find(n => n['@type'] === 'FAQPage');
    assert.ok(faq, route);
    const visible = text(html);
    assert.ok(faq.mainEntity.length >= 3);
    for (const q of faq.mainEntity) {
      assert.equal(q['@type'], 'Question');
      assert.ok(visible.includes(q.name.replace(/&/g, '&amp;')) || visible.includes(q.name), `${route}: ${q.name}`);
      assert.ok(q.acceptedAnswer.text.length > 20);
    }
  }
});

test('service pages expose Service structured data tied to the organization', () => {
  for (const route of ['/services', '/en/services', ...solutionPaths]) {
    const services = nodes(read(route)).filter(n => n['@type'] === 'Service');
    assert.ok(services.length >= 1, route);
    for (const s of services) assert.equal(s.provider['@id'], 'https://kaikk.jp/#organization');
  }
});

test('no invented social proof or unapproved commercial promises', () => {
  for (const route of routes) {
    const visible = text(read(route));
    assert.doesNotMatch(visible, /導入実績\s*\d|お客様の声|満足度|No\.?\s?1(?!\d)|業界初|testimonial|trusted by|\d+\s*社以上|\d+\+?\s*clients/i, route);
    // Free consultation, response times and prices only appear once enabled in src/lib/offer.ts.
    assert.doesNotMatch(visible, /無料|営業日以内|free of charge|business days|円（税別）|JPY [\d,]+ \(excl/i, route);
  }
});

test('public discovery endpoints use the correct origin and list every page', () => {
  for (const file of ['sitemap.xml', 'robots.txt', 'llms.txt']) {
    const body = readFileSync(resolve(out, file), 'utf8');
    assert.ok(body.includes('https://kaikk.jp'));
    assert.doesNotMatch(body, /kaikk\.co\.jp/);
  }
  const sitemap = readFileSync(resolve(out, 'sitemap.xml'), 'utf8');
  for (const route of routes) assert.ok(sitemap.includes(`<loc>https://kaikk.jp${route === '/' ? '/' : route}</loc>`), route);
  assert.ok(sitemap.includes('hreflang="x-default"'));
  assert.doesNotMatch(sitemap, /isekai/);
  const llms = readFileSync(resolve(out, 'llms.txt'), 'utf8');
  for (const p of solutionPaths) assert.ok(llms.includes(`https://kaikk.jp${p}`), p);
  assert.ok(llms.includes('1010001262744'));
  const legacy = readFileSync(resolve(out, 'isekai.html'), 'utf8');
  assert.ok(legacy.includes('noindex'));
});

test('hero photo ships responsive pre-rendered variants', () => {
  for (const w of [480, 800, 1200]) for (const ext of ['avif', 'webp']) assert.ok(existsSync(resolve(out, `images/tokyo-${w}.${ext}`)), `${w}.${ext}`);
  assert.ok(existsSync(resolve(out, 'images/tokyo-1200.jpg')));
  const home = read('/');
  assert.match(home, /<source type="image\/avif" srcSet="[^"]*tokyo-480\.avif 480w/);
  assert.match(home, /fetchPriority="high"/);
  assert.doesNotMatch(home, /src="\/images\/tokyo\.jpg"/);
});

test('404 page is a complete document with a way back', () => {
  const html = readFileSync(resolve(out, '404.html'), 'utf8');
  assert.match(html, /<html lang="ja">/);
  assert.match(html, /noindex/);
  assert.ok(html.includes('href="/contact"'));
  assert.ok(html.includes('href="/en"'));
});

test('expertise links remain evidence-based and distinguish prior founder work', () => {
  const ja = read('/');
  const en = read('/en');
  for (const html of [ja, en]) {
    assert.ok(html.includes('e.vnexpress.net/news/business/'));
    assert.ok(html.includes('ipvietnam.gov.vn/documents/'));
    assert.ok(html.includes('1-0053047'));
    assert.ok(html.includes('houjin-bangou.nta.go.jp'));
  }
  assert.ok(en.includes('not KAI client engagements'));
  for (const route of ['/company', '/en/company']) {
    const html = read(route);
    assert.ok(html.includes('0100-01-262744') && html.includes('1010001262744'), route);
    assert.ok(html.includes('houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=1010001262744'), route);
  }
  assert.ok(ja.includes('受託実績'));
});

test('privacy policy pages state the retention period from config and the required APPI items', async () => {
  const { INQUIRY_RETENTION_MONTHS } = await import('../src/lib/inquiry-rules.ts');
  const ja = text(read('/privacy'));
  const en = text(read('/en/privacy'));
  assert.ok(ja.includes(`${INQUIRY_RETENTION_MONTHS}か月`));
  assert.ok(en.includes(`${INQUIRY_RETENTION_MONTHS} months`));
  for (const s of ['KAI株式会社', '有楽町一丁目5番2号', 'PHAM MINH TRI', 'info@kaikk.jp', '利用目的', 'Cloudflare Turnstile', 'Cloudflare Web Analytics', 'Google Workspace', '開示', '第三者']) assert.ok(ja.includes(s), s);
  for (const s of ['KAI Inc.', '1-5-2 Yurakucho', 'PHAM MINH TRI', 'info@kaikk.jp', 'Cloudflare Turnstile', 'Cloudflare Web Analytics', 'Google Workspace', 'never sell', 'Japanese version prevails']) assert.ok(en.includes(s), s);
});

test('Turnstile is loaded only by the contact pages', () => {
  const htmlFiles = routes.map(r => [r, read(r)]);
  for (const [route, html] of htmlFiles) assert.doesNotMatch(html, /challenges\.cloudflare\.com/, `${route} html`);
  const chunks = new Set();
  for (const [, html] of htmlFiles) for (const m of html.matchAll(/\/_next\/static\/chunks\/([\w-]+\.js)/g)) chunks.add(m[1]);
  const turnstileChunks = [...chunks].filter(c => readFileSync(resolve(out, '_next/static/chunks', c), 'utf8').includes('challenges.cloudflare.com/turnstile'));
  assert.ok(turnstileChunks.length >= 1, 'a chunk loads Turnstile');
  for (const [route, html] of htmlFiles) {
    const uses = turnstileChunks.some(c => html.includes(c));
    assert.equal(uses, route.endsWith('/contact'), route);
  }
});

test('_headers: immutable caching for hashed assets and a CSP that allows Turnstile and Web Analytics', () => {
  const headers = readFileSync(resolve(out, '_headers'), 'utf8');
  assert.match(headers, /\/_next\/static\/\*\n\s+Cache-Control: public, max-age=31536000, immutable/);
  const csp = headers.match(/Content-Security-Policy: (.+)/)[1];
  const dir = name => csp.split(';').map(d => d.trim()).find(d => d.startsWith(`${name} `)) ?? '';
  assert.match(dir('script-src'), /https:\/\/challenges\.cloudflare\.com/);
  assert.match(dir('script-src'), /https:\/\/static\.cloudflareinsights\.com/);
  assert.match(dir('frame-src'), /https:\/\/challenges\.cloudflare\.com/);
  assert.match(dir('connect-src'), /'self'.*https:\/\/cloudflareinsights\.com/);
  assert.match(dir('form-action'), /mailto:/, 'no-JS mailto fallback still allowed');
  assert.match(dir('frame-ancestors'), /'none'/);
  assert.equal(existsSync(resolve(out, '_redirects')), false);
});
