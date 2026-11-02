import { createServer } from 'vite'; import { chromium } from 'playwright'; import { strict as assert } from 'node:assert';
const server=await createServer({server:{host:'127.0.0.1',port:5299,strictPort:true}}); await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:360,height:740},reducedMotion:'reduce'});
try {
 await page.goto('http://127.0.0.1:5299/FractionFlow/#two-whole-location');
 let task=page.locator('.plan53-location:visible');
 const first=task.getByRole('button',{name:'Place at leftmost point'});
 await first.focus(); assert.equal(await task.locator('.plan53-positioned').count(),0);
 await page.keyboard.press('Enter'); assert.equal(await task.locator('.plan53-positioned').evaluate(e=>e.style.left),'0%');
 assert.match(await task.locator('[role=status]').innerText(),/Selected position: 0 over 4, zero/);
 await task.getByRole('button',{name:'Move right'}).focus(); await page.keyboard.press('Enter');
 assert.equal(await task.locator('.plan53-positioned').evaluate(e=>e.style.left),'12.5%');
 assert.match(await task.locator('[role=status]').innerText(),/Selected position: 1 over 4/);
 const old=await task.getByRole('button',{name:'Move right'}).elementHandle();
 await page.getByRole('button',{name:'Try this problem again'}).click();
 await old.evaluate(el=>el.click()); task=page.locator('.plan53-location:visible');
 assert.equal(await task.locator('.plan53-positioned').count(),0);
 await task.getByRole('button',{name:'Place at rightmost point'}).focus(); await page.keyboard.press('Space');
 assert.equal(await task.locator('.plan53-positioned').evaluate(e=>e.style.left),'100%');
 await task.getByRole('button',{name:'Move right'}).focus(); await page.keyboard.press('Enter');
 assert.equal(await task.locator('.plan53-positioned').evaluate(e=>e.style.left),'100%');
 const token=task.locator('.plan53-positioned'); const before=await token.boundingBox();
 const axis=await task.locator('.plan53-axis').boundingBox();
 await page.mouse.move(before.x+before.width/2,before.y+before.height/2); await page.mouse.down();
 await page.mouse.move(axis.x+axis.width/2,axis.y+axis.height/2-before.height/2,{steps:5});
 assert.equal(await task.locator('.plan53-highlight').count(),1);
 await page.setViewportSize({width:390,height:740}); await task.locator('.plan53-highlight').waitFor({state:'detached'}); await page.mouse.up();
 assert.equal(await task.locator('.plan53-highlight').count(),0);
 assert.equal(await task.locator('.plan53-positioned').evaluate(e=>e.style.left),'100%');
 console.log('keyboard position, reset stale callback and resize cancellation passed');
} finally {await browser.close();await server.close();}

