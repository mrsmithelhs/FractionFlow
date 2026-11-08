import { writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { convertToDenominator, createFraction, addAtCommonDenominator, subtractAtCommonDenominator, equalFractions } from '../../../src/math/index.js';
import { PLAN35_ADDITION_RECIPE_RECORDS } from '../../../src/content/data/plan35-addition-recipe-records.js';
import { PLAN40_SUBTRACTION_RECIPE_RECORDS } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';

// Report-local, standalone-family witness. It does not exercise managed admission.
const directory = 'reports/development/plan-90-goal-linked-managed-practice';
const outputPath = `${directory}/${process.env.PLAN90_ARITHMETIC_OUTPUT ?? 'arithmetic-final-observations.json'}`;
const allIds = [
  'plan35-identify-half-three-tenths-10', 'one-half-plus-one-third', 'plan35-construct-half-fifth-10',
  'plan40-identify-one-half-one-eighth-8', 'plan40-inspect-two-thirds-one-fourth-12', 'plan40-construct-half-fifth-10',
];
const ids = process.env.PLAN90_ARITHMETIC_ITEMS?.split(',') ?? allIds;
const records = new Map([...PLAN35_ADDITION_RECIPE_RECORDS, ...PLAN40_SUBTRACTION_RECIPE_RECORDS].map(record => [record.itemId, record]));
const publicTypes = new Map([
  ['sum-under-one', allIds.slice(0, 3)],
  ['unlike-denominator-subtraction', allIds.slice(3)],
]);
const conditions = [];
const viewports = (process.env.PLAN90_ARITHMETIC_VIEWPORTS ?? '360x740,480x740,600x740,768x740,1093x614,1440x900').split(',').map(value => value.split('x').map(Number));
for (const [width, height] of viewports) {
    for (const rootScale of (process.env.PLAN90_ARITHMETIC_SCALES ?? '100,200').split(',').map(Number)) for (const displayCondition of (process.env.PLAN90_ARITHMETIC_CONDITIONS ?? 'phase2-bundle-1').split(',')) for (const support of ['high-support', 'medium-support']) for (const view of ['visual', 'linear']) {
      if ((!process.env.PLAN90_ARITHMETIC_WIDTH || width === Number(process.env.PLAN90_ARITHMETIC_WIDTH))
        && (!process.env.PLAN90_ARITHMETIC_SCALE || rootScale === Number(process.env.PLAN90_ARITHMETIC_SCALE))) conditions.push({ width, height, rootScale, support, view, displayCondition });
    }
}
const failures = [], runs = [];
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
let browser;
const asFraction = form => createFraction(BigInt(form.numerator), BigInt(form.denominator));
function answer(record) {
  const left = asFraction(record.sourceForms.left), right = asFraction(record.sourceForms.right);
  const denominator = BigInt(record.targetDenominator);
  const result = record.definitionId === 'phase-3-reusable-addition-recipes'
    ? addAtCommonDenominator(left, right, denominator)
    : subtractAtCommonDenominator(left, right, denominator);
  return { numerator: String(result.numerator), denominator: String(result.denominator) };
}
function targetForms(record) {
  const den = BigInt(record.targetDenominator);
  return Object.fromEntries(['left', 'right'].map(side => [side, convertToDenominator(asFraction(record.sourceForms[side]), den)]));
}

async function measure(page, record, expectedSupport, expectedView, stage) {
  return page.evaluate(({ itemId, expectedSupport, expectedView, stage }) => {
    const state = window.arithmeticFit.app.getState();
    const visible = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && !el.closest('[hidden]'); };
    const rect = el => { if (!el) return null; const r = el.getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight }; };
    const host = document.querySelector('.app-visual-view:not([hidden]),.app-linear-view:not([hidden])');
    const episode = document.querySelector('.app-episode');
    const working = host?.closest('.app-working-area') || host;
    const elements = [...(host?.querySelectorAll('h1,p,figure,form,button,input,summary,.fraction-bar,.symbolic-expression') || [])]
      .filter(visible).map(el => ({ tag:el.tagName, role:el.getAttribute('role'), label:(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0,120), className:String(el.className || ''), ...rect(el) }));
    const currentItem = state?.taskContext?.itemId ?? state?.item?.id ?? null;
    const support = window.arithmeticFit.app.getSelectedSupportLevel()?.id ?? null;
    const activeView = host?.classList.contains('app-linear-view') ? 'linear' : 'visual';
    const viewport = { width:innerWidth,height:innerHeight };
    const overflowElements = elements.filter(el => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1 || el.x < -1 || el.right > innerWidth + 1);
    return { stage, expectedItem:itemId, actualItem:currentItem, identityMatches:currentItem === itemId,
      expectedSupport, actualSupport:support, expectedView, actualView:activeView,
      supportMatches: support === expectedSupport,
      viewMatches: activeView === expectedView, viewport, rootFont:getComputedStyle(document.documentElement).fontSize,
      document:{clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,clientHeight:document.documentElement.clientHeight,scrollHeight:document.documentElement.scrollHeight},
      workingArea:rect(working), episode:rect(episode), overflowElements, elements };
  }, { itemId:record.itemId, expectedSupport, expectedView, stage });
}

