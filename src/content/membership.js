import {
  FAMILY_DEFINITIONS,
  OVERLAY_DEFINITIONS,
} from './family-definitions.js';

function evaluatePredicate(predicate, facts) {
  switch (predicate.predicate) {
    case 'operation':
      return facts.operation === predicate.expected;
    case 'proper-operands':
      return facts.leftClassification.isProper && facts.rightClassification.isProper;
    case 'denominator-relationship':
      return facts.denominatorRelationship === predicate.expected;
    case 'renaming-count':
      return Number(facts.renaming.left) + Number(facts.renaming.right) === predicate.expected;
    case 'nonnegative-result':
      return facts.nonnegativeResult === predicate.expected;
    case 'lcd-is-product':
      return facts.lcd === facts.left.denominator * facts.right.denominator;
    case 'result-simplification':
      return facts.resultClassification.simplificationStatus === predicate.expected;
    case 'result-crosses-whole':
      return facts.resultClassification.crossesWhole === predicate.expected;
    default:
      throw new RangeError(`unknown content membership predicate: ${predicate.predicate}`);
  }
}
function checkDefinitions(definitions, facts, category) {
  const failures = [];
  for (const definition of definitions) {
    for (const predicate of definition.requiredChecks) {
      if (!evaluatePredicate(predicate, facts)) {
        failures.push({
          category,
          checkId: predicate.id,
          expected: predicate.expected,
          actual: actualForPredicate(predicate, facts),
        });
      }
    }
  }
  return failures;
}

function actualForPredicate(predicate, facts) {
  switch (predicate.predicate) {
    case 'operation': return facts.operation;
    case 'proper-operands': return facts.leftClassification.isProper && facts.rightClassification.isProper;
    case 'denominator-relationship': return facts.denominatorRelationship;
    case 'renaming-count': return Number(facts.renaming.left) + Number(facts.renaming.right);
    case 'nonnegative-result': return facts.nonnegativeResult;
    case 'lcd-is-product': return facts.lcd === facts.left.denominator * facts.right.denominator;
    case 'result-simplification': return facts.resultClassification.simplificationStatus;
    case 'result-crosses-whole': return facts.resultClassification.crossesWhole;
    default: return null;
  }
}

export function validateStructuralMembership(selector, facts) {
  const definition = FAMILY_DEFINITIONS[selector];
  if (!definition) {
    return {
      valid: false,
      familyId: selector,
      failedChecks: [{
        category: 'structural',
        checkId: 'known-selector',
        expected: true,
        actual: false,
      }],
      derivedFactsUsed: [],
    };
  }

  const failedChecks = checkDefinitions([definition], facts, 'structural');
  return {
    valid: failedChecks.length === 0,
    familyId: selector,
    failedChecks,
    derivedFactsUsed: [
      'operation',
      'leftClassification',
      'rightClassification',
      'denominatorRelationship',
      'renaming',
      'nonnegativeResult',
      'lcd',
    ],
  };
}

export function validateOverlayMembership(overlays, facts) {
  const definitions = overlays.map((overlay) => OVERLAY_DEFINITIONS[overlay]);
  const failedChecks = checkDefinitions(definitions, facts, 'overlay');
  return {
    valid: failedChecks.length === 0,
    overlayIds: overlays,
    failedChecks,
    derivedFactsUsed: ['resultClassification'],
  };
}
