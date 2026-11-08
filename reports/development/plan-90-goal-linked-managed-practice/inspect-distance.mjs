import { createServer } from 'vite';
import { chromium } from 'playwright';
const dir = 'reports/development/plan-90-goal-linked-managed-practice';
const server = await createServer({ configFile:false, root:process.cwd(), server:{host:'127.0.0.1',port:0,strictPort:true}, logLevel:'error' });
let browser;
try {
  await server.listen(); browser = await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
  const page = await browser.newPage({viewport:{width:360,height:740}});
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${dir}/fit-batch.html?item=distance-01&support=high-support&view=visual`);
  await page.addStyleTag({content:'html { font-size: 200% !important; }'});
  const host = page.locator('.app-visual-view');
  await host.locator('.plan51-response input[value="<"]').check();
  await host.locator('.plan51-response').evaluate(el=>el.requestSubmit());
  await page.screenshot({path:`${dir}/distance-enlarged.png`,fullPage:true});
  await host.locator('[data-plan51-focus="numerator"]').fill('4');
  await host.locator('[data-plan51-focus="denominator"]').fill('8');
  await host.locator('.plan51-response button[type=submit]').click();
  await host.locator('.plan51-result').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${dir}/distance-result-enlarged.png`,fullPage:true});
  console.log('Captured distance entry and result at 360px and 200% CSS root text.');
} finally { await browser?.close(); await server.close(); }
