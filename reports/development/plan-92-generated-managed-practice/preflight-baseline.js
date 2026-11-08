import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { prepareMagnitudeEntry, PLAN90_M0_SLOTS } from '../../../src/app/magnitude-session.js';
import { PLAN90_FAMILY_ENTRIES } from '../../../src/app/managed-family-entry.js';
const entries = [PLAN90_M0_SLOTS[0][0], PLAN90_FAMILY_ENTRIES['plan40-identify-one-half-one-eighth-8'], PLAN90_FAMILY_ENTRIES['plan40-inspect-two-thirds-one-fourth-12'], PLAN90_FAMILY_ENTRIES['plan40-construct-half-fifth-10']];
const root = document.querySelector('#app');
const app = createFractionFlowApp({root, presentationMode:'instant-test'}).mount();
window.baselinePreflight = () => {
  const totalStart = performance.now(), events=[];
  for (const entry of entries) {
    const start=performance.now();
    const candidate=prepareMagnitudeEntry(entry,'high-support');
    const scratchRoot=document.createElement('div');
    scratchRoot.setAttribute('aria-hidden','true'); scratchRoot.setAttribute('data-managed-renderer-preflight',''); scratchRoot.inert=true;
    Object.assign(scratchRoot.style,{position:'fixed',left:'-20000px',top:'0',width:`${root.getBoundingClientRect().width}px`,height:'0',overflow:'hidden',visibility:'hidden',pointerEvents:'none'});
    document.body.appendChild(scratchRoot);
    let scratch;
    try { scratch=createFractionFlowApp({root:scratchRoot,practiceTypes:[candidate.type],initialSupportLevelId:'high-support',presentationMode:'instant-test',rendererPreflight:true}); scratch.mount(); scratch.mountPreparedForPreflight(candidate); }
    finally { scratch?.destroy(); scratchRoot.remove(); }
    events.push({item:entry.itemId,ms:performance.now()-start});
  }
  return {events,totalMs:performance.now()-totalStart,scratchRemaining:document.querySelectorAll('[data-managed-renderer-preflight]').length};
};
window.baselineReady = true;
