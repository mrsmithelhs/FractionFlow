import {createServer} from 'vite';import {chromium} from 'playwright';import {writeFile} from 'node:fs/promises';
const dir='reports/development/plan-92-generated-managed-practice', server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0},logLevel:'error'});let browser;
try{await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});let runs=[];
for(const id of ['plan45-compare-02','plan45-compare-09','plan45-compare-10'])for(const view of ['visual','linear']){
 const context=await browser.newContext({viewport:{width:650,height:740}}),page=await context.newPage();const errors=[];
 try{await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${dir}/fit92-comparison.html?item=${id}&support=high-support&view=${view}&condition=phase2-bundle-1`);await page.addStyleTag({content:'html{font-size:200% !important}'});const host=page.locator(view==='visual'?'.app-visual-view:not([hidden])':'.app-linear-view:not([hidden])');
 const hiddenHelp=await host.locator('.plan45-help-choices button').first().isVisible();
 async function sample(stage){const controls=host.locator('button,input,summary');const list=[];for(let i=0;i<await controls.count();i++){const c=controls.nth(i);if(!await c.isVisible())continue;await c.scrollIntoViewIfNeeded();list.push(await c.evaluate(e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {label:e.getAttribute('aria-label')||e.textContent.trim(),tag:e.tagName,font:s.fontSize,width:r.width,height:r.height,centerHit:hit===e||e.contains(hit),disabled:e.disabled??false};}));}return {stage,controls:list};}
 const initial=await sample('closed-help');await host.locator('.plan45-help-summary').click();const open=await sample('open-help');
 await host.locator('.plan45-help-summary').focus();const keyboard=[];
 for(let i=0;i<14;i++){await page.keyboard.press('Tab');keyboard.push(await page.evaluate(()=>{const e=document.activeElement;return {tag:e?.tagName,label:e?.tagName==='BODY'?'':(e?.getAttribute('aria-label')||e?.textContent?.trim()||'').slice(0,120)};}));}
 runs.push({id,view,hiddenHelpVisibleWhenClosed:hiddenHelp,initial,open,keyboard,errors});
 }catch(e){errors.push(String(e));runs.push({id,view,errors});}finally{await context.close();}
}
await writeFile(`${dir}/geometry92-controls.json`,JSON.stringify({scope:'Six standalone comparison runs at 650x740/200% CSS root, high support, both views; tests element visibility, text font size and center-point hit test after scroll. Does not prove full keyboard or screen-reader behavior.',browser:browser.version(),runs},null,2)+'\n');console.log(JSON.stringify({runs:runs.length,errors:runs.filter(x=>x.errors.length),hiddenHelpVisible:runs.filter(x=>x.hiddenHelpVisibleWhenClosed).length,missed:runs.flatMap(r=>[...(r.initial?.controls??[]),...(r.open?.controls??[])].filter(c=>!c.centerHit).map(c=>({id:r.id,view:r.view,...c})))}));
}finally{await browser?.close();await server.close();}
