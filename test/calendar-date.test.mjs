import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarDateSchema, nonEmptyTextSchema } from 'building-blocks/content-schema';

for (const date of ['0001/01/01', '0099/12/31', '2000/02/29', '2024/02/29', '2026/04/30', '9999/12/31']) {
  test(`accept calendar date ${date}`, () => assert.equal(calendarDateSchema.parse(date), date));
}
for (const date of ['0000/01/01', '1900/02/29', '2100/02/29', '2026/02/29', '2026/04/31', '2026/00/01', '2026/13/01', '2026/01/00', '2026/01/32', '2026/1/01', '2026-01-01', '2026/01/01\n', '', null, 20260101, new Date()]) {
  test(`reject invalid date ${String(date)}`, () => assert.equal(calendarDateSchema.safeParse(date).success, false));
}
test('text is validated without normalization', () => {
  assert.equal(nonEmptyTextSchema.parse(' example '), ' example ');
  for (const value of ['', '  ', '\n', null, 1]) assert.equal(nonEmptyTextSchema.safeParse(value).success, false);
});
