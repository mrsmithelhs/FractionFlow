import {
  addAtCommonDenominator,
  createFraction,
  convertToDenominator,
  simplifyFraction,
  subtractAtCommonDenominator,
  validateCommonDenominator,
  validateEquivalentFraction,
  validateOperationResult,
} from '../math/index.js';
import { validateOverlayMembership, validateStructuralMembership } from './membership.js';
import { buildPathFacts } from './analysis.js';
import { FAMILY_DEFINITIONS } from './family-definitions.js';
import { evaluateInstanceEligibility } from './eligibility.js';
import {
  evaluateCandidate,
  inspectCandidateSpace,
  resolveGenerationRequest,
} from './generator.js';
import {
  fractionToWire,
  GENERATOR_VERSION,
  instanceId,
  SCHEMA_VERSION,
  wireToForm,
} from './schema.js';
import { canonicalSeedKey, createSeededRng, SEED_ALGORITHM } from './seed.js';

function sameWire(left, right) {
  try {
    const serialize = (value) => JSON.stringify(value, (_key, child) => (
      typeof child === 'bigint' ? `${child}n` : child
    ));
    return serialize(left) === serialize(right);
  } catch {
    return false;
  }
}

function addCheck(checks, id, valid, details = {}) {
  checks.push({ id, valid: Boolean(valid), ...details });
}

function isDeepFrozen(value, seen = new WeakSet()) {
  if (!value || typeof value !== 'object') return true;
  if (!Object.isFrozen(value)) return false;
  if (seen.has(value)) return true;
  seen.add(value);
  return Object.values(value).every((child) => isDeepFrozen(child, seen));
}

function sortedKeys(value) {
  return value && typeof value === 'object' ? Object.keys(value).sort() : [];
}

function isDecimalString(value) {
  return typeof value === 'string' && /^(0|[1-9]\d*)$/.test(value);
}

function safeIndex(value) {
  if (!isDecimalString(value)) return null;
  const index = Number(value);
  return Number.isSafeInteger(index) ? index : null;
}

function instanceCandidate(instance) {
  const left = instance.operands?.left?.initialForm;
  const right = instance.operands?.right?.initialForm;
  if (!left || left.kind !== 'fraction' || !right || right.kind !== 'fraction') {
    throw new TypeError('Plan 03 initial validation currently requires fraction operands');
  }
  const reviewedTransitions = {};
  for (const side of ['left', 'right']) {
    const transitions = instance.operands?.[side]?.acceptedFormTransitions;
    if (!Array.isArray(transitions)) {
      throw new TypeError(`${side} acceptedFormTransitions must be an array`);
    }
    reviewedTransitions[side] = transitions;
  }
  return { left, right, reviewedTransitions };
}

function validateProvenanceShape(instance, checks) {
  const provenance = instance?.provenance;
  const kindValid = Boolean(
    provenance
      && typeof provenance === 'object'
      && (provenance.kind === 'generated' || provenance.kind === 'curated'),
  );
  addCheck(checks, 'provenance-kind', kindValid, { actual: provenance?.kind ?? null });
  return kindValid;
}

