import { deepFreeze } from '../schema.js';
import { PLAN35_ADDITION_RECIPE_PRACTICE_SET } from './plan35-addition-recipe-records.js';

export const PLAN18_NESTED_ADDITION_TASK_DATA_ID = 'plan18-nested-renaming-task-data';
export const PLAN18_NESTED_ADDITION_TASK_DATA_REVISION = '1';
export const PLAN18_NESTED_ADDITION_RECORDS = deepFreeze([
  {
    itemId: 'nested-one-half-plus-three-eighths',
    fixtureId: 'curated-nested-addition-one-half-three-eighths',
    authoringRevision: 'plan18-record-v1',
    sourceForms: { left: { kind: 'fraction', numerator: '1', denominator: '2' }, right: { kind: 'fraction', numerator: '3', denominator: '8' } },
    targetDenominator: '8', requiredSide: 'left',
  },
  {
    itemId: 'nested-three-eighths-plus-one-half',
    fixtureId: 'curated-nested-addition-three-eighths-one-half',
    authoringRevision: 'plan18-record-v1',
    sourceForms: { left: { kind: 'fraction', numerator: '3', denominator: '8' }, right: { kind: 'fraction', numerator: '1', denominator: '2' } },
    targetDenominator: '8', requiredSide: 'right',
  },
].map((record) => ({ ...record, taskDataId: PLAN18_NESTED_ADDITION_TASK_DATA_ID, taskDataRevision: PLAN18_NESTED_ADDITION_TASK_DATA_REVISION })));

const LEGACY_ITEM_IDS = [
    'two-thirds-plus-one-fourth', 'one-half-plus-one-third', 'one-half-plus-one-fifth',
    'one-half-plus-two-fifths', 'one-third-plus-one-fourth', 'one-third-plus-one-fifth',
    'one-third-plus-two-fifths', 'two-thirds-plus-one-fifth', 'three-fifths-plus-one-third',
    'one-sixth-plus-one-fourth', 'two-thirds-plus-three-fourths',
];
export const UNLIKE_ADDITION_PRACTICE_SET_V4 = deepFreeze({ id: 'unlike-addition-vetted-set', revision: '4', itemIds: LEGACY_ITEM_IDS });
export const UNLIKE_ADDITION_PRACTICE_SET_V5 = deepFreeze({ id: 'unlike-addition-vetted-set', revision: '5', itemIds: LEGACY_ITEM_IDS });
export const UNLIKE_ADDITION_PRACTICE_SET_V6 = deepFreeze({
  id: UNLIKE_ADDITION_PRACTICE_SET_V5.id, revision: '6',
  itemIds: [...UNLIKE_ADDITION_PRACTICE_SET_V5.itemIds, ...PLAN18_NESTED_ADDITION_RECORDS.map((record) => record.itemId)],
});
export const UNLIKE_ADDITION_PRACTICE_SET_V7 = PLAN35_ADDITION_RECIPE_PRACTICE_SET;

export function practiceSetHasItem(setId, revision, itemId) {
  const set = revision === '4' ? UNLIKE_ADDITION_PRACTICE_SET_V4 : revision === '5' ? UNLIKE_ADDITION_PRACTICE_SET_V5 : revision === '6' ? UNLIKE_ADDITION_PRACTICE_SET_V6 : revision === '7' ? UNLIKE_ADDITION_PRACTICE_SET_V7 : null;
  return set?.id === setId && set.itemIds.includes(itemId);
}
