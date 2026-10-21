import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../../src/content/data/plan37-bar-to-line-bridge-records.js';

const action = (method, target, extra = {}) => ({ method, target, ...extra });
const isSame = (a, b) => BigInt(a.numerator) * BigInt(b.denominator) === BigInt(b.numerator) * BigInt(a.denominator);

function candidateIndex(record, view, profile) {
  const candidates = profile === 'high-support'
    ? Array.from({ length: Number(record.partitionDenominator) + 1 }, (_, index) => ({
      id: `partition-${index}-of-${record.partitionDenominator}`,
      form: { numerator: String(index), denominator: record.partitionDenominator },
    }))
    : record.sparseCandidates;
  const index = candidates.findIndex(({ form }) => isSame(form, record.sourceForm));
  if (index < 0) throw new Error(`No offered correct candidate for ${record.itemId}`);
  return { index, id: candidates[index].id, count: candidates.length };
}

export function buildPlan39BridgeActions({ view, supportProfile, startAt = 0, endAt = 7, returnReentry = false, stopBeforeCheck = false, inputMode = 'mouse' } = {}) {
  if (!['visual', 'linear'].includes(view) || !['high-support', 'medium-support'].includes(supportProfile)) {
    throw new TypeError('Plan39 route requires a supported view and support profile');
  }
  const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
  const actions = [];
  const activeProfile = supportProfile;
  const activate = (target, extra = {}) => action(inputMode === 'touch' ? 'tap' : inputMode === 'keyboard' ? 'pressKey' : 'click', target, inputMode === 'keyboard' ? { value: 'Enter', ...extra } : extra);
  for (let index = 0; index <= endAt; index += 1) {
    const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[index];
    const { id, index: selectedIndex, count } = candidateIndex(record, view, activeProfile);
    if (index < startAt) {
      actions.push(activate(`${host} .plan39-continue`, { description: `Plan39 advance ${record.itemId} to locate` }));
      if (view === 'visual') {
        for (let step = 0; step <= selectedIndex; step += 1) actions.push(activate(`${host} .plan39-stepper-next`, { description: `Plan39 preview correct point ${record.itemId}` }));
      } else {
        actions.push(action('focus', `${host} .plan39-candidates .plan39-candidate:first-of-type input`, { description: `Plan39 focus radio group ${record.itemId}` }));
        actions.push(action('pressKey', `${host} .plan39-candidates .plan39-candidate:first-of-type input`, { value: 'Space', description: `Plan39 choose first radio ${record.itemId}` }));
        for (let step = 0; step < selectedIndex; step += 1) actions.push(action('pressKey', `${host} input[type="radio"]:checked`, { value: 'ArrowRight', description: `Plan39 keyboard move to offered source candidate ${record.itemId}` }));
      }
      actions.push(activate(`${host} .plan39-check-position`, { description: `Plan39 explicitly confirm ${record.itemId}` }));
      actions.push(activate(`${host} .plan39-finish`, { description: `Plan39 finish ${record.itemId}` }));
      actions.push(activate('.app-next-button', { description: `Plan39 advance to ${PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[index + 1]?.itemId ?? 'exhaustion'}` }));
      continue;
    }
    actions.push(activate(`${host} .plan39-continue`, { description: `Plan39 ${record.itemId}: enter locate` }));
    if (view === 'visual') {
      for (let step = 0; step <= selectedIndex; step += 1) actions.push(activate(`${host} .plan39-stepper-next`, { description: `Plan39 ${record.itemId}: preview ${step + 1}/${count}` }));
    } else {
      actions.push(action('focus', `${host} .plan39-candidates .plan39-candidate:first-of-type input`, { description: `Plan39 ${record.itemId}: focus native radio group` }));
      actions.push(action('pressKey', `${host} .plan39-candidates .plan39-candidate:first-of-type input`, { value: 'Space', description: `Plan39 ${record.itemId}: select first native radio` }));
      for (let step = 0; step < selectedIndex; step += 1) actions.push(action('pressKey', `${host} input[type="radio"]:checked`, { value: 'ArrowRight', description: `Plan39 ${record.itemId}: navigate native radios by keyboard` }));
    }
    actions.push(action('assert', host, {
      assertions: [
        { type: 'hasSelector', target: `${host} .plan39-check-position` },
        { type: 'notHasSelector', target: `${host} .plan39-feedback` },
        { type: 'notHasSelector', target: `${host} .plan39-finish` },
        { type: 'plan39LocateContract' },
      ],
      description: `Plan39 ${record.itemId}: preview without grading, recovery, or resolve controls`,
    }));
    if (stopBeforeCheck && index === endAt) break;
    actions.push(activate(`${host} .plan39-check-position`, { description: `Plan39 ${record.itemId}: real Check Position submission` }));
    actions.push(action('assert', host, {
      assertions: [
        { type: 'hasSelector', target: `${host} .plan39-finish` },
        { type: 'notHasSelector', target: `${host} .plan39-check-position` },
        { type: 'notHasSelector', target: `${host} .plan39-feedback` },
      ],
      description: `Plan39 ${record.itemId}: resolve state is gated behind successful Check position`,
    }));
    if (view === 'visual') actions.push(action('assert', host, { assertions: [{ type: 'plan39ResolveConnector' }], description: `Plan39 ${record.itemId}: source-to-point connector geometry` }));
    actions.push(activate(`${host} .plan39-finish`, { description: `Plan39 ${record.itemId}: continue from resolve` }));
    if (index < 7) actions.push(activate('.app-next-button', { description: `Plan39 advance after ${record.itemId}` }));
    else if (returnReentry) {
      actions.push(action('assert', host, { assertions: [{ type: 'containsText', target: '.app-navigation-notice', value: 'You’ve tried every problem in this set.' }], description: 'Plan39 verify exhaustion after eighth item' }));
      actions.push(activate('.app-return-button', { description: 'Plan39 return from exhaustion' }));
      actions.push(activate('[data-practice-type="bar-to-line-same-amount"]', { description: 'Plan39 re-enter bridge set' }));
      actions.push(action('assert', host, { assertions: [{ type: 'containsText', target: `${host} .plan39-continue`, value: 'Continue' }], description: 'Plan39 re-entry begins at encounter' }));
    }
  }
  return actions;
}

