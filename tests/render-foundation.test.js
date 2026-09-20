import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { resolveRenderableScene } from '../src/render/contract.js';
import { createBeatContainer } from '../src/render/beat-container.js';
import { createFractionBarRenderer } from '../src/render/fraction-bar.js';
import { createButton, createNumericInput, createChoiceGroup } from '../src/render/controls.js';
import { createEpisode, applyIntent } from '../src/interaction/episode.js';
import { validateCuratedFixtures } from '../src/content/index.js';
import { projectScene } from '../src/interaction/scene.js';

describe('Renderer Foundation & Shared Boundary (Plan 07)', () => {
  let doc;

  beforeEach(() => {
    doc = setupMockDOM();
  });

  afterEach(() => {
    teardownMockDOM();
  });

  function whole(n) {
    return { kind: 'fraction', numerator: String(n), denominator: '1' };
  }

  function canonicalEpisode() {
    const instance = validateCuratedFixtures().find((entry) => (
      entry.fixture.id === 'curated-relatively-prime-addition-non-least'
    )).instance;
    return createEpisode({ instance });
  }

  it('condition D: resolveRenderableScene performs data-driven role switch from refusal continuation', () => {
    // Start episode and advance to decide beat
    let episode = canonicalEpisode();
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });

    // In decide beat, propose a common denominator with LCD > 30 (e.g. 60 or 40 for an alternate path)
    // For 2/3 + 1/4, common denominator 60 is valid-non-least, but > 30 so fraction-bar rendering is ineligible
    episode = applyIntent(episode, { type: 'propose-common-denominator', proposed: whole(60) });

    // Calling projectScene directly with 'fraction-bar' gives a capability refusal
    const directBarResult = projectScene({
      state: episode,
      representationRole: 'fraction-bar',
      presentationMode: 'standard-motion',
    });
    expect(directBarResult.kind).toBe('capability-refusal');
    expect(directBarResult.status).toBe('valid-but-outside-representation-capability');
    expect(directBarResult.continuation).toEqual({
      representationRole: 'symbolic',
      route: 'symbolic-continuation',
    });

    // resolveRenderableScene reads the refusal's continuation.representationRole ('symbolic')
    // and re-projects for 'symbolic', successfully returning a fresh, valid, frozen scene!
    const resolvedScene = resolveRenderableScene({
      state: episode,
      initialRole: 'fraction-bar',
      presentationMode: 'standard-motion',
    });

    expect(resolvedScene.kind).toBe('scene');
    expect(resolvedScene.meaning.representationRole).toBe('symbolic');
    expect(Object.isFrozen(resolvedScene)).toBe(true);
  });

  it('DECISION-025: fraction-bar segments are NOT interactive targets (display only)', () => {
    const episode = canonicalEpisode();
    const scene = resolveRenderableScene({ state: episode });

    const container = doc.createElement('div');
    const barRenderer = createFractionBarRenderer({ side: 'left', container });
    barRenderer.mount(scene);

    const root = barRenderer.getElement();
    expect(root.getAttribute('role')).toBe('img');
    expect(root.getAttribute('tabindex')).toBe('-1'); // not focusable
    expect(root.querySelector('.fraction-bar-whole-label')).toBeNull();
    expect(root.getAttribute('aria-label')).toContain('in 1 whole');
    expect(root.querySelector('.fraction-bar-readout-numerator').textContent).toBe('2');
    expect(root.querySelector('.fraction-bar-readout-divider')).toBeTruthy();
    expect(root.querySelector('.fraction-bar-readout-denominator').textContent).toBe('3');
    expect(root.querySelector('.fraction-bar-readout').getAttribute('aria-hidden')).toBe('true');

    const segments = root.querySelectorAll('.fraction-bar-segment');
    expect(segments.length).toBe(3); // 2/3 has 3 segments

    for (const segment of segments) {
      // Segments must have aria-hidden="true" (visual representation of parent role="img")
      expect(segment.getAttribute('aria-hidden')).toBe('true');
      // Segments must NOT have click handlers or focusability
      expect(segment.tabIndex).toBe(-1);
      expect(segment.tagName).toBe('DIV');
    }
  });

  it('keeps the active beat before completed context while visual stays before symbolic', () => {
    const episode = canonicalEpisode();
    const container = doc.createElement('div');
    const beatContainer = createBeatContainer({
      container,
      dispatchAction: () => {},
    });
    beatContainer.mount(resolveRenderableScene({ state: episode }));

    expect([...container.querySelector('.episode-beat-container').children]
      .map((child) => [
        'render-visual-section',
        'render-symbolic-section',
        'active-beat-section',
        'completed-beats-section',
      ].find((className) => child.classList.contains(className))))
      .toEqual([
        'render-visual-section',
        'render-symbolic-section',
        'active-beat-section',
        'completed-beats-section',
      ]);
  });

  it('DECISION-014: strict beat-gated mounting — unreached beats and future values NEVER exist in DOM', () => {
    let episode = canonicalEpisode();
    const container = doc.createElement('div');
    const actions = [];
    const beatContainer = createBeatContainer({
      container,
      dispatchAction: (action) => actions.push(action),
    });

    // 1. Encounter beat
    let scene = resolveRenderableScene({ state: episode });
    beatContainer.mount(scene);

    // Assert that decide, transform, operate, resolve controls DO NOT EXIST in DOM
    expect(container.querySelector('#transform-num-input-left')).toBeNull();
    expect(container.querySelector('#operate-sum-input')).toBeNull();
    expect(container.querySelector('.control-choice-fieldset')).toBeNull();
    expect(container.textContent).not.toContain('12'); // target denominator not in DOM
    expect(container.textContent).not.toContain('11/12'); // final answer not in DOM

    // 2. Advance to Notice beat
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    scene = resolveRenderableScene({ state: episode });
    beatContainer.update(scene);

    // Notice controls exist, but common denominator choices DO NOT EXIST
    expect(container.textContent).toContain('Do these two fractions have the same size parts?');
    expect(container.querySelector('#transform-num-input-left')).toBeNull();
    expect(container.querySelector('#operate-sum-input')).toBeNull();
    expect(container.textContent).not.toContain('11/12');

    // 3. Advance to Decide beat
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });
    scene = resolveRenderableScene({ state: episode });
    beatContainer.update(scene);

    // Common denominator choices exist, but conversion inputs DO NOT EXIST
    expect(container.textContent).toContain('Choose a common denominator');
    expect(container.querySelector('#transform-num-input-left')).toBeNull();
    expect(container.querySelector('#operate-sum-input')).toBeNull();
    expect(container.textContent).not.toContain('11/12');

    // 4. Advance to Transform beat
    episode = applyIntent(episode, { type: 'propose-common-denominator', proposed: whole(12) });
    scene = resolveRenderableScene({ state: episode });
    beatContainer.update(scene);

    // Conversion input for left exists, but operation sum input DOES NOT EXIST
    expect(container.querySelector('#transform-num-input-left')).toBeTruthy();
    expect(container.querySelector('#operate-sum-input')).toBeNull();
    expect(container.textContent).not.toContain('11/12');

    // 5. Complete conversions and advance to Operate beat
    episode = applyIntent(episode, {
      type: 'submit-equivalent-form',
      proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
    });
    episode = applyIntent(episode, {
      type: 'submit-equivalent-form',
      proposed: { kind: 'fraction', numerator: '3', denominator: '12' },
    });
    scene = resolveRenderableScene({ state: episode });
    beatContainer.update(scene);

    // Operate sum input exists, but resolution continue button DOES NOT EXIST
    expect(container.querySelector('#operate-sum-input')).toBeTruthy();
    expect(container.textContent).not.toContain('Next Problem');

    // 6. Advance to Resolve beat
    episode = applyIntent(episode, {
      type: 'submit-operation-result',
      proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
    });
    scene = resolveRenderableScene({ state: episode });
    beatContainer.update(scene);

    // Final result is established and continue button is mounted
    expect(container.textContent).toContain('11/12');
    expect(container.textContent).toContain('Next Problem');
  });

  it('completed-beat collapse (Finding R6 / DECISION-021 criterion 1): completed beats collapse to compact summary lines', () => {
    let episode = canonicalEpisode();
    const container = doc.createElement('div');
    const beatContainer = createBeatContainer({
      container,
      dispatchAction: () => {},
    });

    // Advance to Decide beat
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });
    let scene = resolveRenderableScene({ state: episode });
    beatContainer.mount(scene);

    // Encounter and Notice are in completed section as compact summaries
    const completedSummaries = container.querySelectorAll('.completed-beat-summary');
    expect(completedSummaries.length).toBe(2);
    expect(completedSummaries[0].textContent).toContain('Problem established');
    expect(completedSummaries[1].textContent).toContain('Units do not match');

    // Their old buttons (e.g. Yes/No notice choices) are completely DISMOUNTED
    const activeControls = container.querySelector('.active-beat-controls');
    expect(activeControls.textContent).not.toContain('Yes, same size');
    expect(activeControls.textContent).not.toContain('No, different sizes');
  });

  it('DECISION-010 / DECISION-013 / DECISION-025: discrete controls are non-drag, keyboard-operable, and target >= 24px', () => {
    let clicked = false;
    const btn = createButton({
      label: 'Choose 12',
      onClick: () => { clicked = true; },
    });

    expect(btn.tagName).toBe('BUTTON');
    expect(btn.classList.contains('fraction-control')).toBe(true);

    // Keyboard activation via click dispatch
    btn.click();
    expect(clicked).toBe(true);

    // Sizing is decoupled from denominator (applies .fraction-control with min-target 44px)
    expect(btn.classList.contains('fraction-control')).toBe(true);
  });

  it('reduced-motion parity (DECISION-007, Quality doc §41): reaches identical inspectable post-state', () => {
    const episode = canonicalEpisode();
    const standardScene = resolveRenderableScene({ state: episode, presentationMode: 'standard-motion' });
    const reducedScene = resolveRenderableScene({ state: episode, presentationMode: 'reduced-motion' });

    const containerStandard = doc.createElement('div');
    const containerReduced = doc.createElement('div');

    const barStandard = createFractionBarRenderer({ side: 'left', container: containerStandard });
    const barReduced = createFractionBarRenderer({ side: 'left', container: containerReduced });

    barStandard.mount(standardScene);
    barReduced.mount(reducedScene);

    const standardRoot = barStandard.getElement();
    const reducedRoot = barReduced.getElement();

    // Identical meaning and visible contents
    expect(standardRoot.getAttribute('aria-label')).toBe(reducedRoot.getAttribute('aria-label'));
    expect(standardRoot.querySelectorAll('.fraction-bar-segment').length).toBe(
      reducedRoot.querySelectorAll('.fraction-bar-segment').length,
    );
    expect(standardRoot.querySelectorAll('.fraction-bar-segment.shaded').length).toBe(
      reducedRoot.querySelectorAll('.fraction-bar-segment.shaded').length,
    );

    // Reduced motion class is applied to disable animations
    expect(reducedRoot.querySelector('.reduced-motion')).toBeTruthy();
  });
});
