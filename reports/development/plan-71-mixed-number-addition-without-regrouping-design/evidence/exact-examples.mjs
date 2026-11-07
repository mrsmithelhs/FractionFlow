import assert from 'node:assert/strict';
import { createFraction, addFractions, compareFractions, equalFractions, createMixedNumber, mixedToImproper, addMixedNumbers } from '../../../../src/math/index.js';

const cases = [
  { id:'A', left:[1,1,4], right:[1,1,4], result:[2,2,4] },
  { id:'B', left:[1,1,3], right:[2,1,3], result:[3,2,3] },
  { id:'C', left:[2,1,4], right:[1,2,4], result:[3,3,4] },
  { id:'D', left:[1,1,8], right:[2,3,8], result:[3,4,8] },
];
const mixed = ([w,n,d]) => createMixedNumber(w, createFraction(n,d));
const repr = x => [String(x.whole), String(x.fraction.numerator), String(x.fraction.denominator)];
const evidence = cases.map(c => {
  const [aw,an,ad] = c.left, [bw,bn,bd] = c.right;
  assert.equal(ad,bd); assert.ok(an > 0 && bn > 0 && an < ad && bn < bd);
  const fractional = addFractions(createFraction(an,ad),createFraction(bn,bd));
  assert.equal(compareFractions(fractional,createFraction(1,1)), -1);
  const result = addMixedNumbers(mixed(c.left),mixed(c.right));
  assert.deepEqual(repr(result), c.result.map(String));
  assert.ok(equalFractions(mixedToImproper(result),addFractions(mixedToImproper(mixed(c.left)),mixedToImproper(mixed(c.right)))));
  assert.equal(result.whole,BigInt(aw+bw));
  return { ...c, fractionalSum:[String(fractional.numerator),String(fractional.denominator)], exactImproper:[String(mixedToImproper(result).numerator),String(mixedToImproper(result).denominator)], observedResult:repr(result) };
});
console.log(JSON.stringify({ baseline:'6ce31af06f602e745ff7547fce772d88ccaf71de', cases:evidence },null,2));
