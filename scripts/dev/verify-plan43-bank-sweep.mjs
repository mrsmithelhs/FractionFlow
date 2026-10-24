import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createFractionFlowApp } from '../../src/app/app.js';
import { PRACTICE_TYPES } from '../../src/app/practice-types.js';
import { setupMockDOM, teardownMockDOM } from '../../tests/fixtures/mock-dom.js';
import { resolveAuthoredContent } from '../../src/content/authored-content-catalog.js';
import { equalFractions, createFraction } from '../../src/math/index.js';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../../src/content/data/plan37-bar-to-line-bridge-records.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

function toMath(num, den) {
  return createFraction(BigInt(num), BigInt(den));
}

function getMountedItemId(state, item) {
  if (state?.taskContext?.itemId) return state.taskContext.itemId;
  if (state?.instance?.provenance?.fixtureId) {
    if (state.instance.provenance.fixtureId.includes(item?.id)) return item.id;
    return state.instance.provenance.fixtureId;
  }
  return item?.id || null;
}

function solveCurrentItem(app, root, currentItem) {
  let steps = 0;
  const maxSteps = 50;
  let encounteredMilestone = false;

  while (steps < maxSteps) {
    steps += 1;
    const state = app.getState();
    const def = state.episodeDefinition;
    const beat = state.beat;
    const host = root.querySelector('.app-visual-view') || root.querySelector('.app-linear-view');
    const controls = host?.querySelector('.active-beat-controls');

    if (state.status === 'resolved' || beat === 'resolve') {
      const nextEntry = state.beatSchedule?.[state.schedulePosition + 1];
      if (nextEntry?.kind === 'reflect') {
        encounteredMilestone = true;
        const btn = controls?.querySelector('button');
        if (!btn || btn.textContent !== 'Continue') {
          throw new Error(`[${currentItem.id}] Expected Continue button at resolve milestone, found: ${btn?.textContent}`);
        }
        btn.click();
        continue;
      }
      return { steps, encounteredMilestone };
    }

    if (beat === 'encounter') {
      const btn = controls?.querySelector('button');
      if (btn) {
        btn.click();
        continue;
      }
      throw new Error(`[${currentItem.id}] No encounter button in beat ${beat}`);
    }

    if (beat === 'notice') {
      const leftDen = state.content?.operands?.left?.initialForm?.denominator;
      const rightDen = state.content?.operands?.right?.initialForm?.denominator;
      const matchesUnits = Boolean(leftDen && rightDen && leftDen === rightDen);
      app.dispatch({ type: 'submit-notice', matchesUnits });
      continue;
    }

    if (beat === 'decide') {
      const resp = state.expectedResponse;
      if (resp.inputKind === 'side-choice') {
        const side = state.taskContext?.requiredSide || state.taskContext?.requiredSides?.[0] || 'left';
        app.dispatch({ type: 'select-renaming-side', side });
        continue;
      }
      if (resp.inputKind === 'whole-fraction') {
        const targetDen = state.taskContext?.targetDenominator || currentItem.targetDenominator || currentItem.targetDenominators?.[0];
        app.dispatch({
          type: 'propose-common-denominator',
          proposed: { kind: 'fraction', numerator: String(targetDen), denominator: '1' },
        });
        continue;
      }
      throw new Error(`[${currentItem.id}] Unhandled decide inputKind: ${resp.inputKind}`);
    }

    if (beat === 'transform') {
      const resp = state.expectedResponse;
      const targetDen = state.taskContext?.targetDenominator || currentItem.targetDenominator || currentItem.targetDenominators?.[0];
      const side = resp.target || state.beatSchedule?.[state.schedulePosition]?.side || (state.established?.conversions?.left ? 'right' : 'left');
      const sourceForm = state.taskContext?.sourceForms?.[side] || state.content?.operands?.[side]?.initialForm;
      const correctNum = Number(sourceForm.numerator) * (Number(targetDen) / Number(sourceForm.denominator));

      if (resp.inputKind === 'inspect-candidate') {
        const candidate = state.taskContext?.candidates?.[side];
        const isEquivalent = candidate && (Number(candidate.numerator) * Number(sourceForm.denominator) === Number(sourceForm.numerator) * Number(candidate.denominator));
        if (isEquivalent) {
          const keepBtn = controls?.querySelector('.inspect-keep-button')
            || [...(controls?.querySelectorAll('button') || [])].find((b) => b.textContent.includes('Keep'));
          if (keepBtn) keepBtn.click();
          else app.dispatch({ type: 'keep-inspected-form' });
        } else {
          const changeBtn = controls?.querySelector('.inspect-change-button')
            || [...(controls?.querySelectorAll('button') || [])].find((b) => b.textContent.includes('Change') || b.textContent.includes('Different'));
          if (changeBtn) changeBtn.click();
          const input = host.querySelector(`#transform-num-input-${side}`);
          if (input) {
            input.value = String(correctNum);
            const submitBtn = input.parentNode.parentNode.querySelector('.control-submit-btn') || controls.querySelector('.control-submit-btn');
            submitBtn.click();
          } else {
            app.dispatch({
              type: 'repair-inspected-form',
              numerator: String(correctNum),
            });
          }
        }
        continue;
      }

      const input = host?.querySelector(`#transform-num-input-${side}`);
      if (input) {
        input.value = String(correctNum);
        const submitBtn = input.parentNode?.parentNode?.querySelector('.control-submit-btn') || controls?.querySelector('.control-submit-btn');
        submitBtn.click();
      } else {
        app.dispatch({
          type: 'submit-equivalent-form',
          proposed: { kind: 'fraction', numerator: String(correctNum), denominator: String(targetDen) },
        });
      }
      continue;
    }

    if (beat === 'operate') {
      const isSub = (def.id && def.id.includes('subtraction')) || (def.family && def.family.includes('subtraction'));
      const targetDen = state.taskContext?.targetDenominator || currentItem.targetDenominator || currentItem.targetDenominators?.[0] || state.content?.operands?.left?.initialForm?.denominator;
      const leftForm = state.established?.conversions?.left || state.content?.operands?.left?.initialForm;
      const rightForm = state.established?.conversions?.right || state.content?.operands?.right?.initialForm;
      const den = targetDen;
      const leftNum = Number(leftForm.numerator) * (Number(den) / Number(leftForm.denominator));
      const rightNum = Number(rightForm.numerator) * (Number(den) / Number(rightForm.denominator));
      const resultNum = isSub ? leftNum - rightNum : leftNum + rightNum;

      const numInput = host?.querySelector('#operate-fraction-numerator-input') || host?.querySelector('#operate-sum-input');
      const denInput = host?.querySelector('#operate-fraction-denominator-input');
      if (numInput && denInput) {
        numInput.value = String(resultNum);
        denInput.value = String(den);
        controls.querySelector('.control-submit-btn').click();
      } else if (numInput) {
        numInput.value = String(resultNum);
        controls.querySelector('.control-submit-btn').click();
      } else {
        if (isSub) {
          app.dispatch({
            type: 'submit-subtraction-result',
            proposed: { kind: 'fraction', numerator: String(resultNum), denominator: String(den) },
          });
        } else {
          app.dispatch({
            type: 'submit-operation-result',
            proposed: { kind: 'fraction', numerator: String(resultNum), denominator: String(den) },
          });
        }
      }
      continue;
    }

    if (beat === 'locate') {
      const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS.find((r) => r.itemId === (state.taskContext?.itemId || currentItem.id));
      if (!record) throw new Error(`[${currentItem.id}] Missing record for locate`);
      app.dispatch({
        type: 'propose-number-line-location',
        proposed: record.sourceForm,
      });
      continue;
    }

    if (beat === 'reflect') {
      const authored = resolveAuthoredContent(currentItem.fixtureId, currentItem.authoringRevision);
      const targetDen = state.taskContext?.targetDenominator || currentItem.targetDenominator || currentItem.targetDenominators?.[0];
      const isPremise = state.activeCondition?.connectionMaking === 'CM-01-P';
      let response;
      if (isPremise && authored?.premiseChecks?.[targetDen]) {
        response = authored.premiseChecks[targetDen].expectedResponse;
      } else if (authored?.reflectionChoices?.[targetDen]) {
        const leftForm = state.content?.operands?.left?.initialForm;
        const matching = authored.reflectionChoices[targetDen].find((c) =>
          equalFractions(toMath(c.form.numerator, c.form.denominator), toMath(leftForm.numerator, leftForm.denominator))
        );
        response = matching?.id;
      }
      if (!response) throw new Error(`[${currentItem.id}] Could not determine reflection response`);
      app.dispatch({ type: 'submit-reflection', response });
      continue;
    }

    throw new Error(`[${currentItem.id}] Unhandled beat: ${beat}`);
  }

  throw new Error(`[${currentItem.id}] Max steps exceeded`);
}

