import { writeFile } from 'node:fs/promises';
import {
  addAtCommonDenominator,
  convertToDenominator,
  createFraction,
  equalFractions,
  simplifyFraction,
  subtractAtCommonDenominator,
  validateCommonDenominator,
  validateOperationResult,
} from '../../../src/math/index.js';
import { evaluateCandidate } from '../../../src/content/generator.js';
import { getProfile } from '../../../src/content/profiles.js';
import { evaluateProposedPathEligibility } from '../../../src/content/eligibility.js';

const mathematical = (wire) => createFraction(BigInt(wire.numerator), BigInt(wire.denominator));

const PROPOSED_BATCH = [
  // --- Recipe 1: unlike-subtraction.construct-equivalent ---
  {
    itemId: 'plan40-construct-half-fifth-10',
    recipeId: 'unlike-subtraction.construct-equivalent',
    selector: 'relatively-prime-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '1', denominator: '2' },
    right: { kind: 'fraction', numerator: '1', denominator: '5' },
    targetDenominator: '10',
    expectedRawDifference: { kind: 'fraction', numerator: '3', denominator: '10' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '3', denominator: '10' },
    requiredSides: ['left', 'right'],
    role: 'Relatively prime subtraction with irreducible difference (target 10)',
  },
  {
    itemId: 'plan40-construct-three-fourths-two-fifths-20',
    fixtureId: 'curated-relatively-prime-subtraction',
    fixtureAuthoringRevision: 'plan03-fixtures-v1',
    recipeId: 'unlike-subtraction.construct-equivalent',
    selector: 'relatively-prime-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '3', denominator: '4' },
    right: { kind: 'fraction', numerator: '2', denominator: '5' },
    targetDenominator: '20',
    expectedRawDifference: { kind: 'fraction', numerator: '7', denominator: '20' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '7', denominator: '20' },
    requiredSides: ['left', 'right'],
    role: 'Relatively prime subtraction with irreducible difference, reusing Plan 03 golden fixture (target 20)',
  },
  {
    itemId: 'plan40-construct-five-sixths-three-eighths-24',
    fixtureId: 'curated-shared-factor-subtraction',
    fixtureAuthoringRevision: 'plan03-fixtures-v1',
    recipeId: 'unlike-subtraction.construct-equivalent',
    selector: 'shared-factor-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '5', denominator: '6' },
    right: { kind: 'fraction', numerator: '3', denominator: '8' },
    targetDenominator: '24',
    expectedRawDifference: { kind: 'fraction', numerator: '11', denominator: '24' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '11', denominator: '24' },
    requiredSides: ['left', 'right'],
    role: 'Shared factor subtraction with irreducible difference, reusing Plan 03 golden fixture (target 24)',
  },

  // --- Recipe 2: unlike-subtraction.inspect-keep-repair ---
  {
    itemId: 'plan40-inspect-two-thirds-one-fourth-12',
    recipeId: 'unlike-subtraction.inspect-keep-repair',
    selector: 'relatively-prime-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '2', denominator: '3' },
    right: { kind: 'fraction', numerator: '1', denominator: '4' },
    targetDenominator: '12',
    expectedRawDifference: { kind: 'fraction', numerator: '5', denominator: '12' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '5', denominator: '12' },
    requiredSides: ['left', 'right'],
    stimulusId: 'plan40-stim-inspect-two-thirds-one-fourth-12',
    stimulusRevision: '1',
    candidates: {
      left: { kind: 'fraction', numerator: '5', denominator: '12' }, // invalid (true is 8/12)
      right: { kind: 'fraction', numerator: '3', denominator: '12' }, // valid
    },
    invalidSide: 'left',
    role: 'Relatively prime inspect recipe with left invalid candidate (target 12)',
  },
  {
    itemId: 'plan40-inspect-seven-tenths-one-fourth-20',
    recipeId: 'unlike-subtraction.inspect-keep-repair',
    selector: 'shared-factor-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '7', denominator: '10' },
    right: { kind: 'fraction', numerator: '1', denominator: '4' },
    targetDenominator: '20',
    expectedRawDifference: { kind: 'fraction', numerator: '9', denominator: '20' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '9', denominator: '20' },
    requiredSides: ['left', 'right'],
    stimulusId: 'plan40-stim-inspect-seven-tenths-one-fourth-20',
    stimulusRevision: '1',
    candidates: {
      left: { kind: 'fraction', numerator: '14', denominator: '20' }, // valid
      right: { kind: 'fraction', numerator: '7', denominator: '20' },  // invalid (true is 5/20)
    },
    invalidSide: 'right',
    role: 'Shared factor inspect recipe with right invalid candidate (target 20)',
  },
  {
    itemId: 'plan40-inspect-five-sixths-seven-tenths-30',
    recipeId: 'unlike-subtraction.inspect-keep-repair',
    selector: 'shared-factor-subtraction',
    overlays: ['reducible-result'],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '5', denominator: '6' },
    right: { kind: 'fraction', numerator: '7', denominator: '10' },
    targetDenominator: '30',
    expectedRawDifference: { kind: 'fraction', numerator: '4', denominator: '30' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '2', denominator: '15' },
    requiredSides: ['left', 'right'],
    stimulusId: 'plan40-stim-inspect-five-sixths-seven-tenths-30',
    stimulusRevision: '1',
    candidates: {
      left: { kind: 'fraction', numerator: '22', denominator: '30' }, // invalid (true is 25/30)
      right: { kind: 'fraction', numerator: '21', denominator: '30' }, // valid
    },
    invalidSide: 'left',
    role: 'Shared factor inspect recipe with reducible difference and left invalid candidate (target 30)',
  },

  // --- Recipe 3: unlike-subtraction.identify-side-construct ---
  {
    itemId: 'plan40-identify-five-sixths-one-third-6',
    fixtureId: 'curated-nested-subtraction-reducible',
    fixtureAuthoringRevision: 'plan03-fixtures-v1',
    recipeId: 'unlike-subtraction.identify-side-construct',
    selector: 'nested-denominator-subtraction',
    overlays: ['reducible-result'],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '5', denominator: '6' },
    right: { kind: 'fraction', numerator: '1', denominator: '3' },
    targetDenominator: '6',
    requiredSide: 'right',
    expectedRawDifference: { kind: 'fraction', numerator: '3', denominator: '6' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '1', denominator: '2' },
    requiredSides: ['right'],
    role: 'Nested subtraction with right side renaming and reducible difference, reusing Plan 03 golden fixture (target 6)',
  },
  {
    itemId: 'plan40-identify-one-half-one-eighth-8',
    recipeId: 'unlike-subtraction.identify-side-construct',
    selector: 'nested-denominator-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '1', denominator: '2' },
    right: { kind: 'fraction', numerator: '1', denominator: '8' },
    targetDenominator: '8',
    requiredSide: 'left',
    expectedRawDifference: { kind: 'fraction', numerator: '3', denominator: '8' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '3', denominator: '8' },
    requiredSides: ['left'],
    role: 'Nested subtraction with left side renaming and irreducible difference (target 8)',
  },
  {
    itemId: 'plan40-identify-two-thirds-five-twelfths-12',
    recipeId: 'unlike-subtraction.identify-side-construct',
    selector: 'nested-denominator-subtraction',
    overlays: ['reducible-result'],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '2', denominator: '3' },
    right: { kind: 'fraction', numerator: '5', denominator: '12' },
    targetDenominator: '12',
    requiredSide: 'left',
    expectedRawDifference: { kind: 'fraction', numerator: '3', denominator: '12' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '1', denominator: '4' },
    requiredSides: ['left'],
    role: 'Nested subtraction with left side renaming and reducible difference (target 12)',
  },
];

