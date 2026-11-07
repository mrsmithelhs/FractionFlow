import { createServer } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const folder='reports/development/plan-78-mixed-number-subtraction-without-decomposition/evidence';
await mkdir(folder,{recursive:true});
const server=await createServer({server:{host:'127.0.0.1',port:0},logLevel:'error'});
await server.listen();
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-proxy-server']});
try {
  const observations=[];
  for(const scale of [100,200]) {
    const page=await browser.newPage({viewport:{width:360,height:740},hasTouch:true});
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/FractionFlow/`,{waitUntil:'domcontentloaded'});
    await page.addStyleTag({content:`html {font-size:${scale}% !important}`});
    await page.getByRole('button',{name:'Choose what to practice'}).click();
    await page.getByRole('button',{name:'Subtract mixed numbers'}).click();
    const active=page.locator('.plan78-subtraction:visible');
    for(const [i,w,p] of [[1,'2','3'],[2,'2','0'],[3,'1','4'],[4,'1','0']]) {
      await active.getByLabel('Whole units left').waitFor();
      const originals=await active.locator('.plan78-original-model .plan78-bar').evaluateAll(bars=>bars.map(b=>({width:b.getBoundingClientRect().width,cells:[...b.children].map(c=>c.getBoundingClientRect().width)})));
      assert(originals.length>0);assert.equal(await active.locator('.plan78-removed, .plan78-remaining, .plan78-settled-model').count(),0);
      assert.equal(await active.getByText('The difference is',{exact:false}).count(),0);
      if(i<=2) {
        await page.screenshot({path:`${folder}/item${i}-${scale}-initial.png`,fullPage:true});
        await active.getByRole('button',{name:'Help'}).click();
        await active.getByRole('button',{name:'Check'}).click();
        assert.match(await active.innerText(),/Enter whole units/);
        await page.screenshot({path:`${folder}/item${i}-${scale}-help-recovery.png`,fullPage:true});
      }
      await active.getByLabel('Whole units left').fill(w);await active.getByLabel('Eighth pieces left').fill(p);
      await active.getByRole('button',{name:'Check'}).click();
      assert.equal(await active.locator('input').count(),0);
      assert.match(await active.innerText(),new RegExp(`Left: ${w} whole unit`));
      if(p==='0')assert.match(await active.innerText(),/No eighths left/);
      assert.equal(await active.locator('.plan78-prompt:visible').count(),0);
      const dims=await active.evaluate(root=>({overflow:document.documentElement.scrollWidth>innerWidth, bars:[...root.querySelectorAll('.plan78-settled-model .plan78-bar')].map(b=>({width:b.getBoundingClientRect().width,cells:[...b.children].map(c=>c.getBoundingClientRect().width)})), focus:document.activeElement?.className,focusGap:root.querySelector('.plan78-feedback').getBoundingClientRect().top-root.querySelector('.plan78-operands').getBoundingClientRect().bottom}));
      assert.equal(dims.overflow,false);assert(dims.focusGap>=8);assert([...originals,...dims.bars].every(b=>b.cells.length===8 && Math.abs(b.width-originals[0].width)<1 && Math.max(...b.cells)-Math.min(...b.cells)<1));
      if(i<=2)await page.screenshot({path:`${folder}/item${i}-${scale}-settled.png`,fullPage:true});
      observations.push({scale,item:i,originals,...dims});
      if(i<4) await active.getByRole('button',{name:'Next'}).click();
      else assert(await active.getByRole('button',{name:/Back to start/}).count());
    }
    await page.close();
  }
  {
    const page=await browser.newPage({viewport:{width:1366,height:768},hasTouch:true});
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/FractionFlow/`,{waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:'Choose what to practice'}).tap();
    await page.getByRole('button',{name:'Subtract mixed numbers'}).tap();
    await page.getByRole('button',{name:'Read the steps'}).click();
    const active=page.locator('.plan78-subtraction:visible');
    await active.getByLabel('Whole units left').focus();await page.keyboard.type('2');
    await page.keyboard.press('Tab');await page.keyboard.type('3');
    await active.getByRole('button',{name:'Check'}).focus();await page.keyboard.press('Enter');
    assert.match(await active.innerText(),/Left: 2 whole units. 3 eighths left/);
    assert.equal(await active.locator('.plan78-bar').count(),0);
    observations.push({viewport:'1366x768',path:'touch launch, linear keyboard entry and Enter',settled:true});
    await page.screenshot({path:`${folder}/linear-chromebook-settled.png`,fullPage:true});
    await page.close();
  }
  await writeFile(`${folder}/observations.json`,JSON.stringify(observations,null,2));
  console.log(JSON.stringify(observations));
} finally {await browser.close();await server.close();}
