import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { handleInquiry, isAllowedOrigin, validateInquiry, hashIp, newRef, notificationEmail, SITEVERIFY_URL } from '../functions/api/inquiry.ts';
import { INQUIRY_RATE_LIMIT, INQUIRY_TOPICS, INQUIRY_NOTIFY_TO } from '../src/lib/inquiry-rules.ts';

// D1-compatible fake on top of SQLite, using the committed migration.
function fakeD1({ failInsert = false } = {}) {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0001_inquiries.sql', import.meta.url), 'utf8'));
  const d1 = {
    sqlite: db,
    prepare(d1sql) {
      // node:sqlite binds positional args to plain `?` only; the API numbers them in order (?1, ?2, ...).
      const sql = d1sql.replace(/\?\d+/g, '?');
      let args = [];
      const stmt = {
        bind(...values) { args = values; return stmt; },
        async first() { return db.prepare(sql).get(...args) ?? null; },
        async run() {
          if (failInsert && sql.startsWith('INSERT INTO inquiries')) throw new Error('D1_ERROR: disk I/O');
          return db.prepare(sql).run(...args);
        },
      };
      return stmt;
    },
  };
  return d1;
}

const ORIGIN = 'https://kaikk.jp';
const valid = { name: '検証 太郎', email: 'qa@example.com', company: 'テスト株式会社', topic: 'generative-ai', message: '自動テストです。\n二行目。', locale: 'ja', website: '', elapsedMs: 8000, turnstileToken: 'token-ok' };

function request(body = valid, { origin = ORIGIN, url = 'https://kaikk.jp/api/inquiry', method = 'POST', type = 'application/json', ip = '203.0.113.7', site = 'same-origin', raw } = {}) {
  const headers = new Headers({ 'content-type': type, 'cf-connecting-ip': ip });
  if (origin) headers.set('origin', origin);
  if (site) headers.set('sec-fetch-site', site);
  return new Request(url, { method, headers, body: method === 'GET' ? undefined : raw ?? JSON.stringify(body) });
}

function deps({ turnstile = { success: true, action: 'inquiry', hostname: 'kaikk.jp' }, turnstileStatus = 200, throwFetch = false } = {}) {
  const calls = [];
  const logs = [];
  return {
    calls, logs,
    now: () => Date.parse('2026-11-12T03:00:00Z'),
    log: e => logs.push(e),
    fetch: async (url, init) => {
      calls.push({ url, form: Object.fromEntries(init.body.entries()) });
      if (throwFetch) throw new Error('network');
      return new Response(JSON.stringify(turnstile), { status: turnstileStatus, headers: { 'content-type': 'application/json' } });
    },
  };
}

const env = (extra = {}) => ({ DB: fakeD1(), TURNSTILE_SECRET: 'secret-for-tests', ...extra });
const rows = e => e.DB.sqlite.prepare('SELECT * FROM inquiries').all();
const call = async (req, e, d) => { const res = await handleInquiry(req, e, d); return { status: res.status, body: await res.json(), headers: res.headers }; };

