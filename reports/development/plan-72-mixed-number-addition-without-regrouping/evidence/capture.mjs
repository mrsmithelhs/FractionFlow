import { createServer } from 'vite';
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const out='reports/development/plan-72-mixed-number-addition-without-regrouping/evidence';
const server=await createServer({server:{port:5212,host:'127.0.0.1'}}); await server.listen();
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-proxy-server']});
const observations=[];const errors=[];
try {
 for (const cfg of [{name:'normal',width:360,height:740,scale:100},{name:'root200',width:360,height:740,scale:200},{name:'chromebook',width:1093,height:614,scale:100}]) {
  const page=await browser.newPage({viewport:{width:cfg.width,height:cfg.height},hasTouch:true});page.on('pageerror',e=>errors.push(`${cfg.name}: ${e.message}`));
  await page.goto('http://127.0.0.1:5212/FractionFlow/');await page.evaluate(scale=>document.documentElement.style.fontSize=`${scale}%`,cfg.scale);
  await page.getByText('Choose what to practice',{exact:true}).click();await page.getByText('Add mixed numbers',{exact:true}).click();
  const root=page.locator('.plan72-addition:visible');
  for(const [w,n] of [['2','2'],['3','2'],['3','3']]){await root.locator('[data-field=whole]').fill(w);await root.locator('[data-field=pieces]').fill(n);await root.getByRole('button',{name:'Check',exact:true}).click();await root.getByRole('button',{name:'Next problem',exact:true}).click();}
  const record=async name=>{const data=await page.evaluate(()=>{const root=document.querySelector('.plan72-addition:not([hidden])') ?? [...document.querySelectorAll('.plan72-addition')].find(x=>x.offsetParent);const bars=[...root.querySelectorAll('.plan72-bar')].map(x=>({width:x.getBoundingClientRect().width,parts:x.children.length}));return {scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,rootFont:getComputedStyle(document.documentElement).fontSize,bars,focus:document.activeElement?.outerHTML?.slice(0,300),text:root.innerText};});observations.push({case:cfg.name,state:name,...data});if(cfg.width===360)await page.screenshot({path:`${out}/${cfg.name}-${name}.png`,fullPage:true});};
  await record('initial');await root.locator('[data-field=whole]').fill('0');await record('partial');
  await root.locator('[data-field=whole]').fill('4');await root.locator('[data-field=pieces]').fill('8');await record('maximum');
  await root.getByRole('button',{name:'Check',exact:true}).click();await root.getByRole('button',{name:'Help',exact:true}).click();await record('retry-help');
  await root.getByRole('button',{name:'Close help'}).click();await root.locator('[data-field=whole]').fill('3');await root.locator('[data-field=pieces]').fill('4');await root.getByRole('button',{name:'Check',exact:true}).click();await record('accepted');
  if(!await root.getByLabel('3 and 4 eighths').count())throw Error('accepted notation missing');
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:360,height:740},hasTouch:true});await page.goto('http://127.0.0.1:5212/FractionFlow/');await page.getByText('Choose what to practice',{exact:true}).tap();await page.getByText('Add mixed numbers',{exact:true}).tap();const visual=page.locator('.plan72-addition:visible');await visual.locator('[data-field=whole]').focus();await page.keyboard.type('2');if(await visual.locator('[data-field=whole]').evaluate(e=>document.activeElement===e && e.selectionStart===1)!==true)throw Error('input focus or caret lost');await page.getByRole('button',{name:'Read the steps'}).click();const root=page.locator('.plan72-addition:visible');if(await root.locator('[data-field=whole]').inputValue()!=='2')throw Error('draft lost when changing view');await root.locator('[data-field=whole]').focus();await page.keyboard.press('Tab');await page.keyboard.type('2');await root.getByRole('button',{name:'Help',exact:true}).click();await root.getByRole('button',{name:'Close help'}).click();await root.getByRole('button',{name:'Check',exact:true}).click();observations.push({case:'linear-keyboard-touch',text:await root.innerText(),accepted:await root.getByLabel('2 and 2 fourths').count()});await page.close();
} finally {await writeFile(`${out}/browser-observations.json`,JSON.stringify({browser:browser.version(),actualBrowserZoom:'100% default; not independently measured',observations,errors},null,2));await browser.close();await server.close();}
if(errors.length)throw Error(errors.join('\n'));
