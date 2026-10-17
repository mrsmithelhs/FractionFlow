import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { buildCuratedProblem } from '../../../src/content/generator.js';
import { resolveCuratedFixture } from '../../../src/content/authored-content-catalog.js';
import { resolvePlan18TaskContext } from '../../../src/content/nested-renaming-task.js';
import { PLAN18_NESTED_ADDITION_EPISODE_DEFINITION } from '../../../src/interaction/episode-definition.js';
import { applyIntent, createEpisode } from '../../../src/interaction/episode.js';
import { createReplayEnvelope, replayEpisode } from '../../../src/interaction/replay.js';
import { HIGH_SUPPORT_CONFIGURATION } from '../../../src/interaction/support.js';
import { addFractions, convertToDenominator } from '../../../src/math/index.js';

const sourceHead = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const records = [
  { itemId: 'nested-one-half-plus-three-eighths', fixtureId: 'curated-nested-addition-one-half-three-eighths', requiredSide: 'left' },
  { itemId: 'nested-three-eighths-plus-one-half', fixtureId: 'curated-nested-addition-three-eighths-one-half', requiredSide: 'right' },
];

function start(record) {
  const fixture = resolveCuratedFixture(record.fixtureId, 'plan18-record-v1');
  const instance = buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: [],
    profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] },
  });
  const taskContext = resolvePlan18TaskContext(instance);
  const state = createEpisode({
    instance,
    episodeDefinition: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION,
    taskContext,
    support: HIGH_SUPPORT_CONFIGURATION,
  });
  return { instance, taskContext, state };
}

function complete(record) {
  const built = start(record);
  const side = built.taskContext.requiredSide;
  let state = applyIntent(built.state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'select-renaming-side', side });
  const source = built.instance.operands[side].initialForm;
  const converted = convertToDenominator({
    kind: 'fraction', numerator: BigInt(source.numerator), denominator: BigInt(source.denominator),
  }, 8n);
  state = applyIntent(state, {
    type: 'submit-equivalent-form',
    proposed: { kind: 'fraction', numerator: converted.numerator.toString(), denominator: '8' },
  });
  const toEighths = (operandSide) => {
    const form = built.instance.operands[operandSide].initialForm;
    return convertToDenominator({ kind: 'fraction', numerator: BigInt(form.numerator), denominator: BigInt(form.denominator) }, 8n);
  };
  const sum = addFractions(toEighths('left'), toEighths('right'));
  state = applyIntent(state, {
    type: 'submit-operation-result',
    proposed: { kind: 'fraction', numerator: sum.numerator.toString(), denominator: sum.denominator.toString() },
  });
  state = applyIntent(state, { type: 'finish-nested-episode' });
  return state;
}

const cases = [];
for (const record of records) {
  for (const phase of ['initial', 'completed']) {
    const state = phase === 'initial' ? start(record).state : complete(record);
    const envelope = createReplayEnvelope(state);
    if (envelope.schemaVersion !== 'fractionflow.episode-replay/v3') throw new Error('Expected Plan 18 v3 envelope');
    const replayed = replayEpisode(envelope);
    if (JSON.stringify(replayed) !== JSON.stringify(state)) throw new Error(`Replay mismatch: ${record.itemId} ${phase}`);
    cases.push({ itemId: record.itemId, fixtureId: record.fixtureId, requiredSide: record.requiredSide, phase, envelope, expectedState: state });
  }
}

const oracle = {
  oracleId: 'plan18-v3-replay-baseline-before-plan35',
  capturedFromHead: sourceHead,
  capturedUsingCurrentReplayV3: 'fractionflow.episode-replay/v3',
  support: 'high support',
  cases,
  selfCheck: { caseCount: cases.length, allReplayMatches: true },
};
await writeFile(new URL('../../../tests/fixtures/plan18-v3-replay-oracles.json', import.meta.url), `${JSON.stringify(oracle, null, 2)}\n`);
console.log(JSON.stringify(oracle.selfCheck));
