import { buildCuratedProblem } from '../content/generator.js';
import { PHASE1_GOLDEN_CASES } from '../content/data/phase1-golden-cases.js';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
  PHASE2_REFLECTION_EPISODE_DEFINITION,
  withActiveCondition,
} from '../interaction/index.js';
import {
  createBeatContainer,
  createButton,
  createLinearPathRenderer,
  STRINGS,
} from '../render/index.js';
import { resolveRenderableScene } from '../render/contract.js';
import {
  getDefaultCondition,
  getRegisteredCondition,
  REGISTERED_CONDITIONS,
} from './conditions.js';

const APP_RENDER_STRINGS = Object.freeze({
  ...STRINGS,
  resolve: Object.freeze({
    ...STRINGS.resolve,
    continueButton: STRINGS.resolve.continueReflectionButton,
  }),
});

function canonicalInstance() {
  const fixture = PHASE1_GOLDEN_CASES.find((candidate) => (
    candidate.id === 'curated-relatively-prime-addition-non-least'
  ));
  if (!fixture) throw new Error('the canonical Phase 2 fixture is missing');
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: {
      left: fixture.left,
      right: fixture.right,
      reviewedTransitions: fixture.reviewedTransitions ?? [],
    },
  });
}

function makeElement(tagName, className = '') {
  const element = document.createElement(tagName);
  if (className) {
    for (const name of className.split(/\s+/)) {
      if (name) element.classList.add(name);
    }
  }
  return element;
}

function setHidden(element, hidden) {
  element.hidden = hidden;
  if (hidden) element.setAttribute('hidden', '');
  else element.removeAttribute('hidden');
}

function presentationModeFor({ override, motionQuery }) {
  if (override === 'standard-motion' || override === 'reduced-motion' || override === 'instant-test') {
    return override;
  }
  return motionQuery?.matches ? 'reduced-motion' : 'standard-motion';
}

function createInitialState(instance, condition) {
  return createEpisode({
    instance,
    episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
    activeCondition: condition.activeCondition,
  });
}

/**
 * Compose the first learner-facing FractionFlow episode.
 *
 * This module owns DOM composition and app-only controls. Mathematical truth,
 * instructional transitions, scene projection, and rendering remain upstream
 * and are connected through their existing contracts.
 */
