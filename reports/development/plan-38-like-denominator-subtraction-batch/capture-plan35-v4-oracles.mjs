import { writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { buildCuratedProblem } from '../../../src/content/generator.js';
import { resolveCuratedFixture } from '../../../src/content/authored-content-catalog.js';
import {
  PLAN35_ADDITION_RECIPE_RECORDS,
  PLAN35_RECIPE_IDS,
  findPlan35RecipeAssociationSet,
} from '../../../src/content/data/plan35-addition-recipe-records.js';
import { resolvePlan35AdditionRecipeContext } from '../../../src/content/plan35-addition-recipe-task.js';
import {
  addAtCommonDenominator,
  convertToDenominator,
  equalFractions,
} from '../../../src/math/index.js';
import { applyIntent, createEpisode } from '../../../src/interaction/episode.js';
import { PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION } from '../../../src/interaction/episode-definition.js';
import {
  createReplayEnvelope,
  replayEpisode,
  REPLAY_V4_SCHEMA_VERSION,
} from '../../../src/interaction/replay.js';
import { HIGH_SUPPORT_CONFIGURATION } from '../../../src/interaction/support.js';

const mathematical = (value) => ({
  kind: 'fraction',
  numerator: BigInt(value.numerator),
  denominator: BigInt(value.denominator),
});

function instanceFor(record) {
  const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] },
  });
}

function start(record, support = HIGH_SUPPORT_CONFIGURATION) {
  const instance = instanceFor(record);
  const association = findPlan35RecipeAssociationSet(record.itemId);
  if (!association) throw new Error(`missing unique registered association for ${record.itemId}`);
  const taskContext = resolvePlan35AdditionRecipeContext(instance, record.itemId, {
    practiceSetId: association.id,
    practiceSetRevision: association.revision,
  });
  return {
    instance,
    taskContext,
    state: createEpisode({
      instance,
      episodeDefinition: PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION,
      taskContext,
      support,
    }),
  };
}

function correctOperandForm(instance, side, targetDenominator) {
  const source = instance.operands[side].initialForm;
  const converted = convertToDenominator(mathematical(source), BigInt(targetDenominator));
  return {
    kind: 'fraction',
    numerator: converted.numerator.toString(),
    denominator: converted.denominator.toString(),
  };
}

function resultForm(instance, targetDenominator) {
  const target = BigInt(targetDenominator);
  const left = convertToDenominator(mathematical(instance.operands.left.initialForm), target);
  const right = convertToDenominator(mathematical(instance.operands.right.initialForm), target);
  const sum = addAtCommonDenominator(
    mathematical(instance.operands.left.initialForm),
    mathematical(instance.operands.right.initialForm),
    target,
  );
  return {
    kind: 'fraction',
    numerator: sum.numerator.toString(),
    denominator: sum.denominator.toString(),
  };
}

function complete(record, support = HIGH_SUPPORT_CONFIGURATION) {
  const built = start(record, support);
  let state = applyIntent(built.state, { type: 'acknowledge-encounter' });
  const identify = built.taskContext.patternId === PLAN35_RECIPE_IDS.identify;
  if (identify) {
    state = applyIntent(state, {
      type: 'select-renaming-side',
      side: built.taskContext.requiredSides[0],
    });
  }
  for (const side of built.taskContext.requiredSides) {
    if (built.taskContext.patternId === PLAN35_RECIPE_IDS.inspect) {
      const candidate = built.taskContext.candidates[side];
      const equivalent = equalFractions(
        mathematical(candidate),
        mathematical(built.instance.operands[side].initialForm),
      );
      state = applyIntent(
        state,
        equivalent
          ? { type: 'keep-inspected-form' }
          : {
              type: 'repair-inspected-form',
              numerator: correctOperandForm(
                built.instance,
                side,
                built.taskContext.targetDenominator,
              ).numerator,
            },
      );
    } else {
      state = applyIntent(state, {
        type: 'submit-equivalent-form',
        proposed: correctOperandForm(
          built.instance,
          side,
          built.taskContext.targetDenominator,
        ),
      });
    }
  }
  state = applyIntent(state, {
    type: 'submit-operation-result',
    proposed: resultForm(built.instance, built.taskContext.targetDenominator),
  });
  state = applyIntent(state, { type: 'finish-compact-episode' });
  return { ...built, state };
}

// Select representative cases covering construct, inspect, and identify (both left and right sides)
const selectedItemIds = [
  'two-thirds-plus-one-fourth',           // construct
  'one-half-plus-one-third',              // inspect
  'nested-one-half-plus-three-eighths',   // identify (left side required)
  'nested-three-eighths-plus-one-half',   // identify (right side required)
];

const cases = [];

for (const itemId of selectedItemIds) {
  const record = PLAN35_ADDITION_RECIPE_RECORDS.find((r) => r.itemId === itemId);
  if (!record) throw new Error(`Could not find record for ${itemId}`);

  // Initial phase
  const initialBuilt = start(record);
  const initialEnvelope = createReplayEnvelope(initialBuilt.state);
  if (initialEnvelope.schemaVersion !== REPLAY_V4_SCHEMA_VERSION) {
    throw new Error(`Expected v4 schema version, got ${initialEnvelope.schemaVersion}`);
  }
  const initialReplayed = replayEpisode(initialEnvelope);
  if (JSON.stringify(initialReplayed) !== JSON.stringify(initialBuilt.state)) {
    throw new Error(`Initial replay roundtrip failed for ${itemId}`);
  }

  cases.push({
    recipeId: record.recipeId,
    patternRevision: record.patternRevision,
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    phase: 'initial',
    envelope: initialEnvelope,
    expectedState: initialBuilt.state,
  });

  // Completed phase
  const completedBuilt = complete(record);
  const completedEnvelope = createReplayEnvelope(completedBuilt.state);
  if (completedEnvelope.schemaVersion !== REPLAY_V4_SCHEMA_VERSION) {
    throw new Error(`Expected v4 schema version, got ${completedEnvelope.schemaVersion}`);
  }
  const completedReplayed = replayEpisode(completedEnvelope);
  if (JSON.stringify(completedReplayed) !== JSON.stringify(completedBuilt.state)) {
    throw new Error(`Completed replay roundtrip failed for ${itemId}`);
  }

  cases.push({
    recipeId: record.recipeId,
    patternRevision: record.patternRevision,
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    phase: 'completed',
    envelope: completedEnvelope,
    expectedState: completedBuilt.state,
  });
}

const oracleDocument = {
  oracleId: 'plan35-v4-replay-baseline-before-plan38',
  capturedFromHead: '982bb8f52ad4274f35ae71edc8234adeed87fc22',
  capturedUsingCurrentReplayV4: REPLAY_V4_SCHEMA_VERSION,
  support: 'high support',
  cases,
};

const targetPath = new URL('../../../tests/fixtures/plan35-v4-replay-oracles.json', import.meta.url);
await writeFile(targetPath, JSON.stringify(oracleDocument, null, 2) + '\n');

console.log(`Successfully captured ${cases.length} Plan 35 v4 replay oracle cases.`);
