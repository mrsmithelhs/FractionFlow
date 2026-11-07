import assert from 'node:assert/strict';
import { createFraction, createMixedNumber, subtractMixedNumbers, equalMixedNumbers, classifyMixedRegrouping } from '../../../src/math/index.js';

const mixed = (w, n, d = 8n) => createMixedNumber(w, createFraction(n, d));
// A local proposed-slice predicate, not a claim about current content admission.
const admits = (a, b) => a.whole > 0n && b.whole > 0n && a.whole >= b.whole
  && a.fraction.denominator === b.fraction.denominator
  && a.fraction.numerator > 0n && b.fraction.numerator > 0n
  && a.fraction.numerator < a.fraction.denominator && b.fraction.numerator < b.fraction.denominator
  && a.fraction.numerator >= b.fraction.numerator;
const cases = [
  [mixed(3n,5n), mixed(1n,2n), mixed(2n,3n), '3 5/8 − 1 2/8 = 2 3/8'],
  [mixed(3n,3n), mixed(1n,3n), mixed(2n,0n), '3 3/8 − 1 3/8 = 2'],
  [mixed(2n,6n), mixed(1n,2n), mixed(1n,4n), '2 6/8 − 1 2/8 = 1 4/8'],
  [mixed(2n,1n), mixed(1n,1n), mixed(1n,0n), '2 1/8 − 1 1/8 = 1'],
];
for (const [left, right, expected, label] of cases) {
  assert(admits(left, right));
  assert.equal(classifyMixedRegrouping(left, right, 'subtract').regroupingType, 'none');
  assert(equalMixedNumbers(subtractMixedNumbers(left, right), expected));
  console.log(`PASS ${label}`);
}
const left = mixed(3n,2n), right = mixed(1n,5n);
assert(!admits(left, right));
assert.equal(classifyMixedRegrouping(left, right, 'subtract').regroupingType, 'decomposition');
assert(equalMixedNumbers(subtractMixedNumbers(left, right), mixed(1n,5n)));
console.log('PASS excluded: 3 2/8 − 1 5/8 requires decomposition (exact difference 1 5/8)');
assert(!admits(mixed(2n,1n), mixed(1n,1n,4n)));
assert(!admits(mixed(2n,0n), mixed(1n,1n)));
assert(!admits(mixed(1n,2n), mixed(2n,1n)));
console.log('PASS proposed predicate excludes unequal denominators, zero source part, and too few whole units');
