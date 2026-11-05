import { afterEach, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
const submit = f => f.dispatchEvent({ type: 'submit', preventDefault() {} });
const button = (root, text) => [...root.querySelectorAll('button')].find(x => x.textContent === text && !x.hasAttribute('hidden'));
const mount = hooks => { const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root); const app = createFractionFlowApp({ root, presentationMode: 'instant-test', sessionTestHooks: hooks }).mount(); openChooser(root); root.querySelector('[data-session-entry="magnitude"]').click(); return { doc, root, app }; };
const compare = (root, relation) => { const input = [...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(x => x.value === relation); input.checked = true; input.dispatchEvent({ type: 'change' }); submit(root.querySelector('.app-visual-view .plan45-response-region')); };
const advance = root => root.querySelector('.app-visual-view .plan45-progression-button').click();
afterEach(() => teardownMockDOM());
it('runs the complete fixed session and returns naturally', () => {
 let failPrepare=false; const { root, doc, app } = mount({prepare:()=>{if(failPrepare)throw Error('prepare');}});
 for (const [id, relation] of [['plan45-compare-02','>'],['plan45-compare-08','<'],['plan45-compare-11','=']]) {
  expect(app.getState().taskContext.itemId).toBe(id); compare(root, relation); expect(app.getState().status).toBe('resolved');
  if (id.endsWith('11')) expect(root.querySelector('.app-visual-view .plan45-progression-button').textContent).toBe('Next: compare and find the distance');
  advance(root);
 }
 expect(app.getState().taskContext.itemId).toBe('distance-01');
 failPrepare=true; button(root,'Try this problem again').click(); expect(root.querySelector('.app-navigation-notice').textContent).toBe('This problem could not be restarted. Try again or go back to start.'); expect(doc.activeElement).toBe(root.querySelector('.app-navigation-notice')); app.update(); expect(root.querySelector('.app-navigation-notice').textContent).toBe('This problem could not be restarted. Try again or go back to start.'); failPrepare=false;
 const option = [...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(x => x.value === '<'); option.checked = true; option.dispatchEvent({type:'change'}); submit(root.querySelector('.app-visual-view .plan51-response'));
 expect(app.getState().beat).toBe('distance');
 for (const [key,value] of [['numerator','4'],['denominator','8']]) { const x=root.querySelector(`.app-visual-view [data-plan51-focus="${key}"]`); x.value=value; x.dispatchEvent({type:'input'}); }
 submit(root.querySelector('.app-visual-view .plan51-response')); expect(app.getState().status).toBe('resolved');
 expect(root.querySelector('.app-return-button').hasAttribute('hidden')).toBe(true); expect(root.querySelector('.app-visual-view .plan51-next').textContent).toBe('Back to start'); root.querySelector('.app-visual-view .plan51-next').click();
 expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false); openChooser(root); root.querySelector('[data-session-entry="magnitude"]').click(); expect(app.getState().taskContext.itemId).toBe('plan45-compare-02'); app.destroy();
});
it('keeps partial help and focus on Stay and clears the session on Leave', () => {
 const {root,doc,app}=mount(); expect(root.querySelector('.app-return-button').textContent).toBe('Back to start'); button(root,'Use the same denominator').click(); const input=root.querySelector('.app-visual-view .plan49-helper-input'); input.value='8'; input.dispatchEvent({type:'input'}); const old=app.getState();
 const exit=root.querySelector('.app-return-button'); exit.focus(); exit.click(); expect(root.querySelector('[role="dialog"]').hasAttribute('hidden')).toBe(false); button(root,'Stay').click();
 expect(doc.activeElement).toBe(exit); expect(app.getState()).toBe(old); expect(root.querySelector('.app-visual-view .plan49-helper-input').value).toBe('8');
 exit.click(); button(root,'Leave').click(); expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false); expect(root.querySelector('[data-support-id="medium-support"]').disabled).toBe(false); openChooser(root); root.querySelector('[data-session-entry="magnitude"]').click(); expect(app.getState().taskContext.itemId).toBe('plan45-compare-02'); app.destroy();
});
it('retains old work on preparation failure and exits safely on post-commit display failure', () => {
 let failPrepare=false, failDisplay=false; const {root,doc,app}=mount({prepare:()=>{if(failPrepare)throw Error('prepare');},display:()=>{if(failDisplay)throw Error('display');}});
 button(root,'Use the same denominator').click(); const input=root.querySelector('.app-visual-view .plan49-helper-input'); input.value='8'; input.dispatchEvent({type:'input'}); const original=app.getState(); failPrepare=true;
 button(root,'Try this problem again').click(); expect(app.getState()).toBe(original); expect(root.querySelector('.app-visual-view .plan49-helper-input').value).toBe('8'); expect(root.querySelector('.app-navigation-notice').textContent).toBe('This problem could not be restarted. Try again or go back to start.'); expect(doc.activeElement).toBe(root.querySelector('.app-navigation-notice')); app.update(); expect(root.querySelector('.app-navigation-notice').textContent).toBe('This problem could not be restarted. Try again or go back to start.'); failPrepare=false;
 compare(root,'>'); const accepted=app.getState(); failPrepare=true; advance(root); expect(app.getState()).toBe(accepted); expect(root.querySelector('.app-navigation-notice').hasAttribute('hidden')).toBe(false); expect(root.querySelector('.app-navigation-notice').textContent).toBe('The next problem could not be opened. Try again or go back to start.'); expect(doc.activeElement).toBe(root.querySelector('.app-navigation-notice')); app.update(); expect(root.querySelector('.app-navigation-notice').textContent).toBe('The next problem could not be opened. Try again or go back to start.');
 failPrepare=false; failDisplay=true; advance(root); expect(app.getState()).toBeNull(); expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false); expect(root.querySelector('.app-session-entry-notice').textContent).toContain('could not be displayed'); expect(root.querySelector('[data-support-id="medium-support"]').disabled).toBe(false);
 failDisplay=false; openChooser(root); root.querySelector('[data-session-entry="magnitude"]').click(); expect(app.getState().taskContext.itemId).toBe('plan45-compare-02'); app.destroy();
});

it('tears down session and retired dialog callbacks before same-instance remount', () => {
 const {root, app} = mount();
 root.querySelector('.app-return-button').click();
 const retiredStay=button(root,'Stay'), retiredLeave=button(root,'Leave');
 expect(root.querySelector('[role="dialog"]').hasAttribute('hidden')).toBe(false);
 app.destroy(); app.mount();
 openChooser(root); root.querySelector('[data-practice-type="fraction-distance"]').click();
 const relation=[...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(x=>x.value==='<');
 relation.checked=true; relation.dispatchEvent({type:'change'}); submit(root.querySelector('.app-visual-view .plan51-response'));
 expect(app.getState().beat).toBe('distance');
 const standalone=app.getState(); retiredStay.click(); retiredLeave.click(); expect(app.getState()).toBe(standalone);
 app.destroy(); app.mount(); openChooser(root); root.querySelector('[data-session-entry="magnitude"]').click();
 expect(app.getState().taskContext.itemId).toBe('plan45-compare-02');
 const session=app.getState(); retiredStay.click(); retiredLeave.click(); expect(app.getState()).toBe(session); app.destroy();
});

function openChooser(root) {
  const chooser = root.querySelector('[data-entry-chooser]');
  if (chooser.getAttribute('aria-expanded') === 'false') chooser.click();
}
