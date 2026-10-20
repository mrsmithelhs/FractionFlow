import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
const require=createRequire(path.resolve('package.json'));
const {runRouteMatrix,createStaticServer,executeAction}=require('./scripts/dev/run-route-matrix.js');
const output=new URL('./orchestration-stage5-execution.json',import.meta.url);
const names=execFileSync('git',['ls-files','reports','docs/routes/evidence'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const before=new Map(names.map(n=>[n,fs.readFileSync(n)]));
const receipt={baseline:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),runs:[],draftProbe:[],limits:'Focused Chrome rerun of 8 new routes and four seeds; historical full matrix is implementer evidence. Existing tracked captures/receipts restored byte-for-byte.'};
const compact=r=>({routeCount:r.routeCount,total:r.total,passed:r.passed,failed:r.failed,seedDetected:r.seedDetected,results:r.results.map(x=>({routeId:x.routeId,status:x.status,error:x.error}))});
let browser,server;
try {
 receipt.runs.push({mode:'clean-plan40',...compact(await runRouteMatrix({filter:'ROUTE-PLAN40-',preferredChannel:'chrome',verbose:false}))});
 for(const seed of ['erased-takeaway-hatch-after-transform','addition-wording-in-subtraction','premature-difference-leak','missing-operate-fraction-inputs']) receipt.runs.push({mode:seed,...compact(await runRouteMatrix({plan40WitnessSeed:seed,preferredChannel:'chrome',verbose:false}))});
 server=createStaticServer(); await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({channel:'chrome',headless:true}); const page=await browser.newPage({viewport:{width:360,height:740}});
 await page.goto(`http://127.0.0.1:${server.address().port}/FractionFlow/`);
 const route=JSON.parse(fs.readFileSync('tests/routes/route-matrix.json','utf8')).routes.find(x=>x.id==='ROUTE-PLAN40-HELP-RECOVERY-VIEW-TOGGLE');
 for(const action of route.actions){
   await executeAction(page,action,route.id);
   if(action.step===13||action.step===15){
     const prefix=action.step===13?'linear-':'';
     const values=await Promise.all(['numerator','denominator'].map(k=>page.locator(`#${prefix}operate-fraction-${k}-input`).inputValue()));
     receipt.draftProbe.push({afterStep:action.step,values,expected:['3','10'],preserved:values[0]==='3'&&values[1]==='10'});
   }
 }
} catch(error){receipt.error=error.stack; process.exitCode=1;}
finally{
 if(browser)await browser.close(); if(server)await new Promise(r=>server.close(r));
 const restored=[];for(const [n,b] of before){if(!fs.existsSync(n)||!fs.readFileSync(n).equals(b)){fs.writeFileSync(n,b);restored.push(n);}}
 receipt.restoredTrackedArtifacts=restored;
 fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n'); console.log(JSON.stringify(receipt));
}
