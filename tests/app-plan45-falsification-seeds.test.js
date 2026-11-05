import { afterAll, afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createFractionFlowApp } from '../src/app/app.js';
import { compareFractions, createFraction } from '../src/math/index.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

const evidence = [];

function exactRelation(forms) {
  const first = createFraction(BigInt(forms.first.numerator), BigInt(forms.first.denominator));
  const second = createFraction(BigInt(forms.second.numerator), BigInt(forms.second.denominator));
  const order = compareFractions(first, second);
  return order < 0 ? '<' : order > 0 ? '>' : '=';
}

function mount() {
  const document = setupMockDOM();
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
  openChooser(root); root.querySelector('[data-practice-type="symbolic-fraction-comparison"]').click();
  return { root, app, document };
}

function assertNoPrematureAcceptedMeaning(root, state) {
  expect(state.status).toBe('active');
  expect(root.querySelector('.plan45-model-pair, .plan45-linear-model-pair')).toBeNull();
  expect(root.querySelector('[data-expected-relation], [data-correct="true"], [data-answer]')).toBeNull();
}

function recordFailure(seed, mutation, runOrdinaryAssertion, recover) {
  let observed = null;
  try {
    runOrdinaryAssertion();
  } catch (error) {
    observed = String(error?.message || error);
  }
  expect(observed, `${seed}: mutated state must violate an ordinary assertion`).toBeTruthy();
  recover();
  evidence.push({ seed, mutation, observedAssertionFailure: observed, cleanRecovery: true });
}

afterAll(() => {
  const file = resolve('reports/development/plan-45-symbolic-fraction-comparison/evidence/falsification-seeds.json');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify({ schemaVersion: 1, seeds: evidence }, null, 2)}\n`);
});

describe('Plan 45 falsification seeds use ordinary mounted assertions', () => {
  afterEach(() => teardownMockDOM());

  it('detects a premature paired model leak and restores the pre-acceptance view', () => {
    const { root, app, document } = mount();
    const injected = document.createElement('div');
    injected.className = 'plan45-model-pair';
    root.querySelector('.app-visual-view .plan45-comparison').appendChild(injected);
    recordFailure('premature-paired-model', 'inserted a paired model in the live pre-acceptance scene', () => {
      expect(root.querySelector('.plan45-model-pair')).toBeNull();
    }, () => {
      injected.parentNode.removeChild(injected);
      app.update();
      assertNoPrematureAcceptedMeaning(root, app.getState());
      app.destroy();
    });
  });

  it('detects a second-source model disclosure after retry/view transition and restores the locked choice', () => {
    const { root, app, document } = mount();
    app.dispatch({ type: 'request-comparison-model', side: 'first' });
    app.dispatch({ type: 'submit-fraction-comparison', proposed: '<' });
    expect(app.getState().lastRecovery.classification.kind).toBe('comparison-retry');
    root.querySelector('.app-view-toggle').click();
    root.querySelector('.app-view-toggle').click();
    const injected = document.createElement('figure');
    injected.className = 'plan45-model';
    const track = document.createElement('div');
    track.className = 'plan45-model-track';
    track.setAttribute('aria-label', 'Second fraction model, 3 of 5 equal parts');
    injected.appendChild(track);
    root.querySelector('.app-visual-view .plan45-comparison').appendChild(injected);
    recordFailure('model-choice-switch-after-retry-or-view-change', 'inserted the unchosen second source model after first-side commitment', () => {
      expect(root.querySelectorAll('.app-visual-view .plan45-model')).toHaveLength(1);
    }, () => {
      injected.parentNode.removeChild(injected);
      root.querySelector('.app-view-toggle').click();
      expect(app.getState().assistance.modelChoice).toBe('first');
      expect(root.querySelectorAll('.app-linear-view .plan45-linear-model')).toHaveLength(1);
      app.destroy();
    });
  });

  it('detects inverted equality presentation and restores the exact accepted relation', () => {
    const { root, app } = mount();
    for (let index = 0; index < 2; index += 1) {
      const relation = exactRelation(app.getState().taskContext.sourceForms);
      app.dispatch({ type: 'submit-fraction-comparison', proposed: relation });
      root.querySelector('.app-visual-view .plan45-progression-button').click();
    }
    const relation = exactRelation(app.getState().taskContext.sourceForms);
    expect(relation).toBe('=');
    app.dispatch({ type: 'submit-fraction-comparison', proposed: relation });
    const acceptedRelation = app.getState().established.comparison.acceptedRelation;
    const relationNode = root.querySelector('.app-visual-view .plan45-accepted-relation');
    relationNode.textContent = '<';
    recordFailure('inverted-relation-equality', 'changed the accepted equality symbol in rendered output to less-than', () => {
      expect(relationNode.textContent).toBe(acceptedRelation);
    }, () => {
      app.update();
      expect(root.querySelector('.app-visual-view .plan45-accepted-relation').textContent).toBe('=');
      app.destroy();
    });
  });

  it('detects a stale/no-op Next action and recovers to the next fresh item', () => {
    const { root, app } = mount();
    const relation = exactRelation(app.getState().taskContext.sourceForms);
    app.dispatch({ type: 'submit-fraction-comparison', proposed: relation });
    const firstItemId = app.getState().taskContext.itemId;
    const button = root.querySelector('.app-visual-view .plan45-progression-button');
    button.click = () => {};
    button.click();
    recordFailure('stale-or-no-op-next', 'blocked the mounted Next event before its production handler', () => {
      expect(app.getState().taskContext.itemId).not.toBe(firstItemId);
    }, () => {
      delete button.click;
      root.querySelector('.app-visual-view .plan45-progression-button').click();
      expect(app.getState().taskContext.itemId).toBe('plan45-compare-02');
      expect(app.getState().assistance.modelChoice).toBeNull();
      expect(root.querySelector('.plan45-recovery')).toBeNull();
      app.destroy();
    });
  });
});

function openChooser(root) {
  const chooser = root.querySelector('[data-entry-chooser]');
  if (chooser.getAttribute('aria-expanded') === 'false') chooser.click();
}
