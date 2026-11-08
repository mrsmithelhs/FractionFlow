import {createServer} from 'vite';import {chromium} from 'playwright';import {writeFile} from 'node:fs/promises';
const dir='reports/development/plan-92-generated-managed-practice';const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});let browser;
try{await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});const runs=[];
for(const [width,height,scale] of [[1093,614,100],[650,740,200],[600,740,200],[480,740,200],[360,740,100]])for(const support of ['high-support','medium-support'])for(const condition of ['phase2-bundle-1','phase2-bundle-2','phase2-bundle-3','phase2-bundle-4']){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${dir}/scratch92-fixture.html`);await page.waitForFunction(()=>window.scratchReady);if(scale!==100)await page.addStyleTag({content:`html{font-size:${scale}% !important}`});
 const result=await page.evaluate(args=>window.scratch92(args),{support,condition});runs.push({width,height,scale,support,condition,...result});await context.close();
}
await writeFile(`${dir}/scratch92-observations.json`,JSON.stringify({scope:'Isolated exact-identity scratch preparation, existing family fit class and inert renderer mount in emulated Chrome; both participation hosts checked. Not ordinary Start, per-stage fit approval, managed admission or learner evidence. Comparison uses its static comparison display condition.',browser:browser.version(),runs},null,2)+'\n');
console.log(JSON.stringify({runs:runs.length,mounted:runs.flatMap(r=>r.events).filter(x=>x.mounted).length,rejected:runs.flatMap(r=>r.events).filter(x=>!x.fitClass).length,failures:runs.flatMap(r=>r.events).filter(x=>x.fitClass&&(!x.mounted||x.views.some(v=>!v.hostMatch))).slice(0,10)}));
}finally{await browser?.close();await server.close();}
