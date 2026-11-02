import { compareFractions, createFraction, subtractFractions } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { PLAN51_DISTANCE_RECORDS } from './data/plan51-distance-records.js';

export const PLAN51_IDENTITY = deepFreeze({
  setId: 'fraction-distance', setRevision: '1',
  definitionId: 'phase-4-fraction-distance', definitionRevision: '1',
  recipeId: 'common-unit-distance', recipeRevision: '1',
});

const keys = (value, expected) => value && typeof value === 'object' && !Array.isArray(value)
  && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const invalid = message => { throw new TypeError(`invalid distance content: ${message}`); };

export function admitPlan51Record(record) {
  if (!keys(record, ['itemId', 'itemRevision', 'sourceForms'])
    || typeof record.itemId !== 'string' || !/^distance-[a-z0-9-]+$/.test(record.itemId) || record.itemRevision !== '1'
    || !keys(record.sourceForms, ['first', 'second'])) invalid('record shape or identity');
  const forms = ['first', 'second'].map(side => {
    const form = record.sourceForms[side];
    if (!keys(form, ['numerator', 'denominator']) || typeof form.numerator !== 'string' || typeof form.denominator !== 'string' || !/^[1-9]$/.test(form.numerator)
      || !/^[68]$/.test(form.denominator)) invalid('source form');
    const fraction = createFraction(BigInt(form.numerator), BigInt(form.denominator));
    if (fraction.numerator >= fraction.denominator) invalid('source must be proper');
    return fraction;
  });
  if (forms[0].denominator !== forms[1].denominator) invalid('different source units');
  const order = compareFractions(forms[0], forms[1]);
  if (order === 0) invalid('equal sources not admitted');
  const distance = subtractFractions(order > 0 ? forms[0] : forms[1], order > 0 ? forms[1] : forms[0]);
  return deepFreeze({ relation: order < 0 ? '<' : '>', distance,
    range: { start: Number(order < 0 ? forms[0].numerator : forms[1].numerator),
      end: Number(order > 0 ? forms[0].numerator : forms[1].numerator), denominator: Number(forms[0].denominator) } });
}

export function resolvePlan51Context(itemId) {
  const record = PLAN51_DISTANCE_RECORDS.find(candidate => candidate.itemId === itemId);
  if (!record) invalid('unknown item');
  admitPlan51Record(record);
  return deepFreeze({ ...PLAN51_IDENTITY, ...structuredClone(record) });
}

export function validatePlan51Context(context) {
  if (!keys(context, [...Object.keys(PLAN51_IDENTITY), 'itemId', 'itemRevision', 'sourceForms'])) invalid('context shape');
  const expected = resolvePlan51Context(context.itemId);
  if (JSON.stringify(canonical(context)) !== JSON.stringify(canonical(expected))) invalid('unregistered or changed context');
  return expected;
}
