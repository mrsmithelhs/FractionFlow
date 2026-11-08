import { createServer } from 'vite';
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const dir='reports/development/plan-92-generated-managed-practice';
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});
let browser;
try {
  await server.listen(); browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
  const runs=[];
  for (let i=0;i<8;i++) {
    const context=await browser.newContext({viewport:{width:1365,height:768}});
    const page=await context.newPage(); const cdp=await context.newCDPSession(page);
    await cdp.send('Network.setCacheDisabled',{cacheDisabled:true}); await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    const start=performance.now();
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${dir}/preflight-baseline.html`,{waitUntil:'load'});
    await page.waitForFunction(()=>window.baselineReady===true);
    const readyMs=performance.now()-start;
    const preflight=await page.evaluate(()=>window.baselinePreflight());
    runs.push({sample:i,readyMs,preflight}); await context.close();
  }
  await writeFile(`${dir}/preflight-baseline.json`,JSON.stringify({method:'Cold fresh Chrome context, cache disabled, 1365x768, fourfold CPU slowdown; report-local four-item Plan 90 prepare and inert scratch mount, not Plan 92 integrated Start or physical Chromebook. Navigation-to-ready includes harness/network. Eight samples are exploratory, not a performance guarantee.',browser:browser.version(),runs},null,2)+'\n');
  console.log(JSON.stringify(runs));
} finally {await browser?.close();await server.close();}
