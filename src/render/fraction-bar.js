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

function createTrackAndReadout({ numerator, denominator, isSubdivided = false, mode }) {
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

    if (isSubdivided) {
      segmentEl.classList.add('subdivided');
    }

    trackEl.appendChild(segmentEl);
  }

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

  return { trackEl, readoutEl };
}

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

    // Create or reuse root element
    if (!rootEl) {
      rootEl = document.createElement('div');
      rootEl.classList.add('fraction-bar-container');
      rootEl.setAttribute('data-side', side);
      container.appendChild(rootEl);
    }

    rootEl.setAttribute('role', 'img');
    rootEl.setAttribute('tabindex', '-1'); // Display surface: never focusable

    // Clear and build bar contents
    rootEl.replaceChildren();

    // Determine choreography treatment during transform beat
    const isTransformBeat = scene.meaning.currentTask?.beat === 'transform';
    const isChanged = Boolean(scene.meaning.transition?.changed?.includes(side));
    const choreography = scene.presentation.choreography || 'in-place';
    const isJuxtaposed = isTransformBeat && isChanged && choreography === 'juxtaposed';
    const isSequential = isTransformBeat && isChanged && choreography === 'sequential';

    if (isJuxtaposed) {
      rootEl.classList.add('choreography-juxtaposed');
      rootEl.classList.remove('choreography-sequential');

      const pre = scene.meaning.transition.pre[side];
      const post = scene.meaning.transition.post[side];
      const preNum = Number(pre.numerator);
      const preDen = Number(pre.denominator);
      const postNum = Number(post.numerator);
      const postDen = Number(post.denominator);

      rootEl.setAttribute('aria-label', `${strings.transition.beforeAria(side, preNum, preDen)} ${strings.transition.afterAria(side, postNum, postDen)}`);

      const wrapper = document.createElement('div');
      wrapper.classList.add('fraction-bar-juxtaposed');

      // Row 1: Before
      const beforeRow = document.createElement('div');
      beforeRow.classList.add('fraction-bar-comparison-row', 'fraction-bar-row-before');
      const beforeBadgeWrap = document.createElement('div');
      beforeBadgeWrap.classList.add('fraction-bar-badge-wrap');
      const beforeBadge = document.createElement('span');
      beforeBadge.classList.add('fraction-bar-badge');
      beforeBadge.textContent = strings.transition.beforeLabel(preNum, preDen);
      beforeBadgeWrap.appendChild(beforeBadge);
      beforeRow.appendChild(beforeBadgeWrap);

      const beforeBody = document.createElement('div');
      beforeBody.classList.add('fraction-bar-row-body');
      const beforeElements = createTrackAndReadout({
        numerator: preNum,
        denominator: preDen,
        isSubdivided: false,
        mode,
      });
      beforeBody.appendChild(beforeElements.trackEl);
      beforeBody.appendChild(beforeElements.readoutEl);
      beforeRow.appendChild(beforeBody);
      wrapper.appendChild(beforeRow);

      // Row 2: After
      const afterRow = document.createElement('div');
      afterRow.classList.add('fraction-bar-comparison-row', 'fraction-bar-row-after');
      const afterBadgeWrap = document.createElement('div');
      afterBadgeWrap.classList.add('fraction-bar-badge-wrap');
      const afterBadge = document.createElement('span');
      afterBadge.classList.add('fraction-bar-badge');
      afterBadge.textContent = strings.transition.afterLabel(postNum, postDen);
      afterBadgeWrap.appendChild(afterBadge);
      afterRow.appendChild(afterBadgeWrap);

      const afterBody = document.createElement('div');
      afterBody.classList.add('fraction-bar-row-body');
      const afterElements = createTrackAndReadout({
        numerator: postNum,
        denominator: postDen,
        isSubdivided: true,
        mode,
      });
      afterBody.appendChild(afterElements.trackEl);
      afterBody.appendChild(afterElements.readoutEl);
      afterRow.appendChild(afterBody);
      wrapper.appendChild(afterRow);

      rootEl.appendChild(wrapper);
    } else if (isSequential) {
      rootEl.classList.add('choreography-sequential');
      rootEl.classList.remove('choreography-juxtaposed');

      const pre = scene.meaning.transition.pre[side];
      const post = scene.meaning.transition.post[side];
      const preNum = Number(pre.numerator);
      const preDen = Number(pre.denominator);
      const postNum = Number(post.numerator);
      const postDen = Number(post.denominator);

      rootEl.setAttribute('aria-label', `${strings.transition.step1Aria(side, preNum, preDen)} ${strings.transition.stepConnector(postDen)}. ${strings.transition.step2Aria(side, postNum, postDen)}`);

      const wrapper = document.createElement('div');
      wrapper.classList.add('fraction-bar-sequential');

      // Card 1: Step 1
      const step1Card = document.createElement('div');
      step1Card.classList.add('fraction-bar-step-card', 'fraction-bar-step-1');
      const step1Header = document.createElement('div');
      step1Header.classList.add('fraction-bar-step-header');
      const step1Heading = document.createElement('span');
      step1Heading.classList.add('fraction-bar-step-heading');
      step1Heading.textContent = strings.transition.step1Label(preNum, preDen);
      step1Header.appendChild(step1Heading);
      step1Card.appendChild(step1Header);

      const step1Body = document.createElement('div');
      step1Body.classList.add('fraction-bar-row-body');
      const step1Elements = createTrackAndReadout({
        numerator: preNum,
        denominator: preDen,
        isSubdivided: false,
        mode,
      });
      step1Body.appendChild(step1Elements.trackEl);
      step1Body.appendChild(step1Elements.readoutEl);
      step1Card.appendChild(step1Body);
      wrapper.appendChild(step1Card);

      // Connector
      const connector = document.createElement('div');
      connector.classList.add('fraction-bar-step-connector');
      connector.setAttribute('aria-hidden', 'true');
      const connectorText = document.createElement('span');
      connectorText.classList.add('fraction-bar-connector-text');
      connectorText.textContent = `\u2193 ${strings.transition.stepConnector(postDen)}`;
      connector.appendChild(connectorText);
      wrapper.appendChild(connector);

      // Card 2: Step 2
      const step2Card = document.createElement('div');
      step2Card.classList.add('fraction-bar-step-card', 'fraction-bar-step-2');
      const step2Header = document.createElement('div');
      step2Header.classList.add('fraction-bar-step-header');
      const step2Heading = document.createElement('span');
      step2Heading.classList.add('fraction-bar-step-heading');
      step2Heading.textContent = strings.transition.step2Label(postNum, postDen);
      step2Header.appendChild(step2Heading);
      step2Card.appendChild(step2Header);

      const step2Body = document.createElement('div');
      step2Body.classList.add('fraction-bar-row-body');
      const step2Elements = createTrackAndReadout({
        numerator: postNum,
        denominator: postDen,
        isSubdivided: true,
        mode,
      });
      step2Body.appendChild(step2Elements.trackEl);
      step2Body.appendChild(step2Elements.readoutEl);
      step2Card.appendChild(step2Body);
      wrapper.appendChild(step2Card);

      rootEl.appendChild(wrapper);
    } else {
      // Standard single-bar layout (in-place or default)
      rootEl.classList.remove('choreography-juxtaposed', 'choreography-sequential');
      rootEl.setAttribute('aria-label', strings.encounter.barAriaLabel(side, numerator, denominator));

      const isSubdivided = Boolean(scene.meaning.transition && scene.meaning.transition.changed.includes(side));
      const elements = createTrackAndReadout({
        numerator,
        denominator,
        isSubdivided,
        mode,
      });
      rootEl.appendChild(elements.trackEl);
      rootEl.appendChild(elements.readoutEl);
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
