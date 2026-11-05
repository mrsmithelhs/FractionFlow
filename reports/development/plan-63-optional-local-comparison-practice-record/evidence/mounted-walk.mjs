import { chromium } from 'playwright';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
const server=await createServer({server:{host:'127.0.0.1',port:5196,strictPort:true},logLevel:'silent'});await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});const ctx=await browser.newContext({viewport:{width:360,height:740}});const page=await ctx.newPage();
const url='http://127.0.0.1:5196/FractionFlow/';
async function read(p){return p.evaluate(async()=>{const r=indexedDB.open('fractionflow-comparison-record-v1');const d=await new Promise((a,b)=>{r.onsuccess=()=>a(r.result);r.onerror=()=>b(r.error)});return new Promise((a,b)=>{const q=d.transaction('record').objectStore('record').get('root');q.onsuccess=()=>a(q.result);q.onerror=()=>b(q.error)});});}
const radio=(p,word)=>p.getByRole('radio',{name:`The first fraction is ${word} the second fraction`}).filter({visible:true});
const check=p=>p.locator('[data-plan45-focus-key=check]').filter({visible:true}).click();
try {
 await page.goto(url); await page.locator('.comparison-record-panel > summary').click();
 assert.equal(await read(page),undefined); await page.getByRole('button',{name:'Start remembering'}).click();
 await page.getByRole('button',{name:'Compare fractions',exact:true}).click();
 await page.getByText('Need help?',{exact:true}).filter({visible:true}).click();
 await radio(page,'less than').check();await check(page);await radio(page,'greater than').check();await check(page);
 await page.getByRole('button',{name:'Next problem',exact:true}).filter({visible:true}).click();
 await page.waitForFunction(async()=>{const r=indexedDB.open('fractionflow-comparison-record-v1');return new Promise(ok=>{r.onsuccess=()=>{const q=r.result.transaction('record').objectStore('record').get('root');q.onsuccess=()=>ok(q.result?.entries[0]?.outcome==='accepted');};});});
 let root=await read(page); assert.equal(root.entries.length,1); assert.equal(root.entries[0].first,'retry');assert.equal(root.entries[0].firstAssistance.help,'yes');
 await page.getByRole('button',{name:'Back to start'}).filter({visible:true}).click();
 await page.locator('.comparison-record-panel > summary').evaluate(e=>{if(!e.parentElement.open)e.click();});
 await page.getByRole('button',{name:'View record'}).click();await page.locator('.comparison-record-panel').screenshot({path:'reports/development/plan-63-optional-local-comparison-practice-record/evidence/record-360.png'});
 await page.reload(); await page.getByRole('button',{name:'Compare fractions, then find a distance'}).click();
 // Session starts with 5/8 vs 3/8: incorrect less-than and exit unresolved.
 await radio(page,'less than').check();await check(page);await page.getByRole('button',{name:'Back to practice'}).filter({visible:true}).click();await page.getByRole('button',{name:'Leave',exact:true}).click();
 await page.waitForFunction(async()=>{const r=indexedDB.open('fractionflow-comparison-record-v1');return new Promise(ok=>{r.onsuccess=()=>{const q=r.result.transaction('record').objectStore('record').get('root');q.onsuccess=()=>ok(q.result?.entries.length===2);};});});
 root=await read(page);assert.equal(root.entries[1].outcome,'unresolved');assert.equal(root.entries[1].identity.itemId,'plan45-compare-02');
 const serialized=JSON.stringify(root);for(const forbidden of ['proposed','intentHistory','session','sourceForms','replay'])assert(!serialized.includes(forbidden));
 const other=await ctx.newPage();await other.goto(url);await other.locator('.comparison-record-panel > summary').click();await other.getByRole('button',{name:'Clear record',exact:true}).first().click();await other.getByRole('button',{name:'Clear record',exact:true}).last().click();
 await page.waitForTimeout(200);assert.equal((await read(page)).entries.length,0);
 // A clear in another tab invalidates the live episode and its later callback.
 await page.getByRole('button',{name:'Compare fractions',exact:true}).click();
 await page.getByText('Need help?',{exact:true}).filter({visible:true}).click();
 await page.getByRole('button',{name:'Model first amount'}).filter({visible:true}).click();
 await page.getByRole('button',{name:'Use the same denominator'}).filter({visible:true}).click();
 await radio(page,'less than').check();await check(page);
 await page.waitForFunction(async()=>{const r=indexedDB.open('fractionflow-comparison-record-v1');return new Promise(ok=>{r.onsuccess=()=>{const q=r.result.transaction('record').objectStore('record').get('root');q.onsuccess=()=>ok(q.result?.entries.length===1);};});});
 root=await read(page);assert.equal(root.entries[0].firstAssistance.model,'yes');assert.equal(root.entries[0].firstAssistance.construction,'yes');
 await other.locator('.comparison-record-panel > summary').click();await other.locator('.comparison-record-panel > summary').click();
 await other.getByRole('button',{name:'Clear record',exact:true}).first().click();await other.getByRole('button',{name:'Clear record',exact:true}).last().click();
 await page.getByText('A new problem is needed before activity can be remembered.').waitFor();
 await radio(page,'greater than').check();await check(page);await page.waitForTimeout(200);assert.equal((await read(page)).entries.length,0);
 await page.getByRole('button',{name:'Next problem',exact:true}).filter({visible:true}).click();
 await radio(page,'less than').check();await check(page);
 await page.waitForFunction(async()=>{const r=indexedDB.open('fractionflow-comparison-record-v1');return new Promise(ok=>{r.onsuccess=()=>{const q=r.result.transaction('record').objectStore('record').get('root');q.onsuccess=()=>ok(q.result?.entries.length===1);};});});
 await other.locator('.comparison-record-panel > summary').click();await other.locator('.comparison-record-panel > summary').click();
 await other.getByRole('button',{name:'Stop remembering',exact:true}).first().click();await other.getByRole('button',{name:'Stop remembering',exact:true}).last().click();
 await page.getByText('This problem is no longer being remembered.').filter({visible:true}).waitFor();
 await radio(page,'greater than').check();await check(page);await page.waitForTimeout(200);root=await read(page);assert.equal(root.enabled,false);assert.equal(root.entries.length,1);assert.equal(root.entries[0].outcome,'unresolved'); console.log(JSON.stringify({chrome:browser.version(),firstVisit:'no root',standalone:'retry then correct retained on Next',help:'opening help captured',session:'retry remains unresolved after exit',reload:'new session starts fresh',twoTab:'clear removed entries',privacy:'no raw intent/session fields',viewport:'360x740'}));
}finally{await ctx.close();await browser.close();await server.close();}
