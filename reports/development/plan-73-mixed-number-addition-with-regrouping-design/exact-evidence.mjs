import assert from 'node:assert/strict';
import { createFraction, addFractions, compareFractions, equalFractions } from '../../../src/math/fraction.js';
import { createMixedNumber, addMixedNumbers, mixedToImproper } from '../../../src/math/mixed-number.js';

const f = createFraction;
const m = (whole, pieces) => createMixedNumber(whole, f(pieces, 8));
for (const [name, a, b, rawPieces, resultWhole, remainder, exchange] of [
  ['zero', 3, 5, 8, 4, 0, true],
  ['nonzero', 5, 6, 11, 4, 3, true],
  ['below-one boundary', 3, 4, 7, 3, 7, false],
]) {
  const parts = addFractions(f(a, 8), f(b, 8));
  const sum = addMixedNumbers(m(1, a), m(2, b));
  const ungrouped = m(3, rawPieces);
  const grouped = m(resultWhole, remainder);
  assert.equal(parts.numerator, BigInt(rawPieces));
  assert.equal(compareFractions(parts, f(8, 8)) >= 0, exchange);
  assert.equal(sum.whole, BigInt(resultWhole));
  assert.equal(sum.fraction.numerator, BigInt(remainder));
  assert.equal(sum.fraction.denominator, 8n);
  assert.ok(equalFractions(mixedToImproper(ungrouped), mixedToImproper(grouped)));
  assert.ok(equalFractions(mixedToImproper(sum), mixedToImproper(grouped)));
  assert.ok(!equalFractions(mixedToImproper(sum), mixedToImproper(m(resultWhole, remainder + 1))));
  console.log(`${name}: 3 wholes + ${rawPieces}/8 = ${resultWhole} wholes + ${remainder}/8; exchange ${exchange ? 'available' : 'invalid'}; unequal witness rejected`);
}
