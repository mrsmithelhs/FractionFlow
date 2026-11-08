import {createServer} from 'vite';
import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const dir='reports/development/plan-92-generated-managed-practice';
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});let browser;
try {
 await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});const runs=[];
 for(let i=0;i<8;i++){
  const context=await browser.newContext({viewport:{width:1365,height:768}}),page=await context.newPage(),cdp=await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  const t=performance.now();await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/reports/development/plan-90-goal-linked-managed-practice/integration-preview.html?seed=3`,{waitUntil:'load'});
  await page.locator('[data-session-entry="comparison"]').waitFor();const readyMs=performance.now()-t;
  const result=await page.evaluate(()=>{const button=document.querySelector('[data-session-entry="comparison"]');const start=performance.now();button.click();const ms=performance.now()-start;const state=window.integrationApp.getState();return {ms,item:state?.taskContext?.itemId??null,active:!!state,remainingScratch:document.querySelectorAll('[data-managed-renderer-preflight]').length};});
  runs.push({sample:i,readyMs,...result});await context.close();
 }
 await writeFile(`${dir}/start-baseline.json`,JSON.stringify({method:'Existing Plan 90 ordinary Start, seed 3 U1 identify/inspect/construct; full existing selector, preflight, install and fit checks; fresh Chrome contexts, cache disabled, 1365x768 and 4x CPU slowdown. Test preview uses instant-test presentation; not Plan 92 generated Start or physical Chromebook. Navigation includes Vite cold transformation.',browser:browser.version(),runs},null,2)+'\n');
 console.log(JSON.stringify(runs));
}finally{await browser?.close();await server.close();}