function validateGeneratedProvenance(instance, request, candidate, space, checks) {
  const provenance = instance.provenance;
  const expectedKeys = [
    'candidateSpace',
    'generatorVersion',
    'kind',
    'profileId',
    'profileVersion',
    'seed',
    'seedAlgorithm',
    'selectedCandidateIndex',
    'selection',
  ];
  addCheck(checks, 'generated-provenance-shape', sameWire(sortedKeys(provenance), expectedKeys));
  for (const field of ['generatorVersion', 'profileId', 'profileVersion', 'seed', 'selectedCandidateIndex']) {
    addCheck(checks, `generated-provenance:${field}`, typeof provenance[field] === 'string', {
      actual: provenance[field] ?? null,
    });
  }
  addCheck(checks, 'generated-provenance:generator-version', provenance.generatorVersion === GENERATOR_VERSION);
  addCheck(checks, 'generated-provenance:profile-id', provenance.profileId === request.profile.id);
  addCheck(checks, 'generated-provenance:profile-version', provenance.profileVersion === request.profile.version);
  let seedValid = false;
  try {
    canonicalSeedKey({
      schemaVersion: SCHEMA_VERSION,
      generatorVersion: GENERATOR_VERSION,
      selector: request.selector,
      operation: request.operation,
      profileId: request.profile.id,
      profileVersion: request.profile.version,
      seed: provenance.seed,
    });
    seedValid = true;
  } catch {
    seedValid = false;
  }
  addCheck(checks, 'generated-provenance:seed-valid', seedValid);
  addCheck(checks, 'generated-provenance:seed-algorithm', sameWire(provenance.seedAlgorithm, SEED_ALGORITHM));
  const selection = provenance.selection;
  let replayedOrdinal = null;
  try {
    const seedKey = canonicalSeedKey({
      schemaVersion: SCHEMA_VERSION,
      generatorVersion: GENERATOR_VERSION,
      selector: request.selector,
      operation: request.operation,
      profileId: request.profile.id,
      profileVersion: request.profile.version,
      seed: provenance.seed,
    });
    replayedOrdinal = space.eligibleIndices.length > 0
      ? createSeededRng(seedKey).nextIndex(space.eligibleIndices.length)
      : null;
  } catch {
    replayedOrdinal = null;
  }
  const recordedOrdinal = safeIndex(selection?.eligibleOrdinal);
  addCheck(checks, 'generated-provenance:seed-replays-selection',
    recordedOrdinal !== null && recordedOrdinal === replayedOrdinal, {
      expected: replayedOrdinal,
      actual: recordedOrdinal,
    });
  addCheck(checks, 'generated-provenance:candidate-space', sameWire(provenance.candidateSpace, {
    rawCardinality: space.rawCardinality.toString(),
    eligibleCardinality: space.eligibleCardinality.toString(),
  }));

  addCheck(checks, 'generated-provenance:selection-shape', sameWire(sortedKeys(selection), ['eligibleOrdinal', 'strategy']));
  addCheck(checks, 'generated-provenance:selection-strategy', selection?.strategy === 'uniform-eligible-index');
  const ordinal = safeIndex(selection?.eligibleOrdinal);
  addCheck(checks, 'generated-provenance:eligible-ordinal', ordinal !== null && ordinal < space.eligibleIndices.length, {
    actual: selection?.eligibleOrdinal ?? null,
  });
  const expectedIndex = ordinal === null ? null : space.eligibleIndices[ordinal];
  addCheck(checks, 'generated-provenance:selected-candidate-index',
    isDecimalString(provenance.selectedCandidateIndex)
      && expectedIndex !== undefined
      && provenance.selectedCandidateIndex === expectedIndex.toString(), {
      expected: expectedIndex?.toString() ?? null,
      actual: provenance.selectedCandidateIndex ?? null,
    });
  const expectedCandidate = ordinal === null ? null : space.eligibleCandidates[ordinal];
  addCheck(checks, 'generated-provenance:selected-candidate', sameWire(expectedCandidate, {
    left: candidate.left,
    right: candidate.right,
  }));
}

function validateCuratedProvenance(instance, checks) {
  const provenance = instance.provenance;
  const expectedKeys = ['authoringRevision', 'fixtureId', 'kind'];
  addCheck(checks, 'curated-provenance-shape', sameWire(sortedKeys(provenance), expectedKeys));
  for (const field of ['fixtureId', 'authoringRevision']) {
    addCheck(checks, `curated-provenance:${field}`, typeof provenance[field] === 'string' && provenance[field].length > 0, {
      actual: provenance[field] ?? null,
    });
  }
}

function validateProvenance(instance, request, candidate, space, checks) {
  if (!validateProvenanceShape(instance, checks)) return;
  if (instance.provenance.kind === 'generated') {
    validateGeneratedProvenance(instance, request, candidate, space, checks);
  } else {
    validateCuratedProvenance(instance, checks);
  }
}

