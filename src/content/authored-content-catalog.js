import { PHASE1_GOLDEN_CASES } from './data/phase1-golden-cases.js';
import {
  LEGACY_AUTHORED_IDENTITIES,
  PREMISE_CHECKS_BY_FIXTURE as LEGACY_PREMISE_CHECKS,
  REFLECTION_CHOICES_BY_FIXTURE as LEGACY_REFLECTION_CHOICES,
} from './data/legacy-authored-task-records.js';
import {
  MATERIALIZED_PLAN19_ADDITIONS,
  MATERIALIZED_PLAN17_ADDITIONS,
  MATERIALIZED_PLAN32_ADDITIONS,
  MATERIALIZED_PLAN20_LIKE_DENOMINATOR_ADDITIONS,
  MATERIALIZED_PLAN36_SUBTRACTIONS,
} from './authored-problem-materializer.js';
import { deepFreeze } from './schema.js';
import { PLAN18_NESTED_ADDITION_RECORDS } from './data/plan18-nested-addition-records.js';
import { PLAN35_ADDITION_RECIPE_FIXTURES, PLAN35_ADDITION_RECIPE_RECORDS } from './data/plan35-addition-recipe-records.js';
import { buildCuratedProblem } from './generator.js';

function identityKey(fixtureId, authoringRevision) {
  return `${fixtureId}@${authoringRevision}`;
}

const plan32ByIdentity = new Map(MATERIALIZED_PLAN32_ADDITIONS.map((entry) => [
  identityKey(entry.fixtureId, entry.authoringRevision), entry,
]));
const plan20ByIdentity = new Map(MATERIALIZED_PLAN20_LIKE_DENOMINATOR_ADDITIONS.map((entry) => [
  identityKey(entry.fixtureId, entry.authoringRevision), entry,
]));
const plan19ByIdentity = new Map(MATERIALIZED_PLAN19_ADDITIONS.map((entry) => [
  identityKey(entry.fixtureId, entry.authoringRevision), entry,
]));
const plan17ByIdentity = new Map(MATERIALIZED_PLAN17_ADDITIONS.map((entry) => [
  identityKey(entry.fixtureId, entry.authoringRevision), entry,
]));
const plan18ByIdentity = new Map(PLAN18_NESTED_ADDITION_RECORDS.map((record) => {
  const fixture = deepFreeze({ id: record.fixtureId, authoringRevision: record.authoringRevision, profileId: 'curated-review', selector: 'nested-denominator-addition', overlays: [], left: record.sourceForms.left, right: record.sourceForms.right });
  const content = buildCuratedProblem({ fixture, selector: fixture.selector, overlays: [], profileId: 'curated-review', candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] } });
  return [identityKey(record.fixtureId, record.authoringRevision), deepFreeze({ itemId: record.itemId, fixtureId: record.fixtureId, authoringRevision: record.authoringRevision, taskDataRevision: record.taskDataRevision, fixture, content })];
}));
const plan36ByIdentity = new Map(MATERIALIZED_PLAN36_SUBTRACTIONS.map((entry) => [
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
for (const item of MATERIALIZED_PLAN20_LIKE_DENOMINATOR_ADDITIONS) {
  const key = identityKey(item.fixtureId, item.authoringRevision);
  if (curatedFixturesByIdentity.has(key)) throw new TypeError(`duplicate curated fixture identity: ${key}`);
  curatedFixturesByIdentity.set(key, item.fixture);
}
for (const item of MATERIALIZED_PLAN19_ADDITIONS) {
  const key = identityKey(item.fixtureId, item.authoringRevision);
  if (curatedFixturesByIdentity.has(key)) throw new TypeError(`duplicate curated fixture identity: ${key}`);
  curatedFixturesByIdentity.set(key, item.fixture);
}
for (const item of MATERIALIZED_PLAN17_ADDITIONS) {
  const key = identityKey(item.fixtureId, item.authoringRevision);
  if (curatedFixturesByIdentity.has(key)) throw new TypeError(`duplicate curated fixture identity: ${key}`);
  curatedFixturesByIdentity.set(key, item.fixture);
}
for (const fixture of PLAN35_ADDITION_RECIPE_FIXTURES) {
  const key = identityKey(fixture.id, fixture.authoringRevision);
  if (curatedFixturesByIdentity.has(key)) throw new TypeError(`duplicate curated fixture identity: ${key}`);
  curatedFixturesByIdentity.set(key, fixture);
}
for (const item of MATERIALIZED_PLAN36_SUBTRACTIONS) {
  const key = identityKey(item.fixtureId, item.authoringRevision);
  if (curatedFixturesByIdentity.has(key)) throw new TypeError(`duplicate curated fixture identity: ${key}`);
  curatedFixturesByIdentity.set(key, item.fixture);
}
const plan35RecipeContentByIdentity = new Map(PLAN35_ADDITION_RECIPE_RECORDS
  .filter((record) => record.fixtureProfileId)
  .map((record) => {
  const key = identityKey(record.fixtureId, record.authoringRevision);
  const fixture = curatedFixturesByIdentity.get(key);
  return [key, deepFreeze({
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    taskDataId: record.taskDataId,
    taskDataRevision: record.taskDataRevision,
    recipe: { id: record.recipeId, revision: record.patternRevision },
    fixture,
  })];
  }));

/** Exact immutable lookup; this deliberately has no "latest revision" fallback. */
export function resolveCuratedFixture(fixtureId, authoringRevision) {
  if (typeof fixtureId !== 'string' || typeof authoringRevision !== 'string') return null;
  const key = identityKey(fixtureId, authoringRevision);
  return plan18ByIdentity.get(key)?.fixture ?? curatedFixturesByIdentity.get(key) ?? null;
}

/**
 * Resolve one exact authored fixture/task version for every runtime consumer.
 * New records permanently pin their authoring, recipe, and task-data revisions;
 * legacy records retain their original explicit forms and replay identities.
 */
export function resolveAuthoredContent(fixtureId, authoringRevision) {
  if (typeof fixtureId !== 'string' || typeof authoringRevision !== 'string') return null;
  const key = identityKey(fixtureId, authoringRevision);
  const plan18 = plan18ByIdentity.get(key);
  if (plan18) return plan18;
  const materialized = plan32ByIdentity.get(key);
  if (materialized) return materialized;
  const plan20 = plan20ByIdentity.get(key);
  if (plan20) return plan20;
  const sharedFactor = plan19ByIdentity.get(key);
  if (sharedFactor) return sharedFactor;
  const plan35 = plan35RecipeContentByIdentity.get(key);
  if (plan35) return plan35;
  const crossing = plan17ByIdentity.get(key);
  if (crossing) return crossing;
  const plan36 = plan36ByIdentity.get(key);
  if (plan36) return plan36;
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

export function crossingResultStackForIdentity(fixtureId, authoringRevision, targetDenominator) {
  return resolveAuthoredContent(fixtureId, authoringRevision)
    ?.resultStacks?.[String(targetDenominator)] ?? null;
}

export function listPlan32MaterializedContent() {
  return MATERIALIZED_PLAN32_ADDITIONS;
}

export function listPlan19MaterializedContent() {
  return MATERIALIZED_PLAN19_ADDITIONS;
}

export function listPlan17MaterializedContent() {
  return MATERIALIZED_PLAN17_ADDITIONS;
}

export function listPlan36MaterializedContent() {
  return MATERIALIZED_PLAN36_SUBTRACTIONS;
}
