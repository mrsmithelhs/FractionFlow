import { createServer } from 'vite'; import { chromium } from 'playwright'; import { strict as assert } from 'node:assert';
const server=await createServer({server:{host:'127.0.0.1',port:5323,strictPort:true}});await server.listen(); const browser=await chromium.launch({channel:'chrome',headless:true});
try {const page=await browser.newPage(); await page.goto('http://127.0.0.1:5323/FractionFlow/');
 const result=await page.evaluate(async()=>{
  const {createFractionFlowApp}=await import('/FractionFlow/src/app/app.js'); const {PLAN58_CONSTRUCTION_PRACTICE_TYPE}=await import('/FractionFlow/src/app/practice-types.js');
  document.body.replaceChildren(); const root=document.createElement('div');document.body.append(root);
  const type={...PLAN58_CONSTRUCTION_PRACTICE_TYPE,items:[PLAN58_CONSTRUCTION_PRACTICE_TYPE.items[0],{...PLAN58_CONSTRUCTION_PRACTICE_TYPE.items[1],id:'not-registered'}]};
  const app=createFractionFlowApp({root,practiceTypes:[type],presentationMode:'instant-test'}).mount(); root.querySelector('[data-practice-type=whole-plus-fraction-construction]').click();
  const visual=root.querySelector('.app-visual-view .plan58-construction');
  for(const [field,value] of [['whole','0'],['pieces','3']]){const n=visual.querySelector(`[data-field=${field}]`);n.value=value;n.dispatchEvent(new Event('input',{bubbles:true}));}
  [...visual.querySelectorAll('button')].find(n=>n.textContent==='Check').click();
  [...visual.querySelectorAll('button')].find(n=>n.textContent==='Next problem').click();
  const notice=root.querySelector('.app-navigation-notice'); const result={status:app.getState().status,item:app.getState().taskContext.itemId,visible:!notice.hidden,notice:notice.textContent,focused:document.activeElement===notice};app.destroy();return result;
 });
 assert.equal(result.status,'resolved');assert.equal(result.item,'three-fourths');assert.equal(result.visible,true);assert.equal(result.focused,true);assert.ok(result.notice);console.log('failed next-item preparation preserves accepted state and focuses notice',JSON.stringify(result));
} finally {await browser.close();await server.close();}


