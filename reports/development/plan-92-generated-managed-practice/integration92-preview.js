import '../../../src/app/styles.css';import '../../../src/styles/render.css';import {createFractionFlowApp} from '../../../src/app/app.js';
const seed=Number(new URLSearchParams(location.search).get('seed'));window.integration92Preflights=[];
window.integration92App=createFractionFlowApp({root:document.querySelector('#app'),presentationMode:'instant-test',sessionTestHooks:{selectionInput:()=>seed,preflightMount:c=>window.integration92Preflights.push({item:c.state.taskContext.itemId,time:performance.now()})}}).mount();
