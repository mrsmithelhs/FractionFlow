import assert from 'node:assert/strict';
import { createFraction, compareFractions, equalFractions, leastCommonDenominator, convertToDenominator, subtractFractions, simplifyFraction } from '../../../../src/math/index.js';
const pairs = [[[2,8],[6,8]],[[6,8],[2,8]],[[1,6],[5,6]],[[5,6],[1,6]],[[3,6],[1,2]],[[1,2],[3,4]],[[3,4],[1,2]],[[3,5],[5,9]]];
const fmt = f => `${f.numerator}/${f.denominator}`;
const rows = pairs.map(([a,b]) => {
 const first=createFraction(...a), second=createFraction(...b), order=compareFractions(first,second);
 const larger=order>=0?first:second, smaller=order>=0?second:first;
 const d=leastCommonDenominator(first.denominator,second.denominator);
 const result=subtractFractions(larger,smaller);
 assert.equal(equalFractions(first,second),order===0);
 assert.equal(compareFractions(result,createFraction(0,1))>=0,true);
 assert.equal(equalFractions(result,subtractFractions(order>=0?first:second,order>=0?second:first)),true);
 return { first:fmt(first),second:fmt(second),relation:order<0?'<':order>0?'>':'=', computationalOrder:order===0?'equal':order>0?'first minus second':'second minus first', commonDenominator:String(d), renamed:[fmt(convertToDenominator(first,d)),fmt(convertToDenominator(second,d))], distance:fmt(result), normalized:fmt(simplifyFraction(result)) };
});
for (const [i,j] of [[0,1],[2,3],[5,6]]) assert.equal(rows[i].normalized,rows[j].normalized);
assert.equal(rows[4].normalized,'0/1');
console.log(JSON.stringify({baseline:'ef47e2c31e3d1f2944ad5198f5b0e1e39f6d1c67', rows},null,2));
