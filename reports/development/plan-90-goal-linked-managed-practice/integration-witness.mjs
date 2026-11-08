import {writeFile} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const dir='reports/development/plan-90-goal-linked-managed-practice',runs=[],errors=[];
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'}); let browser;
try {
  await server.listen(); browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
  const base=`http://127.0.0.1:${server.httpServer.address().port}/${dir}/integration-preview.html`;
  for(const [width,height,scale,view,admit] of [[360,740,100,'visual',true],[360,740,200,'visual',false],[1093,614,100,'linear',true],[1440,900,100,'visual',true]]) {
    const page=await browser.newPage({viewport:{width,height}}); page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base); if(scale!==100)await page.addStyleTag({content:`html{font-size:${scale}% !important}`});
    const before=await page.evaluate(()=>window.integrationFit());
    await page.locator('[data-session-entry="comparison"]').click();
    let state=await page.evaluate(()=>window.integrationApp.getState());
    assert.equal(Boolean(state),admit,`${width}x${height} scale ${scale}: ${JSON.stringify(before)}`);
    if(!admit){assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('app-session-entry-notice')),true);}
    else {
      if(view==='linear')await page.locator('.app-view-toggle').click();
      const host=page.locator(view==='visual'?'.app-visual-view':'.app-linear-view'),ids=[];
      for(const [id,relation] of [['plan45-compare-02','>'],['plan45-compare-09','>'],['plan45-compare-10','<']]) {
        ids.push((await page.evaluate(()=>window.integrationApp.getState())).taskContext.itemId);assert.equal(ids.at(-1),id);
        await host.locator(`.plan45-relation-option input[value="${relation}"]`).check();await host.locator('.plan45-check-button').click();await host.locator('.plan45-progression-button').click();
      }
      ids.push((await page.evaluate(()=>window.integrationApp.getState())).taskContext.itemId);assert.equal(ids.at(-1),'distance-01');
      await host.locator('.plan51-response input[value="<"]').check();await host.locator('.plan51-response button[type=submit]').click();
      await host.locator('[data-plan51-focus=numerator]').fill('4');await host.locator('[data-plan51-focus=denominator]').fill('8');await host.locator('.plan51-response button[type=submit]').click();
      assert.equal((await page.evaluate(()=>window.integrationApp.getState())).status,'resolved');await host.locator('.plan51-next').click();
      assert.equal(await page.locator('.app-entry-page').isVisible(),true); runs.push({width,height,scale,view,before,ids,finished:true});
    }
    if(!admit) runs.push({width,height,scale,view,before,refused:true,notice:await page.locator('.app-session-entry-notice').textContent()});
    await page.close();
  }
  const failure=await browser.newPage({viewport:{width:1093,height:614}});
  await failure.goto(base);await failure.locator('[data-session-entry="comparison"]').click();const host=failure.locator('.app-visual-view');
  await host.locator('.plan45-help-summary').click();await host.getByRole('button',{name:'Use the same denominator'}).click();
  await host.locator('.plan49-helper-input').fill('8');await failure.evaluate(()=>window.integrationFailMount(true));
  await failure.getByRole('button',{name:'Try this problem again'}).click();
  assert.equal((await failure.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'plan45-compare-02');
  assert.equal(await host.locator('.plan49-helper-input').inputValue(),'8');
  assert.equal(await failure.evaluate(()=>document.activeElement.classList.contains('app-navigation-notice')),true);
  await host.locator('.plan49-helper-input').fill('16');await failure.evaluate(()=>window.integrationFailMount(false));
  await failure.getByRole('button',{name:'Try this problem again'}).click();
  await host.locator('.plan45-relation-option input[value=">"]').check();await host.locator('.plan45-check-button').click();
  await failure.evaluate(()=>window.integrationFailMount(true));await host.locator('.plan45-progression-button').click();
  assert.equal((await failure.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'plan45-compare-02');
  assert.equal(await failure.evaluate(()=>document.activeElement.classList.contains('app-navigation-notice')),true);
  await failure.evaluate(()=>window.integrationFailMount(false));await host.locator('.plan45-progression-button').click();
  assert.equal((await failure.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'plan45-compare-09');await failure.close();
  const resize=await browser.newPage({viewport:{width:768,height:740}});await resize.goto(base);
  await resize.addStyleTag({content:'html{font-size:200% !important}'});await resize.locator('[data-session-entry="comparison"]').click();
  const resizeHost=resize.locator('.app-visual-view');await resizeHost.locator('.plan45-help-summary').click();await resizeHost.getByRole('button',{name:'Use the same denominator'}).click();
  await resizeHost.locator('.plan49-helper-input').fill('8');await resize.setViewportSize({width:360,height:740});
  assert.equal(await resizeHost.locator('.plan49-helper-input').inputValue(),'8');await resizeHost.locator('.plan45-relation-option input[value=">"]').check();
  await resizeHost.locator('.plan45-check-button').click();await resizeHost.locator('.plan45-progression-button').click();
  assert.equal(await resize.locator('.app-entry-page').isVisible(),true);assert.match(await resize.locator('.app-session-entry-notice').textContent(),/complete for now/);await resize.close();
  await writeFile(`${dir}/integration-observations.json`,JSON.stringify({browser:browser.version(),method:'Real ordinary Start and production shell measurement; no selection or fit hook. Fault hook only for forced post-mount failures.',runs,rollback:'Post-mount Retry and Next failures retained task, draft or completed state, working controls and notice focus; later actions succeeded.',resize:'Measured 768→360 at 200% text preserved draft and finished at Next.',errors},null,2)+'\n');
  if(errors.length)throw Error(errors.join('\n')); console.log(`Completed ${runs.length} production Start cases.`);
}finally{await browser?.close();await server.close();}
