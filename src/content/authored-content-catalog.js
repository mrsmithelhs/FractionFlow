import { PHASE1_GOLDEN_CASES } from './data/phase1-golden-cases.js';
import {
  LEGACY_AUTHORED_IDENTITIES,
  PREMISE_CHECKS_BY_FIXTURE as LEGACY_PREMISE_CHECKS,
  REFLECTION_CHOICES_BY_FIXTURE as LEGACY_REFLECTION_CHOICES,
} from './data/legacy-authored-task-records.js';
import {
  MATERIALIZED_PLAN19_ADDITIONS,
  MATERIALIZED_PLAN32_ADDITIONS,
} from './authored-problem-materializer.js';
import { deepFreeze } from './schema.js';

function identityKey(fixtureId, authoringRevision) {
  return `${fixtureId}@${authoringRevision}`;
}

const plan32ByIdentity = new Map(MATERIALIZED_PLAN32_ADDITIONS.map((entry) => [
  identityKey(entry.fixtureId, entry.authoringRevision), entry,
]));
const plan19ByIdentity = new Map(MATERIALIZED_PLAN19_ADDITIONS.map((entry) => [
  identityKey(entry.fixtureId, entry.authoringRevision), entry,
]));
const legacyByIdentity = new Map(LEGACY_AUTHORED_IDENTITIES.map((entry) => [
  identityKey(entry.fixtureId, entry.authoringRevision), entry,
]));

const curatedFixturesByIdentity = new Map();
for (const fixture of PHASE1_GOLDEN_CASES) {
  const key = identityKey(fixture.id, fixture.authoringRevision);
  if (curatedFixturesByIdentity.has(key)) throw new TypeError(`duplicate curated fixture identity: ${key}`);
  curatedFixturesByIdentity.set(key, fixture);
}
for (const item of MATERIALIZED_PLAN32_ADDITIONS) {
  const key = identityKey(item.fixtureId, item.authoringRevision);
  if (curatedFixturesByIdentity.has(key)) throw new TypeError(`duplicate curated fixture identity: ${key}`);
  curatedFixturesByIdentity.set(key, item.fixture);
}
for (const item of MATERIALIZED_PLAN19_ADDITIONS) {
  const key = identityKey(item.fixtureId, item.authoringRevision);
  if (curatedFixturesByIdentity.has(key)) throw new TypeError(`duplicate curated fixture identity: ${key}`);
  curatedFixturesByIdentity.set(key, item.fixture);
}

/** Exact immutable lookup; this deliberately has no "latest revision" fallback. */
export function resolveCuratedFixture(fixtureId, authoringRevision) {
  if (typeof fixtureId !== 'string' || typeof authoringRevision !== 'string') return null;
  return curatedFixturesByIdentity.get(identityKey(fixtureId, authoringRevision)) ?? null;
}

/**
 * Resolve one exact authored fixture/task version for every runtime consumer.
 * New records permanently pin their authoring, recipe, and task-data revisions;
 * legacy records retain their original explicit forms and replay identities.
 */
export function resolveAuthoredContent(fixtureId, authoringRevision) {
  if (typeof fixtureId !== 'string' || typeof authoringRevision !== 'string') return null;
  const key = identityKey(fixtureId, authoringRevision);
  const materialized = plan32ByIdentity.get(key);
  if (materialized) return materialized;
  const sharedFactor = plan19ByIdentity.get(key);
  if (sharedFactor) return sharedFactor;
  const legacy = legacyByIdentity.get(key);
  if (!legacy) return null;
  return deepFreeze({
    ...legacy,
    fixture: curatedFixturesByIdentity.get(key) ?? null,
    premiseChecks: LEGACY_PREMISE_CHECKS[fixtureId] ?? null,
    reflectionChoices: LEGACY_REFLECTION_CHOICES[fixtureId] ?? null,
  });
}

export function resolveAuthoredContentForInstance(instance) {
  return resolveAuthoredContent(
    instance?.provenance?.fixtureId,
    instance?.provenance?.authoringRevision,
  );
}

export function premiseCheckForIdentity(fixtureId, authoringRevision, targetDenominator) {
  return resolveAuthoredContent(fixtureId, authoringRevision)
    ?.premiseChecks?.[String(targetDenominator)] ?? null;
}

export function reflectionChoicesForIdentity(fixtureId, authoringRevision, targetDenominator) {
  return resolveAuthoredContent(fixtureId, authoringRevision)
    ?.reflectionChoices?.[String(targetDenominator)] ?? null;
}

export function listPlan32MaterializedContent() {
  return MATERIALIZED_PLAN32_ADDITIONS;
}

export function listPlan19MaterializedContent() {
  return MATERIALIZED_PLAN19_ADDITIONS;
}
