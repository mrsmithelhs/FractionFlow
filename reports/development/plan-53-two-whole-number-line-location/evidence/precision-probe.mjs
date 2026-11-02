import { createServer } from 'vite';
import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
import { writeFile } from 'node:fs/promises';
const server = await createServer({server:{host:'127.0.0.1',port:5298,strictPort:true}}); await server.listen();
const browser = await chromium.launch({channel:'chrome',headless:true});
const receipts = [];
try {
 for (const config of [{width:360,height:740,dpr:1,scale:1},{width:360,height:740,dpr:1,scale:1.5},{width:360,height:740,dpr:1,scale:2},{width:1093,height:614,dpr:1.25,scale:1}]) {
  const context=await browser.newContext({viewport:{width:config.width,height:config.height},deviceScaleFactor:config.dpr,hasTouch:true});
  const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5298/FractionFlow/#two-whole-location');
  if(config.scale!==1) await page.addStyleTag({content:`html { font-size: ${16*config.scale}px !important; }`});
  const task=page.locator('.plan53-location:visible');
  // Fourths: tap on both sides of a boundary, then check endpoint tile containment.
  await task.locator('.plan53-axis').scrollIntoViewIfNeeded();
  let fourthAxis=await task.locator('.plan53-axis').boundingBox();
  for (const [delta,expected] of [[-0.12,2],[0.12,3]]) {
    await page.touchscreen.tap(fourthAxis.x+(2.5+delta)*fourthAxis.width/8,fourthAxis.y+fourthAxis.height/2);
    const percent=parseFloat(await task.locator('.plan53-positioned').evaluate(el=>el.style.left));
    assert.equal(percent,expected/8*100);
  }
  for (const [offset,expected] of [[1,0],[fourthAxis.width-1,100]]) {
    await page.touchscreen.tap(fourthAxis.x+offset,fourthAxis.y+fourthAxis.height/2);
    const token=task.locator('.plan53-positioned'); const tile=await token.boundingBox();
    assert.equal(parseFloat(await token.evaluate(el=>el.style.left)),expected);
    assert.ok(tile.x>=0 && tile.x+tile.width<=config.width);
    const contained=await token.evaluate(el=>{const t=el.getBoundingClientRect(); return [...el.querySelectorAll('*')].every(child=>{const r=child.getBoundingClientRect(); return r.left>=t.left-1 && r.right<=t.right+1 && r.top>=t.top-1 && r.bottom<=t.bottom+1;});});
    assert.ok(contained,'fraction glyphs must stay inside the tile');
    assert.deepEqual(await task.locator('.plan53-benchmark').allTextContents(),['0','1','2']);
  }
  for(const [n,d] of [[0,4],[3,4],[4,4],[5,4],[6,4],[3,2],[8,4]]) {
   const axis=task.locator('.plan53-axis'); await axis.scrollIntoViewIfNeeded(); const box=await axis.boundingBox();
   await page.mouse.click(box.x+Math.max(1,Math.min(box.width-1,box.width*n/(2*d))),box.y+box.height/2);
   await task.getByRole('button',{name:'Check',exact:true}).click();
   await task.getByRole('button',{name:'Next problem'}).click();
  }
  const axis=task.locator('.plan53-axis'); await axis.scrollIntoViewIfNeeded(); let box=await axis.boundingBox();
  const spacing=box.width/16; const observed=[];
  // Grab near the token's left edge, release on either side of the 9/10 boundary.
  for(const [direction,delta,expected] of [['left',-0.12,9],['right',0.12,10]]) {
   const token=task.locator('.plan53-token'); const before=await token.boundingBox();
   const grabX=before.x+5, grabY=before.y+before.height/2;
   const offsetX=grabX-(before.x+before.width/2), offsetY=grabY-(before.y+before.height);
   const targetX=box.x+(9.5+delta)*spacing+offsetX, targetY=box.y+box.height/2+offsetY;
   await page.mouse.move(grabX,grabY); await page.mouse.down(); await page.mouse.move(targetX,targetY,{steps:8});
   const highlighted=await task.locator('.plan53-highlight').getAttribute('data-candidate-id');
   await page.mouse.up();
   const positioned=task.locator('.plan53-positioned'); const actual=await positioned.evaluate(el=>el.style.left);
   assert.equal(highlighted,`step-${expected}`); assert.equal(parseFloat(actual),expected/16*100);
   observed.push({direction,expected,highlighted,percent:actual,grabOffsetX:offsetX});
  }
  const buttons=await task.locator('.plan53-controls button').evaluateAll(nodes=>nodes.map(n=>({text:n.textContent,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})));
  assert.ok(buttons.every(x=>x.width>=44 && x.height>=44));
  // Emulated touch uses the same off-center offset and must commit only on release.
  const cdp=await context.newCDPSession(page); let token=task.locator('.plan53-positioned'); let tokenBox=await token.boundingBox();
  const tx=tokenBox.x+5, ty=tokenBox.y+tokenBox.height/2;
  const ox=tx-(tokenBox.x+tokenBox.width/2), oy=ty-(tokenBox.y+tokenBox.height);
  const endX=box.x+11*spacing+ox, endY=box.y+box.height/2+oy;
  const scrollBefore=await page.evaluate(()=>scrollY);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tx,y:ty,id:2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:endX,y:endY,id:2}]});
  assert.equal(await task.locator('.plan53-highlight').getAttribute('data-candidate-id'),'step-11');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(parseFloat(await task.locator('.plan53-positioned').evaluate(el=>el.style.left)),68.75);
  const scrollAfter=await page.evaluate(()=>scrollY); assert.equal(scrollAfter,scrollBefore);
  // Touch cancellation after a drag must preserve the committed candidate.
  token=task.locator('.plan53-positioned'); tokenBox=await token.boundingBox();
  const x=tokenBox.x+tokenBox.width/2,y=tokenBox.y+tokenBox.height/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+20,y:y+15,id:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  assert.equal(parseFloat(await task.locator('.plan53-positioned').evaluate(el=>el.style.left)),68.75);
  await task.getByRole('button',{name:'Move left'}).click(); assert.equal(parseFloat(await task.locator('.plan53-positioned').evaluate(el=>el.style.left)),62.5);
  const doc=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth})); assert.ok(doc.width<=doc.viewport);
  assert.deepEqual(errors,[]); receipts.push({config,axisWidth:box.width,spacing,observed,buttons,fourthsBoundaryAndEndpointContainment:true,touchCommit:true,scrollBefore,scrollAfter,cancelPreserved:true,stepCorrection:true,doc});
  await context.close();
 }
 await writeFile('reports/development/plan-53-two-whole-number-line-location/evidence/precision-probe.json',JSON.stringify(receipts,null,2));
 console.log(JSON.stringify(receipts,null,2));
} finally {await browser.close();await server.close();}
