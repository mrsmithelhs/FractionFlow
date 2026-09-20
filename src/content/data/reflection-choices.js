import { deepFreeze } from '../schema.js';

/**
 * Authored CM-01 matching choices for the ready-subset fixture.
 *
 * These are presentation-ready fraction forms and stable choice identities.
 * They deliberately carry no correctness flag: the learner's selected identity
 * remains an instructional response, while the forms themselves stay content-owned.
 */
export const REFLECTION_CHOICES_BY_FIXTURE = deepFreeze({
  'curated-relatively-prime-addition-non-least': [
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
});

/**
 * Returns authored matching choices for a content instance, or null when the
 * content layer has no reviewed choice set for that instance.
 */
export function reflectionChoicesForInstance(instance) {
  const fixtureId = instance?.provenance?.fixtureId;
  return REFLECTION_CHOICES_BY_FIXTURE[fixtureId] ?? null;
}
