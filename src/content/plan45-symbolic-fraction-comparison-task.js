import {
  compareFractions,
  compareToBenchmark,
  createFraction,
  leastCommonDenominator,
  simplifyFraction,
} from '../math/index.js';
import { deepFreeze } from './schema.js';
import {
  PLAN45_COMPARISON_AUTHORING_REVISION,
  PLAN45_COMPARISON_PRACTICE_SET,
  PLAN45_COMPARISON_RECIPE_ID,
  PLAN45_COMPARISON_RECIPE_REVISION,
  PLAN45_COMPARISON_RECORDS,
  PLAN45_COMPARISON_SET_ID,
  PLAN45_COMPARISON_SET_REVISION,
  PLAN45_COMPARISON_TASK_DATA_ID,
  PLAN45_COMPARISON_TASK_DATA_REVISION,
} from './data/plan45-symbolic-fraction-comparison-records.js';

export const PLAN45_COMPARISON_DEFINITION_ID = 'phase-4-symbolic-fraction-comparison';
export const PLAN45_COMPARISON_DEFINITION_REVISION = '1';
export const PLAN45_COMPARISON_CONDITION_CAPABILITY = Object.freeze({
  id: 'plan45-static-comparison-capability',
  revision: '1',
  unsupportedDisplay: Object.freeze(['D-01-A', 'D-01-B']),
  supportedPromptCadence: Object.freeze(['D-05-focused-key-beats']),
  unsupportedChoreography: Object.freeze(['D-02-M', 'D-02-J', 'D-02-S']),
  unsupportedConnectionMaking: Object.freeze(['CM-01-M', 'CM-01-P']),
  policy: 'static compare->resolve schedule; existing change/side-by-side/step display and choreography semantics do not apply; no reflection or premise condition effect',
});
export function isPlan45ComparisonDefinition(definition) {
  return definition?.id === PLAN45_COMPARISON_DEFINITION_ID
    && definition?.revision === PLAN45_COMPARISON_DEFINITION_REVISION;
}
export const PLAN45_COMPARISON_CUE_IDS = Object.freeze([
  'compare.shared-unit-close',
  'compare.same-denominator',
  'compare.equivalence',
  'compare.complements-to-one',
  'compare.same-count-unit-size',
  'compare.half-benchmark',
]);
export const PLAN45_COMPARISON_REASONING_CUES = Object.freeze({
  'compare.shared-unit-close': 'Try expressing both amounts with the same-size parts.',
  'compare.same-denominator': 'Compare how many equal-size parts each fraction counts.',
  'compare.equivalence': 'Could these two names describe the same amount?',
  'compare.complements-to-one': 'Compare what is missing from one whole in each fraction.',
  'compare.same-count-unit-size': 'Both fractions count the same number of parts. Compare the size of one part.',
  'compare.half-benchmark': 'Could one half separate these two amounts?',
});
export const PLAN45_COMPARISON_NOTATION_CUE = 'The open side faces the greater amount.';
export const PLAN45_MORE_SUPPORT_STRATEGY_CUE = 'Try a benchmark or compare same-size parts.';
export const PLAN45_RELATIONS = Object.freeze(['<', '=', '>']);
export const EXACT_PLAN45_COMPARISON_RECORD_KEYS = Object.freeze([
  'itemId', 'authoringRevision', 'taskDataId', 'taskDataRevision',
  'recipeId', 'recipeRevision', 'sourceForms', 'teachingIntentId', 'cueId',
]);
export const EXACT_PLAN45_COMPARISON_CONTEXT_KEYS = Object.freeze([
  'practiceSetId', 'practiceSetRevision', 'itemId', 'authoringRevision',
  'definitionId', 'definitionRevision', 'recipeId', 'recipeRevision',
  'taskDataId', 'taskDataRevision', 'sourceForms', 'teachingIntentId', 'cueId',
  'hintContext',
]);

function invalid(message) {
  const error = new TypeError(`invalid Plan 45 symbolic comparison task: ${message}`);
  error.code = 'INVALID_PLAN45_COMPARISON_TASK';
  return error;
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function assertExactKeys(value, expected, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || !sameJson(Object.keys(value).sort(), [...expected].sort())) {
    throw invalid(`${label} must contain exactly the registered keys`);
  }
}

