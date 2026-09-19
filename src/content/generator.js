import {
  compareFractions,
  createFraction,
  simplifyFraction,
  validateEquivalentFraction,
} from '../math/index.js';
import {
  FAMILY_DEFINITIONS,
  getFamilyDefinition,
  normalizeOverlays,
  STRUCTURAL_SELECTOR_IDS,
  validateOverlayCompatibility,
} from './family-definitions.js';
import { deriveFacts, buildPathFacts } from './analysis.js';
import { validateOverlayMembership, validateStructuralMembership } from './membership.js';
import { getProfile } from './profiles.js';
import {
  canonicalSeedKey,
  createSeededRng,
  SEED_ALGORITHM,
} from './seed.js';
import {
  deepFreeze,
  fractionToWire,
  GENERATOR_VERSION,
  instanceId,
  SCHEMA_VERSION,
  wireToForm,
} from './schema.js';

export class ContentConfigurationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ContentConfigurationError';
    this.code = code;
  }
}

export class ContentGenerationError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'ContentGenerationError';
    this.code = code;
    this.details = details;
  }
}

const SPACE_CACHE = new Map();

function requestCacheKey(request) {
  return JSON.stringify({
    selector: request.selector,
    overlays: request.overlays,
    profileId: request.profile.id,
    profileVersion: request.profile.version,
  });
}

export function resolveGenerationRequest({
  selector,
  overlays = [],
  profileId = 'phase1-dev-default',
}) {
  if (typeof selector !== 'string') {
    throw new ContentConfigurationError('INVALID_SELECTOR', 'selector must be a string');
  }
  const definition = getFamilyDefinition(selector);
  if (!definition) {
    throw new ContentConfigurationError('UNKNOWN_SELECTOR', `unknown structural selector: ${selector}`);
  }

  let normalizedOverlays;
  try {
    normalizedOverlays = normalizeOverlays(overlays);
  } catch (error) {
    throw new ContentConfigurationError('INVALID_OVERLAYS', error.message);
  }

  const compatibility = validateOverlayCompatibility(selector, normalizedOverlays);
  if (!compatibility.valid) {
    throw new ContentConfigurationError(compatibility.code, compatibility.message);
  }

  const profile = getProfile(profileId);
  return deepFreeze({
    selector,
    operation: definition.operation,
    overlays: normalizedOverlays,
    profile,
  });
}

function makeCandidate(leftNumerator, leftDenominator, rightNumerator, rightDenominator) {
  return {
    left: {
      kind: 'fraction',
      numerator: leftNumerator.toString(),
      denominator: leftDenominator.toString(),
    },
    right: {
      kind: 'fraction',
      numerator: rightNumerator.toString(),
      denominator: rightDenominator.toString(),
    },
  };
}

function enumerateRelationshipCandidates(request) {
  // Relationship enumeration needs the Plan 02 classifier. It is kept separate from
  // candidate construction so every denominator pair is checked through one exact boundary.
  const definition = FAMILY_DEFINITIONS[request.selector];
  const candidates = [];
  for (const leftDenominator of request.profile.denominatorPool) {
    for (const rightDenominator of request.profile.denominatorPool) {
      const relationship = denominatorRelationshipFromCore(leftDenominator, rightDenominator);
      if (relationship !== definition.denominatorRelationship) continue;
      for (let leftNumerator = 0n; leftNumerator <= leftDenominator; leftNumerator += 1n) {
        for (let rightNumerator = 0n; rightNumerator <= rightDenominator; rightNumerator += 1n) {
          candidates.push(makeCandidate(
            leftNumerator,
            leftDenominator,
            rightNumerator,
            rightDenominator,
          ));
        }
      }
    }
  }
  return candidates;
}

function denominatorRelationshipFromCore(leftDenominator, rightDenominator) {
  const left = createFraction(1n, leftDenominator);
  const right = createFraction(1n, rightDenominator);
  return denominatorRelationshipCore(left, right);
}

function failedReason(check) {
  return check.category === 'overlay'
    ? `overlay:${check.checkId}`
    : `family:${check.checkId}`;
}

