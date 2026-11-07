import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {PLAN40_SUBTRACTION_RECIPE_RECORDS as records, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET as v1, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2 as v2, PLAN40_DATA_ONLY_HOLDOUT_SET as holdouts, findPlan40RecipeAssociationSet,resolvePlan40RecipeAssociationSet} from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import {resolveCuratedFixture} from '../src/content/authored-content-catalog.js';
import {buildCuratedProblem} from '../src/content/generator.js';
import {resolvePlan40SubtractionRecipeContext} from '../src/content/plan40-reusable-subtraction-recipes.js';
import {createEpisode} from '../src/interaction/episode.js';
import {createReplayEnvelope,replayEpisode} from '../src/interaction/replay.js';
import {PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION as definition} from '../src/interaction/episode-definition.js';
import {HIGH_SUPPORT_CONFIGURATION as support} from '../src/interaction/support.js';
const adopted=JSON.parse(readFileSync(new URL('../reports/development/plan-76-unlike-subtraction-problem-bank-expansion/expanded-records.json',import.meta.url),'utf8'));
const proposal=JSON.parse(readFileSync(new URL('../reports/development/plan-76-unlike-subtraction-problem-bank-expansion/publication-proposal.json',import.meta.url),'utf8'));
function instance(r){const f=resolveCuratedFixture(r.fixtureId,r.authoringRevision);return buildCuratedProblem({fixture:f,selector:f.selector,overlays:f.overlays,profileId:f.profileId,candidate:{left:f.left,right:f.right,reviewedTransitions:[]}})}
describe('Plan 79 versioned publication',()=>{
 it('registers exact adopted records in v2 order without altering v1 or holdouts',()=>{expect(v1.itemIds).toEqual(proposal.itemIds.slice(0,9));expect(v2.itemIds).toEqual(proposal.itemIds);expect(v2.revision).toBe('2');for(const r of adopted)expect(records.find(x=>x.itemId===r.itemId)).toEqual(r);expect(v2.itemIds.some(id=>holdouts.itemIds.includes(id))).toBe(false)});
 it('uses explicit membership for both revisions and rejects ambiguous or wrong associations',()=>{const old=v1.itemIds[0],fresh=v2.itemIds[9];expect(findPlan40RecipeAssociationSet(old)).toBeNull();expect(resolvePlan40RecipeAssociationSet(v1.id,'1',old)).toBe(v1);expect(resolvePlan40RecipeAssociationSet(v1.id,'2',old)).toBe(v2);expect(resolvePlan40RecipeAssociationSet(v1.id,'1',fresh)).toBeNull();for(const id of [old,fresh]){const r=records.find(x=>x.itemId===id), inst=instance(r),context=resolvePlan40SubtractionRecipeContext(inst,id,{practiceSetId:v2.id,practiceSetRevision:'2'});const state=createEpisode({instance:inst,episodeDefinition:definition,taskContext:context,support});expect(replayEpisode(createReplayEnvelope(state))).toEqual(state);expect(()=>resolvePlan40SubtractionRecipeContext(inst,id,{practiceSetId:v2.id,practiceSetRevision:'99'})).toThrow();}const r=records.find(x=>x.itemId===fresh);expect(()=>resolvePlan40SubtractionRecipeContext(instance(r),fresh,{practiceSetId:v1.id,practiceSetRevision:'1'})).toThrow();});
});
