import { deepFreeze } from '../schema.js';

export const PLAN59_RECORDS = deepFreeze([
  ['one-fourth-add-two-fourths', '1', '4', 'add', '2'],
  ['three-fourths-subtract-two-fourths', '3', '4', 'subtract', '2'],
  ['one-sixth-add-three-sixths', '1', '6', 'add', '3'],
  ['five-sixths-subtract-three-sixths', '5', '6', 'subtract', '3'],
  ['two-eighths-add-three-eighths', '2', '8', 'add', '3'],
  ['seven-eighths-subtract-five-eighths', '7', '8', 'subtract', '5'],
].map(([itemId, start, denominator, operation, amount]) => ({
  itemId, itemRevision: '1', start: { numerator: start, denominator }, operation,
  amount: { numerator: amount, denominator },
})));
