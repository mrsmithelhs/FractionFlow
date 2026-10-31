import { deepFreeze } from '../content/schema.js';
import {
  createSupportConfiguration,
  HIGH_SUPPORT_CONFIGURATION,
  MEDIUM_SUPPORT_CONFIGURATION,
} from '../interaction/support.js';

function registerSupportLevel({ id, label, description, configuration }) {
  return deepFreeze({
    id,
    label,
    description,
    configuration: createSupportConfiguration(configuration),
  });
}

export const REGISTERED_SUPPORT_LEVELS = deepFreeze([
  registerSupportLevel({
    id: 'high-support',
    label: 'More support',
    description: 'Offers more prompts and choices where a task supports them.',
    configuration: HIGH_SUPPORT_CONFIGURATION,
  }),
  registerSupportLevel({
    id: 'medium-support',
    label: 'Less support',
    description: 'Offers fewer prompts; optional help remains available where a task supports it.',
    configuration: MEDIUM_SUPPORT_CONFIGURATION,
  }),
]);

export function getRegisteredSupportLevel(id) {
  const supportLevel = REGISTERED_SUPPORT_LEVELS.find((candidate) => candidate.id === id);
  if (!supportLevel) {
    throw new RangeError(`unknown support level: ${String(id)}`);
  }
  return supportLevel;
}

export function getDefaultSupportLevel() {
  return REGISTERED_SUPPORT_LEVELS[0];
}