function parseSourceForm(form, label) {
  assertExactKeys(form, ['numerator', 'denominator'], label);
  if (typeof form.numerator !== 'string' || !/^[1-9][0-9]*$/.test(form.numerator)
    || typeof form.denominator !== 'string' || !/^[1-9][0-9]*$/.test(form.denominator)) {
    throw invalid(`${label} must use canonical positive integer strings`);
  }
  const numerator = BigInt(form.numerator);
  const denominator = BigInt(form.denominator);
  if (numerator >= denominator) throw invalid(`${label} must be a proper fraction`);
  if (denominator > 10n) throw invalid(`${label} denominator exceeds the first-slice limit of 10`);
  return createFraction(numerator, denominator);
}

function sourceFormsOf(record) {
  assertExactKeys(record.sourceForms, ['first', 'second'], 'sourceForms');
  return {
    first: parseSourceForm(record.sourceForms.first, 'sourceForms.first'),
    second: parseSourceForm(record.sourceForms.second, 'sourceForms.second'),
  };
}

function toWire(value) {
  return { numerator: value.numerator.toString(), denominator: value.denominator.toString() };
}

function normalizedIdentity(sourceForms) {
  const first = simplifyFraction(sourceForms.first);
  const second = simplifyFraction(sourceForms.second);
  return {
    first: toWire(first),
    second: toWire(second),
  };
}

function benchmarkSide(form) {
  const relation = compareToBenchmark(form, 'half');
  return relation < 0 ? 'below' : relation > 0 ? 'above' : 'at';
}

function deriveHintContext(record, sourceForms) {
  if (record.cueId === 'compare.shared-unit-close') {
    return { kind: 'common-unit-target', denominator: leastCommonDenominator(
      sourceForms.first.denominator,
      sourceForms.second.denominator,
    ).toString() };
  }
  if (record.cueId === 'compare.half-benchmark') {
    const firstSide = benchmarkSide(sourceForms.first);
    const secondSide = benchmarkSide(sourceForms.second);
    if (!(firstSide === 'below' && secondSide === 'above')) {
      throw invalid('half-benchmark cue requires exact source values on opposite sides of one half');
    }
    // Keep the cue target, not the per-operand benchmark classification, in the
    // renderer-facing context so this helpful cue cannot reveal the relation.
    return { kind: 'half-benchmark', benchmark: 'half' };
  }
  if (record.cueId === 'compare.same-denominator') {
    return { kind: 'same-denominator', denominator: sourceForms.first.denominator.toString() };
  }
  if (record.cueId === 'compare.same-count-unit-size') {
    return { kind: 'same-count-unit-size', numerator: sourceForms.first.numerator.toString() };
  }
  if (record.cueId === 'compare.complements-to-one') return { kind: 'complements-to-one' };
  if (record.cueId === 'compare.equivalence') return { kind: 'equivalence' };
  throw invalid(`unsupported cueId ${String(record.cueId)}`);
}

export function validatePlan45ComparisonRecord(record) {
  assertExactKeys(record, EXACT_PLAN45_COMPARISON_RECORD_KEYS, 'record');
  if (typeof record.itemId !== 'string' || !/^plan45-compare-[0-9]{2}$/.test(record.itemId)
    || record.authoringRevision !== PLAN45_COMPARISON_AUTHORING_REVISION
    || record.taskDataId !== PLAN45_COMPARISON_TASK_DATA_ID
    || record.taskDataRevision !== PLAN45_COMPARISON_TASK_DATA_REVISION
    || record.recipeId !== PLAN45_COMPARISON_RECIPE_ID
    || record.recipeRevision !== PLAN45_COMPARISON_RECIPE_REVISION) {
    throw invalid('record identity and revisions must match the registered Plan 45 batch');
  }
  if (record.teachingIntentId !== 'compare.symbolic-magnitude') {
    throw invalid('teachingIntentId must identify the adopted symbolic magnitude decision');
  }
  if (!PLAN45_COMPARISON_CUE_IDS.includes(record.cueId)) throw invalid('cueId is not registered');
  const sourceForms = sourceFormsOf(record);
  // Derive exact truth here to reject unsupported values; classification derives
  // it again at response time and this public validated record carries no key.
  compareFractions(sourceForms.first, sourceForms.second);
  if (!recordsById || !sameJson(record, recordsById.get(record.itemId))) {
    throw invalid('record must exactly match the authoritative ordered registry item');
  }
  return deepFreeze({
    record: deepFreeze({ ...record }),
    normalizedIdentity: normalizedIdentity(sourceForms),
    hintContext: deriveHintContext(record, sourceForms),
  });
}

