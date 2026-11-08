import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { measureManagedPracticeFit } from '../../../src/app/managed-fit.js';
let failMount = false;
window.integrationFailMount = value => { failMount = value; };
window.integrationApp = createFractionFlowApp({root:document.querySelector('#app'), presentationMode:'instant-test',
  sessionTestHooks:{afterDisplay:()=>{if(failMount)throw Error('forced post-mount failure');}}}).mount();
window.integrationFit = () => measureManagedPracticeFit(document.querySelector('.fractionflow-app'));
