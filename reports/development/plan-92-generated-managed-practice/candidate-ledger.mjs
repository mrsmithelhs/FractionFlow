import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  compareFractions, createFraction, convertToDenominator, equalFractions,
  leastCommonDenominator, simplifyFraction, subtractAtCommonDenominator,
} from '../../../src/math/index.js';
import {
  PLAN45_COMPARISON_RECORDS, PLAN45_COMPARISON_SET_ID, PLAN45_COMPARISON_SET_REVISION,
} from '../../../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import {
  PLAN40_SUBTRACTION_RECIPE_RECORDS, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2,
  PLAN40_RECIPE_IDS,
} from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { validatePlan45ComparisonRecord } from '../../../src/content/plan45-symbolic-fraction-comparison-task.js';
import { PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE, PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE } from '../../../src/app/practice-types.js';
import { PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION as PLAN45_BASE_DEFINITION } from '../../../src/interaction/episode-definition.js';
import { resolveCuratedFixture } from '../../../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../../../src/content/generator.js';
import {
  resolvePlan40SubtractionRecipeContext, validatePlan40SubtractionRecipeContext,
} from '../../../src/content/plan40-reusable-subtraction-recipes.js';

const batches = {
  C: ['plan45-compare-02', 'plan45-compare-09', 'plan45-compare-10'],
  I: ['plan40-identify-one-half-one-eighth-8', 'plan40-identify-two-thirds-five-twelfths-12', 'plan76-identify-seven-eighths-one-fourth-8'],
  S: ['plan40-inspect-two-thirds-one-fourth-12', 'plan76-inspect-three-fourths-one-fifth-20'],
  T: ['plan40-construct-half-fifth-10', 'plan40-construct-five-sixths-three-eighths-24', 'plan76-construct-five-sixths-one-tenth-30'],
};
const wire = (f) => ({ numerator: String(f.numerator), denominator: String(f.denominator) });
const math = (f) => createFraction(BigInt(f.numerator), BigInt(f.denominator));
const canonical = (f) => wire(simplifyFraction(math(f)));
const gcd = (a, b) => b === 0n ? a : gcd(b, a % b);
const requireRecord = (items, id, role) => {
  const matches = items.filter((r) => r.itemId === id);
  if (matches.length !== 1) throw new Error(`${role} ${id}: expected one registered record, got ${matches.length}`);
  return matches[0];
};
const comparisonRecords = PLAN45_COMPARISON_RECORDS;
const subtractionRecords = PLAN40_SUBTRACTION_RECIPE_RECORDS;
const v2 = PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2;
if (PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE.id !== 'symbolic-fraction-comparison'
  || PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE.setId !== PLAN45_COMPARISON_SET_ID
  || PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE.setRevision !== PLAN45_COMPARISON_SET_REVISION
  || PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE.episodeDefinition.revision !== '2'
  || PLAN45_BASE_DEFINITION.revision !== '1') {
  throw new Error('C practice type or managed episode definition association drifted');
}
if (PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.id !== 'unlike-denominator-subtraction'
  || PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.setId !== v2.id
  || PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.setRevision !== v2.revision) {
  throw new Error('subtraction practice type or vetted set association drifted');
}

const entries = [];
for (const itemId of batches.C) {
  const r = requireRecord(comparisonRecords, itemId, 'C');
  const practiceItem = PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE.items.find((x) => x.id === itemId);
  if (!PLAN45_COMPARISON_RECORDS.length || !PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE.items.includes(practiceItem)
    || practiceItem.episodeDefinitionId !== PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE.episodeDefinition.id
    || practiceItem.episodeDefinitionRevision !== '2') throw new Error(`C item not registered on actual managed practice type: ${itemId}`);
  const checked = validatePlan45ComparisonRecord(r);
  const [a,b] = [math(r.sourceForms.first), math(r.sourceForms.second)];
  const c = compareFractions(a,b);
  entries.push({ role:'C', identity:{typeId:PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE.id,setId:PLAN45_COMPARISON_SET_ID,setRevision:PLAN45_COMPARISON_SET_REVISION,itemId:r.itemId,itemRevision:r.authoringRevision,authoringRevision:r.authoringRevision,definitionId:practiceItem.episodeDefinitionId,definitionRevision:practiceItem.episodeDefinitionRevision,underlyingDefinitionRevision:PLAN45_BASE_DEFINITION.revision,recipeId:r.recipeId,recipeRevision:r.recipeRevision,taskDataId:r.taskDataId,taskDataRevision:r.taskDataRevision}, sourceForms:r.sourceForms, exact:{relation:c<0?'<':c>0?'>':'=', canonicalUnorderedKey:[canonical(r.sourceForms.first),canonical(r.sourceForms.second)].sort((x,y)=>JSON.stringify(x).localeCompare(JSON.stringify(y)))}, decision:{cueId:r.cueId, hintContext:checked.hintContext, structure:r.cueId.replace('compare.','')}, taskContract:{response:'select <, =, or >; exact relation derived above', helpCue:r.cueId} });
}

