import { deepFreeze } from '../content/schema.js';
import { buildCuratedProblem } from '../content/generator.js';
import { resolveCuratedFixture } from '../content/authored-content-catalog.js';
import { validateProblemInstance } from '../content/validation.js';
import { getPracticeType } from './practice-types.js';
import { getEpisodeDefinition } from '../interaction/episode-definition.js';
import { createEpisode } from '../interaction/episode.js';
import { getRegisteredCondition, REGISTERED_CONDITIONS } from './conditions.js';
import { getRegisteredSupportLevel, REGISTERED_SUPPORT_LEVELS } from './support-levels.js';
import { resolvePlan40SubtractionRecipeContext, validatePlan40SubtractionRecipeContext } from '../content/plan40-reusable-subtraction-recipes.js';
import { resolvePlan49Context, validatePlan49Context } from '../interaction/plan49-comparison-construction.js';
import { PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION } from '../interaction/episode-definition.js';
import { PLAN45_COMPARISON_SET_ID, PLAN45_COMPARISON_SET_REVISION } from '../content/data/plan45-symbolic-fraction-comparison-records.js';
import { PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2 } from '../content/data/plan40-reusable-subtraction-recipes-records.js';

// Preparation-only boundary. These exact identities are not managed admissions.
export const PLAN92_SCRATCH_IDENTITIES = deepFreeze([
  {
    "role": "C",
    "typeId": "symbolic-fraction-comparison",
    "setId": "symbolic-fraction-comparison-vetted-set",
    "setRevision": "1",
    "itemId": "plan45-compare-02",
    "itemRevision": "plan45-record-v1",
    "authoringRevision": "plan45-record-v1",
    "definitionId": "phase-4-symbolic-fraction-comparison",
    "definitionRevision": "2",
    "underlyingDefinitionRevision": "1",
    "recipeId": "symbolic-fraction-comparison",
    "recipeRevision": "1",
    "taskDataId": "plan45-symbolic-fraction-comparison-task-data",
    "taskDataRevision": "1",
    "cueId": "compare.same-denominator"
  },
  {
    "role": "C",
    "typeId": "symbolic-fraction-comparison",
    "setId": "symbolic-fraction-comparison-vetted-set",
    "setRevision": "1",
    "itemId": "plan45-compare-09",
    "itemRevision": "plan45-record-v1",
    "authoringRevision": "plan45-record-v1",
    "definitionId": "phase-4-symbolic-fraction-comparison",
    "definitionRevision": "2",
    "underlyingDefinitionRevision": "1",
    "recipeId": "symbolic-fraction-comparison",
    "recipeRevision": "1",
    "taskDataId": "plan45-symbolic-fraction-comparison-task-data",
    "taskDataRevision": "1",
    "cueId": "compare.same-count-unit-size"
  },
  {
    "role": "C",
    "typeId": "symbolic-fraction-comparison",
    "setId": "symbolic-fraction-comparison-vetted-set",
    "setRevision": "1",
    "itemId": "plan45-compare-10",
    "itemRevision": "plan45-record-v1",
    "authoringRevision": "plan45-record-v1",
    "definitionId": "phase-4-symbolic-fraction-comparison",
    "definitionRevision": "2",
    "underlyingDefinitionRevision": "1",
    "recipeId": "symbolic-fraction-comparison",
    "recipeRevision": "1",
    "taskDataId": "plan45-symbolic-fraction-comparison-task-data",
    "taskDataRevision": "1",
    "cueId": "compare.half-benchmark"
  },
  {
    "role": "I",
    "typeId": "unlike-denominator-subtraction",
    "setId": "unlike-subtraction-vetted-set",
    "setRevision": "2",
    "itemId": "plan40-identify-one-half-one-eighth-8",
    "fixtureId": "curated-plan40-identify-one-half-one-eighth",
    "authoringRevision": "plan40-record-v1",
    "definitionId": "phase-3-reusable-subtraction-recipes",
    "definitionRevision": "1",
    "recipeId": "unlike-subtraction.identify-side-construct",
    "patternRevision": "1",
    "taskDataId": "plan40-subtraction-recipe-task-data",
    "taskDataRevision": "1",
    "stimulusId": null,
    "stimulusRevision": null,
    "itemRevision": "plan40-record-v1"
  },
  {
    "role": "I",
    "typeId": "unlike-denominator-subtraction",
    "setId": "unlike-subtraction-vetted-set",
    "setRevision": "2",
    "itemId": "plan40-identify-two-thirds-five-twelfths-12",
    "fixtureId": "curated-plan40-identify-two-thirds-five-twelfths",
    "authoringRevision": "plan40-record-v1",
    "definitionId": "phase-3-reusable-subtraction-recipes",
    "definitionRevision": "1",
    "recipeId": "unlike-subtraction.identify-side-construct",
    "patternRevision": "1",
    "taskDataId": "plan40-subtraction-recipe-task-data",
    "taskDataRevision": "1",
    "stimulusId": null,
    "stimulusRevision": null,
    "itemRevision": "plan40-record-v1"
  },
  {
    "role": "I",
    "typeId": "unlike-denominator-subtraction",
    "setId": "unlike-subtraction-vetted-set",
    "setRevision": "2",
    "itemId": "plan76-identify-seven-eighths-one-fourth-8",
    "fixtureId": "curated-plan76-identify-seven-eighths-one-fourth-8",
    "authoringRevision": "plan76-record-v1",
    "definitionId": "phase-3-reusable-subtraction-recipes",
    "definitionRevision": "1",
    "recipeId": "unlike-subtraction.identify-side-construct",
    "patternRevision": "1",
    "taskDataId": "plan40-subtraction-recipe-task-data",
    "taskDataRevision": "1",
    "stimulusId": null,
    "stimulusRevision": null,
    "itemRevision": "plan76-record-v1"
  },
  {
    "role": "S",
    "typeId": "unlike-denominator-subtraction",
    "setId": "unlike-subtraction-vetted-set",
    "setRevision": "2",
    "itemId": "plan40-inspect-two-thirds-one-fourth-12",
    "fixtureId": "curated-plan40-inspect-two-thirds-one-fourth",
    "authoringRevision": "plan40-record-v1",
    "definitionId": "phase-3-reusable-subtraction-recipes",
    "definitionRevision": "1",
    "recipeId": "unlike-subtraction.inspect-keep-repair",
    "patternRevision": "1",
    "taskDataId": "plan40-subtraction-recipe-task-data",
    "taskDataRevision": "1",
    "stimulusId": "plan40-stim-inspect-two-thirds-one-fourth-12",
    "stimulusRevision": "1",
    "itemRevision": "plan40-record-v1"
  },
  {
    "role": "S",
    "typeId": "unlike-denominator-subtraction",
    "setId": "unlike-subtraction-vetted-set",
    "setRevision": "2",
    "itemId": "plan76-inspect-three-fourths-one-fifth-20",
    "fixtureId": "curated-plan76-inspect-three-fourths-one-fifth-20",
    "authoringRevision": "plan76-record-v1",
    "definitionId": "phase-3-reusable-subtraction-recipes",
    "definitionRevision": "1",
    "recipeId": "unlike-subtraction.inspect-keep-repair",
    "patternRevision": "1",
    "taskDataId": "plan40-subtraction-recipe-task-data",
    "taskDataRevision": "1",
    "stimulusId": "plan76-inspect-three-fourths-one-fifth-20-stimulus",
    "stimulusRevision": "1",
    "itemRevision": "plan76-record-v1"
  },
  {
    "role": "T",
    "typeId": "unlike-denominator-subtraction",
    "setId": "unlike-subtraction-vetted-set",
    "setRevision": "2",
    "itemId": "plan40-construct-half-fifth-10",
    "fixtureId": "curated-plan40-construct-one-half-one-fifth",
    "authoringRevision": "plan40-record-v1",
    "definitionId": "phase-3-reusable-subtraction-recipes",
    "definitionRevision": "1",
    "recipeId": "unlike-subtraction.construct-equivalent",
    "patternRevision": "1",
    "taskDataId": "plan40-subtraction-recipe-task-data",
    "taskDataRevision": "1",
    "stimulusId": null,
    "stimulusRevision": null,
    "itemRevision": "plan40-record-v1"
  },
  {
    "role": "T",
    "typeId": "unlike-denominator-subtraction",
    "setId": "unlike-subtraction-vetted-set",
    "setRevision": "2",
    "itemId": "plan40-construct-five-sixths-three-eighths-24",
    "fixtureId": "curated-shared-factor-subtraction",
    "authoringRevision": "plan03-fixtures-v1",
    "definitionId": "phase-3-reusable-subtraction-recipes",
    "definitionRevision": "1",
    "recipeId": "unlike-subtraction.construct-equivalent",
    "patternRevision": "1",
    "taskDataId": "plan40-subtraction-recipe-task-data",
    "taskDataRevision": "1",
    "stimulusId": null,
    "stimulusRevision": null,
    "itemRevision": "plan03-fixtures-v1"
  },
  {
    "role": "T",
    "typeId": "unlike-denominator-subtraction",
    "setId": "unlike-subtraction-vetted-set",
    "setRevision": "2",
    "itemId": "plan76-construct-five-sixths-one-tenth-30",
    "fixtureId": "curated-plan76-construct-five-sixths-one-tenth-30",
    "authoringRevision": "plan76-record-v1",
    "definitionId": "phase-3-reusable-subtraction-recipes",
    "definitionRevision": "1",
    "recipeId": "unlike-subtraction.construct-equivalent",
    "patternRevision": "1",
    "taskDataId": "plan40-subtraction-recipe-task-data",
    "taskDataRevision": "1",
    "stimulusId": null,
    "stimulusRevision": null,
    "itemRevision": "plan76-record-v1"
  }
]);
const same=(a,b)=>JSON.stringify(a,Object.keys(a??{}).sort())===JSON.stringify(b,Object.keys(b??{}).sort());
const fail=reason=>{throw new TypeError(`invalid Plan 92 scratch candidate: ${reason}`)};
function prepare(entry,supportId,conditionId){
  const identity=PLAN92_SCRATCH_IDENTITIES.find(x=>x.itemId===entry?.itemId);
  if(!identity||!same(entry,identity))fail('identity is held or modified');
  if(identity.itemRevision!==identity.authoringRevision)fail('item revision');
  const support=REGISTERED_SUPPORT_LEVELS.find(x=>x.id===supportId); if(!support)fail('unsupported support');
  const condition=REGISTERED_CONDITIONS.find(x=>x.id===conditionId); if(!condition)fail('unsupported condition');
  const type=getPracticeType(identity.typeId), item=type?.items.find(x=>x.id===identity.itemId);
  if(!type||type.setId!==identity.setId||type.setRevision!==identity.setRevision||!item)fail('practice registration');
  const definition=getEpisodeDefinition(item.episodeDefinitionId,item.episodeDefinitionRevision);
  if(!definition||definition.id!==type.episodeDefinition.id||definition.revision!==type.episodeDefinition.revision)fail('definition');
  let instance, taskContext, activeCondition=condition.activeCondition;
  if(identity.typeId==='symbolic-fraction-comparison'){
    const context=validatePlan49Context(resolvePlan49Context(identity.itemId));
    if(context.itemId!==identity.itemId||context.practiceSetId!==identity.setId||context.practiceSetRevision!==identity.setRevision||context.definitionId!==identity.definitionId||context.definitionRevision!==identity.definitionRevision||context.authoringRevision!==identity.authoringRevision||context.recipeId!==identity.recipeId||context.recipeRevision!==identity.recipeRevision||context.taskDataId!==identity.taskDataId||context.taskDataRevision!==identity.taskDataRevision||context.cueId!==identity.cueId||identity.underlyingDefinitionRevision!=='1')fail('comparison task data association');
    taskContext=context; activeCondition=PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION;
  }else{
    for(const [k,v] of Object.entries({fixtureId:item.fixtureId,authoringRevision:item.authoringRevision,definitionId:item.episodeDefinitionId,definitionRevision:item.episodeDefinitionRevision,patternId:item.patternId,patternRevision:item.patternRevision,taskDataId:item.taskDataId,taskDataRevision:item.taskDataRevision}))if(v==null)fail(`missing ${k}`);
    const fixture=resolveCuratedFixture(item.fixtureId,item.authoringRevision); if(!fixture)fail('fixture');
    instance=buildCuratedProblem({fixture,selector:fixture.selector,overlays:fixture.overlays,profileId:fixture.profileId,candidate:{left:fixture.left,right:fixture.right,reviewedTransitions:fixture.reviewedTransitions??[]}});
    if(!validateProblemInstance(instance).valid)fail('fixture validation');
    taskContext=resolvePlan40SubtractionRecipeContext(instance,item.id,{practiceSetId:type.setId,practiceSetRevision:type.setRevision});
    validatePlan40SubtractionRecipeContext(instance,taskContext);
    for(const [contextKey,identityKey,itemKey] of [['fixtureId','fixtureId','fixtureId'],['authoringRevision','authoringRevision','authoringRevision'],['definitionId','definitionId','episodeDefinitionId'],['definitionRevision','definitionRevision','episodeDefinitionRevision'],['patternId','recipeId','patternId'],['patternRevision','patternRevision','patternRevision'],['taskDataId','taskDataId','taskDataId'],['taskDataRevision','taskDataRevision','taskDataRevision']])if(taskContext[contextKey]!==identity[identityKey]||item[itemKey]!==identity[identityKey])fail('task-data identity mismatch');
    if(taskContext.stimulusId!==identity.stimulusId||taskContext.stimulusRevision!==identity.stimulusRevision)fail('stimulus identity mismatch');
  }
  const state=createEpisode({...(instance?{instance}:{}),episodeDefinition:definition,activeCondition,support:support.configuration,taskContext});
  return deepFreeze({type,itemIndex:type.items.indexOf(item),state,identity});
}
export function preparePlan92ScratchCandidate(entry,supportId,conditionId){return prepare(entry,supportId,conditionId)}
export function preparePlan92ScratchBatch(supportId,conditionId){return deepFreeze(PLAN92_SCRATCH_IDENTITIES.map(x=>prepare(x,supportId,conditionId)));}
