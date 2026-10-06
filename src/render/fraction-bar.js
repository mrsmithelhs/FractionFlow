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

export function createTrackAndReadout({ numerator, denominator, isSubdivided = false, mode }) {
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

function greatestCommonDivisor(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) {
    [left, right] = [right, left % right];
  }
  return left || 1;
}

function boundaryKey(index, denominator) {
  const divisor = greatestCommonDivisor(index, denominator);
  return `${index / divisor}/${denominator / divisor}`;
}

function createPersistentTrackAndReadout({ numerator, denominator, mode }) {
  const trackEl = document.createElement('div');
  trackEl.classList.add('fraction-bar-track', 'fraction-bar-track-persistent');
  if (mode === 'reduced-motion') trackEl.classList.add('reduced-motion');

  const fillEl = document.createElement('div');
  fillEl.classList.add('fraction-bar-fill');
  fillEl.setAttribute('aria-hidden', 'true');
  fillEl.style.width = `${(numerator / denominator) * 100}%`;
  trackEl.appendChild(fillEl);

  const segmentLayerEl = document.createElement('div');
  segmentLayerEl.classList.add('fraction-bar-segment-layer');
  segmentLayerEl.setAttribute('aria-hidden', 'true');
  trackEl.appendChild(segmentLayerEl);

  const boundaryLayerEl = document.createElement('div');
  boundaryLayerEl.classList.add('fraction-bar-boundary-layer');
  boundaryLayerEl.setAttribute('aria-hidden', 'true');
  trackEl.appendChild(boundaryLayerEl);

  const readoutEl = document.createElement('div');
  readoutEl.classList.add('fraction-bar-readout');
  readoutEl.setAttribute('aria-hidden', 'true');
  const numeratorEl = document.createElement('span');
  numeratorEl.classList.add('fraction-bar-readout-numerator');
  const dividerEl = document.createElement('span');
  dividerEl.classList.add('fraction-bar-readout-divider');
  const denominatorEl = document.createElement('span');
  denominatorEl.classList.add('fraction-bar-readout-denominator');
  readoutEl.appendChild(numeratorEl);
  readoutEl.appendChild(dividerEl);
  readoutEl.appendChild(denominatorEl);

  return {
    trackEl,
    fillEl,
    segmentLayerEl,
    boundaryLayerEl,
    boundaryNodes: new Map(),
    readoutEl,
    numeratorEl,
    denominatorEl,
  };
}

function updatePersistentTrack(elements, {
  numerator,
  denominator,
  isSubdivided,
  mode,
  preserveFill,
  markNewBoundaries,
}) {
  const {
    trackEl,
    fillEl,
    segmentLayerEl,
    boundaryLayerEl,
    boundaryNodes,
    numeratorEl,
    denominatorEl,
  } = elements;
  trackEl.classList.toggle('reduced-motion', mode === 'reduced-motion');
  trackEl.classList.toggle('subdivided', isSubdivided);
  trackEl.setAttribute('data-numerator', String(numerator));
  trackEl.setAttribute('data-denominator', String(denominator));

  if (!preserveFill) fillEl.style.width = `${(numerator / denominator) * 100}%`;

  segmentLayerEl.replaceChildren();
  for (let index = 0; index < denominator; index += 1) {
    const segmentEl = document.createElement('div');
    segmentEl.classList.add(
      'fraction-bar-segment',
      index < numerator ? 'shaded' : 'unshaded',
    );
    if (isSubdivided) segmentEl.classList.add('subdivided');
    segmentEl.setAttribute('aria-hidden', 'true');
    segmentLayerEl.appendChild(segmentEl);
  }

  const targetKeys = new Set();
  for (let index = 1; index < denominator; index += 1) {
    const key = boundaryKey(index, denominator);
    targetKeys.add(key);
    if (boundaryNodes.has(key)) continue;

    const boundaryEl = document.createElement('span');
    boundaryEl.classList.add('fraction-bar-boundary');
    if (markNewBoundaries) boundaryEl.classList.add('fraction-bar-boundary-new');
    boundaryEl.setAttribute('data-boundary-key', key);
    boundaryEl.setAttribute('aria-hidden', 'true');
    boundaryEl.style.left = `${(index / denominator) * 100}%`;
    if (markNewBoundaries) boundaryEl.style.transform = 'scaleY(0)';
    boundaryLayerEl.appendChild(boundaryEl);
    boundaryNodes.set(key, boundaryEl);
  }

  for (const [key, boundaryEl] of boundaryNodes) {
    if (!markNewBoundaries && boundaryEl.classList.contains('fraction-bar-boundary-new')) {
      boundaryEl.classList.remove('fraction-bar-boundary-new');
      boundaryEl.style.transform = '';
    }
    if (targetKeys.has(key)) continue;
    if (boundaryEl.parentNode === boundaryLayerEl) {
      boundaryLayerEl.removeChild(boundaryEl);
    }
    boundaryNodes.delete(key);
  }

  numeratorEl.textContent = String(numerator);
  denominatorEl.textContent = String(denominator);
  return [...boundaryNodes.values()].filter((boundaryEl) => (
    boundaryEl.classList.contains('fraction-bar-boundary-new')
  ));
}

