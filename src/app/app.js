import { buildCuratedProblem } from '../content/generator.js';
import { resolveAuthoredContent, resolveCuratedFixture } from '../content/authored-content-catalog.js';
import { validateProblemInstance } from '../content/validation.js';
import { validateAuthoredTaskData } from '../content/authored-task-data.js';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
  getEpisodeDefinition,
} from '../interaction/index.js';
import { evaluateTaskPathClosure } from '../interaction/path-closure.js';
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
import { PRACTICE_TYPES } from './practice-types.js';
import {
  getDefaultSupportLevel,
  getRegisteredSupportLevel,
  REGISTERED_SUPPORT_LEVELS,
} from './support-levels.js';

const APP_RENDER_STRINGS = Object.freeze({
  ...STRINGS,
  resolve: Object.freeze({
    ...STRINGS.resolve,
    continueButton: STRINGS.resolve.continueReflectionButton,
  }),
});

function canonicalInstance(item, conditions = REGISTERED_CONDITIONS) {
  const fixture = resolveCuratedFixture(item?.fixtureId, item?.authoringRevision);
  if (!fixture) throw new Error(`practice fixture identity is unavailable: ${item?.fixtureId}@${item?.authoringRevision}`);
  const authoredContent = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
  if (!authoredContent) throw new Error(`practice task data identity is unavailable: ${item?.fixtureId}@${item?.authoringRevision}`);
  if (authoredContent.itemId && authoredContent.itemId !== item.id) {
    throw new Error(`practice item identity does not match its authored record: ${item.id}`);
  }
  const definition = getEpisodeDefinition(item.episodeDefinitionId, item.episodeDefinitionRevision);
  const instance = buildCuratedProblem({
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
  const contentCheck = validateProblemInstance(instance);
  if (!contentCheck.valid) throw new Error(`practice fixture failed content validation: ${item.fixtureId}`);
  validateAuthoredTaskData(instance, item.targetDenominators);
  for (const condition of conditions) {
    for (const denominator of item.targetDenominators) {
      const closure = evaluateTaskPathClosure({
        instance,
        targetDenominator: denominator,
        episodeDefinition: definition,
        activeCondition: condition.activeCondition,
      });
      if (!closure.available) {
        throw new Error(`practice path is unavailable: ${item.fixtureId}/${denominator}/${condition.id}`);
      }
    }
  }
  return instance;
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

function createInitialState(instance, practiceType, condition, supportLevel) {
  return createEpisode({
    instance,
    episodeDefinition: practiceType.episodeDefinition,
    activeCondition: condition.activeCondition,
    support: supportLevel.configuration,
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
  practiceTypes = PRACTICE_TYPES,
} = {}) {
  if (!root) throw new Error('app root element is required');

  let selectedCondition = getRegisteredCondition(initialConditionId);
  let selectedSupportLevel = getDefaultSupportLevel();
  let selectedPracticeType = null;
  let activePracticeItemIndex = null;
  let state = null;
  let currentScene = null;
  let visualView = true;
  let activityNotice = '';
  let decideHelpOpen = false;
  let transformHelpOpen = false;
  let commonDenominatorDraft = '';
  let transformDrafts = { left: { multiplier: '', numerator: '' }, right: { multiplier: '', numerator: '' } };
  let transformDraftScheduleEntryId = null;
  let preserveDecideInputFocusOnViewChange = false;
  let preserveTransformInputFocusOnViewChange = false;
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
  let helpCue;
  let isReplaying = false;
  let entryPage;
  let entryTitle;
  let nextProblemButton;
  let navigationNotice;
  let navigationRefusal = false;

  function practiceTypeFor(id) {
    return practiceTypes.find((practiceType) => practiceType.id === id) ?? null;
  }

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

    const supportHeading = makeElement('p', 'app-display-menu-label');
    supportHeading.textContent = 'Support level';
    displayMenu.appendChild(supportHeading);

    const supportList = makeElement('div', 'app-support-options');
    for (const supportLevel of REGISTERED_SUPPORT_LEVELS) {
      const option = makeElement('button', 'app-display-option');
      option.type = 'button';
      option.setAttribute('data-support-id', supportLevel.id);
      option.setAttribute('data-support-code', supportLevel.configuration.label);
      option.setAttribute('aria-pressed', String(supportLevel.id === selectedSupportLevel.id));

      const optionLabel = makeElement('span', 'app-display-option-label');
      optionLabel.textContent = supportLevel.label;
      option.appendChild(optionLabel);
      const optionDescription = makeElement('span', 'app-display-option-description');
      optionDescription.textContent = supportLevel.description;
      option.appendChild(optionDescription);

      option.addEventListener('click', () => {
        selectedSupportLevel = getRegisteredSupportLevel(supportLevel.id);
        closeDisplayMenu();
        updateSupportMetadata();
        displayMenuButton.focus();
      });
      supportList.appendChild(option);
    }
    displayMenu.appendChild(supportList);

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
    for (const practiceType of practiceTypes) {
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
    navigationNotice = makeElement('p', 'app-navigation-notice');
    navigationNotice.setAttribute('role', 'status');
    navigationNotice.tabIndex = -1;
    setHidden(navigationNotice, true);
    episodeNavigation.appendChild(navigationNotice);
    nextProblemButton = createButton({
      label: STRINGS.app.nextProblemButton,
      className: 'app-secondary-button',
      onClick: advanceToNextItem,
    });
    nextProblemButton.classList.add('app-next-button');
    setHidden(nextProblemButton, true);
    episodeNavigation.appendChild(nextProblemButton);
    episodeNavigation.appendChild(returnButton);

    const viewControls = makeElement('div', 'app-view-controls');
    viewToggle = createButton({
      label: STRINGS.app.readSteps,
      ariaLabel: STRINGS.app.readSteps,
      className: 'app-secondary-button',
      onClick: () => {
        captureDecideDraft();
        captureTransformDrafts();
        const preserveInputFocus = preserveDecideInputFocusOnViewChange
          || Boolean(getVisibleDecideInput()?.isConnected
            && getVisibleDecideInput() === document.activeElement);
        const preserveTransformInputFocus = preserveTransformInputFocusOnViewChange
          || Boolean(getVisibleTransformInput()?.isConnected
            && getVisibleTransformInput() === document.activeElement);
        preserveDecideInputFocusOnViewChange = false;
        preserveTransformInputFocusOnViewChange = false;
        visualView = !visualView;
        isReplaying = false;
        updateViewVisibility();
        restoreDecideDraft();
        restoreTransformDrafts();
        updateHelpPlacement();
        if (preserveInputFocus) getVisibleDecideInput()?.focus();
        if (preserveTransformInputFocus) getVisibleTransformInput()?.focus();
      },
    });
  viewToggle.addEventListener('pointerdown', () => {
    preserveDecideInputFocusOnViewChange = getVisibleDecideInput() === document.activeElement;
    preserveTransformInputFocusOnViewChange = getVisibleTransformInput() === document.activeElement;
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
      onClick: () => {
        captureDecideDraft();
        captureTransformDrafts();
        if (state?.beat === 'decide') {
          if (decideHelpOpen) {
            decideHelpOpen = false;
            updateHelpPlacement();
            helpButton.focus();
          } else {
            decideHelpOpen = true;
            dispatchAction({ type: 'request-task-help' });
            helpButton.focus();
          }
        } else if (state?.beat === 'transform') {
          transformHelpOpen = !transformHelpOpen;
          if (transformHelpOpen) {
            dispatchAction({ type: 'request-task-help' });
            const response = getVisibleTransformInput();
            if (response?.isConnected) response.focus();
          } else {
            render();
            helpButton.focus();
          }
        } else {
          dispatchAction({ type: 'request-help' });
        }
      },
    });
    replayButton = createButton({
      label: STRINGS.app.replayButton,
      className: 'app-secondary-button',
      onClick: () => dispatchAction({ type: 'request-replay' }),
    });
    const restartButton = createButton({
      label: STRINGS.app.restartButton,
      className: 'app-secondary-button',
      onClick: retryCurrentItem,
    });
    restartButton.classList.add('app-restart-button');
    supportControls.appendChild(helpButton);
    supportControls.appendChild(replayButton);
    supportControls.appendChild(restartButton);
    supportPanel.appendChild(supportControls);
    supportNotice = makeElement('p', 'app-support-notice sr-only');
    supportNotice.setAttribute('aria-live', 'polite');
    supportPanel.appendChild(supportNotice);
    helpCue = makeElement('p', 'active-denominator-help-cue');
    helpCue.setAttribute('id', 'fractionflow-decide-help-cue');
    helpCue.setAttribute('role', 'status');
    helpCue.setAttribute('aria-live', 'polite');
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
    return practiceTypeFor(id);
  }

  function setPracticeFragment(id) {
    if (typeof globalThis.location === 'object' && globalThis.location.hash !== `#${id}`) {
      globalThis.location.hash = id;
    }
  }

  function resetEpisodeUiState() {
    isReplaying = false;
    activityNotice = '';
    navigationRefusal = false;
    decideHelpOpen = false;
    transformHelpOpen = false;
    commonDenominatorDraft = '';
    transformDrafts = { left: { multiplier: '', numerator: '' }, right: { multiplier: '', numerator: '' } };
    transformDraftScheduleEntryId = null;
    preserveDecideInputFocusOnViewChange = false;
    preserveTransformInputFocusOnViewChange = false;
  }

  function registeredItemEpisode(practiceType, index) {
    const item = practiceType?.items?.[index];
    if (!item) throw new Error(`practice item ${index} is not registered`);
    if (item.episodeDefinitionId !== practiceType.episodeDefinition?.id
      || item.episodeDefinitionRevision !== practiceType.episodeDefinition?.revision) {
      throw new Error(`practice item definition identity is unsupported: ${item.id}`);
    }
    const instance = canonicalInstance(item);
    const nextState = createInitialState(instance, practiceType, selectedCondition, selectedSupportLevel);
    return { item, instance, state: nextState };
  }

  function installFreshEpisode(practiceType, itemIndex, candidateState, { focusEpisode, updateFragment = false } = {}) {
    selectedPracticeType = practiceType;
    activePracticeItemIndex = itemIndex;
    state = candidateState;
    resetEpisodeUiState();
    setHidden(entryPage, true);
    setHidden(appRoot.querySelector('.app-episode'), false);
    render();
    if (focusEpisode) focusEpisodeLandmark();
    if (updateFragment) setPracticeFragment(practiceType.id);
  }

  function focusEpisodeLandmark() {
    const episode = appRoot?.querySelector('.app-episode');
    if (episode?.isConnected && !episode.hasAttribute('hidden')) episode.focus();
  }

  function focusNavigationNotice() {
    if (navigationNotice?.isConnected && !navigationNotice.hasAttribute('hidden')) navigationNotice.focus();
  }

  function startPractice(practiceType, { focusEpisode = false, updateFragment = false } = {}) {
    if (!practiceType || !practiceTypes.includes(practiceType)) return;
    const injected = suppliedInstance !== null;
    const prepared = injected
      ? { state: createInitialState(suppliedInstance, practiceType, selectedCondition, selectedSupportLevel), itemIndex: null }
      : { ...registeredItemEpisode(practiceType, 0), itemIndex: 0 };
    installFreshEpisode(practiceType, prepared.itemIndex, prepared.state, { focusEpisode, updateFragment });
  }

  function retryCurrentItem() {
    if (!selectedPracticeType) return;
    let prepared;
    try {
      prepared = activePracticeItemIndex === null && suppliedInstance !== null
        ? createInitialState(suppliedInstance, selectedPracticeType, selectedCondition, selectedSupportLevel)
        : registeredItemEpisode(selectedPracticeType, activePracticeItemIndex ?? 0).state;
    } catch {
      navigationRefusal = true;
      navigationNotice.textContent = STRINGS.app.nextProblemUnavailable;
      setHidden(navigationNotice, false);
      render();
      focusNavigationNotice();
      return;
    }
    installFreshEpisode(selectedPracticeType, activePracticeItemIndex, prepared, { focusEpisode: true });
  }

  function advanceToNextItem() {
    if (state?.status !== 'resolved' || activePracticeItemIndex === null || !selectedPracticeType) return;
    const nextIndex = activePracticeItemIndex + 1;
    if (nextIndex >= selectedPracticeType.items.length) return;
    let prepared;
    try {
      prepared = registeredItemEpisode(selectedPracticeType, nextIndex);
    } catch {
      navigationRefusal = true;
      navigationNotice.textContent = STRINGS.app.nextProblemUnavailable;
      setHidden(navigationNotice, false);
      render();
      focusNavigationNotice();
      return;
    }
    installFreshEpisode(selectedPracticeType, nextIndex, prepared.state, { focusEpisode: true });
  }

  function returnToEntry() {
    if (selectedPracticeType && state) {
      try {
        const freshState = suppliedInstance !== null
          ? createInitialState(suppliedInstance, selectedPracticeType, selectedCondition, selectedSupportLevel)
          : registeredItemEpisode(selectedPracticeType, 0).state;
        state = freshState;
        activePracticeItemIndex = suppliedInstance === null ? 0 : null;
      } catch {
        // Keep the current known episode state available to Retry if the first
        // authored item can no longer be reconstructed.
      }
    }
    resetEpisodeUiState();
    navigationNotice.textContent = '';
    setHidden(navigationNotice, true);
    setHidden(nextProblemButton, true);
    updateHelpPlacement();
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
    for (const option of displayMenu.querySelectorAll('.app-display-options [data-condition-id]')) {
      option.setAttribute(
        'aria-pressed',
        String(option.getAttribute('data-condition-id') === selectedCondition.id),
      );
    }
  }

  function updateSupportMetadata() {
    appRoot.setAttribute('data-support-level', selectedSupportLevel.id);
    appRoot.setAttribute('data-support-code', selectedSupportLevel.configuration.label);
    for (const option of displayMenu.querySelectorAll('.app-support-options [data-support-id]')) {
      option.setAttribute(
        'aria-pressed',
        String(option.getAttribute('data-support-id') === selectedSupportLevel.id),
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

  function updateNavigation() {
    const canNavigate = state?.status === 'resolved'
      && activePracticeItemIndex !== null
      && selectedPracticeType?.items?.length > 0;
    const hasNext = canNavigate && activePracticeItemIndex < selectedPracticeType.items.length - 1;
    const isExhausted = canNavigate && !hasNext;
    setHidden(nextProblemButton, !hasNext);
    if (navigationRefusal) {
      navigationNotice.textContent = STRINGS.app.nextProblemUnavailable;
      setHidden(navigationNotice, false);
    } else if (isExhausted) {
      navigationNotice.textContent = STRINGS.app.problemsExhausted;
      setHidden(navigationNotice, false);
    } else {
      navigationNotice.textContent = '';
      setHidden(navigationNotice, true);
    }
  }

  function getVisibleDecideInput() {
    const host = visualView ? visualHost : linearHost;
    return host?.querySelector('input.control-numeric-input') || null;
  }

  function captureDecideDraft() {
    if (state?.beat !== 'decide') return;
    const input = getVisibleDecideInput();
    if (input) commonDenominatorDraft = input.value;
  }

  function restoreDecideDraft() {
    if (state?.beat !== 'decide') return;
    const input = getVisibleDecideInput();
    if (input) input.value = commonDenominatorDraft;
  }

  function captureTransformDrafts() {
    if (!state || state.beat !== 'transform') return;
    const host = visualView ? visualHost : linearHost;
    const side = currentScene?.meaning?.availableAction?.target ?? state.expectedResponse?.target;
    if (side !== 'left' && side !== 'right') return;
    const multiplier = host?.querySelector(`#${visualView ? 'transform' : 'linear-transform'}-help-multiplier-${side}`);
    const numerator = host?.querySelector(`#${visualView ? 'transform' : 'linear-transform'}-num-input-${side}`);
    if (multiplier) transformDrafts[side].multiplier = multiplier.value;
    if (numerator) transformDrafts[side].numerator = numerator.value;
  }

  function getVisibleTransformInput() {
    if (!state || state.beat !== 'transform') return null;
    const host = visualView ? visualHost : linearHost;
    const side = state.expectedResponse?.target;
    if (transformHelpOpen) {
      const taskHelp = currentScene?.meaning?.taskHelp;
      if (taskHelp?.status !== 'accepted') {
        return host?.querySelector(`#${visualView ? 'transform' : 'linear-transform'}-help-multiplier-${side}`) || null;
      }
    }
    return host?.querySelector(`#${visualView ? 'transform' : 'linear-transform'}-num-input-${side}`) || null;
  }

  function restoreTransformDrafts() {
    if (!state || state.beat !== 'transform') return;
    const side = state.expectedResponse?.target;
    const host = visualView ? visualHost : linearHost;
    const multiplier = host?.querySelector(`#${visualView ? 'transform' : 'linear-transform'}-help-multiplier-${side}`);
    const numerator = host?.querySelector(`#${visualView ? 'transform' : 'linear-transform'}-num-input-${side}`);
    if (multiplier) multiplier.value = transformDrafts[side].multiplier;
    if (numerator) numerator.value = transformDrafts[side].numerator;
  }

  function updateHelpPlacement(scene = currentScene) {
    if (!helpButton || !state) return;
    if (state.beat !== 'decide' && state.beat !== 'transform') {
      decideHelpOpen = false;
      transformHelpOpen = false;
      helpButton.textContent = STRINGS.app.helpButton;
      helpButton.setAttribute('aria-expanded', 'false');
      helpButton.removeAttribute('aria-controls');
      if (helpCue.parentNode) helpCue.parentNode.removeChild(helpCue);
      const supportControls = appRoot.querySelector('.app-support-controls');
      if (helpButton.parentNode !== supportControls) {
        if (helpButton.parentNode) helpButton.parentNode.removeChild(helpButton);
        supportControls.replaceChildren(
          helpButton,
          replayButton,
          appRoot.querySelector('.app-restart-button'),
        );
      }
      return;
    }
    const host = visualView ? visualHost : linearHost;
    const controls = host.querySelector('.active-beat-controls');
    if (!controls) {
      decideHelpOpen = false;
      helpButton.textContent = STRINGS.app.helpButton;
      helpButton.setAttribute('aria-expanded', 'false');
      helpButton.removeAttribute('aria-controls');
      helpCue.textContent = '';
      if (helpCue.parentNode) helpCue.parentNode.removeChild(helpCue);
      return;
    }
    if (helpButton.parentNode !== controls && helpButton.parentNode) {
      helpButton.parentNode.removeChild(helpButton);
    }
    controls.appendChild(helpButton);
    if (state.beat === 'transform') {
      helpButton.textContent = transformHelpOpen ? STRINGS.app.closeHelpButton : STRINGS.app.helpButton;
      helpButton.setAttribute('aria-expanded', String(transformHelpOpen));
      if (transformHelpOpen) helpButton.setAttribute('aria-controls', `${visualView ? 'visual' : 'linear'}-transform-task-help`);
      else helpButton.removeAttribute('aria-controls');
      return;
    }
    const sourceDenominators = scene?.meaning?.unitRelationship?.sourceDenominators;
    const cue = !sourceDenominators
      ? ''
      : STRINGS.decide.findingHelpCue(
        sourceDenominators.left,
        sourceDenominators.right,
      );
    if (!cue) decideHelpOpen = false;
    const isOpen = decideHelpOpen && Boolean(cue);
    helpButton.textContent = isOpen
      ? STRINGS.app.closeHelpButton
      : STRINGS.app.helpButton;
    if (isOpen) {
      if (helpCue.parentNode !== controls && helpCue.parentNode) helpCue.parentNode.removeChild(helpCue);
      helpButton.setAttribute('aria-controls', helpCue.getAttribute('id'));
      helpButton.setAttribute('aria-expanded', 'true');
      controls.appendChild(helpCue);
      helpCue.textContent = cue;
    }
    else {
      helpButton.setAttribute('aria-expanded', 'false');
      helpButton.removeAttribute('aria-controls');
      helpCue.textContent = '';
      if (helpCue.parentNode) helpCue.parentNode.removeChild(helpCue);
    }
  }

  function render() {
    if (!mounted || !state) return;
    captureDecideDraft();
    captureTransformDrafts();
    if (state.beat !== 'decide') {
      decideHelpOpen = false;
      commonDenominatorDraft = '';
    }
    const activeScheduleEntryId = state.beatSchedule?.[state.schedulePosition]?.id ?? null;
    if (state.beat === 'transform' && transformDraftScheduleEntryId !== null
      && activeScheduleEntryId !== transformDraftScheduleEntryId) {
      transformDrafts = { left: { multiplier: '', numerator: '' }, right: { multiplier: '', numerator: '' } };
      transformHelpOpen = false;
    }
    if (state.beat === 'transform') {
      transformDraftScheduleEntryId = activeScheduleEntryId;
    } else {
      transformDraftScheduleEntryId = null;
    }
    const mode = presentationModeFor({ override: presentationMode, motionQuery });
    const scene = resolveRenderableScene({
      state,
      initialRole: 'fraction-bar',
      presentationMode: mode,
      isReplaying,
    });
    currentScene = scene;

    if (!visualRenderer) {
      visualRenderer = createBeatContainer({
        container: visualHost,
        dispatchAction,
        strings: APP_RENDER_STRINGS,
        isTaskHelpOpen: () => transformHelpOpen,
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
        isTaskHelpOpen: () => transformHelpOpen,
      });
      linearRenderer.mount(scene);
    } else {
      linearRenderer.update(scene);
    }

    updateConditionMetadata();
    updateSupportMetadata();
    updateSupportControls();
    updateNavigation();
    updateViewVisibility();
    restoreDecideDraft();
    restoreTransformDrafts();
    updateHelpPlacement(scene);
  }

  function dispatchAction(action) {
    if (action.type === 'dismiss-replay') {
      isReplaying = false;
      activityNotice = '';
      render();
      return;
    }

    let focusExhaustion = false;
    try {
      captureDecideDraft();
      captureTransformDrafts();
      if (action.type === 'propose-common-denominator') commonDenominatorDraft = '';
      const wasResolved = state.status === 'resolved';
      state = applyIntent(state, action);
      if (action.type === 'request-help') {
        isReplaying = false;
        const help = state.helpHistory.at(-1);
        activityNotice = help.beat === 'decide'
          ? ''
          : STRINGS.app.helpLevels[help.level] || STRINGS.app.helpLevels.orient;
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
        const justResolved = !wasResolved && state.status === 'resolved';
        const isLastVettedItem = activePracticeItemIndex !== null
          && selectedPracticeType
          && activePracticeItemIndex === selectedPracticeType.items.length - 1;
        if (state.status === 'resolved' && activePracticeItemIndex !== null && isLastVettedItem) {
          activityNotice = '';
        } else if (state.status === 'resolved') {
          activityNotice = STRINGS.resolve.complete;
        } else {
          activityNotice = '';
        }
        navigationRefusal = false;
        focusExhaustion = justResolved && isLastVettedItem;
      }
      render();
      if (focusExhaustion) focusNavigationNotice();
      if (action.type === 'submit-transform-help-multiplier') getVisibleTransformInput()?.focus();
    } catch (error) {
      isReplaying = false;
      activityNotice = action.type === 'request-replay'
        ? STRINGS.app.noReplayYet
        : STRINGS.app.tryAgain;
      render();
      if (action.type === 'submit-transform-help-multiplier') getVisibleTransformInput()?.focus();
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
    getSelectedSupportLevel() {
      return selectedSupportLevel;
    },
    dispatch(action) {
      dispatchAction(action);
      return this;
    },
  };
}
