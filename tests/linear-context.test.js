import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { validateCuratedFixtures } from '../src/content/index.js';
import { getRegisteredCondition } from '../src/app/conditions.js';
import {
  applyIntent,
  createEpisode,
  PHASE2_REFLECTION_EPISODE_DEFINITION,
} from '../src/interaction/index.js';
import { resolveRenderableScene } from '../src/render/contract.js';
import { createLinearPathRenderer } from '../src/render/linear-path.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('linear current-fraction context', () => {
  let doc;

  beforeEach(() => {
    doc = setupMockDOM();
  });

  afterEach(() => {
    teardownMockDOM();
  });

  const canonicalInstance = () => validateCuratedFixtures().find((entry) => (
    entry.fixture.id === 'curated-relatively-prime-addition-non-least'
  )).instance;

  const whole = (value) => ({ kind: 'fraction', numerator: String(value), denominator: '1' });
  const fraction = (numerator, denominator) => ({
    kind: 'fraction',
    numerator: String(numerator),
    denominator: String(denominator),
  });

  function start(conditionId = 'phase2-bundle-1') {
    let state = createEpisode({
      instance: canonicalInstance(),
      episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
      activeCondition: getRegisteredCondition(conditionId).activeCondition,
    });
    state = applyIntent(state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    state = applyIntent(state, {
      type: 'propose-common-denominator',
      proposed: whole(12),
    });
    return state;
  }

  function convertFirst(state) {
    return applyIntent(state, {
      type: 'submit-equivalent-form',
      proposed: fraction(8, 12),
    });
  }

  function render(state, { isReplaying = false } = {}) {
    const scene = resolveRenderableScene({
      state,
      presentationMode: 'standard-motion',
      isReplaying,
    });
    const container = doc.createElement('div');
    const renderer = createLinearPathRenderer({ container, dispatchAction: () => {} });
    renderer.mount(scene);
    return container.querySelector('.linear-context-section');
  }

  it('shows only current stacked forms in ordinary context and hides their visual pieces from assistive technology', () => {
    const context = render(start());
    const expression = context.querySelector('.linear-context-expression');

    expect(context.querySelector('.linear-context-heading')).toBeNull();
    expect(context.querySelector('.linear-problem-statement')).toBeNull();
    expect(context.querySelector('.linear-quantities-list')).toBeNull();
    expect(expression.getAttribute('role')).toBe('math');
    expect(expression.getAttribute('aria-label')).toBe('2 over 3 plus 1 over 4');
    expect(expression.querySelectorAll('.symbolic-fraction')).toHaveLength(2);
    expect(Array.from(expression.querySelectorAll('.symbolic-fraction, .symbolic-operator'))
      .every((part) => part.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(context.textContent).toBe('23+14');
  });

  it('renders the projected current forms after conversion and never adds an established result to context', () => {
    let state = convertFirst(start());
    state = applyIntent(state, {
      type: 'submit-equivalent-form',
      proposed: fraction(3, 12),
    });
    state = applyIntent(state, {
      type: 'submit-operation-result',
      proposed: fraction(11, 12),
    });

    const context = render(state);
    const expression = context.querySelector('.linear-context-expression');
    expect(expression.getAttribute('aria-label')).toBe('8 over 12 plus 3 over 12');
    expect(expression.textContent).toBe('812+312');
    expect(context.textContent).not.toContain('11');
    expect(context.querySelector('.linear-transition-details')).toBeNull();
  });

  it('keeps only the changed operand transition detail when it adds a before/after relation', () => {
    const context = render(convertFirst(start('phase2-bundle-2')));
    const detail = context.querySelector('.linear-transition-details li');

    expect(context.querySelector('.linear-context-expression').getAttribute('aria-label'))
      .toBe('8 over 12 plus 1 over 4');
    expect(detail.textContent)
      .toBe('First fraction: started as 2 of 3 equal parts, now renamed to 8 of 12 equal parts in 1 whole.');
    expect(context.querySelector('.linear-transition-details').children).toHaveLength(1);
    expect(context.textContent).not.toContain('Second fraction:');
    expect(context.textContent).not.toContain('Problem:');
  });

  it('retains sequential transition wording only for the changed operand', () => {
    const context = render(convertFirst(start('phase2-bundle-3')));
    const details = context.querySelectorAll('.linear-transition-details li');

    expect(details).toHaveLength(1);
    expect(details[0].textContent)
      .toBe('First fraction: Step 1 was 2 of 3 equal parts. Step 2 is 8 of 12 equal parts in 1 whole.');
    expect(context.textContent).not.toContain('Second fraction:');
  });

  it('omits ordinary in-place operand copy but preserves replay status and starting form', () => {
    const state = convertFirst(start('phase2-bundle-1'));
    const ordinary = render(state);
    expect(ordinary.querySelector('.linear-transition-details')).toBeNull();
    expect(ordinary.textContent).not.toContain('First fraction:');
    expect(ordinary.textContent).not.toContain('Second fraction:');

    const replaying = render(state, { isReplaying: true });
    expect(replaying.querySelector('.linear-context-expression').getAttribute('aria-label'))
      .toBe('8 over 12 plus 1 over 4');
    expect(replaying.querySelector('.linear-transition-details li').textContent)
      .toBe('First fraction replaying: started with 2 of 3 equal parts in 1 whole.');
    expect(replaying.querySelector('.linear-transition-details li').classList.contains('replay-highlight'))
      .toBe(true);
    expect(replaying.textContent).not.toContain('Second fraction:');
  });

  it('uses only labeled projected premise forms for the check-the-premise context', () => {
    let state = start('phase2-bundle-4');
    state = convertFirst(state);
    state = applyIntent(state, {
      type: 'submit-equivalent-form',
      proposed: fraction(3, 12),
    });
    state = applyIntent(state, {
      type: 'submit-operation-result',
      proposed: fraction(11, 12),
    });
    state = applyIntent(state, {
      type: 'submit-resolution',
      proposed: fraction(11, 12),
    });

    const context = render(state);
    const comparison = context.querySelector('.linear-premise-comparison');
    const rows = context.querySelectorAll('.linear-premise-row');

    expect(context.querySelector('.linear-context-expression')).toBeNull();
    expect(context.querySelector('.linear-transition-details')).toBeNull();
    expect(comparison.getAttribute('role')).toBe('math');
    expect(comparison.getAttribute('aria-label'))
      .toBe('Starting fraction: 2 over 3. New parts: 7 over 12.');
    expect(rows).toHaveLength(2);
    expect(rows[0].querySelector('.linear-premise-label').textContent).toBe('Starting fraction');
    expect(rows[1].querySelector('.linear-premise-label').textContent).toBe('New parts');
    expect(Array.from(rows).every((row) => row.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(Array.from(comparison.querySelectorAll('.symbolic-fraction'))
      .map((piece) => piece.textContent)).toEqual(['23', '712']);
    expect(Array.from(comparison.querySelectorAll('.symbolic-fraction'))
      .every((piece) => piece.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(context.textContent).toBe('Starting fraction23New parts712');
  });
});
