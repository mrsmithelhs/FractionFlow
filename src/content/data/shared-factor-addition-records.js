import { deepFreeze } from '../schema.js';

/**
 * Plan 19's single reviewed structural example. The rules, choice order, and
 * answer position are authored inputs; exact math supplies their truth.
 */
export const SHARED_FACTOR_ADDITION_RECORDS = deepFreeze([
  {
    itemId: 'one-sixth-plus-one-fourth',
    fixtureId: 'curated-shared-factor-addition-one-sixth-one-fourth',
    authoringRevision: 'plan19-record-v1',
    taskDataRevision: 'plan19-task-data-v1',
    recipe: { id: 'plan19-reviewed-shared-factor-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'shared-factor-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '1', denominator: '6' },
    right: { kind: 'fraction', numerator: '1', denominator: '4' },
    paths: {
      '12': {
        premise: { rule: 'P-ADJACENT-UNIT', offset: '1' },
        reflection: {
          order: ['R-KEEP-NUMERATOR', 'R-CORRECT', 'R-ADJACENT-UNIT'],
          adjacentOffset: '1',
          correctPosition: 2,
        },
      },
      '24': {
        premise: { rule: 'P-EQUIVALENT' },
        reflection: {
          order: ['R-CORRECT', 'R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT'],
          adjacentOffset: '1',
          correctPosition: 1,
        },
      },
    },
  },
]);
