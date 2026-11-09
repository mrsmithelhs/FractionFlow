import '../../../src/app/styles.css';import '../../../src/styles/render.css';
import {createFractionFlowApp} from '../../../src/app/app.js';
import {measureManagedPracticeFit,isManagedFamilyFit,matchesManagedActiveHost} from '../../../src/app/managed-fit.js';
import {PLAN92_SCRATCH_IDENTITIES,preparePlan92ScratchCandidate} from '../../../src/app/plan92-scratch-candidates.js';
import {selectPlan92Prototype} from '../../../src/app/plan92-managed-selector.js';
import {describeGate92,validateGate92Visit} from './gate92-catalog.mjs';
const q=new URLSearchParams(location.search),condition=q.get('condition')??'phase2-bundle-1',support=q.get('support')??'high-support';
const root=document.querySelector('#app'),start=document.querySelector('#start-isolated'),status=document.querySelector('#status');let active=null,activeNode=document.createElement('div'),events=[];root.appendChild(activeNode);
const descriptors=PLAN92_SCRATCH_IDENTITIES.map(identity=>describeGate92(identity,support,condition));
const base={policyRevision:'ff92-policy@1',catalogRevision:'ff92-catalog@1',compatibilityRevision:'ff92-compat@1',demandsRevision:'ff92-demands@1'};
function shell(){return createFractionFlowApp({root:activeNode,initialSupportLevelId:support,initialConditionId:condition,presentationMode:'instant-test',rendererPreflight:true}).mount();}
active=shell();
function fit(){return measureManagedPracticeFit(root.querySelector('.fractionflow-app'));}
function preflight(entry,measurement){let node,app;const t=performance.now();try{
 if(!isManagedFamilyFit(measurement,entry.typeId,condition))throw Error('fit-class-refusal');
 const prepared=preparePlan92ScratchCandidate(entry,support,condition);node=document.createElement('div');node.inert=true;node.setAttribute('aria-hidden','true');node.setAttribute('data-gate92-scratch','');Object.assign(node.style,{position:'fixed',left:'-20000px',top:'0',width:`${root.getBoundingClientRect().width}px`,height:'0',overflow:'hidden',visibility:'hidden',pointerEvents:'none'});document.body.appendChild(node);
 app=createFractionFlowApp({root:node,practiceTypes:[prepared.type],initialConditionId:condition,initialSupportLevelId:support,presentationMode:'instant-test',rendererPreflight:true}).mount();app.mountPreparedForPreflight(prepared);
 for(const view of ['visual','linear']){if(view==='linear')node.querySelector('.app-view-toggle').click();let host=node.querySelector(`.app-${view}-view:not([hidden])`);if(!matchesManagedActiveHost(measurement,host,entry.typeId,condition))throw Error(`host-fit-${view}`);}
 if(window.gate92InjectFailure===entry.itemId)throw Error('injected-preflight-failure');return {prepared,ms:performance.now()-t};
 }finally{app?.destroy();node?.remove();}}
async function launch(){const t=performance.now(),seed=window.gate92NextSeed??crypto.getRandomValues(new Uint32Array(1))[0];window.gate92NextSeed=undefined;const previous=active?.getState()?.taskContext?.itemId??null;const measurement=fit();
 try{const candidates=descriptors.map(d=>({role:d.role,identity:d.identity,problemKey:d.problemKey,fit:isManagedFamilyFit(measurement,d.identity.typeId,condition)}));const selection=await selectPlan92Prototype({...base,seed,candidates});if(!selection.manifest){status.textContent='No candidate passed the screen.';return {seed,failed:'empty',previous};}
 const chosen=selection.manifest.entries.map(entry=>descriptors.find(d=>d.identity.itemId===entry.itemId));if(chosen.some(x=>!x))throw Error('unknown-selection');if(chosen.length>1)validateGate92Visit(chosen);
 const prepared=[];const preflightStart=performance.now();for(const selected of selection.manifest.entries){const entry=PLAN92_SCRATCH_IDENTITIES.find(x=>x.itemId===selected.itemId);prepared.push(preflight(entry,measurement));}const preflightMs=performance.now()-preflightStart;
 if(JSON.stringify(fit())!==JSON.stringify(measurement))throw Error('fit-changed');
 const previousApp=active;const previousRoot=activeNode;const mountRoot=document.createElement('div');root.appendChild(mountRoot);let next;
 try{next=createFractionFlowApp({root:mountRoot,practiceTypes:[prepared[0].prepared.type],initialConditionId:condition,initialSupportLevelId:support,presentationMode:'instant-test',rendererPreflight:true}).mount();next.mountPreparedForPreflight(prepared[0].prepared);}catch(e){next?.destroy();mountRoot.remove();throw e;}
 previousApp?.destroy();previousRoot?.remove();active=next;activeNode=mountRoot;status.textContent='Isolated visit prepared.';
 return {seed,shape:selection.manifest.shapeId,ids:selection.manifest.entries.map(x=>x.itemId),first:active.getState().taskContext.itemId,fit:measurement,preflightMs,totalMs:performance.now()-t,perCandidate:prepared.map(x=>x.ms),scratchRemaining:document.querySelectorAll('[data-gate92-scratch]').length};
 }catch(e){status.textContent='Isolated visit could not be prepared.';return {seed,failed:String(e),previous,stillActive:active?.getState()?.taskContext?.itemId??null,totalMs:performance.now()-t,scratchRemaining:document.querySelectorAll('[data-gate92-scratch]').length};}}
start.addEventListener('click',()=>{if(start.disabled)return;start.disabled=true;window.gate92Pending=launch().then(result=>{events.push(result);window.gate92Result=result;return result;}).finally(()=>{start.disabled=false;});});
window.gate92={events,getState:()=>active?.getState(),getFit:fit};window.gate92Ready=true;