export function createFractionBarRenderer({
  side = 'left',
  container,
  strings = STRINGS,
  dispatchAction,
} = {}) {
  if (!container) {
    throw new Error('container element is required for fraction-bar renderer');
  }

  let rootEl = null;
  let persistentElements = null;
  let lastDisplayedForm = null;
  let lastTransitionEndpoints = null;
  let wasReplaying = false;
  let pendingReplayReveal = false;
  const activeBoundaryAnimations = new Set();

  function cancelBoundaryAnimations({ settle = true } = {}) {
    for (const record of activeBoundaryAnimations) {
      if (settle && record.element.isConnected) {
        record.element.style.transform = '';
        record.element.classList.remove('fraction-bar-boundary-new');
      }
      record.animation.cancel();
    }
    activeBoundaryAnimations.clear();
  }

  function animateBoundaries(boundaries) {
    if (!boundaries.length) return;
    cancelBoundaryAnimations();
    const revealDuration = 560;
    const highlightArrivalDuration = 80;
    const highlightFadeDuration = 920;
    const totalDuration = revealDuration + highlightArrivalDuration + highlightFadeDuration;
    const revealEnd = revealDuration / totalDuration;
    const highlightFull = (revealDuration + highlightArrivalDuration) / totalDuration;
    for (const element of boundaries) {
      if (typeof element.animate !== 'function') {
        element.style.transform = '';
        element.classList.remove('fraction-bar-boundary-new');
        continue;
      }
      const animation = element.animate(
        [
          {
            offset: 0,
            transform: 'scaleY(0)',
            boxShadow: 'none',
            easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)',
          },
          {
            offset: revealEnd,
            transform: 'scaleY(1)',
            boxShadow: 'none',
            easing: 'ease-out',
          },
          {
            offset: highlightFull,
            transform: 'scaleY(1)',
            boxShadow: '0 0 2px 1px var(--ff-bar-boundary-glow)',
            easing: 'ease-out',
          },
          {
            offset: 1,
            transform: 'scaleY(1)',
            boxShadow: 'none',
          },
        ],
        {
          duration: totalDuration,
          fill: 'both',
        },
      );
      const record = { element, animation };
      activeBoundaryAnimations.add(record);
      Promise.resolve(animation.finished).then(() => {
        if (!activeBoundaryAnimations.has(record)) return;
        if (element.isConnected) {
          element.style.transform = '';
          element.classList.remove('fraction-bar-boundary-new');
        }
        activeBoundaryAnimations.delete(record);
        animation.cancel();
      }).catch(() => {
        // Cancellation is expected when the learner changes modes, begins another
        // conversion, leaves the view, or destroys the renderer.
      });
    }
  }

  function sameForm(first, second) {
    return Boolean(first && second
      && String(first.numerator) === String(second.numerator)
      && String(first.denominator) === String(second.denominator));
  }

  function transitionEndpoints(transition) {
    if (!transition?.pre || !transition?.post) return null;
    const serialize = (forms) => ['left', 'right'].map((operandSide) => {
      const form = forms[operandSide];
      return form ? `${form.numerator}/${form.denominator}` : '-';
    }).join('|');
    return `${serialize(transition.pre)}>${serialize(transition.post)}`;
  }

  function renderPersistentInPlace(scene, currentForm, mode) {
    const transition = scene.meaning.transition;
    const beat = scene.meaning.currentTask?.beat;
    const isReplaying = Boolean(scene.presentation?.isReplaying);
    const isReflectionInspection = beat === 'reflect' && isReplaying && Boolean(transition);
    const replayPre = isReplaying && transition?.pre?.[side];
    const displayForm = replayPre || currentForm;
    const isSubdivided = !isReplaying
      && Boolean(transition?.changed?.includes(side));
    const pre = transition?.pre?.[side];
    const post = transition?.post?.[side];
    const currentTransitionEndpoints = transitionEndpoints(transition);
    const isNewTransition = Boolean(currentTransitionEndpoints
      && currentTransitionEndpoints !== lastTransitionEndpoints);
    const isAcceptedConversion = !isReplaying
      && isNewTransition
      && Boolean(pre && post)
      && Boolean(transition?.changed?.includes(side))
      && !sameForm(pre, post)
      && sameForm(lastDisplayedForm, pre)
      && sameForm(currentForm, post);
    const isExplicitReplayReveal = pendingReplayReveal
      && wasReplaying
      && !isReplaying
      && !isReflectionInspection
      && Boolean(pre && post && transition?.changed?.includes(side))
      && sameForm(lastDisplayedForm, pre)
      && sameForm(currentForm, post);
    const shouldAnimate = mode === 'standard-motion'
      && (isAcceptedConversion || isExplicitReplayReveal)
      && !isReflectionInspection;
    pendingReplayReveal = false;

    if (mode !== 'standard-motion' || isReplaying || !transition) {
      cancelBoundaryAnimations();
    } else if (shouldAnimate) {
      cancelBoundaryAnimations();
    }

    if (!persistentElements) {
      persistentElements = createPersistentTrackAndReadout({
        numerator: Number(displayForm.numerator),
        denominator: Number(displayForm.denominator),
        mode,
      });
      rootEl.classList.add('fraction-bar-container-persistent');
      rootEl.appendChild(persistentElements.trackEl);
      rootEl.appendChild(persistentElements.readoutEl);
    }

    const numerator = Number(displayForm.numerator);
    const denominator = Number(displayForm.denominator);
    const addedBoundaries = updatePersistentTrack(persistentElements, {
      numerator,
      denominator,
      isSubdivided,
      mode,
      preserveFill: Boolean(isReplaying || wasReplaying || shouldAnimate),
      markNewBoundaries: shouldAnimate,
    });

    if (isReplaying && transition?.changed?.includes(side)) {
      persistentElements.readoutEl.setAttribute('hidden', 'true');
      let replayControls = rootEl.querySelector('.fraction-bar-in-place-replay');
      if (!replayControls) {
        replayControls = rootEl.querySelector('.fraction-bar-replay-reserve') || document.createElement('div');
        replayControls.classList.remove('fraction-bar-replay-reserve');
        replayControls.classList.add('fraction-bar-in-place-replay', 'fraction-bar-replay-controls');
        replayControls.style.height = '';
        replayControls.removeAttribute('aria-hidden');
        replayControls.replaceChildren();
        const badge = document.createElement('span');
        badge.classList.add('fraction-bar-badge');
        replayControls.appendChild(badge);
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.classList.add('fraction-bar-toggle-btn', 'app-secondary-button');
        toggleBtn.addEventListener('click', () => {
          if (dispatchAction) {
            pendingReplayReveal = true;
            dispatchAction({ type: 'dismiss-replay' });
          }
        });
        replayControls.appendChild(toggleBtn);
        if (!replayControls.isConnected) rootEl.appendChild(replayControls);
      }
      const badge = replayControls.querySelector('.fraction-bar-badge');
      const toggleBtn = replayControls.querySelector('.fraction-bar-toggle-btn');
      badge.textContent = typeof strings.transition?.replayingLabel === 'function'
        ? strings.transition.replayingLabel(numerator, denominator)
        : `Starting parts: ${numerator}/${denominator}`;
      toggleBtn.textContent = strings.transition?.showNewParts || 'Show new parts';
      toggleBtn.setAttribute('aria-label', toggleBtn.textContent);
      rootEl.setAttribute(
        'aria-label',
        typeof strings.transition?.replayingAria === 'function'
          ? strings.transition.replayingAria(side, numerator, denominator)
          : `${side === 'left' ? 'First' : 'Second'} fraction replaying: started with ${numerator} of ${denominator} equal parts.`,
      );
    } else {
      persistentElements.readoutEl.removeAttribute('hidden');
      const replayControls = rootEl.querySelector('.fraction-bar-in-place-replay');
      if (replayControls) {
        const measuredHeight = replayControls.getBoundingClientRect?.().height;
        const retainedHeight = Number.isFinite(measuredHeight) && measuredHeight > 0
          ? measuredHeight
          : (Number(replayControls.offsetHeight) || 84);
        replayControls.replaceChildren();
        replayControls.classList.remove('fraction-bar-in-place-replay', 'fraction-bar-replay-controls');
        replayControls.classList.add('fraction-bar-replay-reserve');
        replayControls.style.height = `${retainedHeight}px`;
        replayControls.setAttribute('aria-hidden', 'true');
      }
      if (!transition) {
        const replayReserve = rootEl.querySelector('.fraction-bar-replay-reserve');
        if (replayReserve) rootEl.removeChild(replayReserve);
      }
      rootEl.setAttribute('aria-label', strings.encounter.barAriaLabel(side, numerator, denominator));
    }

    if (shouldAnimate) animateBoundaries(addedBoundaries);

    lastDisplayedForm = {
      numerator: String(displayForm.numerator),
      denominator: String(displayForm.denominator),
    };
    lastTransitionEndpoints = currentTransitionEndpoints;
    wasReplaying = isReplaying;
  }

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

    // Determine choreography treatment when a conversion is established (transform or operate) or replaying
    const isReplaying = Boolean(scene.presentation?.isReplaying);
    const beat = scene.meaning.currentTask?.beat;
    const isConversionBeat = beat === 'transform' || beat === 'operate' || isReplaying;
    const isChanged = Boolean(scene.meaning.transition?.changed?.includes(side));
    const choreography = scene.presentation.choreography || 'in-place';
    const isJuxtaposed = isConversionBeat && isChanged && choreography === 'juxtaposed';
    const isSequential = isConversionBeat && isChanged && choreography === 'sequential';

    if (choreography === 'in-place') {
      rootEl.classList.remove('choreography-juxtaposed', 'choreography-sequential');
      rootEl.classList.add('choreography-in-place');
      renderPersistentInPlace(scene, currentForm, mode);
      return;
    }

    cancelBoundaryAnimations();
    persistentElements = null;
    lastDisplayedForm = null;
    wasReplaying = false;
    pendingReplayReveal = false;
    rootEl.classList.remove('fraction-bar-container-persistent', 'choreography-in-place');

    // Static comparison treatments retain their existing segment rendering.
    rootEl.replaceChildren();

    if (isJuxtaposed) {
      rootEl.classList.add('choreography-juxtaposed');
      rootEl.classList.remove('choreography-sequential', 'choreography-in-place');
      rootEl.classList.toggle('replay-active', isReplaying);

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
      if (isReplaying) {
        beforeRow.classList.add('replay-highlight');
      }
      const beforeBadgeWrap = document.createElement('div');
      beforeBadgeWrap.classList.add('fraction-bar-badge-wrap');
      const beforeBadge = document.createElement('span');
      beforeBadge.classList.add('fraction-bar-badge');
      beforeBadge.textContent = isReplaying
        ? `${strings.transition.beforeLabel(preNum, preDen)} (replaying)`
        : strings.transition.beforeLabel(preNum, preDen);
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
      rootEl.classList.remove('choreography-juxtaposed', 'choreography-in-place');
      rootEl.classList.toggle('replay-active', isReplaying);

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
      if (isReplaying) {
        step1Card.classList.add('replay-highlight');
      }
      const step1Header = document.createElement('div');
      step1Header.classList.add('fraction-bar-step-header');
      const step1Heading = document.createElement('span');
      step1Heading.classList.add('fraction-bar-step-heading');
      step1Heading.textContent = isReplaying
        ? `${strings.transition.step1Label(preNum, preDen)} (replaying)`
        : strings.transition.step1Label(preNum, preDen);
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
      // Static single-bar fallback for non-transition scenes.
      rootEl.classList.remove('choreography-juxtaposed', 'choreography-sequential', 'choreography-in-place', 'replay-active');
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
      cancelBoundaryAnimations();
      if (rootEl && rootEl.parentNode) {
        rootEl.parentNode.removeChild(rootEl);
      }
      rootEl = null;
      persistentElements = null;
      lastDisplayedForm = null;
      lastTransitionEndpoints = null;
      wasReplaying = false;
      pendingReplayReveal = false;
    },
    getElement() {
      return rootEl;
    },
  };
}
