import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { PHASE1_GOLDEN_CASES } from '../../../src/content/data/phase1-golden-cases.js';
import { premiseCheckForInstance } from '../../../src/content/data/premise-checks.js';
import { reflectionChoicesForInstance } from '../../../src/content/data/reflection-choices.js';
import {
  evaluateInstanceEligibility,
  validateAuthoredMatchingChoices,
  validateAuthoredPremiseCase,
  validateAuthoredTaskData,
} from '../../../src/content/index.js';
import { validateProblemInstance } from '../../../src/content/validation.js';
import {
  buildCuratedProblem,
  inspectCandidateSpace,
} from '../../../src/content/generator.js';
import { fractionToWire, mathematicalInstanceKey, wireToForm } from '../../../src/content/schema.js';
import { convertToDenominator, equalFractions } from '../../../src/math/fraction.js';
import { PRACTICE_TYPES } from '../../../src/app/practice-types.js';
import { REGISTERED_CONDITIONS } from '../../../src/app/conditions.js';
import { getEpisodeDefinition } from '../../../src/interaction/episode-definition.js';
import { evaluateTaskPathClosure } from '../../../src/interaction/path-closure.js';

const BOUNDS = Object.freeze({
  selector: 'relatively-prime-addition',
  overlays: [],
  profileId: 'curated-review',
  enumeration: 'entire inspectCandidateSpace eligibleCandidates array, stable source order',
  maxFractionBarDenominator: 30,
  maxScaleFactor: 12,
  taskRequirement: 'two eligible common-unit paths with one yes and one no premise outcome',
});