test('valid inquiry is verified, stored and acknowledged with a reference', async () => {
  const e = env(); const d = deps();
  const res = await call(request(), e, d);
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.match(res.body.ref, /^KAI-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  const [row] = rows(e);
  assert.equal(row.ref, res.body.ref);
  assert.equal(row.email, 'qa@example.com');
  assert.equal(row.topic, 'generative-ai');
  assert.equal(row.message, '自動テストです。\n二行目。');
  assert.equal(row.email_status, 'disabled');
  // Turnstile siteverify got the secret, the token and the visitor IP.
  assert.equal(d.calls[0].url, SITEVERIFY_URL);
  assert.deepEqual(d.calls[0].form, { secret: 'secret-for-tests', response: 'token-ok', remoteip: '203.0.113.7' });
  // Raw IP is never stored; only an HMAC appears in rate_events.
  const dump = JSON.stringify([rows(e), e.DB.sqlite.prepare('SELECT * FROM rate_events').all()]);
  assert.doesNotMatch(dump, /203\.0\.113\.7/);
  // Logs carry no personal data.
  assert.doesNotMatch(JSON.stringify(d.logs), /qa@example|検証|203\.0/);
});

test('origin check: same-origin KAI hosts only', () => {
  assert.equal(isAllowedOrigin('https://kaikk.jp', 'https://kaikk.jp/api/inquiry'), true);
  assert.equal(isAllowedOrigin('https://www.kaikk.jp', 'https://www.kaikk.jp/api/inquiry'), true);
  assert.equal(isAllowedOrigin('https://conversion.kaikk-jp.pages.dev', 'https://conversion.kaikk-jp.pages.dev/api/inquiry'), true);
  assert.equal(isAllowedOrigin('http://localhost:8788', 'http://localhost:8788/api/inquiry'), true);
  assert.equal(isAllowedOrigin('https://www.kaikk.jp', 'https://kaikk.jp/api/inquiry'), false, 'cross-origin even between KAI hosts');
  assert.equal(isAllowedOrigin('https://evil.example', 'https://evil.example/api/inquiry'), false);
  assert.equal(isAllowedOrigin('https://kaikk.jp.evil.example', 'https://kaikk.jp/api/inquiry'), false);
  assert.equal(isAllowedOrigin('https://evilkaikk-jp.pages.dev', 'https://evilkaikk-jp.pages.dev/api/inquiry'), false);
  assert.equal(isAllowedOrigin('http://kaikk.jp', 'http://kaikk.jp/api/inquiry'), false);
  assert.equal(isAllowedOrigin('null', 'https://kaikk.jp/api/inquiry'), false);
  assert.equal(isAllowedOrigin(null, 'https://kaikk.jp/api/inquiry'), false);
});

test('request shape is enforced before anything is stored', async () => {
  const cases = [
    [request(valid, { origin: 'https://evil.example' }), 403, 'forbidden_origin'],
    [request(valid, { origin: null }), 403, 'forbidden_origin'],
    [request(valid, { site: 'cross-site' }), 403, 'forbidden_origin'],
    [request(valid, { method: 'GET' }), 405, 'method_not_allowed'],
    [request(valid, { type: 'text/plain' }), 415, 'unsupported_media_type'],
    [request(valid, { raw: '{not json' }), 400, 'invalid_json'],
    [request(valid, { raw: '[1,2]' }), 400, 'invalid_json'],
    [request({ ...valid, message: 'x'.repeat(20000) }), 413, 'payload_too_large'],
  ];
  for (const [req, status, error] of cases) {
    const e = env(); const d = deps();
    const res = await call(req, e, d);
    assert.equal(res.status, status, error);
    assert.equal(res.body.error, error);
    assert.equal(rows(e).length, 0);
    assert.equal(d.calls.length, 0, 'no Turnstile call');
  }
});

test('honeypot and minimum fill time reject bots without storing', async () => {
  for (const [patch, error] of [[{ website: 'http://spam' }, 'spam_suspected'], [{ elapsedMs: 900 }, 'too_fast'], [{ elapsedMs: undefined }, 'too_fast']]) {
    const e = env(); const d = deps();
    const res = await call(request({ ...valid, ...patch }), e, d);
    assert.equal(res.status, 400);
    assert.equal(res.body.error, error);
    assert.equal(rows(e).length, 0);
    assert.equal(d.calls.length, 0);
  }
});

test('field validation: required fields, limits, email format, fixed topics, locale', () => {
  const bad = {
    name: [{ name: '' }, { name: '   ' }, { name: 'x'.repeat(161) }, { name: 42 }],
    email: [{ email: 'no-at' }, { email: 'a@b' }, { email: 'a b@example.com' }, { email: 'x@example.com\nBcc: y@example.com' }, { email: `${'a'.repeat(65)}@example.com` }, { email: 'a..b@example.com' }],
    company: [{ company: 'c'.repeat(161) }],
    topic: [{ topic: 'pricing' }, { topic: '<script>' }],
    message: [{ message: '' }, { message: 'm'.repeat(3001) }],
    locale: [{ locale: 'fr' }, { locale: undefined }],
  };
  for (const [field, patches] of Object.entries(bad)) for (const p of patches) {
    const r = validateInquiry({ ...valid, ...p });
    assert.equal(r.ok, false, JSON.stringify(p));
    assert.equal(r.field, field, JSON.stringify(p));
  }
  const ok = validateInquiry({ ...valid, company: undefined, topic: '', name: ' 山田\r\n花子 ', message: 'a\u202Eb\r\nc' });
  assert.equal(ok.ok, true);
  assert.equal(ok.value.company, '');
  assert.equal(ok.value.name, '山田 花子');
  assert.equal(ok.value.message, 'ab\nc');
  for (const t of INQUIRY_TOPICS) assert.equal(validateInquiry({ ...valid, topic: t }).ok, true, t);
});

test('form topics and API topics are the same fixed list', () => {
  // marketing.ts uses the @/ alias, so read its topic lists as text.
  const source = readFileSync(new URL('../src/lib/marketing.ts', import.meta.url), 'utf8');
  const lists = [...source.matchAll(/topics: \[(.*?)\],\n/g)].map(m => [...m[1].matchAll(/value: "([^"]+)"/g)].map(v => v[1]));
  assert.equal(lists.length, 2);
  for (const list of lists) assert.deepEqual(list, [...INQUIRY_TOPICS]);
});

test('invalid field returns a field-specific error and stores nothing', async () => {
  const e = env(); const d = deps();
  const res = await call(request({ ...valid, email: 'bad' }), e, d);
  assert.equal(res.status, 400);
  assert.deepEqual(res.body, { ok: false, error: 'invalid_field', field: 'email' });
  assert.equal(rows(e).length, 0);
});

test('missing or failed Turnstile is rejected and nothing is stored', async () => {
  const cases = [
    [{ ...valid, turnstileToken: '' }, deps(), 400, 'turnstile_missing'],
    [valid, deps({ turnstile: { success: false, 'error-codes': ['invalid-input-response'] } }), 403, 'turnstile_failed'],
    [valid, deps({ turnstile: { success: true, action: 'login', hostname: 'kaikk.jp' } }), 403, 'turnstile_failed'],
    [valid, deps({ turnstile: { success: true, action: 'inquiry', hostname: 'evil.example' } }), 403, 'turnstile_failed'],
    [valid, deps({ turnstileStatus: 500 }), 502, 'turnstile_unavailable'],
    [valid, deps({ throwFetch: true }), 502, 'turnstile_unavailable'],
  ];
  for (const [body, d, status, error] of cases) {
    const e = env();
    const res = await call(request(body), e, d);
    assert.equal(res.status, status, error);
    assert.equal(res.body.error, error);
    assert.equal(rows(e).length, 0, error);
  }
});

test('rate limit: per hashed IP, max attempts per hour', async () => {
  const e = env();
  for (let i = 0; i < INQUIRY_RATE_LIMIT.max; i++) assert.equal((await call(request(), e, deps())).status, 200, `attempt ${i + 1}`);
  const blocked = await call(request(), e, deps());
  assert.equal(blocked.status, 429);
  assert.equal(blocked.body.error, 'rate_limited');
  assert.equal(rows(e).length, INQUIRY_RATE_LIMIT.max);
  // Another IP is unaffected.
  assert.equal((await call(request(valid, { ip: '198.51.100.9' }), e, deps())).status, 200);
  // Hash is keyed: same IP, different key, different hash; output is hex SHA-256 length.
  const [a, b] = [await hashIp('203.0.113.7', 'k1'), await hashIp('203.0.113.7', 'k2')];
  assert.notEqual(a, b);
  assert.match(a, /^[0-9a-f]{64}$/);
});

test('missing bindings or a failed D1 insert never report success', async () => {
  let res = await call(request(), { TURNSTILE_SECRET: 's' }, deps());
  assert.equal(res.status, 503);
  assert.equal(res.body.error, 'not_configured');
  res = await call(request(), { DB: fakeD1() }, deps());
  assert.equal(res.status, 503);
  const e = { DB: fakeD1({ failInsert: true }), TURNSTILE_SECRET: 's' };
  res = await call(request(), e, deps());
  assert.equal(res.status, 500);
  assert.equal(res.body.ok, false);
  assert.equal(res.body.error, 'storage_failed');
  assert.equal(res.body.ref, undefined);
});

test('EMAIL binding: sent, absent and throwing', async () => {
  const sent = [];
  const e1 = env({ EMAIL: { send: async m => { sent.push(m); return { messageId: 'x' }; } } });
  const r1 = await call(request({ ...valid, name: 'Eve\r\nBcc: attacker@example.com' }), e1, deps());
  assert.equal(r1.status, 200);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, INQUIRY_NOTIFY_TO);
  assert.equal(sent[0].replyTo, 'qa@example.com');
  assert.doesNotMatch(sent[0].subject, /[\r\n]/);
  assert.match(sent[0].subject, new RegExp(r1.body.ref));
  assert.match(sent[0].text, /自動テストです。/);
  assert.equal(rows(e1)[0].email_status, 'sent');
  assert.equal(rows(e1)[0].notified_at, '2026-11-12T03:00:00.000Z');

  const e2 = env();
  const r2 = await call(request(), e2, deps());
  assert.equal(r2.status, 200);
  assert.equal(rows(e2)[0].email_status, 'disabled');
  assert.equal(rows(e2)[0].notified_at, null, 'left for the external poller');

  const d3 = deps();
  const e3 = env({ EMAIL: { send: async () => { throw Object.assign(new Error('E_SENDER_NOT_VERIFIED'), { code: 'E_SENDER_NOT_VERIFIED' }); } } });
  const r3 = await call(request(), e3, d3);
  assert.equal(r3.status, 200, 'stored inquiry is still acknowledged');
  assert.equal(r3.body.ok, true);
  assert.equal(rows(e3)[0].email_status, 'failed');
  assert.equal(rows(e3)[0].notified_at, null);
  assert.ok(d3.logs.some(l => l.event === 'inquiry_notify_failed'));
});

test('visitor cannot choose the notification recipient', async () => {
  const sent = [];
  const e = env({ EMAIL: { send: async m => { sent.push(m); } } });
  await call(request({ ...valid, to: 'attacker@example.com', email: 'qa@example.com' }), e, deps());
  assert.equal(sent[0].to, 'info@kaikk.jp');
  const mail = notificationEmail('KAI-TEST-0000', { ...valid, company: '' }, '2026-11-12T00:00:00.000Z');
  assert.equal(mail.from.email, 'inquiry@kaikk.jp');
  assert.match(mail.text, /未記入/);
});

test('reference ids are short, unambiguous and distinct', () => {
  const refs = new Set(Array.from({ length: 2000 }, newRef));
  assert.equal(refs.size, 2000);
  for (const r of refs) assert.match(r, /^KAI-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
});

test('retention purge removes expired inquiries and rate events only', async () => {
  const e = env();
  e.DB.sqlite.prepare("INSERT INTO inquiries (ref, created_at, locale, name, email, message) VALUES ('KAI-OLD0-0000', '2024-10-01T00:00:00.000Z', 'ja', 'a', 'a@example.com', 'm')").run();
  e.DB.sqlite.prepare("INSERT INTO inquiries (ref, created_at, locale, name, email, message) VALUES ('KAI-KEEP-0000', '2025-12-01T00:00:00.000Z', 'ja', 'a', 'a@example.com', 'm')").run();
  e.DB.sqlite.prepare("INSERT INTO rate_events (ip_hash, created_at) VALUES ('old', 1)").run();
  await call(request(), e, deps());
  const refs = rows(e).map(r => r.ref);
  assert.ok(!refs.includes('KAI-OLD0-0000'));
  assert.ok(refs.includes('KAI-KEEP-0000'));
  assert.equal(e.DB.sqlite.prepare("SELECT COUNT(*) AS n FROM rate_events WHERE ip_hash = 'old'").get().n, 0);
});

test('schema supports an external poller: indexed created_at and nullable notified_at', () => {
  const db = fakeD1().sqlite;
  const cols = Object.fromEntries(db.prepare('PRAGMA table_info(inquiries)').all().map(c => [c.name, c]));
  assert.equal(cols.notified_at.notnull, 0);
  const indexed = db.prepare("PRAGMA index_list(inquiries)").all().flatMap(i => db.prepare(`PRAGMA index_info(${i.name})`).all().map(c => c.name));
  assert.ok(indexed.includes('created_at'));
  assert.ok(indexed.includes('notified_at'));
});
