import { convertToDenominator } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { PLAN18_NESTED_ADDITION_RECORDS, practiceSetHasItem } from './data/plan18-nested-addition-records.js';

export const PLAN18_NESTED_DEFINITION_ID = 'phase-3-nested-renaming-addition';
export const PLAN18_NESTED_DEFINITION_REVISION = '1';
const byKey = new Map(PLAN18_NESTED_ADDITION_RECORDS.map((r) => [`${r.fixtureId}@${r.authoringRevision}`, r]));

function fail(message) { const e = new TypeError(`invalid Plan 18 task context: ${message}`); e.code = 'INVALID_NESTED_ADDITION_TASK'; throw e; }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}

export function resolvePlan18TaskContext(instance, { practiceSetId = 'unlike-addition-vetted-set', practiceSetRevision = '6' } = {}) {
  const record = byKey.get(`${instance?.provenance?.fixtureId}@${instance?.provenance?.authoringRevision}`);
  if (!record || practiceSetId !== 'unlike-addition-vetted-set' || practiceSetRevision !== '6'
    || !practiceSetHasItem(practiceSetId, practiceSetRevision, record.itemId)) fail('only the two admitted set@6 records are supported');
  for (const side of ['left', 'right']) {
    if (JSON.stringify(record.sourceForms[side]) !== JSON.stringify(instance.operands?.[side]?.initialForm)) fail(`${side} source form mismatch`);
  }
  const converted = convertToDenominator({ kind: 'fraction', numerator: BigInt(record.sourceForms[record.requiredSide].numerator), denominator: BigInt(record.sourceForms[record.requiredSide].denominator) }, 8n);
  if (converted.denominator.toString() !== '8' || record.targetDenominator !== '8') fail('exact target unit mismatch');
  return deepFreeze({
    practiceSetId, practiceSetRevision, itemId: record.itemId, fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision, definitionId: PLAN18_NESTED_DEFINITION_ID,
    definitionRevision: PLAN18_NESTED_DEFINITION_REVISION, taskDataId: record.taskDataId,
    taskDataRevision: record.taskDataRevision, sourceForms: record.sourceForms, targetDenominator: '8', requiredSide: record.requiredSide,
  });
}

export function validatePlan18TaskContext(instance, context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) fail('exact taskContext required');
  const expected = resolvePlan18TaskContext(instance, { practiceSetId: context.practiceSetId, practiceSetRevision: context.practiceSetRevision });
  const keys = ['practiceSetId', 'practiceSetRevision', 'itemId', 'fixtureId', 'authoringRevision', 'definitionId', 'definitionRevision', 'taskDataId', 'taskDataRevision', 'sourceForms', 'targetDenominator', 'requiredSide'];
  if (JSON.stringify(Object.keys(context).sort()) !== JSON.stringify([...keys].sort())
    || JSON.stringify(stable(context)) !== JSON.stringify(stable(expected))) fail('taskContext does not match exact authored association');
  return expected;
}
