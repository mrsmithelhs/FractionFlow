import { createServer } from 'vite'; import { chromium } from 'playwright'; import { strict as assert } from 'node:assert';
const server=await createServer({server:{host:'127.0.0.1',port:5321,strictPort:true}}); await server.listen(); const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:360,height:740},hasTouch:true}); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5321/FractionFlow/#whole-plus-fraction-construction');
 let root=page.locator('.plan58-construction:visible'); await root.waitFor();
 const solve=async(w,p)=>{await root.locator('[data-field=whole]').fill(w);await root.locator('[data-field=pieces]').fill(p);await root.getByRole('button',{name:'Check'}).click();};
 for (const [w,p] of [['0','3'],['1','0'],['1','1']]) {await solve(w,p);await root.getByRole('button',{name:/Next/}).click();}
 await solve('0','6'); assert.match(await root.locator('.plan58-feedback').innerText(),/make a whole/); assert.equal(await root.locator('.plan58-feedback.house-retry').count(),0);
 await root.getByRole('button',{name:'Help',exact:true}).click(); await root.getByRole('button',{name:'Close help'}).click(); await root.getByRole('button',{name:'Help',exact:true}).click();
 await solve('1','2'); assert.equal(await root.locator('.symbolic-mixed-numeral').getAttribute('aria-label'),'1 and 2 fourths');
 await root.getByRole('button',{name:/Next/}).click(); await solve('1','1'); assert.equal(await root.locator('.symbolic-mixed-numeral').getAttribute('aria-label'),'1 and 1 half');
 await root.getByRole('button',{name:/Next/}).click(); await solve('2','0'); assert.equal(await root.locator('.symbolic-mixed-numeral').getAttribute('aria-label'),'2');
 assert.equal(await root.getByRole('button',{name:'Back to start'}).count(),1); assert.deepEqual(errors,[]); console.log('six-item progression, 6/4 organization, repeated help and final Back passed');
} finally {await browser.close();await server.close();}
