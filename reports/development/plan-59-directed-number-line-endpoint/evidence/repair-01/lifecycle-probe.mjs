import { createServer } from 'vite';
import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
const dir='reports/development/plan-59-directed-number-line-endpoint/evidence/repair-01';
const server=await createServer({server:{host:'127.0.0.1',port:5297,strictPort:true}}); await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const context=await browser.newContext({viewport:{width:360,height:740},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5297/FractionFlow/#directed-number-line-endpoint');
 await page.addStyleTag({content:'html { font-size: 200% !important; }'});
 const root=page.locator('.plan59-endpoint:visible'); await root.waitFor();
 await page.screenshot({path:`${dir}/initial-200-percent.png`,fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'WITNESS_OVERFLOW_200');
 const old=await root.locator('[data-focus-key=right]').elementHandle();
 await root.locator('[data-focus-key=right]').focus();
 await page.keyboard.press('Enter');
 assert.match(await root.locator('.plan59-position').innerText(), /4 over 4/);
 await page.setViewportSize({width:390,height:740});
 assert.match(await root.locator('.plan59-position').innerText(), /4 over 4/, 'WITNESS_RESIZE_DRAFT');
 await page.setViewportSize({width:360,height:740});
 await page.getByRole('button',{name:'Try this problem again'}).click();
 await old.evaluate(node=>node.click());
 assert.equal(await root.locator('.plan59-position').innerText(),'Endpoint not placed.','WITNESS_RETIRED_CONTROL');
 const answers=[3,1,4,2,5,2], denominators=[4,4,6,6,8,8];
 for (let i=0;i<answers.length;i++) {
  const axis=root.locator('.plan59-axis'); await axis.scrollIntoViewIfNeeded();
  const box=await axis.boundingBox();
  await page.touchscreen.tap(box.x+box.width*(answers[i]+0.2)/denominators[i],box.y+box.height/2);
  assert.match(await root.locator('.plan59-position').innerText(),new RegExp(`Endpoint at ${answers[i]} over ${denominators[i]}`));
  await root.getByRole('button',{name:'Check',exact:true}).click();
  assert.equal(await root.locator('.plan53-feedback').innerText(),"That's right.");
  if(i===5) { await page.screenshot({path:`${dir}/accepted-eighths-200-percent.png`,fullPage:true}); assert.equal(await root.getByRole('button',{name:'Back to start'}).count(),1); }
  else await root.locator('[data-focus-key=next]').click();
 }
 assert.deepEqual(errors,[]); console.log('PASS 200% touch all records, same-item retired control, final Back');
 await context.close();
} finally { await browser.close(); await server.close(); }
