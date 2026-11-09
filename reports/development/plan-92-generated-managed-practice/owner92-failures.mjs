import {createServer} from 'vite';import {chromium} from 'playwright';import {writeFile} from 'node:fs/promises';
const dir='reports/development/plan-92-generated-managed-practice',server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0},logLevel:'error'});let browser;const results={};
try{await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});for(const mode of ['no-lock','no-storage']){
 const context=await browser.newContext({viewport:{width:1093,height:614}}),page=await context.newPage(),name=`ff92-${mode}-${Date.now()}`;
 try{await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${dir}/owner92-preview.html?name=${encodeURIComponent(name)}&seed=0&${mode}=1`);await page.waitForFunction(()=>window.owner92);
 await page.getByRole('button',{name:'Remember practice on this browser'}).click();await page.waitForFunction(()=>document.querySelector('#expanded-record section [role=status]')?.textContent.includes('could not be confirmed'));
 await page.locator('[data-session-entry="comparison"]').click();await page.waitForFunction(()=>owner92.app.getManagedSessionWitness()?.shapeId);const result=await page.evaluate(()=>({shape:owner92.app.getManagedSessionWitness().shapeId,status:document.querySelector('#preview-status').textContent}));
 if(result.shape!=='C-I-S-T')throw Error(`${mode}: no direct practice`);results[mode]={...result,practiceAvailable:true};
 }finally{await context.close()}}
 await writeFile(`${dir}/owner92-failures.json`,JSON.stringify({scope:'Isolated preview, unavailable Web Locks or IndexedDB injected, disposable Chrome contexts.',browser:browser.version(),results},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await browser?.close();await server.close()}
