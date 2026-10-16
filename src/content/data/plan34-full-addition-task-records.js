import { deepFreeze } from '../schema.js';

export const PLAN34_TASK_DATA_ID = 'plan34-full-addition-task-data';
export const PLAN34_TASK_DATA_REVISION = '1';

const source = [
  {
    itemId: 'two-thirds-plus-one-fourth',
    fixtureId: 'curated-relatively-prime-addition-non-least',
    authoringRevision: 'plan03-fixtures-v1',
    livePatternId: 'full-addition.construct-equivalent',
    targetDenominator: '12',
    sourceForms: { left: { kind: 'fraction', numerator: '2', denominator: '3' }, right: { kind: 'fraction', numerator: '1', denominator: '4' } },
    inspectCandidates: { left: { kind: 'fraction', numerator: '8', denominator: '12' }, right: { kind: 'fraction', numerator: '3', denominator: '12' } },
  },
  {
    itemId: 'one-half-plus-one-third',
    fixtureId: 'curated-relatively-prime-addition-one-half-one-third',
    authoringRevision: 'plan26-fixtures-v1',
    livePatternId: 'full-addition.inspect-keep-repair',
    targetDenominator: '12',
    sourceForms: { left: { kind: 'fraction', numerator: '1', denominator: '2' }, right: { kind: 'fraction', numerator: '1', denominator: '3' } },
    inspectCandidates: { left: { kind: 'fraction', numerator: '5', denominator: '12' }, right: { kind: 'fraction', numerator: '4', denominator: '12' } },
  },
  {
    itemId: 'one-third-plus-one-fourth',
    fixtureId: 'curated-relatively-prime-addition-one-third-one-fourth',
    authoringRevision: 'plan32-record-v1',
    livePatternId: 'full-addition.inspect-keep-repair',
    targetDenominator: '12',
    sourceForms: { left: { kind: 'fraction', numerator: '1', denominator: '3' }, right: { kind: 'fraction', numerator: '1', denominator: '4' } },
    inspectCandidates: { left: { kind: 'fraction', numerator: '4', denominator: '12' }, right: { kind: 'fraction', numerator: '7', denominator: '12' } },
  },
];

export const PLAN34_FULL_ADDITION_TASK_RECORDS = deepFreeze(source.map((record) => {
  const { inspectCandidates, ...identity } = record;
  return {
    ...identity,
    taskDataId: PLAN34_TASK_DATA_ID,
    taskDataRevision: PLAN34_TASK_DATA_REVISION,
    candidates: inspectCandidates,
  };
}));
