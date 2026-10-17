import { convertToDenominator, equalFractions } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { PLAN34_FULL_ADDITION_TASK_RECORDS } from './data/plan34-full-addition-task-records.js';
import { practiceSetHasItem } from './data/plan18-nested-addition-records.js';

export const FULL_ADDITION_CONSTRUCT_PATTERN = deepFreeze({ id: 'full-addition.construct-equivalent', revision: '1' });
export const FULL_ADDITION_INSPECT_PATTERN = deepFreeze({ id: 'full-addition.inspect-keep-repair', revision: '1' });
export const PLAN34_EPISODE_DEFINITION_ID = 'phase-3-reusable-full-addition';
export const PLAN34_EPISODE_DEFINITION_REVISION = '1';

const recordsByIdentity = new Map(PLAN34_FULL_ADDITION_TASK_RECORDS.map((record) => [
  `${record.fixtureId}@${record.authoringRevision}`, record,
]));

function taskError(message) {
  const error = new TypeError(`invalid Plan 34 task context: ${message}`);
  error.code = 'INVALID_FULL_ADDITION_TASK';
  return error;
}

export function getPlan34Pattern(id, revision) {
  return [FULL_ADDITION_CONSTRUCT_PATTERN, FULL_ADDITION_INSPECT_PATTERN]
    .find((pattern) => pattern.id === id && pattern.revision === revision) ?? null;
}

export function deriveRequiredConversionSides(instance, targetDenominator) {
  if (!/^[1-9][0-9]*$/.test(String(targetDenominator))) throw taskError('target denominator must be a positive integer string');
  const target = BigInt(targetDenominator);
  return ['left', 'right'].filter((side) => {
    const source = instance?.operands?.[side]?.initialForm;
    if (!source) throw taskError(`missing ${side} source form`);
    const converted = convertToDenominator({ kind: 'fraction', numerator: BigInt(source.numerator), denominator: BigInt(source.denominator) }, target);
    return converted.denominator.toString() !== source.denominator;
  });
}

export function resolvePlan34TaskContext(instance, patternId, patternRevision, targetDenominator = '12', { allowCompatibilityPair = false, practiceSetRevision = '5' } = {}) {
  const pattern = getPlan34Pattern(patternId, patternRevision);
  if (!pattern) throw taskError('unknown pattern identity');
  if (String(targetDenominator) !== '12') throw taskError('only the authored target 12 is supported');
  const record = recordsByIdentity.get(`${instance?.provenance?.fixtureId}@${instance?.provenance?.authoringRevision}`);
  if (!record
    || record.targetDenominator !== String(targetDenominator)) throw taskError('unsupported item, content revision, or target');
  for (const side of ['left', 'right']) {
    if (JSON.stringify(record.sourceForms[side]) !== JSON.stringify(instance.operands?.[side]?.initialForm)) {
      throw taskError(`${side} source form does not match the admitted authored fixture`);
    }
  }
  if (!allowCompatibilityPair) {
    if (pattern.id !== record.livePatternId) throw taskError('pattern is incompatible with the fixed live association');
    if (!['5', '6'].includes(String(practiceSetRevision))) throw taskError('Plan 34 live records require selected set revision 5 or 6');
    if (!practiceSetHasItem('unlike-addition-vetted-set', String(practiceSetRevision), record.itemId)) throw taskError('item is not a member of the selected immutable practice set revision');
  }
  const sides = deriveRequiredConversionSides(instance, targetDenominator);
  if (sides.length !== 2) throw taskError('authored compact addition currently requires both converted operands');
  const candidates = pattern.id === FULL_ADDITION_INSPECT_PATTERN.id ? record.candidates : null;
  if (candidates) {
    for (const side of sides) {
      const candidate = candidates[side];
      if (!candidate || candidate.kind !== 'fraction' || candidate.denominator !== String(targetDenominator)
        || !/^(0|[1-9][0-9]*)$/.test(candidate.numerator)
        || BigInt(candidate.numerator) > BigInt(targetDenominator)) throw taskError(`invalid ${side} candidate`);
    }
  }
  return deepFreeze({
    practiceSetId: allowCompatibilityPair ? null : 'unlike-addition-vetted-set',
    practiceSetRevision: allowCompatibilityPair ? null : String(practiceSetRevision),
    itemId: record.itemId, fixtureId: record.fixtureId, authoringRevision: record.authoringRevision,
    definitionId: PLAN34_EPISODE_DEFINITION_ID, definitionRevision: PLAN34_EPISODE_DEFINITION_REVISION,
    patternId: pattern.id, patternRevision: pattern.revision, targetDenominator: String(targetDenominator),
    taskDataId: record.taskDataId, taskDataRevision: record.taskDataRevision,
    stimulusId: candidates ? `plan34-${record.itemId}-inspect-candidate` : null,
    stimulusRevision: candidates ? '1' : null,
    candidates,
    requiredSides: sides,
  });
}

export function validatePlan34TaskContext(instance, context, { allowCompatibilityPair = false } = {}) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) throw taskError('taskContext is required');
  const expected = resolvePlan34TaskContext(instance, context.patternId, context.patternRevision, context.targetDenominator, { allowCompatibilityPair, practiceSetRevision: context.practiceSetRevision ?? '5' });
  for (const key of Object.keys(expected)) {
    if (JSON.stringify(context[key]) !== JSON.stringify(expected[key])) throw taskError(`${key} does not match the immutable authored association`);
  }
  if (Object.keys(context).length !== Object.keys(expected).length) throw taskError('taskContext has an unsupported shape');
  return expected;
}

export function isEquivalentAtTarget(instance, side, form, targetDenominator) {
  const source = instance.operands[side].initialForm;
  const target = convertToDenominator({ kind: 'fraction', numerator: BigInt(source.numerator), denominator: BigInt(source.denominator) }, BigInt(targetDenominator));
  return equalFractions(target, { numerator: BigInt(form.numerator), denominator: BigInt(form.denominator) });
}
