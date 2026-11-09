import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import {createFractionFlowApp} from '../../../src/app/app.js';
import {createPlan92RecordBridge} from '../../../src/app/plan92-record-bridge.js';
import {createComparisonRecordStorage} from '../../../src/app/comparison-record-storage.js';
const params=new URLSearchParams(location.search),name=params.get('name');
window.bridge92=params.get('mode')==='old'?createComparisonRecordStorage({name}):createPlan92RecordBridge({name});
window.bridge92App=createFractionFlowApp({root:document.querySelector('#app'),presentationMode:'instant-test',sessionTestHooks:{selectionInput:()=>0,recordStorage:window.bridge92}}).mount();
