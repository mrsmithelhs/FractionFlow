import '../../../src/app/styles.css';import '../../../src/styles/render.css';
import {createFractionFlowApp} from '../../../src/app/app.js';
import {PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE} from '../../../src/app/practice-types.js';
import {PLAN92_SCRATCH_IDENTITIES,preparePlan92ScratchCandidate} from '../../../src/app/plan92-scratch-candidates.js';
const q=new URLSearchParams(location.search),id=q.get('item'),support=q.get('support'),condition=q.get('condition'),view=q.get('view'),mode=q.get('mode');
const base=PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE,item=base.items.find(x=>x.id===id),identity=PLAN92_SCRATCH_IDENTITIES.find(x=>x.itemId===id);if(!item||!identity||!['standalone','scratch'].includes(mode))throw Error('invalid fixture input');
const root=document.querySelector('#app'),type={...base,items:[item]};
const app=createFractionFlowApp({root,practiceTypes:[type],initialSupportLevelId:support,initialConditionId:condition,presentationMode:'instant-test',rendererPreflight:mode==='scratch'}).mount();
if(mode==='scratch')app.mountPreparedForPreflight(preparePlan92ScratchCandidate(identity,support,condition));
else {const chooser=root.querySelector('[data-entry-chooser]');if(chooser.getAttribute('aria-expanded')==='false')chooser.click();root.querySelector(`[data-practice-type="${base.id}"]`).click();}
if(view==='linear')root.querySelector('.app-view-toggle').click();window.type92={app,id,mode};