for (const role of ['I','S','T']) for (const itemId of batches[role]) {
  const r = requireRecord(subtractionRecords,itemId,role);
  if (!v2.itemIds.includes(itemId)) throw new Error(`${role} ${itemId}: absent from vetted set v2`);
  const registeredItem=PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items.find((x)=>x.id===itemId);
  const expectedRegistration={fixtureId:r.fixtureId,authoringRevision:r.authoringRevision,episodeDefinitionId:r.definitionId,episodeDefinitionRevision:r.definitionRevision,patternId:r.recipeId,patternRevision:r.patternRevision,targetDenominator:r.targetDenominator,taskDataId:r.taskDataId,taskDataRevision:r.taskDataRevision};
  if(!registeredItem || registeredItem.id!==r.itemId || Object.entries(expectedRegistration).some(([key,value])=>registeredItem[key]!==value)) throw new Error(`${role} ${itemId}: practice-type identity fields do not exactly match record`);
  const fixture=resolveCuratedFixture(r.fixtureId,r.authoringRevision);
  if (!fixture) throw new Error(`${role} ${itemId}: fixture not registered`);
  const instance=buildCuratedProblem({fixture,selector:fixture.selector,overlays:fixture.overlays,profileId:fixture.profileId,candidate:{left:fixture.left,right:fixture.right,reviewedTransitions:[]}});
  const context=resolvePlan40SubtractionRecipeContext(instance,itemId,{practiceSetId:v2.id,practiceSetRevision:v2.revision});
  validatePlan40SubtractionRecipeContext(instance,context);
  const left=math(r.sourceForms.left), right=math(r.sourceForms.right), target=BigInt(r.targetDenominator);
  const converted={left:wire(convertToDenominator(left,target)),right:wire(convertToDenominator(right,target))};
  const difference=subtractAtCommonDenominator(left,right,target);
  const common=leastCommonDenominator(left.denominator,right.denominator);
  const rel=gcd(left.denominator,right.denominator)===1n?'coprime':(left.denominator%right.denominator===0n||right.denominator%left.denominator===0n?'nested':'shared-factor');
  const structure={denominatorRelation:rel, gcd:gcd(left.denominator,right.denominator).toString(), leastCommonDenominator:common.toString(), targetDenominator:target.toString(), scaleFactors:{left:(target/left.denominator).toString(),right:(target/right.denominator).toString()}, convertedForms:converted, exactDifference:wire(difference)};
  const exact={canonicalProblemKey:`${canonical(r.sourceForms.left).numerator}/${canonical(r.sourceForms.left).denominator}-${canonical(r.sourceForms.right).numerator}/${canonical(r.sourceForms.right).denominator}`,difference:wire(difference)};
  let decision;
  if(role==='I') decision={requiredSide:r.requiredSide, convertedSide:context.requiredSides[0], untouchedSide:r.requiredSide==='left'?'right':'left', untouchedAlreadyAtTarget:r.sourceForms[r.requiredSide==='left'?'right':'left'].denominator===r.targetDenominator, action:'identify the operand needing equivalent common-unit renaming'};
  if(role==='S') decision={offeredCandidates:r.candidates, judgments:Object.fromEntries(['left','right'].map(side=>[side,equalFractions(math(r.sourceForms[side]),math(r.candidates[side]))?'keep':'repair'])), action:'judge each offered equivalent form'};
  if(role==='T') decision={action:'construct both equivalent common-unit forms, then subtract', constructionWork:structure};
  entries.push({role,identity:{setId:v2.id,setRevision:v2.revision,itemId:r.itemId,fixtureId:r.fixtureId,authoringRevision:r.authoringRevision,definitionId:r.definitionId,definitionRevision:r.definitionRevision,recipeId:r.recipeId,patternRevision:r.patternRevision,taskDataId:r.taskDataId,taskDataRevision:r.taskDataRevision,stimulusId:r.stimulusId,stimulusRevision:r.stimulusRevision},sourceForms:r.sourceForms,targetDenominator:r.targetDenominator,exact,structure,decision,taskContract:{requiredSides:context.requiredSides,candidates:context.candidates,standaloneContextValidated:true,managedFit:'not measured'}});
}

const signatures={ C:[...new Set(entries.filter(e=>e.role==='C').map(e=>e.decision.structure))], I:[...new Set(entries.filter(e=>e.role==='I').map(e=>e.decision.requiredSide))], S:[...new Set(entries.filter(e=>e.role==='S').map(e=>Object.values(e.decision.judgments).join('/')))], T:[...new Set(entries.filter(e=>e.role==='T').map(e=>e.structure.denominatorRelation))] };
const output={schema:'ff92-candidate-ledger@1',generatedBy:'candidate-ledger.mjs',scope:'Plan 92 proposed fit-worker first batch; registry/task-contract reconciliation only',claims:{registeredAndExactMathValidated:true,managedFitMeasured:false,admissionApproved:false},batchOrder:batches,entries,structuralSummary:signatures,shortfalls:[
  'Three T candidates yield only two denominator-relation classes in this signature scheme (coprime and shared-factor); a third distinct common-unit decision structure is not demonstrated by denominator relation alone.',
  'This ledger validates public record associations, exact math, and standalone task-context contracts; it contains no mounted visual/linear fit, help/feedback geometry, condition or support measurements.',
  'Inspect contract requires exactly one correct offered form; the batch contains left-repair/right-keep and left-keep/right-repair, and no both-keep decision.'
]};
const outPath=resolve(dirname(fileURLToPath(import.meta.url)),'candidate-ledger.json');
await writeFile(outPath,`${JSON.stringify(output,null,2)}\n`,'utf8');
console.log(`Wrote ${entries.length} validated records to ${outPath}`);
console.log(`T denominator relation signatures: ${signatures.T.join(', ')}`);
