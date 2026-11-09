import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import {createFractionFlowApp} from '../../../src/app/app.js';
import {allGate92Descriptors} from '../../../src/app/plan92-catalog.js';
import {selectPlan92Sync} from '../../../src/app/plan92-managed-selector.js';
import {measureManagedPracticeFit} from '../../../src/app/managed-fit.js';

const versions={catalogRevision:'ff92-catalog@1',policyRevision:'ff92-policy@1',compatibilityRevision:'ff92-compat@1',demandsRevision:'ff92-demands@1'};
const descriptors=allGate92Descriptors();
const seed=Number(new URLSearchParams(location.search).get('seed')??0)>>>0;
let suppliedManifest=null;
const app=createFractionFlowApp({root:document.querySelector('#app'),presentationMode:'instant-test',sessionTestHooks:{
  selectionInput:()=>seed,
  selectManifest:seed=>{const selected=selectPlan92Sync({...versions,seed,candidates:descriptors.map(d=>({...d,fit:true}))});suppliedManifest=selected;return selected.manifest;},
}}).mount();
window.desktop92={app,get suppliedManifest(){return suppliedManifest;},measure(){
  const fit=measureManagedPracticeFit(document.querySelector('.fractionflow-app'));
  const host=document.querySelector('.app-visual-view:not([hidden]),.app-linear-view:not([hidden])');
  const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,clientHeight:e.clientHeight,scrollHeight:e.scrollHeight}};
  const critical=[...document.querySelectorAll('.app-episode h1,.app-episode p,.app-episode button,.app-episode input,.app-episode summary,.app-episode figure,.app-episode .symbolic-expression')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&!e.closest('[hidden]')}).map(e=>({tag:e.tagName,label:(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,100),...rect(e)}));
  const viewportOutside=critical.filter(e=>e.x < -1 || e.right > innerWidth+1 || e.y < -1 || e.bottom > innerHeight+1);
  const overflowClipped=critical.filter(item=>{const el=[...document.querySelectorAll('.app-episode h1,.app-episode p,.app-episode button,.app-episode input,.app-episode summary,.app-episode figure,.app-episode .symbolic-expression')].find(e=>{const r=e.getBoundingClientRect();return r.x===item.x&&r.y===item.y&&r.width===item.width&&r.height===item.height});for(let p=el?.parentElement;p&&p!==document.body;p=p.parentElement){const r=p.getBoundingClientRect(),s=getComputedStyle(p);if((['hidden','clip'].includes(s.overflowX)&&(item.x<r.left-1||item.right>r.right+1))||(['hidden','clip'].includes(s.overflowY)&&(item.y<r.top-1||item.bottom>r.bottom+1)))return true;}return false;}).map(({tag,label,...r})=>({tag,label,...r}));
  return {viewport:{width:innerWidth,height:innerHeight},rootFont:getComputedStyle(document.documentElement).fontSize,independentFit:fit,activeHost:rect(host),document:{clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,clientHeight:document.documentElement.clientHeight,scrollHeight:document.documentElement.scrollHeight},critical,viewportOutside,overflowClipped};
}};
