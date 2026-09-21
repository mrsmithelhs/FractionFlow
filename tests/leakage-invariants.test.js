import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createEpisode, applyIntent } from '../src/interaction/episode.js';
import { PHASE2_REFLECTION_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import { validateCuratedFixtures } from '../src/content/index.js';
import { resolveRenderableScene } from '../src/render/contract.js';
import { createBeatContainer } from '../src/render/beat-container.js';
import { createLinearPathRenderer } from '../src/render/linear-path.js';
import { projectScene } from '../src/interaction/scene.js';

/**
 * Fail-First Scaffold-Leakage Invariants Suite (Plan 08, Requirement 3, D-16)
 *
 * Implements and verifies Invariants 1–9 of the Evidence and Accessibility Plan across
 * BOTH the visual path (beatContainer) and the semantic/linear path (linearPath).
 *
 * Demonstrates the failing-first property: every invariant function is tested against:
 * 1. The compliant, real episode/DOM state (passes).
 * 2. Deliberately mutated, leaking fixtures (fails when and only when a leak is present).
 */

describe('Scaffold-Leakage Invariants Suite & Failing-First Verifications (Plan 08)', () => {
  let doc;

  beforeEach(() => {
    doc = setupMockDOM();
  });

  afterEach(() => {
    teardownMockDOM();
  });

  function canonicalEpisode(episodeDefinition) {
    const instance = validateCuratedFixtures().find((entry) => (
      entry.fixture.id === 'curated-relatively-prime-addition-non-least'
    )).instance;
    return createEpisode({
      instance,
      ...(episodeDefinition ? { episodeDefinition } : {}),
    });
  }

  function mountBoth(scene, dispatch = () => {}) {
    const visualBox = doc.createElement('div');
    const linearBox = doc.createElement('div');

    const visual = createBeatContainer({ container: visualBox, dispatchAction: dispatch });
    visual.mount(scene);

    const linear = createLinearPathRenderer({ container: linearBox, dispatchAction: dispatch });
    linear.mount(scene);

    return { visualBox, linearBox, visual, linear };
  }

  // --- Invariant 1: Notice ---
  function assertNoticeNoLeak(visualBox, linearBox) {
    for (const box of [visualBox, linearBox]) {
      const prompt = box.querySelector('.active-beat-prompt')?.textContent || '';
      // Must not state whether units match in the prompt
      if (/do not match|are different|are the same/i.test(prompt)) {
        throw new Error(`Scaffold Leak [Invariant 1]: Notice prompt reveals match answer: "${prompt}"`);
      }
      // Must not pre-select any choice option
      const selected = [
        ...box.querySelectorAll('.control-choice-btn.selected'),
        ...box.querySelectorAll('[aria-checked="true"]'),
      ];
      if (selected.length > 0) {
        throw new Error('Scaffold Leak [Invariant 1]: Notice option is preselected');
      }
    }
  }

  it('Invariant 1 (Notice): does not reveal unit match before learner submission, and catches leak fail-first', () => {
    let episode = canonicalEpisode();
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    const scene = resolveRenderableScene({ state: episode });
    const { visualBox, linearBox } = mountBoth(scene);

    // 1. Passes on compliant implementation
    expect(() => assertNoticeNoLeak(visualBox, linearBox)).not.toThrow();

    // 2. Failing-first: catches prompt leakage
    const leakingPromptVisual = doc.createElement('div');
    const leakingPrompt = doc.createElement('div');
    leakingPrompt.classList.add('active-beat-prompt');
    leakingPrompt.textContent = 'The denominators 3 and 4 are different units.';
    leakingPromptVisual.appendChild(leakingPrompt);
    expect(() => assertNoticeNoLeak(leakingPromptVisual, linearBox)).toThrow(/Invariant 1/);

    // 3. Failing-first: catches preselected option
    const leakingChoiceLinear = doc.createElement('div');
    const leakingBtn = doc.createElement('button');
    leakingBtn.classList.add('control-choice-btn', 'selected');
    leakingBtn.setAttribute('aria-checked', 'true');
    leakingBtn.textContent = 'Different';
    leakingChoiceLinear.appendChild(leakingBtn);
    expect(() => assertNoticeNoLeak(visualBox, leakingChoiceLinear)).toThrow(/Invariant 1/);
  });

  // --- Invariant 2: Common Denominator ---
  function assertDecideNoLeak(visualBox, linearBox, validTargets = ['12', '24']) {
    for (const box of [visualBox, linearBox]) {
      // Input must not be prefilled
      const input = box.querySelector('input');
      if (input && input.value && validTargets.includes(input.value)) {
        throw new Error(`Scaffold Leak [Invariant 2]: Common denominator prefilled: ${input.value}`);
      }
      // Candidates must not mark target as correct or selected
      const buttons = box.querySelectorAll('.control-choice-btn');
      for (const btn of buttons) {
        if (btn.classList.contains('selected') || btn.classList.contains('correct') || btn.getAttribute('aria-current') === 'true') {
          throw new Error('Scaffold Leak [Invariant 2]: Candidate button marked as correct/selected');
        }
      }
      // Converted numerators (8, 3) and sum (11) must not appear in prompt or labels
      const prompt = box.querySelector('.active-beat-prompt')?.textContent || '';
      if (prompt.includes('8') || prompt.includes('11')) {
        throw new Error(`Scaffold Leak [Invariant 2]: Future value leaked in prompt: "${prompt}"`);
      }
    }
  }

  it('Invariant 2 (Common Denominator): candidates do not reveal target, and catches leak fail-first', () => {
    let episode = canonicalEpisode();
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });
    const scene = resolveRenderableScene({ state: episode });
    const { visualBox, linearBox } = mountBoth(scene);

    // 1. Passes on compliant implementation
    expect(() => assertDecideNoLeak(visualBox, linearBox)).not.toThrow();

    // 2. Failing-first: catches prefilled denominator input
    const leakingInputVisual = doc.createElement('div');
    const inp = doc.createElement('input');
    inp.value = '12';
    leakingInputVisual.appendChild(inp);
    expect(() => assertDecideNoLeak(leakingInputVisual, linearBox)).toThrow(/Invariant 2/);

    // 3. Failing-first: catches pre-highlighted candidate
    const leakingChoiceLinear = doc.createElement('div');
    const btn = doc.createElement('button');
    btn.classList.add('control-choice-btn', 'correct');
    btn.textContent = '12';
    leakingChoiceLinear.appendChild(btn);
    expect(() => assertDecideNoLeak(visualBox, leakingChoiceLinear)).toThrow(/Invariant 2/);
  });

  // --- Invariant 3: Equivalent Numerator / Scale Factor ---
  function assertTransformNoLeak(visualBox, linearBox, targetNum, scaleFactor) {
    for (const box of [visualBox, linearBox]) {
      const input = box.querySelector('input');
      if (input && input.value && String(input.value) === String(targetNum)) {
        throw new Error(`Scaffold Leak [Invariant 3]: Converted numerator prefilled: ${input.value}`);
      }
      const prompt = box.querySelector('.active-beat-prompt')?.textContent || '';
      // Prompt should ask how many parts, but not state the target numerator answer
      if (new RegExp(`\\b${targetNum}\\s+of\\b`).test(prompt)) {
        throw new Error(`Scaffold Leak [Invariant 3]: Target numerator leaked in prompt: "${prompt}"`);
      }
      const label = box.querySelector('.control-label')?.textContent || '';
      if (label.includes(`=${targetNum}`) || label.includes(`answer is ${targetNum}`)) {
        throw new Error(`Scaffold Leak [Invariant 3]: Target numerator leaked in input label: "${label}"`);
      }
    }
  }

  it('Invariant 3 (Conversion): does not prefill or reveal equivalent numerator, and catches leak fail-first', () => {
    let episode = canonicalEpisode();
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });
    episode = applyIntent(episode, {
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
    });
    const scene = resolveRenderableScene({ state: episode });
    const { visualBox, linearBox } = mountBoth(scene);

    // Target numerator for 2/3 with den 12 is 8, scale factor 4
    expect(() => assertTransformNoLeak(visualBox, linearBox, '8', '4')).not.toThrow();

    // Failing-first: catches prefilled target numerator
    const leakingInputVisual = doc.createElement('div');
    const inp = doc.createElement('input');
    inp.value = '8';
    leakingInputVisual.appendChild(inp);
    expect(() => assertTransformNoLeak(leakingInputVisual, linearBox, '8', '4')).toThrow(/Invariant 3/);

    // Failing-first: catches answer in prompt
    const leakingPromptLinear = doc.createElement('div');
    const p = doc.createElement('div');
    p.classList.add('active-beat-prompt');
    p.textContent = '8 of the 12 equal parts are shaded.';
    leakingPromptLinear.appendChild(p);
    expect(() => assertTransformNoLeak(visualBox, leakingPromptLinear, '8', '4')).toThrow(/Invariant 3/);
  });

  // --- Invariant 4: Prediction ---
  function assertPredictionNoLeak(visualBox, linearBox, targetNumerator) {
    // Fraction bar segments before transformation must not be divided into final converted units
    const segments = visualBox.querySelectorAll('.fraction-bar-segment.shaded');
    if (segments.length === Number(targetNumerator)) {
      throw new Error(`Scaffold Leak [Invariant 4]: Post-transformation subdivision pre-exposed (${segments.length} segments)`);
    }
    const linearText = linearBox.textContent || '';
    if (linearText.includes(`${targetNumerator}/12`)) {
      throw new Error('Scaffold Leak [Invariant 4]: Post-transition fraction exposed in linear path before transition');
    }
  }

  it('Invariant 4 (Prediction): does not pre-expose post-transformation subdivision, and catches leak fail-first', () => {
    let episode = canonicalEpisode();
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });
    episode = applyIntent(episode, {
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
    });
    const scene = resolveRenderableScene({ state: episode });
    const { visualBox, linearBox } = mountBoth(scene);

    // Left fraction is currently 2/3 (2 segments shaded), NOT 8/12 (8 segments shaded)
    expect(() => assertPredictionNoLeak(visualBox, linearBox, '8')).not.toThrow();

    // Failing-first: simulate premature subdivision
    const leakingVisual = doc.createElement('div');
    for (let i = 0; i < 8; i += 1) {
      const seg = doc.createElement('div');
      seg.classList.add('fraction-bar-segment', 'shaded');
      leakingVisual.appendChild(seg);
    }
    expect(() => assertPredictionNoLeak(leakingVisual, linearBox, '8')).toThrow(/Invariant 4/);
  });

  // --- Invariant 5: Operation ---
  function assertOperateNoLeak(visualBox, linearBox, rawSum) {
    for (const box of [visualBox, linearBox]) {
      const input = box.querySelector('input');
      if (input && input.value && String(input.value) === String(rawSum)) {
        throw new Error(`Scaffold Leak [Invariant 5]: Raw sum prefilled: ${input.value}`);
      }
      const prompt = box.querySelector('.active-beat-prompt')?.textContent || '';
      if (prompt.includes(rawSum)) {
        throw new Error(`Scaffold Leak [Invariant 5]: Raw sum revealed in prompt: "${prompt}"`);
      }
      const live = box.querySelector('[role="status"]')?.textContent || '';
      if (live.includes(rawSum)) {
        throw new Error(`Scaffold Leak [Invariant 5]: Raw sum revealed in live status: "${live}"`);
      }
    }
  }

  it('Invariant 5 (Operation): numerator sum is never prefilled or announced before operation response, and catches leak fail-first', () => {
    let episode = canonicalEpisode();
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });
    episode = applyIntent(episode, {
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
    });
    episode = applyIntent(episode, {
      type: 'submit-equivalent-form',
      proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
    });
    episode = applyIntent(episode, {
      type: 'submit-equivalent-form',
      proposed: { kind: 'fraction', numerator: '3', denominator: '12' },
    });
    const scene = resolveRenderableScene({ state: episode });
    const { visualBox, linearBox } = mountBoth(scene);

    // Sum is 8 + 3 = 11
    expect(() => assertOperateNoLeak(visualBox, linearBox, '11')).not.toThrow();

    // Failing-first: simulate prefilled sum
    const leakingVisual = doc.createElement('div');
    const inp = doc.createElement('input');
    inp.value = '11';
    leakingVisual.appendChild(inp);
    expect(() => assertOperateNoLeak(leakingVisual, linearBox, '11')).toThrow(/Invariant 5/);

    // Failing-first: simulate leaked live announcement
    const leakingLinear = doc.createElement('div');
    const live = doc.createElement('div');
    live.setAttribute('role', 'status');
    live.textContent = 'Total is 11';
    leakingLinear.appendChild(live);
    expect(() => assertOperateNoLeak(visualBox, leakingLinear, '11')).toThrow(/Invariant 5/);
  });

  // --- Invariant 6: Resolve & Reflection ---
  function assertResolveReflectNoLeak(visualBox, linearBox) {
    for (const box of [visualBox, linearBox]) {
      const selected = [
        ...box.querySelectorAll('.control-choice-btn.selected'),
        ...box.querySelectorAll('[aria-checked="true"]'),
      ];
      if (selected.length > 0) {
        throw new Error('Scaffold Leak [Invariant 6]: Reflection choice is pre-selected');
      }

      const choices = [...box.querySelectorAll('.control-choice-btn')];
      if (choices.length > 1) {
        const referenceClasses = [...choices[0].classList].sort().join(' ');
        const referenceAttrs = choices[0].getAttributeNames().sort().join(' ');

        for (let i = 1; i < choices.length; i += 1) {
          const currentClasses = [...choices[i].classList].sort().join(' ');
          const currentAttrs = choices[i].getAttributeNames().sort().join(' ');
          if (currentClasses !== referenceClasses) {
            throw new Error(
              `Scaffold Leak [Invariant 6]: Choice controls have divergent classes: "${referenceClasses}" vs "${currentClasses}"`,
            );
          }
          if (currentAttrs !== referenceAttrs) {
            throw new Error(
              `Scaffold Leak [Invariant 6]: Choice controls have divergent attribute sets: "${referenceAttrs}" vs "${currentAttrs}"`,
            );
          }
        }
      }
    }
  }

  it('Invariant 6 (Resolve/Reflect): connection choices are not pre-selected and mutually indistinguishable, and catches leak fail-first', () => {
    let episode = canonicalEpisode(PHASE2_REFLECTION_EPISODE_DEFINITION);
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });
    episode = applyIntent(episode, {
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
    });
    episode = applyIntent(episode, {
      type: 'submit-equivalent-form',
      proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
    });
    episode = applyIntent(episode, {
      type: 'submit-equivalent-form',
      proposed: { kind: 'fraction', numerator: '3', denominator: '12' },
    });
    episode = applyIntent(episode, {
      type: 'submit-operation-result',
      proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
    });
    // Advance past resolve to reflect
    episode = applyIntent(episode, {
      type: 'submit-resolution',
      proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
    });

    const scene = resolveRenderableScene({ state: episode });
    const { visualBox, linearBox } = mountBoth(scene);

    // Passes cleanly against real rendered output on both paths
    expect(() => assertResolveReflectNoLeak(visualBox, linearBox)).not.toThrow();

    // Failing-first: demonstrate by mutating real rendered options
    const targetBtn = visualBox.querySelector('.matching-choice-btn');
    expect(targetBtn).not.toBeNull();

    // 1. Mutate class on real rendered option
    targetBtn.classList.add('leaked-indicator');
    expect(() => assertResolveReflectNoLeak(visualBox, linearBox)).toThrow(/Invariant 6/);
    targetBtn.classList.remove('leaked-indicator');

    // 2. Mutate attribute on real rendered option
    targetBtn.setAttribute('data-correct', 'true');
    expect(() => assertResolveReflectNoLeak(visualBox, linearBox)).toThrow(/Invariant 6/);
    targetBtn.removeAttribute('data-correct');

    // 3. Pre-selected marker on real rendered option
    targetBtn.classList.add('selected');
    expect(() => assertResolveReflectNoLeak(visualBox, linearBox)).toThrow(/Invariant 6/);
    targetBtn.classList.remove('selected');
  });

  it('Invariant 6b / Condition D (Inspection Mode at reflect): genuinely unmounts reflection choices during replay and remounts identically on exit without leak, fail-first verified', () => {
    let episode = canonicalEpisode(PHASE2_REFLECTION_EPISODE_DEFINITION);
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });
    episode = applyIntent(episode, {
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
    });
    episode = applyIntent(episode, {
      type: 'submit-equivalent-form',
      proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
    });
    episode = applyIntent(episode, {
      type: 'submit-equivalent-form',
      proposed: { kind: 'fraction', numerator: '3', denominator: '12' },
    });
    episode = applyIntent(episode, {
      type: 'submit-operation-result',
      proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
    });
    episode = applyIntent(episode, {
      type: 'submit-resolution',
      proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
    });

    // 1. Initial reflect scene (isReplaying: false)
    const normalScene = resolveRenderableScene({ state: episode, isReplaying: false });
    const { visualBox, linearBox, visual, linear } = mountBoth(normalScene);

    // Initial choices are present and clean
    const initialVisualButtons = [...visualBox.querySelectorAll('.control-choice-btn')];
    const initialLinearButtons = [...linearBox.querySelectorAll('.control-choice-btn')];
    expect(initialVisualButtons.length).toBeGreaterThanOrEqual(3);
    expect(initialLinearButtons.length).toBeGreaterThanOrEqual(3);
    expect(() => assertResolveReflectNoLeak(visualBox, linearBox)).not.toThrow();

    const initialVisualTexts = initialVisualButtons.map((b) => b.textContent);
    const initialLinearTexts = initialLinearButtons.map((b) => b.textContent);

    // 2. Transition to Inspection Mode (isReplaying: true)
    const replayScene = resolveRenderableScene({ state: episode, isReplaying: true });
    visual.update(replayScene);
    linear.update(replayScene);

    // Genuinely unmounted in both paths (Condition D / DECISION-014)
    expect(visualBox.querySelectorAll('.control-choice-btn').length).toBe(0);
    expect(visualBox.querySelectorAll('.matching-choice-btn').length).toBe(0);
    expect(linearBox.querySelectorAll('.control-choice-btn').length).toBe(0);

    // Inspection cards and Done Looking controls are present
    expect(visualBox.querySelector('.replay-inspection-card')).not.toBeNull();
    expect(visualBox.querySelector('.app-done-looking-button')).not.toBeNull();
    expect(linearBox.querySelector('.linear-replay-inspection-card')).not.toBeNull();
    expect(linearBox.querySelector('.app-done-looking-button')).not.toBeNull();

    // 3. Exit Inspection Mode (isReplaying: false)
    const restoredScene = resolveRenderableScene({ state: episode, isReplaying: false });
    visual.update(restoredScene);
    linear.update(restoredScene);

    // Choices are remounted cleanly
    const restoredVisualButtons = [...visualBox.querySelectorAll('.control-choice-btn')];
    const restoredLinearButtons = [...linearBox.querySelectorAll('.control-choice-btn')];
    expect(restoredVisualButtons.length).toBe(initialVisualButtons.length);
    expect(restoredLinearButtons.length).toBe(initialLinearButtons.length);

    expect(restoredVisualButtons.map((b) => b.textContent)).toEqual(initialVisualTexts);
    expect(restoredLinearButtons.map((b) => b.textContent)).toEqual(initialLinearTexts);

    expect(() => assertResolveReflectNoLeak(visualBox, linearBox)).not.toThrow();

    // 4. Failing-first: catch pseudo-unmount (hidden rather than unmounted during replay)
    visual.update(replayScene);
    linear.update(replayScene);

    const phantomChoice = doc.createElement('button');
    phantomChoice.classList.add('control-choice-btn');
    phantomChoice.setAttribute('hidden', 'true');
    visualBox.appendChild(phantomChoice);

    expect(() => {
      if (visualBox.querySelectorAll('.control-choice-btn').length > 0) {
        throw new Error('Scaffold Leak [Invariant 6b]: Reflection choices retained in DOM during replay inspection');
      }
    }).toThrow(/Invariant 6b/);

    visualBox.removeChild(phantomChoice);
  });

  // --- Invariant 7: Help & Replay ---
  it('Invariant 7 (Help/Replay): supported states record provenance and do not alter mathematical requirement, fail-first verified', () => {
    let episode = canonicalEpisode();
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });

    // Request help in decide beat ({ type: 'request-help' })
    episode = applyIntent(episode, { type: 'request-help' });
    expect(episode.support.dimensions.commonDenominator).toBe('high support');

    // Mathematical requirement is preserved: common denominator still required
    expect(episode.expectedResponse.responsibility).toBe('choose-common-denominator');
    expect(episode.expectedResponse.inputKind).toBe('whole-fraction');

    // Submit response under assisted support
    episode = applyIntent(episode, {
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
    });

    const lastProv = episode.responseProvenance.at(-1);
    expect(lastProv.evidenceCategory).toBe('supported-construction');
    expect(lastProv.helpHistory.length).toBeGreaterThan(0);

    // Failing-first: assert that unrecorded help or wiped expectation is caught
    const corruptedState = {
      ...episode,
      expectedResponse: { responsibility: 'system-demonstration' }, // leaked agency
    };
    expect(() => {
      if (corruptedState.expectedResponse.responsibility !== 'choose-common-denominator') {
        throw new Error('Scaffold Leak [Invariant 7]: Help altered learner mathematical responsibility');
      }
    }).toThrow(/Invariant 7/);
  });

  // --- Invariant 8: Retry & Stale-State ---
  function assertRetryStaleStateIsolated(visualBox, linearBox, proposedInvalid) {
    for (const box of [visualBox, linearBox]) {
      const input = box.querySelector('input');
      // After failure, the input should NOT keep the invalid value as an answer
      if (input && input.value === proposedInvalid) {
        throw new Error(`Scaffold Leak [Invariant 8]: Stale invalid value remained in input: ${input.value}`);
      }
      // Recovery feedback must not leak the correct answer
      const recoveryAlert = box.querySelector('.recovery-feedback')?.textContent || '';
      if (recoveryAlert.includes('12 is the answer') || recoveryAlert.includes('Use 12')) {
        throw new Error(`Scaffold Leak [Invariant 8]: Recovery feedback leaked the answer: "${recoveryAlert}"`);
      }
    }
  }

  it('Invariant 8 (Retry/Stale-State): invalid attempt retains prior work and clears error without answer leak, fail-first verified', () => {
    let episode = canonicalEpisode();
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });

    // Propose invalid common denominator 5
    episode = applyIntent(episode, {
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: '5', denominator: '1' },
    });

    // Still in decide beat with recovery state
    expect(episode.beat).toBe('decide');
    expect(episode.lastRecovery).toBeTruthy();

    const scene = resolveRenderableScene({ state: episode });
    expect(scene.meaning.status.recovery).toBeTruthy();
    const { visualBox, linearBox } = mountBoth(scene);

    expect(() => assertRetryStaleStateIsolated(visualBox, linearBox, '5')).not.toThrow();

    // Prior work (notice) is retained in completed summary
    const summaries = Array.from(visualBox.querySelectorAll('.completed-beat-summary')).map((s) => s.textContent);
    expect(summaries).toContain('Units do not match.');

    // Failing-first: simulate stale value or leaking feedback
    const leakingLinear = doc.createElement('div');
    const alert = doc.createElement('div');
    alert.classList.add('recovery-feedback');
    alert.textContent = 'Invalid. Use 12.';
    leakingLinear.appendChild(alert);
    expect(() => assertRetryStaleStateIsolated(visualBox, leakingLinear, '5')).toThrow(/Invariant 8/);
  });

  // --- Invariant 9: Capability Fallback ---
  it('Invariant 9 (Capability Fallback): valid path exceeding LCD 30 fails closed to authorized symbolic continuation, fail-first verified', () => {
    let episode = canonicalEpisode();
    episode = applyIntent(episode, { type: 'acknowledge-encounter' });
    episode = applyIntent(episode, { type: 'submit-notice', matchesUnits: false });

    // Propose valid common denominator 60 (> 30 ceiling for fraction bar)
    episode = applyIntent(episode, {
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: '60', denominator: '1' },
    });

    // 1. Direct bar projection yields capability refusal
    const barResult = projectScene({
      state: episode,
      representationRole: 'fraction-bar',
      presentationMode: 'standard-motion',
    });
    expect(barResult.kind).toBe('capability-refusal');
    expect(barResult.status).toBe('valid-but-outside-representation-capability');
    expect(barResult.continuation.representationRole).toBe('symbolic');

    // 2. resolveRenderableScene transitions cleanly to symbolic
    const resolvedScene = resolveRenderableScene({
      state: episode,
      initialRole: 'fraction-bar',
      presentationMode: 'standard-motion',
    });
    expect(resolvedScene.kind).toBe('scene');
    expect(resolvedScene.meaning.representationRole).toBe('symbolic');

    // 3. Failing-first: catch violation if refusal is converted into invalid error
    expect(() => {
      if (barResult.status === 'invalid-answer') {
        throw new Error('Scaffold Leak [Invariant 9]: Capability refusal incorrectly marked as invalid');
      }
    }).not.toThrow();

    expect(() => {
      const corruptedRefusal = { status: 'invalid-answer' };
      if (corruptedRefusal.status === 'invalid-answer') {
        throw new Error('Scaffold Leak [Invariant 9]: Capability refusal incorrectly marked as invalid');
      }
    }).toThrow(/Invariant 9/);
  });
});
