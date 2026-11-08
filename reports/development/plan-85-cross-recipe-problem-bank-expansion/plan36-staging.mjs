// Isolated fixture injection only. Every write destination is resolved and
// checked before use; the production Plan 36 data file must never be a target.
import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {PLAN36_SUBTRACTION_RECORDS as live} from '../../../src/content/data/plan36-like-denominator-subtraction-records.js';
import {resolvePlan36LikeDenominatorSubtractionContext as resolveProduction} from '../../../src/content/plan36-like-denominator-takeaway-task.js';
const gcd=(a,b)=>b?gcd(b,a%b):a;
const f=(n,d)=>{const g=gcd(n,d);return `${n/g}/${d/g}`;};
const key=r=>`${f(Number(r.leftNumerator),Number(r.denominator))}|${f(Number(r.rightNumerator),Number(r.denominator))}`;
const seen=new Set(live.map(key));assert.equal(live.length,8);assert.equal(seen.size,8);
const rank=k=>createHash('sha256').update(`plan85-like-sub-v1:${k}`).digest('hex');
const pools=[];
for(let d=2;d<=12;d++)for(const zero of [false,true]){
  const rows=[];
  for(let a=1;a<d;a++)for(let b=1;b<=a;b++){
    if((a===b)!==zero)continue;
    const r={itemId:'placeholder',leftNumerator:String(a),rightNumerator:String(b),denominator:String(d)};
    if(!seen.has(key(r)))rows.push(r);
  }
  rows.sort((a,b)=>rank(key(a)).localeCompare(rank(key(b))));pools.push({rows,index:0,zero});
}
const candidates=[];
while(candidates.length<26){let added=false;for(const p of pools){if(p.zero&&candidates.filter(r=>r.leftNumerator===r.rightNumerator).length>=5)continue;while(p.index<p.rows.length&&seen.has(key(p.rows[p.index])))p.index++;if(p.index===p.rows.length)continue;const r=p.rows[p.index++];r.itemId=`plan85-takeaway-${String(candidates.length+1).padStart(2,'0')}`;seen.add(key(r));candidates.push(r);added=true;if(candidates.length===26)break;}if(!added)throw Error('capacity exhausted');}
assert.equal(seen.size,34);
const temporaryRoot=path.resolve(tmpdir()),sandbox=await mkdtemp(path.join(temporaryRoot,'fractionflow-plan85-like-sub-'));
const inside=(base,target)=>{const relative=path.relative(path.resolve(base),path.resolve(target));assert.ok(relative && relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative),'refusing write outside disposable directory');return path.resolve(target);};
inside(temporaryRoot,sandbox);
try{
  const copiedSrc=inside(sandbox,path.join(sandbox,'src'));await cp(new URL('../../../src/',import.meta.url),copiedSrc,{recursive:true});
  await writeFile(inside(sandbox,path.join(sandbox,'package.json')),'{"type":"module"}\n');
  // The original Plan 36 materializer requires exactly eight records. Inject
  // only synthetic fixtures into the disposable catalog, not its live set or
  // its fixed-eight materializer. Record-level validation is unchanged.
  const file=inside(sandbox,path.join(copiedSrc,'content/authored-content-catalog.js'));
  const text=await readFile(file,'utf8'),marker='const plan35RecipeContentByIdentity =';
  assert.equal(text.split(marker).length,2,'isolated fixture insertion point must be unique');
  const fixtures=candidates.map(r=>({id:`curated-plan36-${r.itemId}`,authoringRevision:'plan36-record-v1',profileId:'plan36-subtraction-review',selector:'like-denominator-subtraction',overlays:[],left:{kind:'fraction',numerator:r.leftNumerator,denominator:r.denominator},right:{kind:'fraction',numerator:r.rightNumerator,denominator:r.denominator}}));
  const injection=`for (const f of ${JSON.stringify(fixtures)}) { const k=identityKey(f.id,f.authoringRevision); if(curatedFixturesByIdentity.has(k)) throw new Error('duplicate temporary fixture'); curatedFixturesByIdentity.set(k, f); }\n`;
  await writeFile(file,text.replace(marker,`${injection}${marker}`));
  const imp=p=>import(pathToFileURL(inside(sandbox,path.join(copiedSrc,p))).href);
  const [{resolveCuratedFixture},{buildCuratedProblem},{validateProblemInstance},{evaluateInstanceEligibility},{validatePlan36LikeDenominatorSubtractionRecord}]=await Promise.all([
    imp('content/authored-content-catalog.js'),imp('content/generator.js'),imp('content/validation.js'),imp('content/eligibility.js'),imp('content/plan36-like-denominator-takeaway-task.js')]);
  for(const c of candidates){
    const r={...c,fixtureId:`curated-plan36-${c.itemId}`,authoringRevision:'plan36-record-v1',recipe:{id:'plan36.like-denominator-takeaway',revision:'1'},taskData:{id:'plan36-like-denominator-takeaway',revision:'1'}};
    const fixture=resolveCuratedFixture(r.fixtureId,r.authoringRevision);assert.ok(fixture);
    const instance=buildCuratedProblem({fixture,selector:fixture.selector,overlays:fixture.overlays,profileId:fixture.profileId,candidate:{left:fixture.left,right:fixture.right,reviewedTransitions:[]}});
    assert.equal(validateProblemInstance(instance).valid,true);assert.equal(evaluateInstanceEligibility(instance).paths.canonical.rendering,'eligible');validatePlan36LikeDenominatorSubtractionRecord(instance,r);
    assert.throws(()=>resolveProduction(instance,r.itemId));
    const bad=structuredClone(r);bad.rightNumerator=String(BigInt(bad.leftNumerator)+1n);assert.throws(()=>validatePlan36LikeDenominatorSubtractionRecord(instance,bad));
  }
  await writeFile(new URL('./plan36-candidates.json',import.meta.url),JSON.stringify({baseline:'318b83eb01f7bc8646e0472047bfda629a2aca14',liveIds:live.map(r=>r.itemId),candidates},null,2)+'\n');
  console.log(JSON.stringify({live:8,stagedValidated:candidates.length,totalDistinct:seen.size,zeroResults:candidates.filter(r=>r.leftNumerator===r.rightNumerator).length,stagedProductionMembership:0,method:'verified disposable source copy, fixture-only injection; fixed-eight materializer excluded'}));
}finally{inside(temporaryRoot,sandbox);await rm(sandbox,{recursive:true,force:true});}
