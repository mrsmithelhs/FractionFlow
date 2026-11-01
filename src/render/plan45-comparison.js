import { assertValidScene } from './contract.js';
import { createSymbolicFraction } from './symbolic.js';
import { STRINGS } from './strings.js';

const RELATIONS = Object.freeze([
  ...['<', '=', '>'].map((glyph) => ({
    glyph,
    label: STRINGS.plan45.relationLabels[glyph],
    aria: STRINGS.plan45.relationAria[glyph],
  })),
]);

function element(tag, className = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function append(parent, ...children) {
  children.forEach((child) => parent.appendChild(child));
}

function fractionText(form, prefix) {
  return createSymbolicFraction(form.numerator, form.denominator, { ariaPrefix: prefix });
}

function comparisonExpression(sourceForms, acceptedRelation = null) {
  const row = element('div', 'plan45-expression');
  append(row,
    fractionText(sourceForms.first, 'First fraction'),
  );
  if (acceptedRelation) {
    const relation = element('span', 'plan45-accepted-relation');
    relation.setAttribute('role', 'math');
    relation.setAttribute('aria-label', STRINGS.plan45.relationSpoken[acceptedRelation]);
    relation.textContent = acceptedRelation;
    append(row, relation);
  } else {
    const separator = element('span', 'plan45-expression-separator');
    separator.setAttribute('aria-hidden', 'true');
    separator.textContent = '?';
    append(row, separator);
  }
  append(row, fractionText(sourceForms.second, 'Second fraction'));
  return row;
}

function makeBarModel(form, side, { verified = false } = {}) {
  const numerator = Number(form.numerator);
  const denominator = Number(form.denominator);
  const article = element('figure', `plan45-model${verified ? ' plan45-model-verified' : ''}`);
  const caption = element('figcaption', 'plan45-model-caption');
  caption.textContent = STRINGS.plan45.amount[side];
  append(article, caption);
  const track = element('div', 'plan45-model-track');
  track.setAttribute('role', 'img');
  track.setAttribute('aria-label', STRINGS.plan45.modelAria(side, numerator, denominator));
  for (let index = 0; index < denominator; index += 1) {
    const cell = element('span', `plan45-model-part${index < numerator ? ' is-shaded' : ''}`);
    cell.setAttribute('aria-hidden', 'true');
    append(track, cell);
  }
  append(article, track);
  return article;
}

function makeLinearModel(form, side) {
  const text = element('p', 'plan45-linear-model');
  text.textContent = STRINGS.plan45.linearModel(side, form.numerator, form.denominator);
  return text;
}

function makeProgression(scene, getProgression, isActive) {
  if (scene.meaning.status.episode !== 'resolved') return null;
  const progression = getProgression?.();
  if (!progression || progression.actionKind === 'none') return null;
  const wrap = element('div', 'plan45-progression');
  if (progression.notice) {
    const notice = element('p', 'plan45-progression-notice');
    notice.textContent = progression.notice;
    append(wrap, notice);
  }
  const button = element('button', 'app-primary-button plan45-progression-button');
  button.type = 'button';
  button.textContent = progression.label;
  button.addEventListener('click', () => {
    if (isActive()) progression.onAction?.();
  });
  append(wrap, button);
  return wrap;
}

function makeConstruction(comparison, callbacks) {
  const work = comparison.construction;
  const section = element('section', 'plan49-construction');
  if (!work) return section;
  const button = (label, action, primary = false) => {
    const node = element('button', 'app-secondary-button'); node.type = 'button'; node.textContent = label;
    if (primary) node.setAttribute('data-plan49-primary', '');
    node.addEventListener('click', () => callbacks.dispatch(action)); return node;
  };
  if (work.phase === 'inactive') {
    append(section, button('Use the same denominator', { type: 'open-comparison-construction' }));
    return section;
  }
  const forms = work.acceptedForms;
  for (const side of ['first', 'second']) if (forms[side]) {
    const row = element('p', 'plan49-accepted-form');
    row.textContent = `${side === 'first' ? 'First' : 'Second'}: ${comparison.sourceForms[side].numerator}/${comparison.sourceForms[side].denominator} = ${forms[side].numerator}/${forms[side].denominator}`;
    append(section, row);
  }
  if (work.phase !== 'denominator') append(section, button('Change denominator', { type: 'revise-comparison-denominator' }));
  if (work.phase === 'ready') return section;
  const side = work.phase;
  const source = comparison.sourceForms[side];
  const isDenominator = side === 'denominator';
  const askingMultiplier = !isDenominator && work.helpRequested && work.acceptedMultiplier === null;
  const kind = isDenominator ? 'denominator' : askingMultiplier ? 'multiplier' : 'numerator';
  const key = `${work.epoch}:${side}:${kind}`;
  const form = element('form', 'plan49-helper-form');
  const id = `plan49-${callbacks.view}-${kind}`;
  const label = element('label', 'plan49-helper-question'); label.htmlFor = id;
  label.textContent = isDenominator ? 'Choose a denominator both fractions can use.'
    : askingMultiplier ? `What multiplier turns ${source.denominator} parts into ${work.target}?`
    : `How many parts out of ${work.target} make the same amount as ${source.numerator}/${source.denominator}?`;
  append(form, label);
  if (isDenominator && work.helpRequested) {
    const cue = element('p', 'plan49-helper-cue');
    cue.textContent = `Try multiplying ${comparison.sourceForms.first.denominator} by ${comparison.sourceForms.second.denominator} to find one common denominator.`; append(form, cue);
  } else if (!isDenominator && work.acceptedMultiplier !== null) {
    const cue = element('p', 'plan49-helper-cue'); cue.textContent = `Multiply the top by ${work.acceptedMultiplier}, too.`; append(form, cue);
  }
  const input = element('input', 'plan49-helper-input'); input.id = id; input.type = 'text'; input.inputMode = 'numeric';
  input.setAttribute('data-plan49-primary', ''); input.setAttribute('autocomplete', 'off'); input.value = callbacks.getDraft(key);
  input.addEventListener('input', () => { callbacks.setDraft(key, input.value); input.setCustomValidity?.(''); });
  if (work.recovery && work.recovery !== 'dependent-work-cleared') {
    const error = element('p', 'plan49-helper-recovery'); error.id = `${id}-error`; error.setAttribute('role', 'status');
    error.textContent = work.recovery === 'unavailable' ? 'That is a common denominator, but this workspace can use numbers up to 144. Try another.'
      : work.recovery === 'not-common' ? 'That is not a common denominator. Try another number.'
      : 'Not quite. Try again.'; input.setAttribute('aria-describedby', error.id); append(form, error);
  }
  if (work.recovery === 'dependent-work-cleared') { const notice = element('p'); notice.setAttribute('role', 'status'); notice.textContent = 'Choose a new denominator. Your earlier renaming was cleared.'; append(form, notice); }
  append(form, input);
  const check = element('button', 'app-secondary-button'); check.type = 'submit'; check.textContent = 'Check'; append(form, check);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!/^(0|[1-9][0-9]{0,29})$/.test(input.value)) { input.setCustomValidity?.('Enter a whole number.'); input.reportValidity?.(); return; }
    callbacks.dispatch({ type: `submit-comparison-${kind}`, phase: side, proposed: input.value });
  });
  append(section, form);
  if (!work.helpRequested) append(section, button(isDenominator ? 'Help me find one' : 'Help with this renaming',
    { type: 'request-comparison-construction-help', helpKind: isDenominator ? 'denominator' : 'multiplier', phase: side }));
  return section;
}

