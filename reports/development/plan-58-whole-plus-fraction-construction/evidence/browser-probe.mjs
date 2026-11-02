import { createServer } from 'vite';
import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
const server = await createServer({server:{host:'127.0.0.1',port:5318,strictPort:true}}); await server.listen();
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
 for (const config of [{width:360,height:740,dpr:1},{width:1093,height:614,dpr:1.25},{width:360,height:740,dpr:1,large:true}]) {
  const context = await browser.newContext({viewport:{width:config.width,height:config.height},deviceScaleFactor:config.dpr,hasTouch:true});
  const page = await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5318/FractionFlow/#whole-plus-fraction-construction');
  const root=page.locator('.plan58-construction:visible'); await root.waitFor();
  if (config.large) { await page.addStyleTag({content:'html { font-size: 200% !important; }'}); await page.locator('.app-gear-button').evaluate(n=>n.click()); await page.locator('[data-support-id=medium-support]').evaluate(n=>n.click()); await page.locator('.app-restart-button').evaluate(n=>n.click()); }
  const whole=root.locator('[data-field=whole]'), pieces=root.locator('[data-field=pieces]');
  assert.match(await root.innerText(),/not entered/);
  await whole.fill('2'); await pieces.fill('8');
  const geo=await root.locator('.plan58-bar').evaluateAll(nodes=>nodes.map(n=>({width:n.getBoundingClientRect().width,parts:n.children.length,filled:n.querySelectorAll('.is-shaded').length})));
  assert.equal(geo.length,4); assert.ok(geo.every(x=>Math.abs(x.width-geo[0].width)<.1 && x.parts===4 && x.filled===4), 'WITNESS_UNIT_SCALE');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await whole.fill('0'); await pieces.fill('3'); await root.getByRole('button',{name:'Check'}).click();
  assert.match(await root.innerText(),/That's right/); assert.equal(await root.locator('.symbolic-mixed-numeral').getAttribute('aria-label'),'3 fourths');
  await root.getByRole('button',{name:/Next/}).click();
  assert.equal(await whole.inputValue(),'');
  await whole.fill('1'); await pieces.fill('0'); await root.getByRole('button',{name:'Check'}).click();
  assert.equal(await root.locator('.symbolic-mixed-numeral').getAttribute('aria-label'),'1');
  await root.getByRole('button',{name:/Next/}).click();
  await whole.fill('0'); await pieces.fill('5'); await root.getByRole('button',{name:'Check'}).click();
  assert.match(await root.locator('.plan58-feedback').innerText(),/make a whole/);
  await root.getByRole('button',{name:'Help',exact:true}).click(); assert.match(await root.innerText(),/How many fourths/);
  await whole.fill('1'); await pieces.fill('1'); await root.getByRole('button',{name:'Check'}).click();
  assert.equal(await root.locator('.symbolic-mixed-numeral').getAttribute('aria-label'),'1 and 1 fourth');
  assert.deepEqual(errors,[]); console.log(JSON.stringify({config,geo})); await context.close();
 }
} finally {await browser.close();await server.close();}