function validatePath(path, facts, operation, expectedKind, checks) {
  if (!path || typeof path !== 'object') {
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
  ));
  addCheck(checks, `${expectedKind}-left-conversion`, sameWire(
    path.transformations.find((step) => step.target === 'left')?.toForm,
    fractionToWire(leftAtTarget),
  ) || facts.left.denominator === targetDenominator);
  addCheck(checks, `${expectedKind}-right-conversion`, sameWire(
    path.transformations.find((step) => step.target === 'right')?.toForm,
    fractionToWire(rightAtTarget),
  ) || facts.right.denominator === targetDenominator);
}

function expectedReviewedTransition(source, transition, side, checks) {
  if (!transition || typeof transition !== 'object') {
    addCheck(checks, `${side}-transition-shape`, false);
    return null;
  }
  addCheck(checks, `${side}-transition-id`, typeof transition.id === 'string' && transition.id.length > 0);
  addCheck(checks, `${side}-transition-type`, transition.type === 'simplify-first');
  addCheck(checks, `${side}-transition-target`, transition.target === side);
  let target;
  try {
    const toForm = wireToForm(transition.toForm);
    if (toForm.kind !== 'fraction') throw new TypeError('reviewed transition must target a fraction form');
    target = createFraction(toForm.numerator, toForm.denominator);
  } catch (error) {
    addCheck(checks, `${side}-transition-target-form`, false, { actual: error.message });
    return null;
  }
  const equivalent = validateEquivalentFraction(target, source);
  addCheck(checks, `${side}-transition-equivalence:${transition.id}`, equivalent.validity === 'valid', {
    actual: equivalent.validity,
  });
  addCheck(checks, `${side}-transition-simplified-target:${transition.id}`,
    sameWire(fractionToWire(target), fractionToWire(simplifyFraction(source))));
  const expected = {
    id: transition.id,
    type: 'simplify-first',
    target: side,
    fromForm: fractionToWire(source),
    toForm: fractionToWire(target),
    preservesExactValue: true,
    establishesCurrentForm: false,
    downstreamBasis: 'current-form-if-accepted',
  };
  addCheck(checks, `${side}-transition-contract:${transition.id}`, sameWire(transition, expected));
  return expected;
}

function validateOperand(instance, side, facts, checks) {
  const actual = instance.operands?.[side];
  const source = facts[side];
  const transitions = actual?.acceptedFormTransitions;
  addCheck(checks, `${side}-transitions-array`, Array.isArray(transitions));
  const expectedTransitions = [];
  if (Array.isArray(transitions)) {
    for (const transition of transitions) {
      const expected = expectedReviewedTransition(source, transition, side, checks);
      if (expected) expectedTransitions.push(expected);
    }
  }
  const expected = {
    exactValue: fractionToWire(simplifyFraction(source)),
    initialForm: fractionToWire(source),
    currentForm: fractionToWire(source),
    preferredFinalForm: fractionToWire(simplifyFraction(source)),
    acceptedFormTransitions: expectedTransitions,
  };
  addCheck(checks, `${side}-contract`, sameWire(actual, expected), {
    expected,
    actual: actual ?? null,
  });
}

