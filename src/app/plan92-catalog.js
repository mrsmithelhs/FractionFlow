// Exact task descriptors for the individually reviewed Plan 92 identities.
import {PLAN92_SCRATCH_IDENTITIES,preparePlan92ScratchCandidate} from './plan92-scratch-candidates.js';
import {createFraction,simplifyFraction,compareFractions,equalFractions,convertToDenominator,subtractAtCommonDenominator,gcd} from '../math/index.js';
import {deepFreeze} from '../content/schema.js';
import {isManagedFamilyFit} from './managed-fit.js';
export const PLAN92_MANAGED_ID='plan92-prototype';
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
let cachedDescriptors;
export function allGate92Descriptors(){return cachedDescriptors??=deepFreeze(PLAN92_SCRATCH_IDENTITIES.map(identity=>describeGate92(identity)));}

// Approval covers the measured viewport/text samples, not every larger or nearby screen.
// The established Plan 90 policy remains the fallback outside these exact samples.
export function isPlan92MeasuredFit(measurement, identity, conditionId) {
 if(!measurement||!identity||!isManagedFamilyFit(measurement,identity.typeId,conditionId))return false;
 const {viewportWidth:w,viewportHeight:h,font}=measurement;
 if(w===1093&&h===614&&font===16)return true;
 if(w===650&&h===740&&font===32)return true;
 return w===600&&h===740&&font===32&&identity.role==='C';
}
export function isPlan92Manifest(manifest){
 try{
  if(!manifest||JSON.stringify(Object.keys(manifest).sort())!==JSON.stringify(['catalogRevision','compatibilityRevision','demandsRevision','entries','id','policyRevision','revision','shapeId'])||manifest.id!==PLAN92_MANAGED_ID||manifest.revision!=='1'||manifest.catalogRevision!=='ff92-catalog@1'||manifest.policyRevision!=='ff92-policy@1'||manifest.compatibilityRevision!=='ff92-compat@1'||manifest.demandsRevision!=='ff92-demands@1'||!Array.isArray(manifest.entries)||!manifest.entries.length)return false;
  const descriptors=manifest.entries.map(identity=>describeGate92(identity));
  if(manifest.shapeId==='single')return descriptors.length===1;
  if(manifest.shapeId!==descriptors.map(d=>d.role).join('-'))return false;
  return validateGate92Visit(descriptors);
 }catch{return false;}
}
