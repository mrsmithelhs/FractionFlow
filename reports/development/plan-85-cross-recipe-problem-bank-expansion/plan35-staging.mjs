// Run unchanged recipe validation against candidate fixtures in a disposable
// copy of the source graph; it is not production registration or membership.
import { mkdtemp, cp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { PRACTICE_TYPES } from '../../../src/app/practice-types.js';
import { resolveCuratedFixture } from '../../../src/content/authored-content-catalog.js';

const candidates=JSON.parse(await readFile(new URL('./plan35-candidates.json',import.meta.url),'utf8'));
const gcd=(a,b)=>b?gcd(b,a%b):a;
const f=x=>{let n=Number(x.numerator),d=Number(x.denominator),g=gcd(n,d);return `${n/g}/${d/g}`;};
const key=(a,b)=>[f(a),f(b)].sort().join('|');
const live=PRACTICE_TYPES.find(t=>t.id==='sum-under-one');
const known=new Set(live.items.map(item=>{const fixture=resolveCuratedFixture(item.fixtureId,item.authoringRevision);assert.ok(fixture);return key(fixture.left,fixture.right);}));
assert.equal(live.items.length,21); assert.equal(known.size,15); assert.equal(candidates.length,15);
for(const r of candidates){const k=key(r.sourceForms.left,r.sourceForms.right);assert.ok(!known.has(k),`duplicate ${k}`);known.add(k);}
assert.equal(known.size,30);
const prefix=resolve(tmpdir(),'fractionflow-plan85-addition-'),sandbox=await mkdtemp(prefix);
try {
  await cp(new URL('../../../src/',import.meta.url),join(sandbox,'src'),{recursive:true});
  await writeFile(join(sandbox,'package.json'),'{"type":"module"}\n');
  const dataFile=join(sandbox,'src/content/data/plan35-addition-recipe-records.js');
  const data=await readFile(dataFile,'utf8'),marker='];\n\nexport const PLAN35_ADDITION_RECIPE_RECORDS';
  assert.equal(data.split(marker).length,2,'isolated data insertion point must be unique');
  await writeFile(dataFile,data.replace(marker,`${candidates.map(r=>JSON.stringify(r)+',').join('\n')}\n${marker}`));
  const imp=path=>import(pathToFileURL(join(sandbox,'src',path)).href);
  const [{PLAN35_ADDITION_RECIPE_RECORDS},{resolveCuratedFixture:resolveFixture},{buildCuratedProblem},{validateProblemInstance},{validatePlan35AdditionRecipeRecord,resolvePlan35AdditionRecipeContext}]=await Promise.all([
    imp('content/data/plan35-addition-recipe-records.js'),imp('content/authored-content-catalog.js'),imp('content/generator.js'),imp('content/validation.js'),imp('content/plan35-addition-recipe-task.js')]);
  for(const staged of candidates){
    const record=PLAN35_ADDITION_RECIPE_RECORDS.find(r=>r.itemId===staged.itemId),fixture=resolveFixture(record.fixtureId,record.authoringRevision);assert.ok(fixture);
    const instance=buildCuratedProblem({fixture,selector:fixture.selector,overlays:fixture.overlays,profileId:fixture.profileId,candidate:{left:fixture.left,right:fixture.right,reviewedTransitions:[]}});
    assert.equal(validateProblemInstance(instance).valid,true);validatePlan35AdditionRecipeRecord(instance,record);
    assert.throws(()=>resolvePlan35AdditionRecipeContext(instance,record.itemId));
    const bad=structuredClone(record);bad.targetDenominator='7';assert.throws(()=>validatePlan35AdditionRecipeRecord(instance,bad));
    const reversed=structuredClone(record);[reversed.sourceForms.left,reversed.sourceForms.right]=[reversed.sourceForms.right,reversed.sourceForms.left];assert.throws(()=>validatePlan35AdditionRecipeRecord(instance,reversed));
  }
  console.log(JSON.stringify({liveIds:live.items.length,liveDistinct:15,stagedValidated:candidates.length,totalDistinct:known.size,stagedMembership:0,method:'isolated copied source graph'}));
} finally {assert.ok(resolve(sandbox).startsWith(prefix));await rm(sandbox,{recursive:true,force:true});}
