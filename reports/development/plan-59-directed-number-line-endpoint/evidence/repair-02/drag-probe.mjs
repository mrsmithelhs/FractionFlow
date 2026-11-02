import { createServer } from 'vite';
import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
import { writeFile } from 'node:fs/promises';
const dir='reports/development/plan-59-directed-number-line-endpoint/evidence/repair-02';
const server=await createServer({server:{host:'127.0.0.1',port:5299,strictPort:true}}); await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for (const config of [{width:360,height:740,dpr:1},{width:1093,height:614,dpr:1.25},{width:360,height:740,dpr:1,scale:200}]) {
  const context=await browser.newContext({viewport:{width:config.width,height:config.height},deviceScaleFactor:config.dpr,hasTouch:true,reducedMotion:'reduce'});
  const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5299/FractionFlow/#directed-number-line-endpoint');
  if(config.scale) await page.addStyleTag({content:'html { font-size: 200% !important; }'});
  const root=page.locator('.plan59-endpoint:visible'); await root.waitFor();
  const tile=root.locator('.plan59-drag-tile:visible'); const axis=root.locator('.plan59-axis');
  const suffix=config.scale?'360-200pct':String(config.width);
  await axis.scrollIntoViewIfNeeded();
  assert.equal(await tile.getAttribute('role'),'img');
  assert.equal(await tile.getAttribute('aria-label'),'End, unplaced');
  assert.equal(await tile.getAttribute('aria-describedby'),'plan59-position-visual');
  assert.equal(await root.locator('.plan59-position').textContent(),'Endpoint not placed.');
  assert.equal(await root.locator('.plan59-arrow').count(),0);
  const before=await axis.evaluate(el=>el.getBoundingClientRect().y+scrollY);
  await page.screenshot({path:`${dir}/initial-${suffix}.png`,fullPage:true});
  async function drag(target, offsetFraction=0.8, release=true) {
   const card=await tile.boundingBox(), line=await axis.boundingBox();
   const sx=card.x+card.width*offsetFraction, sy=card.y+card.height*.25;
   const ox=sx-(card.x+card.width/2), oy=sy-(card.y+card.height);
   await page.mouse.move(sx,sy); await page.mouse.down();
   await page.mouse.move(line.x+line.width*target+ox,line.y+line.height/2+oy,{steps:8});
   const highlight=await root.locator('.plan53-highlight').getAttribute('data-candidate-id');
   const dragBox=await tile.boundingBox();
   assert.ok(Math.abs((dragBox.x+dragBox.width/2)-(line.x+line.width*target))<1,'WITNESS_TILE_ANCHOR');
   assert.ok(Math.abs((dragBox.y+dragBox.height)-(line.y+line.height/2))<1,'WITNESS_TILE_ANCHOR_Y');
   if(release) await page.mouse.up();
   return {highlight,ox,oy};
  }
  let result=await drag(1.49/4);
  assert.equal(result.highlight,'step-1','WITNESS_ANCHOR_PREVIEW');
  assert.equal(await root.locator('.plan59-position').textContent(),'Endpoint at 1 over 4.','WITNESS_ANCHOR_DROP');
  assert.equal(await axis.evaluate(el=>el.getBoundingClientRect().y+scrollY),before,'WITNESS_ACTIVE_AXIS_STABILITY');
  assert.equal(await root.locator('.plan53-feedback').innerText(),'');
  result=await drag(2.51/4,0.2,false);
  assert.equal(result.highlight,'step-3','WITNESS_REGRAB_PREVIEW');
  await page.screenshot({path:`${dir}/highlight-${suffix}.png`});
  await page.mouse.up();
  assert.equal(await root.locator('.plan59-position').textContent(),'Endpoint at 3 over 4.','WITNESS_REGRAB_DROP');
  assert.equal(await tile.getAttribute('aria-label'),'End, placed');
  assert.equal(await root.locator('.plan59-arrow').count(),0);
  await drag(0.25,0.7,false); await page.keyboard.press('Escape'); await page.mouse.up();
  assert.equal(await root.locator('.plan59-position').textContent(),'Endpoint at 3 over 4.','WITNESS_CANCEL_DRAFT');
  assert.equal(await root.locator('.is-dragging, .plan53-highlight').count(),0,'WITNESS_CANCEL_GHOST');
  await root.getByRole('button',{name:'Check',exact:true}).click();
  assert.equal(await root.locator('.plan53-feedback').innerText(),"That's right.");
  const geometry=await root.evaluate(el=>{
   const rect=node=>{const r=node.getBoundingClientRect();return {left:r.left+scrollX,right:r.right+scrollX,top:r.top+scrollY,bottom:r.bottom+scrollY,width:r.width};};
   const axis=el.querySelector('.plan59-axis'), line=el.querySelector('.plan59-arrow line'), m=line.getScreenCTM();
   const point=(x,y)=>{const p=new DOMPoint(x,y).matrixTransform(m);return {x:p.x+scrollX,y:p.y+scrollY};};
   return {axis:rect(axis),start:rect(el.querySelector('.plan59-start')),end:rect(el.querySelector('.plan59-marker')),
    labels:[...el.querySelectorAll('.plan53-benchmark')].map(rect),feedback:rect(el.querySelector('.plan53-feedback')),
    arrowBox:rect(el.querySelector('.plan59-arrow')),from:point(+line.getAttribute('x1'),+line.getAttribute('y1')),
    to:point(+line.getAttribute('x2'),+line.getAttribute('y2')),scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth};
  });
  for(const box of [...geometry.labels,geometry.axis,geometry.start,geometry.end,geometry.arrowBox]) assert.ok(box.bottom<=geometry.feedback.top,'WITNESS_CLEARANCE');
  assert.ok(geometry.end.bottom<=geometry.start.top,'WITNESS_START_END_CLEARANCE');
  assert.ok(Math.abs(geometry.from.x-(geometry.axis.left+geometry.axis.width/4))<1,'WITNESS_ARROW_START');
  assert.ok(Math.abs(geometry.to.x-(geometry.axis.left+3*geometry.axis.width/4))<1,'WITNESS_ARROW_END');
  assert.ok(geometry.scrollWidth<=geometry.viewport);
  assert.equal(await root.locator('.plan59-tray').count(),0);
  await page.screenshot({path:`${dir}/accepted-${suffix}.png`,fullPage:true});
  assert.deepEqual(errors,[]); results.push({config,geometry}); await context.close();
 }
 await writeFile(`${dir}/drag-geometry.json`,JSON.stringify(results,null,2)); console.log('PASS mouse drag off-center, re-grab, cancellation and geometry');
} finally {await browser.close();await server.close();}