function profileRejectionReasons(facts, request) {
  const { profile } = request;
  const reasons = [];
  if (!facts.accepted) return facts.reasons;

  if (profile.properOperands && (!facts.leftClassification.isProper || !facts.rightClassification.isProper)) {
    reasons.push('operand-not-proper');
  }
  if (!profile.allowZeroOperands && (facts.left.numerator === 0n || facts.right.numerator === 0n)) {
    reasons.push('zero-operand');
  }
  if (profile.simplestOperands && (!facts.simplestOperands.left || !facts.simplestOperands.right)) {
    reasons.push('operand-not-simplest');
  }
  if (facts.renaming.left && facts.commonDenominatorValidation.scaleFactors.left > profile.maxCanonicalScaleFactor) {
    reasons.push('left-scale-factor-too-large');
  }
  if (facts.renaming.right && facts.commonDenominatorValidation.scaleFactors.right > profile.maxCanonicalScaleFactor) {
    reasons.push('right-scale-factor-too-large');
  }
  if (profile.positiveResult && facts.magnitude.relativeToZero <= 0) {
    reasons.push('result-not-positive');
  }
  const upperBound = createFraction(profile.resultUpperBound.numerator, profile.resultUpperBound.denominator);
  if (profile.resultUpperBound.relation === 'less-than'
    && compareFractions(facts.rawResult, upperBound) >= 0) {
    reasons.push('result-at-or-above-profile-upper-bound');
  }

  const requiresReducible = request.overlays.includes('reducible-result');
  const requiresCrossing = request.overlays.includes('crosses-one-whole');
  const expectedSimplification = requiresReducible
    ? 'reducible'
    : profile.defaultSimplificationStatus;
  if (facts.resultClassification.simplificationStatus !== expectedSimplification) {
    reasons.push('result-simplification-target-mismatch');
  }
  if (facts.resultClassification.crossesWhole !== (requiresCrossing || profile.defaultCrossesWhole)) {
    reasons.push('whole-crossing-target-mismatch');
  }
  return reasons;
}

export function evaluateCandidate(candidate, request) {
  const facts = deriveFacts(candidate, request.operation, request.profile);
  const reasons = [];
  if (facts.accepted) {
    const structural = validateStructuralMembership(request.selector, facts);
    reasons.push(...structural.failedChecks.map(failedReason));
    const overlays = validateOverlayMembership(request.overlays, facts);
    reasons.push(...overlays.failedChecks.map(failedReason));
  } else {
    reasons.push(...facts.reasons);
  }
  reasons.push(...profileRejectionReasons(facts, request));
  return {
    candidate,
    facts,
    accepted: facts.accepted && reasons.length === 0,
    reasons: [...new Set(reasons)],
  };
}

function countReasons(target, reasons) {
  for (const reason of reasons) {
    target[reason] = (target[reason] ?? 0) + 1;
  }
}

function inspectRequest(request) {
  const cacheKey = requestCacheKey(request);
  const cached = SPACE_CACHE.get(cacheKey);
  if (cached) return cached;

  const rawCandidates = enumerateRelationshipCandidates(request);
  const evaluations = rawCandidates.map((candidate) => evaluateCandidate(candidate, request));
  const rejectionCounts = {};
  for (const evaluation of evaluations) {
    if (!evaluation.accepted) countReasons(rejectionCounts, evaluation.reasons);
  }
  const eligibleIndices = evaluations
    .map((evaluation, index) => (evaluation.accepted ? index : null))
    .filter((index) => index !== null);
  const inspected = deepFreeze({
    rawCardinality: rawCandidates.length,
    eligibleCardinality: eligibleIndices.length,
    rejectionCounts,
    evaluations,
  });
  SPACE_CACHE.set(cacheKey, inspected);
  return inspected;
}

