import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
const require = createRequire(path.resolve('package.json'));
const {runRouteMatrix, createStaticServer, executeAction} = require('./scripts/dev/run-route-matrix.js');
const output = new URL('./orchestration-repair01-execution.json', import.meta.url);
const names = execFileSync('git', ['ls-files', 'reports', 'docs/routes/evidence'], {encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const before = new Map(names.map(n => [n, fs.readFileSync(n)]));
const receipt = {baseline:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(), runs:[], probes:[], changedCaptureBytes:[], limits:'Focused native Chrome, freshly built dist. Committed evidence restored byte-for-byte. Full historical matrix remains implementer evidence.'};
const compact = r => ({total:r.total, passed:r.passed, failed:r.failed, seedDetected:r.seedDetected});
let browser, server;
try {
  receipt.runs.push({mode:'clean-plan40', ...compact(await runRouteMatrix({filter:'ROUTE-PLAN40-', preferredChannel:'chrome', verbose:false}))});
  for (const seed of ['erased-takeaway-hatch-after-transform','addition-wording-in-subtraction','premature-difference-leak','missing-operate-fraction-inputs']) {
    receipt.runs.push({mode:seed, ...compact(await runRouteMatrix({plan40WitnessSeed:seed, preferredChannel:'chrome', verbose:false}))});
  }
  server = createStaticServer(); await new Promise(r => server.listen(0,'127.0.0.1',r));
  browser = await chromium.launch({channel:'chrome',headless:true});
  const page = await browser.newPage({viewport:{width:360,height:740}});
  const route = JSON.parse(fs.readFileSync('tests/routes/route-matrix.json','utf8')).routes.find(r => r.id==='ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE');
  await page.goto(`http://127.0.0.1:${server.address().port}/FractionFlow/`);
  for (const a of route.actions.slice(0,6)) await executeAction(page,a,route.id);
  receipt.currentVisibleLabels = await page.locator('.app-visual-view .control-label').allTextContents();
  for (const mode of ['accessible-only','stacked']) {
    await page.locator('.app-visual-view .active-beat-prompt').evaluate((el,mode) => {
      const leak=document.createElement('span'); leak.id='review-injected-leak';
      if(mode==='accessible-only'){leak.setAttribute('role','img');leak.setAttribute('aria-label','3/10');}
      else {leak.innerHTML='<span style="display:inline-flex;flex-direction:column"><span>3</span><span style="border-top:1px solid">10</span></span>';}
      el.append(leak);
    }, mode);
    let rejected=false, error=null;
    try {await executeAction(page,route.actions[6],route.id);} catch(e){rejected=true;error=e.message;}
    receipt.probes.push({mode, rejected, error});
    await page.locator('#review-injected-leak').evaluate(el=>el.remove());
  }
  const screenshot={method:'screenshot',file:'reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/repair01-review-partial-controls.png',measureLayout:true};
  await page.locator('.app-visual-view .active-beat-controls').evaluate(el=>{el.style.transform='translateY(300px)';});
  let rejected=false,error=null;
  try {await executeAction(page,screenshot,route.id);}catch(e){rejected=true;error=e.message;}
  receipt.probes.push({mode:'partially-offscreen-controls',rejected,error,layout:screenshot.screenshotEvidence?.layout});
  fs.rmSync(screenshot.file,{force:true});
} catch(e) {receipt.error=e.stack;process.exitCode=1;}
finally {
  if(browser)await browser.close(); if(server)await new Promise(r=>server.close(r));
  for(const [name,bytes] of before){if(!fs.existsSync(name)||!fs.readFileSync(name).equals(bytes)){if(name.endsWith('.png'))receipt.changedCaptureBytes.push(name);fs.writeFileSync(name,bytes);}}
  fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n'); console.log(JSON.stringify(receipt));
}
