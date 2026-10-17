import { deepFreeze } from '../content/schema.js';
import { PLAN34_EPISODE_DEFINITION_ID, resolvePlan34TaskContext } from '../content/full-addition-task-patterns.js';
import { PLAN18_NESTED_DEFINITION_ID, resolvePlan18TaskContext } from '../content/nested-renaming-task.js';

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
