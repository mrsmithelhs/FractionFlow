import { chromium } from 'playwright';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
const server=await createServer({server:{host:'127.0.0.1',port:5198,strictPort:true},logLevel:'silent'}); await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for(const [name,viewport] of [['narrow',{width:360,height:740}],['chromebook',{width:1093,height:614}]]) {
  const ctx=await browser.newContext({viewport,reducedMotion:'reduce'}); const p=await ctx.newPage(); p.setDefaultTimeout(8000); console.log(name,'start');
  await p.goto('http://127.0.0.1:5198/FractionFlow/', {waitUntil:'domcontentloaded', timeout:20000});
  if(name==='narrow') await p.addStyleTag({content:'html { font-size: 200% !important; }'});
  await p.locator('.comparison-record-panel > summary').click(); await p.getByRole('button',{name:'Start remembering'}).click();
  const read=()=>p.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('fractionflow-comparison-record-v1');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const q=r.result.transaction('record').objectStore('record').get('root');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);};}));
  await p.getByRole('button',{name:'Compare fractions',exact:true}).click();
  const visible=s=>p.locator(s).filter({visible:true});
  const relation=word=>p.getByRole('radio',{name:`The first fraction is ${word} the second fraction`}).filter({visible:true});
  await relation('less than').check(); await visible('[data-plan45-focus-key=check]').click();
  await p.waitForTimeout(500); console.log('first record',JSON.stringify(await read()));
  await p.getByRole('button',{name:'Back to start',exact:true}).filter({visible:true}).click();
  let stored=await read(); assert.equal(stored.enabled,true); assert.equal(stored.entries.length,1);
  console.log('session start'); await p.getByRole('button',{name:'Compare fractions, then find a distance'}).click();
  assert.equal(await p.locator('.app-return-button').textContent(),'Back to start');
  const order=await p.locator('.app-episode').evaluate(e=>[...e.children].map(x=>x.className)); assert(order.indexOf('app-view-controls')<order.indexOf('app-episode-navigation'));
  console.log('buttons',await p.locator('button:visible').allTextContents()); await p.getByText('Need help?',{exact:true}).filter({visible:true}).click(); await p.getByRole('button',{name:'Use the same denominator'}).filter({visible:true}).click(); const input=visible('.plan49-helper-input').first(); await input.fill('8');
  const exit=p.locator('.app-return-button'); await exit.focus(); await exit.click(); await p.getByRole('button',{name:'Stay',exact:true}).focus(); await p.keyboard.press('Escape'); assert.equal(await input.inputValue(),'8'); assert(await exit.evaluate(e=>document.activeElement===e));
  await exit.click(); await p.getByRole('button',{name:'Leave',exact:true}).click(); stored=await read(); assert.equal(stored.enabled,true); assert.equal(stored.entries.length,1);
  console.log('session start'); await p.getByRole('button',{name:'Compare fractions, then find a distance'}).click();
  for(const word of ['greater than','less than','equal to']) {await relation(word).check(); await visible('[data-plan45-focus-key=check]').click(); await p.getByRole('button',{name:/^Next/}).filter({visible:true}).click();}
  await p.getByRole('radio',{name:'First amount is less than second amount'}).filter({visible:true}).check(); await visible('.plan51-response button[type=submit]').click();
  await visible('[data-plan51-focus=numerator]').fill('4'); await visible('[data-plan51-focus=denominator]').fill('8'); await visible('.plan51-response button[type=submit]').click();
  assert.equal(await p.locator('.app-return-button').isVisible(),false); const final=p.getByRole('button',{name:'Back to start',exact:true}).filter({visible:true}); assert.equal(await final.count(),1);
  await p.screenshot({path:`reports/development/plan-64-house-app-shell-and-navigation-contract/evidence/${name}-final.png`,fullPage:true}); await final.click(); assert(await p.locator('.app-entry-page').isVisible());
  stored=await read(); assert.equal(stored.enabled,true); assert(stored.entries.length>=1);
  results.push({name,viewport,rootText:name==='narrow'?'200%':'default',reducedMotion:true,order,recordEnabled:stored.enabled,entries:stored.entries.length}); await ctx.close();
 }
 console.log(JSON.stringify({browser:browser.version(),results},null,2));
} finally {await browser.close(); await server.close();}
