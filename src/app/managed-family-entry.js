import { deepFreeze } from '../content/schema.js';
import { buildCuratedProblem } from '../content/generator.js';
import { resolveCuratedFixture, resolvePlan37BarToLineBridgeInstance } from '../content/authored-content-catalog.js';
import { validateProblemInstance } from '../content/validation.js';
import { getPracticeType } from './practice-types.js';
import { getEpisodeDefinition } from '../interaction/episode-definition.js';
import { createEpisode } from '../interaction/episode.js';
import { getDefaultCondition, getRegisteredCondition } from './conditions.js';
import { getRegisteredSupportLevel } from './support-levels.js';
import { resolvePlan37BarToLineBridgeContext, validatePlan37BarToLineBridgeContext, validatePlan37BarToLineBridgeInstance } from '../content/plan37-bar-to-line-bridge-task.js';
import { resolvePlan35AdditionRecipeContext, validatePlan35AdditionRecipeContext } from '../content/plan35-addition-recipe-task.js';
import { resolvePlan40SubtractionRecipeContext, validatePlan40SubtractionRecipeContext } from '../content/plan40-reusable-subtraction-recipes.js';

// Literal identities are the complete managed admission boundary for this batch.
export const PLAN90_FAMILY_ENTRIES = deepFreeze({
  'bridge-06-three-eighths-8': {
    typeId: 'bar-to-line-same-amount', setId: 'bar-to-line-same-amount-vetted-set', setRevision: '1',
    itemId: 'bridge-06-three-eighths-8', itemRevision: 'plan37-record-v1', fixtureId: 'curated-plan37-bridge-06-three-eighths-8',
    definitionId: 'phase-4-bar-to-line-same-amount', definitionRevision: '2', recipeId: 'plan37.bar-to-line-same-amount', recipeRevision: '1',
    taskDataId: 'plan37-bar-to-line-same-amount', taskDataRevision: '1',
  },
  'bridge-02-fourth-4': {
    typeId: 'bar-to-line-same-amount', setId: 'bar-to-line-same-amount-vetted-set', setRevision: '1',
    itemId: 'bridge-02-fourth-4', itemRevision: 'plan37-record-v1', fixtureId: 'curated-plan37-bridge-02-fourth-4',
    definitionId: 'phase-4-bar-to-line-same-amount', definitionRevision: '2', recipeId: 'plan37.bar-to-line-same-amount', recipeRevision: '1',
    taskDataId: 'plan37-bar-to-line-same-amount', taskDataRevision: '1',
  },
  'plan35-identify-half-three-tenths-10': {
    typeId: 'sum-under-one', setId: 'unlike-addition-vetted-set', setRevision: '7',
    itemId: 'plan35-identify-half-three-tenths-10', itemRevision: 'plan35-record-v1', fixtureId: 'curated-plan35-identify-one-half-three-tenths',
    definitionId: 'phase-3-reusable-addition-recipes', definitionRevision: '1', recipeId: 'full-addition.identify-side-construct', recipeRevision: '1',
    taskDataId: 'plan35-addition-recipe-task-data', taskDataRevision: '1',
  },
  'one-half-plus-one-third': {
    typeId: 'sum-under-one', setId: 'unlike-addition-vetted-set', setRevision: '7',
    itemId: 'one-half-plus-one-third', itemRevision: 'plan26-fixtures-v1', fixtureId: 'curated-relatively-prime-addition-one-half-one-third',
    definitionId: 'phase-3-reusable-addition-recipes', definitionRevision: '1', recipeId: 'full-addition.inspect-keep-repair', recipeRevision: '1',
    taskDataId: 'plan35-addition-recipe-task-data', taskDataRevision: '1', stimulusId: 'plan34-one-half-plus-one-third-inspect-candidate', stimulusRevision: '1',
  },
  'plan35-construct-half-fifth-10': {
    typeId: 'sum-under-one', setId: 'unlike-addition-vetted-set', setRevision: '7',
    itemId: 'plan35-construct-half-fifth-10', itemRevision: 'plan32-record-v1', fixtureId: 'curated-relatively-prime-addition-one-half-one-fifth',
    definitionId: 'phase-3-reusable-addition-recipes', definitionRevision: '1', recipeId: 'full-addition.construct-equivalent', recipeRevision: '1',
    taskDataId: 'plan35-addition-recipe-task-data', taskDataRevision: '1',
  },
  'plan40-identify-one-half-one-eighth-8': {
    typeId: 'unlike-denominator-subtraction', setId: 'unlike-subtraction-vetted-set', setRevision: '2',
    itemId: 'plan40-identify-one-half-one-eighth-8', itemRevision: 'plan40-record-v1', fixtureId: 'curated-plan40-identify-one-half-one-eighth',
    definitionId: 'phase-3-reusable-subtraction-recipes', definitionRevision: '1', recipeId: 'unlike-subtraction.identify-side-construct', recipeRevision: '1',
    taskDataId: 'plan40-subtraction-recipe-task-data', taskDataRevision: '1',
  },
  'plan40-inspect-two-thirds-one-fourth-12': {
    typeId: 'unlike-denominator-subtraction', setId: 'unlike-subtraction-vetted-set', setRevision: '2',
    itemId: 'plan40-inspect-two-thirds-one-fourth-12', itemRevision: 'plan40-record-v1', fixtureId: 'curated-plan40-inspect-two-thirds-one-fourth',
    definitionId: 'phase-3-reusable-subtraction-recipes', definitionRevision: '1', recipeId: 'unlike-subtraction.inspect-keep-repair', recipeRevision: '1',
    taskDataId: 'plan40-subtraction-recipe-task-data', taskDataRevision: '1', stimulusId: 'plan40-stim-inspect-two-thirds-one-fourth-12', stimulusRevision: '1',
  },
  'plan40-construct-half-fifth-10': {
    typeId: 'unlike-denominator-subtraction', setId: 'unlike-subtraction-vetted-set', setRevision: '2',
    itemId: 'plan40-construct-half-fifth-10', itemRevision: 'plan40-record-v1', fixtureId: 'curated-plan40-construct-one-half-one-fifth',
    definitionId: 'phase-3-reusable-subtraction-recipes', definitionRevision: '1', recipeId: 'unlike-subtraction.construct-equivalent', recipeRevision: '1',
    taskDataId: 'plan40-subtraction-recipe-task-data', taskDataRevision: '1',
  },
});

