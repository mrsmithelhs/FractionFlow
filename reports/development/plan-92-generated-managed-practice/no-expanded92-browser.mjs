import {createServer} from 'vite';
import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const dir='reports/development/plan-92-generated-managed-practice';
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0},logLevel:'error'});let browser,context;
try{
 await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});context=await browser.newContext({viewport:{width:1093,height:614}});const page=await context.newPage(),base=`http://127.0.0.1:${server.httpServer.address().port}`;
 // Entire context is disposable; this creates only a synthetic v1 record.
 await page.goto(`${base}/${dir}/storage92-fixture.html`);await page.waitForFunction(()=>window.storage92);
 const before=await page.evaluate(async()=>{const s=storage92.createComparisonRecordStorage();const r=await s.enable();s.close();return r});
 await page.addInitScript(()=>{window.dbTrace={opens:[],gets:[]};const o=IDBFactory.prototype.open;IDBFactory.prototype.open=function(name,version){window.dbTrace.opens.push({name,version});return o.call(this,name,version)};const g=IDBObjectStore.prototype.get;IDBObjectStore.prototype.get=function(key){window.dbTrace.gets.push({store:this.name,key});return g.call(this,key)}});
 await page.goto(`${base}/${dir}/integration92-preview.html?seed=0`);await page.locator('[data-session-entry="comparison"]').waitFor();
 await page.waitForFunction(()=>window.dbTrace.opens.length>0);await page.locator('[data-session-entry="comparison"]').click();await page.waitForFunction(()=>window.integration92App.getState()?.taskContext?.itemId);
 const result=await page.evaluate(async()=>{await new Promise(resolve=>setTimeout(resolve,100));const trace=structuredClone(window.dbTrace),witness=window.integration92App.getManagedSessionWitness();const version=await new Promise((resolve,reject)=>{const r=indexedDB.open('fractionflow-comparison-record-v1');r.onsuccess=()=>{const v=r.result.version;r.result.close();resolve(v)};r.onerror=()=>reject(r.error)});return {trace,witness,version}});
 if(!before.enabled||result.version!==1||result.witness.shapeId!=='C-I-S-T'||result.trace.opens.some(x=>x.version!==1)||result.trace.gets.some(x=>x.store==='expanded'||x.key==='events'))throw Error(`no-expanded witness failed: ${JSON.stringify(result)}`);
 await writeFile(`${dir}/no-expanded92-browser.json`,JSON.stringify({scope:'Ordinary mounted Start in a disposable Chrome context with synthetic legacy v1 comparison remembering enabled and no expanded consent; captures initial open/get calls through Start.',browser:browser.version(),legacyEnabled:before.enabled,...result},null,2)+'\n');console.log(JSON.stringify(result));
}finally{await context?.close();await browser?.close();await server.close()}
