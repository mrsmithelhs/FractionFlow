import { deepFreeze } from '../schema.js';

/** Exact reviewed task identity for Plan 20's zero-renaming addition episode. */
export const PLAN20_LIKE_DENOMINATOR_ADDITION_RECORDS = deepFreeze([
  {
    itemId: 'two-sevenths-plus-three-sevenths',
    fixtureId: 'curated-like-denominator-addition-two-sevenths-three-sevenths',
    authoringRevision: 'plan20-record-v1',
    taskDataRevision: 'plan20-task-data-v1',
    recipe: { id: 'plan20-reviewed-like-denominator-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'like-denominator-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '2', denominator: '7' },
    right: { kind: 'fraction', numerator: '3', denominator: '7' },
  },
]);
