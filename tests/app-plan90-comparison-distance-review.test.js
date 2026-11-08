import { afterEach, expect, it } from 'vitest';
import { admitMagnitudeManifest, createMagnitudeSessionController, selectManagedComparisonDistance } from '../src/app/magnitude-session.js';
import { createComparisonRecordController } from '../src/app/comparison-record-controller.js';
import { emptyRoot } from '../src/app/comparison-record.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { applyIntent } from '../src/interaction/episode.js';
import { classifyReviewArea } from '../reports/development/plan-90-goal-linked-managed-practice/review-fit.js';

const select = ids => selectManagedComparisonDistance(entry => ids.includes(entry.itemId));
afterEach(() => teardownMockDOM());

it('fails closed on unknown experimental fit and uses measured working area', () => {
  const measure = { area: 263, font: 32, widths: [263, 263], scroll: 'visible', bodyScroll: 'visible' };
  expect(classifyReviewArea(measure)).toBe(true);
  expect(classifyReviewArea({ ...measure, area: 262, widths: [262, 262] })).toBe(false);
  expect(classifyReviewArea({ ...measure, widths: [263, 0] })).toBe(false);
  expect(classifyReviewArea({ ...measure, bodyScroll: 'hidden' })).toBe(false);
  expect(classifyReviewArea({ ...measure, font: 33 })).toBe(false);
  expect(classifyReviewArea(null)).toBe(false);
});

it('selects only the first-batch ordered slots, a designated substitute or one eligible fallback', () => {
  const all = ['plan45-compare-02', 'plan45-compare-08', 'plan45-compare-09', 'plan45-compare-10', 'distance-01', 'distance-04'];
  expect(select(all).entries.map(x => x.itemId)).toEqual(['plan45-compare-02', 'plan45-compare-09', 'plan45-compare-10', 'distance-01']);
  expect(select(all.filter(x => !['plan45-compare-02', 'plan45-compare-09'].includes(x))).entries.map(x => x.itemId)).toEqual(['plan45-compare-08', 'plan45-compare-10', 'distance-01']);
  expect(select(['distance-04']).entries.map(x => x.itemId)).toEqual(['distance-04']);
  expect(select([])).toBeNull();
  expect(selectManagedComparisonDistance(() => { throw Error('unknown fit'); })).toBeNull();
});

it('admits only exact review identities and legal slot order', () => {
  const manifest = select(['plan45-compare-02', 'plan45-compare-09', 'plan45-compare-10', 'distance-01']);
  expect(admitMagnitudeManifest(manifest).prepared).toHaveLength(4);
  for (const mutate of [
    m => m.entries.reverse(), m => { m.entries[0].itemRevision = 'wrong'; },
    m => { m.entries[1] = structuredClone(m.entries[0]); }, m => { m.entries[3].itemId = 'distance-04'; },
    m => { delete m.entries[1]; }, m => { m.extra = true; },
  ]) {
    const copy = structuredClone(manifest); mutate(copy);
    expect(() => admitMagnitudeManifest(copy)).toThrow();
  }
});

it('preserves the old opted-in comparison boundary without recording new managed identities', async () => {
  const record = createComparisonRecordController({ storage: { read: async () => emptyRoot('a'.repeat(32), true) } });
  await record.refresh();
  const session = createMagnitudeSessionController(select(['plan45-compare-02', 'distance-01']));
  expect(record.install(session.current().episode, session)).toBe(true);
  const alternate = createMagnitudeSessionController(select(['plan45-compare-08', 'distance-01']));
  expect(record.install(alternate.current().episode, alternate)).toBe(false);
  record.destroy();
});

it('invalidates other prepared tickets when a committed transition is rolled back', () => {
  const session = createMagnitudeSessionController(select(['plan45-compare-02', 'distance-01']));
  const original = session.current();
  const first = session.prepareTransition('restart', original.session, original.episode);
  const stale = session.prepareTransition('restart', original.session, original.episode);
  expect(session.commit(first.ticket)).toBe(true);
  expect(session.rollback(first.ticket)).toBe(true);
  expect(session.current().episode).toBe(original.episode);
  expect(session.commit(stale.ticket)).toBe(false);
  expect(session.rollback(first.ticket)).toBe(false);
});