async function run(context, record, condition, port) {
  const page = await context.newPage();
  page.setDefaultTimeout(5000); page.setDefaultNavigationTimeout(30000);
  const result = { itemId:record.itemId, recordRevision:record.authoringRevision, setId:record.definitionId === 'phase-3-reusable-addition-recipes' ? 'unlike-addition-vetted-set@7' : 'unlike-subtraction-vetted-set@2', definition:`${record.definitionId}@${record.definitionRevision}`, recipe:`${record.recipeId}@${record.patternRevision}`, stimulus:record.stimulusId ? `${record.stimulusId}@${record.stimulusRevision}` : null, ...condition, stages:[], failures:[] };
  page.on('pageerror', error => result.failures.push(`pageerror: ${error.message}`));
  try {
    await page.goto(`http://127.0.0.1:${port}/${directory}/arithmetic-fit.html?item=${encodeURIComponent(record.itemId)}`);
    if (condition.rootScale !== 100) await page.addStyleTag({ content:`html { font-size:${condition.rootScale}% !important; }` });
    await page.locator('.app-gear-button').click();
    await page.locator(`[data-condition-id="${condition.displayCondition}"]`).click();
    await page.locator('.app-gear-button').click();
    await page.locator(`[data-support-id="${condition.support}"]`).click();
    const openChooser = page.locator('[data-entry-chooser]');
    if (await openChooser.getAttribute('aria-expanded') === 'false') await openChooser.click();
    const typeId = record.definitionId === 'phase-3-reusable-addition-recipes' ? 'sum-under-one' : 'unlike-denominator-subtraction';
    await page.locator(`[data-entry-role="browse"][data-practice-type="${typeId}"]`).click();
    if (condition.view === 'linear') await page.locator('.app-view-toggle').click();
    const hostSelector = condition.view === 'linear' ? '.app-linear-view' : '.app-visual-view';
    const host = page.locator(hostSelector);
    const stage = async name => {
      const receipt = await measure(page, record, condition.support, condition.view, name);
      result.stages.push(receipt);
      for (const key of ['identityMatches','supportMatches','viewMatches']) if (!receipt[key]) throw Error(`${name}: ${key} failed (${JSON.stringify({actualItem:receipt.actualItem,actualSupport:receipt.actualSupport,actualView:receipt.actualView})})`);
    };
    const state = () => page.evaluate(() => window.arithmeticFit.app.getState());
    await stage('initial');
    if ((await state()).activeCondition.id !== condition.displayCondition) throw Error('Display condition mismatch.');
    const recipe = record.recipeId;
    await host.locator('.active-beat-controls button').first().click();
    await stage('encounter');
    if (recipe.endsWith('identify-side-construct')) {
      await host.locator('.nested-side-choice').nth(record.requiredSide === 'left' ? 0 : 1).click();
      await stage('identify-side');
    }
    const taskHelp = page.getByRole('button', {name:'Need help?',exact:true});
    if (await taskHelp.isVisible()) {
      await taskHelp.click(); await stage('task-help-open');
      const closeHelp = page.getByRole('button', {name:'Close help',exact:true});
      if (await closeHelp.isVisible()) await closeHelp.click();
    } else result.taskHelp = 'No visible task-local Need help control at this beat.';
    // Exercise recipe help while on the conversion beat; measure its actual panel and controls.
    const helpSummary = host.locator('.plan45-help-summary, details summary').first();
    if (await helpSummary.count()) { await helpSummary.click(); await stage('transform-help-open'); await helpSummary.click().catch(()=>{}); }
    const forms = targetForms(record), expected = answer(record), required = recipe.endsWith('identify-side-construct') ? [record.requiredSide] : ['left','right'];
    for (const side of required) {
      if (recipe.endsWith('inspect-keep-repair')) {
        const candidate = record.candidates[side];
        const correct = equalFractions(asFraction(candidate), forms[side]);
        if (correct) await host.locator(`.active-beat-controls button[aria-label="Keep new fraction ${candidate.numerator} over ${candidate.denominator}"]`).click();
        else {
          await host.locator('.inspect-change-button').click();
          const input = condition.view === 'linear' ? `#linear-transform-num-input-${side}` : `#transform-num-input-${side}`;
          await host.locator(input).fill(String(forms[side].numerator)); await host.locator('.active-beat-controls .control-submit-btn').click();
        }
      } else {
        const input = condition.view === 'linear' ? `#linear-transform-num-input-${side}` : `#transform-num-input-${side}`;
        await host.locator(input).fill(String(forms[side].numerator)); await host.locator('.active-beat-controls .control-submit-btn').click();
      }
      await stage(`transform-${side}-complete`);
    }
    const addition = record.definitionId === 'phase-3-reusable-addition-recipes';
    const numInput = condition.view === 'linear' ? '#linear-operate-fraction-numerator-input' : '#operate-fraction-numerator-input';
    const denInput = condition.view === 'linear' ? '#linear-operate-fraction-denominator-input' : '#operate-fraction-denominator-input';
    const sumInput = condition.view === 'linear' ? '#linear-operate-sum-input' : '#operate-sum-input';
    // Submit a wrong answer once, record recovery, then complete the operation.
    if (addition) {
      await host.locator(sumInput).fill(String(BigInt(expected.numerator) + 1n));
    } else {
      await host.locator(numInput).fill('0'); await host.locator(denInput).fill('1');
    }
    await host.locator('.active-beat-controls .control-submit-btn').click(); await stage('wrong-operation-recovery');
    if (addition) await host.locator(sumInput).fill(expected.numerator);
    else { await host.locator(numInput).fill(expected.numerator); await host.locator(denInput).fill(expected.denominator); }
    // Request the task-local operation help when its disclosure exists.
    const help = host.locator('.plan45-help-summary, details summary').first();
    if (await help.count()) { await help.click(); await stage('operate-help-open'); await help.click().catch(()=>{}); }
    await host.locator('.active-beat-controls .control-submit-btn').click(); await stage('operation-resolved');
    if ((await state()).beat !== 'resolve') throw Error(`Operation did not reach resolve: ${(await state()).beat}`);
    await host.locator('.active-beat-controls button').first().click();
    if (!await page.locator('.app-entry-page').isVisible()) throw Error('Final control did not return to entry.');
    result.completed = true;
  } catch (error) {
    result.failures.push(error.stack || String(error));
  } finally { await page.close(); }
  return result;
}

