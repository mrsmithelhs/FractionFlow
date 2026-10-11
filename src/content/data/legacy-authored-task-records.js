import { deepFreeze } from '../schema.js';

/** Frozen Plan 03/26 records retained byte-for-byte in meaning. */
export const PREMISE_CHECKS_BY_FIXTURE = deepFreeze({
  'curated-relatively-prime-addition-non-least': {
    '12': {
      id: 'premise-rel-prime-12', fixtureId: 'curated-relatively-prime-addition-non-least', targetDenominator: '12',
      sourceForm: { kind: 'fraction', numerator: '2', denominator: '3' },
      presentedForm: { kind: 'fraction', numerator: '7', denominator: '12' },
      isEquivalent: false, expectedResponse: 'no', distractorType: 'off-by-one-numerator',
    },
    '24': {
      id: 'premise-rel-prime-24', fixtureId: 'curated-relatively-prime-addition-non-least', targetDenominator: '24',
      sourceForm: { kind: 'fraction', numerator: '2', denominator: '3' },
      presentedForm: { kind: 'fraction', numerator: '16', denominator: '24' },
      isEquivalent: true, expectedResponse: 'yes', distractorType: null,
    },
  },
  'curated-relatively-prime-addition-one-half-one-third': {
    '6': {
      id: 'premise-half-third-6', fixtureId: 'curated-relatively-prime-addition-one-half-one-third', targetDenominator: '6',
      sourceForm: { kind: 'fraction', numerator: '1', denominator: '2' },
      presentedForm: { kind: 'fraction', numerator: '2', denominator: '6' },
      isEquivalent: false, expectedResponse: 'no', distractorType: 'off-by-one-numerator',
    },
    '12': {
      id: 'premise-half-third-12', fixtureId: 'curated-relatively-prime-addition-one-half-one-third', targetDenominator: '12',
      sourceForm: { kind: 'fraction', numerator: '1', denominator: '2' },
      presentedForm: { kind: 'fraction', numerator: '6', denominator: '12' },
      isEquivalent: true, expectedResponse: 'yes', distractorType: null,
    },
  },
});

export const REFLECTION_CHOICES_BY_FIXTURE = deepFreeze({
  'curated-relatively-prime-addition-non-least': {
    '12': [
      { id: 'match-a', form: { kind: 'fraction', numerator: '8', denominator: '12' } },
      { id: 'match-b', form: { kind: 'fraction', numerator: '7', denominator: '12' } },
      { id: 'match-c', form: { kind: 'fraction', numerator: '9', denominator: '12' } },
    ],
    '24': [
      { id: 'match-b', form: { kind: 'fraction', numerator: '15', denominator: '24' } },
      { id: 'match-a', form: { kind: 'fraction', numerator: '16', denominator: '24' } },
      { id: 'match-c', form: { kind: 'fraction', numerator: '17', denominator: '24' } },
    ],
  },
  'curated-relatively-prime-addition-one-half-one-third': {
    '6': [
      { id: 'match-a', form: { kind: 'fraction', numerator: '2', denominator: '6' } },
      { id: 'match-b', form: { kind: 'fraction', numerator: '3', denominator: '6' } },
      { id: 'match-c', form: { kind: 'fraction', numerator: '4', denominator: '6' } },
    ],
    '12': [
      { id: 'match-a', form: { kind: 'fraction', numerator: '5', denominator: '12' } },
      { id: 'match-b', form: { kind: 'fraction', numerator: '6', denominator: '12' } },
      { id: 'match-c', form: { kind: 'fraction', numerator: '7', denominator: '12' } },
    ],
  },
});

/** The only revision map for all authored fixture/task-data identities. */
export const LEGACY_AUTHORED_IDENTITIES = deepFreeze([
  {
    fixtureId: 'curated-relatively-prime-addition-non-least',
    authoringRevision: 'plan03-fixtures-v1',
    taskDataRevision: 'legacy-plan03-authored-data-v1',
    recipe: { id: 'legacy-explicit-task-data', revision: '1' },
  },
  {
    fixtureId: 'curated-relatively-prime-addition-one-half-one-third',
    authoringRevision: 'plan26-fixtures-v1',
    taskDataRevision: 'legacy-plan26-authored-data-v1',
    recipe: { id: 'legacy-explicit-task-data', revision: '1' },
  },
]);
