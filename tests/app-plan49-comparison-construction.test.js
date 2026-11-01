import { afterEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';
import { resolveRenderableScene } from '../src/render/contract.js';
const submit = form => form.dispatchEvent({type:'submit',preventDefault(){}});
function mount() { const document=setupMockDOM(); const root=document.createElement('div'); document.body.appendChild(root); const app=createFractionFlowApp({root,presentationMode:'instant-test'}).mount(); root.querySelector('[data-practice-type="symbolic-fraction-comparison"]').click(); return {root,app}; }
function button(root,text) { return [...root.querySelectorAll('.app-visual-view button')].find(x=>x.textContent===text); }
function enter(root,value) { const input=root.querySelector('.app-visual-view .plan49-helper-input'); input.value=value; input.dispatchEvent({type:'input'}); submit(root.querySelector('.app-visual-view .plan49-helper-form')); }
function replay(state) { expect(replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(state))))).toEqual(state); }
describe('Plan 49 mounted comparison',()=>{
 afterEach(()=>teardownMockDOM());
 it('constructs sequentially, keeps relation available and protects stale epoch controls',()=>{
  const {root,app}=mount(); const details=root.querySelector('.app-visual-view .plan45-help'); details.open=true; details.dispatchEvent({type:'toggle'});
  button(root,'Use the same denominator').click();
  button(root,'Help me find one').click(); expect(root.querySelector('.app-visual-view .plan49-helper-cue').textContent).toContain('3 by 5');
  enter(root,'14'); expect(app.getState().construction.recovery).toBe('not-common'); enter(root,'15');
  const oldForm=root.querySelector('.app-visual-view .plan49-helper-form'); const oldInput=root.querySelector('.app-visual-view .plan49-helper-input');
  button(root,'Help with this renaming').click(); enter(root,'4'); expect(app.getState().construction.recovery).toBe('incorrect-multiplier'); enter(root,'5'); enter(root,'11'); enter(root,'10');
  expect(app.getState().construction.phase).toBe('second'); expect(root.querySelectorAll('.app-visual-view .plan45-model')).toHaveLength(0); replay(app.getState());
  button(root,'Change denominator').click(); enter(root,'15'); const current=app.getState();
  oldInput.value='10'; oldInput.dispatchEvent({type:'input'}); submit(oldForm); expect(app.getState()).toBe(current);
  enter(root,'10'); expect(app.getState().construction.phase).toBe('second'); enter(root,'9'); expect(app.getState().construction.phase).toBe('ready');
  const choice=[...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(x=>x.value==='>'); choice.checked=true; choice.dispatchEvent({type:'change'}); submit(root.querySelector('.app-visual-view .plan45-response-region'));
  expect(app.getState().status).toBe('resolved'); replay(app.getState()); expect(root.querySelectorAll('.app-visual-view .plan45-model')).toHaveLength(2); app.destroy();
 });
 it('keeps unfinished help and relation draft over view switches, and withholds older cue and second model',()=>{
  const {root,app}=mount(); button(root,'Reasoning tip').click(); button(root,'Sign tip').click();
  const scene=resolveRenderableScene({state:app.getState(),initialRole:'fraction-bar',presentationMode:'instant-test'});
  expect(scene.meaning.comparison.reasoningCue).toBeNull(); expect(scene.meaning.comparison.notationCue).toBeTruthy();
  button(root,'Use the same denominator').click(); const input=root.querySelector('.app-visual-view .plan49-helper-input'); input.value='15'; input.dispatchEvent({type:'input'});
  const relation=[...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(x=>x.value==='>'); relation.checked=true; relation.dispatchEvent({type:'change'});
  root.querySelector('.app-view-toggle').click(); expect(root.querySelector('.app-linear-view .plan49-helper-input').value).toBe('15');
  submit(root.querySelector('.app-linear-view .plan45-response-region')); expect(app.getState().status).toBe('resolved'); replay(app.getState()); app.destroy();
 });
});
