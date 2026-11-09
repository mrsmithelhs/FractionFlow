import {describe,it,expect} from 'vitest';
import {selectPlan92Sync} from '../src/app/plan92-managed-selector.js';
import {allGate92Descriptors,isPlan92MeasuredFit} from '../src/app/plan92-catalog.js';
import {admitMagnitudeManifest,createMagnitudeSessionController} from '../src/app/magnitude-session.js';
import {applyIntent} from '../src/interaction/episode.js';
import {createComparisonRecordController} from '../src/app/comparison-record-controller.js';
import {emptyRoot} from '../src/app/comparison-record.js';
const descriptors=allGate92Descriptors(),revisions={catalogRevision:'ff92-catalog@1',policyRevision:'ff92-policy@1',compatibilityRevision:'ff92-compat@1',demandsRevision:'ff92-demands@1'};
const choose=seed=>selectPlan92Sync({...revisions,seed,candidates:descriptors.map(d=>({...d,fit:true}))}).manifest;
const fit=(w,h,font,area)=>({viewportWidth:w,viewportHeight:h,font,area,widths:[area,area],htmlScroll:'visible',bodyScroll:'visible',rootScroll:'visible'});
describe('Plan 92 generated session integration',()=>{
 it('admits all approved shapes and rejects altered identities and ordering',()=>{
  for(const seed of [0,1,4]){const m=choose(seed);expect(admitMagnitudeManifest(m).prepared).toHaveLength(m.entries.length);
   const bad=structuredClone(m);bad.entries.at(-1).itemRevision='changed';expect(()=>admitMagnitudeManifest(bad)).toThrow();
   const reordered=structuredClone(m);reordered.entries.reverse();expect(()=>admitMagnitudeManifest(reordered)).toThrow();}
 });
 it('restricts new eligibility to the exact evidenced screen samples',()=>{
  const c=descriptors.find(d=>d.role==='C').identity,t=descriptors.find(d=>d.role==='T').identity;
  for(const e of [c,t]){expect(isPlan92MeasuredFit(fit(1093,614,16,955),e,'phase2-bundle-1')).toBe(true);expect(isPlan92MeasuredFit(fit(650,740,32,505),e,'phase2-bundle-4')).toBe(true);expect(isPlan92MeasuredFit(fit(650,741,32,505),e,'phase2-bundle-1')).toBe(false);}
  expect(isPlan92MeasuredFit(fit(600,740,32,455),c,'phase2-bundle-1')).toBe(true);expect(isPlan92MeasuredFit(fit(600,740,32,455),t,'phase2-bundle-1')).toBe(false);
  expect(isPlan92MeasuredFit(fit(360,740,16,295),c,'phase2-bundle-1')).toBe(false);
 });
 it('uses an eligible replacement in the same future role and refuses a changed fit token',()=>{
  const m=choose(4),original=m.entries[1].itemId;let revision='a';
  const controller=createMagnitudeSessionController(m,'high-support',{eligibleForNext:e=>e.itemId!==original,fitRevision:()=>revision});
  const first=controller.current(),answer=first.episode.taskContext.itemId==='plan45-compare-10'?'<':'>';
  const resolved=applyIntent(first.episode,{type:'submit-fraction-comparison',proposed:answer});expect(controller.updateEpisode(first.episode,resolved)).toBe(true);
  let current=controller.current(),prepared=controller.prepareTransition('next',current.session,resolved);expect(prepared.ok).toBe(true);revision='b';expect(controller.commit(prepared.ticket)).toBe(false);
  current=controller.current();prepared=controller.prepareTransition('next',current.session,resolved);expect(prepared.ok).toBe(true);expect(controller.commit(prepared.ticket)).toBe(true);expect(controller.current().episode.taskContext.itemId).not.toBe(original);expect(controller.current().manifest.entries[1].role).toBe('I');
 });
 it('uses another approved shape when an unstarted middle role cannot fit',()=>{
  for(const [missing,expected] of [['I','C-S-T'],['S','C-I-T']]){
   const controller=createMagnitudeSessionController(choose(0),'high-support',{eligibleForNext:e=>e.role!==missing});
   const first=controller.current(),answer=first.episode.taskContext.itemId==='plan45-compare-10'?'<':'>';
   const resolved=applyIntent(first.episode,{type:'submit-fraction-comparison',proposed:answer});expect(controller.updateEpisode(first.episode,resolved)).toBe(true);
   const current=controller.current(),transition=controller.prepareTransition('next',current.session,resolved);
   expect(transition.ok).toBe(true);expect(controller.commit(transition.ticket)).toBe(true);
   expect(controller.current().manifest.shapeId).toBe(expected);expect(admitMagnitudeManifest(controller.current().manifest).prepared).toHaveLength(3);
  }
 });
 it('keeps the separately enabled legacy comparison record eligible for its original identities',async()=>{
  const writes=[],record=createComparisonRecordController({storage:{read:async()=>emptyRoot('a'.repeat(32),true),record:async(g,o)=>{writes.push(o);return 'inserted';}}});await record.refresh();
  const controller=createMagnitudeSessionController(choose(0));const first=controller.current();expect(record.install(first.episode,controller)).toBe(true);
  const response=first.episode.taskContext.itemId==='plan45-compare-10'?'<':'>';const next=applyIntent(first.episode,{type:'submit-fraction-comparison',proposed:response});expect(controller.updateEpisode(first.episode,next)).toBe(true);record.observe(first.episode,next,{type:'submit-fraction-comparison'});await new Promise(resolve=>setTimeout(resolve,0));expect(writes).toHaveLength(1);expect(writes[0].identity.itemId).toBe(first.episode.taskContext.itemId);record.destroy();
 });
});
