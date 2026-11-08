import { writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { PLAN45_COMPARISON_RECORDS } from '../../../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import { PLAN51_DISTANCE_RECORDS } from '../../../src/content/data/plan51-distance-records.js';
import { compareFractions, createFraction } from '../../../src/math/index.js';

const directory = 'reports/development/plan-90-goal-linked-managed-practice';
const items = [...PLAN45_COMPARISON_RECORDS.filter(x => ['plan45-compare-02','plan45-compare-08','plan45-compare-09','plan45-compare-10'].includes(x.itemId)), ...PLAN51_DISTANCE_RECORDS.filter(x => ['distance-01','distance-04'].includes(x.itemId))];
const widths = (process.env.PLAN90_WIDTHS ?? '360,480,768,1093').split(',').map(Number);
const scales = (process.env.PLAN90_SCALES ?? '100,200').split(',').map(Number);
const output = process.env.PLAN90_OUTPUT ?? 'fit-batch-observations.json';
const supports = ['high-support', 'medium-support'];
const views = ['visual', 'linear'];
const errors = [];
const runs = [];
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
let browser;

function expectedRelation(record) {
  const asFraction = value => createFraction(BigInt(value.numerator), BigInt(value.denominator));
  const result = compareFractions(asFraction(record.sourceForms.first), asFraction(record.sourceForms.second));
  return result < 0 ? '<' : result > 0 ? '>' : '=';
}
async function metrics(page, stage) {
  return page.evaluate(stageName => {
    const state = window.fitBatch.app.getState();
    const visible = e => { const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&!e.closest('[hidden]'); };
    const rect = e => { if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,clientHeight:e.clientHeight,scrollHeight:e.scrollHeight}; };
    const active = document.querySelector('.app-visual-view:not([hidden]),.app-linear-view:not([hidden])');
    const episode = document.querySelector('.app-episode');
    const measured = [...(active?.querySelectorAll('h1,p,figure,form,button,input,summary,.plan45-model-track,.plan51-distance') ?? [])].filter(visible).map(e=>({tag:e.tagName,role:e.getAttribute('role'),label:e.getAttribute('aria-label')||e.textContent.trim().slice(0,100),className:String(e.className||''),...rect(e)}));
    return {stage:stageName,item:state?.taskContext?.itemId,definition:state?.episodeDefinition&&{id:state.episodeDefinition.id,revision:state.episodeDefinition.revision},beat:state?.beat,status:state?.status,support:state?.support?.label,view:active?.classList.contains('app-linear-view')?'linear':'visual',viewport:{width:innerWidth,height:innerHeight},rootFont:getComputedStyle(document.documentElement).fontSize,document:{clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,clientHeight:document.documentElement.clientHeight,scrollHeight:document.documentElement.scrollHeight},episode:rect(episode),workingArea:rect(active),overflowElements:measured.filter(x=>x.scrollWidth>x.clientWidth+1||x.scrollHeight>x.clientHeight+1),elements:measured};
  }, stage);
}
async function runOne(context, record, support, view, width, scale) {
  const page = await context.newPage();
  const failures = [];
  page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
  const result = {item:record.itemId,support,view,width,height:740,textScale:`${scale}% root CSS font`,stages:[],failures};
  try {
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${directory}/fit-batch.html?item=${encodeURIComponent(record.itemId)}&support=${support}&view=${view}`);
    if (scale !== 100) await page.addStyleTag({content:`html { font-size: ${scale}% !important; }`});
    const stage = async name => { result.stages.push(await metrics(page,name)); };
    const entryState = async () => { const snapshot = await metrics(page,'start'); if(snapshot.item!==record.itemId)throw Error(`mounted identity ${snapshot.item} != ${record.itemId}`);if(snapshot.view!==view)throw Error(`requested ${view} but active view is ${snapshot.view}`);if(snapshot.support !== (support==='high-support'?'high support':'medium support'))throw Error(`support mismatch ${snapshot.support}`); };
    await entryState(); await stage('initial');
    const host = page.locator(view==='linear'?'.app-linear-view':'.app-visual-view');
    const help = host.locator('.plan45-help-summary'); await help.click(); await stage('help-open');
    if(record.itemId.startsWith('plan45-compare-')) {
      const sourceModel = host.locator('[data-plan45-focus-key="model-first"]');
      if (await sourceModel.count()) { await sourceModel.click(); await stage('help-source-model'); }
      const relation = expectedRelation(record); const wrong = ['<','=','>'].find(x=>x!==relation);
      await host.locator(`.plan45-relation-option input[value="${wrong}"]`).check(); await host.locator('.plan45-check-button').click(); await stage('wrong-response');
      await host.locator(`.plan45-relation-option input[value="${relation}"]`).check(); await host.locator('.plan45-check-button').click(); await stage('correct-response');
      if (!(await host.locator('.plan45-progression-button').isVisible())) throw Error('Comparison accepted state has no progression control.');
      await host.locator('.plan45-progression-button').click(); await stage('completion');
    } else {
      const forms=record.sourceForms; const relation=expectedRelation(record); const wrong=['<','=','>'].find(x=>x!==relation);
      await host.getByRole('button', { name: 'Show first amount' }).click(); await stage('help-source-model');
      await host.locator(`.plan51-response input[type=radio][value="${wrong}"]`).check(); await host.locator('.plan51-response').evaluate(el=>el.requestSubmit()); await stage('wrong-comparison');
      await host.locator(`.plan51-response input[type=radio][value="${relation}"]`).check(); await host.locator('.plan51-response').evaluate(el=>el.requestSubmit()); await stage('correct-comparison');
      if (!await host.getByRole('button', { name: 'Show both amounts' }).isVisible()) await host.locator('.plan45-help-summary').click();
      await host.getByRole('button', { name: 'Show both amounts' }).click(); await stage('help-paired-models');
      const first=BigInt(forms.first.numerator), second=BigInt(forms.second.numerator), denominator=BigInt(forms.first.denominator), delta=first>second?first-second:second-first;
      const form=host.locator('.plan51-response');
      const gcd=(a,b)=>b===0n?a:gcd(b,a%b); const divisor=gcd(delta,denominator); const answerNumerator=delta/divisor, answerDenominator=denominator/divisor;
      await host.locator('[data-plan51-focus="numerator"]').fill(String(answerNumerator+1n)); await host.locator('[data-plan51-focus="denominator"]').fill(String(answerDenominator));
      await form.evaluate(el=>el.requestSubmit()); await stage('wrong-distance');
      await host.locator('[data-plan51-focus="numerator"]').fill(String(answerNumerator)); await host.locator('[data-plan51-focus="denominator"]').fill(String(answerDenominator));
      await form.evaluate(el=>el.requestSubmit());
      if (!(await host.locator('.plan51-next').isVisible())) throw Error('Distance accepted state has no progression control.');
      await stage('correct-distance-completion'); await host.locator('.plan51-next').click(); await stage('completion');
    }
  } catch(error) { failures.push(error.stack||String(error)); }
  finally { await page.close(); }
  return result;
}

try {
  await mkdir(directory,{recursive:true}); await server.listen(); browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
  for(const width of widths) for(const scale of scales) for(const support of supports) for(const view of views) {
    const context=await browser.newContext({viewport:{width,height:740}});
    for(const record of items) { const result=await runOne(context,record,support,view,width,scale);runs.push(result);if(result.failures.length)errors.push(`${record.itemId}/${support}/${view}/${width}/${result.textScale}: ${result.failures.join('; ')}`); }
    await context.close(); console.log(`completed width=${width} text=${scale}% support=${support} view=${view}`);
  }
  const report={method:'Public practice type restricted to one exact registered record; each run selects a registered support level and uses the real chooser, mounted renderer and task controls. CSS root font enlargement is text scaling, not browser zoom. Measurements describe rendered geometry and do not themselves establish fit.',browser:{name:'Chrome',version:browser.version()},configurations:{widths,height:740,textScales:scales.map(s=>`${s}% root CSS font`),supports,views,records:items.map(x=>x.itemId)},runCount:runs.length,failures:errors,runs};
  await writeFile(`${directory}/${output}`,JSON.stringify(report,null,2)+'\n');
  if(errors.length) { console.error(`${errors.length} run(s) incomplete; see ${directory}/fit-batch-observations.json`); process.exitCode=1; }
  else console.log(`All ${runs.length} journeys completed. Geometry remains evidence for review, not an automatic fit decision.`);
} finally { await browser?.close(); await server.close(); }
