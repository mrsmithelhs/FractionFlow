import { resolvePlan82Context } from '../content/plan82-mixed-subtraction-task.js';
import { resolvePlan84Context } from '../content/plan84-mixed-improper-task.js';
import { PLAN84_ID, PLAN84_CONDITION } from '../interaction/plan84-mixed-improper-episode.js';
import { createPlan84Renderer } from '../render/plan84-mixed-improper.js';
import { PLAN82_CONDITION, PLAN82_ID } from '../interaction/plan82-mixed-subtraction-episode.js';
import { createPlan82Renderer } from '../render/plan82-mixed-subtraction.js';
import { resolvePlan78Context } from '../content/plan78-mixed-subtraction-task.js';
import { PLAN78_CONDITION, PLAN78_ID } from '../interaction/plan78-mixed-subtraction-episode.js';
import { createPlan78Renderer } from '../render/plan78-mixed-subtraction.js';
import { resolvePlan74Context } from '../content/plan74-mixed-addition-task.js';
import { PLAN74_CONDITION, PLAN74_ID } from '../interaction/plan74-mixed-addition-episode.js';
import { createPlan74Renderer } from '../render/plan74-mixed-addition.js';
import { resolvePlan72Context } from '../content/plan72-mixed-addition-task.js';
import { PLAN72_CONDITION, PLAN72_ID } from '../interaction/plan72-mixed-addition-episode.js';
import { createPlan72Renderer } from '../render/plan72-mixed-addition.js';
const isPlan72 = state => [PLAN72_ID, PLAN74_ID, PLAN78_ID, PLAN82_ID, PLAN84_ID].includes(state?.episodeDefinition?.id);
import { projectEntryCapabilities } from './entry-projection.js';
const DOCUMENT_ROTATION_DAY = Math.floor(Date.now() / 86_400_000);
import { createComparisonRecordController } from './comparison-record-controller.js';
import { createComparisonRecordPanel } from './comparison-record-panel.js';
import { MAGNITUDE_SESSION_MANIFEST, COMPARISON_SESSION_MANIFEST, admitMagnitudeManifest, createMagnitudeSessionController, prepareMagnitudeEntry, isMagnitudeEpisodeComplete, selectPracticeSession } from './magnitude-session.js';
import { resolvePlan59Context } from '../content/plan59-directed-endpoint-task.js';
import { PLAN59_CONDITION } from '../interaction/plan59-directed-endpoint-episode.js';
import { createPlan59Renderer } from '../render/plan59-directed-endpoint.js';
const isPlan59 = state => state?.episodeDefinition?.id === 'phase-4-directed-number-line-endpoint';
import { resolvePlan58Context } from '../content/plan58-whole-plus-fraction-task.js';
import { PLAN58_CONDITION } from '../interaction/plan58-whole-plus-fraction-episode.js';
import { createPlan58Renderer } from '../render/plan58-whole-plus-fraction.js';
const isPlan58 = state => state?.episodeDefinition?.id === 'phase-4-whole-plus-fraction-construction';
import { resolvePlan53Context } from '../content/plan53-two-whole-location-task.js';
import { PLAN53_CONDITION } from '../interaction/plan53-two-whole-location-episode.js';
import { createPlan53Renderer } from '../render/plan53-two-whole-location.js';
const isPlan53 = state => state?.episodeDefinition?.id === 'phase-4-two-whole-location';
import { resolvePlan51Context } from '../content/plan51-distance-task.js';
import { PLAN51_CONDITION, plan51IntentContext } from '../interaction/plan51-distance-episode.js';
import { renderPlan51Distance } from '../render/plan51-distance.js';
import { resolvePlan50Context } from '../content/plan50-number-line-collection-task.js';
import { PLAN50_CONDITION } from '../interaction/plan50-number-line-collection-episode.js';
import { createNumberLineCollectionRenderer } from '../render/number-line-collection.js';
const isCollection = state => state?.episodeDefinition?.id === 'phase-4-number-line-collection';
const isDistance = state => state?.episodeDefinition?.id === 'phase-4-fraction-distance';
import { resolvePlan49Context } from '../interaction/plan49-comparison-construction.js';
import { buildCuratedProblem } from '../content/generator.js';
import { resolveAuthoredContent, resolveCuratedFixture, resolvePlan37BarToLineBridgeInstance } from '../content/authored-content-catalog.js';
import { validateProblemInstance } from '../content/validation.js';
import { validateAuthoredTaskData } from '../content/authored-task-data.js';
import { resolvePlan34TaskContext, PLAN34_EPISODE_DEFINITION_ID } from '../content/full-addition-task-patterns.js';
import { resolvePlan18TaskContext, PLAN18_NESTED_DEFINITION_ID } from '../content/nested-renaming-task.js';
import { resolvePlan35AdditionRecipeContext } from '../content/plan35-addition-recipe-task.js';
import { PLAN35_RECIPE_DEFINITION_ID, PLAN35_RECIPE_IDS } from '../content/data/plan35-addition-recipe-records.js';
import {
  isPlan36SubtractionDefinition,
  resolvePlan36LikeDenominatorSubtractionContext,
} from '../content/plan36-like-denominator-takeaway-task.js';
import {
  isPlan40SubtractionRecipeDefinition,
  isPlan40IdentifyRecipe,
  resolvePlan40SubtractionRecipeContext,
} from '../content/plan40-reusable-subtraction-recipes.js';
import { evaluateInstanceEligibility } from '../content/eligibility.js';
import { isPlan37BarToLineBridgeTaskDefinition, resolvePlan37BarToLineBridgeContext } from '../content/plan37-bar-to-line-bridge-task.js';
import { PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION } from '../interaction/episode-definition.js';
import { isPlan45ComparisonDefinition, resolvePlan45ComparisonContext } from '../content/plan45-symbolic-fraction-comparison-task.js';
import { isPlan45ComparisonEpisode } from '../interaction/plan45-comparison-episode.js';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
  getEpisodeDefinition,
  PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
} from '../interaction/index.js';
import { evaluateTaskPathClosure } from '../interaction/path-closure.js';
import {
  createBeatContainer,
  createButton,
  createLinearPathRenderer,
  createNumberLineLocateRenderer,
  createPlan45ComparisonRenderer,
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

function canonicalInstance(item, conditions = REGISTERED_CONDITIONS, practiceType = null) {
  const definition = getEpisodeDefinition(item.episodeDefinitionId, item.episodeDefinitionRevision);
  if (isPlan45ComparisonDefinition(definition) || ['phase-4-number-line-collection', 'phase-4-fraction-distance', 'phase-4-two-whole-location', 'phase-4-whole-plus-fraction-construction', 'phase-4-directed-number-line-endpoint', PLAN72_ID, PLAN74_ID, PLAN78_ID, PLAN82_ID, PLAN84_ID].includes(definition.id)) return null;
  if (isPlan37BarToLineBridgeTaskDefinition(definition)) {
    const bridge = resolvePlan37BarToLineBridgeInstance(item.id, item.authoringRevision);
    if (!bridge || bridge.provenance.fixtureId !== item.fixtureId) throw new Error(`practice bridge item is not registered: ${item.id}`);
    return bridge;
  }
  const fixture = resolveCuratedFixture(item?.fixtureId, item?.authoringRevision);
  if (!fixture) throw new Error(`practice fixture identity is unavailable: ${item?.fixtureId}@${item?.authoringRevision}`);
  const authoredContent = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
  if (!authoredContent) throw new Error(`practice task data identity is unavailable: ${item?.fixtureId}@${item?.authoringRevision}`);
  if (authoredContent.itemId && authoredContent.itemId !== item.id
    && definition.id !== PLAN35_RECIPE_DEFINITION_ID
    && !isPlan40SubtractionRecipeDefinition(definition)) {
    throw new Error(`practice item identity does not match its authored record: ${item.id}`);
  }
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
  if (definition.id === PLAN35_RECIPE_DEFINITION_ID) {
    const taskContext = resolvePlan35AdditionRecipeContext(instance, item.id, {
      practiceSetId: practiceType?.setId,
      practiceSetRevision: practiceType?.setRevision,
    });
    if (taskContext.fixtureId !== item.fixtureId
      || taskContext.authoringRevision !== item.authoringRevision
      || taskContext.definitionId !== item.episodeDefinitionId
      || taskContext.definitionRevision !== item.episodeDefinitionRevision
      || taskContext.patternId !== item.patternId
      || taskContext.patternRevision !== item.patternRevision
      || taskContext.targetDenominator !== item.targetDenominator
      || taskContext.taskDataId !== item.taskDataId
      || taskContext.taskDataRevision !== item.taskDataRevision) {
      throw new Error('Plan 35 practice item does not match its exact registered recipe association');
    }
    return instance;
  }
  if (isPlan36SubtractionDefinition(definition)) {
    const taskContext = resolvePlan36LikeDenominatorSubtractionContext(instance, item.id, {
      practiceSetId: practiceType?.setId,
      practiceSetRevision: practiceType?.setRevision,
    });
    if (taskContext.fixtureId !== item.fixtureId
      || taskContext.authoringRevision !== item.authoringRevision
      || taskContext.definitionId !== item.episodeDefinitionId
      || taskContext.definitionRevision !== item.episodeDefinitionRevision
      || taskContext.recipeId !== item.recipe?.id
      || taskContext.recipeRevision !== item.recipe?.revision
      || taskContext.taskDataId !== item.taskData?.id
      || taskContext.taskDataRevision !== item.taskData?.revision) {
      throw new Error('Plan 36 practice item does not match its exact registered subtraction association');
    }
    return instance;
  }
  if (isPlan40SubtractionRecipeDefinition(definition)) {
    const taskContext = resolvePlan40SubtractionRecipeContext(instance, item.id, {
      practiceSetId: practiceType?.setId,
      practiceSetRevision: practiceType?.setRevision,
    });
    if (taskContext.fixtureId !== item.fixtureId
      || taskContext.authoringRevision !== item.authoringRevision
      || taskContext.definitionId !== item.episodeDefinitionId
      || taskContext.definitionRevision !== item.episodeDefinitionRevision
      || taskContext.patternId !== item.patternId
      || taskContext.patternRevision !== item.patternRevision
      || taskContext.targetDenominator !== item.targetDenominator
      || taskContext.taskDataId !== item.taskDataId
      || taskContext.taskDataRevision !== item.taskDataRevision) {
      throw new Error('Plan 40 practice item does not match its exact registered recipe association');
    }
    return instance;
  }
  if (definition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id
    && definition.revision === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.revision) {
    const contract = definition.contentContract;
    const sameForm = (actual, expected) => actual?.kind === expected?.kind
      && actual?.numerator === expected?.numerator
      && actual?.denominator === expected?.denominator;
    if (item.id !== contract.itemId
      || item.fixtureId !== contract.fixtureId
      || item.authoringRevision !== contract.authoringRevision
      || item.taskDataRevision !== contract.taskDataRevision
      || item.recipe?.id !== contract.recipe.id
      || item.recipe?.revision !== contract.recipe.revision
      || authoredContent.taskDataRevision !== contract.taskDataRevision
      || authoredContent.recipe?.id !== contract.recipe.id
      || authoredContent.recipe?.revision !== contract.recipe.revision
      || instance.request.selector !== contract.selector
      || instance.request.operation !== contract.operation
      || JSON.stringify(instance.request.overlays) !== JSON.stringify(contract.overlays)
      || !sameForm(instance.operands.left.initialForm, contract.left)
      || !sameForm(instance.operands.right.initialForm, contract.right)
      || instance.classification.denominator.relationship !== 'same'
      || instance.classification.transformations.canonicalRenaming.left !== false
      || instance.classification.transformations.canonicalRenaming.right !== false
      || definition.includeReflection !== false) {
      throw new Error('Plan 20 item does not match its exact registered content contract');
    }
    const eligibility = evaluateInstanceEligibility(instance);
    if (eligibility.eligibility.fractionBar !== 'eligible'
      || eligibility.paths.canonical.targetDenominator !== '7'
      || eligibility.paths.canonical.rendering !== 'eligible') {
      throw new Error('Plan 20 original shared unit is outside the reviewed fraction-bar capability');
    }
    return instance;
  }
  if (definition.id === PLAN34_EPISODE_DEFINITION_ID) {
    const taskContext = resolvePlan34TaskContext(instance, item.patternId, item.patternRevision, item.targetDenominator, { practiceSetRevision: practiceType?.setRevision ?? '5' });
    if (taskContext.itemId !== item.id
      || taskContext.practiceSetId !== practiceType?.setId
      || taskContext.practiceSetRevision !== practiceType?.setRevision) {
      throw new Error('Plan 34 practice item does not match its selected-set task association');
    }
    return instance;
  }
  if (definition.id === PLAN18_NESTED_DEFINITION_ID) {
    const taskContext = resolvePlan18TaskContext(instance, { practiceSetId: practiceType?.setId, practiceSetRevision: practiceType?.setRevision });
    if (taskContext.itemId !== item.id
      || taskContext.fixtureId !== item.fixtureId
      || taskContext.authoringRevision !== item.authoringRevision
      || taskContext.taskDataId !== item.taskDataId
      || taskContext.taskDataRevision !== item.taskDataRevision
      || taskContext.targetDenominator !== item.targetDenominator) throw new Error('Plan 18 practice item does not match its exact set@6 association');
    return instance;
  }
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

function isVisibleControlInHost(control, host) {
  if (!control?.isConnected || !host || host.hidden) return false;
  let node = control;
  while (node && node !== host) {
    if (node.hidden) return false;
    node = node.parentNode;
  }
  return node === host;
}

function presentationModeFor({ override, motionQuery }) {
  if (override === 'standard-motion' || override === 'reduced-motion' || override === 'instant-test') {
    return override;
  }
  return motionQuery?.matches ? 'reduced-motion' : 'standard-motion';
}

function createInitialState(instance, practiceType, condition, supportLevel, episodeDefinition = practiceType.episodeDefinition, item = null) {
  const taskContext = episodeDefinition.id === PLAN84_ID && item ? resolvePlan84Context(item.id)
    : episodeDefinition.id === PLAN82_ID && item ? resolvePlan82Context(item.id, {setId:practiceType.setId,setRevision:practiceType.setRevision})
    : episodeDefinition.id === PLAN78_ID && item ? resolvePlan78Context(item.id, {setId:practiceType.setId,setRevision:practiceType.setRevision})
    : episodeDefinition.id === PLAN74_ID && item ? resolvePlan74Context(item.id, {setId:practiceType.setId,setRevision:practiceType.setRevision})
    : episodeDefinition.id === PLAN72_ID && item ? resolvePlan72Context(item.id)
    : episodeDefinition.id === 'phase-4-directed-number-line-endpoint' && item ? resolvePlan59Context(item.id)
    : episodeDefinition.id === 'phase-4-whole-plus-fraction-construction' && item ? resolvePlan58Context(item.id)
    : episodeDefinition.id === 'phase-4-two-whole-location' && item ? resolvePlan53Context(item.id)
    : episodeDefinition.id === 'phase-4-fraction-distance' && item ? resolvePlan51Context(item.id)
    : episodeDefinition.id === 'phase-4-number-line-collection' && item ? resolvePlan50Context(item.id)
    : isPlan45ComparisonDefinition(episodeDefinition) && item
    ? episodeDefinition.revision === '2' ? resolvePlan49Context(item.id) : resolvePlan45ComparisonContext(item.id, {
      practiceSetId: practiceType.setId,
      practiceSetRevision: practiceType.setRevision,
    })
    : isPlan37BarToLineBridgeTaskDefinition(episodeDefinition) && item
    ? resolvePlan37BarToLineBridgeContext(instance, item.id, {
      practiceSetId: practiceType.setId,
      practiceSetRevision: practiceType.setRevision,
      definitionRevision: episodeDefinition.revision,
      supportMode: supportLevel.configuration.dimensions.fractionBarModel === 'high support' ? 'partitioned' : 'sparse-benchmarks',
    })
    : isPlan40SubtractionRecipeDefinition(episodeDefinition) && item
    ? resolvePlan40SubtractionRecipeContext(instance, item.id, {
      practiceSetId: practiceType.setId,
      practiceSetRevision: practiceType.setRevision,
    })
    : isPlan36SubtractionDefinition(episodeDefinition) && item
    ? resolvePlan36LikeDenominatorSubtractionContext(instance, item.id, {
      practiceSetId: practiceType.setId,
      practiceSetRevision: practiceType.setRevision,
    })
    : episodeDefinition?.id === PLAN35_RECIPE_DEFINITION_ID && item
    ? resolvePlan35AdditionRecipeContext(instance, item.id, {
      practiceSetId: practiceType.setId,
      practiceSetRevision: practiceType.setRevision,
    })
    : item?.patternId
    ? resolvePlan34TaskContext(instance, item.patternId, item.patternRevision, item.targetDenominator, { practiceSetRevision: practiceType.setRevision })
    : item?.episodeDefinitionId === PLAN18_NESTED_DEFINITION_ID
      ? resolvePlan18TaskContext(instance, { practiceSetId: practiceType.setId, practiceSetRevision: practiceType.setRevision })
      : null;
  if (taskContext && !['phase-4-number-line-collection', 'phase-4-fraction-distance', 'phase-4-two-whole-location', 'phase-4-whole-plus-fraction-construction', 'phase-4-directed-number-line-endpoint', PLAN72_ID, PLAN74_ID, PLAN78_ID, PLAN82_ID, PLAN84_ID].includes(episodeDefinition.id) && (taskContext.itemId !== item.id
    || taskContext.practiceSetId !== practiceType.setId
    || taskContext.practiceSetRevision !== practiceType.setRevision)) {
    throw new Error('practice item does not match its validated task association');
  }
  return createEpisode({
    instance,
    episodeDefinition,
    activeCondition: episodeDefinition.id === PLAN84_ID ? PLAN84_CONDITION : episodeDefinition.id === PLAN82_ID ? PLAN82_CONDITION : episodeDefinition.id === PLAN78_ID ? PLAN78_CONDITION : episodeDefinition.id === PLAN74_ID ? PLAN74_CONDITION : episodeDefinition.id === PLAN72_ID ? PLAN72_CONDITION : episodeDefinition.id === 'phase-4-directed-number-line-endpoint' ? PLAN59_CONDITION : episodeDefinition.id === 'phase-4-whole-plus-fraction-construction' ? PLAN58_CONDITION : episodeDefinition.id === 'phase-4-two-whole-location' ? PLAN53_CONDITION : episodeDefinition.id === 'phase-4-fraction-distance' ? PLAN51_CONDITION : episodeDefinition.id === 'phase-4-number-line-collection' ? PLAN50_CONDITION : isPlan45ComparisonDefinition(episodeDefinition)
      ? PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION
      : condition.activeCondition,
    support: supportLevel.configuration,
    taskContext,
  });
}

export function getCompletionIntentFor(state) {
  if (!state || state.status === 'resolved') return null;
  const def = state.episodeDefinition;
  if (!def) return null;
  if (isPlan36SubtractionDefinition(def)
    || isPlan40SubtractionRecipeDefinition(def)
    || isPlan37BarToLineBridgeTaskDefinition(def)
    || def.id === 'phase-3-like-denominator-takeaway-subtraction'
    || def.id === 'phase-3-reusable-subtraction-recipes'
    || def.id === 'phase-4-bar-to-line-same-amount'
    || def.id === PLAN34_EPISODE_DEFINITION_ID
    || def.id === PLAN35_RECIPE_DEFINITION_ID) {
    return { type: 'finish-compact-episode' };
  }
  if (def.id === PLAN18_NESTED_DEFINITION_ID) {
    return { type: 'finish-nested-episode' };
  }
  const proposed = state.established?.operation?.proposed;
  return proposed ? { type: 'submit-resolution', proposed } : null;
}

export function prepareProgressionTransaction({
  currentState,
  practiceType,
  activeIndex,
  actionKind,
  prepareDestination = null,
}) {
  if (!currentState || !currentState.episodeDefinition) {
    return { ok: false, reason: 'missing-state' };
  }

  let completedOldState;
  if (currentState.status === 'resolved') {
    completedOldState = currentState;
  } else {
    const completionIntent = getCompletionIntentFor(currentState);
    if (!completionIntent) {
      return { ok: false, reason: 'unsupported-completion-intent' };
    }
    completedOldState = applyIntent(currentState, completionIntent);
    if (completedOldState.status !== 'resolved') {
      return { ok: false, reason: 'completion-did-not-resolve' };
    }
  }

  if (actionKind === 'return') {
    return {
      ok: true,
      actionKind: 'return',
      completedOldState,
    };
  }

  if (actionKind === 'advance') {
    if (!practiceType || !Array.isArray(practiceType.items) || typeof activeIndex !== 'number') {
      return { ok: false, reason: 'invalid-practice-context', completedOldState };
    }
    const nextIndex = activeIndex + 1;
    if (nextIndex >= practiceType.items.length) {
      return { ok: false, reason: 'set-exhausted', completedOldState };
    }

    let destination;
    try {
      if (typeof prepareDestination !== 'function') {
        return { ok: false, reason: 'missing-destination-preparer', completedOldState };
      }
      destination = prepareDestination(practiceType, nextIndex);
    } catch (err) {
      return { ok: false, reason: 'destination-refusal', error: err, completedOldState };
    }

    if (!destination || !destination.state) {
      return { ok: false, reason: 'destination-missing-state', completedOldState };
    }

    return {
      ok: true,
      actionKind: 'advance',
      completedOldState,
      nextIndex,
      destinationState: destination.state,
    };
  }

  return { ok: false, reason: 'unknown-action-kind' };
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
  navigationMode = 'direct',
  entryMode = 'compact',
  sessionTestHooks = {},
  entryTestHooks = {},
} = {}) {
  if (!root) throw new Error('app root element is required');
  if (!['compact', 'historical-flat'].includes(entryMode)) throw new TypeError('unknown entry mode');
  const rotationDay = entryTestHooks.rotationDay ?? DOCUMENT_ROTATION_DAY;

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
  let subtractionHelpOpen = false;
  let inspectChangeOpen = false;
  let commonDenominatorDraft = '';
  let transformDrafts = { left: { multiplier: '', numerator: '' }, right: { multiplier: '', numerator: '' } };
  let operationDrafts = null;
  let transformDraftScheduleEntryId = null;
  let preserveDecideInputFocusOnViewChange = false;
  let preserveTransformInputFocusOnViewChange = false;
  let preserveOperationInputFocusOnViewChange = false;
  let comparisonFocusKeyOnViewChange = null;
  let plan82FocusOnViewChange = null;
  let mounted = false;
  let visualRenderer = null;
  let linearRenderer = null;
  let visualNumberLineRenderer = null;
  let linearNumberLineRenderer = null;
  let numberLineDraft = null;
  let numberLineHelpOpen = false;
  let collectionHelpOpen = false;
  let plan59HelpOpen = false;
  let visualPlan59Renderer = null;
  let linearPlan59Renderer = null;
  let plan72HelpOpen = false;
  let visualPlan72Renderer = null;
  let linearPlan72Renderer = null;
  let plan58HelpOpen = false;
  let visualPlan58Renderer = null;
  let linearPlan58Renderer = null;
  let plan53HelpOpen = false;
  let visualPlan53Renderer = null;
  let linearPlan53Renderer = null;
  let comparisonDraft = '';
  let comparisonConstructionDrafts = {};
  let comparisonHelpOpen = false;
  let distanceDraft = { relation: '', numerator: '', denominator: '' };
  let distanceHelpOpen = false;
  let distanceRefusal = '';
  let distanceFocus = null;
  let distanceRenderGeneration = 0;
  let visualCollectionRenderer = null;
  let linearCollectionRenderer = null;
  let visualComparisonRenderer = null;
  let linearComparisonRenderer = null;
  let comparisonResponseHandle = null;
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
  let chooserButton, chooserRegion;
  let nextProblemButton;
  let navigationNotice;
  let returnButton;
  let navigationRefusal = false;
  let currentEpisodeGeneration = 0;
  let isTransitioning = false;
  let shellLifetime = 0;
  let entryRendererLifetime = 0;
  let magnitudeSession = null;
  let recordController = null, recordPanel = null, recordEpisodeNotice = null;
  let sessionDialog, sessionStay, sessionLeave, sessionEntryNotice, sessionEntryButton;
  let exitFocus = null, pendingHashDestination = null;

  function syncSessionEpisode(previous, next) {
    if (magnitudeSession && !magnitudeSession.updateEpisode(previous, next)) throw new Error('stale session episode');
    return next;
  }
  function sessionPreflight(candidate) {
    resolveRenderableScene({ state: candidate.state, initialRole: 'fraction-bar',
      presentationMode: presentationModeFor({ override: presentationMode, motionQuery }), isReplaying: false });
    sessionTestHooks.prepare?.(candidate);
    return candidate;
  }
  function clearFragment() {
    if (typeof globalThis.location === 'object' && typeof globalThis.history?.replaceState === 'function')
      globalThis.history.replaceState(null, '', `${globalThis.location.pathname}${globalThis.location.search}`);
  }
  function sessionDisplayFailure() {
    recordController?.retire();
    if (magnitudeSession) magnitudeSession.exit(magnitudeSession.current().session);
    magnitudeSession = null; currentEpisodeGeneration += 1; distanceRenderGeneration += 1;
    state = null; selectedPracticeType = null; activePracticeItemIndex = null;
    visualComparisonRenderer = null; linearComparisonRenderer = null;
    visualHost.replaceChildren(); linearHost.replaceChildren();
    setHidden(appRoot.querySelector('.app-episode'), true); setHidden(entryPage, false);
    updateSupportMetadata(); clearFragment(); closeDisplayMenu();
    sessionEntryNotice.textContent = 'This practice could not be displayed. Please try again or choose another practice.';
    setHidden(sessionEntryNotice, false); sessionEntryNotice.focus();
  }
  function installSessionCurrent({ propagateFailure = false } = {}) {
    const current = magnitudeSession.current();
    try {
      sessionTestHooks.display?.(current);
      installFreshEpisode(current.installed.type, current.installed.itemIndex, current.episode, { focusEpisode: true });
      sessionTestHooks.afterDisplay?.(current);
    } catch (error) { if (propagateFailure) throw error; sessionDisplayFailure(); }
  }
  function startMagnitudeSession(manifest = MAGNITUDE_SESSION_MANIFEST, { quiet = false, preflightAll = false } = {}) {
    try {
      if (preflightAll) admitMagnitudeManifest(manifest, selectedSupportLevel.id).prepared.forEach(sessionPreflight);
      const controller = createMagnitudeSessionController(manifest, selectedSupportLevel.id,
        { prepare: (entry, support) => sessionPreflight(prepareMagnitudeEntry(entry, support)),
          eligibleForNext: sessionTestHooks.eligibleForNext, fitRevision: sessionTestHooks.fitRevision });
      sessionPreflight(controller.current().installed);
      magnitudeSession = controller; clearFragment(); setHidden(sessionEntryNotice, true);
      installSessionCurrent();
      return true;
    } catch {
      if (quiet) return false;
      sessionEntryNotice.textContent = 'This practice could not be opened. Please try again or choose another practice.';
      setHidden(sessionEntryNotice, false); sessionEntryNotice.focus();
      return false;
    }
  }
  function startScheduledSession() {
    // Explicit injected review policy; ordinary entry retains its existing behavior.
    if (sessionTestHooks.selectManifest) {
      try {
        const input = sessionTestHooks.selectionInput?.() ?? Math.floor(Math.random() * 0x100000000);
        const candidate = sessionTestHooks.selectManifest(input);
        if (candidate && startMagnitudeSession(candidate, { quiet: true, preflightAll: true })) return;
      } catch { /* Refuse instead of falling back to unverified items. */ }
      sessionEntryNotice.textContent = sessionTestHooks.unavailableNotice ?? 'This practice could not be opened. Please try again or choose another practice.';
      setHidden(sessionEntryNotice, false); sessionEntryNotice.focus(); return;
    }
    let manifest;
    try {
      const input = sessionTestHooks.selectionInput?.() ?? Math.floor(Math.random() * 0x100000000);
      manifest = selectPracticeSession(input);
    } catch { /* Try the fixed fallback below. */ }
    if (manifest && startMagnitudeSession(manifest, { quiet: true, preflightAll: true })) return;
    startMagnitudeSession(COMPARISON_SESSION_MANIFEST, { preflightAll: true });
  }
  function sessionTransition(kind, generation) {
    if (!magnitudeSession || isTransitioning || (generation !== undefined && generation !== currentEpisodeGeneration)) return;
    const { session, episode } = magnitudeSession.current();
    if (episode !== state) return;
    isTransitioning = true;
    try {
      const prepared = magnitudeSession.prepareTransition(kind, session, episode);
      if (!prepared.ok && prepared.reason === 'fit-exhausted') {
        leaveMagnitudeSession();
        sessionEntryNotice.textContent = 'Practice is complete for now. The remaining problems do not fit this screen.';
        setHidden(sessionEntryNotice, false); sessionEntryNotice.focus(); return;
      }
      if (!prepared.ok || !magnitudeSession.commit(prepared.ticket)) {
        navigationRefusal = true;
        navigationNotice.textContent = kind === 'restart' ? STRINGS.app.sessionRestartUnavailable : STRINGS.app.sessionNextUnavailable;
        setHidden(navigationNotice, false); focusNavigationNotice(); return;
      }
      if (magnitudeSession.current().manifest.id !== 'plan90-comparison-distance-review') {
        installSessionCurrent();
        return;
      }
      // Review path only: keep the active episode and its task-local drafts
      // until the new mount succeeds. Ordinary Start is not wired to this path.
      const prior = { state, selectedPracticeType, activePracticeItemIndex, comparisonDraft,
        comparisonConstructionDrafts, comparisonHelpOpen, distanceDraft, distanceHelpOpen,
        distanceRefusal, distanceFocus, activityNotice, isReplaying };
      try { installSessionCurrent({ propagateFailure: true }); }
      catch {
        if (!magnitudeSession.rollback(prepared.ticket)) throw new Error('session rollback failed');
        ({ state, selectedPracticeType, activePracticeItemIndex, comparisonDraft,
          comparisonConstructionDrafts, comparisonHelpOpen, distanceDraft, distanceHelpOpen,
          distanceRefusal, distanceFocus, activityNotice, isReplaying } = prior);
        currentEpisodeGeneration += 1;
        navigationRefusal = true;
        navigationNotice.textContent = kind === 'restart' ? STRINGS.app.sessionRestartUnavailable : STRINGS.app.sessionNextUnavailable;
        render(); setHidden(navigationNotice, false); focusNavigationNotice();
      }
    } finally { isTransitioning = false; }
  }
  function leaveMagnitudeSession(destination = null) {
    if (!magnitudeSession) return;
    magnitudeSession.exit(magnitudeSession.current().session); magnitudeSession = null;
    setHidden(sessionDialog, true); pendingHashDestination = null; entryPage.inert = false; appRoot.querySelector('.app-episode').inert = false;
    returnToEntry(); updateSupportMetadata();
    if (destination) startPractice(destination, { focusEpisode: true, updateFragment: true });
  }
  function askSessionExit(destination = null) {
    if (!magnitudeSession) returnToEntry();
    else if (isMagnitudeEpisodeComplete(state, magnitudeSession.current().manifest.entries[magnitudeSession.current().session.index])) leaveMagnitudeSession(destination);
    else {
      pendingHashDestination = destination;
      if (sessionDialog.hasAttribute('hidden')) exitFocus = document.activeElement;
      entryPage.inert = true; appRoot.querySelector('.app-episode').inert = true;
      setHidden(sessionDialog, false); sessionStay.focus();
    }
  }
  function stayInSession() {
    setHidden(sessionDialog, true); pendingHashDestination = null; entryPage.inert = false; appRoot.querySelector('.app-episode').inert = false;
    if (exitFocus?.isConnected) exitFocus.focus(); else focusEpisodeLandmark();
  }

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

    const conditionApplicability = makeElement('p', 'app-display-option-description');
    conditionApplicability.id = 'fractionflow-condition-applicability';
    conditionApplicability.textContent = 'Choose how display conditions apply to other practice goals.';
    displayMenu.appendChild(conditionApplicability);

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
      option.setAttribute('aria-describedby', 'fractionflow-condition-applicability');

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
        if (magnitudeSession) return;
        selectedSupportLevel = getRegisteredSupportLevel(supportLevel.id);
        closeDisplayMenu();
        updateSupportMetadata();
        displayMenuButton.focus();
      });
      supportList.appendChild(option);
    }
    displayMenu.appendChild(supportList);
    const supportApplicability = makeElement('p', 'app-display-option-description');
    supportApplicability.id = 'fractionflow-support-applicability';
    displayMenu.appendChild(supportApplicability);

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

  function setChooserOpen(open) {
    if (!chooserRegion || !chooserButton) return;
    if (!open && chooserRegion.contains(document.activeElement)) chooserButton.focus();
    setHidden(chooserRegion, !open);
    chooserButton.setAttribute('aria-expanded', String(open));
  }

  function createShell() {
    const shellGeneration = ++shellLifetime;
    const shellActive = () => mounted && shellGeneration === shellLifetime;
    appRoot = makeElement('div', 'fractionflow-app');

    entryPage = makeElement('main', 'app-entry-page');
    entryPage.setAttribute('aria-labelledby', 'fractionflow-title');
    const entryHeader = makeElement('header', 'app-entry-header');
    entryTitle = makeElement('h1', 'app-entry-title');
    entryTitle.id = 'fractionflow-title';
    entryTitle.tabIndex = -1;
    const titleFirst = makeElement('span'); titleFirst.textContent = STRINGS.app.title.slice(0, 8);
    const titleSecond = makeElement('span'); titleSecond.textContent = STRINGS.app.title.slice(8);
    entryTitle.appendChild(titleFirst); entryTitle.appendChild(makeElement('wbr')); entryTitle.appendChild(titleSecond);
    entryHeader.appendChild(entryTitle);
    const entryLine = makeElement('p', 'app-entry-line');
    entryLine.textContent = entryMode === 'historical-flat'
      ? 'See how different-sized fraction parts fit together.'
      : 'Explore fractions with pictures and numbers.';
    entryHeader.appendChild(entryLine);
    entryPage.appendChild(entryHeader);

    chooserButton = chooserRegion = null;
    if (entryMode === 'historical-flat') {
      const practiceList = makeElement('div', 'app-practice-list');
      const followingPracticeButtons = [];
      for (const practiceType of practiceTypes) {
        const practiceButton = createButton({
          label: practiceType.label,
          className: practiceType.id === 'sum-under-one'
            ? 'app-practice-button'
            : 'app-practice-choice',
          onClick: () => startPractice(practiceType, { focusEpisode: true, updateFragment: true }),
        });
        if (practiceType.id === 'sum-under-one') practiceButton.classList.add('app-practice-choice');
        practiceButton.setAttribute('data-practice-type', practiceType.id);
        if (practiceType.id === 'sum-under-one') practiceList.appendChild(practiceButton);
        else followingPracticeButtons.push(practiceButton);
      }
      entryPage.appendChild(practiceList);
      // Preserve the first-tab practice button, then put the reviewer gear next
      // in keyboard order before exposing the additional practice goal.
      entryPage.appendChild(createDisplayMenu());
      if (followingPracticeButtons.length > 0) {
        const followingPracticeList = makeElement('div', 'app-practice-list');
        for (const button of followingPracticeButtons) followingPracticeList.appendChild(button);
        entryPage.appendChild(followingPracticeList);
      }
      sessionEntryButton = createButton({ label: 'Compare fractions, then find a distance', className: 'app-practice-choice', onClick: () => { if (shellActive()) startMagnitudeSession(); } });
      sessionEntryButton.setAttribute('data-session-entry', 'magnitude');
      sessionEntryButton.setAttribute('aria-describedby', 'fractionflow-session-cue');
      const sessionEntryList = makeElement('div', 'app-practice-list');
      sessionEntryList.appendChild(sessionEntryButton);
      entryPage.appendChild(sessionEntryList);
      const sessionCue = makeElement('p', 'app-session-cue'); sessionCue.id = 'fractionflow-session-cue'; sessionCue.textContent = 'Your place in this practice is not saved.'; entryPage.appendChild(sessionCue);
      sessionEntryNotice = makeElement('p', 'app-session-entry-notice'); sessionEntryNotice.setAttribute('role', 'status'); sessionEntryNotice.tabIndex = -1; setHidden(sessionEntryNotice, true); entryPage.appendChild(sessionEntryNotice);
      recordPanel = createComparisonRecordPanel({ host: entryPage, controller: recordController, practice: () => { const type = practiceTypes.find(t => t.id === 'symbolic-fraction-comparison'); if (type) startPractice(type, { focusEpisode: true, updateFragment: true }); } });
    } else {
      const projection = projectEntryCapabilities(practiceTypes, MAGNITUDE_SESSION_MANIFEST, rotationDay);
      const makePracticeButton = (type, role) => {
        const button = createButton({ label: type.label,
          className: 'app-practice-choice',
          onClick: () => { if (shellActive()) launchEntryPractice(type, { focusEpisode: true, updateFragment: true }); },
        });
        if (role === 'primary') button.classList.add('app-practice-button');
        button.setAttribute('data-practice-type', type.id);
        button.setAttribute('data-entry-role', role);
        return button;
      };
      if (projection.primary) {
        const featuredLabel = makeElement('p', 'app-featured-label');
        featuredLabel.textContent = 'Featured today';
        entryPage.appendChild(featuredLabel);
        entryPage.appendChild(makePracticeButton(projection.primary.type, 'primary'));
      }

      {
        const button = createButton({ label: 'Start a practice session', className: 'app-practice-choice', onClick: () => { if (shellActive()) startScheduledSession(); } });
        button.classList.add('app-session-start');
        button.setAttribute('data-session-entry', 'comparison');
        entryPage.appendChild(button);
      }

      chooserButton = createButton({ label: 'Choose what to practice', className: 'app-chooser-button', onClick: () => { if (shellActive()) setChooserOpen(chooserRegion.hasAttribute('hidden')); } });
      chooserButton.setAttribute('data-entry-chooser', '');
      chooserButton.setAttribute('aria-controls', 'fractionflow-chooser');
      chooserButton.setAttribute('aria-expanded', 'false');
      entryPage.appendChild(chooserButton);
      chooserRegion = makeElement('section', 'app-chooser-region');
      chooserRegion.id = 'fractionflow-chooser';
      chooserRegion.setAttribute('aria-label', 'Practice choices');
      setHidden(chooserRegion, true);
      for (const group of projection.groups) {
        const section = makeElement('section', 'app-chooser-group');
        const heading = makeElement('h2'); heading.textContent = group.label; section.appendChild(heading);
        const list = makeElement('div', 'app-practice-list');
        for (const capability of group.entries) {
          if (capability.kind === 'practice') list.appendChild(makePracticeButton(capability.type, 'browse'));
          else {
            sessionEntryButton = createButton({ label: 'Compare fractions, then find a distance', className: 'app-practice-choice', onClick: () => { if (shellActive()) startMagnitudeSession(); } });
            sessionEntryButton.setAttribute('data-session-entry', 'magnitude');
            sessionEntryButton.setAttribute('aria-describedby', 'fractionflow-session-cue');
            list.appendChild(sessionEntryButton);
            const cue = makeElement('p', 'app-session-cue'); cue.id = 'fractionflow-session-cue'; cue.textContent = 'Your place in this practice is not saved.'; list.appendChild(cue);
          }
        }
        section.appendChild(list); chooserRegion.appendChild(section);
      }
      entryPage.appendChild(chooserRegion);
      if (projection.errors.length) {
        const diagnostic = makeElement('p', 'app-entry-unavailable'); diagnostic.textContent = 'Some practice choices are unavailable.'; entryPage.appendChild(diagnostic);
        console.error('Invalid entry capability projection:', projection.errors);
      }
      entryPage.appendChild(createDisplayMenu());
      sessionEntryNotice = makeElement('p', 'app-session-entry-notice'); sessionEntryNotice.setAttribute('role', 'status'); sessionEntryNotice.tabIndex = -1; setHidden(sessionEntryNotice, true); entryPage.appendChild(sessionEntryNotice);
      recordPanel = createComparisonRecordPanel({ host: entryPage, controller: recordController, practice: () => { const type = practiceTypes.find(t => t.id === 'symbolic-fraction-comparison'); if (type) launchEntryPractice(type, { focusEpisode: true, updateFragment: true }); } });
    }
    const aboutLink = makeElement('a', 'app-about-link');
    aboutLink.setAttribute('href', './about.html');
    aboutLink.textContent = 'About FractionFlow';
    entryPage.appendChild(aboutLink);
    const creatorCredit = makeElement('small', 'app-creator-credit');
    creatorCredit.textContent = 'created with agentic support by Orion Smith, East Lansing HS';
    entryPage.appendChild(creatorCredit);
    appRoot.appendChild(entryPage);

    const episode = makeElement('main', 'app-episode');
    episode.setAttribute('aria-label', 'Fraction practice');
    episode.tabIndex = -1;
    setHidden(episode, true);
    const episodeNavigation = makeElement('nav', 'app-episode-navigation');
    episodeNavigation.setAttribute('aria-label', 'Episode navigation');
    returnButton = createButton({
      label: STRINGS.app.returnButton,
      className: 'app-secondary-button',
      onClick: () => { if (shellActive()) { if (magnitudeSession) askSessionExit(); else returnToEntry(); } },
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

    recordEpisodeNotice = makeElement('p', 'comparison-record-episode-notice'); recordEpisodeNotice.setAttribute('role', 'status'); episodeNavigation.appendChild(recordEpisodeNotice);
    const viewControls = makeElement('div', 'app-view-controls');
    viewToggle = createButton({
      label: STRINGS.app.readSteps,
      ariaLabel: STRINGS.app.readSteps,
      className: 'app-secondary-button',
      onClick: () => {
        captureDecideDraft();
        captureTransformDrafts();
        captureOperationDraft();
        captureComparisonDraft();
        const preserveInputFocus = preserveDecideInputFocusOnViewChange
          || Boolean(getVisibleDecideInput()?.isConnected
            && getVisibleDecideInput() === document.activeElement);
        const preserveTransformInputFocus = preserveTransformInputFocusOnViewChange
          || Boolean(getVisibleTransformInput()?.isConnected
            && getVisibleTransformInput() === document.activeElement);
        const preserveOperationInputFocus = preserveOperationInputFocusOnViewChange
          || Boolean(getVisibleOperationInput()?.isConnected
            && getVisibleOperationInput() === document.activeElement);
        const preserveTakeawayFocus = isPlan36SubtractionDefinition(state?.episodeDefinition)
          && state?.beat === 'encounter'
          && (document.activeElement?.classList?.contains('control-action-btn')
            || document.activeElement?.textContent === 'Take away');
        const comparisonFocusKey = comparisonFocusKeyOnViewChange;
        const plan82Focus = plan82FocusOnViewChange;
        plan82FocusOnViewChange = null;
        preserveDecideInputFocusOnViewChange = false;
        preserveTransformInputFocusOnViewChange = false;
        preserveOperationInputFocusOnViewChange = false;
        comparisonFocusKeyOnViewChange = null;
        saveNumberLineDraft();
        captureComparisonDraft();
        if (isCollection(state)) {visualCollectionRenderer?.cancelGesture();linearCollectionRenderer?.cancelGesture();}
        if (isPlan53(state)) {visualPlan53Renderer?.cancelGesture();linearPlan53Renderer?.cancelGesture();}
        if (isPlan59(state)) {visualPlan59Renderer?.cancelGesture();linearPlan59Renderer?.cancelGesture();}
        if (isPlan72(state) && !(visualView ? visualPlan72Renderer : linearPlan72Renderer)?.flushComposition()) return;
        if (isPlan58(state) && !(visualView ? visualPlan58Renderer : linearPlan58Renderer)?.flushComposition()) return;
        visualView = !visualView;
        isReplaying = false;
        if (isPlan45ComparisonEpisode(state) || isCollection(state) || isDistance(state) || isPlan53(state) || isPlan58(state) || isPlan59(state) || isPlan72(state)) render();
        updateViewVisibility();
        (visualView ? visualNumberLineRenderer : linearNumberLineRenderer)?.refreshGeometry();
        restoreDecideDraft();
        restoreTransformDrafts();
        restoreOperationDraft();
        restoreNumberLineDraft();
        updateHelpPlacement();
        if (preserveInputFocus) getVisibleDecideInput()?.focus();
        if (preserveTransformInputFocus) getVisibleTransformInput()?.focus();
        if (preserveOperationInputFocus) focusOperationInput();
        if (preserveTakeawayFocus) {
          const host = visualView ? visualHost : linearHost;
          host?.querySelector('.active-beat-controls button')?.focus();
        }
        if (isPlan45ComparisonEpisode(state) && comparisonFocusKey) {
          const host = visualView ? visualHost : linearHost;
          const matching = [...(host?.querySelectorAll('[data-plan45-focus-key]') ?? [])]
            .find((element) => element.getAttribute('data-plan45-focus-key') === comparisonFocusKey);
          if (matching?.isConnected) matching.focus();
          else comparisonResponseHandle?.focusPrimary();
        }
        if (state?.episodeDefinition?.id === PLAN82_ID && plan82Focus) {
          const host = visualView ? visualHost : linearHost;
          const input = host?.querySelectorAll('.plan82-subtraction input')[plan82Focus.index];
          if (input) { input.focus(); input.setSelectionRange(plan82Focus.start, plan82Focus.end); }
        }
        if (isDistance(state) && distanceFocus) {
          const host = visualView ? visualHost : linearHost;
          host?.querySelector(`[data-plan51-focus="${distanceFocus}"]`)?.focus();
        }
      },
    });
  viewToggle.addEventListener('pointerdown', () => {
    plan82FocusOnViewChange = null;
    if (state?.episodeDefinition?.id === PLAN82_ID) {
      const host = visualView ? visualHost : linearHost;
      const inputs = [...(host?.querySelectorAll('.plan82-subtraction input') ?? [])];
      const index = inputs.indexOf(document.activeElement);
      if (index >= 0) plan82FocusOnViewChange = { index, start: document.activeElement.selectionStart, end: document.activeElement.selectionEnd };
    }
    preserveDecideInputFocusOnViewChange = getVisibleDecideInput() === document.activeElement;
    preserveTransformInputFocusOnViewChange = getVisibleTransformInput() === document.activeElement;
    preserveOperationInputFocusOnViewChange = getVisibleOperationInput() === document.activeElement;
    comparisonFocusKeyOnViewChange = document.activeElement?.closest?.('.plan45-comparison')
      ? document.activeElement.dataset?.plan45FocusKey ?? null
      : null;
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
        captureOperationDraft();
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
        } else if (isPlan37BarToLineBridgeTaskDefinition(state?.episodeDefinition) && state?.beat === 'locate') {
          numberLineHelpOpen = !numberLineHelpOpen;
          if (numberLineHelpOpen && !state.established.help.locate) {
            dispatchAction({ type: 'request-task-help' });
          } else {
            render();
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
        } else if (state?.episodeDefinition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id
          && state.beat === 'operate') {
          if (activityNotice === STRINGS.operate.likeAdditionHelp) {
            activityNotice = '';
            render();
            helpButton.focus();
          } else {
            dispatchAction({ type: 'request-task-help' });
          }
        } else if ((isPlan36SubtractionDefinition(state?.episodeDefinition) || isPlan40SubtractionRecipeDefinition(state?.episodeDefinition)) && state.beat === 'operate') {
          subtractionHelpOpen = !subtractionHelpOpen;
          if (subtractionHelpOpen) {
            dispatchAction({ type: 'request-task-help' });
            helpButton.focus();
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
    replayButton.classList.add('app-replay-button');
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

    sessionDialog = makeElement('div', 'app-session-dialog'); sessionDialog.setAttribute('role', 'dialog'); sessionDialog.setAttribute('aria-modal', 'true'); sessionDialog.setAttribute('aria-labelledby', 'session-exit-title');
    const dialogPanel = makeElement('div', 'app-session-dialog-panel');
    const dialogTitle = makeElement('p'); dialogTitle.id = 'session-exit-title'; dialogTitle.textContent = 'Leave this practice? Your place will not be saved.'; dialogPanel.appendChild(dialogTitle);
    sessionStay = createButton({ label: 'Stay', className: 'app-secondary-button', onClick: () => { if (shellActive()) stayInSession(); } });
    sessionLeave = createButton({ label: 'Leave', className: 'app-secondary-button', onClick: () => { if (shellActive()) leaveMagnitudeSession(pendingHashDestination); } });
    dialogPanel.appendChild(sessionStay); dialogPanel.appendChild(sessionLeave); sessionDialog.appendChild(dialogPanel); setHidden(sessionDialog, true);
    sessionDialog.addEventListener('keydown', event => {
      if (!shellActive()) return;
      if (event.key === 'Escape') { event.preventDefault(); stayInSession(); }
      else if (event.key === 'Tab') { event.preventDefault(); (document.activeElement === sessionStay ? sessionLeave : sessionStay).focus(); }
    });
    appRoot.appendChild(sessionDialog);
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
    subtractionHelpOpen = false;
    commonDenominatorDraft = '';
    transformDrafts = {
      left: { multiplier: '', numerator: state?.taskContext?.candidates?.left?.numerator ?? '' },
      right: { multiplier: '', numerator: state?.taskContext?.candidates?.right?.numerator ?? '' },
    };
    operationDrafts = null;
    inspectChangeOpen = false;
    transformDraftScheduleEntryId = null;
    preserveDecideInputFocusOnViewChange = false;
    preserveTransformInputFocusOnViewChange = false;
    preserveOperationInputFocusOnViewChange = false;
    numberLineDraft = null;
    numberLineHelpOpen = false;
    collectionHelpOpen = false;
    plan59HelpOpen = false;
    plan72HelpOpen = false;
    plan58HelpOpen = false;
    plan53HelpOpen = false;
    comparisonDraft = '';
    comparisonConstructionDrafts = {};
    comparisonHelpOpen = false;
    distanceDraft = { relation: '', numerator: '', denominator: '' };
    distanceHelpOpen = false;
    distanceRefusal = '';
    distanceFocus = null;
    comparisonResponseHandle = null;
    visualNumberLineRenderer?.clearPreview();
    linearNumberLineRenderer?.clearPreview();
  }

  function setNumberLineDraft(handle) {
    numberLineDraft = handle ? { contextKey: handle.contextKey, candidateId: handle.candidateId } : null;
  }

  function saveNumberLineDraft() {
    const renderer = visualView ? visualNumberLineRenderer : linearNumberLineRenderer;
    if (!renderer) return;
    const handle = renderer.readPreview();
    if (handle) setNumberLineDraft(handle);
  }

  function restoreNumberLineDraft() {
    const renderer = visualView ? visualNumberLineRenderer : linearNumberLineRenderer;
    if (!renderer || !numberLineDraft) return;
    if (!renderer.writePreview(numberLineDraft)) numberLineDraft = null;
  }

  function registeredItemEpisode(practiceType, index) {
    const item = practiceType?.items?.[index];
    if (!item) throw new Error(`practice item ${index} is not registered`);
    const definition = getEpisodeDefinition(item.episodeDefinitionId, item.episodeDefinitionRevision);
    const instance = canonicalInstance(item, REGISTERED_CONDITIONS, practiceType);
    const nextState = createInitialState(instance, practiceType, selectedCondition, selectedSupportLevel, definition, item);
    return { item, instance, state: nextState };
  }

  function installFreshEpisode(practiceType, itemIndex, candidateState, { focusEpisode, updateFragment = false, entryLaunch = false } = {}) {
    visualPlan59Renderer?.destroy(); linearPlan59Renderer?.destroy();
    visualPlan59Renderer = null; linearPlan59Renderer = null;
    visualPlan72Renderer?.destroy(); linearPlan72Renderer?.destroy();
    visualPlan72Renderer = null; linearPlan72Renderer = null;
    visualPlan58Renderer?.destroy(); linearPlan58Renderer?.destroy();
    visualPlan58Renderer = null; linearPlan58Renderer = null;
    visualPlan53Renderer?.destroy(); linearPlan53Renderer?.destroy();
    visualPlan53Renderer = null; linearPlan53Renderer = null;
    visualCollectionRenderer?.destroy();
    linearCollectionRenderer?.destroy();
    visualCollectionRenderer=null; linearCollectionRenderer=null;
    currentEpisodeGeneration += 1;
    selectedPracticeType = practiceType;
    activePracticeItemIndex = itemIndex;
    state = candidateState;
    const remembering = recordController?.install(state, magnitudeSession);
    if (recordEpisodeNotice) recordEpisodeNotice.textContent = isPlan45ComparisonEpisode(state) && recordController?.snapshot().enabled && !remembering ? 'A new problem is needed before activity can be remembered.' : '';
    resetEpisodeUiState();
    const episodeEl = appRoot.querySelector('.app-episode');
    const currentItem = practiceType?.items?.[itemIndex];
    if (episodeEl && currentItem) {
      episodeEl.setAttribute('data-current-item-id', currentItem.id);
    } else if (episodeEl) {
      episodeEl.removeAttribute('data-current-item-id');
    }
    setHidden(entryPage, true);
    setHidden(episodeEl, false);
    render();
    if (entryLaunch) entryTestHooks.display?.(practiceType);
    if (focusEpisode) {
      if (isPlan36SubtractionDefinition(state?.episodeDefinition) && state?.beat === 'encounter') {
        const host = visualView ? visualHost : linearHost;
        const takeAwayBtn = host?.querySelector('.active-beat-controls button');
        if (takeAwayBtn) takeAwayBtn.focus();
        else focusEpisodeLandmark();
      } else {
        focusEpisodeLandmark();
      }
    }
    if (updateFragment) setPracticeFragment(practiceType.id);
  }

  function focusEpisodeLandmark() {
    const episode = appRoot?.querySelector('.app-episode');
    if (episode?.isConnected && !episode.hasAttribute('hidden')) episode.focus();
  }

  function focusNavigationNotice() {
    if (navigationNotice?.isConnected && !navigationNotice.hasAttribute('hidden')) navigationNotice.focus();
  }

  function launchEntryPractice(practiceType, options = {}) {
    if (!practiceType || !practiceTypes.includes(practiceType)) return;
    let prepared;
    try {
      entryTestHooks.prepare?.(practiceType);
      prepared = suppliedInstance !== null
        ? { state: createInitialState(suppliedInstance, practiceType, selectedCondition, selectedSupportLevel), itemIndex: null }
        : { ...registeredItemEpisode(practiceType, 0), itemIndex: 0 };
    } catch {
      sessionEntryNotice.textContent = 'This practice could not be opened. Please try again or choose another practice.';
      setHidden(sessionEntryNotice, false); sessionEntryNotice.focus(); return;
    }
    try {
      setHidden(sessionEntryNotice, true);
      installFreshEpisode(practiceType, prepared.itemIndex, prepared.state, { ...options, entryLaunch: true });
    } catch {
      recoverEntryDisplayFailure();
    }
  }

  function recoverEntryDisplayFailure() {
    recordController?.retire(); currentEpisodeGeneration += 1; distanceRenderGeneration += 1; entryRendererLifetime += 1;
    for (const renderer of [visualRenderer, linearRenderer, visualNumberLineRenderer, linearNumberLineRenderer,
      visualComparisonRenderer, linearComparisonRenderer, visualCollectionRenderer, linearCollectionRenderer,
      visualPlan72Renderer, linearPlan72Renderer, visualPlan53Renderer, linearPlan53Renderer, visualPlan58Renderer, linearPlan58Renderer, visualPlan59Renderer, linearPlan59Renderer]) {
      try { renderer?.destroy(); } catch (error) { console.error('Entry renderer cleanup failed:', error); }
    }
    visualRenderer = linearRenderer = visualNumberLineRenderer = linearNumberLineRenderer = null;
    visualComparisonRenderer = linearComparisonRenderer = visualCollectionRenderer = linearCollectionRenderer = null;
    visualPlan72Renderer = linearPlan72Renderer = null;
    visualPlan53Renderer = linearPlan53Renderer = visualPlan58Renderer = linearPlan58Renderer = visualPlan59Renderer = linearPlan59Renderer = null;
    state = selectedPracticeType = activePracticeItemIndex = null;
    visualHost.replaceChildren(); linearHost.replaceChildren();
    setHidden(appRoot.querySelector('.app-episode'), true); setHidden(entryPage, false);
    clearFragment(); closeDisplayMenu(); updateSupportMetadata();
    sessionEntryNotice.textContent = 'This practice could not be displayed. Please try again or choose another practice.';
    setHidden(sessionEntryNotice, false); sessionEntryNotice.focus();
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
    if (magnitudeSession) { sessionTransition('restart', currentEpisodeGeneration); return; }
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

  function computeProgressionDescriptor() {
    if (magnitudeSession) {
      const { session, manifest } = magnitudeSession.current();
      if (!isMagnitudeEpisodeComplete(state, manifest.entries[session.index])) return { phase: 'idle', actionKind: 'none', label: null, notice: null, onAction: null };
      const generation = currentEpisodeGeneration, final = session.index === manifest.entries.length - 1;
      return { phase: 'resolved-comparison', actionKind: final ? 'return' : 'advance',
        label: final ? STRINGS.app.returnButton : manifest.id === MAGNITUDE_SESSION_MANIFEST.id && session.index === 2 ? 'Next: compare and find the distance' : STRINGS.app.nextProblemButton,
        notice: final ? 'Practice complete.' : null,
        onAction: () => { if (generation !== currentEpisodeGeneration) return; if (final) leaveMagnitudeSession(); else sessionTransition('next', generation); } };
    }
    const comparisonEpisode = isPlan45ComparisonEpisode(state) || isCollection(state) || isDistance(state) || isPlan53(state) || isPlan58(state) || isPlan59(state) || isPlan72(state);
    if ((navigationMode !== 'direct' && !comparisonEpisode) || !state || !selectedPracticeType || activePracticeItemIndex === null) {
      return {
        phase: 'idle',
        actionKind: 'none',
        label: null,
        notice: null,
        onAction: null,
      };
    }

    const capturedGeneration = currentEpisodeGeneration;

    if (comparisonEpisode && state.status === 'resolved' && (state.established?.comparison || state.established?.collection || state.established?.location || state.established?.grouping || state.established?.endpoint || state.established?.difference || (state.episodeDefinition.id === PLAN84_ID && state.established?.choice !== null && state.established?.choice !== undefined))) {
      const hasNext = activePracticeItemIndex < selectedPracticeType.items.length - 1;
      return {
        phase: 'resolved-comparison',
        actionKind: hasNext ? 'advance' : 'return',
        label: hasNext ? STRINGS.app.nextProblemButton : STRINGS.app.returnButton,
        notice: hasNext ? null : STRINGS.app.problemsExhausted,
        onAction: () => hasNext
          ? advanceToNextItem(capturedGeneration)
          : returnFromCompletedSet(capturedGeneration),
      };
    }

    // Phase 2: continue-milestone (in resolve, but reflect is scheduled next)
    const nextEntry = state.beatSchedule?.[state.schedulePosition + 1];
    if (state.status === 'active' && state.beat === 'resolve' && nextEntry?.kind === 'reflect') {
      return {
        phase: 'continue-milestone',
        actionKind: 'continue',
        label: STRINGS.resolve.continueReflectionButton || 'Continue',
        notice: null,
        onAction: () => handleContinueMilestone(capturedGeneration),
      };
    }

    // Phase 3: terminal-accepted (in resolve, final task completed and accepted)
    const isTerminalResolve = state.status === 'active'
      && state.beat === 'resolve'
      && state.schedulePosition === state.beatSchedule.length - 1
      && Boolean(state.established?.operation || state.established?.numberLineLocation);

    if (isTerminalResolve) {
      const hasNext = activePracticeItemIndex < selectedPracticeType.items.length - 1;
      if (hasNext) {
        return {
          phase: 'terminal-accepted',
          actionKind: 'advance',
          label: STRINGS.app.nextProblemButton,
          notice: null,
          onAction: () => advanceToNextItem(capturedGeneration),
        };
      }
      return {
        phase: 'terminal-accepted',
        actionKind: 'return',
        label: STRINGS.app.returnButton,
        notice: STRINGS.app.problemsExhausted,
        onAction: () => returnFromCompletedSet(capturedGeneration),
      };
    }

    // Phase 4: resolved-reflection (reflection accepted, awaiting progression)
    const isResolvedReflection = state.status === 'resolved'
      && state.beat === 'reflect'
      && Boolean(state.established?.reflection);

    if (isResolvedReflection) {
      const hasNext = activePracticeItemIndex < selectedPracticeType.items.length - 1;
      if (hasNext) {
        return {
          phase: 'resolved-reflection',
          actionKind: 'advance',
          label: STRINGS.app.nextProblemButton,
          notice: null,
          onAction: () => advanceToNextItem(capturedGeneration),
        };
      }
      return {
        phase: 'resolved-reflection',
        actionKind: 'return',
        label: STRINGS.app.returnButton,
        notice: STRINGS.app.problemsExhausted,
        onAction: () => returnFromCompletedSet(capturedGeneration),
      };
    }

    return {
      phase: 'idle',
      actionKind: 'none',
      label: null,
      notice: null,
      onAction: null,
    };
  }

  function handleContinueMilestone(capturedGeneration) {
    if (isTransitioning) return;
    if (capturedGeneration !== undefined && capturedGeneration !== currentEpisodeGeneration) return;
    const nextEntry = state?.beatSchedule?.[state.schedulePosition + 1];
    if (state?.status !== 'active' || state?.beat !== 'resolve' || nextEntry?.kind !== 'reflect') {
      return;
    }
    const proposed = state?.established?.operation?.proposed;
    if (!proposed) return;

    isTransitioning = true;
    try {
      dispatchAction({ type: 'submit-resolution', proposed });
    } finally {
      isTransitioning = false;
    }
  }

  function advanceToNextItem(capturedGeneration) {
    if (navigationMode === 'legacy-acknowledged' && !isPlan45ComparisonEpisode(state) && !isCollection(state) && !isDistance(state) && !isPlan53(state) && !isPlan58(state) && !isPlan59(state) && !isPlan72(state)) {
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
      return;
    }

    // Direct progression mode
    if (isTransitioning) return;
    if (capturedGeneration !== undefined && capturedGeneration !== currentEpisodeGeneration) return;
    const desc = computeProgressionDescriptor();
    if (desc.phase !== 'terminal-accepted' && desc.phase !== 'resolved-reflection' && desc.phase !== 'resolved-comparison') return;
    if (desc.actionKind !== 'advance') return;

    isTransitioning = true;
    try {
      const transaction = prepareProgressionTransaction({
        currentState: state,
        practiceType: selectedPracticeType,
        activeIndex: activePracticeItemIndex,
        actionKind: 'advance',
        prepareDestination: registeredItemEpisode,
      });

      if (!transaction.ok) {
        navigationRefusal = true;
        navigationNotice.textContent = STRINGS.app.nextProblemUnavailable;
        setHidden(navigationNotice, false);
        render();
        focusNavigationNotice();
        return;
      }

      installFreshEpisode(selectedPracticeType, transaction.nextIndex, transaction.destinationState, { focusEpisode: true });
    } finally {
      isTransitioning = false;
    }
  }

  function returnFromCompletedSet(capturedGeneration) {
    if (isTransitioning) return;
    if (capturedGeneration !== undefined && capturedGeneration !== currentEpisodeGeneration) return;
    const desc = computeProgressionDescriptor();
    if (desc.phase !== 'terminal-accepted' && desc.phase !== 'resolved-reflection' && desc.phase !== 'resolved-comparison') return;
    if (desc.actionKind !== 'return') return;

    isTransitioning = true;
    try {
      const transaction = prepareProgressionTransaction({
        currentState: state,
        practiceType: selectedPracticeType,
        activeIndex: activePracticeItemIndex,
        actionKind: 'return',
      });
      if (!transaction.ok) return;

      returnToEntry();
    } finally {
      isTransitioning = false;
    }
  }

  function returnToEntry() {
    recordController?.retire();
    visualPlan59Renderer?.destroy(); linearPlan59Renderer?.destroy();
    visualPlan59Renderer = null; linearPlan59Renderer = null;
    visualCollectionRenderer?.destroy(); linearCollectionRenderer?.destroy();
    visualCollectionRenderer=null; linearCollectionRenderer=null;
    currentEpisodeGeneration += 1;
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
    supportNotice.textContent = '';
    helpCue.textContent = '';
    navigationNotice.textContent = '';
    setHidden(navigationNotice, true);
    setHidden(nextProblemButton, true);
    updateHelpPlacement();
    closeDisplayMenu();
    const episodeEl = appRoot.querySelector('.app-episode');
    if (episodeEl) {
      episodeEl.removeAttribute('data-current-item-id');
      setHidden(episodeEl, true);
    }
    setHidden(entryPage, false);
    setChooserOpen(false);
    if (typeof globalThis.location === 'object'
      && globalThis.location.hash
      && typeof globalThis.history?.replaceState === 'function') {
      globalThis.history.replaceState(null, '', `${globalThis.location.pathname}${globalThis.location.search}`);
    }
    if (entryTitle?.isConnected && !entryPage.hasAttribute('hidden')) entryTitle.focus();
  }

  function handleHashChange() {
    const practiceType = visiblePracticeTypeFromFragment();
    if (magnitudeSession) { clearFragment(); askSessionExit(practiceType); return; }
    const episode = appRoot?.querySelector('.app-episode');
    if (practiceType) {
      if (selectedPracticeType?.id !== practiceType.id || episode?.hasAttribute('hidden')) {
        if (episode?.hasAttribute('hidden')) launchEntryPractice(practiceType, { focusEpisode: true });
        else startPractice(practiceType, { focusEpisode: true });
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
    const applied = (isPlan45ComparisonEpisode(state) || isCollection(state) || isDistance(state) || isPlan53(state) || isPlan58(state) || isPlan59(state) || isPlan72(state)) ? state.activeCondition : selectedCondition.activeCondition;
    const applicability = displayMenu.querySelector('#fractionflow-condition-applicability');
    if (applicability) {
      applicability.textContent = isDistance(state) ? 'This distance task uses a fixed display; these selections apply to other practice goals.' : isCollection(state) ? 'This collection uses a fixed display; these selections apply to other practice goals.' : isPlan45ComparisonEpisode(state)
        ? 'Compare fractions uses a fixed display; these selections apply to other practice goals.'
        : 'Choose how display conditions apply to other practice goals.';
    }
    appRoot.setAttribute('data-condition-id', applied.id);
    appRoot.setAttribute('data-display-code', applied.display);
    appRoot.setAttribute('data-choreography-code', applied.choreography);
    appRoot.setAttribute('data-prompt-cadence-code', applied.promptCadence);
    appRoot.setAttribute('data-connection-code', applied.connectionMaking);
    for (const option of displayMenu.querySelectorAll('.app-display-options [data-condition-id]')) {
      option.setAttribute(
        'aria-pressed',
        String(option.getAttribute('data-condition-id') === selectedCondition.id),
      );
    }
  }

  function updateSupportMetadata() {
    const applicability = displayMenu.querySelector('#fractionflow-support-applicability');
    if (applicability) applicability.textContent = isPlan72(state) && state.episodeDefinition.id !== PLAN84_ID ? 'This activity offers the same aids with either setting. Help is available.' : '';
    appRoot.setAttribute('data-support-level', selectedSupportLevel.id);
    appRoot.setAttribute('data-support-code', isCollection(state) ? state.support.label : selectedSupportLevel.configuration.label);
    for (const option of displayMenu.querySelectorAll('.app-support-options [data-support-id]')) {
      option.setAttribute(
        'aria-pressed',
        String(option.getAttribute('data-support-id') === selectedSupportLevel.id),
      );
      option.disabled = Boolean(magnitudeSession);
    }
  }

  function updateSupportControls() {
    const resolved = state.status === 'resolved';
    const isPlan20 = state.episodeDefinition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id;
    const isPlan39Bridge = isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition);
    const isPlan34 = state.episodeDefinition.id === PLAN34_EPISODE_DEFINITION_ID;
    const isPlan18 = state.episodeDefinition.id === PLAN18_NESTED_DEFINITION_ID;
    const isPlan35Identify = state.episodeDefinition.id === PLAN35_RECIPE_DEFINITION_ID
      && state.taskContext?.patternId === PLAN35_RECIPE_IDS.identify;
    const isPlan36 = isPlan36SubtractionDefinition(state.episodeDefinition);
    const isPlan40 = isPlan40SubtractionRecipeDefinition(state.episodeDefinition);
    const isPlan45 = isPlan45ComparisonEpisode(state) || isCollection(state) || isDistance(state) || isPlan53(state) || isPlan58(state) || isPlan59(state) || isPlan72(state);
    const isPlan40Identify = isPlan40 && isPlan40IdentifyRecipe(state.taskContext);
    helpButton.disabled = resolved;
    helpButton.hidden = isPlan45;
    const hasConversion = Boolean(state.established?.lastConversion);
    const isPlan40NonIdentify = isPlan40 && !isPlan40Identify;
    const isPlan40IdentifySuppressed = isPlan40Identify && (!hasConversion || ['operate', 'resolve'].includes(state.beat));
    replayButton.hidden = isPlan20 || isPlan34 || isPlan36 || isPlan39Bridge || isPlan45 || isPlan40NonIdentify || isPlan40IdentifySuppressed
      || ((isPlan18 || isPlan35Identify) && !hasConversion)
      || (state.episodeDefinition.id === PLAN35_RECIPE_DEFINITION_ID && !isPlan35Identify);
    replayButton.disabled = isPlan20 || isPlan34 || isPlan36 || isPlan39Bridge || isPlan45 || resolved || state.beat === 'encounter'
      || isPlan40NonIdentify || isPlan40IdentifySuppressed
      || ((isPlan18 || isPlan35Identify) && !hasConversion)
      || (state.episodeDefinition.id === PLAN35_RECIPE_DEFINITION_ID && !isPlan35Identify);
    replayButton.setAttribute('aria-pressed', String(isReplaying));
    supportNotice.textContent = activityNotice;
  }

  function updateNavigation() {
    const currentSession = magnitudeSession?.current();
    const finalSessionResult = currentSession && currentSession.session.index === currentSession.manifest.entries.length - 1 && isMagnitudeEpisodeComplete(state, currentSession.manifest.entries.at(-1));
    returnButton.textContent = STRINGS.app.returnButton;
    setHidden(returnButton, Boolean(finalSessionResult));
    if (magnitudeSession && navigationRefusal) {
      setHidden(nextProblemButton, true);
      setHidden(navigationNotice, false);
      return;
    }
    if (isPlan45ComparisonEpisode(state)) {
      setHidden(nextProblemButton, true);
      if (magnitudeSession && navigationRefusal) { setHidden(navigationNotice, false); return; }
      navigationNotice.textContent = '';
      setHidden(navigationNotice, true);
      return;
    }
    if (navigationMode === 'direct') {
      setHidden(nextProblemButton, true);
      if (navigationRefusal) {
        navigationNotice.textContent = STRINGS.app.nextProblemUnavailable;
        setHidden(navigationNotice, false);
      } else {
        navigationNotice.textContent = '';
        setHidden(navigationNotice, true);
      }
      return;
    }
    const singlePlan20Item = selectedPracticeType?.id === 'like-denominator-addition'
      && selectedPracticeType.items.length === 1;
    const canNavigate = state?.status === 'resolved'
      && activePracticeItemIndex !== null
      && selectedPracticeType?.items?.length > 0
      && !singlePlan20Item;
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
      if (taskHelp?.kind === 'inspect-comparison-invariant') {
        return host?.querySelector(`#${visualView ? 'transform' : 'linear-transform'}-num-input-${side}`)
          || host?.querySelector('.inspect-change-button') || null;
      }
      if (taskHelp?.status !== 'accepted') {
        return host?.querySelector(`#${visualView ? 'transform' : 'linear-transform'}-help-multiplier-${side}`) || null;
      }
    }
    return host?.querySelector(`#${visualView ? 'transform' : 'linear-transform'}-num-input-${side}`) || null;
  }

  function getVisibleOperationInput() {
    if (state?.beat !== 'operate') return null;
    const renderer = visualView ? visualRenderer : linearRenderer;
    return renderer?.getResponseRegion('operate')?.primaryInput() ?? null;
  }

  function getVisibleComparisonRegion() {
    const renderer = visualView ? visualComparisonRenderer : linearComparisonRenderer;
    return renderer?.getResponseRegion('compare') ?? null;
  }

  function captureComparisonDraft() {
    if (!isPlan45ComparisonEpisode(state) || state.status === 'resolved') return;
    const host = visualView ? visualHost : linearHost;
    const rawDraft = [...(host?.querySelectorAll('.plan45-relation-option input') ?? [])]
      .find((input) => input.checked)?.value
      ?? getVisibleComparisonRegion()?.readDraft();
    if (typeof rawDraft === 'string') comparisonDraft = rawDraft;
  }

  function createComparisonResponseHandle() {
    if (!isPlan45ComparisonEpisode(state) || state.status !== 'active') {
      comparisonResponseHandle = null;
      return null;
    }
    const scheduleEntry = state.beatSchedule[state.schedulePosition];
    const scope = Object.freeze({
      itemId: state.taskContext.itemId,
      schedulePosition: state.schedulePosition,
      scheduleEntryId: scheduleEntry.id,
      promptId: state.expectedResponse.promptId,
      episodeGeneration: currentEpisodeGeneration,
      helperEpoch: state.construction?.epoch ?? null,
      helperPhase: state.construction?.phase ?? null,
    });
    const isCurrent = () => isPlan45ComparisonEpisode(state)
      && state.status === 'active'
      && currentEpisodeGeneration === scope.episodeGeneration
      && state.taskContext.itemId === scope.itemId
      && state.schedulePosition === scope.schedulePosition
      && state.beatSchedule[state.schedulePosition]?.id === scope.scheduleEntryId
      && state.expectedResponse?.promptId === scope.promptId
      && (state.construction?.epoch ?? null) === scope.helperEpoch
      && (state.construction?.phase ?? null) === scope.helperPhase;
    comparisonResponseHandle = Object.freeze({
      ...scope,
      readDraft: () => isCurrent() ? comparisonDraft : '',
      writeDraft: (raw) => {
        if (!isCurrent() || (raw !== '' && !['<', '=', '>'].includes(raw))) return false;
        comparisonDraft = raw;
        return true;
      },
      readConstructionDraft: (key) => isCurrent() ? comparisonConstructionDrafts[key] ?? '' : '',
      writeConstructionDraft: (key, raw) => { if (!isCurrent() || typeof raw !== 'string') return false; comparisonConstructionDrafts[key] = raw; return true; },
      readHelpOpen: () => isCurrent() ? comparisonHelpOpen : false,
      writeHelpOpen: (open) => {
        if (!isCurrent()) return false;
        comparisonHelpOpen = Boolean(open);
        if (comparisonHelpOpen) recordController?.helpOpened();
        return true;
      },
      focusPrimary: () => isCurrent() ? getVisibleComparisonRegion()?.focusPrimary() ?? false : false,
      dispatch: (intent) => {
        const current = isCurrent();
        if (!current) return false;
        dispatchAction(intent);
        return true;
      },
    });
    return comparisonResponseHandle;
  }

  function focusOperationInput() {
    if (state?.beat !== 'operate') return false;
    const renderer = visualView ? visualRenderer : linearRenderer;
    return renderer?.getResponseRegion('operate')?.focusPrimary() ?? false;
  }

  function captureOperationDraft() {
    const renderer = visualView ? visualRenderer : linearRenderer;
    const draft = renderer?.getResponseRegion('operate')?.readDraft() ?? null;
    if (draft !== null) operationDrafts = draft;
  }

  function restoreOperationDraft() {
    if (state?.beat !== 'operate') return;
    const renderer = visualView ? visualRenderer : linearRenderer;
    renderer?.getResponseRegion('operate')?.writeDraft(operationDrafts);
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
    if (isPlan45ComparisonEpisode(state) || isCollection(state) || isDistance(state) || isPlan53(state) || isPlan58(state) || isPlan59(state) || isPlan72(state)) {
      helpButton.hidden = true;
      return;
    }
    if (isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition)) {
      const supportControls = appRoot.querySelector('.app-support-controls');
      if (helpButton.parentNode !== supportControls) {
        if (helpButton.parentNode) helpButton.parentNode.removeChild(helpButton);
        supportControls.prepend(helpButton);
      }
      const available = state.beat === 'locate' && state.status !== 'resolved';
      helpButton.hidden = !available;
      helpButton.textContent = numberLineHelpOpen ? STRINGS.app.closeHelpButton : STRINGS.app.helpButton;
      helpButton.setAttribute('aria-expanded', String(numberLineHelpOpen));
      if (numberLineHelpOpen) helpButton.setAttribute('aria-controls', `${visualView ? 'visual' : 'linear'}-plan39-help`);
      else helpButton.removeAttribute('aria-controls');
      return;
    }
    const isPlan36 = isPlan36SubtractionDefinition(state.episodeDefinition);
    const isPlan40 = isPlan40SubtractionRecipeDefinition(state.episodeDefinition);
    if ((isPlan36 || isPlan40) && state.beat === 'operate') {
      const host = visualView ? visualHost : linearHost;
      const controls = host.querySelector('.active-beat-controls');
      if (!controls) return;
      if (helpButton.parentNode !== controls && helpButton.parentNode) {
        helpButton.parentNode.removeChild(helpButton);
      }
      controls.appendChild(helpButton);
      helpButton.hidden = false;
      helpButton.textContent = subtractionHelpOpen ? STRINGS.app.closeHelpButton : STRINGS.app.helpButton;
      helpButton.setAttribute('aria-expanded', String(subtractionHelpOpen));
      if (subtractionHelpOpen) {
        helpButton.setAttribute('aria-controls', `${visualView ? 'visual' : 'linear'}-subtraction-task-help`);
      } else {
        helpButton.removeAttribute('aria-controls');
      }
      return;
    }
    if (state.episodeDefinition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id
      && state.beat === 'operate') {
      const host = visualView ? visualHost : linearHost;
      const controls = host.querySelector('.active-beat-controls');
      if (!controls) return;
      if (helpButton.parentNode !== controls && helpButton.parentNode) {
        helpButton.parentNode.removeChild(helpButton);
      }
      controls.appendChild(helpButton);
      const isOpen = activityNotice === STRINGS.operate.likeAdditionHelp;
      helpButton.hidden = false;
      helpButton.textContent = isOpen ? STRINGS.app.closeHelpButton : STRINGS.app.helpButton;
      helpButton.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        helpButton.setAttribute('aria-controls', helpCue.id);
        helpCue.textContent = STRINGS.operate.likeAdditionHelp;
        if (helpCue.parentNode !== controls) controls.appendChild(helpCue);
      } else {
        helpButton.removeAttribute('aria-controls');
        helpCue.textContent = '';
        if (helpCue.parentNode) helpCue.parentNode.removeChild(helpCue);
      }
      return;
    }
    if (state.beat !== 'decide' && state.beat !== 'transform') {
      decideHelpOpen = false;
      transformHelpOpen = false;
      subtractionHelpOpen = false;
      helpButton.textContent = STRINGS.app.helpButton;
      helpButton.setAttribute('aria-expanded', 'false');
      helpButton.removeAttribute('aria-controls');
      if (helpCue.parentNode) helpCue.parentNode.removeChild(helpCue);
      const supportControls = appRoot.querySelector('.app-support-controls');
      const isPlan35NonIdentify = state.episodeDefinition.id === PLAN35_RECIPE_DEFINITION_ID
        && state.taskContext?.patternId !== PLAN35_RECIPE_IDS.identify;
      helpButton.hidden = state.episodeDefinition.id === PLAN34_EPISODE_DEFINITION_ID
        || isPlan35NonIdentify
        || isPlan40
        || (state.episodeDefinition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id
          && state.beat !== 'operate')
        || (isPlan36 && state.beat !== 'operate');
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
    helpButton.hidden = false;
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
    const nestedHelp = scene?.meaning?.taskHelp?.kind === 'renaming-side-comparison';
    const cue = nestedHelp
      ? STRINGS.nestedAddition.sideChoiceHelp(scene?.meaning?.taskHelp?.targetDenominator ?? '8')
      : !sourceDenominators
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
    captureOperationDraft();
    if (!isPlan45ComparisonEpisode(state)) captureComparisonDraft();
    if (state.beat !== 'decide') {
      decideHelpOpen = false;
      commonDenominatorDraft = '';
    }
    if (state.beat !== 'operate') {
      operationDrafts = null;
      subtractionHelpOpen = false;
    }
    const activeScheduleEntryId = state.beatSchedule?.[state.schedulePosition]?.id ?? null;
    if (state.beat === 'transform' && transformDraftScheduleEntryId !== null
      && activeScheduleEntryId !== transformDraftScheduleEntryId) {
      transformDrafts = {
        left: { multiplier: '', numerator: state.taskContext?.candidates?.left?.numerator ?? '' },
        right: { multiplier: '', numerator: state.taskContext?.candidates?.right?.numerator ?? '' },
      };
      transformHelpOpen = false;
      inspectChangeOpen = false;
    }
    if (state.beat === 'transform') {
      transformDraftScheduleEntryId = activeScheduleEntryId;
    } else {
      transformDraftScheduleEntryId = null;
    }
    const mode = presentationModeFor({ override: presentationMode, motionQuery });
    const scene = resolveRenderableScene({
      state,
      initialRole: (isPlan59(state) || isPlan53(state) || isCollection(state) || isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition)) ? 'number-line' : 'fraction-bar',
      presentationMode: mode,
      isReplaying,
    });
    currentScene = scene;

    if (isPlan59(state)) {
      visualRenderer?.destroy(); linearRenderer?.destroy();
      visualNumberLineRenderer?.destroy(); linearNumberLineRenderer?.destroy();
      visualComparisonRenderer?.destroy(); linearComparisonRenderer?.destroy();
      visualRenderer = null; linearRenderer = null;
      visualNumberLineRenderer = null; linearNumberLineRenderer = null;
      visualComparisonRenderer = null; linearComparisonRenderer = null;
      const generation = currentEpisodeGeneration;
      const active = () => generation === currentEpisodeGeneration && isPlan59(state);
      const onAction = action => {
        if (!active()) return;
        if (action) { try { state = applyIntent(state, action); } catch { render(); return; } }
        render();
        if (action?.type === 'check-directed-endpoint') (visualView ? visualPlan59Renderer : linearPlan59Renderer)?.focusFeedback();
      };
      const options = view => ({
        container: view === 'visual' ? visualHost : linearHost, view, dispatch: onAction, active,
        helpOpen: () => plan59HelpOpen,
        toggleHelp: () => {
          if (!active()) return;
          plan59HelpOpen = !plan59HelpOpen;
          if (plan59HelpOpen) onAction({ type: 'request-directed-endpoint-help', context: scene.meaning.endpoint.context, helpKind: 'placement' });
          else render();
        },
        progression: () => { const descriptor = computeProgressionDescriptor(); return { ...descriptor,
          onAction: descriptor.onAction ? () => { if (active()) descriptor.onAction(); } : null }; },
      });
      if (!visualPlan59Renderer) { visualPlan59Renderer = createPlan59Renderer(options('visual')); visualPlan59Renderer.mount(scene); }
      else visualPlan59Renderer.update(scene);
      if (!linearPlan59Renderer) { linearPlan59Renderer = createPlan59Renderer(options('linear')); linearPlan59Renderer.mount(scene); }
      else linearPlan59Renderer.update(scene);
      updateConditionMetadata(); updateSupportMetadata(); updateSupportControls(); updateNavigation(); updateViewVisibility(); updateHelpPlacement(scene);
      return;
    }
    visualPlan59Renderer?.destroy(); linearPlan59Renderer?.destroy();
    visualPlan59Renderer = null; linearPlan59Renderer = null;

    if (isPlan72(state)) {
      visualRenderer?.destroy(); linearRenderer?.destroy(); visualNumberLineRenderer?.destroy(); linearNumberLineRenderer?.destroy();
      visualComparisonRenderer?.destroy(); linearComparisonRenderer?.destroy(); visualCollectionRenderer?.destroy(); linearCollectionRenderer?.destroy();
      visualRenderer = null; linearRenderer = null; visualNumberLineRenderer = null; linearNumberLineRenderer = null;
      visualComparisonRenderer = null; linearComparisonRenderer = null; visualCollectionRenderer = null; linearCollectionRenderer = null;
      const generation = currentEpisodeGeneration;
      const active = () => generation === currentEpisodeGeneration && isPlan72(state);
      const onAction = action => {
        if (!active()) return;
        try { state = applyIntent(state, action); } catch { render(); return; }
        render();
        if (action.type === 'check-mixed-addition' || action.type === 'check-mixed-subtraction' || action.type === 'check-mixed-improper') (visualView ? visualPlan72Renderer : linearPlan72Renderer)?.focusFeedback();
        if (action.type === 'check-rename') { const renderer=visualView ? visualPlan72Renderer : linearPlan72Renderer; if(state.help.established) renderer?.focusFinal(); else renderer?.focusHelpFeedback(); }
      };
      const options = view => ({
        container: view === 'visual' ? visualHost : linearHost, view, dispatch: onAction, active,
        helpOpen: () => plan72HelpOpen,
        toggleHelp: () => {
          if (!active()) return;
          plan72HelpOpen = !plan72HelpOpen;
          if (plan72HelpOpen) onAction({ type: [PLAN78_ID, PLAN82_ID].includes(state.episodeDefinition.id) ? 'request-mixed-subtraction-help' : 'request-mixed-addition-help', context: (scene.meaning.subtraction ?? scene.meaning.addition).context, helpKind: state.episodeDefinition.id === PLAN82_ID ? 'rename' : 'unit' });
          else render();
          if (state.episodeDefinition.id === PLAN82_ID) { const renderer=visualView ? visualPlan72Renderer : linearPlan72Renderer; if(plan72HelpOpen) renderer?.focusHelp(); else renderer?.focusHelpToggle(); }
        },
        progression: () => { const descriptor = computeProgressionDescriptor(); return { ...descriptor,
          onAction: descriptor.onAction ? () => { if (active()) descriptor.onAction(); } : null }; },
      });
      if (!visualPlan72Renderer) { visualPlan72Renderer = (state.episodeDefinition.id === PLAN84_ID ? createPlan84Renderer : state.episodeDefinition.id === PLAN82_ID ? createPlan82Renderer : state.episodeDefinition.id === PLAN78_ID ? createPlan78Renderer : state.episodeDefinition.id === PLAN74_ID ? createPlan74Renderer : createPlan72Renderer)(options('visual')); visualPlan72Renderer.mount(scene); }
      else visualPlan72Renderer.update(scene);
      if (!linearPlan72Renderer) { linearPlan72Renderer = (state.episodeDefinition.id === PLAN84_ID ? createPlan84Renderer : state.episodeDefinition.id === PLAN82_ID ? createPlan82Renderer : state.episodeDefinition.id === PLAN78_ID ? createPlan78Renderer : state.episodeDefinition.id === PLAN74_ID ? createPlan74Renderer : createPlan72Renderer)(options('linear')); linearPlan72Renderer.mount(scene); }
      else linearPlan72Renderer.update(scene);
      updateConditionMetadata(); updateSupportMetadata(); updateSupportControls(); updateNavigation(); updateViewVisibility(); updateHelpPlacement(scene);
      return;
    }
    visualPlan72Renderer?.destroy(); linearPlan72Renderer?.destroy();
    visualPlan72Renderer = null; linearPlan72Renderer = null;

    if (isPlan58(state)) {
      visualRenderer?.destroy(); linearRenderer?.destroy(); visualNumberLineRenderer?.destroy(); linearNumberLineRenderer?.destroy();
      visualComparisonRenderer?.destroy(); linearComparisonRenderer?.destroy(); visualCollectionRenderer?.destroy(); linearCollectionRenderer?.destroy();
      visualRenderer = null; linearRenderer = null; visualNumberLineRenderer = null; linearNumberLineRenderer = null;
      visualComparisonRenderer = null; linearComparisonRenderer = null; visualCollectionRenderer = null; linearCollectionRenderer = null;
      const generation = currentEpisodeGeneration;
      const active = () => generation === currentEpisodeGeneration && isPlan58(state);
      const onAction = action => {
        if (!active()) return;
        try { state = applyIntent(state, action); } catch { render(); return; }
        render();
        if (action.type === 'check-whole-plus-fraction') (visualView ? visualPlan58Renderer : linearPlan58Renderer)?.focusFeedback();
      };
      const options = view => ({
        container: view === 'visual' ? visualHost : linearHost, view, dispatch: onAction, active,
        helpOpen: () => plan58HelpOpen,
        toggleHelp: () => {
          if (!active()) return;
          plan58HelpOpen = !plan58HelpOpen;
          if (plan58HelpOpen) onAction({ type: 'request-whole-plus-fraction-help', context: scene.meaning.construction.context, helpKind: 'unit' });
          else render();
        },
        progression: () => { const descriptor = computeProgressionDescriptor(); return { ...descriptor,
          onAction: descriptor.onAction ? () => { if (active()) descriptor.onAction(); } : null }; },
      });
      if (!visualPlan58Renderer) { visualPlan58Renderer = createPlan58Renderer(options('visual')); visualPlan58Renderer.mount(scene); }
      else visualPlan58Renderer.update(scene);
      if (!linearPlan58Renderer) { linearPlan58Renderer = createPlan58Renderer(options('linear')); linearPlan58Renderer.mount(scene); }
      else linearPlan58Renderer.update(scene);
      updateConditionMetadata(); updateSupportMetadata(); updateSupportControls(); updateNavigation(); updateViewVisibility(); updateHelpPlacement(scene);
      return;
    }
    visualPlan58Renderer?.destroy(); linearPlan58Renderer?.destroy();
    visualPlan58Renderer = null; linearPlan58Renderer = null;

    if (isPlan53(state)) {
      visualRenderer?.destroy();
      linearRenderer?.destroy();
      visualNumberLineRenderer?.destroy();
      linearNumberLineRenderer?.destroy();
      visualComparisonRenderer?.destroy();
      linearComparisonRenderer?.destroy();
      visualCollectionRenderer?.destroy();
      linearCollectionRenderer?.destroy();
      visualRenderer = null;
      linearRenderer = null;
      visualNumberLineRenderer = null;
      linearNumberLineRenderer = null;
      visualComparisonRenderer = null;
      linearComparisonRenderer = null;
      visualCollectionRenderer = null;
      linearCollectionRenderer = null;
      const generation = currentEpisodeGeneration;
      const active = () => generation === currentEpisodeGeneration && isPlan53(state);
      const onAction = action => {
        if (!active()) return;
        if (action) {
          try { state = applyIntent(state, action); }
          catch { render(); return; }
        }
        render();
        if (action?.type === 'check-two-whole') {
          (visualView ? visualPlan53Renderer : linearPlan53Renderer)?.focusFeedback();
        }
      };
      const options = view => ({
        container: view === 'visual' ? visualHost : linearHost,
        view, dispatch: onAction, active, helpOpen: () => plan53HelpOpen,
        toggleHelp: () => {
          if (!active()) return;
          plan53HelpOpen = !plan53HelpOpen;
          if (plan53HelpOpen) {
            onAction({ type: 'request-two-whole-help', context: scene.meaning.location.context, helpKind: 'placement' });
          } else render();
        },
        progression: () => {
          const descriptor = computeProgressionDescriptor();
          return { ...descriptor, onAction: descriptor.onAction ? () => {
            if (active()) descriptor.onAction();
          } : null };
        },
      });
      if (!visualPlan53Renderer) {
        visualPlan53Renderer = createPlan53Renderer(options('visual'));
        visualPlan53Renderer.mount(scene);
      } else visualPlan53Renderer.update(scene);
      if (!linearPlan53Renderer) {
        linearPlan53Renderer = createPlan53Renderer(options('linear'));
        linearPlan53Renderer.mount(scene);
      } else linearPlan53Renderer.update(scene);
      updateConditionMetadata();
      updateSupportMetadata();
      updateSupportControls();
      updateNavigation();
      updateViewVisibility();
      updateHelpPlacement(scene);
      return;
    }
    visualPlan53Renderer?.destroy();
    linearPlan53Renderer?.destroy();
    visualPlan53Renderer = null;
    linearPlan53Renderer = null;

    if (isDistance(state)) {
      visualRenderer?.destroy(); linearRenderer?.destroy(); visualNumberLineRenderer?.destroy(); linearNumberLineRenderer?.destroy();
      visualComparisonRenderer?.destroy(); linearComparisonRenderer?.destroy(); visualCollectionRenderer?.destroy(); linearCollectionRenderer?.destroy();
      visualRenderer = null; linearRenderer = null; visualNumberLineRenderer = null; linearNumberLineRenderer = null;
      visualComparisonRenderer = null; linearComparisonRenderer = null; visualCollectionRenderer = null; linearCollectionRenderer = null;
      const generation = currentEpisodeGeneration;
      const stage = state.beat;
      const renderGeneration = ++distanceRenderGeneration;
      const active = () => generation === currentEpisodeGeneration && renderGeneration === distanceRenderGeneration && isDistance(state) && state.beat === stage;
      const action = proposed => {
        if (!active() || !proposed) return;
        try {
          const priorStage = state.beat;
          state = syncSessionEpisode(state, applyIntent(state, { ...proposed, context: plan51IntentContext(state) }));
          distanceRefusal = '';
          if (state.beat !== priorStage) distanceHelpOpen = false;
        } catch {
          distanceRefusal = proposed.type === 'submit-distance-fraction'
            ? 'Enter a numerator and a positive denominator using whole numbers of up to 18 digits.'
            : 'Choose a relation before checking.';
        }
        render();
        const host = visualView ? visualHost : linearHost;
        const target = state.beat === 'resolve' ? host.querySelector('.plan51-next')
          : proposed.type.startsWith('request-') ? host.querySelector('.plan45-help-summary')
          : state.beat === 'distance' ? host.querySelector('[data-plan51-focus="numerator"]') : host.querySelector('.plan51-response input');
        target?.focus();
      };
      for (const [host, view] of [[visualHost, 'visual'], [linearHost, 'linear']]) {
        renderPlan51Distance(host, scene, {
          view, draft: distanceDraft, refusal: distanceRefusal, helpOpen: distanceHelpOpen,
          setDraft: (key, value) => { if (active()) distanceDraft[key] = value; },
          setFocus: key => { if (active()) distanceFocus = key; },
          setHelpOpen: value => { if (active()) distanceHelpOpen = value; },
          action, progression: () => {
            const descriptor = computeProgressionDescriptor();
            return { ...descriptor, onAction: descriptor.onAction ? () => { if (active()) descriptor.onAction(); } : null };
          },
        });
      }
      updateConditionMetadata(); updateSupportMetadata(); updateSupportControls(); updateNavigation(); updateViewVisibility(); updateHelpPlacement(scene);
      return;
    }

    if (isCollection(state)) {
      visualRenderer?.destroy(); linearRenderer?.destroy(); visualNumberLineRenderer?.destroy(); linearNumberLineRenderer?.destroy(); visualComparisonRenderer?.destroy(); linearComparisonRenderer?.destroy();
      visualRenderer=null;linearRenderer=null;visualNumberLineRenderer=null;linearNumberLineRenderer=null;visualComparisonRenderer=null;linearComparisonRenderer=null;
      const generation=currentEpisodeGeneration;
      const onAction=(action,defer=false)=>{ if(generation!==currentEpisodeGeneration || !isCollection(state)) return; if(action) {try {state=applyIntent(state,action);} catch {render();return;}} if(!defer) {render(); if(action?.type==='check-collection') (visualView?visualCollectionRenderer:linearCollectionRenderer)?.focusFeedback();} };
      const options=view=>({container:view==='visual'?visualHost:linearHost,view,dispatch:onAction,progression:()=>computeProgressionDescriptor(),helpOpen:()=>collectionHelpOpen,toggleHelp:()=>{collectionHelpOpen=!collectionHelpOpen;if(collectionHelpOpen) onAction({type:'request-collection-help',context:{setId:state.taskContext.setId,setRevision:state.taskContext.setRevision,itemId:state.taskContext.itemId,itemRevision:state.taskContext.itemRevision,definitionId:state.taskContext.definitionId,definitionRevision:state.taskContext.definitionRevision},helpKind:'placement'});else render();}});
      if(!visualCollectionRenderer){visualCollectionRenderer=createNumberLineCollectionRenderer(options('visual'));visualCollectionRenderer.mount(scene);}else visualCollectionRenderer.update(scene);
      if(!linearCollectionRenderer){linearCollectionRenderer=createNumberLineCollectionRenderer(options('linear'));linearCollectionRenderer.mount(scene);}else linearCollectionRenderer.update(scene);
      updateConditionMetadata();updateSupportMetadata();updateSupportControls();updateNavigation();updateViewVisibility();updateHelpPlacement(scene);return;
    }
    visualCollectionRenderer?.destroy();linearCollectionRenderer?.destroy();visualCollectionRenderer=null;linearCollectionRenderer=null;

    if (isPlan45ComparisonEpisode(state)) {
      visualRenderer?.destroy();
      linearRenderer?.destroy();
      visualNumberLineRenderer?.destroy();
      linearNumberLineRenderer?.destroy();
      visualRenderer = null;
      linearRenderer = null;
      visualNumberLineRenderer = null;
      linearNumberLineRenderer = null;
      const responseHandle = createComparisonResponseHandle();
      const rendererOptions = (view) => ({
        dispatchAction: (action) => responseHandle?.dispatch(action) ?? false,
        getDraft: () => responseHandle?.readDraft() ?? '',
        setDraft: (value) => responseHandle?.writeDraft(value) ?? false,
        getConstructionDraft: (key) => responseHandle?.readConstructionDraft(key) ?? '',
        setConstructionDraft: (key, raw) => responseHandle?.writeConstructionDraft(key, raw) ?? false,
        getHelpOpen: () => responseHandle?.readHelpOpen() ?? false,
        setHelpOpen: (open) => responseHandle?.writeHelpOpen(open) ?? false,
        getProgression: () => computeProgressionDescriptor(),
      });
      if (!visualComparisonRenderer) {
        visualComparisonRenderer = createPlan45ComparisonRenderer({ container: visualHost, view: 'visual' });
        visualComparisonRenderer.mount(scene, rendererOptions('visual'));
      } else visualComparisonRenderer.update(scene, rendererOptions('visual'));
      if (!linearComparisonRenderer) {
        linearComparisonRenderer = createPlan45ComparisonRenderer({ container: linearHost, view: 'linear' });
        linearComparisonRenderer.mount(scene, rendererOptions('linear'));
      } else linearComparisonRenderer.update(scene, rendererOptions('linear'));
      updateConditionMetadata();
      updateSupportMetadata();
      updateSupportControls();
      updateNavigation();
      updateViewVisibility();
      updateHelpPlacement(scene);
      return;
    }
    visualComparisonRenderer?.destroy();
    linearComparisonRenderer?.destroy();
    visualComparisonRenderer = null;
    linearComparisonRenderer = null;
    comparisonResponseHandle = null;

    if (isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition)) {
      visualRenderer?.destroy();
      linearRenderer?.destroy();
      visualRenderer = null;
      linearRenderer = null;
      if (!visualNumberLineRenderer) {
        const rendererGeneration = entryRendererLifetime;
        visualNumberLineRenderer = createNumberLineLocateRenderer({
          container: visualHost,
          view: 'visual',
          strings: APP_RENDER_STRINGS,
          dispatchAction: action => { if (rendererGeneration === entryRendererLifetime) dispatchAction(action); },
          onPreviewChange: value => { if (rendererGeneration === entryRendererLifetime) setNumberLineDraft(value); },
          getHelpOpen: () => numberLineHelpOpen,
          getProgression: () => computeProgressionDescriptor(),
        });
        visualNumberLineRenderer.mount(scene);
      } else visualNumberLineRenderer.update(scene);
      if (!linearNumberLineRenderer) {
        const rendererGeneration = entryRendererLifetime;
        linearNumberLineRenderer = createNumberLineLocateRenderer({
          container: linearHost,
          view: 'linear',
          strings: APP_RENDER_STRINGS,
          dispatchAction: action => { if (rendererGeneration === entryRendererLifetime) dispatchAction(action); },
          onPreviewChange: value => { if (rendererGeneration === entryRendererLifetime) setNumberLineDraft(value); },
          getHelpOpen: () => numberLineHelpOpen,
          getProgression: () => computeProgressionDescriptor(),
        });
        linearNumberLineRenderer.mount(scene);
      } else linearNumberLineRenderer.update(scene);
      updateConditionMetadata();
      updateSupportMetadata();
      updateSupportControls();
      updateNavigation();
      updateViewVisibility();
      (visualView ? visualNumberLineRenderer : linearNumberLineRenderer)?.refreshGeometry();
      restoreNumberLineDraft();
      updateHelpPlacement(scene);
      return;
    }
    visualNumberLineRenderer?.destroy();
    linearNumberLineRenderer?.destroy();
    visualNumberLineRenderer = null;
    linearNumberLineRenderer = null;

    if (!visualRenderer) {
      const rendererGeneration = entryRendererLifetime;
      visualRenderer = createBeatContainer({
        container: visualHost,
        dispatchAction: action => { if (rendererGeneration === entryRendererLifetime) dispatchAction(action); },
        strings: APP_RENDER_STRINGS,
        isTaskHelpOpen: () => transformHelpOpen || subtractionHelpOpen,
        isInspectChangeOpen: () => inspectChangeOpen,
        onInspectChangeOpen: () => {
          if (rendererGeneration !== entryRendererLifetime) return;
          inspectChangeOpen = true;
          render();
          getVisibleTransformInput()?.focus();
        },
        getProgression: () => computeProgressionDescriptor(),
      });
      visualRenderer.mount(scene);
    } else {
      visualRenderer.update(scene);
    }

    if (!linearRenderer) {
      const rendererGeneration = entryRendererLifetime;
      linearRenderer = createLinearPathRenderer({
        container: linearHost,
        dispatchAction: action => { if (rendererGeneration === entryRendererLifetime) dispatchAction(action); },
        strings: APP_RENDER_STRINGS,
        isTaskHelpOpen: () => transformHelpOpen || subtractionHelpOpen,
        isInspectChangeOpen: () => inspectChangeOpen,
        onInspectChangeOpen: () => {
          if (rendererGeneration !== entryRendererLifetime) return;
          inspectChangeOpen = true;
          render();
          getVisibleTransformInput()?.focus();
        },
        getProgression: () => computeProgressionDescriptor(),
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
    restoreOperationDraft();
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
    let focusSingleItemCompletion = false;
    try {
      captureDecideDraft();
      captureTransformDrafts();
      captureOperationDraft();
      captureComparisonDraft();
      if (action.type === 'propose-common-denominator') commonDenominatorDraft = '';
      const wasResolved = state.status === 'resolved';
      const recordPreviousState = state;
      state = syncSessionEpisode(state, applyIntent(state, action));
      if (!isReplaying) recordController?.observe(recordPreviousState, state, action);
      if (action.type === 'revise-comparison-denominator') comparisonConstructionDrafts = {};
      if (action.type === 'submit-fraction-comparison' && state.status === 'resolved') comparisonDraft = '';
      if (action.type === 'request-help') {
        isReplaying = false;
        const help = state.helpHistory.at(-1);
        activityNotice = state.episodeDefinition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id
          ? STRINGS.operate.likeAdditionHelp
          : help.beat === 'decide'
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
      } else if (action.type === 'request-task-help') {
        isReplaying = false;
        activityNotice = state.episodeDefinition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id
          && state.beat === 'operate'
          ? STRINGS.operate.likeAdditionHelp
          : '';
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
        focusExhaustion = navigationMode !== 'direct'
          && justResolved && isLastVettedItem
          && selectedPracticeType.items.length > 1;
        focusSingleItemCompletion = navigationMode !== 'direct'
          && justResolved
          && state.episodeDefinition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id;
      }
      render();
      if (isPlan45ComparisonEpisode(state)) {
        if (action.type === 'submit-fraction-comparison') {
          if (state.status === 'resolved') {
            const progressionButton = (visualView ? visualHost : linearHost)?.querySelector('.plan45-progression-button');
            if (progressionButton?.isConnected) progressionButton.focus();
          } else {
            comparisonResponseHandle?.focusPrimary();
          }
        } else if (action.type.includes('comparison-construction') || action.type.startsWith('submit-comparison-') || action.type === 'revise-comparison-denominator') {
          const host = visualView ? visualHost : linearHost;
          const target = host?.querySelector('[data-plan49-primary]') || host?.querySelector('[data-plan45-focus-key=help-summary]');
          if (target?.isConnected) target.focus();
        } else if (action.type === 'request-comparison-model') {
          comparisonResponseHandle?.focusPrimary();
        } else if (action.type === 'request-comparison-help') {
          const host = visualView ? visualHost : linearHost;
          const key = action.helpKind === 'reasoning' ? 'reasoning' : 'notation';
          const button = [...(host?.querySelectorAll('[data-plan45-focus-key]') ?? [])]
            .find((element) => element.getAttribute('data-plan45-focus-key') === key);
          button?.focus();
        }
      }
      if (focusExhaustion) focusNavigationNotice();
      if (focusSingleItemCompletion) focusEpisodeLandmark();
      if (action.type === 'request-task-help'
        && state.episodeDefinition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id
        && state.beat === 'operate') helpButton.focus();
      if (action.type === 'acknowledge-bridge-encounter') {
        const renderer = visualView ? visualNumberLineRenderer : linearNumberLineRenderer;
        renderer?.focusControl('candidate');
      }
      if (action.type === 'propose-number-line-location') {
        const renderer = visualView ? visualNumberLineRenderer : linearNumberLineRenderer;
        const focusTarget = state.beat === 'resolve' ? 'finish' : 'candidate';
        renderer?.focusControl(focusTarget);
      }
      if (action.type === 'request-task-help'
        && (isPlan36SubtractionDefinition(state.episodeDefinition) || isPlan40SubtractionRecipeDefinition(state.episodeDefinition))
        && state.beat === 'operate') helpButton.focus();
      if (action.type === 'mark-subtrahend-amount') focusOperationInput();
      if (['submit-equivalent-form', 'keep-inspected-form', 'repair-inspected-form'].includes(action.type)
        && isPlan40SubtractionRecipeDefinition(state.episodeDefinition)
        && state.beat === 'operate') {
        focusOperationInput();
      }
      if (action.type === 'submit-subtraction-result') {
        if (state.beat === 'resolve') {
          const host = visualView ? visualHost : linearHost;
          const finishBtn = host?.querySelector('.active-beat-controls button');
          if (finishBtn) finishBtn.focus();
        } else if (state.lastRecovery?.beat === 'operate') {
          focusOperationInput();
        }
      }
      if (action.type === 'finish-compact-episode') {
        if (nextProblemButton && !nextProblemButton.hasAttribute('hidden')) {
          nextProblemButton.focus();
        }
      }
      if (action.type === 'submit-operation-result') {
        if (state.beat === 'resolve') {
          const host = visualView ? visualHost : linearHost;
          const continuationBtn = host?.querySelector('.active-beat-controls button');
          if (continuationBtn) continuationBtn.focus();
        } else if (state.lastRecovery?.beat === 'operate') {
          focusOperationInput();
        }
      }
      if (action.type === 'submit-reflection') {
        if (state.status === 'resolved') {
          const host = visualView ? visualHost : linearHost;
          const nextBtn = host?.querySelector('.active-beat-controls button');
          if (nextBtn) nextBtn.focus();
        }
      }
      if (action.type === 'submit-resolution') {
        const host = visualView ? visualHost : linearHost;
        if (state.beat === 'reflect') {
          const reflectionControl = host?.querySelector('.active-beat-controls .control-choice-btn, .active-beat-controls button');
          if (isVisibleControlInHost(reflectionControl, host)) {
            reflectionControl.focus();
          } else {
            focusEpisodeLandmark();
          }
        } else if (state.status === 'resolved') {
          const finishBtn = host?.querySelector('.active-beat-controls button');
          if (finishBtn) finishBtn.focus();
        }
      }
      if (action.type === 'submit-transform-help-multiplier') getVisibleTransformInput()?.focus();
      if (action.type === 'select-renaming-side') {
        const host = visualView ? visualHost : linearHost;
        if (state.beat === 'decide' && state.lastRecovery?.classification?.kind === 'side-choice-needs-retry') {
          const retryChoice = host?.querySelector('.active-beat-section .nested-side-choice');
          if (isVisibleControlInHost(retryChoice, host)) retryChoice.focus();
        } else if (state.beat === 'transform') {
          const conversionInput = getVisibleTransformInput();
          if (isVisibleControlInHost(conversionInput, host)) conversionInput.focus();
        }
      }
    } catch (error) {
      isReplaying = false;
      activityNotice = action.type === 'request-replay'
        ? STRINGS.app.noReplayYet
        : STRINGS.app.tryAgain;
      render();
      if (action.type === 'propose-number-line-location') {
        const renderer = visualView ? visualNumberLineRenderer : linearNumberLineRenderer;
        renderer?.focusControl('candidate');
      }
      if (action.type === 'submit-transform-help-multiplier') getVisibleTransformInput()?.focus();
    }
  }

  function handleMotionChange() {
    render();
  }

  return {
    mount() {
      if (mounted) return this;
      recordController = createComparisonRecordController({ onChange: (info) => { recordPanel?.render(); if (recordEpisodeNotice && isPlan45ComparisonEpisode(state)) recordEpisodeNotice.textContent = info.message.includes('could not save') ? info.message : !info.eligible && info.enabled ? 'A new problem is needed before activity can be remembered.' : info.message === 'This problem is no longer being remembered.' ? info.message : '';  } });
      createShell();
      recordController.refresh();
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
      if (fragmentPracticeType) launchEntryPractice(fragmentPracticeType, { focusEpisode: true });
      return this;
    },
    update() {
      render();
      return this;
    },
    destroy() {
      recordController?.destroy(); recordPanel?.destroy(); recordController = null; recordPanel = null;
      shellLifetime += 1;
      entryRendererLifetime += 1;
      currentEpisodeGeneration += 1;
      distanceRenderGeneration += 1;
      if (magnitudeSession) { magnitudeSession.exit(magnitudeSession.current().session); clearFragment(); }
      magnitudeSession = null;
      currentScene = null;
      pendingHashDestination = null; exitFocus = null;
      navigationRefusal = false; isTransitioning = false;
      state = null; selectedPracticeType = null; activePracticeItemIndex = null;
      visualPlan59Renderer?.destroy(); linearPlan59Renderer?.destroy();
      visualPlan59Renderer = null; linearPlan59Renderer = null;
      visualCollectionRenderer?.destroy(); linearCollectionRenderer?.destroy();
      visualCollectionRenderer=null; linearCollectionRenderer=null;
      visualComparisonRenderer?.destroy();
      linearComparisonRenderer?.destroy();
      visualComparisonRenderer = null;
      linearComparisonRenderer = null;
      comparisonResponseHandle = null;
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
      visualNumberLineRenderer?.destroy();
      linearNumberLineRenderer?.destroy();
      numberLineDraft = null;
      numberLineHelpOpen = false;
      root.replaceChildren();
      mounted = false;
      visualRenderer = null;
      linearRenderer = null;
      visualNumberLineRenderer = null;
      linearNumberLineRenderer = null;
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
