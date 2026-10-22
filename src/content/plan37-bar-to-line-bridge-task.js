import {
  benchmarkFraction,
  classifyMagnitude,
  compareFractions,
  createFraction,
  equalFractions,
  leastCommonDenominator,
  subtractFractions,
} from '../math/index.js';
import { deepFreeze, fractionToWire } from './schema.js';
import {
  PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION,
  PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_ID,
  PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_REVISION,
  PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_ID,
  PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_REVISION,
  PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID,
  PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_REVISION,
  PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_DEFINITION_REVISION,
  PLAN37_BAR_TO_LINE_BRIDGE_RECORDS,
  PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID,
  PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION,
} from './data/plan37-bar-to-line-bridge-records.js';

export { PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET } from './data/plan37-bar-to-line-bridge-records.js';

const RECORD_KEYS = Object.freeze([
  'itemId', 'fixtureId', 'authoringRevision', 'taskDataId', 'taskDataRevision',
  'recipe', 'sourceForm', 'partitionDenominator', 'sparseCandidates',
]);
export const EXACT_PLAN37_BAR_TO_LINE_CONTEXT_KEYS = Object.freeze([
  'practiceSetId', 'practiceSetRevision', 'itemId', 'fixtureId', 'authoringRevision',
  'definitionId', 'definitionRevision', 'taskDataId', 'taskDataRevision',
  'recipeId', 'recipeRevision', 'sourceForm', 'partitionDenominator',
  'sparseCandidates', 'supportMode',
]);
const INSTANCE_KEYS = Object.freeze([
  'schemaVersion', 'id', 'source', 'provenance', 'sourceForm', 'representationFacts',
]);
const SUPPORT_MODES = Object.freeze(['partitioned', 'sparse-benchmarks']);
const WIRE_KEYS = Object.freeze(['kind', 'numerator', 'denominator']);

