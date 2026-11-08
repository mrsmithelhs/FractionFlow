import '../../../src/app/styles.css'; import '../../../src/styles/render.css';
import {selectFittingPracticeSession} from '../../../src/app/magnitude-session.js';
import {createFractionFlowApp} from '../../../src/app/app.js';
const params=new URLSearchParams(location.search),seed=Number(params.get('seed')??'0');
const fixture=params.get('fixture');const allowed=fixture==='admit'?['plan45-compare-09','plan45-compare-10','distance-04']:[];
window.managedApp=createFractionFlowApp({root:document.querySelector('#app'),presentationMode:'instant-test',sessionTestHooks:{selectionInput:()=>seed,...(fixture?{selectManifest:input=>selectFittingPracticeSession(input,allowed)}:{})}}).mount();
