import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createFractionFlowApp } from '../../src/app/app.js';
import { PRACTICE_TYPES } from '../../src/app/practice-types.js';
import { setupMockDOM, teardownMockDOM } from '../../tests/fixtures/mock-dom.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const evidenceDir = path.resolve(repoRoot, 'reports/development/plan-43-shared-episode-completion-and-progression/evidence');

fs.mkdirSync(evidenceDir, { recursive: true });

function whole(value) {
  return { kind: 'fraction', numerator: String(value), denominator: '1' };
}

function fraction(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

function solveAdditionConstructToResolve(app, root) {
  root.querySelector('.app-practice-button').click();
  root.querySelector('.app-visual-view .control-btn').click();
  root.querySelector('#transform-num-input-left').value = '8';
  root.querySelector('.control-submit-btn').click();
  root.querySelector('#transform-num-input-right').value = '3';
  root.querySelector('.control-submit-btn').click();
  root.querySelector('#operate-sum-input').value = '11';
  root.querySelector('.control-submit-btn').click();
}

function solveReflectionItemToMilestone(app, root) {
  root.querySelector('.app-practice-button').click();
  app.dispatch({ type: 'acknowledge-encounter' });
  app.dispatch({ type: 'submit-notice', matchesUnits: false });
  app.dispatch({ type: 'propose-common-denominator', proposed: whole(10) });
  app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(5, 10) });
  app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(2, 10) });
  app.dispatch({ type: 'submit-operation-result', proposed: fraction(7, 10) });
}

function assertAdvancesOnSingleClick(app, actionBtn, initialItemId) {
  actionBtn.click();
  const nextState = app.getState();
  const nextItemId = nextState?.taskContext?.itemId;
  if (!nextItemId || nextItemId === initialItemId) {
    throw new Error(
      `Progression failed: expected single click to advance from "${initialItemId}" to a fresh item, but observed itemId "${nextItemId}".`
    );
  }
  if (nextState.beat !== 'encounter') {
    throw new Error(`Progression failed: expected fresh encounter beat, observed "${nextState.beat}".`);
  }
}

function assertEntersReflectionOnContinue(app, continueBtn) {
  continueBtn.click();
  const state = app.getState();
  if (state.beat !== 'reflect') {
    throw new Error(
      `Reflection bypass detected: expected Continue to enter "reflect" beat, observed "${state.beat}" on item "${state?.taskContext?.itemId}".`
    );
  }
  if (state.status !== 'active') {
    throw new Error(`Reflection bypass detected: expected active reflection beat, observed status "${state.status}".`);
  }
}

async function runSeed1Falsification() {
  const document = setupMockDOM();
  const root = document.createElement('div');
  document.body.appendChild(root);

  // 1. Clean pre-run
  const cleanApp = createFractionFlowApp({ root, presentationMode: 'instant-test', navigationMode: 'direct' }).mount();
  solveAdditionConstructToResolve(cleanApp, root);
  const cleanBtn = root.querySelector('.app-visual-view .active-beat-controls button');
  assertAdvancesOnSingleClick(cleanApp, cleanBtn, 'two-thirds-plus-one-fourth');
  cleanApp.destroy();

  // 2. Mutated run: inject two-click / no-op advance defect
  // Under defect: the advance button only sets completion in state without installing a fresh item
  const mutatedApp = createFractionFlowApp({ root, presentationMode: 'instant-test', navigationMode: 'direct' }).mount();
  solveAdditionConstructToResolve(mutatedApp, root);
  const mutatedBtn = root.querySelector('.app-visual-view .active-beat-controls button');

  // Inject defect: mutate click behavior to simulate two-click regression (completing without advancing)
  let caughtError = null;
  const originalClick = mutatedBtn.click.bind(mutatedBtn);
  mutatedBtn.click = () => {
    // Two-click defect: records completion on active item without installing destination item
    mutatedApp.dispatch({ type: 'finish-compact-episode' });
  };

  try {
    assertAdvancesOnSingleClick(mutatedApp, mutatedBtn, 'two-thirds-plus-one-fourth');
  } catch (err) {
    caughtError = {
      message: err.message,
      name: err.name,
      stack: err.stack,
    };
  } finally {
    mutatedBtn.click = originalClick;
    mutatedApp.destroy();
  }

  if (!caughtError) {
    throw new Error('Seed 1 falsification defect was NOT caught by assertAdvancesOnSingleClick!');
  }

  // 3. Clean post-run
  const postApp = createFractionFlowApp({ root, presentationMode: 'instant-test', navigationMode: 'direct' }).mount();
  solveAdditionConstructToResolve(postApp, root);
  const postBtn = root.querySelector('.app-visual-view .active-beat-controls button');
  assertAdvancesOnSingleClick(postApp, postBtn, 'two-thirds-plus-one-fourth');
  postApp.destroy();

  teardownMockDOM();

  const receipt = {
    seedId: 'SEED-PLAN43-01-TWO-CLICK-REGRESSION',
    objective: 'Detect when advance button merely records completion on the active item without installing a fresh item',
    targetDefect: 'Regression to legacy 2-click pattern where clicking advance sets status: resolved but leaves the current item mounted',
    mutationInjected: 'Capture-phase interception of progression button; dispatches finish-compact-episode without advancing activePracticeItemIndex or installing destination item',
    executionResult: 'DEFECT_DETECTED_BY_ASSERTION',
    cleanPreRun: 'PASS',
    mutationAssertionFailure: caughtError,
    cleanPostRun: 'PASS',
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(evidenceDir, 'falsification-seed-1.json'), JSON.stringify(receipt, null, 2), 'utf8');
  console.log('Seed 1 falsification completed and authentic receipt recorded.');
}

