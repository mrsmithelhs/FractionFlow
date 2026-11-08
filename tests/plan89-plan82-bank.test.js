import { describe, it, expect } from 'vitest';
import { PLAN82_DATA, PLAN82_SET_V1, PLAN82_SET_V2 } from '../src/content/data/plan82-mixed-subtraction.js';
import { PLAN82_RECORDS, PLAN82_RECORDS_V2, PLAN82_IDENTITY, admitPlan82Record, validatePlan82Batch, validatePlan82Operands, resolvePlan82Context, validatePlan82Context } from '../src/content/plan82-mixed-subtraction-task.js';

const ids=Array.from({length:30},(_,i)=>`plan82-subtract-${String(i+1).padStart(2,'0')}`);
const asRecord=([itemId,itemRevision,operands])=>({itemId,itemRevision,operands:operands.map(([whole,numerator,denominator])=>({whole,numerator,denominator}))});

describe('Plan 89 Plan 82 versioned bank',()=>{
  it('keeps exact v1 membership and publishes the explicit 30-item v2 bank',()=>{
    expect(PLAN82_SET_V1.items.map(x=>x.itemId)).toEqual(ids.slice(0,4));
    expect(PLAN82_RECORDS.map(x=>x.itemId)).toEqual(ids.slice(0,4));
    expect(PLAN82_SET_V2.items.map(x=>x.itemId)).toEqual(ids);
    expect(PLAN82_SET_V2.items.slice(0,4)).toEqual(PLAN82_SET_V1.items);
    expect(PLAN82_SET_V2.items.every(x=>x.itemRevision==='1')).toBe(true);
    expect(PLAN82_RECORDS_V2.map(x=>x.itemId)).toEqual(ids);
    expect(validatePlan82Batch(PLAN82_DATA,PLAN82_SET_V1)).toEqual([]);
    expect(validatePlan82Batch(PLAN82_DATA,PLAN82_SET_V2)).toEqual([]);
  });

  it('admits 30 unique ordered operand pairs and validates their original bounds and math',()=>{
    expect(PLAN82_DATA).toHaveLength(30);
    expect(new Set(PLAN82_DATA.map(r=>JSON.stringify(r.operands))).size).toBe(30);
    for (const data of PLAN82_DATA) {
      const r=asRecord([data.itemId,data.itemRevision,data.operands]);
      expect(()=>admitPlan82Record(r)).not.toThrow();
      const {renamed,result}=validatePlan82Operands(r);
      expect(result.whole).toBeGreaterThanOrEqual(0n);
      expect(result.whole).toBeLessThanOrEqual(3n);
      expect(renamed.fraction.numerator).toBeGreaterThanOrEqual(8n);
    }
    expect(PLAN82_RECORDS_V2.map(admitPlan82Record).filter(x=>x.result.whole===0n).length).toBeGreaterThan(0);
    expect(PLAN82_RECORDS_V2.map(admitPlan82Record).filter(x=>x.result.whole>0n).length).toBeGreaterThan(0);
  });

  it('preserves default historical v1 resolution and resolves v2 identities explicitly',()=>{
    expect(PLAN82_IDENTITY.setRevision).toBe('1');
    for (const itemId of ids.slice(0,4)) expect(resolvePlan82Context(itemId)).toEqual(resolvePlan82Context(itemId,{setId:PLAN82_IDENTITY.setId,setRevision:'1'}));
    for (const itemId of ids) {
      const ctx=resolvePlan82Context(itemId,{setId:PLAN82_IDENTITY.setId,setRevision:'2'});
      expect(ctx).toMatchObject({setId:PLAN82_IDENTITY.setId,setRevision:'2',itemId,itemRevision:'1'});
      expect(validatePlan82Context(ctx)).toEqual(ctx);
    }
    expect(()=>resolvePlan82Context(ids[4])).toThrow();
  });

  it('rejects unknown identities, unsupported revisions, foreign sets and cross-membership',()=>{
    expect(()=>resolvePlan82Context('missing',{setId:PLAN82_IDENTITY.setId,setRevision:'2'})).toThrow();
    expect(()=>resolvePlan82Context(ids[0],{setId:'foreign-set',setRevision:'2'})).toThrow();
    expect(()=>resolvePlan82Context(ids[0],{setId:PLAN82_IDENTITY.setId,setRevision:'3'})).toThrow();
    expect(()=>resolvePlan82Context(ids[4],{setId:PLAN82_IDENTITY.setId,setRevision:'1'})).toThrow();
    const wrongRevision={...resolvePlan82Context(ids[4],{setId:PLAN82_IDENTITY.setId,setRevision:'2'}),setRevision:'1'};
    expect(()=>validatePlan82Context(wrongRevision)).toThrow();
    const wrongSet={...resolvePlan82Context(ids[0]),setId:'foreign-set'};
    expect(()=>validatePlan82Context(wrongSet)).toThrow();
  });
});