try {
  await mkdir(directory,{recursive:true}); await server.listen(); browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
  const port=server.httpServer.address().port;
  for (const condition of conditions) {
    const context=await browser.newContext({viewport:{width:condition.width,height:condition.height}});
    for (const id of ids) {
      const record=records.get(id);
      if (!record) { failures.push(`${id}: missing exact record`); continue; }
      const runResult=await run(context,record,condition,port); runs.push(runResult);
      if (!runResult.completed || runResult.failures.length) failures.push(`${id}/${condition.support}/${condition.view}/${condition.width}x${condition.height}/${condition.rootScale}%: ${runResult.failures.join('; ') || 'journey incomplete'}`);
    }
    await context.close();
  }
  const report={status:failures.length?'incomplete':'completed',method:'Public standalone chooser and mounted app; exact six Plan 35/40 records; actual support selection verified per stage; both presentation views; errors, task help, operation and resolve controls. CSS root font 200% is text enlargement, not browser zoom. Geometry is evidence for review and does not itself certify learner fit.',browser:{name:'Chrome',version:browser.version()},conditions,records:ids.map(id=>({itemId:id,authoringRevision:records.get(id)?.authoringRevision,definitionId:records.get(id)?.definitionId,definitionRevision:records.get(id)?.definitionRevision,recipeId:records.get(id)?.recipeId,patternRevision:records.get(id)?.patternRevision,stimulusId:records.get(id)?.stimulusId??null,stimulusRevision:records.get(id)?.stimulusRevision??null})),runCount:runs.length,expectedRunCount:conditions.length*ids.length,failures,runs};
  await writeFile(outputPath,JSON.stringify(report,null,2)+'\n');
  if(failures.length){console.error(`${failures.length} incomplete/overflow conditions; see ${outputPath}`);process.exitCode=1;} else console.log(`Completed ${runs.length} arithmetic standalone journeys; see ${outputPath}`);
} finally { await browser?.close(); await server.close(); }
