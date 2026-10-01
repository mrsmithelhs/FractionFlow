import { deepFreeze } from '../content/schema.js';

function scheduleError(message) {
  const error = new TypeError(message);
  error.code = 'INVALID_BEAT_SCHEDULE_INPUT';
  return error;
}

/**
 * Derive the immutable traversal configuration for a validated problem.
 * This helper does not admit a problem family; createEpisode retains that gate.
 */
export function computeBeatSchedule(instance, episodeDefinition) {
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
