import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const captureDir = path.join(evidenceDir, 'captures');
const data = JSON.parse(await fs.readFile(path.join(captureDir, 'measurements.json'), 'utf8'));
const matrixPath = path.resolve(evidenceDir, '../../../../tests/routes/route-matrix.json');
const currentMatrixText = await fs.readFile(matrixPath, 'utf8');
const matrix = JSON.parse(currentMatrixText);
const routeBaselineCommit = '76039520d9bfc1c8b2c4b102ca39975fc7a87466';
const expectedBaselineFileSha256 = '2252458a767a322b23946b701085958eafc2fb0f9c416d4a8c3ee4c6bafa8cbd';
const expectedBaselinePrefixCanonicalSha256 = '861c315fa1cff3a3e3daa949c53c41a27d7bf27ba54a0981b02a5bd3f0e87650';
const baselineText = execFileSync('git', ['show', `${routeBaselineCommit}:tests/routes/route-matrix.json`], { encoding: 'utf8' });
const baseline = JSON.parse(baselineText);
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

function require(condition, message) {
  if (!condition) throw new Error(message);
}

const baselineFileSha256 = sha256(baselineText);
const baselinePrefixCanonicalSha256 = sha256(JSON.stringify(baseline.routes));
const currentFileSha256 = sha256(currentMatrixText);
const currentPrefixCanonicalSha256 = sha256(JSON.stringify(matrix.routes.slice(0, baseline.routes.length)));
require(baselineFileSha256 === expectedBaselineFileSha256, 'immutable baseline file-byte hash changed');
require(baselinePrefixCanonicalSha256 === expectedBaselinePrefixCanonicalSha256, 'immutable baseline canonical-object hash changed');
require(baseline.routes.length === 54, `expected 54 original routes; found ${baseline.routes.length}`);
require(JSON.stringify(matrix.routes.slice(0, 54)) === JSON.stringify(baseline.routes), 'an original route object changed');
require(currentPrefixCanonicalSha256 === expectedBaselinePrefixCanonicalSha256, 'current original-route prefix canonical hash changed');
require(matrix.routes.length === 55, `expected 55 total routes after the Plan 17 append; found ${matrix.routes.length}`);
const appendedRoute = matrix.routes[54];
require(appendedRoute.id === 'ROUTE-PLAN17-APPENDED-ITEM-REACHABLE' && appendedRoute.actions.length === 121,
  'appended Plan 17 learner route is missing or incomplete');
require(appendedRoute.actions.at(-1)?.target === '.app-next-button', 'Plan 17 route does not use completion-gated Next');
require(data.setRevision === '4', 'capture does not describe live set revision 4');
require(data.scenarios.length === 32, `expected 32 bounded browser scenarios; found ${data.scenarios.length}`);
require(data.routeBaseline?.immutableCommit === routeBaselineCommit, 'capture does not identify the immutable pre-implementation commit');
require(data.routeBaseline.originalFileByteSha256 === expectedBaselineFileSha256, 'capture has the wrong original file-byte hash');
require(data.routeBaseline.canonicalPrefixSha256 === expectedBaselinePrefixCanonicalSha256,
  'capture has the wrong original-route canonical-prefix hash');
require(data.routeBaseline.canonicalOriginalObjectsEqual === true, 'capture did not establish canonical equality of original route objects');
require(data.routeBaseline.wholeFileBytesEqual === false && currentFileSha256 !== baselineFileSha256,
  'capture must report that the whole matrix file bytes differ after appending Plan 17');

