import {
  createFraction,
  validateCommonDenominator,
} from '../math/index.js';
import {
  deepFreeze,
  wireToFraction,
} from './schema.js';
import { getProfile } from './profiles.js';

export const REPRESENTATION_ELIGIBILITY = Object.freeze({
  ELIGIBLE: 'eligible',
  INELIGIBLE: 'ineligible',
  NOT_IN_PHASE_2: 'not-in-phase-2',
});

export const PHASE2_FRACTION_BAR_LIMITS = Object.freeze({
  maxDenominator: '30',
  maxScaleFactor: '12',
});

const MAX_DENOMINATOR = 30n;
const MAX_SCALE_FACTOR = 12n;

function exactIntegerFromWire(value, name) {
  const wire = value && typeof value === 'object'
    ? value
    : {
      kind: 'fraction',
      numerator: typeof value === 'bigint' ? value.toString() : value,
      denominator: '1',
    };
  const parsed = wireToFraction(wire);
  if (parsed.denominator !== 1n) {
    throw new TypeError(`${name} must be a whole-number wire value`);
  }
  return parsed.numerator;
}

function exactFractionFromWire(value, name) {
  try {
    const parsed = wireToFraction(value);
    return createFraction(parsed.numerator, parsed.denominator);
  } catch (error) {
    throw new TypeError(`${name} must be a fraction wire value: ${error.message}`);
  }
}

function pathResult({ left, right, targetDenominator, pathKind }) {
  const validation = validateCommonDenominator(targetDenominator, left, right);
  const target = validation.proposedDenominator ?? targetDenominator;
  const reasons = [...validation.reasons];

  if (validation.validity === 'valid') {
    if (target > MAX_DENOMINATOR) reasons.push('denominator-ceiling-exceeded');
    if (validation.scaleFactors.left > MAX_SCALE_FACTOR) reasons.push('left-scale-factor-ceiling-exceeded');
    if (validation.scaleFactors.right > MAX_SCALE_FACTOR) reasons.push('right-scale-factor-ceiling-exceeded');
  }

  const rendering = validation.validity === 'valid' && reasons.length === 0
    ? REPRESENTATION_ELIGIBILITY.ELIGIBLE
    : REPRESENTATION_ELIGIBILITY.INELIGIBLE;

  return {
    pathKind,
    mathematicalValidity: validation.validity,
    mathClassification: validation.classification,
    rendering,
    targetDenominator: target === null ? null : target.toString(),
    scaleFactors: validation.scaleFactors === null
      ? null
      : {
        left: validation.scaleFactors.left.toString(),
        right: validation.scaleFactors.right.toString(),
      },
    leastCommonDenominator: validation.leastCommonDenominator.toString(),
    reasons: [...new Set(reasons)],
  };
}

function instanceProfile(instance) {
  const profileId = instance?.request?.profileId;
  const profile = getProfile(profileId);
  return {
    id: profile.id,
    version: profile.version,
  };
}

function instanceOperands(instance) {
  return {
    left: exactFractionFromWire(instance?.operands?.left?.initialForm, 'left operand'),
    right: exactFractionFromWire(instance?.operands?.right?.initialForm, 'right operand'),
  };
}

function pathTarget(path, name) {
  return exactIntegerFromWire(path?.targetDenominator, `${name} target denominator`);
}

function authoredCoverage(instance, targetDenominator) {
  const target = targetDenominator.toString();
  if (instance.canonicalPath?.targetDenominator === target) return 'canonical';
  if (instance.alternatePaths?.some((path) => path.targetDenominator === target)) return 'authored-alternate';
  return 'outside-authored-coverage';
}

/**
 * Evaluate one exact path for the Phase 2 fraction-bar capability.
 * Mathematical validity comes from Plan 02; this function only adds the
 * rendering ceiling and emits JSON-safe evidence.
 */
export function evaluatePathEligibility({ left, right, targetDenominator, pathKind = 'proposed' }) {
  const result = pathResult({ left, right, targetDenominator, pathKind });
  return deepFreeze(result);
}

/**
 * Evaluate the canonical and authored alternate paths of a validated content
 * instance. Profile identity is deliberately read from the instance.
 */
export function evaluateInstanceEligibility(instance) {
  const profile = instanceProfile(instance);
  const { left, right } = instanceOperands(instance);
  const canonicalTarget = pathTarget(instance.canonicalPath, 'canonical');
  const canonical = pathResult({
    left,
    right,
    targetDenominator: canonicalTarget,
    pathKind: 'canonical',
  });
  const alternates = (instance.alternatePaths ?? []).map((path) => pathResult({
    left,
    right,
    targetDenominator: pathTarget(path, 'alternate'),
    pathKind: 'authored-alternate',
  }));
  const fractionBar = canonical.rendering === REPRESENTATION_ELIGIBILITY.ELIGIBLE
    ? REPRESENTATION_ELIGIBILITY.ELIGIBLE
    : REPRESENTATION_ELIGIBILITY.INELIGIBLE;

  return deepFreeze({
    profile,
    limits: PHASE2_FRACTION_BAR_LIMITS,
    eligibility: {
      fractionBar,
      numberLine: REPRESENTATION_ELIGIBILITY.NOT_IN_PHASE_2,
      symbolic: REPRESENTATION_ELIGIBILITY.ELIGIBLE,
    },
    alternateRepresentationRecommendation: fractionBar === REPRESENTATION_ELIGIBILITY.INELIGIBLE
      ? 'symbolic-continuation'
      : 'none',
    paths: {
      canonical,
      alternates,
    },
  });
}

/**
 * Evaluate a learner-proposed common denominator against an existing instance.
 * This does not mutate the instance and does not accept a caller-selected profile.
 */
export function evaluateProposedPathEligibility(instance, proposedDenominator) {
  const profile = instanceProfile(instance);
  const { left, right } = instanceOperands(instance);
  const target = typeof proposedDenominator === 'bigint'
    ? proposedDenominator
    : exactIntegerFromWire(proposedDenominator, 'proposed denominator');
  const path = pathResult({
    left,
    right,
    targetDenominator: target,
    pathKind: 'proposed',
  });

  return deepFreeze({
    profile,
    limits: PHASE2_FRACTION_BAR_LIMITS,
    ...path,
    authoredCoverage: authoredCoverage(instance, target),
    continuation: path.rendering === REPRESENTATION_ELIGIBILITY.INELIGIBLE
      ? 'symbolic'
      : 'episode-definition',
  });
}
