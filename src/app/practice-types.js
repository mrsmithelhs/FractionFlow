import { PLAN74_RECORDS } from '../content/plan74-mixed-addition-task.js';
import { PLAN74_ADDITION_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import { PLAN72_RECORDS } from '../content/plan72-mixed-addition-task.js';
import { PLAN72_ADDITION_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import { PLAN59_RECORDS } from '../content/data/plan59-directed-endpoint-records.js';
import { PLAN59_ENDPOINT_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import { PLAN58_RECORDS } from '../content/data/plan58-whole-plus-fraction-records.js';
import { PLAN58_CONSTRUCTION_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import { PLAN53_RECORDS } from '../content/data/plan53-two-whole-location-records.js';
import { PLAN53_LOCATION_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import { PLAN51_DISTANCE_RECORDS } from '../content/data/plan51-distance-records.js';
import { PLAN51_DISTANCE_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import { PLAN50_RECORDS } from '../content/data/plan50-number-line-collection-records.js';
import { PLAN50_COLLECTION_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import {
  PHASE2_REFLECTION_EPISODE_DEFINITION,
  PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
  PLAN34_FULL_ADDITION_EPISODE_DEFINITION,
  PLAN18_NESTED_ADDITION_EPISODE_DEFINITION,
  PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION,
  PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION,
  PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
  PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION,
  PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_EPISODE_DEFINITION,
} from '../interaction/episode-definition.js';
import { PLAN35_ADDITION_RECIPE_PRACTICE_SET, PLAN35_ADDITION_RECIPE_RECORDS } from '../content/data/plan35-addition-recipe-records.js';
import {
  PLAN36_SUBTRACTION_PRACTICE_SET_ID,
  PLAN36_SUBTRACTION_PRACTICE_SET_REVISION,
  PLAN36_SUBTRACTION_RECORDS,
} from '../content/data/plan36-like-denominator-subtraction-records.js';
import {
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET,
  PLAN40_SUBTRACTION_RECIPE_RECORDS,
} from '../content/data/plan40-reusable-subtraction-recipes-records.js';
import { deepFreeze } from '../content/schema.js';
import { PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET, PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../content/data/plan37-bar-to-line-bridge-records.js';
import { PLAN45_COMPARISON_PRACTICE_SET } from '../content/data/plan45-symbolic-fraction-comparison-records.js';
import { PLAN49_COMPARISON_EPISODE_DEFINITION as PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION } from '../interaction/episode-definition.js';

/**
 * Learner-reachable practice types. A type is registered only when the app can
 * build and run its complete episode; future types belong here with content.
 */
export const LEGACY_PRACTICE_TYPES_V4 = Object.freeze([
  Object.freeze({
    id: 'sum-under-one',
    label: 'Add fractions with different denominators',
    fixtureId: 'curated-relatively-prime-addition-non-least',
    setId: 'unlike-addition-vetted-set',
    setRevision: '4',
    items: Object.freeze([
      Object.freeze({
        id: 'two-thirds-plus-one-fourth',
        fixtureId: 'curated-relatively-prime-addition-non-least',
        authoringRevision: 'plan03-fixtures-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['12', '24']),
      }),
      Object.freeze({
        id: 'one-half-plus-one-third',
        fixtureId: 'curated-relatively-prime-addition-one-half-one-third',
        authoringRevision: 'plan26-fixtures-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['6', '12']),
      }),
      Object.freeze({
        id: 'one-half-plus-one-fifth',
        fixtureId: 'curated-relatively-prime-addition-one-half-one-fifth',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['10', '20']),
      }),
      Object.freeze({
        id: 'one-half-plus-two-fifths',
        fixtureId: 'curated-relatively-prime-addition-one-half-two-fifths',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['10', '20']),
      }),
      Object.freeze({
        id: 'one-third-plus-one-fourth',
        fixtureId: 'curated-relatively-prime-addition-one-third-one-fourth',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['12', '24']),
      }),
      Object.freeze({
        id: 'one-third-plus-one-fifth',
        fixtureId: 'curated-relatively-prime-addition-one-third-one-fifth',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['15', '30']),
      }),
      Object.freeze({
        id: 'one-third-plus-two-fifths',
        fixtureId: 'curated-relatively-prime-addition-one-third-two-fifths',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['15', '30']),
      }),
      Object.freeze({
        id: 'two-thirds-plus-one-fifth',
        fixtureId: 'curated-relatively-prime-addition-two-thirds-one-fifth',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['15', '30']),
      }),
      Object.freeze({
        id: 'three-fifths-plus-one-third',
        fixtureId: 'curated-relatively-prime-addition-three-fifths-one-third',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['15', '30']),
      }),
      Object.freeze({
        id: 'one-sixth-plus-one-fourth',
        fixtureId: 'curated-shared-factor-addition-one-sixth-one-fourth',
        authoringRevision: 'plan19-record-v1',
        episodeDefinitionId: 'phase-2-shared-factor-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['12', '24']),
      }),
      Object.freeze({
        id: 'two-thirds-plus-three-fourths',
        fixtureId: 'curated-relatively-prime-addition-crossing-one-whole-two-thirds-three-fourths',
        authoringRevision: 'plan17-record-v1',
        episodeDefinitionId: 'phase-3-crossing-one-whole-addition-reflection',
        episodeDefinitionRevision: '1',
        targetDenominators: Object.freeze(['12', '24']),
      }),
    ]),
    episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
  }),
  Object.freeze({
    id: 'like-denominator-addition',
    label: 'Add fractions with the same denominator',
    setId: 'like-denominator-addition-vetted-set',
    setRevision: '1',
    items: Object.freeze([
      Object.freeze({
        id: 'two-sevenths-plus-three-sevenths',
        fixtureId: 'curated-like-denominator-addition-two-sevenths-three-sevenths',
        authoringRevision: 'plan20-record-v1',
        taskDataRevision: 'plan20-task-data-v1',
        recipe: Object.freeze({ id: 'plan20-reviewed-like-denominator-addition', revision: '1' }),
        episodeDefinitionId: PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id,
        episodeDefinitionRevision: PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.revision,
      }),
    ]),
    episodeDefinition: PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
  }),
]);

const plan34PatternByItem = Object.freeze({
  'two-thirds-plus-one-fourth': 'full-addition.construct-equivalent',
  'one-half-plus-one-third': 'full-addition.inspect-keep-repair',
  'one-third-plus-one-fourth': 'full-addition.inspect-keep-repair',
});

export const PLAN34_PRACTICE_TYPES_V5 = deepFreeze(LEGACY_PRACTICE_TYPES_V4.map((practiceType) => {
  if (practiceType.id !== 'sum-under-one') return practiceType;
  return {
    ...practiceType,
    setRevision: '5',
    items: practiceType.items.map((item) => {
      const patternId = plan34PatternByItem[item.id];
      if (!patternId) return item;
      return {
        ...item,
        episodeDefinitionId: PLAN34_FULL_ADDITION_EPISODE_DEFINITION.id,
        episodeDefinitionRevision: PLAN34_FULL_ADDITION_EPISODE_DEFINITION.revision,
        patternId,
        patternRevision: '1',
        targetDenominator: '12',
        taskDataId: 'plan34-full-addition-task-data',
        taskDataRevision: '1',
      };
    }),
    episodeDefinition: PLAN34_FULL_ADDITION_EPISODE_DEFINITION,
  };
}));

const PLAN18_NESTED_ITEMS_V6 = deepFreeze([
  { id: 'nested-one-half-plus-three-eighths', fixtureId: 'curated-nested-addition-one-half-three-eighths', authoringRevision: 'plan18-record-v1', episodeDefinitionId: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION.id, episodeDefinitionRevision: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION.revision, taskDataId: 'plan18-nested-renaming-task-data', taskDataRevision: '1', targetDenominator: '8' },
  { id: 'nested-three-eighths-plus-one-half', fixtureId: 'curated-nested-addition-three-eighths-one-half', authoringRevision: 'plan18-record-v1', episodeDefinitionId: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION.id, episodeDefinitionRevision: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION.revision, taskDataId: 'plan18-nested-renaming-task-data', taskDataRevision: '1', targetDenominator: '8' },
]);

export const PLAN18_PRACTICE_TYPES_V6 = deepFreeze(PLAN34_PRACTICE_TYPES_V5.map((practiceType) => practiceType.id !== 'sum-under-one'
  ? practiceType
  : { ...practiceType, setRevision: '6', items: [...practiceType.items, ...PLAN18_NESTED_ITEMS_V6] }));

const plan35RecordByItemId = new Map(PLAN35_ADDITION_RECIPE_RECORDS.map((record) => [record.itemId, record]));
const historicalItemById = new Map(PLAN18_PRACTICE_TYPES_V6.flatMap((practiceType) => practiceType.items.map((item) => [item.id, item])));
const plan35LiveItems = PLAN35_ADDITION_RECIPE_PRACTICE_SET.itemIds.map((itemId) => {
  const record = plan35RecordByItemId.get(itemId);
  if (!record) {
    const historical = historicalItemById.get(itemId);
    if (!historical) throw new TypeError(`Plan 35 live practice item has no exact task record: ${itemId}`);
    return historical;
  }
  return {
    id: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    episodeDefinitionId: record.definitionId,
    episodeDefinitionRevision: record.definitionRevision,
    patternId: record.recipeId,
    patternRevision: record.patternRevision,
    targetDenominator: record.targetDenominator,
    taskDataId: record.taskDataId,
    taskDataRevision: record.taskDataRevision,
  };
});

export const PLAN35_PRACTICE_TYPES_V7 = deepFreeze(PLAN18_PRACTICE_TYPES_V6.map((practiceType) => practiceType.id !== 'sum-under-one'
  ? practiceType
  : {
    ...practiceType,
    setRevision: PLAN35_ADDITION_RECIPE_PRACTICE_SET.revision,
    items: plan35LiveItems,
    episodeDefinition: PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION,
  }));

export const PLAN36_SUBTRACTION_PRACTICE_TYPE = deepFreeze({
  id: 'like-denominator-subtraction',
  label: 'Subtract fractions with the same denominator',
  setId: PLAN36_SUBTRACTION_PRACTICE_SET_ID,
  setRevision: PLAN36_SUBTRACTION_PRACTICE_SET_REVISION,
  items: PLAN36_SUBTRACTION_RECORDS.map((record) => ({
    id: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    episodeDefinitionId: PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION.id,
    episodeDefinitionRevision: PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION.revision,
    recipe: {
      id: record.recipe.id,
      revision: record.recipe.revision,
    },
    taskData: {
      id: record.taskData.id,
      revision: record.taskData.revision,
    },
    taskDataRevision: record.taskData.revision,
    leftNumerator: record.leftNumerator,
    rightNumerator: record.rightNumerator,
    denominator: record.denominator,
  })),
  episodeDefinition: PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION,
});

export const PLAN38_PRACTICE_TYPES_V8 = deepFreeze([
  ...PLAN35_PRACTICE_TYPES_V7,
  PLAN36_SUBTRACTION_PRACTICE_TYPE,
]);

const plan40RecordByItemId = new Map(PLAN40_SUBTRACTION_RECIPE_RECORDS.map((record) => [record.itemId, record]));
const plan40LiveItems = PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.itemIds.map((itemId) => {
  const record = plan40RecordByItemId.get(itemId);
  if (!record) {
    throw new TypeError(`Plan 40 live practice item has no exact task record: ${itemId}`);
  }
  return {
    id: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    episodeDefinitionId: record.definitionId,
    episodeDefinitionRevision: record.definitionRevision,
    patternId: record.recipeId,
    patternRevision: record.patternRevision,
    targetDenominator: record.targetDenominator,
    taskDataId: record.taskDataId,
    taskDataRevision: record.taskDataRevision,
  };
});

export const PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE = deepFreeze({
  id: 'unlike-denominator-subtraction',
  label: 'Subtract fractions with different denominators',
  setId: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.id,
  setRevision: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.revision,
  items: plan40LiveItems,
  episodeDefinition: PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
});

export const PLAN40_PRACTICE_TYPES_V9 = deepFreeze([
  ...PLAN38_PRACTICE_TYPES_V8,
  PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE,
]);

function plan39PracticeType(episodeDefinition) {
  return deepFreeze({
    id: 'bar-to-line-same-amount',
    label: 'Place fractions on a number line',
    setId: PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET.id,
    setRevision: PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET.revision,
    items: PLAN37_BAR_TO_LINE_BRIDGE_RECORDS.map((record) => ({
      id: record.itemId,
      fixtureId: record.fixtureId,
      authoringRevision: record.authoringRevision,
      episodeDefinitionId: episodeDefinition.id,
      episodeDefinitionRevision: episodeDefinition.revision,
    })),
    episodeDefinition,
  });
}

export const PLAN39_BAR_TO_LINE_V1_HISTORICAL_PRACTICE_TYPE = plan39PracticeType(PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION);
export const PLAN39_BAR_TO_LINE_PRACTICE_TYPE = plan39PracticeType(PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_EPISODE_DEFINITION);

export const PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE = deepFreeze({
  id: 'symbolic-fraction-comparison',
  label: 'Compare fractions',
  setId: PLAN45_COMPARISON_PRACTICE_SET.id,
  setRevision: PLAN45_COMPARISON_PRACTICE_SET.revision,
  items: PLAN45_COMPARISON_PRACTICE_SET.itemIds.map((itemId) => ({
    id: itemId,
    episodeDefinitionId: PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION.id,
    episodeDefinitionRevision: PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION.revision,
  })),
  episodeDefinition: PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION,
});

export const PLAN50_COLLECTION_PRACTICE_TYPE = deepFreeze({id:'number-line-collection',label:'Place fractions together on a number line',setId:'number-line-collection',setRevision:'1',items:PLAN50_RECORDS.map(r=>({id:r.itemId,episodeDefinitionId:PLAN50_COLLECTION_EPISODE_DEFINITION.id,episodeDefinitionRevision:'1'})),episodeDefinition:PLAN50_COLLECTION_EPISODE_DEFINITION});

export const PLAN51_DISTANCE_PRACTICE_TYPE = deepFreeze({
  id: 'fraction-distance', label: 'Find the distance between fractions', setId: 'fraction-distance', setRevision: '1',
  items: PLAN51_DISTANCE_RECORDS.map(record => ({ id: record.itemId, episodeDefinitionId: PLAN51_DISTANCE_EPISODE_DEFINITION.id, episodeDefinitionRevision: '1' })),
  episodeDefinition: PLAN51_DISTANCE_EPISODE_DEFINITION,
});

export const PLAN53_LOCATION_PRACTICE_TYPE = deepFreeze({
  id: 'two-whole-location', label: 'Place fractions on a two-whole number line',
  setId: 'two-whole-location', setRevision: '1',
  items: PLAN53_RECORDS.map(record => ({ id: record.itemId, episodeDefinitionId: PLAN53_LOCATION_EPISODE_DEFINITION.id, episodeDefinitionRevision: '1' })),
  episodeDefinition: PLAN53_LOCATION_EPISODE_DEFINITION,
});

export const PLAN58_CONSTRUCTION_PRACTICE_TYPE = deepFreeze({
  id: 'whole-plus-fraction-construction', label: 'Make wholes and remaining pieces',
  setId: 'whole-plus-fraction-construction', setRevision: '1',
  items: PLAN58_RECORDS.map(record => ({ id: record.itemId, episodeDefinitionId: PLAN58_CONSTRUCTION_EPISODE_DEFINITION.id, episodeDefinitionRevision: '1' })),
  episodeDefinition: PLAN58_CONSTRUCTION_EPISODE_DEFINITION,
});

export const PLAN59_ENDPOINT_PRACTICE_TYPE = deepFreeze({
  id: 'directed-number-line-endpoint', label: 'Find the end on a number line',
  setId: 'directed-number-line-endpoint', setRevision: '1',
  items: PLAN59_RECORDS.map(record => ({ id: record.itemId, episodeDefinitionId: PLAN59_ENDPOINT_EPISODE_DEFINITION.id, episodeDefinitionRevision: '1' })),
  episodeDefinition: PLAN59_ENDPOINT_EPISODE_DEFINITION,
});

export const PLAN72_ADDITION_PRACTICE_TYPE = deepFreeze({ id:'mixed-number-addition-without-regrouping', label:'Add mixed numbers', setId:'mixed-number-addition-without-regrouping', setRevision:'1', items:PLAN72_RECORDS.map(record => ({id:record.itemId, episodeDefinitionId:PLAN72_ADDITION_EPISODE_DEFINITION.id, episodeDefinitionRevision:'1'})), episodeDefinition:PLAN72_ADDITION_EPISODE_DEFINITION });
export const PLAN74_ADDITION_PRACTICE_TYPE = deepFreeze({ id:'mixed-number-addition-with-regrouping', label:'Add mixed numbers: make a whole', setId:'mixed-number-addition-with-regrouping', setRevision:'1', items:PLAN74_RECORDS.map(record => ({id:record.itemId, episodeDefinitionId:PLAN74_ADDITION_EPISODE_DEFINITION.id, episodeDefinitionRevision:'1'})), episodeDefinition:PLAN74_ADDITION_EPISODE_DEFINITION });

export const PRACTICE_TYPES = deepFreeze([
  ...PLAN40_PRACTICE_TYPES_V9,
  PLAN39_BAR_TO_LINE_PRACTICE_TYPE,
  PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE,
  PLAN50_COLLECTION_PRACTICE_TYPE,
  PLAN51_DISTANCE_PRACTICE_TYPE,
  PLAN53_LOCATION_PRACTICE_TYPE,
  PLAN58_CONSTRUCTION_PRACTICE_TYPE,
  PLAN59_ENDPOINT_PRACTICE_TYPE,
  PLAN72_ADDITION_PRACTICE_TYPE,
  PLAN74_ADDITION_PRACTICE_TYPE,
]);

export function getPracticeType(id) {
  return PRACTICE_TYPES.find((practiceType) => practiceType.id === id) ?? null;
}