const recordsById = new Map(PLAN45_COMPARISON_RECORDS.map((record) => [record.itemId, record]));

function registeredRecord(itemId) {
  const record = recordsById.get(itemId);
  if (!record) throw invalid(`unknown itemId ${String(itemId)}`);
  return record;
}

export function validatePlan45ComparisonBatch(records = PLAN45_COMPARISON_RECORDS) {
  if (!Array.isArray(records) || records.length !== 12) throw invalid('the initial fixed batch must contain exactly 12 records');
  const validated = records.map((record) => validatePlan45ComparisonRecord(record));
  const itemIds = records.map(({ itemId }) => itemId);
  if (new Set(itemIds).size !== itemIds.length) throw invalid('itemId values must be unique');
  if (!sameJson(itemIds, PLAN45_COMPARISON_PRACTICE_SET.itemIds)) throw invalid('ordered records must match the registered fixed schedule');
  const counts = Object.fromEntries(['less', 'equal', 'greater'].map((relation) => [
    relation,
    validated.filter(({ record }) => {
      const forms = sourceFormsOf(record);
      const order = compareFractions(forms.first, forms.second);
      return (order < 0 ? 'less' : order > 0 ? 'greater' : 'equal') === relation;
    }).length,
  ]));
  if (Object.values(counts).some((count) => count !== 4)) throw invalid('the adopted batch must contain four examples per relation');
  return deepFreeze({
    recordCount: validated.length,
    relationCounts: counts,
    maxSourceDenominator: Math.max(...records.flatMap((record) => [
      Number(record.sourceForms.first.denominator), Number(record.sourceForms.second.denominator),
    ])),
    validated,
  });
}

export function resolvePlan45ComparisonContext(
  itemId,
  { practiceSetId = PLAN45_COMPARISON_SET_ID, practiceSetRevision = PLAN45_COMPARISON_SET_REVISION } = {},
) {
  if (practiceSetId !== PLAN45_COMPARISON_SET_ID || String(practiceSetRevision) !== PLAN45_COMPARISON_SET_REVISION
    || !PLAN45_COMPARISON_PRACTICE_SET.itemIds.includes(itemId)) {
    throw invalid('exact registered practice-set membership is required');
  }
  const record = registeredRecord(itemId);
  const checked = validatePlan45ComparisonRecord(record);
  const context = {
    practiceSetId,
    practiceSetRevision: String(practiceSetRevision),
    itemId: record.itemId,
    authoringRevision: record.authoringRevision,
    definitionId: PLAN45_COMPARISON_DEFINITION_ID,
    definitionRevision: PLAN45_COMPARISON_DEFINITION_REVISION,
    recipeId: record.recipeId,
    recipeRevision: record.recipeRevision,
    taskDataId: record.taskDataId,
    taskDataRevision: record.taskDataRevision,
    sourceForms: record.sourceForms,
    teachingIntentId: record.teachingIntentId,
    cueId: record.cueId,
    hintContext: checked.hintContext,
  };
  return deepFreeze(context);
}

export function validatePlan45ComparisonContext(context) {
  assertExactKeys(context, EXACT_PLAN45_COMPARISON_CONTEXT_KEYS, 'context');
  const expected = resolvePlan45ComparisonContext(context.itemId, {
    practiceSetId: context.practiceSetId,
    practiceSetRevision: context.practiceSetRevision,
  });
  if (!sameJson(context, expected)) throw invalid('context does not match its authoritative ordered item record');
  return expected;
}

export function plan45ComparisonHelpText(context, helpKind) {
  const valid = validatePlan45ComparisonContext(context);
  if (helpKind === 'notation') return PLAN45_COMPARISON_NOTATION_CUE;
  if (helpKind !== 'reasoning') throw invalid('helpKind must be reasoning or notation');
  if (valid.hintContext.kind === 'common-unit-target') {
    return `Try expressing both amounts with ${valid.hintContext.denominator} same-size parts.`;
  }
  return PLAN45_COMPARISON_REASONING_CUES[valid.cueId];
}

export function listPlan45ComparisonRecords() {
  return PLAN45_COMPARISON_RECORDS;
}

export function getPlan45ComparisonRecord(itemId) {
  const record = registeredRecord(itemId);
  validatePlan45ComparisonRecord(record);
  return record;
}
