import { deepFreeze } from '../schema.js';

/**
 * One reviewed crossing-one-whole task. Arithmetic truth and forms are
 * materialized from the exact math APIs; this record contains only authored
 * premise/reflection policy.
 */
export const CROSSING_ADDITION_RECORDS = deepFreeze([
  {
    itemId: 'two-thirds-plus-three-fourths',
    fixtureId: 'curated-relatively-prime-addition-crossing-one-whole-two-thirds-three-fourths',
    authoringRevision: 'plan17-record-v1',
    taskDataRevision: 'plan17-task-data-v1',
    recipe: { id: 'plan17-reviewed-crossing-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'relatively-prime-addition',
    overlays: ['crosses-one-whole'],
    left: { kind: 'fraction', numerator: '2', denominator: '3' },
    right: { kind: 'fraction', numerator: '3', denominator: '4' },
    paths: {
      '12': {
        premise: { rule: 'P-ADJACENT-UNIT', offset: '-1' },
        reflection: {
          order: ['R-CORRECT', 'R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT'],
          adjacentOffset: '1',
          correctPosition: 1,
        },
      },
      '24': {
        premise: { rule: 'P-EQUIVALENT' },
        reflection: {
          order: ['R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT', 'R-CORRECT'],
          adjacentOffset: '-1',
          correctPosition: 3,
        },
      },
    },
  },
]);
