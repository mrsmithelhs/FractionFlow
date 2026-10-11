import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PRACTICE_TYPES } from '../../../../src/app/practice-types.js';
import { REGISTERED_CONDITIONS } from '../../../../src/app/conditions.js';
import {
  resolveAuthoredContent,
  resolveCuratedFixture,
} from '../../../../src/content/authored-content-catalog.js';
import { evaluateInstanceEligibility } from '../../../../src/content/eligibility.js';
import { buildCuratedProblem } from '../../../../src/content/generator.js';
import { validateProblemInstance } from '../../../../src/content/validation.js';
import { validateAuthoredTaskData } from '../../../../src/content/authored-task-data.js';
import { evaluateTaskPathClosure } from '../../../../src/interaction/path-closure.js';
import { equalFractions } from '../../../../src/math/fraction.js';
import { wireToForm } from '../../../../src/content/schema.js';
import { COMPACT_ADDITION_RECORDS } from '../../../../src/content/data/compact-addition-records.js';
import { MATERIALIZED_PLAN32_ADDITIONS } from '../../../../src/content/authored-problem-materializer.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const practiceType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
const compactRecordById = new Map(COMPACT_ADDITION_RECORDS.map((record) => [record.itemId, record]));

function buildInstance(fixture) {
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: {
      left: fixture.left,
      right: fixture.right,
      reviewedTransitions: fixture.reviewedTransitions ?? [],
    },
  });
}

function recordManifest(item, order) {
  const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
  if (!fixture) throw new Error(`Missing exact fixture identity: ${item.fixtureId}@${item.authoringRevision}`);
  const instance = buildInstance(fixture);
  const contentValidation = validateProblemInstance(instance);
  if (!contentValidation.valid) throw new Error(`Content validation failed: ${item.id}`);
  validateAuthoredTaskData(instance, item.targetDenominators);
  const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
  const eligibility = evaluateInstanceEligibility(instance);
  const eligiblePaths = [eligibility.paths.canonical, ...eligibility.paths.alternates]
    .filter((pathEntry) => pathEntry.rendering === 'eligible');
  const compactRecord = compactRecordById.get(item.id) ?? null;
  const paths = item.targetDenominators.map((target) => {
    const pathEntry = eligiblePaths.find((candidate) => candidate.targetDenominator === target);
    if (!pathEntry) throw new Error(`Missing eligible path ${item.id}/${target}`);
    const premise = authored.premiseChecks[target];
    const choices = authored.reflectionChoices[target];
    const correctSlots = choices.flatMap((choice, index) => (
      equalFractions(wireToForm(choice.form), wireToForm(instance.operands.left.initialForm))
        ? [index + 1]
        : []
    ));
    const closure = REGISTERED_CONDITIONS.map((condition) => {
      const result = evaluateTaskPathClosure({
        instance,
        targetDenominator: target,
        episodeDefinition: practiceType.episodeDefinition,
        activeCondition: condition.activeCondition,
      });
      return { conditionId: condition.id, available: result.available, reason: result.reason };
    });
    if (closure.some((result) => !result.available)) throw new Error(`Closure failed: ${item.id}/${target}`);
    return {
      targetDenominator: target,
      pathKind: pathEntry.pathKind,
      scaleFactors: pathEntry.scaleFactors,
      eligibility: pathEntry.rendering,
      closure,
      premise: {
        id: premise.id,
        presentedForm: premise.presentedForm,
        expectedResponse: equalFractions(
          wireToForm(premise.presentedForm),
          wireToForm(premise.sourceForm),
        ) ? 'yes' : 'no',
      },
      reflection: {
        choices: choices.map((choice) => ({ id: choice.id, form: choice.form })),
        correctPosition: correctSlots.length === 1 ? correctSlots[0] : null,
      },
      reviewedPolicy: compactRecord?.paths[target] ?? null,
    };
  });
  const swappedOperands = {
    left: fixture.right,
    right: fixture.left,
  };
  return {
    order,
    itemId: item.id,
    fixture: { id: fixture.id, authoringRevision: fixture.authoringRevision },
    taskData: {
      revision: authored.taskDataRevision,
      recipe: authored.recipe,
    },
    practiceSet: { id: practiceType.setId, revision: practiceType.setRevision },
    operands: { left: fixture.left, right: fixture.right },
    exactResult: instance.resultState.exactResult,
    rawResult: instance.resultState.canonicalRawResultForm,
    canonicalDenominator: instance.canonicalPath.targetDenominator,
    paths,
    swappedOrientationExcludedFromSet: swappedOperands,
  };
}

const items = practiceType.items.map(recordManifest);
const expandedAuthoredRecords = COMPACT_ADDITION_RECORDS.map((record) => {
  const materialized = MATERIALIZED_PLAN32_ADDITIONS.find((item) => item.itemId === record.itemId);
  return {
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    taskDataRevision: record.taskDataRevision,
    recipe: record.recipe,
    profileId: record.profileId,
    selector: record.selector,
    overlays: record.overlays,
    left: record.left,
    right: record.right,
    paths: Object.fromEntries(Object.keys(record.paths).map((target) => [target, {
      premise: materialized.premiseChecks[target],
      reflection: materialized.reflectionChoices[target],
    }])),
  };
});
const manifest = {
  schemaVersion: 'fractionflow.plan32-batch-manifest/v1',
  scope: 'approved static practice set and all admitted item/path content outcomes',
  practiceSet: { id: practiceType.setId, revision: practiceType.setRevision },
  recipe: { id: 'plan32-reviewed-addition', revision: '1' },
  taskDataRevision: 'plan32-task-data-v1',
  inventoryBoundary: {
    plan30VerifierArtifact: 'reports/development/plan-30-compact-content-authoring-investigation/results.json',
    candidates: 220,
    eligiblePathRows: 98,
    refusedPathRows: 342,
    orderedCandidatesWithTwoEligiblePaths: 18,
    swapClasses: 9,
    selectedOrderedProblems: 9,
    admittedPathRows: items.reduce((sum, item) => sum + item.paths.length, 0),
    reversedOrientationsExcluded: 9,
  },
  authoringBytes: {
    boundary: 'UTF-8 JSON.stringify byte counts for Plan 32 record data only. Both sides include the same item/fixture/revision/recipe/profile/selector/overlay/operand fields; compact side stores reviewed route rules, expanded side stores materialized premise and reflection forms. Both exclude fixture-builder runtime, exact result facts, app/set wrapper and whitespace.',
    compactRecords: Buffer.byteLength(JSON.stringify(COMPACT_ADDITION_RECORDS)),
    equivalentExplicitRecords: Buffer.byteLength(JSON.stringify(expandedAuthoredRecords)),
  },
  items,
};

mkdirSync(root, { recursive: true });
writeFileSync(path.join(root, 'batch-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Wrote ${items.length} items and ${manifest.inventoryBoundary.admittedPathRows} admitted paths to evidence/batch-manifest.json`);
