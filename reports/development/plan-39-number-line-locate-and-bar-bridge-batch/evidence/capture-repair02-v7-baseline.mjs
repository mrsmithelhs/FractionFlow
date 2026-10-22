import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../../../../src/content/data/plan37-bar-to-line-bridge-records.js';
import {
  resolvePlan37BarToLineBridgeContext,
  resolvePlan37BarToLineBridgeInstance,
} from '../../../../src/content/plan37-bar-to-line-bridge-task.js';
import { applyIntent, createEpisode } from '../../../../src/interaction/episode.js';
import { PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION } from '../../../../src/interaction/episode-definition.js';
import { createReplayEnvelope, replayEpisode, REPLAY_V7_SCHEMA_VERSION } from '../../../../src/interaction/replay.js';
import { HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from '../../../../src/interaction/support.js';

const repoRoot = resolve(fileURLToPath(new URL('../../../../', import.meta.url)));
const outputPath = fileURLToPath(new URL('./repair02-v7-baseline-oracles.json', import.meta.url));
const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS.find((item) => item.itemId === 'bridge-06-three-eighths-8');
if (!record) throw new Error('Expected current Plan 39 source record is missing');
if (PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION.revision !== '1') {
  throw new Error('Refusing to freeze baseline unless Plan 39 definition revision 1 is current');
}

const supportCases = [
  { name: 'high', support: HIGH_SUPPORT_CONFIGURATION, supportMode: 'partitioned' },
  { name: 'medium', support: MEDIUM_SUPPORT_CONFIGURATION, supportMode: 'sparse-benchmarks' },
];
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const equalFraction = (left, right) => (
  BigInt(left.numerator) * BigInt(right.denominator)
  === BigInt(right.numerator) * BigInt(left.denominator)
);
const snapshots = {};

for (const supportCase of supportCases) {
  const instance = resolvePlan37BarToLineBridgeInstance(record.itemId);
  const taskContext = resolvePlan37BarToLineBridgeContext(instance, record.itemId, {
    supportMode: supportCase.supportMode,
  });
  if (taskContext.definitionRevision !== '1') throw new Error(`${supportCase.name}: expected revision-1 task context`);
  const initial = createEpisode({
    instance,
    episodeDefinition: PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION,
    taskContext,
    support: supportCase.support,
  });
  if (initial.beat !== 'encounter') throw new Error(`${supportCase.name}: v1 initial state must begin at encounter`);
  const locate = applyIntent(initial, { type: 'acknowledge-bridge-encounter' });
  if (locate.beat !== 'locate') throw new Error(`${supportCase.name}: acknowledgement did not reach locate`);
  const help = applyIntent(locate, { type: 'request-task-help' });

  const wrongCandidate = taskContext.supportMode === 'partitioned'
    ? { kind: 'fraction', numerator: '0', denominator: taskContext.partitionDenominator }
    : taskContext.sparseCandidates.find((candidate) => !equalFraction(candidate.form, record.sourceForm))?.form;
  if (!wrongCandidate || equalFraction(wrongCandidate, record.sourceForm)) {
    throw new Error(`${supportCase.name}: could not identify an offered incorrect position`);
  }
  const wrong = applyIntent(locate, { type: 'propose-number-line-location', proposed: wrongCandidate });
  if (wrong.beat !== 'locate' || !wrong.lastRecovery) throw new Error(`${supportCase.name}: wrong proposal did not remain in locate with recovery`);

  const accepted = applyIntent(locate, { type: 'propose-number-line-location', proposed: record.sourceForm });
  if (accepted.beat !== 'resolve' || !accepted.established.numberLineLocation?.acceptedPosition) {
    throw new Error(`${supportCase.name}: correct proposal did not reach accepted resolve`);
  }
  const completed = applyIntent(accepted, { type: 'finish-compact-episode' });
  if (completed.status !== 'resolved') throw new Error(`${supportCase.name}: finish did not complete the episode`);

  for (const [stateName, state] of Object.entries({ initial, locate, help, wrong, accepted, completed })) {
    const envelope = createReplayEnvelope(state);
    if (envelope.schemaVersion !== REPLAY_V7_SCHEMA_VERSION) throw new Error(`${supportCase.name}/${stateName}: expected replay v7`);
    if (envelope.episodeDefinition.revision !== '1' || envelope.taskContext?.definitionRevision !== '1') {
      throw new Error(`${supportCase.name}/${stateName}: replay identities are not revision 1`);
    }
    const replayed = replayEpisode(envelope);
    if (JSON.stringify(replayed) !== JSON.stringify(state)) throw new Error(`${supportCase.name}/${stateName}: replayed full state differs`);
    snapshots[`${supportCase.name}-${stateName}`] = {
      supportMode: supportCase.supportMode,
      stateName,
      envelope,
      fullState: state,
      envelopeSha256: hash(envelope),
      fullStateSha256: hash(state),
    };
  }
}

const baselineCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
const receipt = {
  baselineCommit,
  capturedAt: new Date().toISOString(),
  purpose: 'Pre-source Plan 39 Repair 02 revision-1 / replay-v7 compatibility oracle',
  source: {
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    definitionId: PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION.id,
    definitionRevision: PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION.revision,
    replaySchema: REPLAY_V7_SCHEMA_VERSION,
  },
  captureMethod: 'Run this script from the repository root with `node reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/capture-repair02-v7-baseline.mjs`. For each saved state, the script creates a v7 envelope, calls replayEpisode(envelope), requires JSON.stringify(replayed) === JSON.stringify(fullState), and records SHA-256 hashes for both envelope and state.',
  coverage: 'High and medium support, each with initial, locate, help, wrong-response, accepted, and completed full states (12 total). This is a representative compatibility baseline for the current revision-1 source record bridge-06-three-eighths-8; it does not claim exhaustive coverage of all eight items.',
  snapshots,
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, baselineCommit, snapshots: Object.keys(snapshots).length, replayVerified: true }, null, 2));
