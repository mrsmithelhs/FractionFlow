import { describe, it, expect, afterEach, afterAll } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createFractionFlowApp } from '../src/app/app.js';
import { createSymbolicFraction } from '../src/render/symbolic.js';
import { createFraction, equalFractions } from '../src/math/index.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

const evidence = [];
const asFraction = node => createFraction(BigInt(node.querySelector('.symbolic-numerator').textContent), BigInt(node.querySelector('.symbolic-denominator').textContent));
function mount() {
  const document = setupMockDOM(); const root = document.createElement('div'); document.body.appendChild(root);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
  openChooser(root); root.querySelector('[data-practice-type="symbolic-fraction-comparison"]').click();
  return { root, app, document };
}
function apply(app, type, fields = {}) { app.dispatch({ type, ...fields }); }
function verifier(root, state) {
  const host = root.querySelector('.app-visual-view');
  expect(host.querySelectorAll('.plan45-model').length).toBeLessThanOrEqual(1);
  expect(host.querySelector('.plan45-model-pair')).toBeNull();
  for (const side of ['first', 'second']) {
    const row = host.querySelector(`[data-plan49-side="${side}"]`);
    const accepted = state.construction.acceptedForms[side];
    if (!accepted) { expect(row).toBeNull(); continue; }
    expect(row).not.toBeNull();
    const fractions = row.querySelectorAll('.symbolic-fraction');
    expect(fractions).toHaveLength(2);
    const original = state.taskContext.sourceForms[side];
    const expectedOriginal = createFraction(BigInt(original.numerator), BigInt(original.denominator));
    const expectedAccepted = createFraction(BigInt(accepted.numerator), BigInt(accepted.denominator));
    expect(asFraction(fractions[0])).toEqual(expectedOriginal);
    expect(asFraction(fractions[1])).toEqual(expectedAccepted);
    expect(equalFractions(asFraction(fractions[1]), expectedOriginal)).toBe(true);
    expect(asFraction(fractions[1]).denominator.toString()).toBe(state.construction.target);
  }
}
function capture(name, mutation, verify, recover) {
  let failure = null; try { verify(); } catch (error) { failure = String(error.message); }
  expect(failure, `${name} must fail the ordinary mounted verifier`).toBeTruthy();
  recover(); verify(); evidence.push({ name, mutation, observedAssertionFailure: failure, cleanRecovery: true });
}
function fakeRow(document, side, a, b) {
  const row = document.createElement('p'); row.className = 'plan49-accepted-form'; row.setAttribute('data-plan49-side', side);
  row.appendChild(createSymbolicFraction(a.numerator, a.denominator)); row.appendChild(createSymbolicFraction(b.numerator, b.denominator)); return row;
}
afterEach(() => teardownMockDOM());
afterAll(() => writeFileSync('reports/development/plan-49-optional-common-denominator-comparison-help/evidence/falsification-seeds.json', JSON.stringify({layer:'mounted mock DOM', seeds:evidence}, null, 2) + '\n'));
describe('Plan 49 mounted falsification', () => {
  it('catches future construction injected into the active rendered task', () => {
    const {root, app, document} = mount(); apply(app,'open-comparison-construction'); apply(app,'submit-comparison-denominator',{phase:'denominator',proposed:'15'});
    const check = () => verifier(root, app.getState()); check();
    const injected = fakeRow(document,'second',{numerator:'3',denominator:'5'},{numerator:'9',denominator:'15'});
    root.querySelector('.app-visual-view .plan49-construction').appendChild(injected);
    capture('future-form','inserted unconstructed second form into the mounted task',check,()=>injected.parentNode.removeChild(injected)); app.destroy();
  });
  it('catches a wrong displayed conversion through the exact-core fidelity check', () => {
    const {root, app} = mount(); apply(app,'open-comparison-construction'); apply(app,'submit-comparison-denominator',{phase:'denominator',proposed:'15'}); apply(app,'submit-comparison-numerator',{phase:'first',proposed:'10'});
    const check = () => verifier(root, app.getState()); check();
    const row = root.querySelector('.app-visual-view [data-plan49-side="first"]'); const numerator = row.querySelectorAll('.symbolic-fraction')[1].querySelector('.symbolic-numerator'); numerator.textContent = '11';
    capture('wrong-conversion','changed accepted 10/15 to displayed 11/15 in mounted task',check,()=>{numerator.textContent='10';}); app.destroy();
  });
  it('catches stale rendered work after target revision', () => {
    const {root, app} = mount(); apply(app,'open-comparison-construction'); apply(app,'submit-comparison-denominator',{phase:'denominator',proposed:'15'}); apply(app,'submit-comparison-numerator',{phase:'first',proposed:'10'});
    const old = root.querySelector('.app-visual-view [data-plan49-side="first"]'); apply(app,'revise-comparison-denominator');
    const check = () => verifier(root, app.getState()); check(); root.querySelector('.app-visual-view .plan49-construction').appendChild(old);
    capture('stale-work','reinserted prior accepted row into mounted task after target revision',check,()=>old.parentNode.removeChild(old)); app.destroy();
  });
});

function openChooser(root) {
  const chooser = root.querySelector('[data-entry-chooser]');
  if (chooser.getAttribute('aria-expanded') === 'false') chooser.click();
}
