import assert from 'node:assert/strict';
import { setupMockDOM, teardownMockDOM } from '../../../tests/fixtures/mock-dom.js';
import { createOperateResponse } from '../../../src/render/operate-response.js';
import { STRINGS } from '../../../src/render/strings.js';
const document = setupMockDOM();
try {
  const activeBeatRoot=document.createElement('section'); const controlsRoot=document.createElement('div');
  activeBeatRoot.appendChild(controlsRoot); document.body.appendChild(activeBeatRoot);
  const response=createOperateResponse({scene:{meaning:{currentTask:{},takeaway:null,quantities:{left:{currentForm:{denominator:'5'}}},unitRelationship:{commonUnit:{kind:'already-shared-unit'}},status:{recovery:null}}},strings:STRINGS,inputPrefix:'negative-control',activeBeatRoot,controlsRoot,dispatchAction:()=>{}});
  response.elements.forEach((element)=>controlsRoot.appendChild(element));
  const inputs=controlsRoot.querySelectorAll('.control-fraction-input'); inputs[0].setAttribute('aria-describedby','existing-help');
  controlsRoot.querySelector('.control-submit-btn').click();
  assert.notEqual(controlsRoot.querySelector('.control-fraction-error').textContent,'');
  assert.equal(inputs[0].getAttribute('aria-describedby'),'existing-help');
  assert.equal(inputs[1].hasAttribute('aria-describedby'),false);
  console.log(JSON.stringify({pass:true,control:'non-takeaway shared-unit fraction response',alertRemainsLocal:true,unrelatedDescriptionPreserved:true}));
} finally { teardownMockDOM(); }
