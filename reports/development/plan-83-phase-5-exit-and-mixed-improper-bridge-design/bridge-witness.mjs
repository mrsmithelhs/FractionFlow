import assert from 'node:assert/strict';
import { createFraction, equalFractions } from '../../../src/math/fraction.js';
import { createMixedNumber, mixedToImproper } from '../../../src/math/mixed-number.js';
const batch = [
  [1, 1, 2, [1, 2, 3, 4]],
  [1, 1, 4, [4, 5, 6, 8]],
  [1, 3, 4, [4, 6, 7, 8]],
  [1, 2, 8, [8, 9, 10, 12]],
];
for (const [whole, numerator, denominator, options] of batch) {
  assert([2, 4, 8].includes(denominator));
  assert(numerator > 0 && numerator < denominator);
  const target = mixedToImproper(createMixedNumber(whole, createFraction(numerator, denominator)));
  assert(target.numerator <= 2n * target.denominator);
  const fractions = options.map(n => createFraction(n, denominator));
  assert.equal(new Set(options).size, options.length);
  const matches = fractions.filter(f => equalFractions(f, target));
  assert.equal(matches.length, 1);
  console.log(`${whole} ${numerator}/${denominator}: ${matches[0].numerator}/${matches[0].denominator} (one exact match)`);
}
