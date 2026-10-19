import { writeFile } from 'node:fs/promises';
import { resolveAuthoredContent } from '../../../src/content/authored-content-catalog.js';
import {
  PLAN36_SUBTRACTION_RECORDS,
  findPlan36SubtractionAssociationSet,
} from '../../../src/content/data/plan36-like-denominator-subtraction-records.js';
import {
  resolvePlan36LikeDenominatorSubtractionContext,
} from '../../../src/content/plan36-like-denominator-takeaway-task.js';
import { applyIntent, createEpisode } from '../../../src/interaction/episode.js';
import {
  PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION,
} from '../../../src/interaction/episode-definition.js';
import {
  createReplayEnvelope,
  replayEpisode,
  REPLAY_V5_SCHEMA_VERSION,
} from '../../../src/interaction/replay.js';
import { HIGH_SUPPORT_CONFIGURATION } from '../../../src/interaction/support.js';

function start(record, support = HIGH_SUPPORT_CONFIGURATION) {
  const resolved = resolveAuthoredContent(record.fixtureId, record.authoringRevision);
  if (!resolved) throw new Error(`unresolved authored content for ${record.itemId}`);
  const association = findPlan36SubtractionAssociationSet(record.itemId);
  if (!association) throw new Error(`missing association set for ${record.itemId}`);
  const taskContext = resolvePlan36LikeDenominatorSubtractionContext(
    resolved.instance,
    record.itemId,
    {
      practiceSetId: association.id,
      practiceSetRevision: association.revision,
    },
  );
  return {
    instance: resolved.instance,
    taskContext,
    state: createEpisode({
      instance: resolved.instance,
      episodeDefinition: PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION,
      taskContext,
      support,
    }),
  };
}

function rawDifferenceFraction(record) {
  const left = Number(record.leftNumerator);
  const right = Number(record.rightNumerator);
  return {
    kind: 'fraction',
    numerator: String(left - right),
    denominator: record.denominator,
  };
}

function complete(record, support = HIGH_SUPPORT_CONFIGURATION) {
  const built = start(record, support);
  let state = applyIntent(built.state, { type: 'mark-subtrahend-amount' });
  state = applyIntent(state, {
    type: 'submit-subtraction-result',
    proposed: rawDifferenceFraction(record),
  });
  state = applyIntent(state, { type: 'finish-compact-episode' });
  return { ...built, state };
}

// Select representative cases covering diverse subtraction types:
// 1. Moderate positive remainder (5/8 - 2/8 = 3/8)
// 2. Reducible positive remainder (7/10 - 3/10 = 4/10)
// 3. Equal-operands zero boundary (6/9 - 6/9 = 0/9)
// 4. One-part remainder (5/6 - 4/6 = 1/6)
// 5. Near-whole reducible remainder (7/8 - 1/8 = 6/8)
// In fact, capture all 8 vetted Plan 38 records to guarantee full baseline oracle coverage!
const cases = [];

for (const record of PLAN36_SUBTRACTION_RECORDS) {
  // Initial phase
  const initialBuilt = start(record);
  const initialEnvelope = createReplayEnvelope(initialBuilt.state);
  if (initialEnvelope.schemaVersion !== REPLAY_V5_SCHEMA_VERSION) {
    throw new Error(`Expected v5 schema version, got ${initialEnvelope.schemaVersion}`);
  }
  const initialReplayed = replayEpisode(initialEnvelope);
  if (JSON.stringify(initialReplayed) !== JSON.stringify(initialBuilt.state)) {
    throw new Error(`Initial replay roundtrip failed for ${record.itemId}`);
  }

  cases.push({
    recipeId: record.recipe.id,
    recipeRevision: record.recipe.revision,
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    phase: 'initial',
    envelope: initialEnvelope,
    expectedState: initialBuilt.state,
  });

  // Completed phase
  const completedBuilt = complete(record);
  const completedEnvelope = createReplayEnvelope(completedBuilt.state);
  if (completedEnvelope.schemaVersion !== REPLAY_V5_SCHEMA_VERSION) {
    throw new Error(`Expected v5 schema version, got ${completedEnvelope.schemaVersion}`);
  }
  const completedReplayed = replayEpisode(completedEnvelope);
  if (JSON.stringify(completedReplayed) !== JSON.stringify(completedBuilt.state)) {
    throw new Error(`Completed replay roundtrip failed for ${record.itemId}`);
  }

  cases.push({
    recipeId: record.recipe.id,
    recipeRevision: record.recipe.revision,
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    phase: 'completed',
    envelope: completedEnvelope,
    expectedState: completedBuilt.state,
  });
}

const oracleDocument = {
  oracleId: 'plan38-v5-replay-baseline-before-plan40',
  capturedFromHead: 'c4b070ec1291f8633044e8274e0287e28ffaaf39',
  capturedUsingCurrentReplayV5: REPLAY_V5_SCHEMA_VERSION,
  support: 'high support',
  cases,
};

const targetPath = new URL('../../../tests/fixtures/plan38-v5-replay-oracles.json', import.meta.url);
await writeFile(targetPath, JSON.stringify(oracleDocument, null, 2) + '\n');

console.log(`Successfully captured ${cases.length} Plan 38 v5 replay oracle cases.`);