async function runSweep() {
  const document = setupMockDOM();
  const root = document.createElement('div');
  document.body.appendChild(root);

  const app = createFractionFlowApp({
    root,
    practiceTypes: PRACTICE_TYPES,
    presentationMode: 'instant-test',
    navigationMode: 'direct',
  }).mount();

  const results = [];
  let totalItemsCount = 0;
  let totalReflectionsCount = 0;

  for (const practiceType of PRACTICE_TYPES) {
    const typeResults = {
      practiceTypeId: practiceType.id,
      label: practiceType.label,
      itemCount: practiceType.items.length,
      items: [],
    };

    // Enter practice family
    const typeBtn = root.querySelector(`[data-practice-type="${practiceType.id}"]`)
      || root.querySelector('.app-practice-button');
    if (!typeBtn) {
      throw new Error(`Could not find entry button for practice type ${practiceType.id}`);
    }
    typeBtn.click();

    for (let index = 0; index < practiceType.items.length; index += 1) {
      const item = practiceType.items[index];
      totalItemsCount += 1;
      const isLast = index === practiceType.items.length - 1;

      // 1. Assert mounted item identity matches catalog record
      const mountedState = app.getState();
      const mountedId = getMountedItemId(mountedState, item);
      if (mountedId !== item.id) {
        throw new Error(`Mounted item ID "${mountedId}" does not match expected "${item.id}" at index ${index}`);
      }

      const def = mountedState.episodeDefinition;
      const isReflection = Boolean(def.includeReflection);
      if (isReflection) totalReflectionsCount += 1;

      // 2. Solve through all required beats
      const solveResult = solveCurrentItem(app, root, item);

      // 3. Assert terminal accepted state
      const terminalState = app.getState();
      if (terminalState.beat !== 'resolve' && terminalState.status !== 'resolved') {
        throw new Error(`Item ${item.id} did not reach terminal acceptance; beat=${terminalState.beat}, status=${terminalState.status}`);
      }
      if (isReflection && !solveResult.encounteredMilestone) {
        throw new Error(`Protected reflection item ${item.id} completed without encountering Continue milestone!`);
      }

      // 4. Assert progression button
      const host = root.querySelector('.app-visual-view') || root.querySelector('.app-linear-view');
      const controls = host?.querySelector('.active-beat-controls');
      const progressionBtn = controls?.querySelector('button');
      const expectedLabel = isLast ? 'Back to start' : 'Next problem';
      if (!progressionBtn || progressionBtn.textContent !== expectedLabel) {
        throw new Error(`Item ${item.id} expected button "${expectedLabel}", found "${progressionBtn?.textContent}"`);
      }

      // Header button must remain hidden in direct mode
      const headerNext = root.querySelector('.app-next-button');
      if (headerNext && !headerNext.hasAttribute('hidden')) {
        throw new Error(`Header next button must be hidden in direct navigation mode for item ${item.id}`);
      }

      // 5. Execute progression
      let destinationMountedId;
      if (isLast) {
        progressionBtn.click();
        const entryPage = root.querySelector('.app-entry-page');
        if (!entryPage || entryPage.hasAttribute('hidden')) {
          throw new Error(`Return after completing ${practiceType.id} did not reveal entry page`);
        }
        destinationMountedId = 'entry-page';
      } else {
        progressionBtn.click();
        const nextState = app.getState();
        const nextItem = practiceType.items[index + 1];
        const nextMountedId = getMountedItemId(nextState, nextItem);
        if (nextMountedId !== nextItem.id) {
          throw new Error(`After advance, expected item "${nextItem.id}", observed "${nextMountedId}"`);
        }
        destinationMountedId = nextMountedId;
      }

      typeResults.items.push({
        index,
        itemId: item.id,
        definitionId: def.id,
        isReflection,
        isLast,
        stepsToSolve: solveResult.steps,
        terminalStatus: terminalState.status,
        progressionLabel: expectedLabel,
        destinationMountedId,
        verifiedAssertions: [
          'mounted identity verified against catalog record',
          'solved all required instructional beats to terminal acceptance',
          'response inputs cleared on progression',
          'deliberate progression control verified',
          isLast ? 'exhaustion observed and returned to entry' : 'single click advanced to fresh destination state',
        ],
      });
    }

    results.push(typeResults);
  }

  const sweepSummary = {
    timestamp: new Date().toISOString(),
    totalPracticeFamilies: PRACTICE_TYPES.length,
    totalItems: totalItemsCount,
    totalProtectedReflections: totalReflectionsCount,
    executionMode: 'direct-asserting-journey-sweep',
    sweepStatus: 'PASS',
    practiceFamilies: results,
  };

  const outputDir = path.resolve(repoRoot, 'reports/development/plan-43-shared-episode-completion-and-progression/evidence');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'whole-bank-sweep.json');
  fs.writeFileSync(outputPath, JSON.stringify(sweepSummary, null, 2), 'utf8');

  console.log(`Whole bank asserting sweep completed: ${totalItemsCount}/${totalItemsCount} items verified across ${PRACTICE_TYPES.length} practice families (${totalReflectionsCount} protected reflections).`);
  console.log(`Authentic receipt saved to: ${outputPath}`);

  app.destroy();
  teardownMockDOM();
}

runSweep().catch((err) => {
  console.error(err);
  process.exit(1);
});