const byTargetConditionSupport = new Map();
const byConditionHeight = new Map();
let keyboardScenarioCount = 0;
let touchScenarioCount = 0;
let touchActivationCount = 0;
let reducedMotionScenarioCount = 0;
let linearScenarioCount = 0;
const detailed = [];
for (const item of data.scenarios) {
  const { scenario, accepted, reflection, replay, helpCopy, recovery, leakSeeds, falsification, resetWithholding } = item;
  const combination = `${scenario.target}/${scenario.condition}/${scenario.support}`;
  const entries = byTargetConditionSupport.get(combination) ?? new Set();
  entries.add(`${scenario.view}/${scenario.height}`);
  byTargetConditionSupport.set(combination, entries);
  const conditionHeights = byConditionHeight.get(`${scenario.target}/${scenario.condition}`) ?? new Set();
  conditionHeights.add(scenario.height);
  byConditionHeight.set(`${scenario.target}/${scenario.condition}`, conditionHeights);
  if (scenario.interaction === 'keyboard') keyboardScenarioCount += 1;
  if (scenario.interaction === 'touch') {
    touchScenarioCount += 1;
    touchActivationCount += (accepted.keyboardActions ?? []).filter((entry) => entry.action === 'touch-activate').length;
    require((accepted.keyboardActions ?? []).some((entry) => entry.action === 'touch-input-tooling'),
      `${scenario.id}: touch journey did not record its tooling-supplied numeric text limitation`);
  }
  if (scenario.view === 'linear') linearScenarioCount += 1;
  if (scenario.reducedMotion) reducedMotionScenarioCount += 1;
  require(helpCopy && helpCopy.trim().length > 0, `${scenario.id}: help content was missing`);
  require(recovery && recovery.trim().length > 0, `${scenario.id}: wrong learner answer lacked recovery`);
  require(accepted.rowBounds?.length === 2, `${scenario.id}: both whole rows are not measured after acceptance`);
  require(accepted.questionReachable && accepted.controlsReachable, `${scenario.id}: accepted question/control is unreachable`);
  const expectedResolveCue = scenario.target === '12'
    ? "That's right."
    : '34/24 is correct! It can also be written as 17/12.';
  require(accepted.resolveCue === expectedResolveCue,
    `${scenario.id}: canonical crossing cue or alternate-form notice changed`);
  require(reflection && replay, `${scenario.id}: reflection or Replay stage is absent`);
  require(resetWithholding?.stackCount === 0, `${scenario.id}: reset retained the result stack`);
  require(item.withhold?.stackCount === 0
    && item.withhold.forbiddenFormsInDomText.length === 0
    && item.withhold.forbiddenFormsInVisibleText.length === 0
    && item.withhold.structuredFractionFindings.length === 0
    && item.withhold.forbiddenFormAttributes.length === 0
    && item.withhold.hiddenLabels.length === 0
    && item.withhold.liveRegions.length === 0
    && item.withhold.formValues.length === 0,
  `${scenario.id}: a result form remained observable before the correct total`);
  for (const [seedName, expectedChannel] of [
    ['hidden-structured-fraction', 'structuredFractionFindings'],
    ['spoken-aria-form', 'aria-label'],
    ['arbitrary-attribute-mixed-equivalent', 'data-answer'],
  ]) {
    const seed = leakSeeds?.[seedName];
    require(seed?.rejected === true, `${scenario.id}: independent ${seedName} seed did not fail the withholding guard`);
    require(typeof seed.diagnostic === 'string' && seed.diagnostic.includes(expectedChannel),
      `${scenario.id}: ${seedName} did not identify its own leakage channel`);
    require(!seed.diagnostic.includes('fraction-bar-multi-whole-stack')
      && !seed.diagnostic.includes('linear-result-stack'),
    `${scenario.id}: ${seedName} relies on a forbidden rendered-stack class`);
  }
  if (scenario.view === 'visual') {
    const denominator = Number(scenario.target);
    const remainder = accepted.segments[1]?.filter((segment) => segment.shaded).length;
    require(item.stackFact?.rows?.length === 2, `${scenario.id}: visual stack facts lack both rows`);
    require(item.stackFact.rows.every((row) => row.unitCount === denominator), `${scenario.id}: visual rows have different unit counts`);
    require(item.stackFact.rows[0].shaded === denominator && item.stackFact.rows[1].shaded === remainder,
      `${scenario.id}: visual row shading is not the validated quantity`);
    require(Math.abs(item.stackFact.rows[0].width - item.stackFact.rows[1].width) < 1,
      `${scenario.id}: result wholes do not have equal widths`);
    for (const row of accepted.segments) {
      require(row.length === denominator, `${scenario.id}: result row lost or added subdivisions`);
      const widths = row.map((segment) => segment.width);
      require(Math.max(...widths) - Math.min(...widths) <= 1.1,
        `${scenario.id}: equal subdivisions differ beyond browser rounding`);
    }
    require(falsification?.rejectsTruncatedRemainder, `${scenario.id}: one-whole truncation seed was not rejected`);
    require(falsification?.rejectsResizedSecondWhole, `${scenario.id}: second-whole resize seed was not rejected`);
    require(falsification?.rejectsCorruptRenderedFact, `${scenario.id}: rendered-fact corruption seed was not rejected`);
    require(falsification?.restoredWitnessPasses, `${scenario.id}: restored mounted witness did not pass`);
  } else {
    require(item.stackFact?.rows?.length === 2, `${scenario.id}: linear stack lacks both rows`);
    require(item.stackFact.rows[0] === `${scenario.target} of ${scenario.target} equal parts`,
      `${scenario.id}: linear whole row is not truthful`);
  }
  for (const stage of [accepted, reflection, replay]) {
    require(stage.horizontalOverflow === false, `${scenario.id}/${stage.stage}: horizontal overflow was measured`);
    require(Number.isFinite(stage.scrollHeight) && Number.isFinite(stage.scrollY) && Number.isFinite(stage.scrollMax),
      `${scenario.id}/${stage.stage}: vertical scrolling measurements are incomplete`);
  }
  for (const name of ['accepted', 'reflection', 'replay']) {
    const filename = `${scenario.id}-${name}.png`;
    require((await fs.stat(path.join(captureDir, filename))).size > 1000, `${filename}: missing or empty screenshot`);
  }
  if (scenario.detailed) detailed.push(item);
}

