import assert from 'node:assert/strict';
import { createFraction, createMixedNumber, mixedToImproper, improperToMixed, equalFractions } from '../../../../src/math/index.js';

const cases = [[0,4,0,0],[3,4,0,3],[4,4,1,0],[5,4,1,1],[6,4,1,2],[3,2,1,1],[8,4,2,0],[10,8,1,2]];
const results = cases.map(([n,d,expectedWhole,expectedRemainder]) => {
  const original = createFraction(n,d);
  const mixed = improperToMixed(original);
  const roundtrip = mixedToImproper(mixed);
  assert.equal(mixed.whole, BigInt(expectedWhole));
  assert.equal(mixed.fraction.numerator, BigInt(expectedRemainder));
  assert.equal(mixed.fraction.denominator, BigInt(d));
  assert(equalFractions(original, roundtrip));
  assert.equal(roundtrip.numerator, BigInt(n));
  assert.equal(roundtrip.denominator, BigInt(d));
  assert(mixed.fraction.numerator < mixed.fraction.denominator);
  return { original: `${n}/${d}`, whole: String(mixed.whole), remainder: `${mixed.fraction.numerator}/${mixed.fraction.denominator}`, roundtrip: `${roundtrip.numerator}/${roundtrip.denominator}` };
});
const unorganized = createMixedNumber(0, createFraction(5,4));
assert(equalFractions(mixedToImproper(unorganized), createFraction(5,4)));
assert(unorganized.fraction.numerator >= unorganized.fraction.denominator);
assert(equalFractions(mixedToImproper(createMixedNumber(1,createFraction(2,4))), mixedToImproper(createMixedNumber(1,createFraction(1,2)))));
assert(!equalFractions(mixedToImproper(createMixedNumber(1,createFraction(2,4))), createFraction(5,4)));
console.log(JSON.stringify({cases: results, equivalence: ['0 + 5/4 equals 5/4 but has an improper remainder', '1 + 2/4 equals 1 + 1/2', '1 + 2/4 differs from 5/4']}, null, 2));
