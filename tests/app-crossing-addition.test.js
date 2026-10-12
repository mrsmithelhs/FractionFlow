import { afterEach, describe, expect, it } from 'vitest';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import { fractionToWire, wireToForm } from '../src/content/schema.js';
import { addAtCommonDenominator, convertToDenominator } from '../src/math/index.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

const registeredType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
const crossingItem = registeredType.items[10];

describe('Plan 17 mounted learner route', () => {
  let document;
  let root;
  let app;

  afterEach(() => {
    app?.destroy();
    teardownMockDOM();
  });

  it.each(['12', '24'])('withholds the total in both mounted views until correct %s acceptance, then restores it after Inspection Mode', (target) => {
    document = setupMockDOM();
    root = document.createElement('div');
    document.body.appendChild(root);
    const fixture = resolveCuratedFixture(crossingItem.fixtureId, crossingItem.authoringRevision);
    const instance = buildCuratedProblem({
      fixture,
      selector: fixture.selector,
      overlays: fixture.overlays,
      profileId: fixture.profileId,
      candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] },
    });
    const crossingOnlyType = {
      ...registeredType,
      items: [crossingItem],
    };
    app = createFractionFlowApp({
      root,
      presentationMode: 'instant-test',
      practiceTypes: [crossingOnlyType],
    });
    app.mount();
    root.querySelector('.app-practice-button').click();

    expect(app.getState().episodeDefinition.id).toBe(crossingItem.episodeDefinitionId);
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: target, denominator: '1' },
    });
    const denominator = BigInt(target);
    const left = convertToDenominator(wireToForm(instance.operands.left.initialForm), denominator);
    const right = convertToDenominator(wireToForm(instance.operands.right.initialForm), denominator);
    app.dispatch({ type: 'submit-equivalent-form', proposed: fractionToWire(left) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fractionToWire(right) });

    const total = convertToDenominator(
      addAtCommonDenominator(
        wireToForm(instance.operands.left.initialForm),
        wireToForm(instance.operands.right.initialForm),
        denominator,
      ),
      denominator,
    );
    const assertWithheld = () => {
      const mounted = root.querySelector('.fractionflow-app');
      const serialized = `${mounted.textContent} ${mounted.innerHTML} ${Array.from(mounted.querySelectorAll('*'))
        .flatMap((element) => Array.from(element.attributes, (attribute) => attribute.value))
        .join(' ')}`;
      expect(serialized).not.toMatch(/17\s*\/\s*12|17 over 12|34\s*\/\s*24|34 over 24/i);
      expect(mounted.querySelectorAll('.fraction-bar-multi-whole-stack, .linear-result-stack')).toHaveLength(0);
    };
    assertWithheld();

    app.dispatch({ type: 'submit-operation-result', proposed: { kind: 'fraction', numerator: '1', denominator: target } });
    expect(app.getState().beat).toBe('operate');
    assertWithheld();

    app.dispatch({ type: 'submit-operation-result', proposed: fractionToWire(total) });
    expect(app.getState().beat).toBe('resolve');
    expect(root.querySelectorAll('.app-visual-view .fraction-bar-multi-whole-row')).toHaveLength(2);
    expect(root.querySelector('.app-visual-view [data-whole-row="whole-2"] .fraction-bar-segment.shaded'))
      .toBeTruthy();
    expect(root.querySelector('.app-linear-view .linear-result-stack')).toBeTruthy();
    expect(root.querySelector('.app-visual-view .fraction-bar-multi-whole-stack').getAttribute('aria-label'))
      .toContain(`${total.numerator} over ${target}`);
    expect(root.querySelector('.app-visual-view .active-beat-prompt').textContent)
      .toBe(target === '12' ? "That's right." : '34/24 is correct! It can also be written as 17/12.');
    expect(root.querySelector('.app-linear-view .active-beat-prompt').textContent)
      .toBe(target === '12' ? "That's right." : '34/24 is correct! It can also be written as 17/12.');

    app.dispatch({ type: 'submit-resolution', proposed: fractionToWire(total) });
    expect(app.getState().beat).toBe('reflect');
    expect(root.querySelector('.app-visual-view .fraction-bar-multi-whole-stack')).toBeTruthy();
    app.dispatch({ type: 'request-replay' });
    expect(root.querySelector('.app-visual-view .replay-inspection-card')).toBeTruthy();
    expect(root.querySelector('.app-visual-view .fraction-bar-multi-whole-stack')).toBeNull();
    root.querySelector('.app-visual-view .app-done-looking-button').click();
    expect(root.querySelector('.app-visual-view .fraction-bar-multi-whole-stack')).toBeTruthy();
    expect(root.querySelector('.app-visual-view .matching-choice-btn')).toBeTruthy();
  });
});
