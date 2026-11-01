import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true});const result={};
try {
  const p=await b.newPage({viewport:{width:360,height:740},hasTouch:true});
  await p.goto('http://127.0.0.1:5207/FractionFlow/');await p.getByRole('button',{name:'Place fractions together on a number line'}).click();
  const host=p.locator('.app-visual-view');await host.locator('.plan50-member').first().tap();const axis=host.locator('.plan50-axis');await axis.scrollIntoViewIfNeeded();const box=await axis.boundingBox();await p.touchscreen.tap(box.x+box.width*0.75,box.y+box.height/2);
  assert.match(await host.locator('.plan50-member').first().textContent(),/6 of 8/);result.emulatedTouch='tap selected exact candidate';await p.close();
  const q=await b.newPage({viewport:{width:360,height:740}});let injected=false;
  await q.route('**/src/app/app.js*',async route=>{const response=await route.fetch();const source=await response.text();const from='function registeredItemEpisode(practiceType, index) {';assert.ok(source.includes(from));injected=true;await route.fulfill({response,body:source.replace(from,from+"\n    if (practiceType.id === 'number-line-collection' && index === 1) throw new Error('destination unavailable');")});});
  await q.goto('http://127.0.0.1:5207/FractionFlow/');await q.getByRole('button',{name:'Place fractions together on a number line'}).click();const h=q.locator('.app-visual-view');
  for(const [member,step] of [[0,6],[1,4],[2,4]]) {await h.locator('.plan50-member').nth(member).click();const axis=h.locator('.plan50-axis');await axis.scrollIntoViewIfNeeded();const a=await axis.boundingBox();await q.mouse.click(a.x+a.width*step/8,a.y+a.height/2);}
  await h.getByRole('button',{name:'Check',exact:true}).click();await h.locator('.plan50-next').click();
  assert.equal(injected,true);assert.match(await h.locator('.plan50-feedback').textContent(),/All fractions/);assert.match(await h.locator('.plan50-member').first().textContent(),/6 of 8/);assert.equal(await q.locator('.app-navigation-notice').isVisible(),true);
  result.navigationRefusal='accepted result retained after injected destination failure';await q.close();
  await writeFile('reports/development/plan-50-number-line-collection-task/evidence/touch-navigation.json',JSON.stringify(result,null,2));
} finally {await b.close();}