export function createFractionFlowApp({
  root,
  initialConditionId = getDefaultCondition().id,
  presentationMode = 'auto',
  instance = canonicalInstance(),
} = {}) {
  if (!root) throw new Error('app root element is required');

  let selectedCondition = getRegisteredCondition(initialConditionId);
  let state = createInitialState(instance, selectedCondition);
  let visualView = true;
  let activityNotice = '';
  let mounted = false;
  let visualRenderer = null;
  let linearRenderer = null;
  let motionQuery = null;
  let motionListener = null;
  let documentClickListener = null;

  let appRoot;
  let displayMenu;
  let displayMenuButton;
  let viewToggle;
  let visualHost;
  let linearHost;
  let helpButton;
  let replayButton;
  let supportNotice;
  let completionPanel;

  function closeDisplayMenu() {
    if (!displayMenu || displayMenu.hasAttribute('hidden')) return;
    setHidden(displayMenu, true);
    displayMenuButton.setAttribute('aria-expanded', 'false');
    displayMenuButton.setAttribute('aria-label', STRINGS.app.displayChoicesButton);
  }

  function createDisplayMenu() {
    const wrapper = makeElement('div', 'app-display-menu-wrap');
    displayMenuButton = createButton({
      label: '⚙',
      ariaLabel: STRINGS.app.displayChoicesButton,
      className: 'app-gear-button',
      onClick: () => {
        const shouldOpen = displayMenu.hasAttribute('hidden');
        setHidden(displayMenu, !shouldOpen);
        displayMenuButton.setAttribute('aria-expanded', String(shouldOpen));
        displayMenuButton.setAttribute(
          'aria-label',
          shouldOpen ? STRINGS.app.closeDisplayChoices : STRINGS.app.displayChoicesButton,
        );
      },
    });
    displayMenuButton.setAttribute('aria-expanded', 'false');
    displayMenuButton.setAttribute('aria-controls', 'fractionflow-display-menu');
    displayMenuButton.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !displayMenu.hasAttribute('hidden')) {
        event.stopPropagation();
        closeDisplayMenu();
        displayMenuButton.focus();
      }
    });
    wrapper.appendChild(displayMenuButton);

    displayMenu = makeElement('div', 'app-display-menu');
    displayMenu.id = 'fractionflow-display-menu';
    displayMenu.setAttribute('role', 'group');
    setHidden(displayMenu, true);

    displayMenu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeDisplayMenu();
        displayMenuButton.focus();
      }
    });

    const heading = makeElement('h2', 'app-display-menu-heading');
    heading.textContent = STRINGS.app.displayChoicesHeading;
    displayMenu.appendChild(heading);

    const list = makeElement('div', 'app-display-options');
    for (const condition of REGISTERED_CONDITIONS) {
      const option = makeElement('button', 'app-display-option');
      option.type = 'button';
      option.setAttribute('data-condition-id', condition.id);
      option.setAttribute('data-display-code', condition.activeCondition.display);
      option.setAttribute('data-choreography-code', condition.activeCondition.choreography);
      option.setAttribute('data-prompt-cadence-code', condition.activeCondition.promptCadence);
      option.setAttribute('data-connection-code', condition.activeCondition.connectionMaking);
      option.setAttribute('aria-pressed', String(condition.id === selectedCondition.id));

      const optionLabel = makeElement('span', 'app-display-option-label');
      optionLabel.textContent = condition.label;
      option.appendChild(optionLabel);
      const optionDescription = makeElement('span', 'app-display-option-description');
      optionDescription.textContent = condition.description;
      option.appendChild(optionDescription);

      option.addEventListener('click', () => {
        selectedCondition = getRegisteredCondition(condition.id);
        state = withActiveCondition(state, selectedCondition.activeCondition);
        activityNotice = STRINGS.app.displayChanged(selectedCondition.label);
        closeDisplayMenu();
        render();
        displayMenuButton.focus();
      });
      list.appendChild(option);
    }
    displayMenu.appendChild(list);
    wrapper.appendChild(displayMenu);

    documentClickListener = (event) => {
      if (!displayMenu.hasAttribute('hidden') && !wrapper.contains(event.target)) {
        closeDisplayMenu();
      }
    };
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('click', documentClickListener);
    }

    return wrapper;
  }

  function createShell() {
    appRoot = makeElement('div', 'fractionflow-app');

    const episode = makeElement('main', 'app-episode');
    episode.setAttribute('aria-label', 'Fraction practice');

    const viewControls = makeElement('div', 'app-view-controls');
    viewToggle = createButton({
      label: STRINGS.app.readSteps,
      ariaLabel: STRINGS.app.readSteps,
      className: 'app-secondary-button',
      onClick: () => {
        visualView = !visualView;
        updateViewVisibility();
      },
    });
    viewToggle.setAttribute('aria-pressed', 'false');
    viewControls.appendChild(viewToggle);
    episode.appendChild(viewControls);

    visualHost = makeElement('section', 'app-visual-view');
    visualHost.setAttribute('aria-label', STRINGS.app.visualViewLabel);
    episode.appendChild(visualHost);

    linearHost = makeElement('section', 'app-linear-view');
    linearHost.setAttribute('aria-label', STRINGS.app.linearViewLabel);
    setHidden(linearHost, true);
    episode.appendChild(linearHost);

    const supportPanel = makeElement('aside', 'app-support-panel');
    const supportControls = makeElement('div', 'app-support-controls');
    helpButton = createButton({
      label: STRINGS.app.helpButton,
      className: 'app-secondary-button',
      onClick: () => dispatchAction({ type: 'request-help' }),
    });
    replayButton = createButton({
      label: STRINGS.app.replayButton,
      className: 'app-secondary-button',
      onClick: () => dispatchAction({ type: 'request-replay' }),
    });
    supportControls.appendChild(helpButton);
    supportControls.appendChild(replayButton);
    supportPanel.appendChild(supportControls);
    supportNotice = makeElement('p', 'app-support-notice sr-only');
    supportNotice.setAttribute('aria-live', 'polite');
    supportPanel.appendChild(supportNotice);
    episode.appendChild(supportPanel);

    completionPanel = makeElement('section', 'app-completion-panel');
    const restartButton = createButton({
      label: STRINGS.app.restartButton,
      className: 'app-secondary-button',
      onClick: () => {
        state = createInitialState(instance, selectedCondition);
        activityNotice = STRINGS.app.problemRestarted;
        render();
      },
    });
    completionPanel.appendChild(restartButton);
    setHidden(completionPanel, true);
    episode.appendChild(completionPanel);

    appRoot.appendChild(episode);

    const footer = makeElement('footer', 'app-footer');
    const title = makeElement('h1');
    title.textContent = STRINGS.app.title;
    footer.appendChild(title);
    footer.appendChild(createDisplayMenu());
    appRoot.appendChild(footer);
    root.replaceChildren(appRoot);
  }

  function updateViewVisibility() {
    setHidden(visualHost, !visualView);
    setHidden(linearHost, visualView);
    viewToggle.textContent = visualView ? STRINGS.app.readSteps : STRINGS.app.showPicture;
    viewToggle.setAttribute('aria-label', viewToggle.textContent);
    viewToggle.setAttribute('aria-pressed', String(!visualView));
  }

  function updateConditionMetadata() {
    appRoot.setAttribute('data-condition-id', selectedCondition.id);
    appRoot.setAttribute('data-display-code', selectedCondition.activeCondition.display);
    appRoot.setAttribute('data-choreography-code', selectedCondition.activeCondition.choreography);
    appRoot.setAttribute('data-prompt-cadence-code', selectedCondition.activeCondition.promptCadence);
    appRoot.setAttribute('data-connection-code', selectedCondition.activeCondition.connectionMaking);
    for (const option of displayMenu.querySelectorAll('.app-display-option')) {
      option.setAttribute(
        'aria-pressed',
        String(option.getAttribute('data-condition-id') === selectedCondition.id),
      );
    }
  }

  function updateSupportControls() {
    const resolved = state.status === 'resolved';
    helpButton.disabled = resolved;
    replayButton.disabled = resolved || state.beat === 'encounter';
    setHidden(completionPanel, !resolved);
    supportNotice.textContent = activityNotice;
  }

  function render() {
    if (!mounted) return;
    const mode = presentationModeFor({ override: presentationMode, motionQuery });
    const scene = resolveRenderableScene({
      state,
      initialRole: 'fraction-bar',
      presentationMode: mode,
    });

    if (!visualRenderer) {
      visualRenderer = createBeatContainer({
        container: visualHost,
        dispatchAction,
        strings: APP_RENDER_STRINGS,
      });
      visualRenderer.mount(scene);
    } else {
      visualRenderer.update(scene);
    }

    if (!linearRenderer) {
      linearRenderer = createLinearPathRenderer({
        container: linearHost,
        dispatchAction,
        strings: APP_RENDER_STRINGS,
      });
      linearRenderer.mount(scene);
    } else {
      linearRenderer.update(scene);
    }

    updateConditionMetadata();
    updateSupportControls();
    updateViewVisibility();
  }

  function dispatchAction(action) {
    try {
      state = applyIntent(state, action);
      if (action.type === 'request-help') {
        const help = state.helpHistory.at(-1);
        activityNotice = STRINGS.app.helpLevels[help.level] || STRINGS.app.helpLevels.orient;
      } else if (action.type === 'request-replay') {
        activityNotice = STRINGS.app.replayNote;
      } else if (state.status === 'resolved') {
        activityNotice = STRINGS.resolve.complete;
      } else {
        activityNotice = '';
      }
      render();
    } catch (error) {
      activityNotice = action.type === 'request-replay'
        ? STRINGS.app.noReplayYet
        : STRINGS.app.tryAgain;
      render();
    }
  }

  function handleMotionChange() {
    render();
  }

  return {
    mount() {
      if (mounted) return this;
      createShell();
      if (presentationMode === 'auto' && typeof globalThis.matchMedia === 'function') {
        motionQuery = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
        motionListener = handleMotionChange;
        if (typeof motionQuery.addEventListener === 'function') {
          motionQuery.addEventListener('change', motionListener);
        }
      }
      mounted = true;
      render();
      return this;
    },
    update() {
      render();
      return this;
    },
    destroy() {
      if (motionQuery && motionListener && typeof motionQuery.removeEventListener === 'function') {
        motionQuery.removeEventListener('change', motionListener);
      }
      if (documentClickListener && typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
        document.removeEventListener('click', documentClickListener);
        documentClickListener = null;
      }
      visualRenderer?.destroy();
      linearRenderer?.destroy();
      root.replaceChildren();
      mounted = false;
      visualRenderer = null;
      linearRenderer = null;
    },
    getState() {
      return state;
    },
    getReplayEnvelope() {
      return createReplayEnvelope(state);
    },
    getSelectedCondition() {
      return selectedCondition;
    },
    dispatch(action) {
      dispatchAction(action);
      return this;
    },
  };
}
