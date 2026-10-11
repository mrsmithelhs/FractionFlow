import { reflectionChoicesForIdentity } from '../authored-content-catalog.js';
export { REFLECTION_CHOICES_BY_FIXTURE } from './legacy-authored-task-records.js';

/** Exact fixture/authoring revision lookup with route-local records only. */
export function reflectionChoicesForInstance(instance, establishedDenominator) {
  return reflectionChoicesForIdentity(
    instance?.provenance?.fixtureId,
    instance?.provenance?.authoringRevision,
    establishedDenominator,
  );
}
