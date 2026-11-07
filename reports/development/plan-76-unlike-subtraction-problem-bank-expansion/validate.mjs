import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root=process.argv[2];
if (!root) throw new Error('provide isolated checkout path');
const load = p => import(pathToFileURL(path.join(root,p)).href);
const recordsModule=await load('src/content/data/plan40-reusable-subtraction-recipes-records.js');
const {resolveCuratedFixture}=await load('src/content/authored-content-catalog.js');
const {buildCuratedProblem}=await load('src/content/generator.js');
const {validateProblemInstance}=await load('src/content/validation.js');
const {evaluateProposedPathEligibility}=await load('src/content/eligibility.js');
const {validatePlan40SubtractionRecipeRecord,resolvePlan40SubtractionRecipeContext}=await load('src/content/plan40-reusable-subtraction-recipes.js');
const math=await load('src/math/index.js');
const {createEpisode,applyIntent}=await load('src/interaction/episode.js');
const {PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION:definition}=await load('src/interaction/episode-definition.js');
const {HIGH_SUPPORT_CONFIGURATION:support}=await load('src/interaction/support.js');
const {createReplayEnvelope,replayEpisode}=await load('src/interaction/replay.js');
const set=recordsModule.PLAN40_RECIPE_ASSOCIATION_SETS.find(x=>x.id==='plan76-isolated-set');
assert.equal(set.itemIds.length,8);
const records=recordsModule.PLAN40_SUBTRACTION_RECIPE_RECORDS.filter(x=>set.itemIds.includes(x.itemId));
const others=recordsModule.PLAN40_SUBTRACTION_RECIPE_RECORDS.filter(x=>!set.itemIds.includes(x.itemId));
const pair=x=>JSON.stringify(x.sourceForms);
assert.equal(new Set(records.map(pair)).size,records.length);
for(const r of records) assert(!others.some(o=>pair(o)===pair(r)),`duplicate ${r.itemId}`);
const form=x=>math.createFraction(BigInt(x.numerator),BigInt(x.denominator));
const instanceFor = r => { const fixture=resolveCuratedFixture(r.fixtureId,r.authoringRevision); assert(fixture); return buildCuratedProblem({fixture,selector:fixture.selector,overlays:fixture.overlays,profileId:fixture.profileId,candidate:{left:fixture.left,right:fixture.right,reviewedTransitions:[]}}); };
const results=[];
for(const r of records){
 const instance=instanceFor(r); assert.equal(validateProblemInstance(instance).valid,true,r.itemId);
 const paths=[instance.canonicalPath,...instance.alternatePaths].map(p=>evaluateProposedPathEligibility(instance,p.targetDenominator));
 const eligibility=evaluateProposedPathEligibility(instance,r.targetDenominator);
 assert.equal(eligibility.mathematicalValidity,'valid'); assert.equal(eligibility.rendering,'eligible'); assert.notEqual(eligibility.authoredCoverage,'outside-authored-coverage');
 const sides=validatePlan40SubtractionRecipeRecord(instance,r);
 const context=resolvePlan40SubtractionRecipeContext(instance,r.itemId,{practiceSetId:set.id,practiceSetRevision:set.revision}); assert.deepEqual(context.requiredSides,sides);
 const difference=math.subtractAtCommonDenominator(form(r.sourceForms.left),form(r.sourceForms.right),BigInt(r.targetDenominator));
 let state=createEpisode({instance,episodeDefinition:definition,taskContext:context,support});
 state=applyIntent(state,{type:'acknowledge-encounter'});
 if(r.requiredSide) state=applyIntent(state,{type:'select-renaming-side',side:r.requiredSide});
 for(const side of sides){
   const converted=math.convertToDenominator(form(r.sourceForms[side]),BigInt(r.targetDenominator));
   const proposed={kind:'fraction',numerator:String(converted.numerator),denominator:String(converted.denominator)};
   if(r.candidates){ const correct=math.equalFractions(form(r.sourceForms[side]),form(r.candidates[side])); state=applyIntent(state,correct?{type:'keep-inspected-form'}:{type:'repair-inspected-form',numerator:proposed.numerator}); }
   else state=applyIntent(state,{type:'submit-equivalent-form',proposed});
 }
 assert.equal(state.beat,'operate');
 state=applyIntent(state,{type:'submit-subtraction-result',proposed:{kind:'fraction',numerator:String(difference.numerator),denominator:String(difference.denominator)}});
 assert.equal(state.beat,'resolve'); assert.deepEqual(replayEpisode(createReplayEnvelope(state)),state);
 results.push({item:r.itemId,recipe:r.recipeId,sides,target:r.targetDenominator,difference:`${difference.numerator}/${difference.denominator}`,paths:paths.map(x=>({target:x.targetDenominator,rendering:x.rendering,coverage:x.authoredCoverage,reasons:x.reasons}))});
}
const first=records[0], instance=instanceFor(first);
for(const [label,mutation,expected] of [
 ['non-common target',{targetDenominator:'7'},/not a common denominator/],
 ['unsupported recipe',{recipeId:'unlike-subtraction.unsupported'},/recipe identity/],
 ['fixture mismatch',{fixtureId:'missing'},/source forms/],
]) { assert.throws(()=>validatePlan40SubtractionRecipeRecord(instance,{...first,...mutation}),expected,label); }
const inspect=records.find(r=>r.recipeId.includes('inspect')); const ii=instanceFor(inspect);
for(const [label,candidates] of [['two valid',{left:{kind:'fraction',numerator:'15',denominator:'20'},right:{kind:'fraction',numerator:'4',denominator:'20'}}],['zero valid',{left:{kind:'fraction',numerator:'14',denominator:'20'},right:{kind:'fraction',numerator:'5',denominator:'20'}}]]) assert.throws(()=>validatePlan40SubtractionRecipeRecord(ii,{...inspect,candidates}),/one valid and one invalid/,label);
const identify=records.find(r=>r.requiredSide); assert.throws(()=>validatePlan40SubtractionRecipeRecord(instanceFor(identify),{...identify,requiredSide:identify.requiredSide==='left'?'right':'left'}),/required sides/);
const ceiling=records[1]; assert.throws(()=>validatePlan40SubtractionRecipeRecord(instanceFor(ceiling),{...ceiling,targetDenominator:'60'}),/representation capability/);
const fixture=resolveCuratedFixture(first.fixtureId,first.authoringRevision);
assert.throws(()=>buildCuratedProblem({fixture:{...fixture,left:fixture.right,right:fixture.left},selector:fixture.selector,overlays:fixture.overlays,profileId:fixture.profileId,candidate:{left:fixture.right,right:fixture.left,reviewedTransitions:[]}}),e=>e.code==='CURATED_FIXTURE_NOT_ELIGIBLE' && e.details.reasons.includes('negative-result'));
console.log(JSON.stringify({status:'pass',records:results,rejections:['non-common target','unsupported recipe','fixture mismatch','two valid stimuli','zero valid stimuli','wrong required side','over-ceiling target','reversed negative subtraction']},null,2));
