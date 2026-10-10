import { deepFreeze } from '../schema.js';

/**
 * Authored CM-01 matching choices for the ready-subset fixture.
 *
 * These are presentation-ready fraction forms and stable choice identities.
 * They deliberately carry no correctness flag: the learner's selected identity
 * remains an instructional response, while the forms themselves stay content-owned.
 */
export const REFLECTION_CHOICES_BY_FIXTURE = deepFreeze({
  'curated-relatively-prime-addition-non-least': {
    '12': [
      {
        id: 'match-a',
        form: { kind: 'fraction', numerator: '8', denominator: '12' },
      },
      {
        id: 'match-b',
        form: { kind: 'fraction', numerator: '7', denominator: '12' },
      },
      {
        id: 'match-c',
        form: { kind: 'fraction', numerator: '9', denominator: '12' },
      },
    ],
    '24': [
      {
        id: 'match-b',
        form: { kind: 'fraction', numerator: '15', denominator: '24' },
      },
      {
        id: 'match-a',
        form: { kind: 'fraction', numerator: '16', denominator: '24' },
      },
      {
        id: 'match-c',
        form: { kind: 'fraction', numerator: '17', denominator: '24' },
      },
    ],
  },
  'curated-relatively-prime-addition-one-half-one-third': {
    '6': [
      {
        id: 'match-a',
        form: { kind: 'fraction', numerator: '2', denominator: '6' },
      },
      {
        id: 'match-b',
        form: { kind: 'fraction', numerator: '3', denominator: '6' },
      },
      {
        id: 'match-c',
        form: { kind: 'fraction', numerator: '4', denominator: '6' },
      },
    ],
    '12': [
      {
        id: 'match-a',
        form: { kind: 'fraction', numerator: '5', denominator: '12' },
      },
      {
        id: 'match-b',
        form: { kind: 'fraction', numerator: '6', denominator: '12' },
      },
      {
        id: 'match-c',
        form: { kind: 'fraction', numerator: '7', denominator: '12' },
      },
    ],
  },
});

const AUTHORED_REVISIONS_BY_FIXTURE = deepFreeze({
  'curated-relatively-prime-addition-non-least': 'plan03-fixtures-v1',
  'curated-relatively-prime-addition-one-half-one-third': 'plan26-fixtures-v1',
});

/**
 * Returns authored matching choices for a content instance and established
 * denominator, or null when the content layer has no reviewed choice set for
 * that route. There is intentionally no fixture-level fallback: reflection
 * choices are authored for the route the learner actually established.
 */
export function reflectionChoicesForInstance(instance, establishedDenominator) {
  const fixtureId = instance?.provenance?.fixtureId;
  const authoringRevision = instance?.provenance?.authoringRevision;
  if (!fixtureId || AUTHORED_REVISIONS_BY_FIXTURE[fixtureId] !== authoringRevision) return null;
  const choicesByDenominator = REFLECTION_CHOICES_BY_FIXTURE[fixtureId];
  if (!choicesByDenominator) return null;
  return choicesByDenominator[String(establishedDenominator)] ?? null;
}
