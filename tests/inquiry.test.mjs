import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInquiry, CONTACT_EMAIL, topicFromSearch } from '../src/lib/inquiry.ts';

const query = href => new URLSearchParams(href.split('?')[1]);

test('inquiry produces an encoded email draft, not a false submission', () => {
  const draft = buildInquiry({ company: 'KAI & Partners', name: '田中', email: 'tanaka@example.com', message: '見積り\nAI + API?' }, 'ja');
  assert.equal(CONTACT_EMAIL, 'info@kaikk.jp');
  assert.ok(draft.href.startsWith(`mailto:${CONTACT_EMAIL}?`));
  const params = query(draft.href);
  assert.equal(params.get('body'), draft.body);
  assert.match(draft.body, /KAI & Partners/);
  assert.match(draft.body, /見積り\nAI \+ API\?/);
  assert.match(params.get('subject'), /KAI/);
});

test('English inquiry retains field order and all details', () => {
  const draft = buildInquiry({ company: 'Studio', name: 'Sam', email: 'sam@example.com', message: 'Workflow integration' }, 'en');
  assert.ok(draft.body.indexOf('Company:') < draft.body.indexOf('Name:'));
  assert.ok(draft.body.indexOf('Name:') < draft.body.indexOf('Email:'));
  assert.match(draft.body, /Workflow integration/);
});

test('untrusted newlines cannot inject email subject headers', () => {
  const draft = buildInquiry({ company: 'Co\r\nBcc: other@example.com', name: 'Name', email: 'e@example.com', message: '?', topic: 'x\nCc: a@b.c' }, 'en');
  for (const href of [draft.href, draft.gmailHref, draft.outlookHref]) {
    const params = query(href);
    assert.doesNotMatch(params.get('subject') ?? params.get('su'), /[\r\n]/);
    assert.equal(params.has('bcc'), false);
    assert.equal(params.has('cc'), false);
  }
});

test('company is optional and the subject falls back to the person name', () => {
  const draft = buildInquiry({ company: '  ', name: '山田', email: 'y@example.com', message: '相談' }, 'ja');
  assert.match(draft.subject, /: 山田$/);
  assert.match(draft.body, /会社名: （未記入）/);
});

test('topic is carried into subject and body', () => {
  const draft = buildInquiry({ company: 'A社', name: '佐藤', email: 's@example.com', message: 'm', topic: '生成AIの社内活用' }, 'ja');
  assert.equal(draft.subject, '【生成AIの社内活用】KAIへのお問い合わせ: A社');
  assert.match(draft.body, /ご相談の種類: 生成AIの社内活用/);
});

test('webmail fallbacks open the same draft addressed to KAI', () => {
  const draft = buildInquiry({ company: 'Studio', name: 'Sam', email: 'sam@example.com', message: 'Hello & welcome' }, 'en');
  const gmail = new URL(draft.gmailHref);
  assert.equal(gmail.origin, 'https://mail.google.com');
  assert.equal(gmail.searchParams.get('to'), CONTACT_EMAIL);
  assert.equal(gmail.searchParams.get('su'), draft.subject);
  assert.equal(gmail.searchParams.get('body'), draft.body);
  const outlook = new URL(draft.outlookHref);
  assert.equal(outlook.origin, 'https://outlook.office.com');
  assert.equal(outlook.searchParams.get('to'), CONTACT_EMAIL);
  assert.equal(outlook.searchParams.get('body'), draft.body);
});

test('topic preselection only accepts known values', () => {
  const allowed = ['ai-adoption', 'generative-ai'];
  assert.equal(topicFromSearch('?topic=generative-ai', allowed), 'generative-ai');
  assert.equal(topicFromSearch('?topic=<script>', allowed), '');
  assert.equal(topicFromSearch('', allowed), '');
});