const PROPOSED_HOLDOUTS = [
  {
    itemId: 'plan40-holdout-construct-three-fifths-one-half-10',
    recipeId: 'unlike-subtraction.construct-equivalent',
    selector: 'relatively-prime-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '3', denominator: '5' },
    right: { kind: 'fraction', numerator: '1', denominator: '2' },
    targetDenominator: '10',
    expectedRawDifference: { kind: 'fraction', numerator: '1', denominator: '10' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '1', denominator: '10' },
    requiredSides: ['left', 'right'],
    role: 'Data-only holdout: construct recipe with relatively prime subtraction (target 10)',
  },
  {
    itemId: 'plan40-holdout-inspect-three-fourths-one-sixth-12',
    recipeId: 'unlike-subtraction.inspect-keep-repair',
    selector: 'shared-factor-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '3', denominator: '4' },
    right: { kind: 'fraction', numerator: '1', denominator: '6' },
    targetDenominator: '12',
    expectedRawDifference: { kind: 'fraction', numerator: '7', denominator: '12' },
    expectedSimplifiedDifference: { kind: 'fraction', numerator: '7', denominator: '12' },
    requiredSides: ['left', 'right'],
    stimulusId: 'plan40-stim-holdout-three-fourths-one-sixth-12',
    stimulusRevision: '1',
    candidates: {
      left: { kind: 'fraction', numerator: '9', denominator: '12' }, // valid
      right: { kind: 'fraction', numerator: '5', denominator: '12' }, // invalid (true is 2/12)
    },
    invalidSide: 'right',
    role: 'Data-only holdout: inspect recipe with shared factor subtraction and right invalid candidate (target 12)',
  },
];

