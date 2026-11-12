import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInquiry, CONTACT_EMAIL } from '../src/lib/inquiry.ts';

test('inquiry produces an encoded email draft, not a false submission', () => {
  const draft = buildInquiry({ company: 'KAI & Partners', name: '田中', email: 'tanaka@example.com', message: '見積り\nAI + API?' }, 'ja');
  assert.equal(CONTACT_EMAIL, 'info@kaikk.jp');
  assert.ok(draft.href.startsWith(`mailto:${CONTACT_EMAIL}?`));
  const params = new URLSearchParams(draft.href.split('?')[1]);
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
  const draft = buildInquiry({ company: 'Co\r\nBcc: other@example.com', name: 'Name', email: 'e@example.com', message: '?' }, 'en');
  const params = new URLSearchParams(draft.href.split('?')[1]);
  assert.doesNotMatch(params.get('subject'), /[\r\n]/);
  assert.equal(params.has('bcc'), false);
});
