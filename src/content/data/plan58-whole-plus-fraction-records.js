import { deepFreeze } from '../schema.js';

export const PLAN58_RECORDS = deepFreeze([
  ['three-fourths', '3', '4', 'proper'],
  ['four-fourths', '4', '4', 'one'],
  ['five-fourths', '5', '4', 'mixed'],
  ['six-fourths', '6', '4', 'unreduced'],
  ['three-halves', '3', '2', 'different-unit'],
  ['eight-fourths', '8', '4', 'two'],
].map(([itemId, numerator, denominator, purpose]) => ({
  itemId, itemRevision: '1', purpose, form: { numerator, denominator },
})));