const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const fail = reason => { throw new TypeError(`invalid managed family entry: ${reason}`); };

function curatedInstance(item) {
  if (item.id.startsWith('bridge-')) {
    const instance = resolvePlan37BarToLineBridgeInstance(item.id, item.authoringRevision);
    if (!instance || instance.provenance.fixtureId !== item.fixtureId) fail('bridge registry association');
    return validatePlan37BarToLineBridgeInstance(instance);
  }
  const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
  if (!fixture) fail('curated fixture association');
  const instance = buildCuratedProblem({ fixture, selector: fixture.selector, overlays: fixture.overlays, profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: fixture.reviewedTransitions ?? [] } });
  const validation = validateProblemInstance(instance);
  if (!validation.valid) fail('curated instance validation');
  return instance;
}

export function prepareManagedFamilyEntry(entry, supportId, activeCondition = getDefaultCondition().activeCondition) {
  if (!entry || typeof entry !== 'object') fail('entry shape');
  const expected = PLAN90_FAMILY_ENTRIES[entry.itemId];
  if (!expected || !same(entry, expected)) fail('entry identity or revision');
  const type = getPracticeType(expected.typeId);
  const item = type?.items.find(candidate => candidate.id === expected.itemId);
  if (!type || type.setId !== expected.setId || type.setRevision !== expected.setRevision || !item
    || item.fixtureId !== expected.fixtureId || item.authoringRevision !== expected.itemRevision
    || item.episodeDefinitionId !== expected.definitionId || item.episodeDefinitionRevision !== expected.definitionRevision) fail('public registry association');
  if (expected.typeId !== 'bar-to-line-same-amount' && (item.patternId !== expected.recipeId || item.patternRevision !== expected.recipeRevision
    || item.taskDataId !== expected.taskDataId || item.taskDataRevision !== expected.taskDataRevision)) fail('public recipe association');
  const definition = getEpisodeDefinition(expected.definitionId, expected.definitionRevision);
  if (!definition || !same(definition, type.episodeDefinition)) fail('episode definition');
  if (!activeCondition || !same(activeCondition, getRegisteredCondition(activeCondition.id).activeCondition)) fail('registered active condition');
  const instance = curatedInstance(item);
  const support = getRegisteredSupportLevel(supportId).configuration;
  const isBridge = expected.typeId === 'bar-to-line-same-amount';
  const taskContext = isBridge
    ? resolvePlan37BarToLineBridgeContext(instance, item.id, { practiceSetId: type.setId, practiceSetRevision: type.setRevision,
      definitionRevision: definition.revision, supportMode: support.dimensions.fractionBarModel === 'high support' ? 'partitioned' : 'sparse-benchmarks' })
    : expected.typeId === 'sum-under-one'
      ? resolvePlan35AdditionRecipeContext(instance, item.id, { practiceSetId: type.setId, practiceSetRevision: type.setRevision })
      : resolvePlan40SubtractionRecipeContext(instance, item.id, { practiceSetId: type.setId, practiceSetRevision: type.setRevision });
  if (isBridge) validatePlan37BarToLineBridgeContext(instance, taskContext);
  else if (expected.typeId === 'sum-under-one') validatePlan35AdditionRecipeContext(instance, taskContext);
  else validatePlan40SubtractionRecipeContext(instance, taskContext);
  if (taskContext.fixtureId !== expected.fixtureId || taskContext.authoringRevision !== expected.itemRevision
    || taskContext.definitionId !== expected.definitionId || taskContext.definitionRevision !== expected.definitionRevision
    || (taskContext.recipeId ?? taskContext.patternId) !== expected.recipeId || (taskContext.recipeRevision ?? taskContext.patternRevision) !== expected.recipeRevision
    || taskContext.taskDataId !== expected.taskDataId || taskContext.taskDataRevision !== expected.taskDataRevision
    || (taskContext.stimulusId ?? undefined) !== expected.stimulusId || (taskContext.stimulusRevision ?? undefined) !== expected.stimulusRevision) fail('validated context identity');
  const state = createEpisode({ instance, episodeDefinition: definition, activeCondition, support, taskContext });
  return deepFreeze({ type, itemIndex: type.items.indexOf(item), state });
}
