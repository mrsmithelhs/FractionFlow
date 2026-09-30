import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('Plan 12 entry page', () => {
  let document;
  let root;
  let app;

  beforeEach(() => {
    document = setupMockDOM();
    root = document.createElement('div');
    document.body.appendChild(root);
    app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();
  });

  afterEach(() => {
    app.destroy();
    teardownMockDOM();
  });

  it('opens on a restrained entry page with one runnable registry button and keyboard-reachable gear', () => {
    expect(root.querySelector('.app-entry-title').textContent).toBe('FractionFlow');
    expect(root.querySelector('.app-entry-line').textContent)
      .toBe('See how different-sized fraction parts fit together.');
    expect(PRACTICE_TYPES).toHaveLength(1);
    expect(root.querySelectorAll('.app-practice-button')).toHaveLength(1);
    expect(root.querySelector('.app-practice-button').textContent)
      .toBe('Add fractions with different denominators');
    expect(root.querySelector('.app-practice-button').disabled).toBe(false);
    expect(root.querySelector('.app-creator-credit').textContent).toBe('Created by an educator');
    expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-display-menu').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-entry-page .app-gear-button')).not.toBeNull();
  });

  it('begins the registered episode and returns focus to the entry page on return', () => {
    root.querySelector('.app-practice-button').click();
    expect(app.getState().beat).toBe('encounter');
    expect(document.activeElement).toBe(root.querySelector('.app-episode'));
    expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-episode .app-gear-button')).toBeNull();

    app.dispatch({ type: 'acknowledge-encounter' });
    const freshAfterRetry = root.querySelector('.app-restart-button');
    expect(freshAfterRetry.textContent).toBe('Try this problem again');
    freshAfterRetry.click();
    expect(app.getState().beat).toBe('encounter');

    root.querySelector('.app-return-button').click();
    expect(app.getState().beat).toBe('encounter');
    expect(app.getState().revision).toBe(0);
    expect(document.activeElement).toBe(root.querySelector('.app-entry-title'));
  });

  it('applies reviewer-selected support before beginning', () => {
    root.querySelector('.app-gear-button').click();
    const support = root.querySelector('.app-support-level');
    support.value = 'low support';
    support.dispatchEvent({ type: 'change' });
    root.querySelector('.app-practice-button').click();

    expect(app.getState().support.label).toBe('low support');
    expect(app.getState().support.dimensions.commonDenominator).toBe('low support');
    expect(root.querySelector('.fractionflow-app').getAttribute('data-support-level')).toBe('low support');
  });
});