export function createPlan45ComparisonRenderer({
  container,
  view = 'visual',
} = {}) {
  if (!container) throw new Error('Plan 45 renderer requires a container');
  let root = null;
  let responseRegion = null;
  let activeRender = null;

  function update(scene, callbacks = {}) {
    assertValidScene(scene);
    if (typeof callbacks.dispatchAction !== 'function'
      || typeof callbacks.getDraft !== 'function'
      || typeof callbacks.setDraft !== 'function') {
      throw new Error('Plan 45 renderer requires scoped response callbacks');
    }
    if (activeRender) activeRender.active = false;
    const renderScope = { active: true };
    activeRender = renderScope;
    const isActive = () => renderScope.active && activeRender === renderScope;
    const dispatchAction = (action) => isActive() ? callbacks.dispatchAction(action) : false;
    const getDraft = () => isActive() ? callbacks.getDraft() : '';
    const setDraft = (value) => isActive() ? callbacks.setDraft(value) : false;
    const getHelpOpen = () => isActive() ? callbacks.getHelpOpen?.() ?? false : false;
    const setHelpOpen = (open) => isActive() ? callbacks.setHelpOpen?.(open) ?? false : false;
    const getProgression = callbacks.getProgression;
    if (scene.meaning.status?.episode !== 'resolved'
      && scene.meaning.currentTask?.responsibility !== 'compare-symbolic-fraction-magnitudes') {
      throw new Error('Plan 45 renderer requires a validated comparison scene');
    }
    root = element('section', `plan45-comparison plan45-comparison-${view}`);
    root.setAttribute('aria-label', STRINGS.plan45.regionLabel);
    const { comparison, status, support } = scene.meaning;
    append(root, comparisonExpression(comparison.sourceForms, comparison.acceptedRelation));

    if (status.episode === 'resolved') {
      const verification = element('section', 'plan45-verification');
      verification.setAttribute('aria-label', STRINGS.plan45.verificationLabel);
      const heading = element('h2', 'plan45-verification-heading');
      heading.textContent = STRINGS.plan45.promptVerification;
      append(verification, heading);
      if (view === 'visual') {
        const models = element('div', 'plan45-model-pair');
        append(models,
          makeBarModel(comparison.sourceForms.first, 'first', { verified: true }),
          makeBarModel(comparison.sourceForms.second, 'second', { verified: true }),
        );
        append(verification, models);
      } else {
        const models = element('div', 'plan45-linear-model-pair');
        append(models,
          makeLinearModel(comparison.sourceForms.first, 'first'),
          makeLinearModel(comparison.sourceForms.second, 'second'),
        );
        append(verification, models);
      }
      append(root, verification);
      const progression = makeProgression(scene, getProgression, isActive);
      if (progression) append(root, progression);
      container.replaceChildren(root);
      responseRegion = null;
      return;
    }

    const prompt = element('h1', 'plan45-prompt');
    prompt.textContent = STRINGS.plan45.prompt;
    append(root, prompt);

    if (comparison.modelChoice) {
      const source = comparison.sourceForms[comparison.modelChoice];
      const modelWrap = element('section', 'plan45-chosen-model');
      modelWrap.setAttribute('aria-label', STRINGS.plan45.chosenModelLabel);
      if (view === 'visual') append(modelWrap, makeBarModel(source, comparison.modelChoice));
      else append(modelWrap, makeLinearModel(source, comparison.modelChoice));
      append(root, modelWrap);
    }

    if (status.recovery) {
      const recovery = element('p', 'plan45-recovery');
      recovery.id = `plan45-recovery-${view}`;
      recovery.setAttribute('role', 'status');
      recovery.textContent = STRINGS.plan45.recovery;
      append(root, recovery);
    }

    if (comparison.reasoningCue || comparison.notationCue) {
      const cue = element('p', 'plan45-help-cue');
      cue.setAttribute('role', 'status');
      cue.textContent = comparison.reasoningCue || comparison.notationCue;
      append(root, cue);
    }

    const details = element('details', 'plan45-help');
    details.open = Boolean(getHelpOpen());
    details.addEventListener('toggle', () => setHelpOpen(details.open));
    const summary = element('summary', 'plan45-help-summary');
    summary.setAttribute('data-plan45-focus-key', 'help-summary');
    summary.textContent = details.open ? STRINGS.plan45.closeHelp : STRINGS.plan45.needHelp;
    // Record the impending native toggle synchronously before another action can rerender.
    summary.addEventListener('click', () => setHelpOpen(!details.open));
    details.addEventListener('toggle', () => {
      summary.textContent = details.open ? STRINGS.plan45.closeHelp : STRINGS.plan45.needHelp;
    });
    append(details, summary);
    const helpChoices = element('div', 'plan45-help-choices');
      const reasoning = element('button', 'app-secondary-button');
      reasoning.type = 'button';
      reasoning.setAttribute('data-plan45-focus-key', 'reasoning');
      reasoning.textContent = STRINGS.plan45.reasoningTip;
      reasoning.addEventListener('click', () => dispatchAction({ type: 'request-comparison-help', helpKind: 'reasoning' }));
      const notation = element('button', 'app-secondary-button');
      notation.type = 'button';
      notation.setAttribute('data-plan45-focus-key', 'notation');
      notation.textContent = STRINGS.plan45.notationTip;
      notation.addEventListener('click', () => dispatchAction({ type: 'request-comparison-help', helpKind: 'notation' }));
      append(helpChoices, reasoning, notation);

      if (!comparison.modelChoice) {
        const modelPrompt = element('p', 'plan45-model-prompt');
        modelPrompt.textContent = STRINGS.plan45.chooseModel;
        const first = element('button', 'app-secondary-button');
        first.type = 'button';
        first.setAttribute('data-plan45-focus-key', 'model-first');
        first.textContent = STRINGS.plan45.modelFirst;
        first.addEventListener('click', () => dispatchAction({ type: 'request-comparison-model', side: 'first' }));
        const second = element('button', 'app-secondary-button');
        second.type = 'button';
        second.setAttribute('data-plan45-focus-key', 'model-second');
        second.textContent = STRINGS.plan45.modelSecond;
        second.addEventListener('click', () => dispatchAction({ type: 'request-comparison-model', side: 'second' }));
        append(helpChoices, modelPrompt, first, second);
      }

      if (support.label === 'high support') {
        const strategy = element('p', 'plan45-strategy-cue');
        strategy.textContent = STRINGS.plan45.moreStrategy;
        append(helpChoices, strategy);
      }
    if (comparison.construction) append(helpChoices, makeConstruction(comparison, { view, dispatch: dispatchAction,
      getDraft: (key) => isActive() ? callbacks.getConstructionDraft?.(key) ?? '' : '',
      setDraft: (key, value) => isActive() ? callbacks.setConstructionDraft?.(key, value) ?? false : false }));
    append(details, helpChoices);
    append(root, details);

    const response = element('form', 'plan45-response-region');
    const relationInputs = () => [...response.querySelectorAll('.plan45-relation-option input')];
    let selectedDraft = getDraft();
    response.addEventListener('submit', (event) => {
      event.preventDefault();
      const proposed = relationInputs().find((input) => input.checked)?.value || selectedDraft || getDraft();
      if (!proposed) {
        relationInputs()[0]?.focus();
        return;
      }
      dispatchAction({ type: 'submit-fraction-comparison', proposed });
    });
    const group = element('fieldset', 'plan45-relation-group');
    if (status.recovery) group.setAttribute('aria-describedby', `plan45-recovery-${view}`);
    const legend = element('legend', 'sr-only');
    legend.textContent = STRINGS.plan45.relationLegend;
    append(group, legend);
    const options = element('div', 'plan45-relation-options');
    RELATIONS.forEach(({ glyph, label, aria }) => {
      const option = element('label', 'plan45-relation-option');
      const input = element('input');
      input.type = 'radio';
      input.setAttribute('data-plan45-focus-key', `relation-${glyph}`);
      input.name = 'plan45-relation';
      input.value = glyph;
      input.setAttribute('aria-label', aria);
      input.checked = selectedDraft === glyph;
      input.addEventListener('change', () => {
        selectedDraft = glyph;
        setDraft(glyph);
      });
      const visible = element('span', 'plan45-relation-glyph');
      visible.setAttribute('aria-hidden', 'true');
      visible.textContent = glyph;
      const spoken = element('span', 'plan45-relation-label');
      spoken.textContent = label;
      append(option, input, visible, spoken);
      append(options, option);
    });
    append(group, options);
    append(response, group);
    const check = element('button', 'app-primary-button plan45-check-button');
    check.type = 'submit';
    check.setAttribute('data-plan45-focus-key', 'check');
    check.textContent = STRINGS.plan45.check;
    append(response, check);
    append(root, response);
    container.replaceChildren(root);
    responseRegion = {
      readDraft: () => selectedDraft,
      writeDraft: (value) => {
        if (value !== '' && !RELATIONS.some(({ glyph }) => glyph === value)) return false;
        selectedDraft = value;
        relationInputs().forEach((input) => {
          input.checked = input.value === value;
        });
        return true;
      },
      focusPrimary: () => {
        const target = relationInputs().find((input) => input.value === selectedDraft) || relationInputs()[0];
        if (!target?.isConnected) return false;
        target.focus();
        return true;
      },
      primaryInput: () => relationInputs().find((input) => input.value === selectedDraft) || relationInputs()[0],
      checkButton: () => check.isConnected ? check : null,
    };
  }

  function getResponseRegion(id) {
    return id === 'compare' ? responseRegion : null;
  }

  function mount(scene, callbacks) { update(scene, callbacks); }
  function destroy() {
    if (activeRender) activeRender.active = false;
    activeRender = null;
    container.replaceChildren();
    root = null;
    responseRegion = null;
  }

  return { mount, update, destroy, getResponseRegion };
}
