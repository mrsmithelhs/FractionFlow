import '../../../src/app/styles.css';import '../../../src/styles/render.css';
import {createFractionFlowApp} from '../../../src/app/app.js';
import {measureManagedPracticeFit,isManagedFamilyFit,matchesManagedActiveHost} from '../../../src/app/managed-fit.js';
import {PLAN92_SCRATCH_IDENTITIES,preparePlan92ScratchCandidate} from '../../../src/app/plan92-scratch-candidates.js';
const root=document.querySelector('#app');const app=createFractionFlowApp({root,presentationMode:'instant-test'}).mount();
window.scratch92=({support,condition})=>{
 const measure=measureManagedPracticeFit(root.querySelector('.fractionflow-app'));const events=[];
 for(const entry of PLAN92_SCRATCH_IDENTITIES){
  const fit=isManagedFamilyFit(measure,entry.typeId,condition);let scratch,host;const before=performance.now();
  if(!fit){events.push({item:entry.itemId,role:entry.role,fitClass:false,reason:'existing family fit threshold rejects before mount'});continue;}
  try{
   const candidate=preparePlan92ScratchCandidate(entry,support,condition);
   host=document.createElement('div');host.setAttribute('data-managed-renderer-preflight','');host.inert=true;host.setAttribute('aria-hidden','true');
   Object.assign(host.style,{position:'fixed',left:'-20000px',top:'0',width:`${root.getBoundingClientRect().width}px`,height:'0',overflow:'hidden',visibility:'hidden',pointerEvents:'none'});document.body.appendChild(host);
   scratch=createFractionFlowApp({root:host,practiceTypes:[candidate.type],initialConditionId:condition,initialSupportLevelId:support,presentationMode:'instant-test',rendererPreflight:true});scratch.mount();scratch.mountPreparedForPreflight(candidate);
   const views=[];for(const view of ['visual','linear']){if(view==='linear')host.querySelector('.app-view-toggle').click();const active=host.querySelector(view==='visual'?'.app-visual-view:not([hidden])':'.app-linear-view:not([hidden])');views.push({view,hostMatch:matchesManagedActiveHost(measure,active,entry.typeId,condition),width:active?.getBoundingClientRect().width,scrollWidth:active?.scrollWidth,clientWidth:active?.clientWidth});}
   events.push({item:entry.itemId,role:entry.role,fitClass:true,mounted:true,views,ms:performance.now()-before});
  }catch(e){events.push({item:entry.itemId,role:entry.role,fitClass:true,mounted:false,error:String(e)});}
  finally{scratch?.destroy();host?.remove();}
 }
 return {measure,events,scratchRemaining:document.querySelectorAll('[data-managed-renderer-preflight]').length};
};window.scratchReady=true;