const REFUSAL_CASES = [
  {
    id: 'refusal-negative-difference',
    selector: 'relatively-prime-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '1', denominator: '5' },
    right: { kind: 'fraction', numerator: '1', denominator: '2' },
    expectedRefusalReason: /negative-result|result-not-positive|nonnegative-result/,
    description: 'Subtrahend exceeds minuend resulting in negative difference',
  },
  {
    id: 'refusal-equal-operands-zero-in-curated-review',
    selector: 'nested-denominator-subtraction',
    overlays: [],
    profileId: 'curated-review',
    left: { kind: 'fraction', numerator: '2', denominator: '4' },
    right: { kind: 'fraction', numerator: '1', denominator: '2' },
    expectedRefusalReason: /result-not-positive|result-simplification-target-mismatch/,
    description: 'Equal value operands with zero difference rejected by curated-review positiveResult requirement',
  },
  {
    id: 'refusal-invalid-common-denominator',
    selector: 'relatively-prime-subtraction',
    left: { kind: 'fraction', numerator: '1', denominator: '2' },
    right: { kind: 'fraction', numerator: '1', denominator: '5' },
    targetDenominator: '15',
    expectedError: /target is not a common denominator|not-multiple/,
    description: 'Target denominator 15 is not divisible by left denominator 2',
  },
  {
    id: 'refusal-ceiling-exceeded',
    selector: 'relatively-prime-subtraction',
    left: { kind: 'fraction', numerator: '1', denominator: '4' },
    right: { kind: 'fraction', numerator: '1', denominator: '9' },
    targetDenominator: '36',
    expectedEligibility: 'ineligible',
    description: 'Target denominator 36 exceeds Phase 2 fraction bar limit of 30',
  },
  {
    id: 'refusal-inspect-all-valid-candidates',
    recipeId: 'unlike-subtraction.inspect-keep-repair',
    candidates: {
      left: { kind: 'fraction', numerator: '8', denominator: '12' }, // valid
      right: { kind: 'fraction', numerator: '3', denominator: '12' }, // valid
    },
    expectedInspectError: 'two valid candidates violates inspect stimulus requirement of exactly one valid and one invalid',
    description: 'Inspect candidate stimulus with two valid forms rejected',
  },
];