const EXPERIMENT_REVISION = 'plan30-experimental-recipe-v1';
const RECIPE = Object.freeze({
  id: EXPERIMENT_REVISION,
  premise: 'for this experiment only, select one incorrect route by a stable hash of item identity; derive its off-by-one numerator and exact truth with the math core',
  matching: 'derive the equivalent left-operand form exactly; use the nearest available distinct in-range numerators as distractors',
  correctChoicePosition: 'derive a deterministic position from item identity and denominator, independent of enumeration order',
  responseIds: 'stable experiment-only IDs from recipe revision, candidate identity, denominator and option slot',
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hash(text) {
  return createHash('sha256').update(text).digest('hex');
}

function fractionForm(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

function stableFixtureId(instance) {
  return `plan30-proposal-${hash(mathematicalInstanceKey(instance)).slice(0, 12)}`;
}

function authoredForPath(instance, targetDenominator, incorrectPath) {
  const target = BigInt(targetDenominator);
  const sourceForm = instance.operands.left.initialForm;
  const exact = fractionToWire(convertToDenominator(wireToForm(sourceForm), target));
  const isIncorrectRoute = incorrectPath === targetDenominator;
  let presentedForm = exact;
  if (isIncorrectRoute) {
    const correctNumerator = BigInt(exact.numerator);
    const wrongNumerator = correctNumerator < target
      ? correctNumerator + 1n
      : correctNumerator - 1n;
    presentedForm = fractionForm(wrongNumerator, target);
  }
  const equivalent = equalFractions(wireToForm(sourceForm), wireToForm(presentedForm));
  const premise = {
    id: `${EXPERIMENT_REVISION}:${stableFixtureId(instance)}:${targetDenominator}:premise`,
    fixtureId: stableFixtureId(instance),
    targetDenominator,
    sourceForm,
    presentedForm,
    isEquivalent: equivalent,
    expectedResponse: equivalent ? 'yes' : 'no',
    distractorType: equivalent ? null : 'off-by-one-numerator',
  };

  const targetNumber = Number(target);
  const correctNumerator = Number(exact.numerator);
  const distractors = [];
  for (let distance = 1; distractors.length < 2 && distance <= targetNumber; distance += 1) {
    for (const value of [correctNumerator - distance, correctNumerator + distance]) {
      if (value < 0 || value > targetNumber || value === correctNumerator || distractors.includes(value)) continue;
      distractors.push(value);
      if (distractors.length === 2) break;
    }
  }
  assert(distractors.length === 2, `cannot materialize two distractors for ${targetDenominator}`);
  const correctSlot = Number.parseInt(hash(`${stableFixtureId(instance)}:${targetDenominator}:correct-slot`).slice(0, 8), 16) % 3;
  const formBySlot = [];
  let distractorCursor = 0;
  for (let slot = 0; slot < 3; slot += 1) {
    formBySlot.push(slot === correctSlot
      ? exact
      : fractionForm(distractors[distractorCursor++], target));
  }
  const choices = formBySlot.map((form, slot) => ({
    id: `${EXPERIMENT_REVISION}:${stableFixtureId(instance)}:${targetDenominator}:choice-${slot}`,
    form,
  }));
  return { premise, choices };
}

function rejected(label, action, expectedText) {
  try {
    action();
  } catch (error) {
    assert(error.message.includes(expectedText), `${label}: unexpected rejection: ${error.message}`);
    return { label, rejected: true, message: error.message };
  }
  throw new Error(`${label}: expected rejection did not occur`);
}

function registeredBaseline() {
  const practiceType = PRACTICE_TYPES.find((candidate) => candidate.id === 'sum-under-one');
  const definition = getEpisodeDefinition(
    practiceType.items[0].episodeDefinitionId,
    practiceType.items[0].episodeDefinitionRevision,
  );
  const items = practiceType.items.map((item) => {
    const fixture = PHASE1_GOLDEN_CASES.find((candidate) => (
      candidate.id === item.fixtureId && candidate.authoringRevision === item.authoringRevision
    ));
    assert(fixture, `registered fixture not found: ${item.fixtureId}`);
    const instance = buildCuratedProblem({
      fixture,
      selector: fixture.selector,
      overlays: fixture.overlays,
      profileId: fixture.profileId,
      candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: fixture.reviewedTransitions ?? [] },
    });
    const mathValidation = validateProblemInstance(instance);
    assert(mathValidation.valid, `${item.fixtureId}: core validation failed`);
    validateAuthoredTaskData(instance, item.targetDenominators);
    const closures = [];
    for (const condition of REGISTERED_CONDITIONS) {
      for (const targetDenominator of item.targetDenominators) {
        const closure = evaluateTaskPathClosure({
          instance,
          targetDenominator,
          episodeDefinition: definition,
          activeCondition: condition.activeCondition,
        });
        closures.push({ conditionId: condition.id, targetDenominator, available: closure.available, reason: closure.reason });
        assert(closure.available, `${item.fixtureId}/${targetDenominator}/${condition.id}: closure unavailable`);
      }
    }
    return {
      itemId: item.id,
      fixtureId: item.fixtureId,
      authoringRevision: item.authoringRevision,
      targetDenominators: item.targetDenominators,
      problemId: instance.id,
      exactValidation: mathValidation.valid,
      authoredTaskDataValidation: 'pass',
      pathClosureCount: closures.length,
      pathClosures: closures,
    };
  });
  return { admittedItems: items.length, items };
}

const space = inspectCandidateSpace(BOUNDS);
const orderedKeys = new Set();
const unorderedKeys = new Set();
const candidateRows = [];
const samples = [];
const totals = {
  rawEligibleCandidatesEnumerated: space.eligibleCandidates.length,
  coreProblemValidationPass: 0,
  coreProblemValidationFail: 0,
  pathsConsidered: 0,
  representationEligiblePaths: 0,
  representationRefusedPaths: 0,
  experimentalItemsWithTwoEligiblePaths: 0,
  candidatesWithZeroEligiblePaths: 0,
  candidatesWithOneEligiblePath: 0,
  experimentalItemsRefusedForPathCoverage: 0,
  authoredRouteRecordsValidated: 0,
  premiseTruthPass: 0,
  matchingChoicePass: 0,
};

for (let candidateOrdinal = 0; candidateOrdinal < space.eligibleCandidates.length; candidateOrdinal += 1) {
  const candidate = space.eligibleCandidates[candidateOrdinal];
  const fixture = {
    id: `plan30-unregistered-${candidateOrdinal}`,
    authoringRevision: EXPERIMENT_REVISION,
    profileId: BOUNDS.profileId,
    selector: BOUNDS.selector,
    overlays: [...BOUNDS.overlays],
    left: candidate.left,
    right: candidate.right,
  };
  let instance = buildCuratedProblem({
    fixture,
    selector: BOUNDS.selector,
    overlays: BOUNDS.overlays,
    profileId: BOUNDS.profileId,
    candidate: { ...candidate, reviewedTransitions: [] },
  });
  fixture.id = stableFixtureId(instance);
  instance = buildCuratedProblem({
    fixture,
    selector: BOUNDS.selector,
    overlays: BOUNDS.overlays,
    profileId: BOUNDS.profileId,
    candidate: { ...candidate, reviewedTransitions: [] },
  });
  const key = mathematicalInstanceKey(instance);
  orderedKeys.add(key);
  const left = instance.operands.left.initialForm;
  const right = instance.operands.right.initialForm;
  const swapKey = JSON.stringify([BOUNDS.selector, BOUNDS.overlays, BOUNDS.profileId,
    ...[`${left.numerator}/${left.denominator}`, `${right.numerator}/${right.denominator}`].sort()]);
  unorderedKeys.add(swapKey);

  const validation = validateProblemInstance(instance);
  if (validation.valid) totals.coreProblemValidationPass += 1;
  else totals.coreProblemValidationFail += 1;
  assert(validation.valid, `existing exact/content validation failed for candidate ${candidateOrdinal}`);

  const eligibility = evaluateInstanceEligibility(instance);
  const paths = [eligibility.paths.canonical, ...eligibility.paths.alternates];
  const eligiblePaths = paths.filter((path) => path.rendering === 'eligible');
  if (eligiblePaths.length === 0) totals.candidatesWithZeroEligiblePaths += 1;
  if (eligiblePaths.length === 1) totals.candidatesWithOneEligiblePath += 1;
  totals.pathsConsidered += paths.length;
  totals.representationEligiblePaths += eligiblePaths.length;
  totals.representationRefusedPaths += paths.length - eligiblePaths.length;
  const candidateRow = {
    ordinal: candidateOrdinal,
    fixtureId: stableFixtureId(instance),
    authoringRevision: EXPERIMENT_REVISION,
    operands: { left, right },
    exactRawResult: instance.classification.result.rawResult,
    paths: paths.map((path) => ({ targetDenominator: path.targetDenominator, rendering: path.rendering, reasons: path.reasons })),
    experimentalAuthoredTargets: [],
    compactRecipeInput: null,
    experimentalAuthoredValidation: eligiblePaths.length >= 2 ? 'pending' : 'refused-fewer-than-two-eligible-paths',
  };

  if (eligiblePaths.length >= 2) {
    const targets = eligiblePaths.map((path) => path.targetDenominator).sort((left, right) => Number(left) - Number(right));
    const incorrectTargetIndex = Number.parseInt(hash(`${candidateRow.fixtureId}:incorrect-premise-route`).slice(0, 8), 16) % targets.length;
    const intentionallyIncorrectTarget = targets[incorrectTargetIndex];
    candidateRow.compactRecipeInput = {
      fixtureId: candidateRow.fixtureId,
      authoringRevision: EXPERIMENT_REVISION,
      operands: candidateRow.operands,
      intentionallyIncorrectPremiseDenominator: intentionallyIncorrectTarget,
    };
    for (const targetDenominator of targets) {
      const data = authoredForPath(
        instance,
        targetDenominator,
        intentionallyIncorrectTarget,
      );
      const answer = validateAuthoredPremiseCase(instance, data.premise, targetDenominator);
      validateAuthoredMatchingChoices(instance.operands.left.initialForm, data.choices, targetDenominator);
      totals.authoredRouteRecordsValidated += 1;
      totals.premiseTruthPass += 1;
      totals.matchingChoicePass += 1;
      candidateRow.experimentalAuthoredTargets.push({
        targetDenominator,
        premiseId: data.premise.id,
        premiseOutcome: answer,
        choices: data.choices,
      });
    }
    assert(new Set(candidateRow.experimentalAuthoredTargets.map((row) => row.targetDenominator)).size === targets.length,
      `duplicate recipe route for candidate ${candidateOrdinal}`);
    assert(new Set(candidateRow.experimentalAuthoredTargets.map((row) => row.premiseOutcome)).size === 2,
      `recipe did not materialize both premise outcomes for candidate ${candidateOrdinal}`);
    candidateRow.experimentalAuthoredValidation = 'pass-components-all-eligible-paths';
    totals.experimentalItemsWithTwoEligiblePaths += 1;
    if (samples.length < 3) samples.push(candidateRow);
  } else {
    totals.experimentalItemsRefusedForPathCoverage += 1;
  }
  candidateRows.push(candidateRow);
}

const existingFixture = PHASE1_GOLDEN_CASES.find((fixture) => fixture.id === PRACTICE_TYPES[0].items[0].fixtureId);
const existingInstance = buildCuratedProblem({
  fixture: existingFixture,
  selector: existingFixture.selector,
  overlays: existingFixture.overlays,
  profileId: existingFixture.profileId,
  candidate: { left: existingFixture.left, right: existingFixture.right, reviewedTransitions: [] },
});
const existingDenominator = PRACTICE_TYPES[0].items[0].targetDenominators[0];
const existingPremise = premiseCheckForInstance(existingInstance, existingDenominator);
const existingChoices = reflectionChoicesForInstance(existingInstance, existingDenominator);
const wrongTruth = rejected('wrong premise truth', () => validateAuthoredPremiseCase(existingInstance, {
  ...existingPremise,
  isEquivalent: !existingPremise.isEquivalent,
  expectedResponse: existingPremise.expectedResponse === 'yes' ? 'no' : 'yes',
}, existingDenominator), 'premise truth mismatch');
const duplicateIdChoices = existingChoices.map((choice) => ({ ...choice }));
duplicateIdChoices[1].id = duplicateIdChoices[0].id;
const duplicateIds = rejected('duplicate choice IDs', () => validateAuthoredMatchingChoices(
  existingInstance.operands.left.initialForm,
  duplicateIdChoices,
  existingDenominator,
), 'matching choice identity is invalid');
const duplicateEquivalentChoices = existingChoices.map((choice) => ({ ...choice }));
duplicateEquivalentChoices[2].form = { ...duplicateEquivalentChoices[0].form };
const duplicateAnswers = rejected('two equivalent answer forms', () => validateAuthoredMatchingChoices(
  existingInstance.operands.left.initialForm,
  duplicateEquivalentChoices,
  existingDenominator,
), 'exactly one equivalent form');
const repeatedDistractorChoices = existingChoices.map((choice) => ({ ...choice }));
repeatedDistractorChoices[2].form = { ...repeatedDistractorChoices[1].form };
const repeatedDistractorAccepted = validateAuthoredMatchingChoices(
  existingInstance.operands.left.initialForm,
  repeatedDistractorChoices,
  existingDenominator,
);
const incompletePaths = rejected('omitted eligible authored path', () => validateAuthoredTaskData(
  existingInstance,
  PRACTICE_TYPES[0].items[0].targetDenominators.slice(0, 1),
), 'eligible path identity mismatch');
const missingPathRecord = rejected('missing authored record for an eligible denominator', () => validateAuthoredTaskData(
  { ...existingInstance, provenance: { ...existingInstance.provenance, fixtureId: 'plan30-missing-path-probe' } },
  PRACTICE_TYPES[0].items[0].targetDenominators,
), 'missing premise data');

const fullyAuthoredRows = candidateRows.filter((candidate) => candidate.experimentalAuthoredValidation === 'pass-components-all-eligible-paths');
const explicitDataRecords = fullyAuthoredRows.map((candidate) => ({
  fixtureId: candidate.fixtureId,
  authoringRevision: EXPERIMENT_REVISION,
  selector: BOUNDS.selector,
  overlays: BOUNDS.overlays,
  profileId: BOUNDS.profileId,
  operands: candidate.operands,
  paths: candidate.experimentalAuthoredTargets,
}));
const compactRecipeInputs = fullyAuthoredRows.map((candidate) => candidate.compactRecipeInput);
const authoringStorageComparison = {
  itemsCompared: fullyAuthoredRows.length,
  pathRecordsCompared: totals.authoredRouteRecordsValidated,
  explicitJsonBytes: Buffer.byteLength(JSON.stringify(explicitDataRecords), 'utf8'),
  compactItemJsonBytes: Buffer.byteLength(JSON.stringify(compactRecipeInputs), 'utf8'),
  recipeDefinitionJsonBytes: Buffer.byteLength(JSON.stringify(RECIPE), 'utf8'),
  compactIncludingOneRecipeDefinitionJsonBytes: Buffer.byteLength(JSON.stringify(compactRecipeInputs), 'utf8')
    + Buffer.byteLength(JSON.stringify(RECIPE), 'utf8'),
  explicitRouteFieldGroups: totals.authoredRouteRecordsValidated,
  compactItemInputGroups: compactRecipeInputs.length,
  scope: 'serialized JSON byte counts for this experiment only; not a measurement of human review time, source integration cost or learner value',
};

const result = {
  experiment: 'FractionFlow Plan 30 compact content authoring investigation',
  experimentVersion: '1',
  bounds: BOUNDS,
  recipe: RECIPE,
  counts: {
    ...totals,
    uniqueOrderedProblems: orderedKeys.size,
    swapEquivalentClasses: unorderedKeys.size,
    swapEquivalentOrderedPairs: orderedKeys.size - unorderedKeys.size,
    allEnumeratedCandidatesRefusedForFullTwoPathTaskRequirement: totals.experimentalItemsRefusedForPathCoverage,
  },
  authoringStorageComparison,
  existingRegisteredBaseline: registeredBaseline(),
  corruptionControls: {
    wrongAuthoredTruth: wrongTruth,
    duplicateChoiceIds: duplicateIds,
    duplicateEquivalentAnswers: duplicateAnswers,
    repeatedNonEquivalentDistractorForm: {
      rejected: false,
      existingValidatorAccepted: repeatedDistractorAccepted,
      gap: 'distinct IDs with the same non-equivalent displayed form are not rejected by the current exactly-one-equivalent check',
    },
    incompleteEligiblePathList: incompletePaths,
    missingAuthoredPathRecord: missingPathRecord,
  },
  proposedExplicitRecords: samples.map((candidate) => ({
    fixtureId: candidate.fixtureId,
    authoringRevision: candidate.authoringRevision,
    selector: BOUNDS.selector,
    overlays: BOUNDS.overlays,
    profileId: BOUNDS.profileId,
    operands: candidate.operands,
    authoredPathRecords: candidate.experimentalAuthoredTargets,
  })),
  proposedCompactRecipeInputs: compactRecipeInputs.slice(0, 3),
  note: 'These are unregistered experiment identities. Component authored-data checks passed for each recipe-generated route; no new record was discoverable through production authored-data accessors or app admission.',
};

assert(totals.coreProblemValidationPass === space.eligibleCandidates.length, 'candidate exact/content pass count mismatch');
assert(totals.coreProblemValidationFail === 0, 'candidate exact/content validation failures occurred');
assert(totals.authoredRouteRecordsValidated === totals.experimentalItemsWithTwoEligiblePaths * 2,
  'not every full-path experimental item validated exactly two route records');
assert(samples.length === Math.min(3, totals.experimentalItemsWithTwoEligiblePaths), 'expected three sample records when available');

const outPath = fileURLToPath(new URL('./results.json', import.meta.url));
const serializedResults = `${JSON.stringify(result, null, 2)}\n`;
const requestedMode = process.argv[2] ?? '--verify';
assert(process.argv.length <= 3 && ['--verify', '--write-results'].includes(requestedMode),
  'usage: node experiment.mjs [--verify|--write-results]');
if (requestedMode === '--write-results') {
  writeFileSync(outPath, serializedResults, 'utf8');
} else {
  const committedResults = readFileSync(outPath, 'utf8');
  assert(committedResults === serializedResults,
    'reproduced results differ from results.json; inspect a diff before using --write-results');
}
console.log(JSON.stringify({
  output: requestedMode === '--verify' ? 'results.json verified unchanged' : 'results.json regenerated',
  counts: result.counts,
  corruptionControls: result.corruptionControls,
}, null, 2));
