import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { PLAN40_SUBTRACTION_RECIPE_RECORDS as records, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET as v1, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2 as v2, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V3 as v3, PLAN40_DATA_ONLY_HOLDOUT_SET as holdouts, resolvePlan40RecipeAssociationSet } from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE as chooser } from '../src/app/practice-types.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import { resolvePlan40SubtractionRecipeContext } from '../src/content/plan40-reusable-subtraction-recipes.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';
import { createEpisode } from '../src/interaction/episode.js';
import { PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION as definition } from '../src/interaction/episode-definition.js';
import { HIGH_SUPPORT_CONFIGURATION as support } from '../src/interaction/support.js';
const candidates=JSON.parse(readFileSync(new URL('../reports/development/plan-85-cross-recipe-problem-bank-expansion/plan40-candidates.json',import.meta.url),'utf8'));
const oracle=JSON.parse(readFileSync(new URL('../reports/development/plan-89-versioned-problem-bank-publication/baseline-v6-oracles.json',import.meta.url),'utf8'));
function instance(r){const f=resolveCuratedFixture(r.fixtureId,r.authoringRevision);return buildCuratedProblem({fixture:f,selector:f.selector,overlays:f.overlays,profileId:f.profileId,candidate:{left:f.left,right:f.right,reviewedTransitions:[]}})}
describe('Plan 89 held subtraction revision',()=>{
 it('registers the exact staged fields and ordered membership without exposing it in the default chooser',()=>{
   expect(v3.id).toBe(v2.id);expect(v3.revision).toBe('3');expect(v3.itemIds).toEqual([...v2.itemIds,...candidates.map(r=>r.itemId)]);
   expect(v1.itemIds).toEqual(v2.itemIds.slice(0,9));expect(new Set(v3.itemIds).size).toBe(30);
   expect(chooser.setRevision).toBe('2');expect(chooser.items.map(x=>x.id)).toEqual(v2.itemIds);
   for(const c of candidates){const r=records.find(x=>x.itemId===c.itemId);for(const [k,v] of Object.entries(c))expect(r[k]).toEqual(v);const f=resolveCuratedFixture(c.fixtureId,c.authoringRevision);expect(f.left).toEqual(c.sourceForms.left);expect(f.right).toEqual(c.sourceForms.right);}
   expect(v3.itemIds.some(id=>holdouts.itemIds.includes(id))).toBe(false);
 });
 it('reconstructs frozen baseline states and preserves explicit membership',()=>{
   for(const w of oracle.witnesses){const state=replayEpisode(w.envelope);expect(JSON.parse(JSON.stringify(state))).toEqual(w.expected);expect(state.taskContext.practiceSetRevision).toBe(w.revision);}
   const old=v2.itemIds[0],fresh=candidates[0].itemId;
   expect(resolvePlan40RecipeAssociationSet(v3.id,'3',old)).toBe(v3);expect(resolvePlan40RecipeAssociationSet(v3.id,'3',fresh)).toBe(v3);
   for(const [set,rev,id] of [[v1.id,'1',fresh],[v2.id,'2',fresh],[v3.id,'3',holdouts.itemIds[0]],['wrong','3',fresh],[v3.id,'99',fresh]])expect(resolvePlan40RecipeAssociationSet(set,rev,id)).toBeNull();
   const r=records.find(x=>x.itemId===fresh),i=instance(r);
   expect(()=>resolvePlan40SubtractionRecipeContext(i,fresh,{practiceSetId:v2.id,practiceSetRevision:'2'})).toThrow();
   expect(()=>resolvePlan40SubtractionRecipeContext(i,fresh,{practiceSetId:v3.id,practiceSetRevision:'99'})).toThrow();
   const wrong=structuredClone(i);wrong.provenance.fixtureId='wrong';expect(()=>resolvePlan40SubtractionRecipeContext(wrong,fresh,{practiceSetId:v3.id,practiceSetRevision:'3'})).toThrow();
   for(const id of [old,fresh,candidates.find(x=>x.stimulusId).itemId]){
     const record=records.find(x=>x.itemId===id),inst=instance(record),taskContext=resolvePlan40SubtractionRecipeContext(inst,id,{practiceSetId:v3.id,practiceSetRevision:'3'});
     const state=createEpisode({instance:inst,episodeDefinition:definition,taskContext,support}),envelope=createReplayEnvelope(state);
     expect(replayEpisode(envelope)).toEqual(state);expect(replayEpisode(envelope).taskContext.practiceSetRevision).toBe('3');
     if(record.stimulusId){const bad=structuredClone(envelope);bad.taskContext.stimulusId='wrong-stimulus';expect(()=>replayEpisode(bad)).toThrow();}
   }
 });
});