function expectedClassification(request, facts, canonicalPath, alternatePaths) {
  return {
    family: {
      structuralSelector: request.selector,
      overlays: request.overlays,
      stateSnapshot: 'initial',
    },
    denominator: {
      relationship: facts.denominatorRelationship,
      leastCommonDenominator: facts.lcd.toString(),
      canonicalScaleFactors: {
        left: facts.commonDenominatorValidation.scaleFactors.left.toString(),
        right: facts.commonDenominatorValidation.scaleFactors.right.toString(),
      },
      alternateCommonDenominators: alternatePaths.map((path) => path.targetDenominator),
    },
    transformations: {
      canonicalRenaming: {
        left: facts.renaming.left,
        right: facts.renaming.right,
        targetDenominator: facts.renaming.targetDenominator.toString(),
      },
      canonical: canonicalPath.transformations,
      alternates: alternatePaths.map((path) => path.transformations),
    },
    result: {
      exactResult: fractionToWire(facts.simplifiedResult),
      canonicalRawResultForm: fractionToWire(facts.rawResult),
      preferredFinalForm: fractionToWire(facts.simplifiedResult),
      resultForm: facts.resultClassification.resultForm,
      simplificationStatus: facts.resultClassification.simplificationStatus,
      isWholeValued: facts.resultClassification.isWholeValued,
      crossesWhole: facts.resultClassification.crossesWhole,
    },
    regrouping: {
      type: 'none',
      required: false,
    },
    magnitude: {
      benchmarkRegion: facts.magnitude.benchmarkRegion,
      lowerWhole: facts.magnitude.lowerWhole.toString(),
      upperWhole: facts.magnitude.upperWhole.toString(),
      relativeToZero: facts.magnitude.relativeToZero,
      relativeToOne: facts.magnitude.relativeToOne,
      relativeToTwo: facts.magnitude.relativeToTwo,
    },
  };
}

function expectedRepresentationFacts(facts, instance) {
  const eligibility = evaluateInstanceEligibility(instance);
  return {
    operandDenominators: {
      left: facts.left.denominator.toString(),
      right: facts.right.denominator.toString(),
    },
    canonicalDenominator: facts.lcd.toString(),
    resultDenominator: facts.rawResult.denominator.toString(),
    wholeSpan: {
      lowerWhole: facts.magnitude.lowerWhole.toString(),
      upperWhole: facts.magnitude.upperWhole.toString(),
    },
    subdivisionCounts: {
      left: facts.left.denominator.toString(),
      right: facts.right.denominator.toString(),
      canonical: facts.lcd.toString(),
    },
    eligibility: eligibility.eligibility,
    alternateRepresentationRecommendation: eligibility.alternateRepresentationRecommendation,
  };
}

function expectedReviewMetadata(request, facts, alternatePaths) {
  return {
    scaleFactors: {
      left: facts.commonDenominatorValidation.scaleFactors.left.toString(),
      right: facts.commonDenominatorValidation.scaleFactors.right.toString(),
    },
    magnitudeRange: {
      lowerWhole: facts.magnitude.lowerWhole.toString(),
      upperWhole: facts.magnitude.upperWhole.toString(),
      benchmarkRegion: facts.magnitude.benchmarkRegion,
    },
    intendedTargetConcept: request.overlays.length === 0
      ? request.selector
      : `${request.selector}+${request.overlays.join('+')}`,
    likelyAlternateValidPaths: alternatePaths.map((path) => path.kind),
    authoredCoverageNote: 'Canonical LCD path is preferred; valid alternate paths remain mathematical alternatives.',
    synthetic: true,
  };
}

