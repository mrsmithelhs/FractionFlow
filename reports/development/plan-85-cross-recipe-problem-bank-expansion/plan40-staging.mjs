// Rebuild report-local fixtures in a disposable source copy and exercise the
// unchanged recipe and problem validators. No candidate gains live membership.
import { mkdtemp,cp,writeFile,readFile,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join,resolve,relative,sep,isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { PLAN40_SUBTRACTION_RECIPE_RECORDS as original, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2 as live, PLAN40_DATA_ONLY_HOLDOUT_SET as holdouts } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';

const candidates=JSON.parse(await readFile(new URL('./plan40-candidates.json',import.meta.url),'utf8'));
const gcd=(a,b)=>b?gcd(b,a%b):a;
const f=x=>{let n=Number(x.numerator),d=Number(x.denominator),g=gcd(n,d);return `${n/g}/${d/g}`;};
const key=r=>`${f(r.sourceForms.left)}|${f(r.sourceForms.right)}`;
const existing=original.filter(r=>live.itemIds.includes(r.itemId)||holdouts.itemIds.includes(r.itemId));
assert.equal(live.itemIds.length,17);assert.equal(existing.length,19);assert.equal(candidates.length,13);
const seen=new Set(existing.map(key));assert.equal(new Set(original.filter(r=>live.itemIds.includes(r.itemId)).map(key)).size,17);
for(const r of candidates){const k=key(r);assert.ok(!seen.has(k),`duplicate ${k}`);seen.add(k);}
const prefix=resolve(tmpdir(),'fractionflow-plan85-subtraction-'),sandbox=await mkdtemp(prefix);
const inside=target=>{const rel=relative(resolve(sandbox),resolve(target));assert.ok(rel && rel!=='..'&&!rel.startsWith('..'+sep)&&!isAbsolute(rel),'destination outside disposable directory');return resolve(target);};
try {
  assert.ok(resolve(sandbox).startsWith(prefix),'temporary destination is outside the expected prefix');
  await cp(new URL('../../../src/',import.meta.url),inside(join(sandbox,'src')),{recursive:true});
  await writeFile(inside(join(sandbox,'package.json')),'{"type":"module"}\n');
  const file=inside(join(sandbox,'src/content/data/plan40-reusable-subtraction-recipes-records.js'));
  const text=await readFile(file,'utf8'),marker='];\n\nexport const PLAN40_SUBTRACTION_RECIPE_RECORDS';
  assert.equal(text.split(marker).length,2,'isolated insertion point must be unique');
  await writeFile(file,text.replace(marker,`${candidates.map(r=>JSON.stringify(r)+',').join('\n')}\n${marker}`));
  const imp=p=>import(pathToFileURL(join(sandbox,'src',p)).href);
  const [{PLAN40_SUBTRACTION_RECIPE_RECORDS},{resolveCuratedFixture},{buildCuratedProblem},{validateProblemInstance},{validatePlan40SubtractionRecipeRecord,resolvePlan40SubtractionRecipeContext}]=await Promise.all([
    imp('content/data/plan40-reusable-subtraction-recipes-records.js'),imp('content/authored-content-catalog.js'),imp('content/generator.js'),imp('content/validation.js'),imp('content/plan40-reusable-subtraction-recipes.js')]);
  for(const staged of candidates){
    const r=PLAN40_SUBTRACTION_RECIPE_RECORDS.find(x=>x.itemId===staged.itemId),fixture=resolveCuratedFixture(r.fixtureId,r.authoringRevision);assert.ok(fixture);
    const instance=buildCuratedProblem({fixture,selector:fixture.selector,overlays:fixture.overlays,profileId:fixture.profileId,candidate:{left:fixture.left,right:fixture.right,reviewedTransitions:[]}});
    assert.equal(validateProblemInstance(instance).valid,true);validatePlan40SubtractionRecipeRecord(instance,r);
    assert.throws(()=>resolvePlan40SubtractionRecipeContext(instance,r.itemId,{practiceSetId:live.id,practiceSetRevision:live.revision}));
    const bad=structuredClone(r);bad.targetDenominator='13';assert.throws(()=>validatePlan40SubtractionRecipeRecord(instance,bad));
    const reversed=structuredClone(r);[reversed.sourceForms.left,reversed.sourceForms.right]=[reversed.sourceForms.right,reversed.sourceForms.left];assert.throws(()=>validatePlan40SubtractionRecipeRecord(instance,reversed));
  }
  console.log(JSON.stringify({live:17,holdouts:2,stagedValidated:13,livePlusStagedDistinct:30,stagedMembership:0,method:'isolated copied source graph'}));
} finally {assert.ok(resolve(sandbox).startsWith(prefix));await rm(sandbox,{recursive:true,force:true});}
