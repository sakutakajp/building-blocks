import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLocalePublicationSchema, publicationPolicySchema } from '../dist/locale-publication.js';

const schema = createLocalePublicationSchema(['ja', 'en', 'zh-cn']);
const published = { path: '/en/example/', publication: 'published', search: 'index' };
const ledger = (route = published) => ({ resources: { example: { en: route } } });
test('explicit published index/noindex and draft noindex; absent locales remain absent', () => {
  assert.deepEqual(schema.parse(ledger()), ledger());
  assert.equal(schema.parse(ledger()).resources.example.ja, undefined);
  assert.equal(schema.parse(ledger({ ...published, search: 'noindex' })).resources.example.en.search, 'noindex');
  assert.equal(schema.parse(ledger({ ...published, publication: 'draft', search: 'noindex' })).resources.example.en.publication, 'draft');
});
test('unknown keys/locales and incomplete/invalid states fail', () => {
  for (const invalid of [
    { ...ledger(), unexpected: true },
    { resources: { example: { xx: published } } },
    ledger({ ...published, extra: true }),
    ledger({ ...published, noindex: true }),
    ledger({ ...published, publication: 'draft' }),
    ledger({ path: published.path, publication: 'published' }),
    ledger({ path: published.path, search: 'index' }),
    ledger({ ...published, publication: null }),
    ledger({ ...published, search: 'INDEX' }),
    ledger({ ...published, search: false }),
  ]) assert.equal(schema.safeParse(invalid).success, false, JSON.stringify(invalid));
  assert.equal(publicationPolicySchema.safeParse({ publication: 'draft', search: 'index' }).success, false);
});
test('malformed routes and collisions across resources/locales fail', () => {
  for (const path of ['en/example/', '/en/example', '/en//example/', '/en/../example/', '/en/%65xample/', '/en/example/?q=x', '/en/example/#x', '/EN/example/', '/en/例/', '/en/example.json/', 'https://example.com/']) {
    assert.equal(schema.safeParse(ledger({ ...published, path })).success, false, path);
  }
  assert.equal(schema.safeParse({ resources: { first: { en: published }, second: { ja: published } } }).success, false);
});
test('caller locale declarations reject duplicates, invalid names and empty lists', () => {
  for (const locales of [[], ['en', 'en'], ['en', 'EN'], ['en', '__proto__']]) assert.throws(() => createLocalePublicationSchema(locales));
});

test('JSON own __proto__ keys are rejected instead of silently discarded', () => {
  for (const json of [
    '{"resources":{"__proto__":{"en":{"path":"/en/","publication":"published","search":"index"}}}}',
    '{"resources":{"example":{"__proto__":{"path":"/en/","publication":"published","search":"index"}}}}',
    '{"resources":{},"__proto__":{}}',
    '{"resources":{"example":{"en":{"path":"/en/","publication":"published","search":"index","__proto__":{}}}}}',
  ]) assert.equal(schema.safeParse(JSON.parse(json)).success, false, json);
});
