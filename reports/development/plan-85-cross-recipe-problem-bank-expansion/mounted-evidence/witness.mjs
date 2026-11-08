// Test-only interception supplies one staged record to the real app module.
// No production registry, source file, or deployed site is changed.
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {admitPlan51Record} from '../../../../src/content/plan51-distance-task.js';
const output=path.dirname(fileURLToPath(import.meta.url));
const pool=JSON.parse(await readFile(new URL('../plan51-candidates.json',import.meta.url),'utf8'));
const candidate=pool.candidates.find(r=>r.itemId==='distance-plan85-01');assert.ok(candidate);
const admitted=admitPlan51Record(candidate);assert.equal(String(admitted.distance.numerator),'1');assert.equal(String(admitted.distance.denominator),'6');
const moduleBody=`import { deepFreeze } from '../schema.js';\nexport const PLAN51_DISTANCE_RECORDS = deepFreeze([${JSON.stringify(candidate)}]);\n`;
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});
let browser;const results=[],errors=[];
try {
  await server.listen();const url=`http://127.0.0.1:${server.httpServer.address().port}/`;
  browser=await chromium.launch({headless:true,...(process.env.PLAN85_CHROME_PATH?{executablePath:process.env.PLAN85_CHROME_PATH}:{}),args:['--no-proxy-server']});
  for(const size of [{name:'narrow',width:360,height:740,view:'linear'},{name:'school-width',width:1093,height:614,view:'visual'}]){
    const context=await browser.newContext({viewport:{width:size.width,height:size.height},deviceScaleFactor:1});const page=await context.newPage();let intercepted=0;
    page.on('pageerror',error=>errors.push(`${size.name}: ${error.message}`));
    await page.route('**/src/content/data/plan51-distance-records.js*',route=>{intercepted++;return route.fulfill({status:200,contentType:'application/javascript',body:moduleBody});});
    await page.goto(url);const choice=page.locator('[data-practice-type="fraction-distance"]');
    if(!(await choice.isVisible()))await page.getByRole('button',{name:'Choose what to practice'}).click();
    await choice.click();if(size.view==='linear')await page.getByRole('button',{name:'Read the steps'}).click();
    const host=page.locator(size.view==='linear'?'.app-linear-view':'.app-visual-view');
    await host.locator('input[value="<"]').check();await host.locator('.plan51-response button[type="submit"]').click();
    await host.locator('[data-plan51-focus="numerator"]').fill('1');await host.locator('[data-plan51-focus="denominator"]').fill('6');await host.locator('.plan51-response button[type="submit"]').click();
    const accepted=await host.locator('.plan51-success').textContent(),displayedResult=await host.locator('.plan51-result').innerText();
    assert.match(accepted,/right/i);assert.match(displayedResult,/Distance/);assert.ok(intercepted>0);
    await page.screenshot({path:path.join(output,`${size.name}-accepted.png`),fullPage:true});
    results.push({viewport:{width:size.width,height:size.height},view:size.view,candidateId:candidate.itemId,answer:'1/6',accepted,displayedResult,intercepted});
    await context.close();
  }
  assert.deepEqual(errors,[]);
  await writeFile(path.join(output,'observations.json'),JSON.stringify({method:'Vite-served current source; test-only route interception substitutes a single Plan 51 record module response',candidate,expectedExactDistance:'4/6 - 3/6 = 1/6',results,pageErrors:errors},null,2)+'\n');
  console.log(JSON.stringify({journeys:results.length,candidate:candidate.itemId,pageErrors:errors}));
} finally {await browser?.close();await server.close();}
