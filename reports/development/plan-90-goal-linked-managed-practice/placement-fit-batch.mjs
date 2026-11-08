import { writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../../../src/content/data/plan37-bar-to-line-bridge-records.js';

const directory = 'reports/development/plan-90-goal-linked-managed-practice';
const itemIds = (process.env.PLAN90_PLACEMENT_ITEMS ?? 'bridge-06-three-eighths-8,bridge-02-fourth-4').split(',');
const items = itemIds.map(id => PLAN37_BAR_TO_LINE_BRIDGE_RECORDS.find(record => record.itemId === id));
if (items.some(item => !item)) throw new Error('Placement evidence records missing from Plan 37 registry.');
const widths = (process.env.PLAN90_PLACEMENT_WIDTHS ?? '360,1093,1440').split(',').map(Number);
const heights = (process.env.PLAN90_PLACEMENT_HEIGHTS ?? '740,614,900').split(',').map(Number);
if (heights.length !== widths.length) throw new Error('Provide one height per width with PLAN90_PLACEMENT_HEIGHTS.');
const scales = (process.env.PLAN90_PLACEMENT_SCALES ?? '100,200').split(',').map(Number);
const conditions = (process.env.PLAN90_PLACEMENT_CONDITIONS ?? 'phase2-bundle-1').split(',');
const output = process.env.PLAN90_PLACEMENT_OUTPUT ?? 'placement-fit-batch-observations.json';
const supports = ['high-support', 'medium-support'];
const views = ['visual', 'linear'];
const failures = [];
const runs = [];
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
let browser;

async function measure(page, stage) {
  return page.evaluate(stageName => {
    const appState = window.placementBatch.app.getState();
    const visible = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('[hidden]'); };
    const box = e => { if (!e) return null; const r = e.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height, right:r.right, bottom:r.bottom, clientWidth:e.clientWidth, scrollWidth:e.scrollWidth, clientHeight:e.clientHeight, scrollHeight:e.scrollHeight }; };
    const active = document.querySelector('.app-visual-view:not([hidden]),.app-linear-view:not([hidden])');
    const nodes = [...(active?.querySelectorAll('h1,p,figure,form,button,input,summary,.plan39-number-line,.plan39-bar-track,.plan39-stepper-status,.plan39-resolution-description') ?? [])].filter(visible);
    const elements = nodes.map(e => ({ tag:e.tagName, role:e.getAttribute('role'), label:e.getAttribute('aria-label') || (e.labels?.[0]?.textContent ?? e.textContent).trim().slice(0,120), className:String(e.className || ''), ...box(e) }));
    const root = document.documentElement;
    const episode = document.querySelector('.app-episode');
    const working = active?.querySelector('.active-beat-section') || active;
    return { stage:stageName, itemId:appState?.taskContext?.itemId, sourceForm:appState?.taskContext?.sourceForm, definition:appState?.episodeDefinition && { id:appState.episodeDefinition.id, revision:appState.episodeDefinition.revision }, beat:appState?.beat, status:appState?.status, support:appState?.support?.label, view:active?.classList.contains('app-linear-view') ? 'linear':'visual', viewport:{width:innerWidth,height:innerHeight,devicePixelRatio}, rootFont:getComputedStyle(root).fontSize, document:{clientWidth:root.clientWidth,scrollWidth:root.scrollWidth,clientHeight:root.clientHeight,scrollHeight:root.scrollHeight,horizontalOverflow:root.scrollWidth>root.clientWidth+1}, episode:box(episode), workingArea:box(working), elements, overflowElements:elements.filter(e=>e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1), scroll:{x:scrollX,y:scrollY} };
  }, stage);
}

async function moveVisualTo(page, wantedId) {
  const status = page.locator('.app-visual-view .plan39-stepper-status');
  const ordered = await page.locator('.app-visual-view .plan39-candidate-point').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-candidate-id')));
  const target = ordered.indexOf(wantedId);
  if (target < 0) throw new Error(`Target ${wantedId} is not offered: ${ordered.join(',')}`);
  for (let i=0; i<20; i++) {
    const currentId = await status.getAttribute('data-candidate-id');
    if (currentId === wantedId) return;
    const next = page.locator('.app-visual-view .plan39-stepper-next');
    const previous = page.locator('.app-visual-view .plan39-stepper-previous');
    const current = ordered.indexOf(currentId);
    if (current < 0 || current < target) await next.click();
    else await previous.click();
  }
  throw new Error(`Visual controls did not reach candidate ${wantedId}.`);
}

async function choose(page, view, candidateId) {
  if (view === 'visual') return moveVisualTo(page, candidateId);
  const radio = page.locator(`.app-linear-view input[type="radio"][data-candidate-id="${candidateId}"]`);
  await radio.scrollIntoViewIfNeeded();
  await radio.check();
}

