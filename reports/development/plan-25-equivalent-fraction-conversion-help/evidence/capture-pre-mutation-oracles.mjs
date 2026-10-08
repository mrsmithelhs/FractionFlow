import { writeFileSync } from 'node:fs';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
  getEpisodeDefinition,
  replayEpisode,
} from '../../../../src/interaction/index.js';
import { PHASE1_GOLDEN_CASES, buildCuratedProblem, validateCuratedFixtures } from '../../../../src/content/index.js';
import { PHASE2_REFLECTION_EPISODE_DEFINITION } from '../../../../src/interaction/episode-definition.js';
import { evaluateTaskPathClosure } from '../../../../src/interaction/path-closure.js';
import { getRegisteredCondition } from '../../../../src/app/conditions.js';

const whole = (n) => ({ kind: 'fraction', numerator: String(n), denominator: '1' });
const fraction = (n, d) => ({ kind: 'fraction', numerator: String(n), denominator: String(d) });
const canonical = validateCuratedFixtures().find((r) => r.fixture.id === 'curated-relatively-prime-addition-non-least').instance;

function completedOracle(revision, denominator) {
  const definition = getEpisodeDefinition('phase-2-unlike-proper-addition', revision);
  let state = createEpisode({ instance: canonical, episodeDefinition: definition });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
  for (let i = 0; i < 4; i += 1) state = applyIntent(state, { type: 'request-help' });
  state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(5) });
  state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(denominator) });
  const leftNum = denominator === 12 ? 8 : 16;
  const rightNum = denominator === 12 ? 3 : 6;
  for (let i = 0; i < 4; i += 1) state = applyIntent(state, { type: 'request-help' });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(1, denominator) });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(leftNum, denominator) });
  for (let i = 0; i < 4; i += 1) state = applyIntent(state, { type: 'request-help' });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(1, denominator) });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(rightNum, denominator) });
  state = applyIntent(state, { type: 'submit-operation-result', proposed: fraction(denominator === 12 ? 11 : 22, denominator) });
  state = applyIntent(state, { type: 'submit-resolution', proposed: fraction(11, 12) });
  const envelope = createReplayEnvelope(state);
  const roundTrip = replayEpisode(JSON.parse(JSON.stringify(envelope)));
  if (JSON.stringify(roundTrip) !== JSON.stringify(state)) throw new Error(`replay mismatch for rev${revision}/${denominator}`);
  return { definitionRevision: revision, denominator: String(denominator), envelope, finalState: state, roundTripExact: true };
}

function atDecide(instance = canonical, episodeDefinition = getEpisodeDefinition('phase-2-unlike-proper-addition', '2')) {
  let state = createEpisode({ instance, episodeDefinition });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  return applyIntent(state, { type: 'submit-notice', matchesUnits: false });
}

function refuseAt(instance, denominator, definition = getEpisodeDefinition('phase-2-unlike-proper-addition', '2')) {
  let state = createEpisode({ instance, episodeDefinition: definition });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
  state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(denominator) });
  return state;
}

function closureProbe(instance, denominator, conditionId = 'phase2-bundle-1') {
  return evaluateTaskPathClosure({
    instance,
    targetDenominator: String(denominator),
    episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
    activeCondition: getRegisteredCondition(conditionId).activeCondition,
  });
}

const nestedFixture = PHASE1_GOLDEN_CASES.find((entry) => entry.id === 'curated-nested-addition');
const nested = buildCuratedProblem({
  fixture: nestedFixture,
  selector: nestedFixture.selector,
  overlays: nestedFixture.overlays,
  profileId: nestedFixture.profileId,
  candidate: { left: nestedFixture.left, right: nestedFixture.right, reviewedTransitions: nestedFixture.reviewedTransitions ?? [] },
});
const missingConditionData = {
  ...canonical,
  provenance: { ...canonical.provenance, fixtureId: 'plan25-missing-reflection-fixture' },
};

const oracle = {
  purpose: 'Plan 25 pre-mutation full-state replay and Plan 22 revision-2 closure baselines',
  capturedBeforeSourceMutation: new Date().toISOString(),
  baselineHead: '1ffe66f',
  completedReplayOracles: [
    completedOracle('1', 12), completedOracle('1', 24),
    completedOracle('2', 12), completedOracle('2', 24),
  ],
  revision2RefusalOracles: [
    { case: '36-outside-capability', denominator: '36', state: refuseAt(canonical, 36) },
    { case: '72-outside-capability', denominator: '72', state: refuseAt(canonical, 72) },
    { case: 'eligible-unauthored-nested-24', denominator: '24', closure: closureProbe(nested, 24) },
    { case: 'authored-path-missing-condition-data-12', denominator: '12', closure: closureProbe(missingConditionData, 12) },
  ],
};
writeFileSync('reports/development/plan-25-equivalent-fraction-conversion-help/evidence/pre-mutation-legacy-oracles.json', `${JSON.stringify(oracle, null, 2)}\n`);
console.log(JSON.stringify({
  baselineHead: oracle.baselineHead,
  completions: oracle.completedReplayOracles.map(({ definitionRevision, denominator, roundTripExact }) => ({ definitionRevision, denominator, roundTripExact })),
  refusals: oracle.revision2RefusalOracles.map(({ case: name, state, closure }) => ({ case: name, beat: state?.beat, kind: state?.lastRecovery?.classification.kind ?? closure?.reason, target: state?.lastRecovery?.classification.targetDenominator ?? null, available: closure?.available })),
}, null, 2));

