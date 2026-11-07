import {chromium} from 'playwright';import {readFile,mkdir,writeFile} from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';
const dir='reports/development/plan-82-mixed-number-subtraction-with-decomposition/evidence';await mkdir(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-proxy-server'],executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const observations=[];
for(const scale of [100,200]){
 const page=await browser.newPage({viewport:{width:360,height:740}});await page.route('**/*',async r=>{let rel=new URL(r.request().url()).pathname.replace(/^\/FractionFlow\/?/,'')||'index.html';try{await r.fulfill({body:await readFile(path.join(process.cwd(),'dist',rel)),contentType:rel.endsWith('.js')?'text/javascript':rel.endsWith('.css')?'text/css':'text/html'});}catch{await r.abort();}});
 await page.goto('http://fractionflow.local/FractionFlow/');await page.addStyleTag({content:`html{font-size:${scale}% !important}`});await page.getByRole('button',{name:'Choose what to practice'}).click();await page.getByRole('button',{name:'Subtract mixed numbers: rename a whole'}).click();
 const checks=[]; const shot=async n=>{const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(overflow)console.log('OVERFLOW',n,await page.evaluate(()=>[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).filter(x=>x.right>innerWidth+1).slice(0,12)));checks.push({state:n,overflow});await page.screenshot({path:`${dir}/${scale}-${n}.png`,fullPage:true});};
 for(const [index,w,p,total] of [[0,'1','5','10'],[1,'0','2','9'],[2,'1','4','11'],[3,'0','7','10']]){
  if(index<2)await shot(`${index}-initial`);
  await page.getByRole('button',{name:'Rename one whole',exact:true}).click(); const input=page.locator('.plan82-help input:visible');
  if(index===0){assert.equal(await page.locator('.plan82-help:visible').innerText().then(x=>x.includes('10 eighths')),false);await input.fill('9');await page.getByRole('button',{name:'Check renaming'}).click();assert.match(await page.locator('.plan82-help:visible').innerText(),/Count all/);await shot('0-recovery');}
  await input.fill(total);await page.getByRole('button',{name:'Check renaming'}).click();assert.match(await page.locator('.plan82-help:visible').innerText(),new RegExp(`${total} eighths`));assert.equal(await page.locator('.plan82-subtraction:visible .plan82-result').innerText(),'');if(index<3)await shot(`${index}-renamed`);
  const root=page.locator('.plan82-subtraction:visible');await root.getByLabel('Whole units left').fill(w);await root.getByLabel('Eighth pieces left').fill(p);await root.getByRole('button',{name:'Check',exact:true}).click();assert.match(await root.innerText(),/That's right/);if(index===0)assert.match(await root.innerText(),/2 original eighths, and 3 renamed eighths/);if(index===1)assert.match(await root.innerText(),/Left: 0 whole units and 2 eighths/);if(index!==2)await shot(`${index}-accepted`);
  if(index<3)await page.getByRole('button',{name:'Next problem'}).click();
 }
 observations.push({scale,checks});await page.close();
}
await writeFile(`${dir}/browser-observations.json`,JSON.stringify(observations,null,2));console.log(JSON.stringify(observations));await browser.close();
