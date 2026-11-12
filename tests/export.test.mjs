import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const out = resolve('out');
const routes = ['/', '/services', '/process', '/company', '/contact', '/en', '/en/services', '/en/process', '/en/company', '/en/contact'];
for (const route of routes) {
  test(`export contract: ${route}`, () => {
    const html = readFileSync(resolve(out, route === '/' ? 'index.html' : `${route.slice(1)}.html`), 'utf8');
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="https://kaikk.jp${route === '/' ? '' : route}"`) || (route === '/' && html.includes('rel="canonical" href="https://kaikk.jp/"')));
    assert.ok(html.includes('hrefLang="ja"'));
    assert.ok(html.includes('hrefLang="en"'));
    assert.ok(html.includes('hrefLang="x-default"'));
    assert.doesNotMatch(html, /kaikk\.co\.jp|株式会社KAI/);
    assert.ok(html.includes('id="main-content"'));
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    assert.ok(schemas.some(s => s['@graph']?.some(n => n.url === 'https://kaikk.jp/')));
    if (route.endsWith('/contact')) {
      assert.ok(html.includes('action="mailto:info@kaikk.jp"'));
      assert.ok(html.includes('method="POST"'));
      assert.ok(html.includes('htmlFor="inquiry-email"') || html.includes('for="inquiry-email"'));
      assert.ok(html.includes('role="status"'));
    }
  });
}

test('public discovery endpoints use the correct origin', () => {
  for (const file of ['sitemap.xml', 'robots.txt', 'llms.txt']) {
    const text = readFileSync(resolve(out, file), 'utf8');
    assert.ok(text.includes('https://kaikk.jp'));
    assert.doesNotMatch(text, /kaikk\.co\.jp/);
  }
  assert.ok(existsSync(resolve(out, 'images/tokyo.jpg')));
  const legacy = readFileSync(resolve(out, 'isekai.html'), 'utf8');
  assert.ok(legacy.includes('noindex'));
});

test('expertise links remain evidence-based and distinguish prior founder work', () => {
  const ja = readFileSync(resolve(out, 'index.html'), 'utf8');
  const en = readFileSync(resolve(out, 'en.html'), 'utf8');
  for (const html of [ja, en]) {
    assert.ok(html.includes('e.vnexpress.net/news/business/'));
    assert.ok(html.includes('ipvietnam.gov.vn/documents/'));
    assert.ok(html.includes('1-0053047'));
  }
  assert.ok(en.includes('not KAI client engagements'));
  assert.ok(ja.includes('受託実績'));
});
