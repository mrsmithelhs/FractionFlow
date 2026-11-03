import {createServer} from 'vite';
import {chromium} from 'playwright';
import {strict as assert} from 'node:assert';
import {writeFile} from 'node:fs/promises';
const dir='reports/development/plan-59-directed-number-line-endpoint/evidence/repair-03';
const server=await createServer({server:{host:'127.0.0.1',port:5303,strictPort:true}});await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
try{
 for(const cfg of [{width:360,height:740,dpr:1},{width:1093,height:614,dpr:1.25},{width:360,height:740,dpr:1,scale:200}]){
  const context=await browser.newContext({viewport:{width:cfg.width,height:cfg.height},deviceScaleFactor:cfg.dpr,hasTouch:true,reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5303/FractionFlow/#directed-number-line-endpoint');if(cfg.scale)await page.addStyleTag({content:'html {font-size:200% !important}'});
  const root=page.locator('.plan59-endpoint:visible');await root.waitFor();const axis=root.locator('.plan59-axis');const suffix=cfg.scale?'360-200pct':cfg.width;
  await page.screenshot({path:`${dir}/initial-${suffix}.png`,fullPage:true});
  const snap=()=>root.evaluate(el=>{const rect=node=>{const r=node.getBoundingClientRect();return {left:r.left+scrollX,right:r.right+scrollX,top:r.top+scrollY,bottom:r.bottom+scrollY,width:r.width,height:r.height};};const frame=el.querySelector('.plan59-frame');
   return {axis:rect(el.querySelector('.plan59-axis')),start:rect(el.querySelector('.plan59-start')),end:el.querySelector('.plan59-marker')?rect(el.querySelector('.plan59-marker')):null,frame:rect(frame),tray:el.querySelector('.plan59-tray')?rect(el.querySelector('.plan59-tray')):null,
    labels:[...el.querySelectorAll('.plan53-benchmark')].map(rect),feedback:rect(el.querySelector('.plan53-feedback')),expression:rect(el.querySelector('.plan59-expression')),scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,docHeight:document.documentElement.scrollHeight};});
  const initial=await snap(); assert.ok(initial.frame.height<175 || cfg.scale,'WITNESS_COMPACT');
  await axis.scrollIntoViewIfNeeded();const tile=root.locator('.plan59-drag-tile:visible');const card=await tile.boundingBox(),line=await axis.boundingBox();
  const sx=card.x+card.width*.8,sy=card.y+card.height*.25,ox=sx-(card.x+card.width/2),oy=sy-(card.y+card.height);
  const before=await snap();await page.mouse.move(sx,sy);await page.mouse.down();await page.mouse.move(line.x+line.width*.75+ox,line.y+line.height/2+oy,{steps:6});
  const during=await snap();assert.ok(Math.abs(before.axis.top-during.axis.top)<.1,'WITNESS_DRAG_AXIS');assert.ok(Math.abs(before.tray.height-during.tray.height)<.1,'WITNESS_DRAG_TRAY');
  assert.equal(await root.locator('.plan53-highlight').getAttribute('data-candidate-id'),'step-3');await page.mouse.up();const after=await snap();
  assert.ok(Math.abs(before.axis.top-after.axis.top)<.1,'WITNESS_DRAG_AXIS_AFTER');
  await root.getByRole('button',{name:'Move left'}).click();
  await root.getByRole('button',{name:'Check',exact:true}).click();
  assert.equal(await root.locator('.plan53-feedback').innerText(),'Check the direction and number of equal parts.');
  await root.getByRole('button',{name:'Help',exact:true}).click();
  assert.equal(await root.locator('.plan53-help').count(),1);
  await root.getByRole('button',{name:'Move right'}).click();
  assert.equal(await root.locator('.plan53-feedback').innerText(),'');
  assert.equal(await root.locator('.plan53-help').count(),1);
  assert.ok(Math.abs((await snap()).axis.top-before.axis.top)<.1,'WITNESS_RETRY_AXIS');
  await root.getByRole('button',{name:'Check',exact:true}).click();assert.equal(await root.locator('.plan53-feedback').innerText(),"That's right.");
  assert.equal(await root.locator('.plan53-feedback').evaluate(el=>document.activeElement===el),true,'WITNESS_SUCCESS_FOCUS');
  const accepted=await snap();assert.ok(accepted.expression.bottom<=accepted.feedback.top && accepted.feedback.bottom<=accepted.frame.top,'WITNESS_SUCCESS_ORDER');
  assert.equal(await root.locator('.plan59-tray, .plan53-prompt').count(),0);
  const order=await root.evaluate(el=>{const expr=el.querySelector('.plan59-expression'), feedback=el.querySelector('.plan53-feedback'), frame=el.querySelector('.plan59-frame'), next=el.querySelector('[data-focus-key=next]');return !!(expr.compareDocumentPosition(feedback)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(feedback.compareDocumentPosition(frame)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(frame.compareDocumentPosition(next)&Node.DOCUMENT_POSITION_FOLLOWING)});
  assert.ok(order,'WITNESS_SUCCESS_DOM_ORDER');
  for(const label of accepted.labels)assert.ok(label.top>=accepted.axis.top,'WITNESS_LABEL_POSITION');
  await page.screenshot({path:`${dir}/accepted-add-${suffix}.png`,fullPage:true});
  await page.getByRole('button',{name:'Read the steps'}).click();
  const linear=page.locator('.plan59-endpoint:visible');
  assert.ok(await linear.locator('.plan53-feedback').evaluate(el=>!!(el.compareDocumentPosition(el.parentElement.querySelector('.plan59-linear-verification'))&Node.DOCUMENT_POSITION_FOLLOWING)),'WITNESS_LINEAR_SUCCESS_ORDER');
  await page.getByRole('button',{name:'Show the picture'}).click();
  await root.locator('[data-focus-key=next]').click();
  async function place(i,d){await axis.scrollIntoViewIfNeeded();const b=await axis.boundingBox();await page.mouse.click(b.x+b.width*i/d,b.y+b.height/2);}
  for(const [n,d] of [[1,4],[4,6],[2,6]]){await place(n,d);await root.getByRole('button',{name:'Check',exact:true}).click();assert.equal(await root.locator('.plan53-feedback').innerText(),"That's right.");if(n===1)await page.screenshot({path:`${dir}/accepted-subtract-${suffix}.png`,fullPage:true});await root.locator('[data-focus-key=next]').click();}
  const eighth=[]; const eighthBaseline=await snap();
  for(const i of [2,3,8]){
   await place(i,8);const g=await snap();const overlap=Math.min(g.start.right,g.end.right)-Math.max(g.start.left,g.end.left);
   if(overlap>0){assert.ok(g.end.bottom<=g.start.top,'WITNESS_COLLISION_STACK');assert.ok(g.start.top-g.end.bottom>=3,'WITNESS_COLLISION_GAP');}
   else assert.ok(Math.abs(g.end.bottom-g.start.bottom)<1,'WITNESS_SEPARATE_BASELINE');
   assert.ok(Math.abs((g.end.left+g.end.right)/2-(g.axis.left+i*g.axis.width/8))<1,'WITNESS_POINT_ANCHOR');
   assert.ok(Math.abs(g.axis.top-eighthBaseline.axis.top)<.1,'WITNESS_REVISION_AXIS');
   eighth.push({i,overlap,geometry:g});await page.screenshot({path:`${dir}/${i===2?'same-slot':i===3?'adjacent':'far'}-${suffix}.png`,fullPage:true});
   if(i===2){
    const tile=root.locator('.plan59-drag-tile:visible'), card=await tile.boundingBox(), lineBox=await axis.boundingBox();
    const sx=card.x+card.width*.7,sy=card.y+card.height*.3,ox=sx-(card.x+card.width/2),oy=sy-(card.y+card.height);
    await page.mouse.move(sx,sy);await page.mouse.down();await page.mouse.move(lineBox.x+lineBox.width*3/8+ox,lineBox.y+lineBox.height/2+oy,{steps:6});
    assert.equal(await root.locator('.plan53-highlight').getAttribute('data-candidate-id'),'step-3','WITNESS_STACKED_REGRAB');
    const duringRegrab=await snap();assert.ok(Math.abs(duringRegrab.axis.top-g.axis.top)<.1,'WITNESS_STACKED_REGRAB_AXIS');
    await page.keyboard.press('Escape');await page.mouse.up();
    assert.equal(await root.locator('.plan59-position').textContent(),'Endpoint at 2 over 8.','WITNESS_STACKED_REGRAB_CANCEL');
   }
   if(i===3 && cfg.width===1093){
    await page.setViewportSize({width:360,height:740}); await page.waitForTimeout(100); const narrow=await snap();
    assert.ok(narrow.end.bottom<=narrow.start.top,'WITNESS_RESIZE_COLLISION');
    assert.equal(await root.locator('.plan59-position').textContent(),'Endpoint at 3 over 8.','WITNESS_RESIZE_DRAFT');
    await page.setViewportSize({width:cfg.width,height:cfg.height}); await page.waitForTimeout(100); const wide=await snap();
    assert.ok(Math.abs(wide.end.bottom-wide.start.bottom)<1,'WITNESS_RESIZE_BASELINE');
   }
  }
  assert.equal(await root.locator('.plan59-measure').getAttribute('aria-hidden'),'true');
  assert.deepEqual(errors,[]);results.push({cfg,initial,before,during,after,accepted,eighth});await context.close();
 }
 await writeFile(`${dir}/geometry.json`,JSON.stringify(results,null,2));console.log('PASS collision, success order, active drag stability and geometry');
}finally{await browser.close();await server.close();}
