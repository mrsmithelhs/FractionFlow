import {
  describeFraction,
  isCorrectAnswer,
  SUBTRACTION_FIXTURE_MODELS,
} from './model.js';
import './styles.css';

const VALID_MODES = new Set(['takeaway', 'comparison']);
const query = new URLSearchParams(window.location.search);
const mode = query.get('mode') || 'takeaway';
const initialFixture = Number(query.get('fixture') || 0);

if (!VALID_MODES.has(mode)) {
  throw new Error('Choose the takeaway or comparison prototype.');
}

const root = document.querySelector('#subtraction-prototype');
const fixtureSelect = document.querySelector('#fixture-select');
const originalEquation = document.querySelector('#original-equation');
const renamedEquation = document.querySelector('#renamed-equation');
const representation = document.querySelector('#representation');
const visual = document.querySelector('#representation-visual');
const operationButton = document.querySelector('#operation-button');
const operationStatus = document.querySelector('#operation-status');
const answerForm = document.querySelector('#answer-form');
const numeratorInput = document.querySelector('#answer-numerator');
const denominatorInput = document.querySelector('#answer-denominator');
const answerFeedback = document.querySelector('#answer-feedback');
const state = {
  fixtureIndex: Number.isInteger(initialFixture)
    && initialFixture >= 0
    && initialFixture < SUBTRACTION_FIXTURE_MODELS.length
    ? initialFixture
    : 0,
  removedParts: 0n,
  gapShown: false,
};

fixtureSelect.value = String(state.fixtureIndex);
root.dataset.mode = mode;
document.querySelector('#takeaway-link').setAttribute(
  'aria-current',
  mode === 'takeaway' ? 'page' : 'false',
);
document.querySelector('#comparison-link').setAttribute(
  'aria-current',
  mode === 'comparison' ? 'page' : 'false',
);

function fractionLabel(fraction) {
  return fraction.numerator.toString()
    + ' of '
    + fraction.denominator.toString()
    + ' equal parts';
}

function makeBarMarkup(fraction, label, removedParts = 0n) {
  const denominator = Number(fraction.denominator);
  const numerator = fraction.numerator;
  const segments = [];

  for (let index = 0; index < denominator; index += 1) {
    const shaded = BigInt(index) < numerator;
    const removed = shaded && BigInt(index) < removedParts;
    const classes = ['bar-segment'];
    if (shaded) classes.push('is-shaded');
    if (removed) classes.push('is-removed');
    segments.push('<span aria-hidden="true" class="' + classes.join(' ') + '"></span>');
  }

  const removedDescription = removedParts > 0n
    ? ' ' + removedParts.toString() + ' part'
      + (removedParts === 1n ? ' is' : 's are')
      + ' marked as taken away.'
    : '';

  return '<div class="quantity-row">'
    + '<span class="quantity-label">' + label + '</span>'
    + '<div class="fraction-whole" style="--part-count:' + denominator + '" role="img" aria-label="'
    + label + ': ' + fractionLabel(fraction) + '.' + removedDescription + '">'
    + segments.join('')
    + '</div>'
    + '</div>';
}

function makeComparisonMarkup(model) {
  const denominator = Number(model.commonDenominator);
  const gapShown = state.gapShown;
  const gapStart = Number(model.renamedRight.numerator) + 1;
  const gapLength = Number(model.displayedDifference.numerator);
  const gap = gapShown
    ? '<div class="gap-grid" aria-hidden="true" style="--part-count:' + denominator + '">'
      + '<span class="gap-marker" style="grid-column: ' + gapStart + ' / span ' + gapLength + '"></span>'
      + '</div>'
    : '';

  return '<div class="comparison-model">'
    + makeBarMarkup(model.renamedLeft, 'First amount')
    + makeBarMarkup(model.renamedRight, 'Second amount')
    + gap
    + (gapShown
      ? '<p class="model-note">The bracket marks the space between the bars.</p>'
      : '')
    + '</div>';
}

function updateLocation() {
  const params = new URLSearchParams();
  params.set('mode', mode);
  params.set('fixture', String(state.fixtureIndex));
  window.history.replaceState(null, '', '?' + params.toString());
  document.querySelector('#takeaway-link').href = '?mode=takeaway&fixture=' + state.fixtureIndex;
  document.querySelector('#comparison-link').href = '?mode=comparison&fixture=' + state.fixtureIndex;
}

function render() {
  const model = SUBTRACTION_FIXTURE_MODELS[state.fixtureIndex];
  originalEquation.textContent = describeFraction(model.left)
    + ' − '
    + describeFraction(model.right);

  const needsRename = model.left.denominator !== model.commonDenominator
    || model.right.denominator !== model.commonDenominator;
  renamedEquation.hidden = !needsRename;
  renamedEquation.textContent = needsRename
    ? describeFraction(model.renamedLeft) + ' − ' + describeFraction(model.renamedRight)
    : '';

  representation.dataset.representation = mode;
  visual.innerHTML = mode === 'takeaway'
    ? '<div class="takeaway-model">'
      + makeBarMarkup(model.renamedLeft, 'Starting amount', state.removedParts)
      + (state.removedParts > 0n
        ? '<p class="model-note">A marked part was taken away.</p>'
        : '')
      + '</div>'
    : makeComparisonMarkup(model);

  if (mode === 'takeaway') {
    const removalComplete = state.removedParts >= model.renamedRight.numerator;
    operationButton.textContent = removalComplete ? 'Parts marked' : 'Remove one part';
    operationButton.setAttribute('aria-disabled', removalComplete ? 'true' : 'false');
    operationStatus.textContent = removalComplete
      ? 'Count the parts that are still shaded.'
      : 'Mark each part from the second fraction as taken away.';
    answerForm.hidden = !removalComplete;
  } else {
    operationButton.textContent = state.gapShown ? 'Gap shown' : 'Show the gap';
    operationButton.setAttribute('aria-disabled', state.gapShown ? 'true' : 'false');
    operationStatus.textContent = state.gapShown
      ? 'Count the parts inside the bracket.'
      : 'Show the space between the two amounts.';
    answerForm.hidden = !state.gapShown;
  }

  updateLocation();
}

function resetForFixture(index) {
  state.fixtureIndex = index;
  state.removedParts = 0n;
  state.gapShown = false;
  numeratorInput.value = '';
  denominatorInput.value = '';
  answerFeedback.textContent = '';
  answerFeedback.className = 'answer-feedback';
  render();
}

operationButton.addEventListener('click', () => {
  const model = SUBTRACTION_FIXTURE_MODELS[state.fixtureIndex];
  if (mode === 'takeaway' && state.removedParts < model.renamedRight.numerator) {
    state.removedParts += 1n;
    operationStatus.textContent = state.removedParts >= model.renamedRight.numerator
      ? 'Count the parts that are still shaded.'
      : 'A part is marked as taken away.';
    render();
  } else if (mode === 'comparison' && !state.gapShown) {
    state.gapShown = true;
    operationStatus.textContent = 'Count the parts inside the bracket.';
    render();
  }
});

fixtureSelect.addEventListener('change', () => {
  resetForFixture(Number(fixtureSelect.value));
});

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const model = SUBTRACTION_FIXTURE_MODELS[state.fixtureIndex];
  const correct = isCorrectAnswer(
    numeratorInput.value.trim(),
    denominatorInput.value.trim(),
    model.exactDifference,
  );

  answerFeedback.textContent = correct ? 'That’s right.' : 'Try again.';
  answerFeedback.className = correct
    ? 'answer-feedback is-correct'
    : 'answer-feedback is-retry';
});

render();
