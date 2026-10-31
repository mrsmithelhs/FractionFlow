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

function makeProgression(scene, getProgression) {
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
  button.addEventListener('click', () => progression.onAction?.());
  append(wrap, button);
  return wrap;
}

export function createPlan45ComparisonRenderer({
  container,
  view = 'visual',
  dispatchAction,
  getDraft = () => '',
  setDraft = () => {},
  getHelpOpen = () => false,
  setHelpOpen = () => {},
  getProgression = null,
} = {}) {
  if (!container || typeof dispatchAction !== 'function') throw new Error('Plan 45 renderer requires a container and dispatcher');
  let root = null;
  let responseRegion = null;

  function update(scene) {
    assertValidScene(scene);
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
      const progression = makeProgression(scene, getProgression);
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

  function mount(scene) { update(scene); }
  function destroy() { container.replaceChildren(); root = null; responseRegion = null; }

  return { mount, update, destroy, getResponseRegion };
}
