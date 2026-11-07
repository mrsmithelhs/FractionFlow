import { describe,it,expect } from 'vitest';
import { PLAN82_RECORDS,admitPlan82Record,resolvePlan82Context,validatePlan82Operands,validatePlan82Batch } from '../src/content/plan82-mixed-subtraction-task.js';
import { PLAN82_DATA,PLAN82_SET_V1 } from '../src/content/data/plan82-mixed-subtraction.js';
import { PLAN82_ID,createPlan82Episode,applyPlan82Intent,plan82IntentContext } from '../src/interaction/plan82-mixed-subtraction-episode.js';
import { projectPlan82Subtraction } from '../src/interaction/plan82-mixed-subtraction-scene.js';
import { createReplayEnvelope,replayEpisode } from '../src/interaction/replay.js';
import { getEpisodeDefinition } from '../src/interaction/episode-definition.js';
const start=i=>createPlan82Episode({episodeDefinition:getEpisodeDefinition(PLAN82_ID,'1'),taskContext:resolvePlan82Context(PLAN82_RECORDS[i].itemId)});
const send=(s,type,fields={})=>applyPlan82Intent(s,{type,context:plan82IntentContext(s),...fields});
const edit=(s,field,raw)=>send(s,'edit-mixed-subtraction',{field,raw});
const check=s=>send(s,'check-mixed-subtraction',{revision:s.draftRevision});
describe('Plan 82 decomposition',()=>{
 it('admits registered problems and preserves eighths',()=>{
  expect(validatePlan82Batch(PLAN82_DATA,PLAN82_SET_V1)).toEqual([]);
  expect(PLAN82_RECORDS.map(r=>{const x=admitPlan82Record(r);return [String(x.renamed.whole),String(x.renamed.fraction.numerator),String(x.result.whole),String(x.result.fraction.numerator),String(x.result.fraction.denominator)];})).toEqual([['2','10','1','5','8'],['1','9','0','2','8'],['3','11','1','4','8'],['1','10','0','7','8']]);
  for(const operands of [[{whole:'3',numerator:'3',denominator:'8'},{whole:'1',numerator:'3',denominator:'8'}],[{whole:'1',numerator:'2',denominator:'8'},{whole:'2',numerator:'5',denominator:'8'}]]) expect(()=>validatePlan82Operands({operands})).toThrow();
 });
 it('withholds the exchange until a valid help check or final acceptance',()=>{
  let s=start(0);expect(projectPlan82Subtraction(s).renamed).toBeNull();s=send(s,'request-mixed-subtraction-help',{helpKind:'rename'});s=send(s,'edit-rename',{raw:'9'});s=send(s,'check-rename',{revision:s.help.draftRevision});expect(s.help.evaluation.status).toBe('incorrect');expect(projectPlan82Subtraction(s).renamed).toBeNull();
  s=send(s,'edit-rename',{raw:'10'});s=send(s,'check-rename',{revision:s.help.draftRevision});expect(projectPlan82Subtraction(s).renamed.total).toBe(10);expect(projectPlan82Subtraction(s).settled).toBeNull();expect(replayEpisode(createReplayEnvelope(s))).toEqual(s);
  s=check(edit(edit(s,'whole','1'),'pieces','5'));const scene=projectPlan82Subtraction(s);expect([scene.settled.removedOriginal,scene.settled.removedExchanged,scene.settled.remainingPieces]).toEqual([2,3,5]);expect(replayEpisode(createReplayEnvelope(s))).toEqual(s);
 });
 it('accepts direct responses and requires explicit zero',()=>{
  for(const [i,w,n] of [[0,'1','5'],[1,'0','2'],[2,'1','4'],[3,'0','7']]) {let s=start(i);s=check(edit(s,'pieces',n));expect(s.evaluation.fields.whole.status).toBe('missing');s=check(edit(s,'whole',w));expect(s.status).toBe('resolved');expect(projectPlan82Subtraction(s).settled.notation.hasWhole).toBe(w!=='0');}
 });
 it('retains independent drafts, rejects stale checks and tampered replay',()=>{
  let s=start(0);s=edit(s,'whole','1');s=send(s,'request-mixed-subtraction-help',{helpKind:'rename'});s=send(s,'edit-rename',{raw:'10'});
  expect(()=>send(s,'check-rename',{revision:0})).toThrow();expect(s.draft.whole).toBe('1');
  s=send(s,'check-rename',{revision:s.help.draftRevision});s=send(s,'request-mixed-subtraction-help',{helpKind:'rename'});expect(s.assistanceHistory).toHaveLength(2);
  s=check(edit(s,'pieces','11'));expect(s.evaluation.fields.pieces.status).toBe('out-of-range');expect(s.help.established).toBe(true);
  const envelope=structuredClone(createReplayEnvelope(s));envelope.taskContext.operands[0].numerator='3';expect(()=>replayEpisode(envelope)).toThrow();
  expect(()=>send(s,'check-mixed-subtraction',{revision:0})).toThrow();
 });

});
