import { createServer } from 'vite';
import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
const dir='reports/development/plan-59-directed-number-line-endpoint/evidence/repair-03';
const server=await createServer({server:{host:'127.0.0.1',port:5300,strictPort:true}}); await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const cfg of [{width:360,height:740,dpr:1},{width:1093,height:614,dpr:1.25},{width:360,height:740,dpr:1,scale:200}]) {
  const context=await browser.newContext({viewport:{width:cfg.width,height:cfg.height},deviceScaleFactor:cfg.dpr,hasTouch:true});
  const page=await context.newPage(); await page.goto('http://127.0.0.1:5300/FractionFlow/#directed-number-line-endpoint');
  if(cfg.scale) await page.addStyleTag({content:'html { font-size: 200% !important; }'});
  const root=page.locator('.plan59-endpoint:visible'), axis=root.locator('.plan59-axis'), tile=root.locator('.plan59-drag-tile:visible'); await root.waitFor();
  await axis.scrollIntoViewIfNeeded();
  async function startDrag(target=.5) {
   const card=await tile.boundingBox(), line=await axis.boundingBox();
   const sx=card.x+card.width*.3, sy=card.y+card.height*.4, ox=sx-(card.x+card.width/2), oy=sy-(card.y+card.height);
   await page.mouse.move(sx,sy);await page.mouse.down();await page.mouse.move(line.x+line.width*target+ox,line.y+line.height/2+oy,{steps:5});
   assert.equal(await root.locator('.is-dragging').count(),1);
  }
  async function intact(expected='Endpoint not placed.') {
   assert.equal(await root.locator('.plan59-position').textContent(),expected,'WITNESS_CANCEL_PRESERVES');
   assert.equal(await root.locator('.is-dragging, .plan53-highlight').count(),0,'WITNESS_CANCEL_GHOST');
  }
  await startDrag(); await page.mouse.move(2,2); await page.mouse.up(); await intact();
  await startDrag(); await tile.evaluate(el=>el.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:1}))); await page.mouse.up(); await intact();
  await startDrag(); await tile.evaluate(el=>el.releasePointerCapture(1)); await page.waitForTimeout(50); await page.mouse.up(); await intact();
  await startDrag(); await page.setViewportSize({width:cfg.width+10,height:cfg.height}); await page.waitForTimeout(100); await page.mouse.up(); await intact(); await page.setViewportSize({width:cfg.width,height:cfg.height});
  await page.setViewportSize({width:cfg.width,height:400});
  await axis.scrollIntoViewIfNeeded(); await startDrag(); const scrollBefore=await page.evaluate(()=>scrollY);
  await page.evaluate(()=>window.scrollBy(0,40)); await page.waitForTimeout(50);
  assert.notEqual(await page.evaluate(()=>scrollY),scrollBefore,'WITNESS_SCROLL_OCCURRED');
  const scrollAfter=await page.evaluate(()=>scrollY); await page.mouse.up(); await intact();
  assert.equal(await page.evaluate(()=>scrollY),scrollAfter,'WITNESS_SCROLL_PRESERVED');
  await page.setViewportSize({width:cfg.width,height:cfg.height});
  await axis.scrollIntoViewIfNeeded(); await startDrag(); await page.getByRole('button',{name:'Read the steps'}).evaluate(el=>el.focus({preventScroll:true})); await page.keyboard.press('Enter'); await page.mouse.up();
  assert.equal(await page.locator('.plan59-endpoint:visible select').inputValue(),'');
  await page.getByRole('button',{name:'Show the picture'}).click(); await intact();
  await axis.scrollIntoViewIfNeeded(); await startDrag();
  const fontOverride=await page.addStyleTag({content:'html {font-size: 125% !important}'});
  await page.waitForTimeout(100); await page.mouse.up(); await intact();
  await fontOverride.evaluate(el=>el.remove()); await page.waitForTimeout(100);
  await axis.scrollIntoViewIfNeeded(); await startDrag(); const old=await tile.elementHandle();
  await page.getByRole('button',{name:'Try this problem again'}).evaluate(el=>el.focus({preventScroll:true})); await page.keyboard.press('Enter'); await page.mouse.up();
  await old.evaluate(el=>el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:1,clientX:200,clientY:200}))); await intact();
  await axis.scrollIntoViewIfNeeded();
  const card=await tile.boundingBox(), line=await axis.boundingBox(), cdp=await context.newCDPSession(page);
  const sx=card.x+card.width*.7,sy=card.y+card.height*.4,ox=sx-(card.x+card.width/2),oy=sy-(card.y+card.height);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,id:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:line.x+line.width*.75+ox,y:line.y+line.height/2+oy,id:1}]});
  assert.equal(await root.locator('.plan53-highlight').getAttribute('data-candidate-id'),'step-3','WITNESS_TOUCH_PREVIEW');
  await page.screenshot({path:`${dir}/touch-highlight-${cfg.scale?'360-200pct':cfg.width}.png`});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await root.locator('.plan59-position').textContent(),'Endpoint at 3 over 4.','WITNESS_TOUCH_DROP');
  await root.getByRole('button',{name:'Help',exact:true}).click(); await axis.scrollIntoViewIfNeeded();
  await startDrag(.25); await page.getByRole('button',{name:'Read the steps'}).evaluate(el=>el.focus({preventScroll:true}));
  await page.keyboard.press('Enter'); await page.mouse.up();
  assert.equal(await page.locator('.plan59-endpoint:visible select').inputValue(),'step-3','WITNESS_VIEW_DRAFT');
  assert.equal(await page.locator('.plan59-endpoint:visible .plan53-help').count(),1,'WITNESS_VIEW_HELP');
  await page.getByRole('button',{name:'Show the picture'}).click(); await intact('Endpoint at 3 over 4.');
  assert.equal(await root.locator('.plan53-help').count(),1);
  await root.getByRole('button',{name:'Check',exact:true}).click(); assert.equal(await root.locator('.plan53-feedback').innerText(),"That's right.");
  await root.locator('[data-focus-key=next]').click();
  assert.equal(await root.locator('.plan59-position').textContent(),'Endpoint not placed.');
  const nextAxis=await axis.boundingBox(); await page.mouse.click(nextAxis.x+nextAxis.width*.25,nextAxis.y+nextAxis.height/2);
  await root.getByRole('button',{name:'Check',exact:true}).click(); assert.equal(await root.locator('.plan53-feedback').innerText(),"That's right.");
  await page.getByRole('button',{name:'Try this problem again'}).click(); await axis.scrollIntoViewIfNeeded();
  await startDrag(); const retired=await tile.elementHandle();
  await page.getByRole('button',{name:'Back to start',exact:true}).first().evaluate(el=>el.focus({preventScroll:true}));
  await page.keyboard.press('Enter'); await page.mouse.up();
  assert.equal(await page.locator('.is-dragging, .plan53-highlight').count(),0,'WITNESS_BACK_GHOST');
  assert.equal(await page.locator('.app-entry-page').isVisible(),true);
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'fractionflow-title','WITNESS_ENTRY_FOCUS');
  await retired.evaluate(el=>el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:1,clientX:200,clientY:200})));
  await page.getByRole('button',{name:'Find the end on a number line'}).click();
  assert.equal(await root.locator('.plan59-position').textContent(),'Endpoint not placed.','WITNESS_REENTRY_UNPLACED');
  assert.equal(await root.locator('.is-dragging, .plan53-highlight').count(),0);
  console.log('PASS lifecycle',JSON.stringify(cfg)); await context.close();
 }
} finally {await browser.close();await server.close();}
