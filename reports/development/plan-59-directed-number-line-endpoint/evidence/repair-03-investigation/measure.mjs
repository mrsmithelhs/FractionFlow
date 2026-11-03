import {createServer} from 'vite';
import {chromium} from 'playwright';
import {strict as assert} from 'node:assert';
import {writeFile} from 'node:fs/promises';
const out='reports/development/plan-59-directed-number-line-endpoint/evidence/repair-03-investigation';
const server=await createServer({server:{host:'127.0.0.1',port:5302,strictPort:true}});await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
try{
 for(const cfg of [{width:360,height:740,dpr:1},{width:1093,height:614,dpr:1.25},{width:360,height:740,dpr:1,scale:200}]){
  const context=await browser.newContext({viewport:{width:cfg.width,height:cfg.height},deviceScaleFactor:cfg.dpr});const page=await context.newPage();
  await page.goto('http://127.0.0.1:5302/FractionFlow/#directed-number-line-endpoint');if(cfg.scale)await page.addStyleTag({content:'html { font-size: 200% !important; }'});
  const root=page.locator('.plan59-endpoint:visible');await root.waitFor();
  for(const [n,d] of [[3,4],[1,4],[4,6],[2,6]]){
   const axis=root.locator('.plan59-axis');await axis.scrollIntoViewIfNeeded();const box=await axis.boundingBox();await page.mouse.click(box.x+box.width*n/d,box.y+box.height/2);
   await root.getByRole('button',{name:'Check',exact:true}).click();assert.equal(await root.locator('.plan53-feedback').innerText(),"That's right.");await root.locator('[data-focus-key=next]').click();
  }
  const axis=root.locator('.plan59-axis');await axis.scrollIntoViewIfNeeded();const box=await axis.boundingBox();await page.mouse.click(box.x+box.width*3/8,box.y+box.height/2);
  const m=await root.evaluate(el=>{const rect=n=>{const r=n.getBoundingClientRect();return {left:r.left+scrollX,right:r.right+scrollX,top:r.top+scrollY,bottom:r.bottom+scrollY,width:r.width,height:r.height};};
   const a=rect(el.querySelector('.plan59-axis')),start=rect(el.querySelector('.plan59-start')),end=rect(el.querySelector('.plan59-marker'));return {axis:a,start,end,frame:rect(el.querySelector('.plan59-frame')),tray:rect(el.querySelector('.plan59-tray')),feedback:rect(el.querySelector('.plan53-feedback')),horizontalOverlap:Math.max(0,Math.min(start.right,end.right)-Math.max(start.left,end.left))};});
  assert.ok(Math.abs((m.end.left+m.end.right)/2-(m.axis.left+3*m.axis.width/8))<1);
  assert.ok(Math.abs((m.start.left+m.start.right)/2-(m.axis.left+2*m.axis.width/8))<1);
  const suffix=cfg.scale?'360-200pct':cfg.width;await page.screenshot({path:`${out}/adjacent-eighths-${suffix}.png`,fullPage:true});results.push({cfg,...m});await context.close();
 }
 await writeFile(`${out}/measurements.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close();await server.close();}
