import { leastCommonDenominator } from '../math/index.js';
import { deepFreeze } from '../content/schema.js';
import { PLAN34_EPISODE_DEFINITION_ID, resolvePlan34TaskContext } from '../content/full-addition-task-patterns.js';
import { PLAN18_NESTED_DEFINITION_ID, resolvePlan18TaskContext } from '../content/nested-renaming-task.js';
import { isPlan35AdditionRecipeDefinition, isPlan35IdentifyRecipe, validatePlan35AdditionRecipeContext } from '../content/plan35-addition-recipe-task.js';
import { isPlan36SubtractionDefinition, validatePlan36LikeDenominatorSubtractionContext } from '../content/plan36-like-denominator-takeaway-task.js';
import { isPlan40SubtractionRecipeDefinition, isPlan40IdentifyRecipe, validatePlan40SubtractionRecipeContext } from '../content/plan40-reusable-subtraction-recipes.js';
import { isPlan37BarToLineBridgeTaskDefinition, validatePlan37BarToLineBridgeContext } from '../content/plan37-bar-to-line-bridge-task.js';
import {
  PLAN45_COMPARISON_DEFINITION_ID,
  validatePlan45ComparisonContext,
} from '../content/plan45-symbolic-fraction-comparison-task.js';

function scheduleError(message) {
  const error = new TypeError(message);
  error.code = 'INVALID_BEAT_SCHEDULE_INPUT';
  return error;
}

/**
 * Derive the immutable traversal configuration for a validated problem.
 * This helper does not admit a problem family; createEpisode retains that gate.
 */
export function computeBeatSchedule(instance, episodeDefinition, taskContext = null, { allowCompatibilityPair = false } = {}) {
  if (episodeDefinition?.id === PLAN45_COMPARISON_DEFINITION_ID
    && ['1', '2'].includes(episodeDefinition?.revision)) {
    if (episodeDefinition.revision === '2') {
      if (taskContext?.definitionRevision !== '2') throw scheduleError('comparison revision and context must match');
      validatePlan45ComparisonContext({ ...taskContext, definitionRevision: '1' });
      if (leastCommonDenominator(BigInt(taskContext.sourceForms.first.denominator), BigInt(taskContext.sourceForms.second.denominator)) > 144n) throw scheduleError('comparison item has no admitted common denominator');
    } else validatePlan45ComparisonContext(taskContext);
    return deepFreeze([
      { id: 'compare', kind: 'compare' },
      { id: 'resolve', kind: 'resolve' },
    ]);
  }
  if (isPlan37BarToLineBridgeTaskDefinition(episodeDefinition)) {
    validatePlan37BarToLineBridgeContext(instance, taskContext, taskContext?.supportMode);
    if (episodeDefinition.revision === '2') {
      return deepFreeze([
        { id: 'locate', kind: 'locate' },
        { id: 'resolve', kind: 'resolve' },
      ]);
    }
    return deepFreeze([
      { id: 'encounter', kind: 'encounter' },
      { id: 'locate', kind: 'locate' },
      { id: 'resolve', kind: 'resolve' },
    ]);
  }
  if (episodeDefinition?.id === PLAN34_EPISODE_DEFINITION_ID
    && episodeDefinition?.revision === '1') {
    const context = resolvePlan34TaskContext(
      instance, taskContext?.patternId, taskContext?.patternRevision, taskContext?.targetDenominator,
      { allowCompatibilityPair },
    );
    return deepFreeze([
      { id: 'encounter', kind: 'encounter' },
      ...context.requiredSides.map((side) => ({ id: `transform-${side}`, kind: 'transform', side })),
      { id: 'operate', kind: 'operate' },
      { id: 'resolve', kind: 'resolve' },
    ]);
  }
  if (episodeDefinition?.id === PLAN18_NESTED_DEFINITION_ID && episodeDefinition?.revision === '1') {
    const context = resolvePlan18TaskContext(instance, { practiceSetId: taskContext?.practiceSetId, practiceSetRevision: taskContext?.practiceSetRevision });
    return deepFreeze([
      { id: 'encounter', kind: 'encounter' },
      { id: 'select-renaming-side', kind: 'decide' },
      { id: `transform-${context.requiredSide}`, kind: 'transform', side: context.requiredSide },
      { id: 'operate', kind: 'operate' },
      { id: 'resolve', kind: 'resolve' },
    ]);
  }
  if (isPlan35AdditionRecipeDefinition(episodeDefinition)) {
    const context = validatePlan35AdditionRecipeContext(instance, taskContext);
    return deepFreeze([
      { id: 'encounter', kind: 'encounter' },
      ...(isPlan35IdentifyRecipe(context) ? [{ id: 'select-renaming-side', kind: 'decide' }] : []),
      ...context.requiredSides.map((side) => ({ id: `transform-${side}`, kind: 'transform', side })),
      { id: 'operate', kind: 'operate' },
      { id: 'resolve', kind: 'resolve' },
    ]);
  }
  if (isPlan36SubtractionDefinition(episodeDefinition)) {
    validatePlan36LikeDenominatorSubtractionContext(instance, taskContext);
    return deepFreeze([
      { id: 'encounter', kind: 'encounter' },
      { id: 'operate', kind: 'operate' },
      { id: 'resolve', kind: 'resolve' },
    ]);
  }
  if (isPlan40SubtractionRecipeDefinition(episodeDefinition)) {
    const context = validatePlan40SubtractionRecipeContext(instance, taskContext);
    return deepFreeze([
      { id: 'encounter', kind: 'encounter' },
      ...(isPlan40IdentifyRecipe(context) ? [{ id: 'select-renaming-side', kind: 'decide' }] : []),
      ...context.requiredSides.map((side) => ({ id: `transform-${side}`, kind: 'transform', side })),
      { id: 'operate', kind: 'operate' },
      { id: 'resolve', kind: 'resolve' },
    ]);
  }
  const renaming = instance?.classification?.transformations?.canonicalRenaming;
  if (!renaming || typeof renaming.left !== 'boolean' || typeof renaming.right !== 'boolean') {
    throw scheduleError('canonical renaming sides must be validated booleans');
  }
  if (!['add', 'subtract'].includes(instance?.request?.operation)) {
    throw scheduleError('problem operation must be add or subtract to derive the beat schedule');
  }
  if (!episodeDefinition || typeof episodeDefinition.includeReflection !== 'boolean') {
    throw scheduleError('registered reflection setting is required to derive the beat schedule');
  }

  const schedule = [
    { id: 'encounter', kind: 'encounter' },
    { id: 'notice', kind: 'notice' },
  ];
  if (renaming.left || renaming.right) {
    schedule.push({ id: 'decide', kind: 'decide' });
    if (renaming.left) schedule.push({ id: 'transform-left', kind: 'transform', side: 'left' });
    if (renaming.right) schedule.push({ id: 'transform-right', kind: 'transform', side: 'right' });
  }
  schedule.push(
    { id: 'operate', kind: 'operate' },
    { id: 'resolve', kind: 'resolve' },
  );
  if (episodeDefinition.includeReflection) schedule.push({ id: 'reflect', kind: 'reflect' });
  return deepFreeze(schedule);
}

export function currentScheduleEntry(state) {
  return state?.beatSchedule?.[state.schedulePosition] ?? null;
}
