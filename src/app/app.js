import { buildCuratedProblem } from '../content/generator.js';
import { PHASE1_GOLDEN_CASES } from '../content/data/phase1-golden-cases.js';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
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
import { getPracticeType, PRACTICE_TYPES } from './practice-types.js';

const APP_RENDER_STRINGS = Object.freeze({
  ...STRINGS,
  resolve: Object.freeze({
    ...STRINGS.resolve,
    continueButton: STRINGS.resolve.continueReflectionButton,
  }),
});

function canonicalInstance(fixtureId = 'curated-relatively-prime-addition-non-least') {
  const fixture = PHASE1_GOLDEN_CASES.find((candidate) => (
    candidate.id === fixtureId
  ));
  if (!fixture) throw new Error(`practice fixture is missing: ${fixtureId}`);
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

function createInitialState(instance, practiceType, condition) {
  return createEpisode({
    instance,
    episodeDefinition: practiceType.episodeDefinition,
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
  instance: suppliedInstance = null,
} = {}) {
  if (!root) throw new Error('app root element is required');

  let selectedCondition = getRegisteredCondition(initialConditionId);
  let selectedPracticeType = null;
  let state = null;
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
  let isReplaying = false;
  let entryPage;
  let entryTitle;

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
    heading.textContent = 'Reviewer settings';
    displayMenu.appendChild(heading);

    const conditionLabel = makeElement('p', 'app-display-menu-label');
    conditionLabel.textContent = STRINGS.app.displayChoicesHeading;
    displayMenu.appendChild(conditionLabel);

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
        closeDisplayMenu();
        updateConditionMetadata();
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

    entryPage = makeElement('main', 'app-entry-page');
    entryPage.setAttribute('aria-labelledby', 'fractionflow-title');
    const entryHeader = makeElement('header', 'app-entry-header');
    entryTitle = makeElement('h1', 'app-entry-title');
    entryTitle.id = 'fractionflow-title';
    entryTitle.tabIndex = -1;
    entryTitle.textContent = STRINGS.app.title;
    entryHeader.appendChild(entryTitle);
    const entryLine = makeElement('p', 'app-entry-line');
    entryLine.textContent = 'See how different-sized fraction parts fit together.';
    entryHeader.appendChild(entryLine);
    entryPage.appendChild(entryHeader);

    const practiceList = makeElement('div', 'app-practice-list');
    for (const practiceType of PRACTICE_TYPES) {
      const practiceButton = createButton({
        label: practiceType.label,
        className: 'app-practice-button',
        onClick: () => startPractice(practiceType, { focusEpisode: true, updateFragment: true }),
      });
      practiceButton.setAttribute('data-practice-type', practiceType.id);
      practiceList.appendChild(practiceButton);
    }
    entryPage.appendChild(practiceList);
    // Keep the gear in the natural tab order after the practice button. CSS
    // positions it at the upper right without changing keyboard order.
    entryPage.appendChild(createDisplayMenu());
    const creatorCredit = makeElement('small', 'app-creator-credit');
    creatorCredit.textContent = 'Created by an educator';
    entryPage.appendChild(creatorCredit);
    appRoot.appendChild(entryPage);

    const episode = makeElement('main', 'app-episode');
    episode.setAttribute('aria-label', 'Fraction practice');
    episode.tabIndex = -1;
    setHidden(episode, true);
    const episodeNavigation = makeElement('nav', 'app-episode-navigation');
    episodeNavigation.setAttribute('aria-label', 'Episode navigation');
    const returnButton = createButton({
      label: 'Back to start',
      className: 'app-secondary-button',
      onClick: returnToEntry,
    });
    returnButton.classList.add('app-return-button');
    episodeNavigation.appendChild(returnButton);

    const viewControls = makeElement('div', 'app-view-controls');
    viewToggle = createButton({
      label: STRINGS.app.readSteps,
      ariaLabel: STRINGS.app.readSteps,
      className: 'app-secondary-button',
      onClick: () => {
        visualView = !visualView;
        isReplaying = false;
        updateViewVisibility();
      },
    });
    viewToggle.classList.add('app-view-toggle');
    viewToggle.setAttribute('aria-pressed', 'false');
    viewControls.appendChild(viewToggle);
    episode.appendChild(viewControls);
    episode.appendChild(episodeNavigation);

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
    const restartButton = createButton({
      label: STRINGS.app.restartButton,
      className: 'app-secondary-button',
      onClick: () => {
        if (selectedPracticeType) startPractice(selectedPracticeType, { focusEpisode: true });
      },
    });
    restartButton.classList.add('app-restart-button');
    supportControls.appendChild(helpButton);
    supportControls.appendChild(replayButton);
    supportControls.appendChild(restartButton);
    supportPanel.appendChild(supportControls);
    supportNotice = makeElement('p', 'app-support-notice sr-only');
    supportNotice.setAttribute('aria-live', 'polite');
    supportPanel.appendChild(supportNotice);
    episode.appendChild(supportPanel);

    appRoot.appendChild(episode);
    root.replaceChildren(appRoot);
  }

  function visiblePracticeTypeFromFragment() {
    if (typeof globalThis.location !== 'object') return null;
    let id;
    try {
      id = decodeURIComponent(globalThis.location.hash.slice(1));
    } catch {
      return null;
    }
    return getPracticeType(id);
  }

  function setPracticeFragment(id) {
    if (typeof globalThis.location === 'object' && globalThis.location.hash !== `#${id}`) {
      globalThis.location.hash = id;
    }
  }

  function startPractice(practiceType, { focusEpisode = false, updateFragment = false } = {}) {
    if (!practiceType || !PRACTICE_TYPES.includes(practiceType)) return;
    selectedPracticeType = practiceType;
    const instance = suppliedInstance || canonicalInstance(practiceType.fixtureId);
    state = createInitialState(instance, practiceType, selectedCondition);
    isReplaying = false;
    activityNotice = '';
    setHidden(entryPage, true);
    setHidden(appRoot.querySelector('.app-episode'), false);
    render();
    if (focusEpisode) {
      const episode = appRoot.querySelector('.app-episode');
      if (episode?.isConnected && !episode.hasAttribute('hidden')) episode.focus();
    }
    if (updateFragment) setPracticeFragment(practiceType.id);
  }

  function returnToEntry() {
    if (selectedPracticeType && state) {
      const instance = suppliedInstance || canonicalInstance(selectedPracticeType.fixtureId);
      state = createInitialState(instance, selectedPracticeType, selectedCondition);
    }
    isReplaying = false;
    activityNotice = '';
    closeDisplayMenu();
    setHidden(appRoot.querySelector('.app-episode'), true);
    setHidden(entryPage, false);
    if (typeof globalThis.location === 'object'
      && globalThis.location.hash
      && typeof globalThis.history?.replaceState === 'function') {
      globalThis.history.replaceState(null, '', `${globalThis.location.pathname}${globalThis.location.search}`);
    }
    if (entryTitle?.isConnected && !entryPage.hasAttribute('hidden')) entryTitle.focus();
  }

  function handleHashChange() {
    const practiceType = visiblePracticeTypeFromFragment();
    const episode = appRoot?.querySelector('.app-episode');
    if (practiceType) {
      if (selectedPracticeType?.id !== practiceType.id || episode?.hasAttribute('hidden')) {
        startPractice(practiceType, { focusEpisode: true });
      }
      return;
    }
    if (episode && !episode.hasAttribute('hidden')) returnToEntry();
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
    replayButton.setAttribute('aria-pressed', String(isReplaying));
    supportNotice.textContent = activityNotice;
  }

  function render() {
    if (!mounted || !state) return;
    const mode = presentationModeFor({ override: presentationMode, motionQuery });
    const scene = resolveRenderableScene({
      state,
      initialRole: 'fraction-bar',
      presentationMode: mode,
      isReplaying,
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
    if (action.type === 'dismiss-replay') {
      isReplaying = false;
      activityNotice = '';
      render();
      return;
    }

    try {
      state = applyIntent(state, action);
      if (action.type === 'request-help') {
        isReplaying = false;
        const help = state.helpHistory.at(-1);
        activityNotice = STRINGS.app.helpLevels[help.level] || STRINGS.app.helpLevels.orient;
      } else if (action.type === 'request-replay') {
        const hasTransition = Boolean(state.established?.lastConversion);
        if (hasTransition) {
          isReplaying = !isReplaying;
          activityNotice = isReplaying ? STRINGS.app.replayNote : '';
        } else {
          isReplaying = false;
          activityNotice = STRINGS.app.noReplayYet;
        }
      } else {
        isReplaying = false;
        if (state.status === 'resolved') {
          activityNotice = STRINGS.resolve.complete;
        } else {
          activityNotice = '';
        }
      }
      render();
    } catch (error) {
      isReplaying = false;
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
      if (typeof globalThis.addEventListener === 'function') {
        globalThis.addEventListener('hashchange', handleHashChange);
      }
      if (presentationMode === 'auto' && typeof globalThis.matchMedia === 'function') {
        motionQuery = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
        motionListener = handleMotionChange;
        if (typeof motionQuery.addEventListener === 'function') {
          motionQuery.addEventListener('change', motionListener);
        }
      }
      mounted = true;
      const fragmentPracticeType = visiblePracticeTypeFromFragment();
      if (fragmentPracticeType) startPractice(fragmentPracticeType, { focusEpisode: true });
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
      if (typeof globalThis.removeEventListener === 'function') {
        globalThis.removeEventListener('hashchange', handleHashChange);
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
