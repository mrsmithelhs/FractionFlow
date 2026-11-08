import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { measureManagedPracticeFit } from '../../../src/app/managed-fit.js';
let failMount = false;
let changeFit = false;
window.integrationFailMount = value => { failMount = value; };
window.integrationChangeFit = () => { changeFit = true; };
let dynamicReject = null;
window.integrationRejectItem = value => { dynamicReject = value; };
const seedValue = new URLSearchParams(location.search).get('seed');
const rejectItem = new URLSearchParams(location.search).get('reject');
const onlyItem = new URLSearchParams(location.search).get('only');
const preflightReject = new URLSearchParams(location.search).get('preflightReject');
const initialConditionId = new URLSearchParams(location.search).get('condition') ?? 'phase2-bundle-1';
const initialSupportLevelId = new URLSearchParams(location.search).get('support') ?? 'high-support';
window.integrationMountSamples = [];
window.integrationApp = createFractionFlowApp({root:document.querySelector('#app'), initialConditionId, initialSupportLevelId, presentationMode:'instant-test',
  sessionTestHooks:{...(seedValue === null ? {} : {selectionInput:()=>Number(seedValue)}),
    prepare:candidate=>{if(candidate.state.taskContext.itemId===rejectItem || candidate.state.taskContext.itemId===dynamicReject || (onlyItem !== null && candidate.state.taskContext.itemId !== onlyItem))throw Error('forced preflight refusal');},
    preflightMount:candidate=>{if(candidate.state.taskContext.itemId===preflightReject)throw Error('forced detached renderer failure');},
    afterDisplay:()=>{if(changeFit){changeFit=false;document.documentElement.style.fontSize='110%';}if(failMount)throw Error('forced post-mount failure');
      const active=document.querySelector('.app-visual-view:not([hidden]),.app-linear-view:not([hidden])');
      const r=active?.getBoundingClientRect();
      window.integrationMountSamples.push({fit:measureManagedPracticeFit(document.querySelector('.fractionflow-app')),
        activeHost:r?{width:r.width,left:r.left,right:r.right}:null,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth});}}}).mount();
window.integrationFit = () => measureManagedPracticeFit(document.querySelector('.fractionflow-app'));
