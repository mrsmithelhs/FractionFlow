import { deepFreeze } from '../content/schema.js';
import {
  PHASE2_ACTIVE_CONDITION,
  validateActiveCondition,
} from '../interaction/episode-definition.js';
import { STRINGS } from '../render/strings.js';

function registerCondition({ id, label, description, activeCondition }) {
  const normalized = validateActiveCondition(activeCondition);
  return deepFreeze({
    id,
    label,
    description,
    activeCondition: normalized,
  });
}

/**
 * The Phase 2 comparison set. These are design hypotheses, not learner
 * settings. The labels are intentionally plain language; the specification
 * codes live only on internal data attributes in the app shell.
 */
export const REGISTERED_CONDITIONS = deepFreeze([
  registerCondition({
    id: 'phase2-bundle-1',
    label: STRINGS.app.displayStyles.smooth.label,
    description: STRINGS.app.displayStyles.smooth.description,
    activeCondition: PHASE2_ACTIVE_CONDITION,
  }),
  registerCondition({
    id: 'phase2-bundle-2',
    label: STRINGS.app.displayStyles.compare.label,
    description: STRINGS.app.displayStyles.compare.description,
    activeCondition: {
      id: 'phase2-bundle-2',
      revision: '1',
      display: 'D-01-B',
      choreography: 'D-02-J',
      promptCadence: 'D-05-focused-key-beats',
      connectionMaking: 'CM-01-M',
    },
  }),
  registerCondition({
    id: 'phase2-bundle-3',
    label: STRINGS.app.displayStyles.steps.label,
    description: STRINGS.app.displayStyles.steps.description,
    activeCondition: {
      id: 'phase2-bundle-3',
      revision: '1',
      display: 'D-01-B',
      choreography: 'D-02-S',
      promptCadence: 'D-05-focused-key-beats',
      connectionMaking: 'CM-01-M',
    },
  }),
  // `phase2-bundle-4` (CM-01-P, "Check the premise") was registered by Repair 03 and
  // unregistered by owner decision on 2026-09-20. The form was reachable but not working:
  // both answers completed the episode, the correct answer was always the reassuring one,
  // and the question named a "new bar" and a "before" state that are not on screen at the
  // reflect beat. Leaving it registered would have shown DECISION-026 as satisfied when it
  // is not. The CM-01-P branch, the premise strings, and the connectionForm plumbing all
  // remain; re-registering is one entry here once the design work in Repair 04 Item 0 lands.
]);

export function getRegisteredCondition(id) {
  const condition = REGISTERED_CONDITIONS.find((candidate) => candidate.id === id);
  if (!condition) {
    throw new RangeError(`unknown Phase 2 display condition: ${String(id)}`);
  }
  return condition;
}

export function getDefaultCondition() {
  return REGISTERED_CONDITIONS[0];
}