function probeItem(item) {
  const profile = getProfile(item.profileId);
  const target = BigInt(item.targetDenominator);
  const leftM = mathematical(item.left);
  const rightM = mathematical(item.right);

  // 1. Math core common denominator validation
  const cdValidation = validateCommonDenominator(target, leftM, rightM);
  if (cdValidation.validity !== 'valid') {
    throw new Error(`Item ${item.itemId}: invalid common denominator ${item.targetDenominator}`);
  }

  // 2. Conversion and subtraction truth
  const leftAtTarget = convertToDenominator(leftM, target);
  const rightAtTarget = convertToDenominator(rightM, target);
  const rawDiff = subtractAtCommonDenominator(leftM, rightM, target);

  if (rawDiff.numerator.toString() !== item.expectedRawDifference.numerator
    || rawDiff.denominator.toString() !== item.expectedRawDifference.denominator) {
    throw new Error(`Item ${item.itemId}: raw difference mismatch`);
  }

  const opResultValidation = validateOperationResult(
    rawDiff,
    leftAtTarget,
    rightAtTarget,
    'subtract',
    target,
  );
  if (opResultValidation.validity !== 'valid') {
    throw new Error(`Item ${item.itemId}: operation result validation failed: ${JSON.stringify(opResultValidation)}`);
  }

  // 3. Generator candidate evaluation under profile
  const candidate = {
    left: item.left,
    right: item.right,
  };
  const request = {
    selector: item.selector,
    operation: 'subtract',
    overlays: item.overlays,
    profile,
  };
  const evaluation = evaluateCandidate(candidate, request);
  const rejectionReasons = evaluation.reasons;
  if (!evaluation.accepted || rejectionReasons.length > 0) {
    throw new Error(`Item ${item.itemId}: candidate rejected by generator under profile ${item.profileId}: ${rejectionReasons.join(', ')}`);
  }

  // 4. Representation eligibility check
  const fakeInstance = {
    operands: {
      left: { initialForm: item.left },
      right: { initialForm: item.right },
    },
    request: {
      profileId: item.profileId,
    },
  };
  const eligibility = evaluateProposedPathEligibility(fakeInstance, item.targetDenominator);
  if (eligibility.rendering !== 'eligible') {
    throw new Error(`Item ${item.itemId}: ineligible for representation: ${eligibility.reasons.join(', ')}`);
  }

  // 5. Inspect candidate stimulus check (if applicable)
  let inspectStimulusStatus = null;
  if (item.recipeId === 'unlike-subtraction.inspect-keep-repair') {
    const leftEq = equalFractions(leftM, mathematical(item.candidates.left));
    const rightEq = equalFractions(rightM, mathematical(item.candidates.right));
    const validCount = (leftEq ? 1 : 0) + (rightEq ? 1 : 0);
    if (validCount !== 1) {
      throw new Error(`Item ${item.itemId}: inspect stimulus must have exactly 1 valid candidate, got ${validCount}`);
    }
    const detectedInvalidSide = leftEq ? 'right' : 'left';
    if (detectedInvalidSide !== item.invalidSide) {
      throw new Error(`Item ${item.itemId}: invalid side mismatch: expected ${item.invalidSide}, detected ${detectedInvalidSide}`);
    }
    inspectStimulusStatus = {
      validCount,
      invalidSide: detectedInvalidSide,
      leftCandidate: { form: item.candidates.left, valid: leftEq },
      rightCandidate: { form: item.candidates.right, valid: rightEq },
    };
  }

  // 6. Identify side check (if applicable)
  let identifySideStatus = null;
  if (item.recipeId === 'unlike-subtraction.identify-side-construct') {
    const leftNeedsRenaming = item.left.denominator !== item.targetDenominator;
    const rightNeedsRenaming = item.right.denominator !== item.targetDenominator;
    const renamingCount = (leftNeedsRenaming ? 1 : 0) + (rightNeedsRenaming ? 1 : 0);
    if (renamingCount !== 1) {
      throw new Error(`Item ${item.itemId}: identify recipe must require exactly 1 renaming, got ${renamingCount}`);
    }
    const detectedRequiredSide = leftNeedsRenaming ? 'left' : 'right';
    if (detectedRequiredSide !== item.requiredSide) {
      throw new Error(`Item ${item.itemId}: required side mismatch: expected ${item.requiredSide}, got ${detectedRequiredSide}`);
    }
    identifySideStatus = {
      requiredSide: detectedRequiredSide,
      untouchedDenominator: item[detectedRequiredSide === 'left' ? 'right' : 'left'].denominator,
    };
  }

  return {
    itemId: item.itemId,
    recipeId: item.recipeId,
    selector: item.selector,
    overlays: item.overlays,
    profileId: item.profileId,
    left: item.left,
    right: item.right,
    targetDenominator: item.targetDenominator,
    leftAtTarget: { numerator: leftAtTarget.numerator.toString(), denominator: leftAtTarget.denominator.toString() },
    rightAtTarget: { numerator: rightAtTarget.numerator.toString(), denominator: rightAtTarget.denominator.toString() },
    rawDifference: { numerator: rawDiff.numerator.toString(), denominator: rawDiff.denominator.toString() },
    differenceSimplified: {
      numerator: simplifyFraction(rawDiff).numerator.toString(),
      denominator: simplifyFraction(rawDiff).denominator.toString(),
    },
    isReducible: !opResultValidation.isSimplified,
    candidateEvaluationReasons: rejectionReasons,
    representationEligibility: eligibility.rendering,
    inspectStimulusStatus,
    identifySideStatus,
    role: item.role,
  };
}

const batchResults = PROPOSED_BATCH.map(probeItem);
const holdoutResults = PROPOSED_HOLDOUTS.map(probeItem);

