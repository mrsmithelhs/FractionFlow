import { afterEach, expect, it } from 'vitest';
import { selectPracticeSession, admitMagnitudeManifest, COMPARISON_SESSION_MANIFEST } from '../src/app/magnitude-session.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
const submit = form => form.dispatchEvent({type:'submit',preventDefault(){}});
const compare = (root, relation) => { const inputs=[...root.querySelectorAll('.app-visual-view .plan45-relation-option input')]; inputs.forEach(i=>{i.checked=i.value===relation;}); const x=inputs.find(i=>i.value===relation); x.dispatchEvent({type:'change'}); submit(root.querySelector('.app-visual-view .plan45-response-region')); };
const setup = hooks => { const doc=setupMockDOM(), root=doc.createElement('div'); doc.body.appendChild(root); const app=createFractionFlowApp({root,presentationMode:'instant-test',sessionTestHooks:hooks}).mount(); root.querySelector('[data-session-entry="comparison"]').click(); return {root,app}; };
afterEach(()=>teardownMockDOM());
it('admits only the finite slot policy and rejects mutations',()=>{
 for(let i=0;i<4;i++) {const m=selectPracticeSession(i); expect(admitMagnitudeManifest(m).manifest).toEqual(m); expect(selectPracticeSession(i)).toEqual(m);}
 const mutations=[m=>m.entries.reverse(),m=>m.entries[1]=m.entries[0],m=>m.entries[0].itemRevision='bad',m=>m.entries[2].itemId='distance-02',m=>m.extra=true];
 for(const mutate of mutations){const m=structuredClone(selectPracticeSession(0));mutate(m);expect(()=>admitMagnitudeManifest(m)).toThrow();}
 expect(()=>selectPracticeSession(-1)).toThrow(); expect(()=>selectPracticeSession(1.5)).toThrow();
});
it.each([[0,'plan45-compare-02','distance-01','<','4','8'],[3,'plan45-compare-09','distance-04','>','3','6']])('launches mixed output %s and completes', (input,first,distance,relation,numerator,denominator)=>{
 const {root,app}=setup({selectionInput:()=>input}); expect(app.getState().taskContext.itemId).toBe(first); compare(root,'<'); expect(app.getState().status).toBe('active'); compare(root,'>'); root.querySelector('.app-visual-view .plan45-progression-button').click();
 expect(app.getState().taskContext.itemId).toBe('plan45-compare-10'); compare(root,'<'); root.querySelector('.app-visual-view .plan45-progression-button').click(); expect(app.getState().taskContext.itemId).toBe(distance); compare(root,relation);
 for(const [key,value] of [['numerator',numerator],['denominator',denominator]]){const x=root.querySelector(`.app-visual-view [data-plan51-focus="${key}"]`);x.value=value;x.dispatchEvent({type:'input'});} submit(root.querySelector('.app-visual-view .plan51-response')); expect(app.getState().status).toBe('resolved'); root.querySelector('.app-visual-view .plan51-next').click(); expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);app.destroy();
});
it('falls back atomically when a scheduled candidate cannot prepare',()=>{const {app}=setup({selectionInput:()=>3,prepare:c=>{if(c.state.taskContext.itemId==='distance-04')throw Error('unavailable');}});expect(app.getState().taskContext.itemId).toBe(COMPARISON_SESSION_MANIFEST.entries[0].itemId);app.destroy();});
it('leaves entry usable if both preparations fail',()=>{const {root,app}=setup({selectionInput:()=>0,prepare:()=>{throw Error('unavailable');}});expect(app.getState()).toBeNull();expect(root.querySelector('.app-session-entry-notice').textContent).toContain('could not be opened');expect(root.querySelector('[data-entry-chooser]')).toBeTruthy();app.destroy();});
import { createMagnitudeSessionController } from '../src/app/magnitude-session.js';
import { createComparisonRecordController } from '../src/app/comparison-record-controller.js';
import { emptyRoot } from '../src/app/comparison-record.js';
import { applyIntent } from '../src/interaction/episode.js';
it('admits only live scheduled comparisons to an opted-in record',async()=>{
 const writes=[];const record=createComparisonRecordController({storage:{read:async()=>emptyRoot('a'.repeat(32),true),record:async(g,o)=>{writes.push(o);return 'inserted';}}});await record.refresh();
 const session=createMagnitudeSessionController(selectPracticeSession(3));
 for(const relation of ['>','<']) {const before=session.current();expect(record.install(before.episode,session)).toBe(true);const next=applyIntent(before.episode,{type:'submit-fraction-comparison',proposed:relation});expect(session.updateEpisode(before.episode,next)).toBe(true);record.observe(before.episode,next,{type:'submit-fraction-comparison'});const current=session.current(),ticket=session.prepareTransition('next',current.session,current.episode);expect(ticket.ok).toBe(true);expect(session.commit(ticket.ticket)).toBe(true);}
 expect(record.install(session.current().episode,session)).toBe(false);await new Promise(resolve=>setTimeout(resolve,0));expect(writes).toHaveLength(2);expect(writes.map(x=>x.identity.itemId)).toEqual(['plan45-compare-09','plan45-compare-10']);session.exit(session.current().session);record.destroy();
});
