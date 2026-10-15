import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const measurements = JSON.parse(readFileSync(path.join(evidenceDir, 'browser-measurements.json'), 'utf8'));
const expected = [
  ['visual-740', 'visual', 740, 'high-support'],
  ['linear-752', 'linear', 752, 'medium-support'],
];
const errors = [];
function requireEvidence(condition, message) {
  if (!condition) errors.push(message);
}

requireEvidence(measurements.plan === 'plan-20', 'measurements must identify Plan 20');
requireEvidence(measurements.motion === 'prefers-reduced-motion', 'measurements must identify reduced motion');
requireEvidence(measurements.entryScreens?.length === 2, 'entry button layout must be measured at both reference viewport heights');
for (const [entry, height] of measurements.entryScreens?.map((row) => [row, row.viewport?.height]) || []) {
  requireEvidence(entry.viewport?.width === 360 && [740, 752].includes(height), `${entry.screenshot} must use a required 360px viewport`);
  requireEvidence(entry.practiceButtons?.length === 2, `${entry.screenshot} must show both practice goals`);
  requireEvidence(entry.practiceButtons?.map((button) => button.id).join(',')
    === 'sum-under-one,like-denominator-addition', `${entry.screenshot} must preserve goal order`);
  requireEvidence(entry.practiceButtons?.every((button) => !button.disabled), `${entry.screenshot} must show both goals enabled`);
  requireEvidence(entry.document?.scrollWidth <= entry.viewport.width, `${entry.screenshot} must not overflow horizontally`);
  try {
    requireEvidence(statSync(path.join(evidenceDir, entry.screenshot)).size > 0, `${entry.screenshot} must exist and be nonempty`);
  } catch {
    errors.push(`${entry.screenshot} is missing`);
  }
}
const fragment = measurements.fragmentLaunch;
requireEvidence(fragment?.activeFragment === 'like-denominator-addition', 'direct fragment launch must start the same-denominator goal');
requireEvidence(fragment?.visibleEntry === false, 'fragment launch must bypass the entry screen into an active episode');
requireEvidence(fragment?.hiddenSkippedControls === 0, 'fragment launch must not mount skipped response controls');
requireEvidence(fragment?.reflectionControls === 0, 'fragment launch must not mount reflection controls');
try {
  requireEvidence(statSync(path.join(evidenceDir, fragment.screenshot)).size > 0, 'fragment launch screenshot must exist and be nonempty');
} catch {
  errors.push('fragment launch screenshot is missing');
}
for (const [key, pathName, height, support] of expected) {
  const rows = measurements.evidence.filter((row) => row.viewport?.height === height
    && (row.label === 'pre-response absence checks' || row.screenshot?.includes(key)));
  requireEvidence(rows.length >= 6, `${key} must include absence, notice recovery, arithmetic recovery, visible help, accepted result and completion evidence`);
  const preResponse = rows.find((row) => row.label === 'pre-response absence checks');
  requireEvidence(preResponse?.skippedControlsAbsent === true, `${key} must verify skipped decision and conversion controls are absent`);
  requireEvidence(preResponse?.answerAndUnlikeTaskTextAbsent === true, `${key} must verify answer and unrelated task copy do not leak before response`);
  requireEvidence(preResponse?.scanSurfaces?.includes('all mounted textContent including hidden descendants') === true,
    `${key} must include hidden mounted text in the answer and skipped-task scan`);
  requireEvidence(preResponse?.scanSurfaces?.includes('aria-label') === true
    && preResponse?.scanSurfaces?.includes('aria-description') === true
    && preResponse?.scanSurfaces?.includes('aria-valuetext') === true,
  `${key} must include accessible text attributes in the answer and skipped-task scan`);
  const rejectedSeedKinds = new Set(preResponse?.absenceScan?.rejected?.map((seed) => seed.kind));
  requireEvidence(preResponse?.absenceScan?.rejected?.length === 3
    && preResponse.absenceScan.rejected.every((seed) => seed.rejectedAt === 'pre-response absence assertion'),
  `${key} must reject stale content/recovery and accessible-answer seeds at the absence assertion`);
  requireEvidence(rejectedSeedKinds.has('stale-conversion-content')
    && rejectedSeedKinds.has('unlike-denominator-recovery-copy')
    && rejectedSeedKinds.has('accessible-label'),
  `${key} must include independent conversion, unlike-denominator recovery and accessible-answer failure seeds`);
  requireEvidence(preResponse?.absenceScan?.restoredCleanRun === true,
    `${key} must pass the absence check again after restoring the clean DOM`);
  requireEvidence(preResponse?.reflectionControls === 0, `${key} must verify no reflection control is mounted before response`);
  const captures = rows.filter((row) => row.screenshot);
  for (const row of captures) {
    try {
      requireEvidence(statSync(path.join(evidenceDir, row.screenshot)).size > 0, `${row.screenshot} must exist and be nonempty`);
    } catch {
      errors.push(`${row.screenshot} is missing`);
    }
    requireEvidence(row.activePath === pathName, `${row.screenshot} must show the ${pathName} learner path`);
    requireEvidence(row.supportLevel === support, `${row.screenshot} must show the selected ${support} profile`);
    requireEvidence(row.conditionId === 'phase2-bundle-1', `${row.screenshot} must preserve the route-declared condition`);
    requireEvidence(row.hiddenConversionOrDecisionControls === 0, `${row.screenshot} must have no mounted conversion or denominator decision controls`);
    requireEvidence(row.reflectionControls === 0, `${row.screenshot} must have no reflection controls`);
    requireEvidence(row.viewport?.width === 360 && row.viewport?.height === height, `${row.screenshot} must use 360x${height}`);
    requireEvidence(row.document?.scrollWidth <= row.viewport.width, `${row.screenshot} must not have horizontal document overflow`);
    requireEvidence(row.reachability?.length > 0, `${row.screenshot} must record ordinary-scroll reachability measurements`);
    requireEvidence(row.reachability?.every((target) => target.reachable && target.height > 0),
      `${row.screenshot} must make each measured question, control or guidance surface reachable by ordinary scrolling`);
  }
  const notice = captures.find((row) => row.screenshot.includes('wrong-notice'));
  const arithmetic = captures.find((row) => row.screenshot.includes('5-over-14-recovery'));
  const help = captures.find((row) => row.screenshot.includes('local-help'));
  const accepted = captures.find((row) => row.screenshot.includes('accepted-10-over-14'));
  const finished = captures.find((row) => row.screenshot.includes('finished'));
  for (const [name, row] of [['wrong Notice', notice], ['5/14 recovery', arithmetic], ['help', help], ['accepted response', accepted]]) {
    requireEvidence(row?.reachability?.some((target) => target.name === 'question' && target.reachable) === true,
      `${key} ${name} question must be fully reachable through ordinary scrolling`);
    requireEvidence(row?.reachability?.some((target) => target.name === 'task-controls' && target.reachable) === true,
      `${key} ${name} controls must be fully reachable through ordinary scrolling`);
  }
  requireEvidence(notice?.feedbackText === 'Both bars have 7 equal parts. Those parts are the same size.', `${key} must capture the authored same-unit notice recovery`);
  requireEvidence(arithmetic?.feedbackText === 'The denominator stays the same. Add only the top numbers.', `${key} must capture 5/14 recovery copy`);
  requireEvidence(arithmetic?.responseFields?.length === 2, `${key} recovery capture must show both response fields`);
  requireEvidence(help?.helpCueText === 'Add the top numbers. Keep the same bottom number.' && help?.helpExpanded === 'true', `${key} must show the open, visible, task-local help cue`);
  requireEvidence(help?.reachability?.some((target) => target.name === 'help-guidance' && target.reachable) === true,
    `${key} must verify that open local help can be reached by ordinary scrolling`);
  requireEvidence(new Set(arithmetic?.numericEntry?.fieldActions?.filter((action) => action.action === 'tap').map((action) => action.field)).size === 2,
    `${key} incorrect-answer fields must be tapped before browser-assisted text entry`);
  requireEvidence(arithmetic?.numericEntry?.physicalDeviceTyping === 'not tested',
    `${key} must label physical device typing as untested`);
  requireEvidence(accepted?.visibleText?.includes('10/14') === true, `${key} must preserve equivalent unsimplified 10/14 in the completed summary`);
  requireEvidence(accepted?.visibleText?.includes('That names the same amount.') === true, `${key} must use the brief equivalent-answer success cue`);
  if (pathName === 'visual') {
    requireEvidence(accepted?.keyboardNavigation?.correction === 'Control+A then page.keyboard.type("10")'
      && accepted?.keyboardNavigation?.submit === 'Tab to Check then page.keyboard.press("Enter")',
    'visual equivalent repair must use actual page keyboard navigation from observed focus');
    requireEvidence(finished?.finishFocus?.action === 'page keyboard Tab navigation then Enter'
      && finished?.finishFocus?.focusedEpisodeLandmarkAfterAction === true
      && finished?.finishFocus?.keyboardTabSequence?.length > 0,
    'visual completion must use the keyboard and observe the episode landmark focus without repairing it');
  } else {
    requireEvidence(accepted?.keyboardNavigation === null,
      'linear touch-context entry must not be described as keyboard correction');
    requireEvidence(new Set(accepted?.numericEntry?.fieldActions?.filter((action) => action.action === 'tap').map((action) => action.field)).size === 2
      && accepted?.numericEntry?.physicalDeviceTyping === 'not tested',
    'linear equivalent-answer fields must be tapped before browser-assisted entry and leave physical typing untested');
    requireEvidence(finished?.finishFocus?.action === 'touch-context tap on Finish'
      && finished?.finishFocus?.focusedEpisodeLandmarkAfterAction === true,
    'linear Finish focus must be observed after its touch-context action');
  }
  requireEvidence(finished?.visibleText?.includes('You finished this problem.') === true, `${key} must capture successful completion`);
  requireEvidence(finished?.reachability?.some((target) => target.name === 'return-control' && target.reachable) === true,
    `${key} completion return control must be fully reachable through ordinary scrolling`);
  for (const row of captures.filter((candidate) => candidate.screenshot.includes('5-over-14-recovery'))) {
    requireEvidence(row.responseFields.every((field) => field.inputMode === 'numeric'
      && field.min === '1' && field.max === '999'), `${key} response fields must expose numeric entry with the reviewed bounds`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `FAIL: ${error}`).join('\n'));
  process.exit(1);
}
console.log('Plan 20 browser evidence verified: narrow entry layouts, direct fragment launch, declared support/condition profiles, both learner paths, recovery, numeric fields, skipped-control absence, no reflection and completion.');
