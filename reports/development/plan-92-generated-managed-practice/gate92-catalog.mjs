// Report-local mathematical descriptor and compatibility audit; not managed admission.
import {PLAN92_SCRATCH_IDENTITIES,preparePlan92ScratchCandidate} from '../../../src/app/plan92-scratch-candidates.js';
import {createFraction,simplifyFraction,compareFractions,equalFractions,convertToDenominator,subtractAtCommonDenominator,gcd} from '../../../src/math/index.js';
const frac=f=>createFraction(BigInt(f.numerator),BigInt(f.denominator));
const key=f=>{const x=simplifyFraction(frac(f));return `${x.numerator}/${x.denominator}`};
const fail=m=>{throw Error(`gate92 compatibility: ${m}`)};
export function describeGate92(identity,support='high-support',condition='phase2-bundle-1'){
 const prepared=preparePlan92ScratchCandidate(identity,support,condition),c=prepared.state.taskContext;let decision,problemKey;
 if(identity.role==='C'){
  const a=frac(c.sourceForms.first),b=frac(c.sourceForms.second),relation=compareFractions(a,b),cmp=relation<0?'<':relation>0?'>':'=';
  if(!['compare.same-denominator','compare.same-count-unit-size','compare.half-benchmark'].includes(c.cueId))fail('comparison cue');
  decision={role:'C',structure:c.cueId.replace('compare.',''),relation:cmp};problemKey={family:'comparison',pair:[key(c.sourceForms.first),key(c.sourceForms.second)].sort()};
 }else{
  const l=frac(c.sourceForms.left),r=frac(c.sourceForms.right),target=BigInt(c.targetDenominator),converted={left:convertToDenominator(l,target),right:convertToDenominator(r,target)};
  const relation=l.denominator%r.denominator===0n||r.denominator%l.denominator===0n?'nested':gcd(l.denominator,r.denominator)===1n?'coprime':'shared-factor';
  const difference=subtractAtCommonDenominator(l,r,target);if(difference.numerator<=0n)fail('nonpositive difference');
  problemKey={family:'subtraction',left:key(c.sourceForms.left),right:key(c.sourceForms.right)};
  if(identity.role==='I'){
   const sides=['left','right'].filter(side=>BigInt(c.sourceForms[side].denominator)!==target);if(sides.length!==1||JSON.stringify(sides)!==JSON.stringify(c.requiredSides))fail('identify sides');decision={role:'I',denominatorRelationship:relation,side:sides[0]};
  }else if(identity.role==='S'){
   if(!c.candidates)fail('inspect offered forms');const judgments=Object.fromEntries(['left','right'].map(side=>[side,equalFractions(frac(c.sourceForms[side]),frac(c.candidates[side]))?'keep':'repair']));if(Object.values(judgments).filter(x=>x==='keep').length!==1)fail('inspect must include one keep and one repair');decision={role:'S',denominatorRelationship:relation,judgments};
  }else if(identity.role==='T'){
   if(c.requiredSides.length!==2||relation==='nested'||converted.left.denominator!==target||converted.right.denominator!==target)fail('construct common units');decision={role:'T',denominatorRelationship:relation,work:'construct-both-and-subtract'};
  }else fail('role');
 }
 return {role:identity.role,identity,problemKey,decision};
}
export const GATE92_SHAPES=Object.freeze([['C','I','T'],['C','S','T'],['C','I','S','T']]);
// Cross-role transitions share a goal and require validated role tasks, not identical operands.
export function validateGate92Visit(descriptors){
 const roles=descriptors.map(x=>x.role);if(!GATE92_SHAPES.some(path=>JSON.stringify(path)===JSON.stringify(roles)))fail('shape');
 const keys=new Set();for(const d of descriptors){const verified=describeGate92(d.identity);if(JSON.stringify(verified)!==JSON.stringify(d))fail('descriptor altered');const k=JSON.stringify(d.problemKey);if(keys.has(k))fail('duplicate mathematical problem');keys.add(k);}
 return true;
}
export function allGate92Descriptors(){return PLAN92_SCRATCH_IDENTITIES.map(identity=>describeGate92(identity));}
