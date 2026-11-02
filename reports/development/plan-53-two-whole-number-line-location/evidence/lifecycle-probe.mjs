import { createServer } from 'vite'; import { chromium } from 'playwright'; import { strict as assert } from 'node:assert';
const server=await createServer({server:{host:'127.0.0.1',port:5297,strictPort:true}}); await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true}); const page=await browser.newPage({viewport:{width:360,height:740},hasTouch:true}); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto('http://127.0.0.1:5297/FractionFlow/#two-whole-location');
 const visible=()=>page.locator('.plan53-location:visible');
 await visible().getByRole('button',{name:'Place at leftmost point'}).click();
 await visible().getByRole('button',{name:'Move right'}).click();
 await visible().getByRole('button',{name:'Check',exact:true}).click();
 assert.match(await visible().innerText(),/Check this placement/);
 await visible().getByRole('button',{name:'Help',exact:true}).click();
 assert.match(await visible().innerText(),/Each whole/);
 await page.getByRole('button',{name:'Read the steps'}).click();
 console.log('linear',await visible().innerText());
 assert.match(await visible().innerText(),/Each whole/); assert.match(await visible().innerText(),/Check this placement/);
 assert.equal(await visible().locator('select').inputValue(),'step-1');
 await visible().locator('select').selectOption('step-0');
 assert.doesNotMatch(await visible().innerText(),/Check this placement/);
 await page.getByRole('button',{name:'Show the picture'}).click();
 assert.match(await visible().innerText(),/Each whole/);
 await visible().getByRole('button',{name:'Check',exact:true}).click();
 assert.equal(await visible().locator('.plan53-bar').count(),1);
 await page.getByRole('button',{name:'Try this problem again'}).click();
 assert.equal(await visible().locator('.plan53-bars').count(),0);
 assert.match(await visible().innerText(),/Place at leftmost point/);
 assert.doesNotMatch(await visible().innerText(),/Each whole/);
 assert.deepEqual(errors,[]); console.log('lifecycle passed');
} finally { await browser.close(); await server.close(); }