async function runOne(context, record, support, view, width, height, scale, condition) {
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  page.setDefaultNavigationTimeout(30000);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const result = { itemId:record.itemId, support, view, condition, viewport:{width,height}, rootFontScale:`${scale}%`, definitionRevision:'2', stages:[], failures:pageErrors };
  try {
    const params = new URLSearchParams({item:record.itemId,support,view,condition});
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${directory}/placement-fit-batch.html?${params}`);
    if (scale !== 100) await page.addStyleTag({content:`html { font-size: ${scale}% !important; }`});
    const stage = async name => { const sample = await measure(page,name); result.stages.push(sample); if(sample.itemId!==record.itemId)throw new Error(`Mounted item ${sample.itemId} != ${record.itemId}`); if(sample.definition?.revision!=='2')throw new Error(`Definition revision is ${sample.definition?.revision}, expected 2`); if(sample.view!==view)throw new Error(`Active view ${sample.view} != ${view}`); if(sample.support !== (support==='high-support'?'high support':'medium support'))throw new Error(`Support mismatch: ${sample.support}`); };
    await stage('standalone-launch');
    if ((await page.evaluate(()=>window.placementBatch.app.getState().activeCondition.id)) !== condition) throw Error('Display condition mismatch.');
    const host = page.locator(view==='linear'?'.app-linear-view':'.app-visual-view');
    const prompt = await host.locator('.active-beat-prompt').innerText();
    const initial = result.stages.at(-1);
    if (!/place|location/i.test(prompt) || initial.sourceForm?.numerator !== record.sourceForm.numerator || initial.sourceForm?.denominator !== record.sourceForm.denominator) throw new Error(`Named source fraction or placement prompt missing: ${prompt}; form=${JSON.stringify(initial.sourceForm)}`);
    const helpButton = page.getByRole('button', {name:'Need help?'});
    if (await helpButton.count()) { await helpButton.scrollIntoViewIfNeeded(); await helpButton.click(); await stage('help-open'); }
    else result.help = 'No task-local help button available in this support/view condition.';
    const targetId = support === 'high-support' ? `partition-${record.sourceForm.numerator}-of-${record.partitionDenominator}`
      : record.sparseCandidates.find(candidate => BigInt(candidate.form.numerator) * BigInt(record.sourceForm.denominator) === BigInt(record.sourceForm.numerator) * BigInt(candidate.form.denominator)).id;
    const wrongId = support === 'high-support' ? `partition-0-of-${record.partitionDenominator}`
      : record.sparseCandidates.find(candidate => candidate.id !== targetId).id;
    await choose(page,view,wrongId); await stage('incorrect-choice-preview');
    const check = host.locator('.plan39-check-position'); await check.scrollIntoViewIfNeeded(); await check.click();
    let state = await measure(page,'incorrect-check-recovery');
    if (state.beat !== 'locate' || !state.itemId) throw new Error('Incorrect Check did not remain in placement recovery.');
    result.stages.push(state);
    await choose(page,view,targetId); await stage('correct-choice-preview');
    await host.locator('.plan39-check-position').scrollIntoViewIfNeeded(); await host.locator('.plan39-check-position').click();
    state = await measure(page,'correct-check-explanation');
    if (state.beat !== 'resolve' || !await host.locator('.plan39-resolution-description').count()) throw new Error('Correct Check did not reveal the explanatory bar/result.');
    result.stages.push(state);
    const finish = host.locator('.plan39-finish'); await finish.scrollIntoViewIfNeeded(); await finish.click();
    state = await measure(page,'completed-episode');
    if (!await page.locator('.app-entry-page').isVisible()) throw new Error(`Finish did not return to entry; status=${state.status}`);
    result.stages.push(state);
  } catch(error) { result.failures.push(error.stack || String(error)); }
  finally { await page.close(); }
  return result;
}

try {
  await mkdir(directory,{recursive:true}); await server.listen();
  browser = await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
  for(let i=0;i<widths.length;i++) for(const scale of scales) for(const condition of conditions) for(const support of supports) for(const view of views) {
    const context = await browser.newContext({viewport:{width:widths[i],height:heights[i]}});
    for(const record of items) {
      const run = await runOne(context,record,support,view,widths[i],heights[i],scale,condition); runs.push(run);
      if(run.failures.length) failures.push(`${record.itemId}/${support}/${view}/${widths[i]}x${heights[i]}/${scale}%: ${run.failures.join('; ')}`);
    }
    await context.close();
  }
  const report = { method:'Report-local fixture narrows the existing public Plan 39 practice type to one exact public record and launches through the learner-facing standalone chooser. Definition @2; real mounted controls; no managed Start/session changes.', browser:{engine:'Chrome via Playwright',version:browser.version()}, configurations:{records:itemIds,definitionRevision:'2',supports,views,conditions,viewports:widths.map((width,i)=>({width,height:heights[i]})),rootFontScales:scales.map(scale=>`${scale}% CSS root font`)}, runCount:runs.length, failures, runs, limits:['CSS root font scaling is not browser zoom.','No physical-device touch or assistive-technology speech was tested.','Rendered geometry and completed controls are evidence for orchestration review, not automatic fit classifications or learner outcome evidence.','Standalone single-item launch does not prove managed scheduler admission or cross-family navigation.'] };
  await writeFile(`${directory}/${output}`,JSON.stringify(report,null,2)+'\n');
  if(failures.length) { console.error(`${failures.length} placement journey(s) incomplete; see ${directory}/${output}`); process.exitCode=1; }
  else console.log(`All ${runs.length} standalone placement journeys completed; observations saved to ${directory}/${output}.`);
} finally { if(browser) await browser.close(); await server.close(); }
