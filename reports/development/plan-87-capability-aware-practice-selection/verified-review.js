import '../../../src/app/styles.css';import '../../../src/styles/render.css';
import {createFractionFlowApp} from '../../../src/app/app.js';import {PLAN74_ADDITION_PRACTICE_TYPE as base} from '../../../src/app/practice-types.js';import {PLAN74_RECORDS_V2} from '../../../src/content/plan74-mixed-addition-task.js';import {drawPracticeItems} from '../../../src/app/plan87-draw.js';
// Orchestration-approved review-only identities; not a product capability policy.
const ids=['plan74-add-01','plan74-add-15','plan74-add-30'],revision='2',setId=base.setId;
const identities=ids.map(itemId=>({setId,revision,itemId})),selection=drawPracticeItems({items:identities,seed:0});
const type={...base,setRevision:revision,items:selection.draw.map(({itemId})=>{const r=PLAN74_RECORDS_V2.find(x=>x.itemId===itemId);if(!r)throw Error('missing registered identity');return {id:r.itemId,episodeDefinitionId:base.episodeDefinition.id,episodeDefinitionRevision:'1'};})};
const root=document.querySelector('#app'),dialog=document.querySelector('#layout-recovery'),notice=document.querySelector('#recovery-message');
const verified=()=>{const d=document.documentElement;return innerHeight===740&&(innerWidth===360||innerWidth===1093)&&getComputedStyle(d).fontSize==='16px';};
const measured=()=>{if(!verified())return false;const host=root.querySelector('.app-visual-view:not([hidden]),.app-linear-view:not([hidden])'),width=host?.getBoundingClientRect().width,expected=innerWidth===360?310:970.8125;return Number.isFinite(width)&&Math.abs(width-expected)<=0.1;};
let previousFocus=null;const refuse=()=>{if(dialog.open)return;previousFocus=document.activeElement;dialog.showModal();};
window.addEventListener('resize',()=>{if(window.reviewApp.getState()&&!root.querySelector('.app-episode')?.hasAttribute('hidden')&&!measured())refuse();});
document.querySelector('#recheck-layout').addEventListener('click',()=>{if(!measured()){notice.textContent='More space is still needed.';return;}notice.textContent='';dialog.close();if(previousFocus?.isConnected)previousFocus.focus();});
document.querySelector('#recovery-exit').addEventListener('click',()=>{dialog.close();root.querySelector('.app-return-button').click();});
dialog.addEventListener('cancel',event=>event.preventDefault());
let nextChecks=0;root.addEventListener('click',event=>{const target=event.target.closest('button');if(!target)return;const launch=target.matches('[data-practice-type]'),next=target.closest('.plan74-result');if(!launch&&!next)return;if(!verified()){event.preventDefault();event.stopImmediatePropagation();refuse();return;}if(launch)setTimeout(()=>{if(window.reviewApp.getState()&&!measured())refuse();},0);if(next){if(!measured()){event.preventDefault();event.stopImmediatePropagation();refuse();return;}nextChecks++;}},true);
window.reviewDiagnostics=()=>({selected:selection.draw.map(x=>x.itemId),nextChecks,verified:verified()});window.reviewApp=createFractionFlowApp({root,practiceTypes:[type],presentationMode:'instant-test'}).mount();