require(byTargetConditionSupport.size === 16, `expected 16 path/condition/support combinations; found ${byTargetConditionSupport.size}`);
require(data.scenarios.filter((item) => item.scenario.id.endsWith('-reciprocal')).length === 16,
  'expected bounded high-linear and medium-visual reciprocal samples across paths/conditions');
for (const [key, presentations] of byTargetConditionSupport) {
  require(presentations.has('visual/740') || presentations.has('visual/752'), `${key}: no visual witness exists`);
  require(presentations.has('linear/740') || presentations.has('linear/752'), `${key}: no linear witness exists`);
}
for (const [key, heights] of byConditionHeight) {
  require(heights.has(740) && heights.has(752), `${key}: one of the two reference heights is missing`);
}
require(keyboardScenarioCount >= 1, 'no real keyboard scenario was captured');
const keyboardScenario = data.scenarios.find((item) => item.scenario.interaction === 'keyboard');
const keyboardActions = keyboardScenario.accepted.keyboardActions ?? [];
require(keyboardActions.filter((entry) => entry.action === 'activate').length >= 5,
  'keyboard scenario did not activate multiple learner controls through sequential Tab and Enter');
require(keyboardActions.some((entry) => entry.action === 'submit-number')
  && keyboardActions.some((entry) => entry.action === 'correct-recovery-response'),
'keyboard scenario did not type a response and submit its correction after wrong-answer recovery');
require(keyboardScenario.accepted.operateRecoveryFocus !== null, 'keyboard scenario did not record focus after wrong-answer recovery');
require(touchScenarioCount >= 1 && touchActivationCount >= 5, 'touch scenario did not tap mounted episode controls through completion');
require(linearScenarioCount >= 1, 'no linear scenario was captured');
require(reducedMotionScenarioCount >= 1, 'no reduced-motion scenario was captured');
require(detailed.length === 2, `expected one targeted scale/Replay sample per denominator; found ${detailed.length}`);
require(new Set(detailed.map((item) => item.scenario.target)).size === 2, 'targeted scale samples do not cover both denominators');
for (const item of detailed) {
  const scale = item.accepted.scaleConservation;
  const falsification = item.falsification;
  require(scale, `${item.scenario.id}: conserved-scale observations are absent`);
  require(scale.activeConversionReplay.replayControlVisible && scale.activeConversionReplay.draftValue,
    `${item.scenario.id}: active conversion Replay did not retain a draft`);
  require(scale.dismissedConversionReplay.showNewPartsActivated
    && scale.dismissedConversionReplay.draftValue === scale.activeConversionReplay.draftValue,
  `${item.scenario.id}: Show new parts did not restore the conversion draft`);
  require(scale.lastConversionImmediate.runningAnimations > 0,
    `${item.scenario.id}: last conversion immediate animation was not observed`);
  require(scale.lastConversionSettled.runningAnimations === 0,
    `${item.scenario.id}: settled addends still have running animations`);
  for (const stage of [
    scale.lastConversionSettled,
    scale.operateBeforeAnswer,
    scale.operateAfterWrongAnswer,
    { ...scale.accepted, layout: item.accepted },
  ]) {
    require(stage.tracks.length === 2, `${item.scenario.id}/${stage.stage}: expected two measured tracks`);
    require(stage.layout.questionReachable && stage.layout.controlsReachable,
      `${item.scenario.id}/${stage.stage}: question or controls were not reachable`);
  }
  const widths = [scale.lastConversionSettled, scale.operateBeforeAnswer, scale.accepted]
    .flatMap((stage) => stage.tracks.map((track) => track.width));
  require(Math.max(...widths) - Math.min(...widths) < 1,
    `${item.scenario.id}: whole scale is not conserved across addends, operate, and result (${widths.join(', ')})`);
  const unitWidths = [scale.lastConversionSettled, scale.operateBeforeAnswer, scale.accepted]
    .flatMap((stage) => stage.tracks.flatMap((track) => track.segmentWidths));
  require(Math.max(...unitWidths) - Math.min(...unitWidths) <= 1.1,
    `${item.scenario.id}: segment scale is not conserved across instructional states`);
  require(falsification?.rejectsBothRowsResizedEquallyAcrossStates === true,
    `${item.scenario.id}: equal-row resize did not fail cross-state conservation`);
  require(falsification.bothRowsSeedInternalWidths?.length === 2
    && Math.abs(falsification.bothRowsSeedInternalWidths[0] - falsification.bothRowsSeedInternalWidths[1]) < 1,
  `${item.scenario.id}: equal-row resize did not preserve internal row equality`);
  require(typeof falsification.bothRowsSeedDiagnostic === 'string'
    && falsification.bothRowsSeedDiagnostic.includes('whole scale changed'),
  `${item.scenario.id}: equal-row seed did not fail the cross-state scale assertion`);
  require(falsification.bothRowsCleanCrossStatePassesAfterRestore === true,
    `${item.scenario.id}: restored rows did not pass cross-state conservation`);
  require(falsification.bothRowsRestoredWidths?.every((width) => Math.abs(width - scale.accepted.tracks[0].width) < 1),
    `${item.scenario.id}: restored row widths do not match the accepted scale`);
  const extraScreenshots = [
    'rest', 'conversion-replay', 'conversion-replay-dismissed', 'last-conversion-immediate',
    'last-conversion-settled', 'operate-before-answer', 'operate-after-wrong-answer',
  ];
  for (const name of extraScreenshots) {
    require((await fs.stat(path.join(captureDir, `${item.scenario.id}-${name}.png`))).size > 1000,
      `${item.scenario.id}-${name}.png: missing or empty targeted screenshot`);
  }
}

console.log(JSON.stringify({
  valid: true,
  scenarios: data.scenarios.length,
  pathConditionSupportSets: byTargetConditionSupport.size,
  reciprocalPresentationSupportSamples: data.scenarios.filter((item) => item.scenario.id.endsWith('-reciprocal')).length,
  immutableBaselineCommit: routeBaselineCommit,
  originalRouteObjectsCanonicalEqual: true,
  originalFileByteSha256: baselineFileSha256,
  currentFileByteSha256: currentFileSha256,
  wholeFileByteEqual: false,
  keyboard: { scenarios: keyboardScenarioCount, actions: keyboardActions.length, correctionTyped: true },
  touch: { scenarios: touchScenarioCount, mountedControlTaps: touchActivationCount },
  targetedScaleAndActiveReplaySamples: detailed.length,
  screenshots: data.scenarios.length * 3 + detailed.length * 7,
}, null, 2));
