import assert from 'node:assert/strict';
import { createFraction } from '../../../src/math/fraction.js';
import { createMixedNumber, regroupForSubtraction, equalMixedNumbers, subtractMixedNumbers, compareMixedNumbers } from '../../../src/math/mixed-number.js';
const mixed = (w, n) => createMixedNumber(w, createFraction(n, 8));
const rows = [
  [3, 2, 1, 5, 2, 10, 1, 5],
  [2, 1, 1, 7, 1, 9, 0, 2],
  [4, 3, 2, 7, 3, 11, 1, 4],
  [2, 2, 1, 3, 1, 10, 0, 7],
];
for (const [w,a,v,b,rw,rn,ow,on] of rows) {
  assert.ok(w > v && v >= 1 && 1 <= a && a < b && b <= 7);
  const start = mixed(w,a), renamed = regroupForSubtraction(start), take = mixed(v,b);
  assert.deepEqual(renamed, mixed(rw,rn));
  assert.ok(equalMixedNumbers(start, renamed));
  assert.deepEqual(subtractMixedNumbers(start,take), mixed(ow,on));
  assert.deepEqual(subtractMixedNumbers(renamed,take), mixed(ow,on));
  console.log(`${w} ${a}/8 = ${rw} ${rn}/8; minus ${v} ${b}/8 = ${ow} ${on}/8`);
}
assert.deepEqual(subtractMixedNumbers(mixed(3,3), mixed(1,3)), mixed(2,0));
console.log('control: 3 3/8 − 1 3/8 = 2 0/8; no decomposition');
assert.equal(compareMixedNumbers(mixed(1,2), mixed(2,5)), -1);
assert.throws(() => subtractMixedNumbers(mixed(1,2), mixed(2,5)), RangeError);
console.log('excluded negative: 1 2/8 < 2 5/8; core rejects negative subtraction');
const remainders = new Set();
for (let a=1; a<=7; a++) for (let b=a+1; b<=7; b++) remainders.add(8+a-b);
assert.deepEqual([...remainders].sort((a,b)=>a-b), [2,3,4,5,6,7]);
console.log('admitted source numerators yield remainder counts 2, 3, 4, 5, 6, 7');
