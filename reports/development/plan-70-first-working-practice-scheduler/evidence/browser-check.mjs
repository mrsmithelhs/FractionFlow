import { chromium } from 'playwright';
import { createServer } from 'vite';
const server=await createServer({server:{host:'127.0.0.1',port:5203}}); await server.listen();
const browser=await chromium.launch({headless:true,channel:'msedge'});
for(const [input,first,dist,relation,n,d,width] of [[0,'plan45-compare-02','distance-01','<','4','8',360],[3,'plan45-compare-09','distance-04','>','3','6',1366]]) {
 const page=await browser.newPage({viewport:{width,height:740}}); await page.addInitScript(value=>{Math.random=()=>value/4294967296},input);
 await page.goto('http://127.0.0.1:5203/FractionFlow/'); await page.screenshot({path:`reports/development/plan-70-first-working-practice-scheduler/evidence/entry-${width}.png`}); await page.getByRole('button',{name:'Start a practice session'}).click();
 const visual=page.locator('.app-visual-view');
 async function identity(id){await page.locator(`.app-episode[data-current-item-id="${id}"]`).waitFor();}
 await identity(first);
 async function compare(sign){await visual.locator(`.plan45-relation-option input[value="${sign}"]`).check();await visual.locator('.plan45-response-region').evaluate(el=>el.requestSubmit());}
 await visual.locator('summary').filter({hasText:'Help'}).first().click(); await visual.getByRole('button',{name:'Reasoning tip'}).first().click(); await compare('<'); await compare('>'); await visual.locator('.plan45-progression-button').click(); await identity('plan45-compare-10'); await compare('<'); await visual.locator('.plan45-progression-button').click(); await identity(dist);
 await compare(relation); await page.screenshot({path:`reports/development/plan-70-first-working-practice-scheduler/evidence/bridge-${width}.png`});
 await visual.locator('[data-plan51-focus="numerator"]').fill(n); await visual.locator('[data-plan51-focus="denominator"]').fill(d); await visual.locator('.plan51-response').evaluate(el=>el.requestSubmit());
 await visual.getByText("That's right.").waitFor(); await page.screenshot({path:`reports/development/plan-70-first-working-practice-scheduler/evidence/completion-${width}.png`}); await visual.getByRole('button',{name:'Back to start'}).click(); await page.getByRole('button',{name:'Start a practice session'}).waitFor(); console.log(`input ${input}: ${first}, compare-10, ${dist}; completed and returned`); await page.close();
}
const fallback=await browser.newPage();
await fallback.route('**/src/app/main.js', async route => {const response=await route.fetch(); const body=(await response.text()).replace('createFractionFlowApp({ root }).mount()', "createFractionFlowApp({ root, sessionTestHooks: { selectionInput: () => 3, prepare: candidate => { if (candidate.state.taskContext.itemId === 'distance-04') throw Error('injected unavailable candidate'); } } }).mount()"); await route.fulfill({response,body});});
await fallback.goto('http://127.0.0.1:5203/FractionFlow/'); await fallback.getByRole('button',{name:'Start a practice session'}).click();
const v=fallback.locator('.app-visual-view');
for(const [id,sign] of [['plan45-compare-02','>'],['plan45-compare-09','>'],['plan45-compare-11','='],['plan45-compare-10','<']]) {await fallback.locator(`.app-episode[data-current-item-id="${id}"]`).waitFor();await v.locator(`.plan45-relation-option input[value="${sign}"]`).check();await v.locator('.plan45-response-region').evaluate(el=>el.requestSubmit());await v.locator('.plan45-progression-button').click();}
await fallback.getByRole('button',{name:'Start a practice session'}).waitFor(); console.log('injected later candidate failure: fixed fallback completed and returned'); await fallback.close();
await browser.close(); await server.close();
