import { readFileSync, writeFileSync } from 'node:fs';
import {
  applyIntent,
  createEpisode,
  getEpisodeDefinition,
  replayEpisode,
} from '../../../../src/interaction/index.js';
import { PHASE1_GOLDEN_CASES, buildCuratedProblem, validateCuratedFixtures } from '../../../../src/content/index.js';
import { evaluateTaskPathClosure } from '../../../../src/interaction/path-closure.js';
import { getRegisteredCondition } from '../../../../src/app/conditions.js';

const baselinePath = 'reports/development/plan-25-equivalent-fraction-conversion-help/evidence/pre-mutation-legacy-oracles.json';
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const equalJson = (actual, expected) => JSON.stringify(actual) === JSON.stringify(expected);
const whole = (value) => ({ kind: 'fraction', numerator: String(value), denominator: '1' });
const fraction = (numerator, denominator) => ({
  kind: 'fraction', numerator: String(numerator), denominator: String(denominator),
});
const canonical = validateCuratedFixtures().find((row) => (
  row.fixture.id === 'curated-relatively-prime-addition-non-least'
)).instance;

for (const oracle of baseline.completedReplayOracles) {
  const actual = replayEpisode(JSON.parse(JSON.stringify(oracle.envelope)));
  if (!equalJson(actual, oracle.finalState)) {
    throw new Error(`legacy full-state replay changed for revision ${oracle.definitionRevision}/${oracle.denominator}`);
  }
}

function decideState(instance) {
  let state = createEpisode({
    instance,
    episodeDefinition: getEpisodeDefinition('phase-2-unlike-proper-addition', '2'),
  });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  return applyIntent(state, { type: 'submit-notice', matchesUnits: false });
}

for (const oracle of baseline.revision2RefusalOracles) {
  if (oracle.state) {
    const actual = applyIntent(decideState(canonical), {
      type: 'propose-common-denominator',
      proposed: whole(Number(oracle.denominator)),
    });
    if (!equalJson(actual, oracle.state)) throw new Error(`revision-2 refusal state changed: ${oracle.case}`);
  } else {
    const nestedFixture = PHASE1_GOLDEN_CASES.find((entry) => entry.id === 'curated-nested-addition');
    const nested = buildCuratedProblem({
      fixture: nestedFixture,
      selector: nestedFixture.selector,
      overlays: nestedFixture.overlays,
      profileId: nestedFixture.profileId,
      candidate: {
        left: nestedFixture.left,
        right: nestedFixture.right,
        reviewedTransitions: nestedFixture.reviewedTransitions ?? [],
      },
    });
    const missingConditionData = {
      ...canonical,
      provenance: { ...canonical.provenance, fixtureId: 'plan25-missing-reflection-fixture' },
    };
    const instance = oracle.case.includes('nested') ? nested : missingConditionData;
    const actual = evaluateTaskPathClosure({
      instance,
      targetDenominator: oracle.denominator,
      episodeDefinition: getEpisodeDefinition('phase-2-unlike-proper-addition-reflection', '2'),
      activeCondition: getRegisteredCondition('phase2-bundle-1').activeCondition,
    });
    if (!equalJson(actual, oracle.closure)) throw new Error(`revision-2 closure result changed: ${oracle.case}`);
  }
}

const output = {
  purpose: 'Post-implementation exact comparison against the pre-mutation Plan 25 legacy replay and revision-2 closure capture',
  baselineHead: baseline.baselineHead,
  completedReplayChecks: baseline.completedReplayOracles.map((oracle) => ({
    revision: oracle.definitionRevision,
    denominator: oracle.denominator,
    fullStateIdentical: true,
  })),
  revision2ClosureChecks: baseline.revision2RefusalOracles.map((oracle) => ({
    case: oracle.case,
    fullStateOrClosureIdentical: true,
  })),
};
writeFileSync('reports/development/plan-25-equivalent-fraction-conversion-help/evidence/verification-pre-mutation-oracles.json', `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
