import { deepFreeze } from '../schema.js';

/**
 * Authored CM-01-P premise checks for Phase 2 curated fixtures.
 *
 * Each entry pairs a starting fraction with a proposed renaming.
 * To satisfy DECISION-026 without inverting the habit into an automatic "no",
 * both false and true cases are authored, deterministically mapped to the
 * learner's chosen denominator route.
 */
export const PREMISE_CHECKS_BY_FIXTURE = deepFreeze({
  'curated-relatively-prime-addition-non-least': {
    '12': {
      id: 'premise-rel-prime-12',
      fixtureId: 'curated-relatively-prime-addition-non-least',
      targetDenominator: '12',
      sourceForm: { kind: 'fraction', numerator: '2', denominator: '3' },
      presentedForm: { kind: 'fraction', numerator: '7', denominator: '12' },
      isEquivalent: false,
      expectedResponse: 'no',
      distractorType: 'off-by-one-numerator',
    },
    '24': {
      id: 'premise-rel-prime-24',
      fixtureId: 'curated-relatively-prime-addition-non-least',
      targetDenominator: '24',
      sourceForm: { kind: 'fraction', numerator: '2', denominator: '3' },
      presentedForm: { kind: 'fraction', numerator: '16', denominator: '24' },
      isEquivalent: true,
      expectedResponse: 'yes',
      distractorType: null,
    },
  },
});

/**
 * Returns the authored premise check for a content instance and established
 * denominator, or null when no premise check is authored for that route.
 */
export function premiseCheckForInstance(instance, establishedDenominator) {
  const fixtureId = instance?.provenance?.fixtureId;
  const checksByDenominator = PREMISE_CHECKS_BY_FIXTURE[fixtureId];
  if (!checksByDenominator) return null;
  return checksByDenominator[String(establishedDenominator)] ?? null;
}
