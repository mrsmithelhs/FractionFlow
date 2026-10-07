import { evaluateProposedPathEligibility } from '../content/eligibility.js';
import { reflectionChoicesForInstance } from '../content/data/reflection-choices.js';
import { premiseCheckForInstance } from '../content/data/premise-checks.js';

/**
 * Check whether a mathematically valid common-unit choice has every path the
 * registered episode will ask the learner to complete. This remains upstream
 * of scene projection and combines content coverage, representation limits,
 * and condition-specific reflection data.
 */
export function evaluateTaskPathClosure({
  instance,
  targetDenominator,
  episodeDefinition,
  activeCondition,
} = {}) {
  const path = evaluateProposedPathEligibility(instance, targetDenominator);
  const reflectionApplicable = episodeDefinition?.includeReflection === true;
  const connectionMaking = activeCondition?.connectionMaking ?? null;
  let reflectionAvailable = true;

  if (reflectionApplicable) {
    if (connectionMaking === 'CM-01-M') {
      const choices = reflectionChoicesForInstance(instance, path.targetDenominator);
      reflectionAvailable = Array.isArray(choices)
        && choices.length >= 2
        && choices.every((choice) => (
          typeof choice?.id === 'string'
          && choice.id.length > 0
          && typeof choice.form?.numerator === 'string'
          && choice.form?.denominator === path.targetDenominator
        ));
    } else if (connectionMaking === 'CM-01-P') {
      const premise = premiseCheckForInstance(instance, path.targetDenominator);
      reflectionAvailable = Boolean(
        premise
        && premise.fixtureId === instance?.provenance?.fixtureId
        && premise.targetDenominator === path.targetDenominator
        && premise.sourceForm?.numerator
        && premise.sourceForm?.denominator
        && premise.presentedForm?.numerator
        && premise.presentedForm?.denominator === path.targetDenominator,
      );
    } else {
      reflectionAvailable = false;
    }
  }

  const reason = path.rendering !== 'eligible'
    ? 'outside-representation-capability'
    : path.authoredCoverage === 'outside-authored-coverage'
      ? 'outside-authored-coverage'
      : !reflectionAvailable
        ? 'missing-condition-reflection-data'
        : null;

  return Object.freeze({
    available: reason === null,
    reason,
    path,
    reflection: Object.freeze({
      applicable: reflectionApplicable,
      connectionMaking,
      available: reflectionAvailable,
    }),
  });
}
