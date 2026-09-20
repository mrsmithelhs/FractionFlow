import { assertValidScene } from './contract.js';
import { STRINGS } from './strings.js';

/**
 * Fraction Bar Renderer (DECISION-025, DECISION-011)
 *
 * Renders a visual fraction bar for an operand.
 * Key constraints:
 * - DECISION-025: Bar segments are NOT interactive targets. The bar is a display surface.
 *   Segments are not focusable, clickable, or tappable.
 * - Displays a stable unit whole (0 to 1) with equal partitions.
 * - Shaded segments indicate the numerator count; total segments indicate denominator.
 * - Communicates equivalent subdivision smoothly in standard motion, or instantly in reduced motion.
 * - Pure: computes zero mathematics; reads quantities directly from scene.meaning.
 */

export function createFractionBarRenderer({
  side = 'left',
  container,
  strings = STRINGS,
} = {}) {
  if (!container) {
    throw new Error('container element is required for fraction-bar renderer');
  }

  let rootEl = null;

  function render(scene) {
    assertValidScene(scene);

    const quantityData = scene.meaning.quantities[side];
    if (!quantityData) {
      throw new Error(`quantity data missing for side: ${side}`);
    }

    const currentForm = quantityData.currentForm;
    const numerator = Number(currentForm.numerator);
    const denominator = Number(currentForm.denominator);
    if (!Number.isSafeInteger(numerator)
      || !Number.isSafeInteger(denominator)
      || numerator < 0
      || denominator <= 0
      || numerator > denominator) {
      throw new TypeError('fraction bar form is outside the supported bar range');
    }
    const mode = scene.presentation.mode;

    const barAria = strings.encounter.barAriaLabel(side, numerator, denominator);

    // Create or reuse root element
    if (!rootEl) {
      rootEl = document.createElement('div');
      rootEl.classList.add('fraction-bar-container');
      rootEl.setAttribute('data-side', side);
      container.appendChild(rootEl);
    }

    rootEl.setAttribute('role', 'img');
    rootEl.setAttribute('aria-label', barAria);
    rootEl.setAttribute('tabindex', '-1'); // Display surface: never focusable

    // Clear and build bar contents
    rootEl.replaceChildren();

    // Fraction bar track
    const trackEl = document.createElement('div');
    trackEl.classList.add('fraction-bar-track');
    if (mode === 'reduced-motion') {
      trackEl.classList.add('reduced-motion');
    }

    // Segments: Display-only! (DECISION-025)
    // Segments are explicitly NOT buttons, NOT clickable, NOT focusable.
    for (let i = 0; i < denominator; i += 1) {
      const segmentEl = document.createElement('div');
      segmentEl.classList.add('fraction-bar-segment');
      segmentEl.setAttribute('aria-hidden', 'true'); // Accessible description on parent role="img"

      if (i < numerator) {
        segmentEl.classList.add('shaded');
      } else {
        segmentEl.classList.add('unshaded');
      }

      // Check if this segment represents newly subdivided parts
      if (scene.meaning.transition && scene.meaning.transition.changed.includes(side)) {
        segmentEl.classList.add('subdivided');
      }

      trackEl.appendChild(segmentEl);
    }

    rootEl.appendChild(trackEl);

    // Numerical readout for visual inspection
    const readoutEl = document.createElement('div');
    readoutEl.classList.add('fraction-bar-readout');
    readoutEl.setAttribute('aria-hidden', 'true');
    const numeratorEl = document.createElement('span');
    numeratorEl.classList.add('fraction-bar-readout-numerator');
    numeratorEl.textContent = String(numerator);
    const dividerEl = document.createElement('span');
    dividerEl.classList.add('fraction-bar-readout-divider');
    const denominatorEl = document.createElement('span');
    denominatorEl.classList.add('fraction-bar-readout-denominator');
    denominatorEl.textContent = String(denominator);
    readoutEl.appendChild(numeratorEl);
    readoutEl.appendChild(dividerEl);
    readoutEl.appendChild(denominatorEl);
    rootEl.appendChild(readoutEl);
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
