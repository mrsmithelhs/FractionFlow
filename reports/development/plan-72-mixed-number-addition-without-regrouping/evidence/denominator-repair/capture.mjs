import { createServer } from 'vite';
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const out='reports/development/plan-72-mixed-number-addition-without-regrouping/evidence/denominator-repair';
const server=await createServer({server:{port:5213,host:'127.0.0.1'}});await server.listen();
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-proxy-server']});
const observations=[],errors=[];
try{
for(const cfg of [{name:'normal',scale:100},{name:'root200',scale:200}]){
 const page=await browser.newPage({viewport:{width:360,height:740}});page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5213/FractionFlow/');await page.evaluate(scale=>document.documentElement.style.fontSize=`${scale}%`,cfg.scale);await page.getByText('Choose what to practice',{exact:true}).click();await page.getByText('Add mixed numbers',{exact:true}).click();
 const data=[{d:'4',w:'2',n:'2',unit:'Fourth'},{d:'3',w:'3',n:'2',unit:'Third'},{d:'4',w:'3',n:'3',unit:'Fourth'},{d:'8',w:'3',n:'4',unit:'Eighth'}];
 for(let i=0;i<data.length;i++){
  const item=data[i];for(const mode of ['visual','linear']){
   if(mode==='linear')await page.getByRole('button',{name:'Read the steps'}).click();const root=page.locator('.plan72-addition:visible'),whole=root.locator('[data-field=whole]'),pieces=root.getByRole('textbox',{name:`${item.unit} pieces in the sum`}),suffix=root.locator('.plan72-denominator');
   if(await suffix.innerText()!==`/ ${item.d}`||await suffix.getAttribute('aria-hidden')!=='true')throw Error('wrong suffix');
   if(mode==='linear' && await pieces.inputValue()!==item.n)throw Error('draft lost switching views');await whole.fill(item.w);await pieces.fill('');await pieces.focus();await page.keyboard.type(item.n);const focus=await pieces.evaluate(e=>document.activeElement===e&&e.selectionStart===e.value.length);if(!focus)throw Error('focus/caret lost');
   const metrics=await root.evaluate(node=>{const row=node.querySelector('.plan72-piece-entry'),input=row.querySelector('input'),suffix=row.querySelector('.plan72-denominator'),r=row.getBoundingClientRect(),a=input.getBoundingClientRect(),b=suffix.getBoundingClientRect();return {viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,row:{left:r.left,right:r.right,top:r.top,bottom:r.bottom},input:{left:a.left,right:a.right,top:a.top,bottom:a.bottom},suffix:{left:b.left,right:b.right,top:b.top,bottom:b.bottom},rootFont:getComputedStyle(document.documentElement).fontSize};});
   if(metrics.scroll>metrics.viewport||metrics.suffix.right>metrics.viewport||metrics.suffix.left<metrics.input.right||metrics.suffix.top>=metrics.input.bottom||metrics.input.top>=metrics.suffix.bottom)throw Error(`layout ${JSON.stringify(metrics)}`);
   observations.push({case:cfg.name,item:i+1,mode,denominator:item.d,focus,...metrics});
   if(cfg.name==='normal'&&i===0&&mode==='visual')await page.screenshot({path:`${out}/fourths-visual.png`,fullPage:true});
   if(cfg.name==='root200'&&i===3&&mode==='visual')await page.screenshot({path:`${out}/eighths-200-visual.png`,fullPage:true});
   if(mode==='linear'){
    await root.getByRole('button',{name:'Check',exact:true}).click();if(!await root.getByRole('heading',{name:'Your answer'}).count()||await suffix.innerText()!==`/ ${item.d}`||!await pieces.isDisabled())throw Error('acceptance or suffix missing');if(i<3)await root.getByRole('button',{name:'Next problem'}).click();else if(!await root.getByRole('button',{name:'Back to start'}).count())throw Error('final return missing');
    if(i<3)await page.getByRole('button',{name:'Show the picture'}).click();
   }
  }
 }
 await page.close();
}
const visualPage=await browser.newPage({viewport:{width:360,height:740}});await visualPage.goto('http://127.0.0.1:5213/FractionFlow/');await visualPage.getByText('Choose what to practice',{exact:true}).click();await visualPage.getByText('Add mixed numbers',{exact:true}).click();const visualRoot=visualPage.locator('.plan72-addition:visible'),visualWhole=visualRoot.locator('[data-field=whole]'),visualPieces=visualRoot.getByRole('textbox',{name:'Fourth pieces in the sum'});await visualWhole.fill('2');await visualPieces.fill('2');await visualPieces.focus();await visualPage.keyboard.press('Tab');const nextFocus=await visualPage.evaluate(()=>document.activeElement?.textContent);if(nextFocus!=='Help')throw Error('unexpected tab stop after numerator');await visualRoot.getByRole('button',{name:'Check',exact:true}).click();const accepted=await visualRoot.getByLabel('2 and 2 fourths').count();if(accepted!==1||await visualRoot.locator('.plan72-denominator').innerText()!=='/ 4')throw Error('visual acceptance failed');observations.push({case:'visual-acceptance',accepted,nextFocus,suffix:'/ 4'});await visualPage.screenshot({path:`${out}/fourths-accepted.png`,fullPage:true});await visualPage.close();
}finally{await writeFile(`${out}/observations.json`,JSON.stringify({browser:browser.version(),zoom:'CSS root scaling; actual browser zoom not measured',observations,errors},null,2));await browser.close();await server.close();}
if(errors.length)throw Error(errors.join('\n'));