export function buildPlan39RecoveryActions({ view = 'visual', supportProfile = 'medium-support', inputMode = 'mouse' } = {}) {
  const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
  const activate = (target, extra = {}) => action(inputMode === 'touch' ? 'tap' : inputMode === 'keyboard' ? 'pressKey' : 'click', target, inputMode === 'keyboard' ? { value: 'Enter', ...extra } : extra);
  const cases = [
    { item: 0, wrongIndex: 0, profile: 'high-support', feedback: 'That point is at an end.' },
    { item: 1, wrongIndex: 2, profile: 'medium-support', feedback: 'That point is too close to one.' },
    { item: 3, wrongIndex: 1, profile: 'high-support', feedback: 'Check which side of one half this amount is on.' },
    { item: 6, wrongIndex: 0, profile: 'medium-support', feedback: 'That point is too close to zero.' },
  ];
  const actions = [];
  const selectIndex = (record, candidateIndex, profile = 'medium-support') => {
    const options = profile === 'high-support'
      ? Array.from({ length: Number(record.partitionDenominator) + 1 }, (_, index) => ({ id: `partition-${index}-of-${record.partitionDenominator}` }))
      : record.sparseCandidates;
    const selected = options[candidateIndex];
    if (!selected) throw new Error(`Candidate index ${candidateIndex} is not offered for ${record.itemId}`);
    if (view === 'visual') {
      for (let step = 0; step <= candidateIndex; step += 1) actions.push(activate(`${host} .plan39-stepper-next`, { description: `Plan39 ${record.itemId}: preview point ${step + 1}` }));
    } else actions.push(activate(`${host} input[data-candidate-id="${selected.id}"]`, { description: `Plan39 ${record.itemId}: preview offered radio ${selected.id}` }));
    return selected.id;
  };
  const completeCorrect = (index) => {
    const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[index];
    const correct = candidateIndex(record, view, 'medium-support');
    actions.push(activate(`${host} .plan39-continue`, { description: `Plan39 ${record.itemId}: enter locate` }));
    selectIndex(record, correct.index);
    actions.push(activate(`${host} .plan39-check-position`, { description: `Plan39 ${record.itemId}: explicitly confirm correct offered location` }));
    actions.push(activate(`${host} .plan39-finish`, { description: `Plan39 ${record.itemId}: finish` }));
    actions.push(activate('.app-next-button', { description: `Plan39 advance after ${record.itemId}` }));
  };
  let currentIndex = 0;
  for (const test of cases) {
    while (currentIndex < test.item) { completeCorrect(currentIndex); currentIndex += 1; }
    const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[test.item];
    actions.push(activate(`${host} .plan39-continue`, { description: `Plan39 recovery ${record.itemId}: enter locate` }));
    const wrongId = selectIndex(record, test.wrongIndex);
    if (test.item === 0) {
      actions.push(activate('.app-support-controls > .app-secondary-button:not(.app-replay-button):not(.app-restart-button)', { description: 'Plan39 recovery: open help while preview is pending' }));
      actions.push(activate('.app-view-controls .app-secondary-button', { description: 'Plan39 recovery: carry pending preview/help into linear view' }));
      actions.push(action('assert', '', { assertions: [{ type: 'plan39PreviewId', value: wrongId }], description: 'Plan39 recovery: pending preview survived first remount' }));
      actions.push(activate('.app-view-controls .app-secondary-button', { description: 'Plan39 recovery: carry pending preview/help back to visual view' }));
      actions.push(action('assert', '', { assertions: [{ type: 'plan39PreviewId', value: wrongId }], description: 'Plan39 recovery: pending preview survived second remount' }));
      actions.push(activate('.app-support-controls > .app-secondary-button:not(.app-replay-button):not(.app-restart-button)', { description: 'Plan39 recovery: close preserved help' }));
    }
    actions.push(activate(`${host} .plan39-check-position`, { description: `Plan39 recovery ${record.itemId}: submit wrong point` }));
    actions.push(action('assert', host, { assertions: [{ type: 'containsText', target: `${host} .plan39-feedback`, value: test.feedback }], description: `Plan39 recovery ${record.itemId}: exact directional category` }));
    actions.push(activate('.app-support-controls > .app-secondary-button:not(.app-replay-button):not(.app-restart-button)', { description: `Plan39 recovery ${record.itemId}: open help` }));
    actions.push(action('assert', host, { assertions: [{ type: 'containsText', target: `${host} .plan39-help`, value: 'Compare the shaded part' }], description: `Plan39 recovery ${record.itemId}: help is available` }));
    actions.push(activate('.app-support-controls > .app-secondary-button:not(.app-replay-button):not(.app-restart-button)', { description: `Plan39 recovery ${record.itemId}: close help` }));
    const correct = candidateIndex(record, view, 'medium-support');
    selectIndex(record, correct.index);
    actions.push(activate(`${host} .plan39-check-position`, { description: `Plan39 recovery ${record.itemId}: retry with source-matching offered form` }));
    actions.push(activate(`${host} .plan39-finish`, { description: `Plan39 recovery ${record.itemId}: finish corrected response` }));
    currentIndex = test.item + 1;
    if (test.item < 7) actions.push(activate('.app-next-button', { description: `Plan39 recovery: advance after ${record.itemId}` }));
  }
  return actions;
}