// Probe refusal cases
const refusalResults = [];
for (const testCase of REFUSAL_CASES) {
  if (testCase.expectedRefusalReason) {
    const profile = getProfile(testCase.profileId);
    const candidate = { left: testCase.left, right: testCase.right };
    const request = {
      selector: testCase.selector,
      operation: 'subtract',
      overlays: testCase.overlays,
      profile,
    };
    const evaluation = evaluateCandidate(candidate, request);
    const reasons = evaluation.reasons;
    const matched = reasons.some((r) => testCase.expectedRefusalReason.test(r));
    refusalResults.push({
      id: testCase.id,
      reasons,
      matched,
      status: matched ? 'REFUSED_AS_EXPECTED' : 'UNEXPECTED_ACCEPTANCE',
      description: testCase.description,
    });
  } else if (testCase.targetDenominator === '15') {
    const validation = validateCommonDenominator(15n, mathematical(testCase.left), mathematical(testCase.right));
    refusalResults.push({
      id: testCase.id,
      validity: validation.validity,
      reasons: validation.reasons,
      status: validation.validity === 'invalid' ? 'REFUSED_AS_EXPECTED' : 'UNEXPECTED_VALID',
      description: testCase.description,
    });
  } else if (testCase.expectedEligibility) {
    const fakeInstance = {
      operands: {
        left: { initialForm: testCase.left },
        right: { initialForm: testCase.right },
      },
      request: { profileId: 'curated-review' },
    };
    const eligibility = evaluateProposedPathEligibility(fakeInstance, testCase.targetDenominator);
    refusalResults.push({
      id: testCase.id,
      rendering: eligibility.rendering,
      reasons: eligibility.reasons,
      status: eligibility.rendering === testCase.expectedEligibility ? 'REFUSED_AS_EXPECTED' : 'UNEXPECTED_ELIGIBLE',
      description: testCase.description,
    });
  } else if (testCase.expectedInspectError) {
    const leftEq = equalFractions(createFraction(2n, 3n), mathematical(testCase.candidates.left));
    const rightEq = equalFractions(createFraction(1n, 4n), mathematical(testCase.candidates.right));
    const count = (leftEq ? 1 : 0) + (rightEq ? 1 : 0);
    refusalResults.push({
      id: testCase.id,
      validCandidateCount: count,
      status: count !== 1 ? 'REFUSED_AS_EXPECTED' : 'UNEXPECTED_SINGLE_VALID',
      description: testCase.description,
    });
  }
}

// Compile target denominator coverage per recipe
const targetDenominatorsByRecipe = {};
for (const item of batchResults) {
  if (!targetDenominatorsByRecipe[item.recipeId]) {
    targetDenominatorsByRecipe[item.recipeId] = new Set();
  }
  targetDenominatorsByRecipe[item.recipeId].add(item.targetDenominator);
}
const coverageSummary = {
  batchItemCount: batchResults.length,
  holdoutItemCount: holdoutResults.length,
  refusalCaseCount: refusalResults.length,
  distinctTargetDenominatorsPerRecipe: Object.fromEntries(
    Object.entries(targetDenominatorsByRecipe).map(([recipe, set]) => [recipe, Array.from(set)]),
  ),
  recipesRepresented: Object.keys(targetDenominatorsByRecipe),
  allBatchItemsAdmittedUnderCuratedReview: batchResults.every((r) => r.candidateEvaluationReasons.length === 0),
  allBatchItemsEligibleForRepresentation: batchResults.every((r) => r.representationEligibility === 'eligible'),
  allHoldoutsAdmittedAndEligible: holdoutResults.every((r) => r.candidateEvaluationReasons.length === 0 && r.representationEligibility === 'eligible'),
  allRefusalCasesRefused: refusalResults.every((r) => r.status === 'REFUSED_AS_EXPECTED'),
};

const fullOutput = {
  probeDate: '2026-10-19',
  baselineCommit: 'c4b070ec1291f8633044e8274e0287e28ffaaf39',
  coverageSummary,
  batchResults,
  holdoutResults,
  refusalResults,
};

const outputPath = new URL('./requirement-0-probe-results.json', import.meta.url);
await writeFile(outputPath, JSON.stringify(fullOutput, null, 2) + '\n');

console.log('Requirement 0 probe succeeded!');
console.log(JSON.stringify(coverageSummary, null, 2));
