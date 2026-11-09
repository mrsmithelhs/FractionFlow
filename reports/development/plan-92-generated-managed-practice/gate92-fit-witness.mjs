import { writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { convertToDenominator, createFraction, addAtCommonDenominator, subtractAtCommonDenominator, equalFractions, compareFractions } from '../../../src/math/index.js';
import { PLAN40_SUBTRACTION_RECIPE_RECORDS } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { PLAN45_COMPARISON_RECORDS } from '../../../src/content/data/plan45-symbolic-fraction-comparison-records.js';

// First-batch standalone candidate evidence only. It does not exercise Plan 92 managed admission or visit preflight.
const dir = 'reports/development/plan-92-generated-managed-practice';
const defaultIds = [
  'plan45-compare-02', 'plan45-compare-09', 'plan45-compare-10',
  'plan40-identify-one-half-one-eighth-8', 'plan40-identify-two-thirds-five-twelfths-12', 'plan76-identify-seven-eighths-one-fourth-8',
  'plan40-inspect-two-thirds-one-fourth-12', 'plan76-inspect-three-fourths-one-fifth-20',
  'plan40-construct-half-fifth-10', 'plan76-construct-five-sixths-one-tenth-30', 'plan40-construct-five-sixths-three-eighths-24',
];
const ids = process.env.FIT92_ITEMS ? process.env.FIT92_ITEMS.split(',').map(value=>value.trim()) : defaultIds;
const subtractionIds = new Set(ids.filter(id => !id.startsWith('plan45-')));
const records = new Map([...PLAN40_SUBTRACTION_RECIPE_RECORDS, ...PLAN45_COMPARISON_RECORDS].map(record => [record.itemId, record]));
const conditions = (process.env.FIT92_CONDITIONS ?? '360x740@100,360x740@200,480x740@200,600x740@200,1093x614@100').split(',').map(value => {
  const match = /^(\d+)x(\d+)@(\d+)$/.exec(value.trim());
  if (!match) throw new Error(`Invalid FIT92_CONDITIONS entry: ${value}`);
  return { width:Number(match[1]), height:Number(match[2]), rootScale:Number(match[3]) };
});
const output = `${dir}/${process.env.FIT92_OUTPUT ?? 'fit92-observations.json'}`;
const server = await createServer({ configFile:false, root:process.cwd(), server:{ host:'127.0.0.1', port:Number(process.env.FIT92_PORT ?? 5187), strictPort:true }, logLevel:'error' });
let browser;
const runs = [], failures = [];
const asFraction = value => createFraction(BigInt(value.numerator), BigInt(value.denominator));
function relation(record) { const result = compareFractions(asFraction(record.sourceForms.first), asFraction(record.sourceForms.second)); return result < 0 ? '<' : result > 0 ? '>' : '='; }
function transformed(record) { const denominator = BigInt(record.targetDenominator); return Object.fromEntries(['left','right'].map(side => [side, convertToDenominator(asFraction(record.sourceForms[side]), denominator)])); }
function operation(record) {
  const denominator = BigInt(record.targetDenominator), left = asFraction(record.sourceForms.left), right = asFraction(record.sourceForms.right);
  return record.definitionId === 'phase-3-reusable-addition-recipes' ? addAtCommonDenominator(left,right,denominator) : subtractAtCommonDenominator(left,right,denominator);
}
async function measure(page, id, support, view, stage) {
  return page.evaluate(({id,support,view,stage}) => {
    const host = document.querySelector('.app-visual-view:not([hidden]),.app-linear-view:not([hidden])');
    const state = window.fit92.app.getState(), rect = element => { if(!element)return null; const r=element.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,clientWidth:element.clientWidth,scrollWidth:element.scrollWidth,clientHeight:element.clientHeight,scrollHeight:element.scrollHeight}; };
    const visible = element => { const r=element.getBoundingClientRect(),s=getComputedStyle(element); return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&!element.closest('[hidden]'); };
    const elements = [...(host?.querySelectorAll('h1,p,figure,form,button,input,summary,.fraction-bar,.symbolic-expression')||[])].filter(visible).map(element=>({tag:element.tagName,role:element.getAttribute('role'),label:(element.getAttribute('aria-label')||element.textContent||'').trim().slice(0,120),className:String(element.className||''),...rect(element)}));
    const diagnostics = [...(host?.querySelectorAll('.symbolic-expression')||[])].filter(visible).map(expression=>{
      const r=expression.getBoundingClientRect(), style=getComputedStyle(expression);
      const descendants=[...expression.querySelectorAll('.symbolic-numerator,.symbolic-denominator,.symbolic-bar,.symbolic-operator')].filter(visible).map(el=>({className:el.className,...rect(el)}));
      const ancestors=[];for(let p=expression.parentElement;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p),b=p.getBoundingClientRect();if(['hidden','clip','auto','scroll'].includes(s.overflowX)||['hidden','clip','auto','scroll'].includes(s.overflowY))ancestors.push({className:String(p.className||''),overflowX:s.overflowX,overflowY:s.overflowY,left:b.left,right:b.right,top:b.top,bottom:b.bottom});}
      return {expression:rect(expression),overflowX:style.overflowX,overflowY:style.overflowY,descendants,ancestors};
    });
    const actualView = host?.classList.contains('app-linear-view')?'linear':'visual';
    const actualItem = state?.taskContext?.itemId ?? state?.item?.id ?? null;
    const actualSupport = window.fit92.app.getSelectedSupportLevel()?.id ?? null;
    return {stage,expectedItem:id,actualItem,identityMatches:id===actualItem,expectedSupport:support,actualSupport,supportMatches:support===actualSupport,expectedView:view,actualView,viewMatches:view===actualView,conditionId:state?.activeCondition?.id??null,viewport:{width:innerWidth,height:innerHeight},rootFont:getComputedStyle(document.documentElement).fontSize,document:{clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,clientHeight:document.documentElement.clientHeight,scrollHeight:document.documentElement.scrollHeight},workingArea:rect(host?.closest('.app-working-area')||host),episode:rect(document.querySelector('.app-episode')),overflowElements:elements.filter(e=>e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1||e.x < -1||e.right>innerWidth+1),diagnostics,elements};
  },{id,support,view,stage});
}
async function run(context, record, condition, support, view, port) {
  const id=record.itemId, isComparison=id.startsWith('plan45-'), page=await context.newPage();
  page.setDefaultTimeout(6000); page.setDefaultNavigationTimeout(30000);
  const result={itemId:id,recordRevision:record.authoringRevision??record.revision??null,definitionId:record.definitionId??'phase-4-symbolic-fraction-comparison',definitionRevision:record.definitionRevision??2,recipeId:record.recipeId??null,stimulusId:record.stimulusId??null,...condition,support,view,stages:[],failures:[]};
  page.on('pageerror',error=>result.failures.push(`pageerror: ${error.message}`));
  try {
    const fixture=isComparison?'fit92-comparison.html':'fit92-arithmetic.html';
    await page.goto(`http://127.0.0.1:${port}/${dir}/${fixture}?item=${encodeURIComponent(id)}&support=${support}&view=${view}&condition=${process.env.FIT92_CONDITION ?? "phase2-bundle-1"}`);
    if(condition.rootScale!==100) await page.addStyleTag({content:`html { font-size:${condition.rootScale}% !important; }`});
    const stage=async name=>{const sample=await measure(page,id,support,view,name);result.stages.push(sample);for(const key of ['identityMatches','supportMatches','viewMatches'])if(!sample[key])throw Error(`${name}: ${key} failed`);const expectedCondition=isComparison?'plan45-static-comparison':(process.env.FIT92_CONDITION??'phase2-bundle-1');if(sample.conditionId!==expectedCondition)throw Error(`${name}: active condition ${sample.conditionId} != ${expectedCondition}`);if(process.env.FIT92_STAGE_SCREENSHOTS==='1'&&support==='high-support'){const folder=process.env.FIT92_STAGE_DIRECTORY??'fit92-stage-screenshots';if(!/^gate92-fit-[a-z0-9-]+$/.test(folder))throw Error('invalid screenshot folder');await mkdir(`${dir}/${folder}`,{recursive:true});await page.screenshot({path:`${dir}/${folder}/${id}-${view}-${name}.png`,fullPage:true});}};
    await stage('initial');
    if(process.env.FIT92_SCREENSHOTS==='1'){
      const wanted=(condition.width===480&&condition.rootScale===200&&subtractionIds.has(id))||(condition.width===1093&&condition.rootScale===100);
      if(wanted){const { mkdir }=await import('node:fs/promises');await mkdir(`${dir}/fit92-screenshots`,{recursive:true});const name=condition.width===480?'fit92-subtraction-narrow-enlarged':'fit92-normal-wide';await page.screenshot({path:`${dir}/fit92-screenshots/${name}-${view}-${support}-${id}.png`,fullPage:true});result.screenshot=`fit92-screenshots/${name}-${view}-${support}-${id}.png`;}
    }
    if(isComparison){
      const host=page.locator(view==='linear'?'.app-linear-view':'.app-visual-view'), recordHelp=host.locator('.plan45-help-summary');
      if(await recordHelp.count()){await recordHelp.click();await stage('help-open');}
      const answer=relation(record), wrong=['<','=','>'].find(value=>value!==answer);
      await host.locator(`.plan45-relation-option input[value="${wrong}"]`).check();await host.locator('.plan45-check-button').click();await stage('wrong-response');
      await host.locator(`.plan45-relation-option input[value="${answer}"]`).check();await host.locator('.plan45-check-button').click();await stage('correct-response');
      await host.locator('.plan45-progression-button').click();await stage('completion');
    } else {
      const host=page.locator(view==='linear'?'.app-linear-view':'.app-visual-view'), recipe=record.recipeId;
      await host.locator('.active-beat-controls button').first().click();await stage('encounter');
      if(recipe.endsWith('identify-side-construct')){await host.locator('.nested-side-choice').nth(record.requiredSide==='left'?0:1).click();await stage('identify-side');}
      const help=host.getByRole('button',{name:'Need help?'}).first();if(await help.count() && await help.isVisible()){await help.click();await stage('task-help-open');const closeHelp=host.getByRole('button',{name:'Close help'}).first();if(await closeHelp.count()&&await closeHelp.isVisible()){await closeHelp.click();await stage('task-help-closed');}}
      const forms=transformed(record), required=recipe.endsWith('identify-side-construct')?[record.requiredSide]:['left','right'];
      for(const side of required){
        if(recipe.endsWith('inspect-keep-repair')){const candidate=record.candidates[side];if(equalFractions(asFraction(candidate),forms[side]))await host.locator(`.active-beat-controls button[aria-label="Keep new fraction ${candidate.numerator} over ${candidate.denominator}"]`).click();else{await host.locator('.inspect-change-button').click();await host.locator(`#${view==='linear'?'linear-':''}transform-num-input-${side}`).fill(String(forms[side].numerator));await host.locator('.active-beat-controls .control-submit-btn').click();}}
        else{await host.locator(`#${view==='linear'?'linear-':''}transform-num-input-${side}`).fill(String(forms[side].numerator));await host.locator('.active-beat-controls .control-submit-btn').click();}
        await stage(`transform-${side}-complete`);
      }
      const operationHelp=host.getByRole('button',{name:'Need help?'}).first();if(await operationHelp.count()&&await operationHelp.isVisible()){await operationHelp.click();await stage('operation-help-open');const closeOperationHelp=host.getByRole('button',{name:'Close help'}).first();if(await closeOperationHelp.count()&&await closeOperationHelp.isVisible()){await closeOperationHelp.click();await stage('operation-help-closed');}}
      const answer=operation(record), addition=record.definitionId==='phase-3-reusable-addition-recipes';
      const num=`#${view==='linear'?'linear-':''}operate-fraction-numerator-input`,den=`#${view==='linear'?'linear-':''}operate-fraction-denominator-input`,sum=`#${view==='linear'?'linear-':''}operate-sum-input`;
      if(addition)await host.locator(sum).fill(String(answer.numerator+1n));else{await host.locator(num).fill('0');await host.locator(den).fill('1');}
      await host.locator('.active-beat-controls .control-submit-btn').click();await stage('wrong-operation-recovery');
      if(addition)await host.locator(sum).fill(String(answer.numerator));else{await host.locator(num).fill(String(answer.numerator));await host.locator(den).fill(String(answer.denominator));}
      await host.locator('.active-beat-controls .control-submit-btn').click();await stage('operation-resolved');
      if((await page.evaluate(()=>window.fit92.app.getState().beat))!=='resolve')throw Error('Subtraction task did not reach resolve.');
      await host.locator('.active-beat-controls button').first().click();if(!await page.locator('.app-entry-page').isVisible())throw Error('Subtraction completion did not return to entry.');
    }
    result.completed=true;
  }catch(error){result.failures.push(error.stack||String(error));}
  finally{await page.close();}
  return result;
}
try{
  await mkdir(dir,{recursive:true});await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});const port=server.httpServer.address().port;
  for(const condition of conditions)for(const support of ['high-support','medium-support'])for(const view of ['visual','linear']){
    const context=await browser.newContext({viewport:{width:condition.width,height:condition.height}});
    for(const id of ids){const record=records.get(id);if(!record){failures.push(`${id}: exact record missing`);continue;}const runResult=await run(context,record,condition,support,view,port);runs.push(runResult);if(!runResult.completed||runResult.failures.length)failures.push(`${id}/${support}/${view}/${condition.width}x${condition.height}/${condition.rootScale}%: ${runResult.failures.join('; ')||'incomplete'}`);}
    await context.close();console.log(`completed ${condition.width}x${condition.height} ${condition.rootScale}% / ${support} / ${view}`);
  }
  const report={status:failures.length?'incomplete':'completed',method:'Standalone exact-candidate mounted witness using public practice routes and real task controls; supports both levels, visual/linear views, narrow and enlarged CSS root text plus wide normal reference. Records geometry, visible controls and overflow through prompts/help, feedback and completion. CSS text scaling is not browser zoom. This does not measure managed Start admission/scratch-preflight or certify fit; recorded geometry needs visual review.',browser:{name:'Chrome',version:browser.version()},candidateIds:ids,conditions,supports:['high-support','medium-support'],views:['visual','linear'],runCount:runs.length,expectedRunCount:ids.length*conditions.length*4,failures,runs};
  await writeFile(output,JSON.stringify(report,null,2)+'\n');if(failures.length){console.error(`${failures.length} incomplete journey(s); see ${output}`);process.exitCode=1;}else console.log(`Completed ${runs.length} candidate journeys; see ${output}`);
}finally{await browser?.close();await server.close();}
