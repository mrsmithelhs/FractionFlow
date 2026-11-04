import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5226','--strictPort']);
try {
 await new Promise((ok,fail)=>{server.stdout.on('data',s=>{if(String(s).includes('Local:'))ok()});server.on('exit',()=>fail(Error('server exited')))});
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for(const route of ['symbolic-fraction-comparison','fraction-distance','whole-plus-fraction-construction','two-whole-location']){
  const page=await browser.newPage({viewport:{width:1093,height:614}}); await page.goto('http://127.0.0.1:5226/FractionFlow/#'+route); await page.waitForTimeout(300);
  for(const view of ['visual','linear']){
   if(view==='linear') await page.locator('.app-view-toggle').click();
   const host=page.locator('.app-'+view+'-view');
   const result=await host.evaluate(e=>{const root=e.firstElementChild; if(!root)return null; const s=getComputedStyle(root), expr=root.querySelector('.plan45-expression'), form=root.querySelector('form'), help=root.querySelector('details, .plan58-actions, .plan53-controls'); return {root:root.className,text:root.innerText,display:s.display,width:s.width,marginLeft:s.marginLeft,marginRight:s.marginRight,gap:s.gap,expression:expr?.innerText,children:[...root.children].map(x=>x.className||x.tagName),form:form?.className,help:help?.className};});
   console.log(JSON.stringify({route,view,...result}));
  } await page.close();
 }
 await browser.close();
} finally { server.kill(); }
