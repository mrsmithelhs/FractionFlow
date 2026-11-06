import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'vite';
const server=await createServer({server:{host:'127.0.0.1',port:5204}});await server.listen();
const browser=await chromium.launch({channel:'msedge',headless:true});
async function readRecord(page){return page.evaluate(()=>new Promise((resolve,reject)=>{const q=indexedDB.open('fractionflow-comparison-record-v1',1);q.onerror=()=>reject(q.error);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('record'))q.result.createObjectStore('record');};q.onsuccess=()=>{const db=q.result,tx=db.transaction('record','readonly'),r=tx.objectStore('record').get('root');r.onsuccess=()=>{const v=r.result;db.close();resolve(v??null);};r.onerror=()=>reject(r.error);};}));}
async function waitEntries(page,n){for(let i=0;i<50;i++){const root=await readRecord(page);if((root?.entries?.length??0)===n)return root;await page.waitForTimeout(100);}throw Error('record count did not reach '+n);}
const receipts=[];
for(const mode of ['keyboard-linear-on','touch-off']){
 const keyboard=mode.startsWith('keyboard'),context=await browser.newContext({viewport:{width:360,height:740},hasTouch:!keyboard,isMobile:!keyboard});const page=await context.newPage();await page.addInitScript(()=>{Math.random=()=>3/4294967296;});
 await page.goto('http://127.0.0.1:5204/FractionFlow/');
 async function activate(locator){await locator.waitFor({state:'visible'});if(keyboard){await locator.focus();await page.keyboard.press('Enter');}else await locator.tap();}
 if(keyboard){await activate(page.locator('.comparison-record-panel summary'));await activate(page.getByRole('button',{name:'Start remembering'}));await page.getByText('Remembering comparison activity on this browser.',{exact:false}).waitFor();}
 await activate(page.getByRole('button',{name:'Start a practice session'}));
 if(keyboard)await activate(page.getByRole('button',{name:'Read the steps'}));
 const view=page.locator(keyboard?'.app-linear-view':'.app-visual-view');
 async function identity(id){await page.locator(`.app-episode[data-current-item-id="${id}"]`).waitFor();}
 async function compare(sign){const input=view.locator(`.plan45-relation-option input[value="${sign}"]`);await input.waitFor({state:'visible'});if(keyboard){await input.focus();await page.keyboard.press('Space');}else await input.tap();await activate(view.locator('.plan45-response-region button[type="submit"]'));}
 for(const [index,id,sign] of [[0,'plan45-compare-09','>'],[1,'plan45-compare-10','<']]){await identity(id);await compare(sign);await waitEntries(page,keyboard?index+1:0);await activate(view.locator('.plan45-progression-button'));}
 await identity('distance-04');await compare('>');
 for(const [field,value] of [['numerator','3'],['denominator','6']]){const input=view.locator(`[data-plan51-focus="${field}"]`);if(keyboard){await input.focus();await page.keyboard.type(value);}else{await input.tap();await page.keyboard.type(value);}}
 await activate(view.locator('.plan51-response button[type="submit"]'));await view.getByText("That's right.").waitFor();const root=await waitEntries(page,keyboard?2:0);const ids=(root?.entries??[]).map(e=>e.identity?.itemId);assert.deepEqual(ids,keyboard?['plan45-compare-09','plan45-compare-10']:[]);await activate(view.getByRole('button',{name:'Back to start'}));
 await activate(page.getByRole('button',{name:'Choose what to practice'}));await activate(page.locator('[data-session-entry="magnitude"]'));await identity('plan45-compare-02');
 receipts.push({mode,input:3,items:['plan45-compare-09','plan45-compare-10','distance-04'],remembering:keyboard?'on':'off',recordItemIds:ids,legacyFirst:'plan45-compare-02',access:keyboard?'focused controls with Enter/Space and text typing, linear view':'touchscreen taps on controls; text entered with keyboard'});await context.close();
}
console.log(JSON.stringify(receipts,null,2));await browser.close();await server.close();
