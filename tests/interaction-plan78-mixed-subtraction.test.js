import { describe,it,expect } from 'vitest';
import { PLAN78_RECORDS, admitPlan78Record, resolvePlan78Context, validatePlan78Operands, validatePlan78Batch } from '../src/content/plan78-mixed-subtraction-task.js';
import { PLAN78_DATA, PLAN78_SET_V1 } from '../src/content/data/plan78-mixed-subtraction.js';
import { PLAN78_ID, createPlan78Episode, applyPlan78Intent, plan78IntentContext } from '../src/interaction/plan78-mixed-subtraction-episode.js';
import { projectPlan78Subtraction } from '../src/interaction/plan78-mixed-subtraction-scene.js';
const definition={id:PLAN78_ID,revision:'1'};
const start=i=>createPlan78Episode({episodeDefinition:definition,taskContext:resolvePlan78Context(PLAN78_RECORDS[i].itemId)});
const send=(s,type,fields={})=>applyPlan78Intent(s,{type,context:plan78IntentContext(s),...fields});
const edit=(s,field,raw)=>send(s,'edit-mixed-subtraction',{field,raw});
const check=s=>send(s,'check-mixed-subtraction',{revision:s.draftRevision});
describe('Plan 78 task boundary',()=>{
  it('admits only the ordered registered records and derives the exact source-form results',()=>{
    expect(PLAN78_RECORDS.map(r=>{const {result}=admitPlan78Record(r);return [String(result.whole),String(result.fraction.numerator),String(result.fraction.denominator)];})).toEqual([['2','3','8'],['2','0','8'],['1','4','8'],['1','0','8']]);
    expect(validatePlan78Batch(PLAN78_DATA,PLAN78_SET_V1)).toEqual([]);
    expect(()=>admitPlan78Record({...PLAN78_RECORDS[0],itemId:'other'})).toThrow();
    expect(()=>validatePlan78Operands({operands:[{whole:'3',numerator:'2',denominator:'8'},{whole:'1',numerator:'5',denominator:'8'}]})).toThrow();
    expect(validatePlan78Batch([...PLAN78_DATA,PLAN78_DATA[0]],PLAN78_SET_V1).length).toBeGreaterThan(0);
  });
  it('distinguishes missing, invalid, unequal and equal unorganized drafts while retaining edits and help',()=>{
    let s=start(1);s=check(s);expect(s.evaluation.fields.whole.status).toBe('missing');
    s=send(s,'request-mixed-subtraction-help',{helpKind:'unit'});s=edit(edit(s,'whole','1'),'pieces','8');s=check(s);expect(s.evaluation.status).toBe('organize');
    s=edit(s,'pieces','11');expect(s.draft.whole).toBe('1');expect(s.evaluation.status).toBe('unchecked');s=check(s);expect(s.evaluation.fields.pieces.status).toBe('out-of-range');
    s=edit(s,'pieces','x');s=check(s);expect(s.evaluation.fields.pieces.status).toBe('malformed');
    s=edit(s,'pieces','0');s=check(s);expect(s.evaluation.status).toBe('incorrect');expect(s.assistanceHistory).toHaveLength(1);
    expect(()=>send(s,'check-mixed-subtraction',{revision:0})).toThrow();
    s=edit(s,'whole','2');s=check(s);expect(s.status).toBe('resolved');expect(s.responseProvenance[0].assistanceHistory).toHaveLength(1);
  });
  it('withholds settled data until acceptance and accounts for removal, remainder and empty cells',()=>{
    for(const [i,w,p] of [[0,'2','3'],[1,'2','0'],[2,'1','4'],[3,'1','0']]){
      let s=start(i);expect(projectPlan78Subtraction(s).settled).toBeNull();s=check(edit(edit(s,'whole',w),'pieces',p));
      const v=projectPlan78Subtraction(s).settled, [a,b]=PLAN78_RECORDS[i].operands;
      expect(v.wholeCells.filter(x=>x==='removed')).toHaveLength(Number(b.whole));
      expect(v.wholeCells.filter(x=>x==='remaining')).toHaveLength(Number(w));
      expect(v.pieceCells.filter(x=>x==='removed')).toHaveLength(Number(b.numerator));
      expect(v.pieceCells.filter(x=>x==='remaining')).toHaveLength(Number(p));
      expect(v.pieceCells.filter(x=>x==='empty')).toHaveLength(8-Number(a.numerator));
      expect(v.notation.remainder.denominator).toBe('8');
    }
  });
});
