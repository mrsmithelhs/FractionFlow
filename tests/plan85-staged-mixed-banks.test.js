import { describe, it, expect } from 'vitest';
import { PLAN74_DATA, PLAN74_SET_V1 } from '../src/content/data/plan74-mixed-addition.js';
import { PLAN78_DATA, PLAN78_SET_V1 } from '../src/content/data/plan78-mixed-subtraction.js';
import { PLAN82_DATA, PLAN82_SET_V1 } from '../src/content/data/plan82-mixed-subtraction.js';
import { PLAN74_RECORDS, validatePlan74Batch, resolvePlan74Context } from '../src/content/plan74-mixed-addition-task.js';
import { PLAN78_RECORDS, validatePlan78Batch, resolvePlan78Context } from '../src/content/plan78-mixed-subtraction-task.js';
import { PLAN82_RECORDS, validatePlan82Batch, resolvePlan82Context } from '../src/content/plan82-mixed-subtraction-task.js';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';

const cases = [
  { name:'regrouping addition', data:PLAN74_DATA, set:PLAN74_SET_V1, live:PLAN74_RECORDS, validate:validatePlan74Batch, resolve:resolvePlan74Context, type:'mixed-number-addition-with-regrouping', count:2, commutative:true },
  { name:'subtraction without decomposition', data:PLAN78_DATA, set:PLAN78_SET_V1, live:PLAN78_RECORDS, validate:validatePlan78Batch, resolve:resolvePlan78Context, type:'mixed-number-subtraction-without-decomposition', count:4 },
  { name:'subtraction with decomposition', data:PLAN82_DATA, set:PLAN82_SET_V1, live:PLAN82_RECORDS, validate:validatePlan82Batch, resolve:resolvePlan82Context, type:'mixed-number-subtraction-with-decomposition', count:4 },
];
const key = (record, commutative) => {
  const parts=record.operands.map(o=>o.join('/'));
  return (commutative ? parts.sort() : parts).join('|');
};

describe('Plan 85 staged mixed-number banks', () => {
  it.each(cases)('$name: validates every record, rejects duplicates and leaves the live set unchanged', ({data,set,live,validate,resolve,type,count,commutative}) => {
    expect(data).toHaveLength(30);
    expect(validate(data,set)).toEqual([]);
    expect(new Set(data.map(r=>key(r,commutative))).size).toBe(30);
    const expected=set.items.map(item=>item.itemId);
    expect(expected).toEqual(Array.from({length:count},(_,i)=>`${data[0].itemId.slice(0,-2)}${String(i+1).padStart(2,'0')}`));
    expect(live.map(item=>item.itemId)).toEqual(expected);
    expect(PRACTICE_TYPES.find(item=>item.id===type).items.map(item=>item.id)).toEqual(expected);
    for (const record of data.slice(count)) expect(()=>resolve(record.itemId)).toThrow();
    expect(validate([...data,structuredClone(data[0])],set).length).toBeGreaterThan(0);
    const malformed=structuredClone(data); malformed.at(-1).operands[0][2]='7';
    expect(validate(malformed,set).length).toBeGreaterThan(0);
    const missing=structuredClone(set); missing.items[0].itemId='not-registered';
    expect(validate(data,missing).length).toBeGreaterThan(0);
  });
});
