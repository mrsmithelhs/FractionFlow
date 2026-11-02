import { createFraction, equalFractions, improperToMixed, mixedToImproper, regroupForSubtraction } from '../../../../src/math/index.js';
const cases = [[0,4],[3,4],[4,4],[5,4],[6,4],[3,2],[8,4],[10,8]];
const out = cases.map(([n,d]) => {
  const raw = createFraction(n,d), mixed = improperToMixed(raw), round = mixedToImproper(mixed);
  if (!equalFractions(raw,round)) throw Error('round trip mismatch');
  const candidates = Array.from({length:2*d+1},(_,i)=>createFraction(i,d));
  const positions = candidates.map((v,i)=>equalFractions(raw,v)?i:null).filter(v=>v!==null);
  if (positions.length!==1) throw Error('lattice match');
  return {raw:`${n}/${d}`, latticeDenominator:d, candidateIndex:positions[0], unitCount:String(mixed.whole), remainder:`${mixed.fraction.numerator}/${mixed.fraction.denominator}`, roundTrip:`${round.numerator}/${round.denominator}`};
});
const a=createFraction(6,4), b=createFraction(3,2);
if (!equalFractions(a,b)) throw Error('equivalence');
const regroup=regroupForSubtraction(improperToMixed(createFraction(5,4)));
if (!equalFractions(mixedToImproper(regroup),createFraction(5,4))) throw Error('regroup mismatch');
console.log(JSON.stringify({cases:out, equivalent:['6/4','3/2'], regroup:{whole:String(regroup.whole),fraction:`${regroup.fraction.numerator}/${regroup.fraction.denominator}`}},null,2));
