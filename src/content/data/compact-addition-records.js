import { deepFreeze } from '../schema.js';

/**
 * Owner-approved Plan 32 records. These are reviewed instructional inputs,
 * not derived truth: route premise rules, distractor rules, order, and answer
 * position are explicit for every supported denominator.
 */
export const COMPACT_ADDITION_RECORDS = deepFreeze([
  {
    itemId: 'one-half-plus-one-fifth',
    fixtureId: 'curated-relatively-prime-addition-one-half-one-fifth',
    authoringRevision: 'plan32-record-v1',
    taskDataRevision: 'plan32-task-data-v1',
    recipe: { id: 'plan32-reviewed-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'relatively-prime-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '1', denominator: '2' },
    right: { kind: 'fraction', numerator: '1', denominator: '5' },
    paths: {
      '10': {
        premise: { rule: 'P-ADJACENT-UNIT', offset: '-1' },
        reflection: { order: ['R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT', 'R-CORRECT'], adjacentOffset: '1', correctPosition: 3 },
      },
      '20': {
        premise: { rule: 'P-EQUIVALENT' },
        reflection: { order: ['R-ADJACENT-UNIT', 'R-CORRECT', 'R-KEEP-NUMERATOR'], adjacentOffset: '-1', correctPosition: 2 },
      },
    },
  },
  {
    itemId: 'one-half-plus-two-fifths',
    fixtureId: 'curated-relatively-prime-addition-one-half-two-fifths',
    authoringRevision: 'plan32-record-v1',
    taskDataRevision: 'plan32-task-data-v1',
    recipe: { id: 'plan32-reviewed-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'relatively-prime-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '1', denominator: '2' },
    right: { kind: 'fraction', numerator: '2', denominator: '5' },
    paths: {
      '10': {
        premise: { rule: 'P-EQUIVALENT' },
        reflection: { order: ['R-CORRECT', 'R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT'], adjacentOffset: '-1', correctPosition: 1 },
      },
      '20': {
        premise: { rule: 'P-ADJACENT-UNIT', offset: '-1' },
        reflection: { order: ['R-CORRECT', 'R-ADJACENT-UNIT', 'R-KEEP-NUMERATOR'], adjacentOffset: '1', correctPosition: 1 },
      },
    },
  },
  {
    itemId: 'one-third-plus-one-fourth',
    fixtureId: 'curated-relatively-prime-addition-one-third-one-fourth',
    authoringRevision: 'plan32-record-v1',
    taskDataRevision: 'plan32-task-data-v1',
    recipe: { id: 'plan32-reviewed-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'relatively-prime-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '1', denominator: '3' },
    right: { kind: 'fraction', numerator: '1', denominator: '4' },
    paths: {
      '12': {
        premise: { rule: 'P-EQUIVALENT' },
        reflection: { order: ['R-ADJACENT-UNIT', 'R-CORRECT', 'R-KEEP-NUMERATOR'], adjacentOffset: '-1', correctPosition: 2 },
      },
      '24': {
        premise: { rule: 'P-ADJACENT-UNIT', offset: '1' },
        reflection: { order: ['R-CORRECT', 'R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT'], adjacentOffset: '-1', correctPosition: 1 },
      },
    },
  },
  {
    itemId: 'one-third-plus-one-fifth',
    fixtureId: 'curated-relatively-prime-addition-one-third-one-fifth',
    authoringRevision: 'plan32-record-v1',
    taskDataRevision: 'plan32-task-data-v1',
    recipe: { id: 'plan32-reviewed-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'relatively-prime-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '1', denominator: '3' },
    right: { kind: 'fraction', numerator: '1', denominator: '5' },
    paths: {
      '15': {
        premise: { rule: 'P-ADJACENT-UNIT', offset: '1' },
        reflection: { order: ['R-KEEP-NUMERATOR', 'R-CORRECT', 'R-ADJACENT-UNIT'], adjacentOffset: '-1', correctPosition: 2 },
      },
      '30': {
        premise: { rule: 'P-EQUIVALENT' },
        reflection: { order: ['R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT', 'R-CORRECT'], adjacentOffset: '1', correctPosition: 3 },
      },
    },
  },
  {
    itemId: 'one-third-plus-two-fifths',
    fixtureId: 'curated-relatively-prime-addition-one-third-two-fifths',
    authoringRevision: 'plan32-record-v1',
    taskDataRevision: 'plan32-task-data-v1',
    recipe: { id: 'plan32-reviewed-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'relatively-prime-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '1', denominator: '3' },
    right: { kind: 'fraction', numerator: '2', denominator: '5' },
    paths: {
      '15': {
        premise: { rule: 'P-EQUIVALENT' },
        reflection: { order: ['R-CORRECT', 'R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT'], adjacentOffset: '1', correctPosition: 1 },
      },
      '30': {
        premise: { rule: 'P-ADJACENT-UNIT', offset: '1' },
        reflection: { order: ['R-KEEP-NUMERATOR', 'R-CORRECT', 'R-ADJACENT-UNIT'], adjacentOffset: '-1', correctPosition: 2 },
      },
    },
  },
  {
    itemId: 'two-thirds-plus-one-fifth',
    fixtureId: 'curated-relatively-prime-addition-two-thirds-one-fifth',
    authoringRevision: 'plan32-record-v1',
    taskDataRevision: 'plan32-task-data-v1',
    recipe: { id: 'plan32-reviewed-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'relatively-prime-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '2', denominator: '3' },
    right: { kind: 'fraction', numerator: '1', denominator: '5' },
    paths: {
      '15': {
        premise: { rule: 'P-ADJACENT-UNIT', offset: '1' },
        reflection: { order: ['R-ADJACENT-UNIT', 'R-CORRECT', 'R-KEEP-NUMERATOR'], adjacentOffset: '-1', correctPosition: 2 },
      },
      '30': {
        premise: { rule: 'P-EQUIVALENT' },
        reflection: { order: ['R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT', 'R-CORRECT'], adjacentOffset: '1', correctPosition: 3 },
      },
    },
  },
  {
    itemId: 'three-fifths-plus-one-third',
    fixtureId: 'curated-relatively-prime-addition-three-fifths-one-third',
    authoringRevision: 'plan32-record-v1',
    taskDataRevision: 'plan32-task-data-v1',
    recipe: { id: 'plan32-reviewed-addition', revision: '1' },
    profileId: 'curated-review',
    selector: 'relatively-prime-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '3', denominator: '5' },
    right: { kind: 'fraction', numerator: '1', denominator: '3' },
    paths: {
      '15': {
        premise: { rule: 'P-ADJACENT-UNIT', offset: '-1' },
        reflection: { order: ['R-CORRECT', 'R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT'], adjacentOffset: '1', correctPosition: 1 },
      },
      '30': {
        premise: { rule: 'P-EQUIVALENT' },
        reflection: { order: ['R-ADJACENT-UNIT', 'R-KEEP-NUMERATOR', 'R-CORRECT'], adjacentOffset: '-1', correctPosition: 3 },
      },
    },
  },
]);
