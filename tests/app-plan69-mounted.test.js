import { afterEach, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { COMPARISON_SESSION_MANIFEST } from '../src/app/magnitude-session.js';
const button=(root,text)=>[...root.querySelectorAll('button')].find(b=>b.textContent===text && !b.hasAttribute('hidden'));
const compare=(root,relation)=>{const inputs=[...root.querySelectorAll('.app-visual-view .plan45-relation-option input')]; inputs.forEach(x=>{x.checked=x.value===relation;}); const input=inputs.find(x=>x.value===relation); input.dispatchEvent({type:'change'}); root.querySelector('.app-visual-view .plan45-response-region').dispatchEvent({type:'submit',preventDefault(){}});};
afterEach(()=>teardownMockDOM());
it('launches the protected fixed manifest via the review seam, keeps retry and returns to a fresh start',()=>{
 const doc=setupMockDOM(),root=doc.createElement('div'); doc.body.appendChild(root); const app=createFractionFlowApp({root,presentationMode:'instant-test',sessionTestHooks:{selectManifest:()=>COMPARISON_SESSION_MANIFEST}}).mount();
 root.querySelector('[data-session-entry="comparison"]').click(); compare(root,'<'); expect(app.getState().status).toBe('active');
 for(const [id,relation] of [['plan45-compare-02','>'],['plan45-compare-09','>'],['plan45-compare-11','='],['plan45-compare-10','<']]) {
  expect(app.getState().taskContext.itemId).toBe(id); compare(root,relation); expect(app.getState().status).toBe('resolved');
  const next=root.querySelector('.app-visual-view .plan45-progression-button'); expect(next.textContent).toBe(id.endsWith('10')?'Back to start':'Next problem'); next.click();
 }
 expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false); root.querySelector('[data-session-entry="comparison"]').click(); expect(app.getState().taskContext.itemId).toBe('plan45-compare-02');
 root.querySelector('.app-return-button').click(); button(root,'Stay').click(); expect(app.getState().taskContext.itemId).toBe('plan45-compare-02'); root.querySelector('.app-return-button').click(); button(root,'Leave').click(); app.destroy();
});
it('retains accepted work on refused next and exits safely on display failure',()=>{
 let failPrepare=false,failDisplay=false; const doc=setupMockDOM(),root=doc.createElement('div'); doc.body.appendChild(root);
 const app=createFractionFlowApp({root,presentationMode:'instant-test',sessionTestHooks:{selectManifest:()=>COMPARISON_SESSION_MANIFEST,prepare:()=>{if(failPrepare)throw Error('prepare');},display:()=>{if(failDisplay)throw Error('display');}}}).mount();
 root.querySelector('[data-session-entry="comparison"]').click(); compare(root,'>'); const accepted=app.getState(); failPrepare=true;
 root.querySelector('.app-visual-view .plan45-progression-button').click(); expect(app.getState()).toBe(accepted); expect(root.querySelector('.app-navigation-notice').textContent).toContain('could not be opened');
 failPrepare=false; failDisplay=true; root.querySelector('.app-visual-view .plan45-progression-button').click(); expect(app.getState()).toBeNull(); expect(root.querySelector('.app-session-entry-notice').textContent).toContain('could not be displayed'); app.destroy();
});
