import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const captureDir = path.join(evidenceDir, 'captures');
const data = JSON.parse(await fs.readFile(path.join(captureDir, 'measurements.json'), 'utf8'));
const matrix = JSON.parse(await fs.readFile(path.resolve(evidenceDir, '../../../../tests/routes/route-matrix.json'), 'utf8'));
const baselineText = execFileSync('git', ['show', 'HEAD:tests/routes/route-matrix.json'], { encoding: 'utf8' });
const baseline = JSON.parse(baselineText);

function require(condition, message) {
  if (!condition) throw new Error(message);
}

require(data.setRevision === '4', 'capture does not describe live set revision 4');
require(data.baselineRouteMatrixSha256 === '2252458a767a322b23946b701085958eafc2fb0f9c416d4a8c3ee4c6bafa8cbd', 'route baseline identifier is incorrect');
require(data.scenarios.length === 16, `expected 16 path/condition/support browser scenarios; found ${data.scenarios.length}`);
require(baseline.routes.length === 54, `expected original 54-route baseline; found ${baseline.routes.length}`);
require(JSON.stringify(matrix.routes.slice(0, baseline.routes.length)) === JSON.stringify(baseline.routes), 'an existing route row or assertion changed');
const route = matrix.routes.find((candidate) => candidate.id === 'ROUTE-PLAN17-APPENDED-ITEM-REACHABLE');
require(route && route.actions.length === 121, 'the appended learner-reach route is missing or incomplete');
require(route.actions.at(-1).target === '.app-next-button', 'the appended route does not activate completion-gated Next to Plan 17');

const combinations = new Set();
let keyboardScenarioCount = 0;
let touchScenarioCount = 0;
let linearScenarioCount = 0;
let reducedMotionScenarioCount = 0;
for (const item of data.scenarios) {
  const { scenario, accepted, reflection, replay, helpCopy, recovery, hiddenLeakRejected, hiddenLeakDiagnostic, tabRecovery, falsification, resetWithholding } = item;
  combinations.add(`${scenario.target}/${scenario.condition}/${scenario.support}`);
  if (scenario.interaction === 'keyboard') keyboardScenarioCount += 1;
  if (scenario.interaction === 'touch') touchScenarioCount += 1;
  if (scenario.view === 'linear') linearScenarioCount += 1;
  if (scenario.reducedMotion) reducedMotionScenarioCount += 1;
  require(helpCopy && helpCopy.trim().length > 0, `${scenario.id}: help content was missing`);
  require(recovery && recovery.trim().length > 0, `${scenario.id}: wrong learner answer lacked recovery`);
  require(hiddenLeakRejected === true, `${scenario.id}: hidden-sibling leakage seed did not fail the withholding assertion`);
  require(typeof hiddenLeakDiagnostic === 'string'
    && hiddenLeakDiagnostic.includes('forbiddenFormsInDomText')
    && hiddenLeakDiagnostic.includes('hiddenLabels')
    && hiddenLeakDiagnostic.includes('data-answer'),
  `${scenario.id}: hidden seed did not prove text, ARIA, and arbitrary data-attribute detection`);
  if (scenario.interaction === 'keyboard') {
    require(tabRecovery?.length > 0, `${scenario.id}: no sequential Tab recovery record was saved`);
    require(tabRecovery.at(-1)?.includes('app-return-button'), `${scenario.id}: sequential Tab walk did not reach Return`);
  }
  require(accepted.rowBounds?.length === 2, `${scenario.id}: both whole rows are not measured after acceptance`);
  require(accepted.questionReachable && accepted.controlsReachable, `${scenario.id}: accepted question/control is outside the reachable viewport`);
  require(reflection && replay, `${scenario.id}: reflection or Replay stage is absent`);
  require(resetWithholding?.stackCount === 0, `${scenario.id}: reset retained result display data`);
  if (scenario.view === 'visual') {
    const denominator = Number(scenario.target);
    const remainder = accepted.segments[1]?.filter((segment) => segment.shaded).length;
    require(item.stackFact?.rows?.length === 2, `${scenario.id}: stack fact is missing either whole`);
    require(item.stackFact.rows.every((row) => row.unitCount === denominator), `${scenario.id}: stack rows use inconsistent unit counts`);
    require(item.stackFact.rows[0].shaded === denominator && item.stackFact.rows[1].shaded === remainder,
      `${scenario.id}: stack shading is not the truthful whole and remainder`);
    require(Math.abs(item.stackFact.rows[0].width - item.stackFact.rows[1].width) < 1,
      `${scenario.id}: whole rows have different widths`);
    for (const row of accepted.segments) {
      require(row.length === denominator, `${scenario.id}: a row lost or added unit subdivisions`);
      const widths = row.map((segment) => segment.width);
      require(Math.max(...widths) - Math.min(...widths) <= 1.1,
        `${scenario.id}: equal unit subdivisions differ by more than browser pixel rounding`);
    }
    require(falsification?.rejectsTruncatedRemainder, `${scenario.id}: truncation seed was not rejected`);
    require(falsification?.rejectsResizedSecondWhole, `${scenario.id}: unequal-width seed was not rejected`);
    require(falsification?.rejectsCorruptRenderedFact, `${scenario.id}: corrupted-rendered-fact seed was not rejected`);
    require(falsification?.restoredWitnessPasses, `${scenario.id}: restored clean witness did not pass`);
  } else {
    const denominator = BigInt(scenario.target);
    const [rawNumerator] = item.stackFact.raw.split(' over ').map(BigInt);
    const remainder = rawNumerator - denominator;
    require(item.stackFact.rows?.length === 2
      && item.stackFact.rows[0] === `${denominator} of ${denominator} equal parts`
      && item.stackFact.rows[1] === `${remainder} of ${denominator} equal parts`,
    `${scenario.id}: linear result rows do not retain truthful quantities`);
  }
  for (const stage of [accepted, reflection, replay]) {
    require(stage.horizontalOverflow === false, `${scenario.id}/${stage.stage}: horizontal overflow was measured`);
    require(Number.isFinite(stage.scrollHeight) && Number.isFinite(stage.scrollY) && Number.isFinite(stage.scrollMax), `${scenario.id}/${stage.stage}: vertical scroll data is incomplete`);
  }
  for (const stage of ['accepted', 'reflection', 'replay']) {
    const filename = `${scenario.id}-${stage}.png`;
    const stat = await fs.stat(path.join(captureDir, filename));
    require(stat.size > 1000, `${filename}: missing or empty screenshot`);
  }
}

require(combinations.size === 16, `expected all 12/24 x four conditions x two support profiles; found ${combinations.size} combinations`);
require(keyboardScenarioCount >= 1, 'no real sequential Tab navigation scenario was captured');
require(touchScenarioCount >= 1, 'no touch activation scenario was captured');
require(linearScenarioCount >= 1, 'no linear participation scenario was captured');
require(reducedMotionScenarioCount >= 1, 'no reduced-motion scenario was captured');

console.log(JSON.stringify({
  valid: true,
  scenarios: data.scenarios.length,
  routePrefixPreserved: baseline.routes.length,
  appendedRouteActions: route.actions.length,
  keyboardScenarios: keyboardScenarioCount,
  touchScenarios: touchScenarioCount,
  linearScenarios: linearScenarioCount,
  reducedMotionScenarios: reducedMotionScenarioCount,
  screenshots: data.scenarios.length * 3,
}, null, 2));
