import {
  addAtCommonDenominator,
  createFraction,
  convertToDenominator,
  subtractAtCommonDenominator,
  simplifyFraction,
  validateCommonDenominator,
  validateEquivalentFraction,
  validateOperationResult,
} from '../math/index.js';
import { validateOverlayMembership, validateStructuralMembership } from './membership.js';
import { buildPathFacts, deriveFacts } from './analysis.js';
import { FAMILY_DEFINITIONS } from './family-definitions.js';
import { evaluateCandidate, resolveGenerationRequest } from './generator.js';
import { fractionToWire, instanceId, SCHEMA_VERSION, wireToForm } from './schema.js';

function sameWire(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function addCheck(checks, id, valid, details = {}) {
  checks.push({ id, valid, ...details });
}

function isDeepFrozen(value, seen = new WeakSet()) {
  if (!value || typeof value !== 'object') return true;
  if (!Object.isFrozen(value)) return false;
  if (seen.has(value)) return true;
  seen.add(value);
  return Object.values(value).every((child) => isDeepFrozen(child, seen));
}

function instanceCandidate(instance) {
  const left = instance.operands?.left?.initialForm;
  const right = instance.operands?.right?.initialForm;
  if (!left || left.kind !== 'fraction' || !right || right.kind !== 'fraction') {
    throw new TypeError('Plan 03 initial validation currently requires fraction operands');
  }
  return {
    left,
    right,
    reviewedTransitions: [
      ...(instance.operands.left.acceptedFormTransitions ?? []),
      ...(instance.operands.right.acceptedFormTransitions ?? []),
    ],
  };
}

function validateProvenance(instance, checks) {
  const provenance = instance.provenance;
  const kindValid = provenance && (provenance.kind === 'generated' || provenance.kind === 'curated');
  addCheck(checks, 'provenance-kind', kindValid, { actual: provenance?.kind ?? null });
  if (!kindValid) return;

  if (provenance.kind === 'generated') {
    for (const field of [
      'generatorVersion',
      'profileId',
      'profileVersion',
      'seed',
      'acceptedCandidateIndex',
      'attempts',
    ]) {
      addCheck(checks, `generated-provenance:${field}`, typeof provenance[field] === 'string', {
        actual: provenance[field] ?? null,
      });
    }
    addCheck(
      checks,
      'generated-provenance:no-fixture-id',
      provenance.fixtureId === undefined,
      { actual: provenance.fixtureId ?? null },
    );
    addCheck(
      checks,
      'generated-provenance:no-authoring-revision',
      provenance.authoringRevision === undefined,
      { actual: provenance.authoringRevision ?? null },
    );
  } else {
    for (const field of ['fixtureId', 'authoringRevision']) {
      addCheck(checks, `curated-provenance:${field}`, typeof provenance[field] === 'string', {
        actual: provenance[field] ?? null,
      });
    }
    for (const field of [
      'generatorVersion',
      'profileId',
      'profileVersion',
      'seed',
      'seedAlgorithm',
      'acceptedCandidateIndex',
      'attempts',
      'candidateSpace',
      'rejectionCounts',
    ]) {
      addCheck(checks, `curated-provenance:no-${field}`, provenance[field] === undefined, {
        actual: provenance[field] ?? null,
      });
    }
  }
}

function validatePath(path, facts, operation, expectedKind, checks) {
  if (!path) {
    addCheck(checks, `${expectedKind}-path-present`, false);
    return;
  }
  const targetDenominator = BigInt(path.targetDenominator);
  const commonValidation = validateCommonDenominator(targetDenominator, facts.left, facts.right);
  addCheck(checks, `${expectedKind}-common-denominator`, commonValidation.validity === 'valid', {
    actual: commonValidation.validity,
  });
  if (expectedKind === 'canonical') {
    addCheck(checks, 'canonical-path-is-least', commonValidation.efficiency === 'least', {
      actual: commonValidation.efficiency,
    });
  } else {
    addCheck(checks, `${expectedKind}-path-is-non-least`, commonValidation.efficiency === 'non-least', {
      actual: commonValidation.efficiency,
    });
  }

  const leftAtTarget = convertToDenominator(facts.left, targetDenominator);
  const rightAtTarget = convertToDenominator(facts.right, targetDenominator);
  const rawResult = operation === 'add'
    ? addAtCommonDenominator(facts.left, facts.right, targetDenominator)
    : subtractAtCommonDenominator(facts.left, facts.right, targetDenominator);
  const resultValidation = validateOperationResult(
    rawResult,
    facts.left,
    facts.right,
    operation,
    targetDenominator,
  );
  addCheck(checks, `${expectedKind}-operation-result`, resultValidation.validity === 'valid', {
    actual: resultValidation.validity,
  });
  addCheck(checks, `${expectedKind}-raw-result`, sameWire(path.finalResult?.rawForm, fractionToWire(rawResult)), {
    expected: fractionToWire(rawResult),
    actual: path.finalResult?.rawForm ?? null,
  });
  addCheck(checks, `${expectedKind}-preferred-result`, sameWire(
    path.finalResult?.preferredFinalForm,
    fractionToWire(facts.simplifiedResult),
  ), {
    expected: fractionToWire(facts.simplifiedResult),
    actual: path.finalResult?.preferredFinalForm ?? null,
  });
  addCheck(checks, `${expectedKind}-left-conversion`, sameWire(
    path.transformations.find((step) => step.target === 'left')?.toForm,
    fractionToWire(leftAtTarget),
  ) || facts.left.denominator === targetDenominator, {
    expected: fractionToWire(leftAtTarget),
  });
  addCheck(checks, `${expectedKind}-right-conversion`, sameWire(
    path.transformations.find((step) => step.target === 'right')?.toForm,
    fractionToWire(rightAtTarget),
  ) || facts.right.denominator === targetDenominator, {
    expected: fractionToWire(rightAtTarget),
  });
}

function validateReviewedTransitions(instance, checks) {
  for (const side of ['left', 'right']) {
    const sourceForm = instance.operands[side].initialForm;
    const source = createFraction(BigInt(sourceForm.numerator), BigInt(sourceForm.denominator));
    for (const transition of instance.operands[side].acceptedFormTransitions ?? []) {
      if (!transition || transition.target !== side || transition.type !== 'simplify-first') {
        addCheck(checks, `${side}-transition-shape`, false);
        continue;
      }
      const toForm = wireToForm(transition.toForm);
      if (toForm.kind !== 'fraction') {
        addCheck(checks, `${side}-transition-fraction-form`, false);
        continue;
      }
      const target = createFraction(toForm.numerator, toForm.denominator);
      const result = validateEquivalentFraction(target, source);
      addCheck(checks, `${side}-transition-equivalence:${transition.id}`, result.validity === 'valid', {
        actual: result.validity,
      });
    }
  }
}

export function validateProblemInstance(instance) {
  const checks = [];
  const errors = [];
  addCheck(checks, 'schema-version', instance?.schemaVersion === SCHEMA_VERSION, {
    actual: instance?.schemaVersion ?? null,
  });
  addCheck(checks, 'immutable-source-contract', isDeepFrozen(instance), {
    actual: isDeepFrozen(instance),
  });
  validateProvenance(instance ?? {}, checks);

  let request;
  let evaluation;
  let facts;
  try {
    request = resolveGenerationRequest({
      selector: instance.request.selector,
      overlays: instance.request.overlays,
      profileId: instance.request.profileId,
    });
    const definition = FAMILY_DEFINITIONS[request.selector];
    const candidate = instanceCandidate(instance);
    evaluation = evaluateCandidate(candidate, {
      ...request,
      familyRelationship: definition.denominatorRelationship,
    });
    facts = evaluation.facts;
  } catch (error) {
    errors.push({ id: 'normalization', message: error.message });
    return { valid: false, checks, errors, facts: null };
  }

  addCheck(checks, 'source-matches-provenance', instance.source === instance.provenance.kind, {
    actual: instance.source,
  });
  addCheck(checks, 'request-operation', instance.request.operation === request.operation, {
    expected: request.operation,
    actual: instance.request.operation,
  });
  addCheck(checks, 'request-profile-version', instance.request.profileVersion === request.profile.version, {
    expected: request.profile.version,
    actual: instance.request.profileVersion,
  });
  addCheck(checks, 'instance-id', instance.id === instanceId({
    selector: request.selector,
    overlays: request.overlays,
    left: instance.operands.left.initialForm,
    right: instance.operands.right.initialForm,
  }), {
    expected: instanceId({
      selector: request.selector,
      overlays: request.overlays,
      left: instance.operands.left.initialForm,
      right: instance.operands.right.initialForm,
    }),
    actual: instance.id,
  });
  addCheck(checks, 'candidate-membership', evaluation.accepted, {
    reasons: evaluation.reasons,
  });
  addCheck(checks, 'structural-membership', validateStructuralMembership(request.selector, facts).valid);
  addCheck(checks, 'overlay-membership', validateOverlayMembership(request.overlays, facts).valid);

  const expectedExactResult = fractionToWire(facts.simplifiedResult);
  addCheck(checks, 'result-state-exact-result', sameWire(instance.resultState?.exactResult, expectedExactResult), {
    expected: expectedExactResult,
    actual: instance.resultState?.exactResult ?? null,
  });
  addCheck(checks, 'result-state-canonical-raw', sameWire(
    instance.resultState?.canonicalRawResultForm,
    fractionToWire(facts.rawResult),
  ));
  addCheck(checks, 'result-state-current-form', sameWire(
    instance.resultState?.currentForm,
    fractionToWire(facts.rawResult),
  ));
  addCheck(checks, 'result-state-preferred-final', sameWire(
    instance.resultState?.preferredFinalForm,
    fractionToWire(facts.simplifiedResult),
  ));
  addCheck(checks, 'left-exact-value', sameWire(
    instance.operands.left.exactValue,
    fractionToWire(simplifyFraction(facts.left)),
  ));
  addCheck(checks, 'right-exact-value', sameWire(
    instance.operands.right.exactValue,
    fractionToWire(simplifyFraction(facts.right)),
  ));
  addCheck(checks, 'canonical-path-shape', instance.canonicalPath?.kind === 'lcd');
  validatePath(instance.canonicalPath, facts, request.operation, 'canonical', checks);
  for (const alternatePath of instance.alternatePaths ?? []) {
    validatePath(alternatePath, facts, request.operation, 'alternate', checks);
  }
  validateReviewedTransitions(instance, checks);

  const { canonicalPath, alternatePaths } = buildPathFacts(facts);
  addCheck(checks, 'canonical-path-reproducible', JSON.stringify(instance.canonicalPath) === JSON.stringify(canonicalPath));
  addCheck(checks, 'alternate-path-count', (instance.alternatePaths ?? []).length === alternatePaths.length, {
    expected: alternatePaths.length,
    actual: (instance.alternatePaths ?? []).length,
  });
  addCheck(checks, 'representation-eligibility-deferred', [
    instance.representationFacts?.eligibility?.fractionBar,
    instance.representationFacts?.eligibility?.numberLine,
    instance.representationFacts?.eligibility?.symbolic,
  ].every((value) => value === 'deferred'));

  const valid = checks.every((check) => check.valid) && errors.length === 0;
  return {
    valid,
    checks,
    errors,
    facts,
    request,
  };
}