function makeReviewedTransitions(candidate, left, right) {
  const transitions = { left: [], right: [] };
  for (const descriptor of candidate.reviewedTransitions ?? []) {
    const target = descriptor.target;
    const source = target === 'left' ? left : right;
    const fromForm = fractionToWire(source);
    const toForm = descriptor.toForm;
    const toMath = wireToForm(toForm);
    if (toMath.kind !== 'fraction') {
      throw new TypeError('reviewed content transitions currently require fraction forms');
    }
    const toFraction = createFraction(toMath.numerator, toMath.denominator);
    const validation = validateEquivalentFraction(toFraction, source);
    if (validation.validity !== 'valid') {
      throw new ContentGenerationError(
        'INVALID_REVIEWED_TRANSFORMATION',
        `reviewed transformation ${descriptor.id} is not exactly equivalent`,
      );
    }
    transitions[target].push({
      id: descriptor.id,
      type: descriptor.type,
      target,
      fromForm,
      toForm: fractionToWire(toFraction),
      preservesExactValue: true,
      establishesCurrentForm: false,
      downstreamBasis: 'current-form-if-accepted',
    });
  }
  return transitions;
}

function makeQuantity(value, transitions) {
  const simplified = simplifyFraction(value);
  const initialForm = fractionToWire(value);
  return {
    exactValue: fractionToWire(simplified),
    initialForm,
    currentForm: initialForm,
    preferredFinalForm: fractionToWire(simplified),
    acceptedFormTransitions: transitions,
  };
}