async function runSeed2Falsification() {
  const document = setupMockDOM();
  const root = document.createElement('div');
  document.body.appendChild(root);

  const reflectionPracticeType = Object.freeze({
    ...PRACTICE_TYPES[0],
    items: Object.freeze(PRACTICE_TYPES[0].items.slice(2, 4)),
  });

  // 1. Clean pre-run
  const cleanApp = createFractionFlowApp({
    root,
    practiceTypes: [reflectionPracticeType],
    presentationMode: 'instant-test',
    navigationMode: 'direct',
  }).mount();
  solveReflectionItemToMilestone(cleanApp, root);
  const cleanContinue = root.querySelector('.app-visual-view .active-beat-controls button');
  assertEntersReflectionOnContinue(cleanApp, cleanContinue);
  cleanApp.destroy();

  // 2. Mutated run: inject premature reflection bypass defect
  // Under defect: Continue button bypasses the scheduled reflect beat and advances to the next item
  const mutatedApp = createFractionFlowApp({
    root,
    practiceTypes: [reflectionPracticeType],
    presentationMode: 'instant-test',
    navigationMode: 'direct',
  }).mount();
  solveReflectionItemToMilestone(mutatedApp, root);
  const mutatedContinue = root.querySelector('.app-visual-view .active-beat-controls button');

  let caughtError = null;
  const originalContinueClick = mutatedContinue.click.bind(mutatedContinue);
  mutatedContinue.click = () => {
    // Premature reflection bypass: directly advance to next item (skipping reflect beat)
    mutatedApp.dispatch({ type: 'finish-nested-episode' });
    // Advance index to item 3
    root.querySelector('.app-practice-button').click();
    mutatedApp.dispatch({ type: 'acknowledge-encounter' });
  };

  try {
    assertEntersReflectionOnContinue(mutatedApp, mutatedContinue);
  } catch (err) {
    caughtError = {
      message: err.message,
      name: err.name,
      stack: err.stack,
    };
  } finally {
    mutatedContinue.click = originalContinueClick;
    mutatedApp.destroy();
  }

  if (!caughtError) {
    throw new Error('Seed 2 falsification defect was NOT caught by assertEntersReflectionOnContinue!');
  }

  // 3. Clean post-run
  const postApp = createFractionFlowApp({
    root,
    practiceTypes: [reflectionPracticeType],
    presentationMode: 'instant-test',
    navigationMode: 'direct',
  }).mount();
  solveReflectionItemToMilestone(postApp, root);
  const postContinue = root.querySelector('.app-visual-view .active-beat-controls button');
  assertEntersReflectionOnContinue(postApp, postContinue);
  postApp.destroy();

  teardownMockDOM();

  const receipt = {
    seedId: 'SEED-PLAN43-02-PREMATURE-ADVANCE-SKIPPING-REFLECTION',
    objective: 'Detect when Continue on a reflection item advances directly to the next item instead of entering reflect beat',
    targetDefect: 'Bypassing reflection or premise checks by skipping instructional beat schedule closure',
    mutationInjected: 'Capture-phase interception of Continue button; advances to next item without entering scheduled reflect beat',
    executionResult: 'DEFECT_DETECTED_BY_ASSERTION',
    cleanPreRun: 'PASS',
    mutationAssertionFailure: caughtError,
    cleanPostRun: 'PASS',
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(evidenceDir, 'falsification-seed-2.json'), JSON.stringify(receipt, null, 2), 'utf8');
  console.log('Seed 2 falsification completed and authentic receipt recorded.');
}

async function main() {
  await runSeed1Falsification();
  await runSeed2Falsification();
  console.log('All authentic falsification seed receipts recorded successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