export function validateProblemInstance(instance) {
  const checks = [];
  const errors = [];
  let request = null;
  let facts = null;
  try {
    addCheck(checks, 'schema-version', instance?.schemaVersion === SCHEMA_VERSION, {
      actual: instance?.schemaVersion ?? null,
    });
    addCheck(checks, 'immutable-source-contract', isDeepFrozen(instance), {
      actual: isDeepFrozen(instance),
    });
    validateProvenanceShape(instance, checks);

    request = resolveGenerationRequest({
      selector: instance?.request?.selector,
      overlays: instance?.request?.overlays,
      profileId: instance?.request?.profileId,
    });
    const definition = FAMILY_DEFINITIONS[request.selector];
    const candidate = instanceCandidate(instance);
    const evaluation = evaluateCandidate(candidate, {
      ...request,
      familyRelationship: definition.denominatorRelationship,
    });
    facts = evaluation.facts;
    const space = inspectCandidateSpace({
      selector: request.selector,
      overlays: request.overlays,
      profileId: request.profile.id,
    });

    validateProvenance(instance, request, candidate, space, checks);
    addCheck(checks, 'source-matches-provenance', instance.source === instance.provenance?.kind, {
      actual: instance.source,
    });
    const expectedRequest = {
      selector: request.selector,
      operation: request.operation,
      overlays: request.overlays,
      profileId: request.profile.id,
      profileVersion: request.profile.version,
    };
    addCheck(checks, 'request-contract', sameWire(instance.request, expectedRequest), {
      expected: expectedRequest,
      actual: instance.request ?? null,
    });
    addCheck(checks, 'request-operation', instance.request?.operation === request.operation);
    addCheck(checks, 'request-profile-version', instance.request?.profileVersion === request.profile.version);

    const expectedId = instanceId({
      selector: request.selector,
      overlays: request.overlays,
      left: candidate.left,
      right: candidate.right,
    });
    addCheck(checks, 'instance-id', instance.id === expectedId, {
      expected: expectedId,
      actual: instance.id,
    });
    addCheck(checks, 'candidate-membership', evaluation.accepted, { reasons: evaluation.reasons });
    addCheck(checks, 'structural-membership', validateStructuralMembership(request.selector, facts).valid);
    addCheck(checks, 'overlay-membership', validateOverlayMembership(request.overlays, facts).valid);

    const expectedResultState = {
      exactResult: fractionToWire(facts.simplifiedResult),
      canonicalRawResultForm: fractionToWire(facts.rawResult),
      currentForm: fractionToWire(facts.rawResult),
      preferredFinalForm: fractionToWire(facts.simplifiedResult),
    };
    addCheck(checks, 'result-state-contract', sameWire(instance.resultState, expectedResultState), {
      expected: expectedResultState,
      actual: instance.resultState ?? null,
    });
    addCheck(checks, 'result-state-exact-result', sameWire(instance.resultState?.exactResult, expectedResultState.exactResult));
    addCheck(checks, 'result-state-canonical-raw', sameWire(instance.resultState?.canonicalRawResultForm, expectedResultState.canonicalRawResultForm));
    addCheck(checks, 'result-state-current-form', sameWire(instance.resultState?.currentForm, expectedResultState.currentForm));
    addCheck(checks, 'result-state-preferred-final', sameWire(instance.resultState?.preferredFinalForm, expectedResultState.preferredFinalForm));

    validateOperand(instance, 'left', facts, checks);
    validateOperand(instance, 'right', facts, checks);

    const { canonicalPath, alternatePaths } = buildPathFacts(facts);
    addCheck(checks, 'canonical-path-shape', instance.canonicalPath?.kind === 'lcd');
    validatePath(instance.canonicalPath, facts, request.operation, 'canonical', checks);
    addCheck(checks, 'alternate-paths-array', Array.isArray(instance.alternatePaths));
    for (const alternatePath of Array.isArray(instance.alternatePaths) ? instance.alternatePaths : []) {
      validatePath(alternatePath, facts, request.operation, 'alternate', checks);
    }
    addCheck(checks, 'canonical-path-contract', sameWire(instance.canonicalPath, canonicalPath));
    addCheck(checks, 'alternate-path-contract', sameWire(instance.alternatePaths, alternatePaths));

    const classification = expectedClassification(request, facts, canonicalPath, alternatePaths);
    addCheck(checks, 'classification-contract', sameWire(instance.classification, classification), {
      expected: classification,
      actual: instance.classification ?? null,
    });
    addCheck(checks, 'representation-facts-contract', sameWire(
      instance.representationFacts,
      expectedRepresentationFacts(facts, instance),
    ));
    addCheck(checks, 'review-metadata-contract', sameWire(
      instance.reviewMetadata,
      expectedReviewMetadata(request, facts, alternatePaths),
    ));

    const valid = checks.every((check) => check.valid) && errors.length === 0;
    return { valid, checks, errors, facts, request };
  } catch (error) {
    errors.push({ id: 'validation-exception', message: error?.message ?? String(error) });
    return { valid: false, checks, errors, facts, request };
  }
}