function exactKeys(value, expected, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be a plain record`);
  const actual = Object.keys(value).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort())) throw new TypeError(`${name} has unsupported keys`);
}

function wireFraction(value, name) {
  exactKeys(value, WIRE_KEYS, name);
  if (value.kind !== 'fraction' || typeof value.numerator !== 'string'
    || !/^(0|[1-9][0-9]*)$/.test(value.numerator)
    || typeof value.denominator !== 'string' || !/^[1-9][0-9]*$/.test(value.denominator)) {
    throw new TypeError(`${name} must be a canonical nonnegative wire fraction`);
  }
  return createFraction(BigInt(value.numerator), BigInt(value.denominator));
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function recordFor(itemId, fixtureId, authoringRevision) {
  const records = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS.filter((record) => (
    record.itemId === itemId && record.fixtureId === fixtureId
      && record.authoringRevision === authoringRevision
  ));
  return records.length === 1 ? records[0] : null;
}

export function classifyPlan37BenchmarkRelation(form) {
  const value = wireFraction(form, 'candidate form');
  if (compareFractions(value, benchmarkFraction('zero')) < 0
    || compareFractions(value, benchmarkFraction('one')) > 0) {
    throw new RangeError('number-line candidate must be within [0,1]');
  }
  const magnitude = classifyMagnitude(value);
  if (magnitude.benchmarkRegion === 'exact-zero') return 'exact-zero';
  if (magnitude.benchmarkRegion === 'exact-half') return 'exact-half';
  if (magnitude.benchmarkRegion === 'exact-one') return 'exact-one';
  if (magnitude.benchmarkRegion === 'between-0-and-half') {
    const comparison = compareFractions(value, subtractFractions(benchmarkFraction('half'), value));
    if (comparison === 0) return 'between-0-and-half/midway';
    const nearer = comparison < 0 ? 'zero' : 'half';
    return `between-0-and-half/closer-to-${nearer}`;
  }
  if (magnitude.benchmarkRegion === 'between-half-and-1') {
    const fromHalf = subtractFractions(value, benchmarkFraction('half'));
    const fromOne = subtractFractions(benchmarkFraction('one'), value);
    const comparison = compareFractions(fromHalf, fromOne);
    if (comparison === 0) return 'between-half-and-1/midway';
    const nearer = comparison < 0 ? 'half' : 'one';
    return `between-half-and-1/closer-to-${nearer}`;
  }
  throw new RangeError('number-line candidate is outside the unit interval');
}

export function validatePlan37BarToLineBridgeRecord(record) {
  exactKeys(record, RECORD_KEYS, 'bridge record');
  if (typeof record.itemId !== 'string' || typeof record.fixtureId !== 'string'
    || record.authoringRevision !== PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION
    || record.taskDataId !== PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID
    || record.taskDataRevision !== PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION
    || !same(record.recipe, { id: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID, revision: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_REVISION })) {
    throw new TypeError('bridge record identity/revision is not registered');
  }
  exactKeys(record.recipe, ['id', 'revision'], 'bridge record recipe');
  const target = wireFraction(record.sourceForm, 'bridge sourceForm');
  const denominator = record.partitionDenominator;
  if (typeof denominator !== 'string' || !/^[1-9][0-9]*$/.test(denominator)
    || !['2', '3', '4', '6', '8'].includes(denominator)) {
    throw new TypeError('partition denominator is outside the adopted support set');
  }
  if (!Array.isArray(record.sparseCandidates) || record.sparseCandidates.length !== 4) {
    throw new TypeError('exactly four sparse candidates are required');
  }
  const expectedIds = ['candidate-a', 'candidate-b', 'candidate-c', 'candidate-d'];
  const forms = [];
  record.sparseCandidates.forEach((candidate, index) => {
    exactKeys(candidate, ['id', 'form'], `sparse candidate ${index}`);
    if (candidate.id !== expectedIds[index]) throw new TypeError('sparse candidates must use ordered registered ids');
    forms.push(wireFraction(candidate.form, `sparse candidate ${index} form`));
    classifyPlan37BenchmarkRelation(candidate.form);
  });
  for (let index = 0; index < forms.length; index += 1) {
    for (let other = index + 1; other < forms.length; other += 1) {
      if (equalFractions(forms[index], forms[other])) throw new TypeError('sparse candidate coordinates must be unique');
    }
  }
  if (!forms.some((form) => equalFractions(form, target))) throw new TypeError('source amount must be one offered sparse candidate');
  return true;
}

export function materializePlan37BarToLineBridgeInstance(record) {
  validatePlan37BarToLineBridgeRecord(record);
  const registered = recordFor(record.itemId, record.fixtureId, record.authoringRevision);
  if (!registered || !same(registered, record)) throw new TypeError('bridge record does not match the authoritative registry');
  const instance = {
    schemaVersion: 'fractionflow.bridge-instance/v1',
    id: `curated-plan37-${record.itemId}`,
    source: 'curated',
    provenance: {
      fixtureId: record.fixtureId,
      authoringRevision: record.authoringRevision,
      itemId: record.itemId,
    },
    sourceForm: record.sourceForm,
    representationFacts: {
      domain: { lowerWhole: '0', upperWhole: '1' },
      eligibility: { fractionBar: 'eligible', numberLine: 'eligible', symbolic: 'eligible' },
      alternateRepresentationRecommendation: 'none',
    },
  };
  exactKeys(instance, INSTANCE_KEYS, 'bridge instance');
  return deepFreeze(instance);
}

export function validatePlan37BarToLineBridgeInstance(instance) {
  exactKeys(instance, INSTANCE_KEYS, 'bridge instance');
  if (instance.schemaVersion !== 'fractionflow.bridge-instance/v1' || instance.source !== 'curated'
    || instance.id !== `curated-plan37-${instance.provenance?.itemId}`) {
    throw new TypeError('bridge instance identity is invalid');
  }
  exactKeys(instance.provenance, ['fixtureId', 'authoringRevision', 'itemId'], 'bridge instance provenance');
  const record = recordFor(instance.provenance.itemId, instance.provenance.fixtureId, instance.provenance.authoringRevision);
  if (!record) throw new TypeError('bridge instance is not registered');
  const expected = materializePlan37BarToLineBridgeInstance(record);
  if (!same(instance, expected)) throw new TypeError('bridge instance does not match authoritative registry');
  return expected;
}

export function resolvePlan37BarToLineBridgeInstance(itemId, authoringRevision = PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION) {
  const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS.find((entry) => entry.itemId === itemId
    && entry.authoringRevision === authoringRevision);
  if (!record) return null;
  return materializePlan37BarToLineBridgeInstance(record);
}

export function resolvePlan37BarToLineBridgeContext(instance, itemId, {
  practiceSetId = PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_ID,
  practiceSetRevision = PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_REVISION,
  definitionRevision = PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_REVISION,
  supportMode = 'partitioned',
} = {}) {
  const content = validatePlan37BarToLineBridgeInstance(instance);
  const record = recordFor(itemId, content.provenance.fixtureId, content.provenance.authoringRevision);
  if (!record || !['partitioned', 'sparse-benchmarks'].includes(supportMode)
    || practiceSetId !== PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_ID
    || String(practiceSetRevision) !== PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_REVISION
    || ![PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_REVISION, PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_DEFINITION_REVISION].includes(String(definitionRevision))) {
    throw new TypeError('exact bridge set membership and support mode are required');
  }
  const context = {
    practiceSetId,
    practiceSetRevision: String(practiceSetRevision),
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    definitionId: PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_ID,
    definitionRevision: String(definitionRevision),
    taskDataId: record.taskDataId,
    taskDataRevision: record.taskDataRevision,
    recipeId: record.recipe.id,
    recipeRevision: record.recipe.revision,
    sourceForm: record.sourceForm,
    partitionDenominator: record.partitionDenominator,
    sparseCandidates: record.sparseCandidates,
    supportMode,
  };
  return deepFreeze(context);
}

export function validatePlan37BarToLineBridgeContext(instance, context, expectedSupportMode = context?.supportMode) {
  exactKeys(context, EXACT_PLAN37_BAR_TO_LINE_CONTEXT_KEYS, 'bridge task context');
  if (!SUPPORT_MODES.includes(expectedSupportMode) || context.supportMode !== expectedSupportMode) {
    throw new TypeError('bridge support mode does not match the active support configuration');
  }
  const expected = resolvePlan37BarToLineBridgeContext(instance, context.itemId, {
    practiceSetId: context.practiceSetId,
    practiceSetRevision: context.practiceSetRevision,
    definitionRevision: context.definitionRevision,
    supportMode: expectedSupportMode,
  });
  if (!same(context, expected)) throw new TypeError('bridge task context does not match authoritative registry');
  return expected;
}

export function isPlan37BarToLineBridgeDefinition(definition) {
  return definition?.id === PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_ID
    && definition?.revision === PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_REVISION;
}

export function isPlan37BarToLineBridgeRepairDefinition(definition) {
  return definition?.id === PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_ID
    && definition?.revision === PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_DEFINITION_REVISION;
}

export function isPlan37BarToLineBridgeTaskDefinition(definition) {
  return isPlan37BarToLineBridgeDefinition(definition) || isPlan37BarToLineBridgeRepairDefinition(definition);
}

export function plan37ExactLocationScale(context) {
  if (!context || !SUPPORT_MODES.includes(context.supportMode)) throw new TypeError('validated Plan 39 support context is required');
  const candidateForms = context.supportMode === 'partitioned'
    ? Array.from({ length: Number(context.partitionDenominator) + 1 }, (_, stepIndex) => ({
      id: `partition-${stepIndex}-of-${context.partitionDenominator}`,
      form: { kind: 'fraction', numerator: String(stepIndex), denominator: context.partitionDenominator },
    }))
    : context.sparseCandidates;
  const scale = context.supportMode === 'partitioned'
    ? BigInt(context.partitionDenominator)
    : leastCommonDenominator(...candidateForms.map(({ form }) => BigInt(form.denominator)));
  if (scale < 1n || scale > 8n) throw new RangeError('Plan 39 exact location scale exceeds the registered maximum of 8');
  const positions = candidateForms.map((candidate, index) => {
    const denominator = BigInt(candidate.form.denominator);
    if (scale % denominator !== 0n) throw new RangeError('Plan 39 exact location scale does not represent an offered candidate');
    const unitsFromZero = BigInt(candidate.form.numerator) * (scale / denominator);
    if (unitsFromZero < 0n || unitsFromZero > scale) throw new RangeError('Plan 39 candidate is outside the unit interval');
    const letter = String.fromCharCode(65 + index);
    return {
      id: candidate.id,
      form: candidate.form,
      stepIndex: context.supportMode === 'partitioned' ? index : index + 1,
      totalSteps: context.supportMode === 'partitioned' ? Number(context.partitionDenominator) : candidateForms.length,
      unitsFromZero: unitsFromZero.toString(),
      totalUnits: scale.toString(),
      letter,
      description: context.supportMode === 'partitioned'
        ? `Step ${unitsFromZero} of ${scale} equal steps from 0`
        : `${letter}: ${unitsFromZero} of ${scale} equal steps from 0`,
      benchmarkRelation: classifyPlan37BenchmarkRelation(candidate.form),
    };
  });
  if (new Set(positions.map(({ unitsFromZero }) => unitsFromZero)).size !== positions.length) {
    throw new RangeError('Plan 39 exact offered locations must be unique');
  }
  return deepFreeze({
    totalUnits: scale.toString(),
    partitionHasHalfPoint: context.supportMode === 'partitioned' && scale % 2n === 0n,
    scaleDescription: `0 to 1 has ${scale} equal steps.`,
    positions,
  });
}

export function plan37SourceFraction(instance) {
  const valid = validatePlan37BarToLineBridgeInstance(instance);
  return createFraction(BigInt(valid.sourceForm.numerator), BigInt(valid.sourceForm.denominator));
}

export function plan37WireForm(form) {
  return fractionToWire(createFraction(BigInt(form.numerator), BigInt(form.denominator)));
}
