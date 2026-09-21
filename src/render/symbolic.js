import { assertValidScene } from './contract.js';

/**
 * Symbolic Notation Renderer (Interaction Grammar §19, Quality doc §68)
 *
 * Renders standard mathematical fraction notation and operation state.
 * Key constraints:
 * - Truthful symbolic equality: Never displays a false stable equality (Quality doc §68).
 *   Only displays equals sign '=' when mathematical equality between expressions is truthful.
 * - Pure: Never computes arithmetic or parses text; reads directly from scene.meaning.
 * - Integrated secondary view: Expresses current forms established by the learner.
 */

function createFractionElement(numerator, denominator, ariaPrefix = '') {
  const fractionEl = document.createElement('span');
  fractionEl.classList.add('symbolic-fraction');
  fractionEl.setAttribute('role', 'math');
  fractionEl.setAttribute(
    'aria-label',
    ariaPrefix ? `${ariaPrefix} ${numerator} over ${denominator}` : `${numerator} over ${denominator}`,
  );

  const numEl = document.createElement('span');
  numEl.classList.add('symbolic-numerator');
  numEl.setAttribute('aria-hidden', 'true');
  numEl.textContent = String(numerator);

  const barEl = document.createElement('span');
  barEl.classList.add('symbolic-bar');
  barEl.setAttribute('aria-hidden', 'true');

  const denEl = document.createElement('span');
  denEl.classList.add('symbolic-denominator');
  denEl.setAttribute('aria-hidden', 'true');
  denEl.textContent = String(denominator);

  fractionEl.appendChild(numEl);
  fractionEl.appendChild(barEl);
  fractionEl.appendChild(denEl);

  return fractionEl;
}

function createOperatorElement(symbol, ariaLabel) {
  const opEl = document.createElement('span');
  opEl.classList.add('symbolic-operator');
  opEl.setAttribute('role', 'math');
  opEl.setAttribute('aria-label', ariaLabel);
  opEl.textContent = symbol;
  return opEl;
}

export function createSymbolicRenderer({ container } = {}) {
  if (!container) {
    throw new Error('container element is required for symbolic renderer');
  }

  let rootEl = null;

  function render(scene) {
    assertValidScene(scene);

    if (!rootEl) {
      rootEl = document.createElement('div');
      rootEl.classList.add('symbolic-container');
      container.appendChild(rootEl);
    }

    rootEl.replaceChildren();

    const leftQuantity = scene.meaning.quantities.left;
    const rightQuantity = scene.meaning.quantities.right;
    const operation = scene.meaning.operation;
    const opSign = operation.operation === 'add' ? '+' : '−';
    const opLabel = operation.operation === 'add' ? 'plus' : 'minus';

    // Expression container
    const exprEl = document.createElement('div');
    exprEl.classList.add('symbolic-expression');

    // Display current forms
    const leftForm = leftQuantity.currentForm;
    const rightForm = rightQuantity.currentForm;

    exprEl.appendChild(createFractionElement(leftForm.numerator, leftForm.denominator));
    exprEl.appendChild(createOperatorElement(opSign, opLabel));
    exprEl.appendChild(createFractionElement(rightForm.numerator, rightForm.denominator));

    // Truthful Equality Check (Quality doc §68)
    // Only display '= result' when the operation has actually been established!
    if (operation.rawResult) {
      exprEl.appendChild(createOperatorElement('=', 'equals'));
      exprEl.appendChild(createFractionElement(
        operation.rawResult.numerator,
        operation.rawResult.denominator,
      ));
    }

    rootEl.appendChild(exprEl);

    // If preferred final form differs (simplification established in resolve beat)
    const simplified = operation.simplifiedResult || operation.preferredFinalForm;
    if (simplified && operation.rawResult
      && (simplified.numerator !== operation.rawResult.numerator
        || simplified.denominator !== operation.rawResult.denominator)) {
      const simplifiedEl = document.createElement('div');
      simplifiedEl.classList.add('symbolic-simplified');
      simplifiedEl.appendChild(createOperatorElement('=', 'simplified to'));
      simplifiedEl.appendChild(createFractionElement(
        simplified.numerator,
        simplified.denominator,
        'simplified to',
      ));
      rootEl.appendChild(simplifiedEl);
    }
  }

  return {
    mount(scene) {
      render(scene);
      return this;
    },
    update(scene) {
      render(scene);
      return this;
    },
    destroy() {
      if (rootEl && rootEl.parentNode) {
        rootEl.parentNode.removeChild(rootEl);
      }
      rootEl = null;
    },
    getElement() {
      return rootEl;
    },
  };
}
