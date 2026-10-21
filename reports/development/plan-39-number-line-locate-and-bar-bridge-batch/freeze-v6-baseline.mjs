import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildCuratedProblem } from '../../../src/content/generator.js';
import { resolveCuratedFixture } from '../../../src/content/authored-content-catalog.js';
import {
  PLAN40_SUBTRACTION_RECIPE_RECORDS,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
} from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { resolvePlan40SubtractionRecipeContext } from '../../../src/content/plan40-reusable-subtraction-recipes.js';
import { applyIntent, createEpisode } from '../../../src/interaction/episode.js';
import { PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION } from '../../../src/interaction/episode-definition.js';
import { createReplayEnvelope, replayEpisode } from '../../../src/interaction/replay.js';
import { HIGH_SUPPORT_CONFIGURATION } from '../../../src/interaction/support.js';

const record = PLAN40_SUBTRACTION_RECIPE_RECORDS[0];
if (record.itemId !== 'plan40-construct-half-fifth-10') throw new Error('unexpected frozen source record');
const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
const instance = buildCuratedProblem({
  fixture,
  selector: fixture.selector,
  overlays: fixture.overlays,
  profileId: fixture.profileId,
  candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] },
});
const taskContext = resolvePlan40SubtractionRecipeContext(instance, record.itemId, {
  practiceSetId: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  practiceSetRevision: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
});
const createInitial = () => createEpisode({
  instance,
  episodeDefinition: PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
  taskContext,
  support: HIGH_SUPPORT_CONFIGURATION,
});
const enterOperate = () => {
  let state = applyIntent(createInitial(), { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '5', denominator: '10' } });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '2', denominator: '10' } });
  if (state.beat !== 'operate') throw new Error('baseline setup did not reach operate');
  return state;
};
const initial = createInitial();
const help = applyIntent(enterOperate(), { type: 'request-task-help' });
const recovery = applyIntent(enterOperate(), {
  type: 'submit-subtraction-result',
  proposed: { kind: 'fraction', numerator: '2', denominator: '10' },
});
let completed = applyIntent(enterOperate(), {
  type: 'submit-subtraction-result',
  proposed: { kind: 'fraction', numerator: '3', denominator: '10' },
});
completed = applyIntent(completed, { type: 'finish-compact-episode' });

const snapshots = {};
for (const [name, state] of Object.entries({ initial, help, recovery, completed })) {
  const envelope = createReplayEnvelope(state);
  if (envelope.schemaVersion !== 'fractionflow.episode-replay/v6') throw new Error(`${name}: expected replay v6`);
  const replayed = replayEpisode(envelope);
  if (JSON.stringify(replayed) !== JSON.stringify(state)) throw new Error(`${name}: full state replay mismatch`);
  snapshots[name] = {
    envelope,
    fullState: state,
    envelopeSha256: createHash('sha256').update(JSON.stringify(envelope)).digest('hex'),
    fullStateSha256: createHash('sha256').update(JSON.stringify(state)).digest('hex'),
  };
}

const outputPath = resolve('reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/v6-baseline-oracles.json');
await mkdir(resolve('reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence'), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({
  baselineCommit: 'e5f3d0b',
  source: 'plan40-construct-half-fifth-10',
  replaySchema: 'fractionflow.episode-replay/v6',
  comparison: 'JSON.stringify(full replayed state) === JSON.stringify(frozen full state)',
  snapshots,
}, null, 2)}\n`);
console.log(`Wrote four v6 envelope/full-state oracles to ${outputPath}`);
