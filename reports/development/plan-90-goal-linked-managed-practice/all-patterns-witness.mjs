import {writeFile} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {PLAN35_ADDITION_RECIPE_RECORDS} from '../../../src/content/data/plan35-addition-recipe-records.js';
import {PLAN40_SUBTRACTION_RECIPE_RECORDS} from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import {createFraction,convertToDenominator,equalFractions,addAtCommonDenominator,subtractAtCommonDenominator} from '../../../src/math/index.js';

const dir='reports/development/plan-90-goal-linked-managed-practice';
const arithmetic=new Map([...PLAN35_ADDITION_RECIPE_RECORDS,...PLAN40_SUBTRACTION_RECIPE_RECORDS].map(x=>[x.itemId,x]));
const patterns=[
  ['M0','plan45-compare-02','plan45-compare-09','plan45-compare-10','distance-01'],
  ['M1','plan45-compare-08','bridge-06-three-eighths-8','plan45-compare-10','distance-04'],
  ['U0','plan35-identify-half-three-tenths-10','one-half-plus-one-third','plan35-construct-half-fifth-10'],
  ['U1','plan40-identify-one-half-one-eighth-8','plan40-inspect-two-thirds-one-fourth-12','plan40-construct-half-fifth-10'],
];
const relations={'plan45-compare-02':'>','plan45-compare-08':'<','plan45-compare-09':'>','plan45-compare-10':'<','distance-01':'<','distance-04':'>'};
const asFraction=form=>createFraction(BigInt(form.numerator),BigInt(form.denominator));
const server=process.env.PLAN90_EXISTING==='1'?null:await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});
const width=Number(process.env.PLAN90_REPAIR_WIDTH??1093),height=Number(process.env.PLAN90_REPAIR_HEIGHT??614);
const screenshots=process.env.PLAN90_REPAIR_NO_SCREENSHOTS!=='1';
let browser;const runs=[],errors=[];
async function compare(host,id){await host.locator(`.plan45-relation-option input[value="${relations[id]}"]`).check();await host.locator('.plan45-check-button').click();await host.locator('.plan45-progression-button').click();}
async function distance(host,id){await host.locator(`.plan51-response input[value="${relations[id]}"]`).check();await host.locator('.plan51-response button[type=submit]').click();await host.locator('[data-plan51-focus=numerator]').fill(id==='distance-01'?'4':'3');await host.locator('[data-plan51-focus=denominator]').fill(id==='distance-01'?'8':'6');await host.locator('.plan51-response button[type=submit]').click();await host.locator('.plan51-next').click();}
async function placement(host,view,page,support='high-support',item='bridge-06-three-eighths-8'){
  const id=support==='high-support'?(item==='bridge-02-fourth-4'?'partition-1-of-4':'partition-3-of-8'):(item==='bridge-02-fourth-4'?'candidate-b':'candidate-c');
  if(view==='linear') await host.locator(`input[type=radio][data-candidate-id="${id}"]`).check();
  else {
    const ordered=await host.locator('.plan39-candidate-point').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-candidate-id'))),target=ordered.indexOf(id),status=host.locator('.plan39-stepper-status');
    for(let i=0;i<12;i++){const current=ordered.indexOf(await status.getAttribute('data-candidate-id'));if(current===target)break;await host.locator(current<0||current<target?'.plan39-stepper-next':'.plan39-stepper-previous').click();}
    assert.equal(await status.getAttribute('data-candidate-id'),id);
  }
  assert.equal(await host.locator('.plan39-bar-track').count(),0);
  await host.locator('.plan39-check-position').click();assert.ok(await host.locator('.plan39-resolution-description').count());
  if(view==='visual'&&page)await page.screenshot({path:`${dir}/pattern-M1-placement.png`,fullPage:true});
  await host.locator('.plan39-finish').click();
}
async function operate(host,view,record,page){
  const recipe=record.recipeId;await host.locator('.active-beat-controls button').first().click();
  if(recipe.endsWith('identify-side-construct'))await host.locator('.nested-side-choice').nth(record.requiredSide==='left'?0:1).click();
  const den=BigInt(record.targetDenominator),forms=Object.fromEntries(['left','right'].map(side=>[side,convertToDenominator(asFraction(record.sourceForms[side]),den)]));
  const required=recipe.endsWith('identify-side-construct')?[record.requiredSide]:['left','right'];
  for(const side of required){
    if(recipe.endsWith('inspect-keep-repair')){
      const candidate=record.candidates[side];
      if(equalFractions(asFraction(candidate),forms[side])){await host.locator(`.active-beat-controls button[aria-label="Keep new fraction ${candidate.numerator} over ${candidate.denominator}"]`).click();continue;}
      await host.locator('.inspect-change-button').click();
    }
    await host.locator(`#${view==='linear'?'linear-':''}transform-num-input-${side}`).fill(String(forms[side].numerator));
    await host.locator('.active-beat-controls .control-submit-btn').click();
  }
  const addition=record.definitionId==='phase-3-reusable-addition-recipes', result=(addition?addAtCommonDenominator:subtractAtCommonDenominator)(asFraction(record.sourceForms.left),asFraction(record.sourceForms.right),den);
  if(addition)await host.locator(`#${view==='linear'?'linear-':''}operate-sum-input`).fill(String(result.numerator));
  else {await host.locator(`#${view==='linear'?'linear-':''}operate-fraction-numerator-input`).fill(String(result.numerator));await host.locator(`#${view==='linear'?'linear-':''}operate-fraction-denominator-input`).fill(String(result.denominator));}
  await host.locator('.active-beat-controls .control-submit-btn').click();
  if(!addition) {
    assert.equal(await host.locator('.active-beat-prompt').innerText(),"That's right.");
    const equation=await host.locator('.symbolic-expression').first().evaluate(node=>node.outerHTML);
    assert.ok(equation.includes(`${result.numerator} over ${result.denominator}`));
  }
  if(view==='visual'&&page&&record.itemId.startsWith('plan35-identify'))await page.screenshot({path:`${dir}/pattern-U0-result.png`,fullPage:true});
  if(view==='visual'&&page&&record.itemId.startsWith('plan40-identify'))await page.screenshot({path:`${dir}/pattern-U1-result.png`,fullPage:true});
  await host.locator('.active-beat-controls button').first().click();
}
try{
  await server?.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
  const base=server?`http://127.0.0.1:${server.httpServer.address().port}/${dir}/integration-preview.html`:`http://127.0.0.1:5199/FractionFlow/${dir}/integration-preview.html`;
  for(let seed=0;seed<4;seed++)for(const support of ['high-support','medium-support'])for(const view of ['visual','linear']){
    const page=await browser.newPage({viewport:{width,height}});page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}?seed=${seed}&support=${support}`);await page.locator('[data-session-entry="comparison"]').click();
    if(view==='linear')await page.locator('.app-view-toggle').click();const host=page.locator(view==='visual'?'.app-visual-view':'.app-linear-view'),ids=[];
    const witness=await page.evaluate(()=>window.integrationApp.getManagedSessionWitness());assert.equal(witness.seed,seed);
    for(const id of patterns[seed].slice(1)){
      const state=await page.evaluate(()=>window.integrationApp.getState());ids.push(state.taskContext.itemId);assert.equal(ids.at(-1),id);
      if(screenshots&&view==='visual'&&support==='high-support'&&ids.length===1)await page.screenshot({path:`${dir}/pattern-${patterns[seed][0]}.png`,fullPage:true});
      if(id.startsWith('plan45-')||id.startsWith('distance-')) {
        const options=host.locator('.plan45-relation-option input');assert.deepEqual(await options.evaluateAll(nodes=>nodes.map(n=>n.value)),['>','=','<']);
        await options.nth(0).focus();await page.keyboard.press('ArrowRight');assert.equal(await options.nth(1).evaluate(n=>n===document.activeElement),true);
        await page.keyboard.press('ArrowRight');assert.equal(await options.nth(2).evaluate(n=>n===document.activeElement),true);
      }
      if(id.startsWith('plan45-'))await compare(host,id);else if(id.startsWith('distance-'))await distance(host,id);else if(id.startsWith('bridge-'))await placement(host,view,screenshots&&support==='high-support'?page:null,support);else await operate(host,view,arithmetic.get(id),screenshots&&support==='high-support'?page:null);
    }
    assert.equal(await page.locator('.app-entry-page').isVisible(),true);runs.push({seed,pattern:patterns[seed][0],view,support,ids,finished:true,fit:witness.fit});await page.close();
  }
  const reduced=await browser.newPage({viewport:{width:360,height:740}});await reduced.goto(`${base}?seed=1`);await reduced.addStyleTag({content:'html{font-size:150% !important}'});await reduced.locator('[data-session-entry="comparison"]').click();
  const reducedWitness=await reduced.evaluate(()=>window.integrationApp.getManagedSessionWitness());assert.equal(reducedWitness.seed,1);assert.equal((await reduced.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'plan45-compare-02');
  await reduced.close();
  const loss=await browser.newPage({viewport:{width:1093,height:614}});await loss.goto(`${base}?seed=1`);await loss.locator('[data-session-entry="comparison"]').click();
  await loss.addStyleTag({content:'html{font-size:150% !important}'});await loss.setViewportSize({width:360,height:740});
  const lossHost=loss.locator('.app-visual-view');await lossHost.locator('.plan45-relation-option input[value="<"]').check();await lossHost.locator('.plan45-check-button').click();await lossHost.locator('.plan45-progression-button').click();
  assert.equal(await loss.locator('.app-entry-page').isVisible(),true);assert.match(await loss.locator('.app-session-entry-notice').textContent(),/complete for now/);await loss.close();
  const arithmeticRollback=await browser.newPage({viewport:{width:1093,height:614}});await arithmeticRollback.goto(`${base}?seed=2`);await arithmeticRollback.locator('[data-session-entry="comparison"]').click();
  const arith=arithmeticRollback.locator('.app-visual-view');await arith.locator('.active-beat-controls button').first().click();await arith.locator('.nested-side-choice').first().click();
  await arith.locator('#transform-num-input-left').fill('4');await arithmeticRollback.evaluate(()=>window.integrationFailMount(true));
  await arithmeticRollback.getByRole('button',{name:'Try this problem again'}).click();
  assert.equal((await arithmeticRollback.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'plan35-identify-half-three-tenths-10');
  assert.equal(await arith.locator('#transform-num-input-left').inputValue(),'4');assert.equal(await arithmeticRollback.evaluate(()=>document.activeElement.classList.contains('app-navigation-notice')),true);
  await arith.locator('#transform-num-input-left').fill('5');await arithmeticRollback.evaluate(()=>window.integrationFailMount(false));await arith.locator('.active-beat-controls .control-submit-btn').click();await arithmeticRollback.close();
  const placementRollback=await browser.newPage({viewport:{width:1093,height:614}});await placementRollback.goto(`${base}?seed=1`);await placementRollback.locator('[data-session-entry="comparison"]').click();
  const placeHost=placementRollback.locator('.app-visual-view');await compare(placeHost,'plan45-compare-08');
  await placeHost.locator('.plan39-stepper-next').click();const chosen=await placeHost.locator('.plan39-stepper-status').getAttribute('data-candidate-id');assert.ok(chosen);
  await placementRollback.evaluate(()=>window.integrationFailMount(true));await placementRollback.getByRole('button',{name:'Try this problem again'}).click();
  assert.equal((await placementRollback.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'bridge-06-three-eighths-8');
  assert.equal(await placeHost.locator('.plan39-stepper-status').getAttribute('data-candidate-id'),chosen);
  assert.equal(await placementRollback.evaluate(()=>document.activeElement.classList.contains('app-navigation-notice')),true);
  await placementRollback.evaluate(()=>window.integrationFailMount(false));await placeHost.locator('.plan39-stepper-previous').click();await placementRollback.close();
  const crossRollback=await browser.newPage({viewport:{width:1093,height:614}});await crossRollback.goto(`${base}?seed=1`);await crossRollback.locator('[data-session-entry="comparison"]').click();
  const crossHost=crossRollback.locator('.app-visual-view');await crossHost.locator('.plan45-relation-option input[value="<"]').check();await crossHost.locator('.plan45-check-button').click();
  await crossRollback.evaluate(()=>window.integrationFailMount(true));await crossHost.locator('.plan45-progression-button').click();
  assert.equal((await crossRollback.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'plan45-compare-08');
  assert.equal(await crossRollback.evaluate(()=>document.activeElement.classList.contains('app-navigation-notice')),true);
  await crossRollback.evaluate(()=>window.integrationFailMount(false));await crossHost.locator('.plan45-progression-button').click();
  assert.equal((await crossRollback.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'bridge-06-three-eighths-8');await crossRollback.close();
  const alternate=await browser.newPage({viewport:{width:1093,height:614}});await alternate.goto(`${base}?seed=1&reject=bridge-06-three-eighths-8`);await alternate.locator('[data-session-entry="comparison"]').click();
  const alternateHost=alternate.locator('.app-visual-view');await compare(alternateHost,'plan45-compare-08');
  assert.equal((await alternate.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'bridge-02-fourth-4');
  await placement(alternateHost,'visual',null,'high-support','bridge-02-fourth-4');await compare(alternateHost,'plan45-compare-10');await distance(alternateHost,'distance-04');
  assert.equal(await alternate.locator('.app-entry-page').isVisible(),true);await alternate.close();
  const condition=await browser.newPage({viewport:{width:1093,height:614}});await condition.goto(`${base}?seed=2&condition=phase2-bundle-2`);await condition.locator('[data-session-entry="comparison"]').click();
  const conditionState=await condition.evaluate(()=>window.integrationApp.getState());assert.equal(conditionState.taskContext.itemId,'plan35-identify-half-three-tenths-10');assert.equal(conditionState.activeCondition.id,'phase2-bundle-2');await condition.close();
  const short=await browser.newPage({viewport:{width:1093,height:614}});await short.goto(`${base}?seed=2&reject=one-half-plus-one-third`);await short.locator('[data-session-entry="comparison"]').click();
  const shortHost=short.locator('.app-visual-view');await operate(shortHost,'visual',arithmetic.get('plan35-identify-half-three-tenths-10'));
  assert.equal((await short.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'plan35-construct-half-fifth-10');
  await operate(shortHost,'visual',arithmetic.get('plan35-construct-half-fifth-10'));assert.equal(await short.locator('.app-entry-page').isVisible(),true);await short.close();
  const single=await browser.newPage({viewport:{width:1093,height:614}});await single.goto(`${base}?seed=0&only=distance-04`);await single.locator('[data-session-entry="comparison"]').click();
  assert.equal((await single.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'distance-04');await distance(single.locator('.app-visual-view'),'distance-04');assert.equal(await single.locator('.app-entry-page').isVisible(),true);await single.close();
  const endpoint=await browser.newPage({viewport:{width:1093,height:614}});await endpoint.goto(`${base}?seed=2`);await endpoint.locator('[data-session-entry="comparison"]').click();
  await endpoint.evaluate(()=>window.integrationRejectItem('plan35-construct-half-fifth-10'));
  await operate(endpoint.locator('.app-visual-view'),'visual',arithmetic.get('plan35-identify-half-three-tenths-10'));
  assert.equal(await endpoint.locator('.app-entry-page').isVisible(),true);assert.match(await endpoint.locator('.app-session-entry-notice').textContent(),/complete for now/);await endpoint.close();
  const preflight=await browser.newPage({viewport:{width:1093,height:614}});await preflight.goto(`${base}?seed=0&preflightReject=distance-01`);await preflight.locator('[data-session-entry="comparison"]').click();
  assert.equal((await preflight.evaluate(()=>window.integrationApp.getState())).taskContext.itemId,'plan45-compare-08');
  const preflightWitness=await preflight.evaluate(()=>window.integrationApp.getManagedSessionWitness());
  assert.ok(preflightWitness.outcomes.some(x=>x.identity.itemId==='distance-01'&&x.reason==='preflight-failed'));
  assert.equal(await preflight.locator('[data-managed-renderer-preflight]').count(),0);await preflight.close();
  const unseeded=await browser.newPage({viewport:{width,height}});await unseeded.goto(base);await unseeded.locator('[data-session-entry="comparison"]').click();
  const unseededWitness=await unseeded.evaluate(()=>window.integrationApp.getManagedSessionWitness());assert.ok(Number.isInteger(unseededWitness.seed));assert.ok(await unseeded.evaluate(()=>window.integrationApp.getState().taskContext.itemId));await unseeded.close();
  await writeFile(`${dir}/${process.env.PLAN90_REPAIR_ALL_OUTPUT??'all-patterns-observations.json'}`,JSON.stringify({browser:browser.version(),viewport:{width,height},unseededStart:unseededWitness,method:'Ordinary Start with deterministic seed injection only; production fit, admission and controls. Explicit fault injection for rollback, shortened visits, single fallback, renderer preflight and designated alternative cases.',runs,reduced:{width:360,height:740,rootText:'150%',seed:1,selected:'M0',witness:reducedWitness},condition:'Seed 2 started U0 with phase2-bundle-2 preserved.',shortened:'Forced inspection preflight refusal produced U0 identify → construct → return.',requiredEndpointLoss:'Forced later construct preflight refusal ended U0 after identify rather than proceeding to inspection.',single:'Only distance-04 preflighted; one-item practice completed and returned.',requiredPlacementLoss:'M1 ended on its completed comparison after narrowing made both unstarted placement candidates ineligible.',alternative:'With bridge-06 preflight forced to fail, M1 completed using the designated bridge-02 substitute.',detachedPreflight:'Forced failure after detached distance-01 renderer mount rejected M0 and selected M1 before the first task; no scratch host remained.',rollback:'Forced post-mount Retry failures restored an arithmetic transform draft and a placement stepper selection; cross-family Next failure restored completed comparison, then a later Next mounted placement. Notice focus and subsequent controls were checked.',errors},null,2)+'\n');
  if(errors.length)throw Error(errors.join('\n'));console.log(`Completed ${runs.length} four-pattern journeys and a measured reduced pool.`);
}finally{await browser?.close();await server?.close();}
