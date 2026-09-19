import { buildCuratedProblem } from './generator.js';
import { PHASE1_GOLDEN_CASES } from './data/phase1-golden-cases.js';
import { validateProblemInstance } from './validation.js';

function candidateFromFixture(fixture) {
  return {
    left: fixture.left,
    right: fixture.right,
    reviewedTransitions: fixture.reviewedTransitions ?? [],
  };
}

function compareExpected(instance, expected) {
  const failures = [];
  if (!expected) return failures;
  if (JSON.stringify(instance.resultState.canonicalRawResultForm) !== JSON.stringify(expected.rawResult)) {
    failures.push('expected-raw-result-mismatch');
  }
  if (JSON.stringify(instance.resultState.exactResult) !== JSON.stringify(expected.exactResult)) {
    failures.push('expected-exact-result-mismatch');
  }
  if (instance.classification.result.resultForm !== expected.resultForm) {
    failures.push('expected-result-form-mismatch');
  }
  if (expected.alternateDenominator !== undefined) {
    const found = instance.alternatePaths.some((path) => path.targetDenominator === expected.alternateDenominator);
    if (!found) failures.push('expected-alternate-denominator-missing');
  }
  return failures;
}

export function validateCuratedFixture(fixture) {
  try {
    const instance = buildCuratedProblem({
      fixture,
      selector: fixture.selector,
      overlays: fixture.overlays,
      profileId: fixture.profileId,
      candidate: candidateFromFixture(fixture),
    });
    const validation = validateProblemInstance(instance);
    const expectedFailures = compareExpected(instance, fixture.expected);
    return {
      fixture,
      instance,
      validation: {
        ...validation,
        valid: validation.valid && expectedFailures.length === 0,
        errors: [...validation.errors, ...expectedFailures.map((id) => ({ id, message: id }))],
      },
    };
  } catch (error) {
    return {
      fixture,
      instance: null,
      validation: {
        valid: false,
        checks: [],
        errors: [{ id: error.code ?? 'curated-fixture-error', message: error.message }],
      },
    };
  }
}

export function validateCuratedFixtures(fixtures = PHASE1_GOLDEN_CASES) {
  return fixtures.map(validateCuratedFixture);
}

export { PHASE1_GOLDEN_CASES };