it('rechecks only the unstarted review suffix and commits its change with Next', () => {
  let eligible = new Set(['plan45-compare-10', 'distance-01']);
  const session = createMagnitudeSessionController(select(['plan45-compare-02', 'plan45-compare-09', 'plan45-compare-10', 'distance-01']), 'high-support',
    { eligibleForNext: entry => eligible.has(entry.itemId) });
  const start = session.current();
  const resolved = applyIntent(start.episode, { type: 'submit-fraction-comparison', proposed: '>' });
  expect(session.updateEpisode(start.episode, resolved)).toBe(true);
  const before = session.current(), transition = session.prepareTransition('next', before.session, resolved);
  expect(transition.ok).toBe(true);
  expect(session.current().manifest.entries).toHaveLength(4);
  expect(session.commit(transition.ticket)).toBe(true);
  expect(session.current().manifest.entries.map(x => x.itemId)).toEqual(['plan45-compare-02', 'plan45-compare-10', 'distance-01']);
  expect(session.current().episode.taskContext.itemId).toBe('plan45-compare-10');
  expect(session.rollback(transition.ticket)).toBe(true);
  expect(session.current().episode).toBe(resolved);
  expect(session.current().manifest.entries).toHaveLength(4);
  eligible = new Set();
  const current = session.current();
  expect(session.prepareTransition('next', current.session, current.episode).reason).toBe('fit-exhausted');
  expect(session.current().episode).toBe(resolved);
});

it('rejects a transition if its fit snapshot changes after preparation', () => {
  let revision = 1;
  const session = createMagnitudeSessionController(select(['plan45-compare-02', 'distance-01']), 'high-support',
    { eligibleForNext: () => true, fitRevision: () => revision });
  const first = session.current();
  const resolved = applyIntent(first.episode, { type: 'submit-fraction-comparison', proposed: '>' });
  session.updateEpisode(first.episode, resolved);
  const current = session.current(), transition = session.prepareTransition('next', current.session, resolved);
  expect(transition.ok).toBe(true); revision += 1;
  expect(session.commit(transition.ticket)).toBe(false);
  expect(session.current().episode).toBe(resolved);
  expect(session.current().manifest.entries).toHaveLength(2);
});

it('restores the episode, draft, usable controls and focus after a post-mount restart failure', () => {
  const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
  let fail = false;
  const manifest = select(['plan45-compare-02', 'distance-01']);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test', sessionTestHooks: {
    selectManifest: () => manifest, afterDisplay: () => { if (fail) throw Error('forced after mount'); },
  } }).mount();
  root.querySelector('[data-session-entry="comparison"]').click();
  const findButton = label => [...root.querySelectorAll('button')].find(x => x.textContent === label && !x.hasAttribute('hidden'));
  findButton('Use the same denominator').click();
  let input = root.querySelector('.app-visual-view .plan49-helper-input'); input.value = '8'; input.dispatchEvent({ type: 'input' });
  const before = app.getState(); fail = true; findButton('Try this problem again').click();
  expect(app.getState()).toBe(before);
  input = root.querySelector('.app-visual-view .plan49-helper-input'); expect(input.value).toBe('8');
  expect(doc.activeElement).toBe(root.querySelector('.app-navigation-notice'));
  input.value = '16'; input.dispatchEvent({ type: 'input' }); expect(input.value).toBe('16');
  fail = false; findButton('Try this problem again').click();
  expect(app.getState().taskContext.itemId).toBe('plan45-compare-02');
  expect(app.getState()).not.toBe(before); app.destroy();
});

it('keeps a completed episode and its working Next control after post-mount failure', () => {
  const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
  let fail = false;
  const manifest = select(['plan45-compare-02', 'plan45-compare-09', 'distance-01']);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test', sessionTestHooks: {
    selectManifest: () => manifest, afterDisplay: () => { if (fail) throw Error('forced after mount'); },
  } }).mount();
  root.querySelector('[data-session-entry="comparison"]').click();
  const input = [...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(x => x.value === '>');
  input.checked = true; input.dispatchEvent({ type: 'change' });
  root.querySelector('.app-visual-view .plan45-response-region').dispatchEvent({ type: 'submit', preventDefault() {} });
  const before = app.getState(); expect(before.status).toBe('resolved');
  fail = true; root.querySelector('.app-visual-view .plan45-progression-button').click();
  expect(app.getState()).toBe(before); expect(doc.activeElement).toBe(root.querySelector('.app-navigation-notice'));
  expect(root.querySelector('.app-visual-view .plan45-progression-button')).toBeTruthy();
  fail = false; root.querySelector('.app-visual-view .plan45-progression-button').click();
  expect(app.getState().taskContext.itemId).toBe('plan45-compare-09'); app.destroy();
});
