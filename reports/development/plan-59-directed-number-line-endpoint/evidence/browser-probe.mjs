import { createServer } from 'vite';
import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
import { writeFile } from 'node:fs/promises';
const dir = 'reports/development/plan-59-directed-number-line-endpoint/evidence';
const server = await createServer({ server: { host:'127.0.0.1', port:5296, strictPort:true } }); await server.listen();
const browser = await chromium.launch({ channel:'chrome', headless:true });
const receipts = [];
try {
 for (const config of [{width:360,height:740,dpr:1}, {width:1093,height:614,dpr:1.25}]) {
  const context = await browser.newContext({ viewport:{width:config.width,height:config.height}, deviceScaleFactor:config.dpr, hasTouch:true, reducedMotion:'reduce' });
  const page = await context.newPage(); const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5296/FractionFlow/#directed-number-line-endpoint');
  const root = page.locator('.plan59-endpoint:visible'); await root.waitFor();
  assert.equal(await root.locator('.plan59-arrow').count(), 0, 'WITNESS_PREMATURE_ARROW');
  assert.equal(await root.locator('.plan59-marker').count(), 0, 'WITNESS_INITIAL_ENDPOINT');
  assert.equal((await root.locator('.plan59-expression').innerText()).includes('='), false, 'WITNESS_PREMATURE_RESULT');
  assert.equal(await root.locator('.plan53-token').innerText(), 'End');
  await page.screenshot({path:`${dir}/initial-${config.width}.png`,fullPage:true});
  await root.getByRole('button',{name:'Check',exact:true}).click();
  assert.equal(await root.locator('.plan53-feedback').innerText(), 'Place the end first.');
  await root.getByRole('button',{name:'Place at 0'}).click();
  await root.getByRole('button',{name:'Move right'}).click();
  await root.getByRole('button',{name:'Check',exact:true}).click();
  assert.equal(await root.locator('.plan53-feedback').innerText(), 'Check the direction and number of equal parts.');
  assert.ok(await root.getByRole('button',{name:'Move right'}).getAttribute('aria-describedby'));
  await root.getByRole('button',{name:'Help',exact:true}).click();
  assert.equal(await root.locator('.plan53-help').innerText(), 'From the start, count equal parts to the right.');
  await page.getByRole('button',{name:'Read the steps'}).click();
  assert.equal(await page.locator('.plan59-endpoint:visible select').inputValue(), 'step-1', 'WITNESS_DRAFT_VIEW');
  assert.match(await page.locator('.plan59-endpoint:visible .plan59-linear-cue').innerText(), /Start at 1 over 4/);
  await page.getByRole('button',{name:'Show the picture'}).click();
  assert.equal(await root.locator('.plan59-position').innerText(), 'Endpoint at 1 over 4.');
  assert.equal(await root.locator('.plan53-help').count(), 1, 'WITNESS_HELP_VIEW');
  await root.getByRole('button',{name:'Move right'}).click();
  await root.getByRole('button',{name:'Move right'}).click();
  assert.equal(await root.locator('.plan59-arrow').count(),0,'WITNESS_PREMATURE_ARROW');
  await root.getByRole('button',{name:'Check',exact:true}).click();
  assert.equal(await root.locator('.plan53-feedback').innerText(), "That's right.");
  const geometry = await root.evaluate(el => {
   const rect = node => {const x=node.getBoundingClientRect(); return {left:x.left+scrollX,right:x.right+scrollX,width:x.width};};
   const axis=el.querySelector('.plan59-axis'), line=el.querySelector('.plan59-arrow line');
   const matrix=line.getScreenCTM();
   const point = (x, y) => { const p=new DOMPoint(x,y).matrixTransform(matrix); return {x:p.x+scrollX,y:p.y+scrollY}; };
   return { axis:rect(axis), start:rect(el.querySelector('.plan59-start')), endpoint:rect(el.querySelector('.plan59-marker')),
     ticks:[...axis.querySelectorAll('.plan53-mark')].map(rect), arrow:{x1:+line.getAttribute('x1'),x2:+line.getAttribute('x2'), from:point(+line.getAttribute('x1'),+line.getAttribute('y1')), to:point(+line.getAttribute('x2'),+line.getAttribute('y2'))},
     scrollWidth:document.documentElement.scrollWidth, viewport:innerWidth };
  });
  const center = x => (x.left+x.right)/2;
  assert.ok(Math.abs(center(geometry.start)-(geometry.axis.left+geometry.axis.width/4))<1,'WITNESS_START');
  assert.ok(Math.abs(center(geometry.endpoint)-(geometry.axis.left+3*geometry.axis.width/4))<1,'WITNESS_ENDPOINT');
  assert.ok(Math.abs(center(geometry.ticks[3])-center(geometry.endpoint))<1,'WITNESS_TICK_SCALE');
  assert.equal(geometry.arrow.x1,25,'WITNESS_DIRECTION_DISTANCE');
  assert.equal(geometry.arrow.x2,75,'WITNESS_DIRECTION_DISTANCE');
  assert.ok(Math.abs(geometry.arrow.from.x-(geometry.axis.left+geometry.axis.width/4))<1,'WITNESS_ARROW_START');
  assert.ok(Math.abs(geometry.arrow.to.x-(geometry.axis.left+3*geometry.axis.width/4))<1,'WITNESS_ARROW_END');
  assert.ok(geometry.scrollWidth<=geometry.viewport,'WITNESS_OVERFLOW');
  await page.screenshot({path:`${dir}/accepted-add-${config.width}.png`,fullPage:true});
  await page.getByRole('button',{name:'Read the steps'}).click();
  assert.equal(await page.locator('.plan59-endpoint:visible .plan59-linear-verification').innerText(), 'From the start, move right 2 over 4 to 3 over 4.');
  await page.getByRole('button',{name:'Show the picture'}).click();
  await root.locator('[data-focus-key=next]').click();
  assert.equal(await root.locator('.plan59-marker').count(),0);
  const axis=root.locator('.plan59-axis'); const box=await axis.boundingBox();
  await page.mouse.click(box.x+box.width/4, box.y+box.height/2);
  await root.getByRole('button',{name:'Check',exact:true}).click();
  assert.equal(await root.locator('.plan53-feedback').innerText(),"That's right.");
  const subtract=await root.locator('.plan59-arrow line').evaluate(line=>({x1:+line.getAttribute('x1'),x2:+line.getAttribute('x2')}));
  assert.deepEqual(subtract,{x1:75,x2:25},'WITNESS_REVERSE');
  await page.screenshot({path:`${dir}/accepted-subtract-${config.width}.png`,fullPage:true});
  assert.deepEqual(errors,[]); receipts.push({config,geometry,subtract}); await context.close();
 }
 await writeFile(`${dir}/geometry.json`,JSON.stringify(receipts,null,2)); console.log('PASS', JSON.stringify(receipts));
} finally { await browser.close(); await server.close(); }
