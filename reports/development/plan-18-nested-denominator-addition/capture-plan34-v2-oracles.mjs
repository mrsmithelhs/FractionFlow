import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { buildCuratedProblem } from '../../../src/content/generator.js';
import { resolveCuratedFixture } from '../../../src/content/authored-content-catalog.js';
import { FULL_ADDITION_CONSTRUCT_PATTERN, FULL_ADDITION_INSPECT_PATTERN, resolvePlan34TaskContext } from '../../../src/content/full-addition-task-patterns.js';
import { PLAN34_FULL_ADDITION_EPISODE_DEFINITION } from '../../../src/interaction/episode-definition.js';
import { applyIntent, createEpisode, episodeStateSnapshot } from '../../../src/interaction/episode.js';
import { createReplayEnvelope, replayEpisode, REPLAY_V2_SCHEMA_VERSION } from '../../../src/interaction/replay.js';
import { addFractions, convertToDenominator } from '../../../src/math/index.js';

const root = new URL('../../../', import.meta.url);
const v1OracleUrl = new URL('../../../tests/fixtures/plan34-legacy-replay-oracle.json', import.meta.url);
const outputUrl = new URL('../../../tests/fixtures/plan34-v2-replay-oracles.json', import.meta.url);
const v1Bytes = readFileSync(v1OracleUrl);
const v1Sha256 = createHash('sha256').update(v1Bytes).digest('hex').toUpperCase();
const sourceHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();

const scenarios = [
  {
    pattern: FULL_ADDITION_CONSTRUCT_PATTERN,
    itemId: 'two-thirds-plus-one-fourth',
    fixtureId: 'curated-relatively-prime-addition-non-least',
    authoringRevision: 'plan03-fixtures-v1',
    complete(state, task) {
      const asExact = (form) => ({ kind: 'fraction', numerator: BigInt(form.numerator), denominator: BigInt(form.denominator) });
      const left = convertToDenominator(asExact(task.instance.operands.left.initialForm), 12n);
      const right = convertToDenominator(asExact(task.instance.operands.right.initialForm), 12n);
      const total = addFractions(left, right);
      state = applyIntent(state, { type: 'acknowledge-encounter' });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: left.numerator.toString(), denominator: '12' } });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: right.numerator.toString(), denominator: '12' } });
      state = applyIntent(state, { type: 'submit-operation-result', proposed: { kind: 'fraction', numerator: total.numerator.toString(), denominator: '12' } });
      return applyIntent(state, { type: 'finish-compact-episode' });
    },
  },
  {
    pattern: FULL_ADDITION_INSPECT_PATTERN,
    itemId: 'one-half-plus-one-third',
    fixtureId: 'curated-relatively-prime-addition-one-half-one-third',
    authoringRevision: 'plan26-fixtures-v1',
    complete(state, task) {
      const asExact = (form) => ({ kind: 'fraction', numerator: BigInt(form.numerator), denominator: BigInt(form.denominator) });
      const left = convertToDenominator(asExact(task.instance.operands.left.initialForm), 12n);
      const right = convertToDenominator(asExact(task.instance.operands.right.initialForm), 12n);
      const total = addFractions(left, right);
      state = applyIntent(state, { type: 'acknowledge-encounter' });
      state = applyIntent(state, { type: 'repair-inspected-form', numerator: left.numerator.toString() });
      state = applyIntent(state, { type: 'keep-inspected-form' });
      state = applyIntent(state, { type: 'submit-operation-result', proposed: { kind: 'fraction', numerator: total.numerator.toString(), denominator: '12' } });
      return applyIntent(state, { type: 'finish-compact-episode' });
    },
  },
];

const cases = [];
for (const scenario of scenarios) {
  const fixture = resolveCuratedFixture(scenario.fixtureId, scenario.authoringRevision);
  if (!fixture) throw new Error(`missing pinned source fixture ${scenario.fixtureId}@${scenario.authoringRevision}`);
  const instance = buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: fixture.reviewedTransitions ?? [] },
  });
  const taskContext = resolvePlan34TaskContext(instance, scenario.pattern.id, scenario.pattern.revision, '12');
  if (taskContext.itemId !== scenario.itemId || taskContext.practiceSetRevision !== '5') {
    throw new Error(`unexpected baseline set association for ${scenario.itemId}`);
  }
  const initial = createEpisode({ instance, episodeDefinition: PLAN34_FULL_ADDITION_EPISODE_DEFINITION, taskContext });
  const completed = scenario.complete(initial, { instance, taskContext });
  const entries = [
    { phase: 'initial', state: initial },
    { phase: 'completed', state: completed },
  ];
  for (const { phase, state } of entries) {
    const envelope = createReplayEnvelope(state);
    if (envelope.schemaVersion !== REPLAY_V2_SCHEMA_VERSION) throw new Error('expected baseline Plan34 replay v2');
    const expectedState = episodeStateSnapshot(state);
    const replayed = replayEpisode(JSON.parse(JSON.stringify(envelope)));
    const replayMatches = JSON.stringify(episodeStateSnapshot(replayed)) === JSON.stringify(expectedState);
    if (!replayMatches) throw new Error(`${scenario.pattern.id} ${phase} replay did not reproduce its state`);
    cases.push({ patternId: scenario.pattern.id, patternRevision: scenario.pattern.revision, itemId: scenario.itemId, phase, envelope, expectedState });
  }
}

const oracle = {
  oracleId: 'plan34-v2-replay-baseline-before-plan18-replay-v3',
  capturedFromHead: sourceHead,
  capturedUsingCurrentReplayV2: REPLAY_V2_SCHEMA_VERSION,
  v1OracleSha256AtCapture: v1Sha256,
  cases,
  selfCheck: { caseCount: cases.length, allReplayMatches: true },
};
writeFileSync(outputUrl, `${JSON.stringify(oracle, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ output: outputUrl.pathname, sourceHead, v1OracleSha256AtCapture: v1Sha256, caseCount: cases.length, allReplayMatches: true }, null, 2)}\n`);
