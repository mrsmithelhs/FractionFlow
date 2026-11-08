import {createServer} from 'vite';
import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const dir='reports/development/plan-90-goal-linked-managed-practice';
const output=process.env.PLAN90_REPAIR_OUTPUT??'repair-launch-before.json';
const server=process.env.PLAN90_EXISTING === '1' ? null : await createServer({server:{host:'127.0.0.1',port:5199,strictPort:true},logLevel:'error'});
let browser;const runs=[];
try{
  await server?.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server','--disable-features=OverlayScrollbar']});
  for(const [width,height] of [[570,668],[1093,614]])for(const scroll of ['auto','always','episode-gutter','episode-gutter-baseline','classic-native','classic-baseline'])for(let seed=0;seed<4;seed++){
    const page=await browser.newPage({viewport:{width,height}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:5199/FractionFlow/${dir}/integration-preview.html?seed=${seed}`);
    if(scroll==='always')await page.addStyleTag({content:'html { overflow-y: scroll !important; }'});
    if(scroll==='episode-gutter')await page.addStyleTag({content:'html:has(.app-entry-page[hidden]) { scrollbar-gutter: stable; }'});
    if(scroll==='episode-gutter-baseline')await page.addStyleTag({content:'html { overflow-y: auto !important; scrollbar-gutter: auto !important; } html:has(.app-entry-page[hidden]) { scrollbar-gutter: stable !important; }'});
    if(scroll==='classic-native')await page.addStyleTag({content:'::-webkit-scrollbar { width: 15px; }'});
    if(scroll==='classic-baseline')await page.addStyleTag({content:'html { overflow-y: auto !important; scrollbar-gutter: auto !important; } ::-webkit-scrollbar { width: 15px; }'});
    const before=await page.evaluate(()=>({fit:window.integrationFit(),innerWidth,clientWidth:document.documentElement.clientWidth,scrollHeight:document.documentElement.scrollHeight,clientHeight:document.documentElement.clientHeight}));
    await page.locator('[data-session-entry="comparison"]').click();
    const after=await page.evaluate(()=>({state:window.integrationApp.getState()?.taskContext?.itemId??null,notice:document.querySelector('.app-session-entry-notice')?.textContent,
      beforeAfterMount:window.integrationMountSamples,fit:window.integrationFit(),innerWidth,clientWidth:document.documentElement.clientWidth,scrollHeight:document.documentElement.scrollHeight,clientHeight:document.documentElement.clientHeight}));
    if(scroll==='episode-gutter-baseline') assert.equal(after.state,null);
    else assert.ok(after.state, `Start failed: ${width}x${height} ${scroll} seed ${seed}: ${after.notice}`);
    assert.deepEqual(errors,[]);
    runs.push({width,height,scroll,seed,before,after,errors});await page.close();
  }
  await writeFile(`${dir}/${output}`,JSON.stringify({browser:browser.version(),base:'configured Vite /FractionFlow/ on port 5199',scrollModes:'auto, forced scroll, synthetic episode gutter, styled classic scrollbar with the repair, and styled classic scrollbar with the repair disabled; not a physical-device scrollbar claim',runs},null,2)+'\n');
  console.log(`Captured ${runs.length} launch observations in ${output}.`);
}finally{await browser?.close();await server?.close();}
