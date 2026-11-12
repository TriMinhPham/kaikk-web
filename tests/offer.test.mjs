import test from 'node:test';
import assert from 'node:assert/strict';
import { offer, offerLines } from '../src/lib/offer.ts';

test('no commercial promise is published until the founder enables one', () => {
  assert.equal(offer.freeConsultationMinutes, null);
  assert.equal(offer.replyWithinBusinessDays, null);
  assert.equal(offer.pocPriceFromJpy, null);
  assert.deepEqual(offerLines('ja'), []);
  assert.deepEqual(offerLines('en'), []);
});
