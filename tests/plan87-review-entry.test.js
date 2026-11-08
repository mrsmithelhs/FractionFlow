import {afterEach,expect,it} from 'vitest';
import {createFractionFlowApp} from '../src/app/app.js';
import {selectFittingPracticeSession} from '../src/app/magnitude-session.js';
import {setupMockDOM,teardownMockDOM} from './fixtures/mock-dom.js';
afterEach(()=>teardownMockDOM());
it('review Start refuses safely when its injected selection has no admissible mix',()=>{
 const doc=setupMockDOM(),root=doc.createElement('div');doc.body.appendChild(root);
 const app=createFractionFlowApp({root,presentationMode:'instant-test',sessionTestHooks:{selectionInput:()=>0,selectManifest:seed=>selectFittingPracticeSession(seed,[])}}).mount();
 root.querySelector('[data-session-entry="comparison"]').click();expect(app.getState()).toBeNull();expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);expect(root.querySelector('.app-session-entry-notice').textContent).toContain('could not be opened');app.destroy();
});
it('review Start does not fall back to an unverified manifest when the injected selector fails',()=>{
 const doc=setupMockDOM(),root=doc.createElement('div');doc.body.appendChild(root);
 const app=createFractionFlowApp({root,presentationMode:'instant-test',sessionTestHooks:{selectManifest:()=>{throw Error('measurement unavailable');}}}).mount();
 root.querySelector('[data-session-entry="comparison"]').click();expect(app.getState()).toBeNull();expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);app.destroy();
});
