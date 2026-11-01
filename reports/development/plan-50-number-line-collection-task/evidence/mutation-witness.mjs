import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='reports/development/plan-50-number-line-collection-task/evidence';
const browser=await chromium.launch({channel:'chrome',headless:true});
const seeds={
  premature:{path:'plan50-number-line-collection-episode.js',from:'context.members.map(m => [m.id,null])',to:"context.members.map(m => [m.id,'step-0'])"},
  lostPartial:{path:'app.js',from:'visualView = !visualView;',to:"visualView = !visualView; if (isCollection(state)) state = createEpisode({episodeDefinition:state.episodeDefinition,taskContext:state.taskContext,support:state.support,activeCondition:state.activeCondition});"},
  unequalAnchors:{path:'number-line-collection.js',from:'tether.style.left=`calc(var(--plan50-inset) + (100% - 2 * var(--plan50-inset)) * ${Number(id.slice(5))/model.lattice})`',to:'tether.style.left=`calc(var(--plan50-inset) + (100% - 2 * var(--plan50-inset)) * ${Number(id.slice(5))/model.lattice + (i === 2 ? 0.125 : 0)})`'},
  wrongAcceptance:{path:'plan50-number-line-collection-episode.js',from:"Object.values(feedback).every(v => v === 'correct')",to:'true'},
};
async function ordinary(page) {
  await page.goto('http://127.0.0.1:5207/FractionFlow/');await page.getByRole('button',{name:'Place fractions together on a number line'}).click();
  let host=page.locator('.app-visual-view');
  assert.equal(await host.locator('.plan50-area .plan50-token').count(),0,'initial state must be unplaced');
  await host.locator('.plan50-member').nth(0).click();await host.getByRole('button',{name:'Move right'}).click();
  await page.getByRole('button',{name:'Read the steps'}).click();host=page.locator('.app-linear-view');
  assert.match(await host.locator('.plan50-member').nth(0).textContent(),/8 of 8/,'partial placement survives view change');
  await page.getByRole('button',{name:'Show the picture'}).click();host=page.locator('.app-visual-view');
  for(const n of [1,2]){await host.locator('.plan50-member').nth(n).click();await host.locator('.plan50-axis').scrollIntoViewIfNeeded();const box=await host.locator('.plan50-axis').boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);}
  const ties=await host.locator('.plan50-tether').evaluateAll(nodes=>nodes.map(x=>x.getBoundingClientRect().x));
  assert.ok(Math.abs(ties[1]-ties[2])<0.01,'same draft position has same anchor');
  await host.getByRole('button',{name:'Check',exact:true}).click();
  assert.match(await host.locator('.plan50-feedback').textContent(),/Check the marked/,'wrong member cannot be accepted');
}
const result={};
try {for(const name of ['clean',...Object.keys(seeds)]) {
  const page=await browser.newPage({viewport:{width:360,height:740}});let injected=name==='clean';
  if(name!=='clean'){const seed=seeds[name];await page.route(`**/src/**/${seed.path}*`,async route=>{const response=await route.fetch();const text=await response.text();if(!text.includes(seed.from))throw new Error(`mutation target missing: ${name}`);injected=true;await route.fulfill({response,body:text.replace(seed.from,seed.to)});});}
  try {await ordinary(page);result[name]={passed:true,injected};} catch(e){result[name]={passed:false,injected,error:e.message};}
  await page.close();
} } finally {await browser.close();}
await writeFile(`${out}/mutation-receipts.json`,JSON.stringify(result,null,2));
assert.equal(result.clean.passed,true,'clean ordinary assertions must pass');
for(const name of Object.keys(seeds)){assert.equal(result[name].injected,true,`${name} mutation must run`);assert.equal(result[name].passed,false,`${name} must fail ordinary assertion`);}