function makeProblem({ request, evaluation, provenance }) {
  const facts = evaluation.facts;
  const { canonicalPath, alternatePaths } = buildPathFacts(facts);
  const reviewedTransitions = makeReviewedTransitions(
    evaluation.candidate,
    facts.left,
    facts.right,
  );
  const overlays = request.overlays;
  const resultState = {
    exactResult: fractionToWire(facts.simplifiedResult),
    canonicalRawResultForm: fractionToWire(facts.rawResult),
    currentForm: fractionToWire(facts.rawResult),
    preferredFinalForm: fractionToWire(facts.simplifiedResult),
  };
  const instance = {
    schemaVersion: SCHEMA_VERSION,
    id: instanceId({
      selector: request.selector,
      overlays,
      left: facts.left,
      right: facts.right,
    }),
    source: provenance.kind,
    request: {
      selector: request.selector,
      operation: request.operation,
      overlays,
      profileId: request.profile.id,
      profileVersion: request.profile.version,
    },
    provenance,
    operands: {
      left: makeQuantity(facts.left, reviewedTransitions.left),
      right: makeQuantity(facts.right, reviewedTransitions.right),
    },
    resultState,
    canonicalPath,
    alternatePaths,
    classification: {
      family: {
        structuralSelector: request.selector,
        overlays,
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
        canonicalRenaming: facts.renaming,
        canonical: canonicalPath.transformations,
        alternates: alternatePaths.map((path) => path.transformations),
      },
      result: {
        exactResult: resultState.exactResult,
        canonicalRawResultForm: resultState.canonicalRawResultForm,
        preferredFinalForm: resultState.preferredFinalForm,
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
    },
    representationFacts: {
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
      eligibility: {
        fractionBar: 'deferred',
        numberLine: 'deferred',
        symbolic: 'deferred',
      },
      alternateRepresentationRecommendation: 'none',
    },
    reviewMetadata: {
      scaleFactors: {
        left: facts.commonDenominatorValidation.scaleFactors.left.toString(),
        right: facts.commonDenominatorValidation.scaleFactors.right.toString(),
      },
      magnitudeRange: {
        lowerWhole: facts.magnitude.lowerWhole.toString(),
        upperWhole: facts.magnitude.upperWhole.toString(),
        benchmarkRegion: facts.magnitude.benchmarkRegion,
      },
      intendedTargetConcept: overlays.length === 0
        ? request.selector
        : `${request.selector}+${overlays.join('+')}`,
      likelyAlternateValidPaths: alternatePaths.map((path) => path.kind),
      authoredCoverageNote: 'Canonical LCD path is preferred; valid alternate paths remain mathematical alternatives.',
      synthetic: true,
    },
  };
  return deepFreeze(instance);
}

export function inspectCandidateSpace({ selector, overlays = [], profileId = 'phase1-dev-default' }) {
  const request = resolveGenerationRequest({ selector, overlays, profileId });
  const definition = FAMILY_DEFINITIONS[selector];
  const requestWithRelationship = deepFreeze({
    ...request,
    familyRelationship: definition.denominatorRelationship,
  });
  const inspected = inspectRequest(requestWithRelationship);
  return deepFreeze({
    selector,
    operation: request.operation,
    overlays: request.overlays,
    profileId: request.profile.id,
    profileVersion: request.profile.version,
    rawCardinality: inspected.rawCardinality,
    eligibleCardinality: inspected.eligibleCardinality,
    rejectionCounts: inspected.rejectionCounts,
  });
}

export function generateProblem({
  selector,
  seed,
  overlays = [],
  profileId = 'phase1-dev-default',
}) {
  // Request resolution intentionally precedes seed construction and candidate enumeration so
  // incompatible overlays fail as configuration errors before sampling begins.
  const request = resolveGenerationRequest({ selector, overlays, profileId });
  const definition = FAMILY_DEFINITIONS[selector];
  const requestWithRelationship = deepFreeze({
    ...request,
    familyRelationship: definition.denominatorRelationship,
  });
  const inspected = inspectRequest(requestWithRelationship);
  if (inspected.eligibleCardinality === 0) {
    throw new ContentGenerationError(
      'NO_ELIGIBLE_CANDIDATE',
      `no candidate satisfies ${selector} with overlays ${request.overlays.join(', ') || 'none'}`,
      {
        selector,
        overlays: request.overlays,
        rawCardinality: inspected.rawCardinality,
        rejectionCounts: inspected.rejectionCounts,
      },
    );
  }

  const seedKey = canonicalSeedKey({
    schemaVersion: SCHEMA_VERSION,
    generatorVersion: GENERATOR_VERSION,
    selector,
    operation: request.operation,
    profileId: request.profile.id,
    profileVersion: request.profile.version,
    seed,
  });
  const rng = createSeededRng(seedKey);
  const startingIndex = rng.nextIndex(inspected.evaluations.length);
  const rejectionCounts = {};
  let selected = null;
  let selectedIndex = null;
  let attempts = 0;
  for (let offset = 0; offset < inspected.evaluations.length && attempts < request.profile.maxAttempts; offset += 1) {
    const index = (startingIndex + offset) % inspected.evaluations.length;
    const evaluation = inspected.evaluations[index];
    attempts += 1;
    if (evaluation.accepted) {
      selected = evaluation;
      selectedIndex = index;
      break;
    }
    countReasons(rejectionCounts, evaluation.reasons);
  }
  if (!selected) {
    throw new ContentGenerationError(
      'ATTEMPT_LIMIT_EXCEEDED',
      `candidate search exceeded ${request.profile.maxAttempts} attempts`,
      { selector, overlays: request.overlays, startingIndex, attempts, rejectionCounts },
    );
  }

  return makeProblem({
    request,
    evaluation: selected,
    provenance: {
      kind: 'generated',
      generatorVersion: GENERATOR_VERSION,
      profileId: request.profile.id,
      profileVersion: request.profile.version,
      seed,
      seedAlgorithm: SEED_ALGORITHM,
      acceptedCandidateIndex: selectedIndex.toString(),
      attempts: attempts.toString(),
      candidateSpace: {
        rawCardinality: inspected.rawCardinality.toString(),
        eligibleCardinality: inspected.eligibleCardinality.toString(),
      },
      rejectionCounts,
    },
  });
}

export function buildCuratedProblem({ fixture, selector, overlays, profileId, candidate }) {
  const request = resolveGenerationRequest({ selector, overlays, profileId });
  const definition = FAMILY_DEFINITIONS[selector];
  const requestWithRelationship = deepFreeze({
    ...request,
    familyRelationship: definition.denominatorRelationship,
  });
  const evaluation = evaluateCandidate(candidate, requestWithRelationship);
  if (!evaluation.accepted) {
    throw new ContentGenerationError(
      'CURATED_FIXTURE_NOT_ELIGIBLE',
      `curated fixture ${fixture.id} does not satisfy its declared contract`,
      { fixtureId: fixture.id, reasons: evaluation.reasons },
    );
  }
  return makeProblem({
    request,
    evaluation,
    provenance: {
      kind: 'curated',
      fixtureId: fixture.id,
      authoringRevision: fixture.authoringRevision,
    },
  });
}

export function clearCandidateSpaceCache() {
  SPACE_CACHE.clear();
}

// These imports are kept at the end to make the exact Plan 02 boundary obvious in this module.
import {
  denominatorRelationship as denominatorRelationshipCore,
} from '../math/index.js';
