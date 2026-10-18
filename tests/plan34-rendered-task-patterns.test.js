import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { LEGACY_PRACTICE_TYPES_V4, PLAN34_PRACTICE_TYPES_V5 } from '../src/app/practice-types.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

function fraction(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

function finishFirstConstruct(app) {
  app.dispatch({ type: 'acknowledge-encounter' });
  app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
  app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 12) });
  app.dispatch({ type: 'submit-operation-result', proposed: fraction(11, 12) });
  app.dispatch({ type: 'finish-compact-episode' });
}

describe('Plan 34 pinned historical task patterns', () => {
  let document;
  let root;
  let app;

  beforeEach(() => {
    document = setupMockDOM();
    root = document.createElement('div');
    document.body.appendChild(root);
    app = createFractionFlowApp({ root, practiceTypes: PLAN34_PRACTICE_TYPES_V5, presentationMode: 'instant-test' });
    app.mount();
    root.querySelector('.app-practice-button').click();
  });

  afterEach(() => {
    app?.destroy();
    teardownMockDOM();
  });

  it('preserves v5 Plan 34 associations and completes its historical construct task', () => {
    const v4 = LEGACY_PRACTICE_TYPES_V4[0];
    const active = PLAN34_PRACTICE_TYPES_V5[0];
    expect(active.setRevision).toBe('5');
    expect(active.items.slice(0, 11).map((item) => item.id)).toEqual(v4.items.map((item) => item.id));
    expect(active.items.slice(11)).toEqual([]);
    expect(active.items.slice(0, 11).map((item) => item.patternId ?? null)).toEqual([
      'full-addition.construct-equivalent',
      'full-addition.inspect-keep-repair',
      null, null,
      'full-addition.inspect-keep-repair',
      null, null, null, null, null, null,
    ]);
    expect(app.getState().episodeDefinition.revision).toBe('1');
    expect(app.getState().taskContext).toMatchObject({
      itemId: 'two-thirds-plus-one-fourth', targetDenominator: '12',
      practiceSetId: active.setId, practiceSetRevision: '5',
    });
    expect(root.querySelector('.app-visual-view .active-beat-controls').textContent)
      .toContain('Use twelfths.');
    expect(root.querySelector('.app-visual-view .active-beat-controls').textContent)
      .not.toContain('11/12');
    expect(root.querySelector('.app-support-controls .app-secondary-button').hidden).toBe(true);
    expect(root.querySelector('.app-replay-button').hidden).toBe(true);
    expect(root.textContent).not.toContain('11/12');

    app.dispatch({ type: 'acknowledge-encounter' });
    const help = root.querySelector('.app-visual-view .active-beat-controls .app-secondary-button');
    expect(help.hidden).toBe(false);
    help.click();
    let multiplier = root.querySelector('.app-visual-view #visual-transform-task-help input');
    expect(multiplier).not.toBeNull();
    expect(document.activeElement).toBe(multiplier);
    multiplier.value = '3';
    root.querySelector('.app-visual-view #visual-transform-task-help .control-submit-btn').click();
    expect(app.getState().supportHistory.at(-1).classification).toBe('incorrect');
    expect(app.getState().established.conversions.left).toBeNull();

    multiplier = root.querySelector('.app-visual-view #visual-transform-task-help input');
    multiplier.value = '4';
    multiplier.parentNode.parentNode.querySelector('.control-submit-btn').click();
    expect(app.getState().supportHistory.at(-1).classification).toBe('accepted');
    expect(app.getState().established.conversions.left).toBeNull();
    let numerator = root.querySelector('.app-visual-view #transform-num-input-left');
    numerator.value = '8';
    numerator.parentNode.parentNode.querySelector('.control-submit-btn').click();
    numerator = root.querySelector('.app-visual-view #transform-num-input-right');
    numerator.value = '3';
    numerator.parentNode.parentNode.querySelector('.control-submit-btn').click();
    const operation = root.querySelector('.app-visual-view #operate-sum-input');
    operation.value = '11';
    operation.focus();
    root.querySelector('.app-view-toggle').click();
    const linearOperation = root.querySelector('.app-linear-view #linear-operate-sum-input');
    expect(linearOperation.value).toBe('11');
    expect(document.activeElement).toBe(linearOperation);
    expect(root.querySelector('.app-support-controls .app-secondary-button').hidden).toBe(true);
    linearOperation.parentNode.parentNode.querySelector('.control-submit-btn').click();
    expect(app.getState().beat).toBe('resolve');
    expect(root.textContent).toContain("That's right.");
    expect(root.textContent).not.toContain('reflection');
    const finish = root.querySelector('.app-linear-view .active-beat-controls .control-btn');
    expect(finish.textContent).toBe('Finish');
    finish.click();
    expect(app.getState().status).toBe('resolved');
    expect(app.getState().established.resolution).toBeNull();
    expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(false);
  });

  it.each([
    ['visual', false],
    ['linear', true],
  ])('renders truthful inspect keep/change controls with help, draft and focus continuity in the %s surface', (_label, linear) => {
    finishFirstConstruct(app);
    root.querySelector('.app-next-button').click();
    expect(app.getState().taskContext.patternId).toBe('full-addition.inspect-keep-repair');
    if (linear) root.querySelector('.app-view-toggle').click();
    expect(root.querySelector(linear ? '.app-linear-view .active-beat-controls' : '.app-visual-view .active-beat-controls').textContent)
      .toContain('Use twelfths.');
    app.dispatch({ type: 'acknowledge-encounter' });

    const host = () => root.querySelector(linear ? '.app-linear-view' : '.app-visual-view');
    const active = () => host().querySelector('.active-beat-section');
    let question = active().querySelector('.active-beat-header .active-beat-prompt');
    expect(question.textContent).toBe('Does this new fraction show the same amount as the first fraction?');
    expect(active().querySelectorAll('.active-beat-header .active-beat-prompt')).toHaveLength(1);
    const newFraction = active().querySelector('.symbolic-fraction');
    expect(newFraction).not.toBeNull();
    expect(newFraction.querySelector('.symbolic-numerator').textContent).toBe('5');
    expect(newFraction.getAttribute('aria-label')).toBe('New fraction 5 over 12');
    expect(active().querySelector('.active-beat-controls').textContent).not.toContain('Proposal');
    const taskControls = active().querySelector('.active-beat-controls');
    const keepButton = [...taskControls.querySelectorAll('button')]
      .find((button) => button.getAttribute('aria-label') === 'Keep new fraction 5 over 12');
    expect(keepButton).not.toBeUndefined();
    expect(taskControls.children.indexOf(newFraction))
      .toBeLessThan(taskControls.children.indexOf(keepButton));
    expect(active().textContent).not.toContain('6/12');
    expect(root.querySelector('.app-replay-button').hidden).toBe(true);

    active().querySelector('.active-beat-controls .app-secondary-button').click();
    expect(active().textContent).toContain('The top and bottom must use the same multiplier');
    expect(active().textContent).not.toMatch(/correct|incorrect|answer/i);
    const helpControl = active().querySelector('.active-beat-controls .app-secondary-button');
    expect(helpControl.getAttribute('aria-controls')).toBe(linear ? 'linear-transform-task-help' : 'visual-transform-task-help');
    expect(active().querySelector(`#${linear ? 'linear' : 'visual'}-transform-task-help`).textContent)
      .toContain('The top and bottom must use the same multiplier');
    active().querySelectorAll('button')[1].click();
    let input = host().querySelector(linear ? '#linear-transform-num-input-left' : '#transform-num-input-left');
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('5');
    input.value = '6';
    root.querySelector('.app-view-toggle').click();
    const changedHost = root.querySelector(linear ? '.app-visual-view' : '.app-linear-view');
    input = changedHost.querySelector(linear ? '#transform-num-input-left' : '#linear-transform-num-input-left');
    expect(input.value).toBe('6');
    expect(document.activeElement).toBe(input);
    changedHost.querySelector('.active-beat-controls .app-secondary-button').click();
    const closeHelp = changedHost.querySelector('.active-beat-controls .app-secondary-button');
    expect(closeHelp.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(closeHelp);
    expect(changedHost.querySelector(`#${linear ? 'linear' : 'visual'}-transform-task-help`)).toBeNull();

    const keep = changedHost.querySelector('.active-beat-controls').querySelectorAll('button')[0];
    keep.click();
    expect(app.getState().lastRecovery.classification.kind).toBe('false-candidate-kept');
    expect(app.getState().established.conversions.left).toBeNull();
    expect(root.textContent).toContain('Not quite.');
    input = changedHost.querySelector(linear ? '#transform-num-input-left' : '#linear-transform-num-input-left');
    input.value = '6';
    input.parentNode.parentNode.querySelector('.control-submit-btn').click();
    expect(app.getState().established.conversions.left).toEqual(fraction(6, 12));
    expect(app.getState().beat).toBe('transform');
    expect(app.getState().expectedResponse.target).toBe('right');
    expect(root.textContent).not.toContain('Your total is');
    expect(app.getState().established.lastConversion).toMatchObject({ side: 'left', form: fraction(6, 12) });
    const keepRight = active().querySelectorAll('button')[0];
    expect(keepRight.textContent).toBe('Keep');
    keepRight.click();
    expect(app.getState().beat).toBe('operate');
    const completedAtOperate = host().querySelector('.completed-beats-section').textContent;
    expect(completedAtOperate).toContain('First fraction: 1/2 = 6/12');
    expect(completedAtOperate).toContain('Second fraction: 1/3 = 4/12');
    expect(completedAtOperate).not.toContain('Units do not match.');
    expect(completedAtOperate).not.toContain('Common denominator:');
    const sum = host().querySelector(linear ? '#linear-operate-sum-input' : '#operate-sum-input');
    sum.value = '10';
    sum.parentNode.parentNode.querySelector('.control-submit-btn').click();
    expect(app.getState().beat).toBe('resolve');
    const completedAtResolve = host().querySelector('.completed-beats-section').textContent;
    expect(completedAtResolve).toContain('First fraction: 1/2 = 6/12');
    expect(completedAtResolve).toContain('Second fraction: 1/3 = 4/12');
    expect(completedAtResolve).toContain('Sum: 10/12');
    expect(completedAtResolve).not.toContain('Units do not match.');
    expect(completedAtResolve).not.toContain('Common denominator:');
  });
});
