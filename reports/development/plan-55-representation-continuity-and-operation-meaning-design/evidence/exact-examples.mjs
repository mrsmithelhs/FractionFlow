import assert from 'node:assert/strict';
import { createFraction, addFractions, subtractFractions, compareFractions, equalFractions } from '../../../../src/math/index.js';

// Illustrative inputs only; results are derived by the existing exact core.
const examples = [
  {start:[1,4], operation:'add', distance:[2,4]},
  {start:[3,4], operation:'subtract', distance:[2,4]},
  {start:[1,6], operation:'add', distance:[3,6]},
  {start:[5,6], operation:'subtract', distance:[3,6]},
  {start:[2,8], operation:'add', distance:[3,8]},
  {start:[7,8], operation:'subtract', distance:[5,8]},
];
const zero = createFraction(0,1), one = createFraction(1,1);
const show = f => `${f.numerator}/${f.denominator}`;
for (const example of examples) {
  const start = createFraction(...example.start), distance = createFraction(...example.distance);
  const end = example.operation === 'add' ? addFractions(start,distance) : subtractFractions(start,distance);
  for (const amount of [start,distance,end]) assert.ok(compareFractions(amount,zero)>0 && compareFractions(amount,one)<0);
  const measured = example.operation === 'add' ? subtractFractions(end,start) : subtractFractions(start,end);
  assert.ok(equalFractions(measured,distance));
  assert.ok(example.operation === 'add' ? compareFractions(end,start)>0 : compareFractions(end,start)<0);
  console.log(`${show(start)} ${example.operation === 'add' ? '+' : '-'} ${show(distance)} -> ${show(end)}; unsigned interval ${show(measured)}`);
}
console.log('6 exact examples pass: positive proper bounds, directed order, and interval round trip.');
