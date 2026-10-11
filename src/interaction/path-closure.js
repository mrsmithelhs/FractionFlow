import { evaluateProposedPathEligibility } from '../content/eligibility.js';
import { validateAuthoredPathTaskData } from '../content/authored-task-data.js';

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
    reflectionAvailable = ['CM-01-M', 'CM-01-P'].includes(connectionMaking)
      && path.rendering === 'eligible'
      && path.authoredCoverage !== 'outside-authored-coverage';
    if (reflectionAvailable) {
      try {
        validateAuthoredPathTaskData(instance, path.targetDenominator);
      } catch {
        reflectionAvailable = false;
      }
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
