import { premiseCheckForIdentity } from '../authored-content-catalog.js';
export { PREMISE_CHECKS_BY_FIXTURE } from './legacy-authored-task-records.js';

/** Exact fixture/authoring revision lookup; no fallback to a newer record. */
export function premiseCheckForInstance(instance, establishedDenominator) {
  return premiseCheckForIdentity(
    instance?.provenance?.fixtureId,
    instance?.provenance?.authoringRevision,
    establishedDenominator,
  );
}
