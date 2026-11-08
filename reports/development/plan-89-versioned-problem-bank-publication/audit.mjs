import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { PRACTICE_TYPES } from '../../../src/app/practice-types.js';
import { resolveCuratedFixture } from '../../../src/content/authored-content-catalog.js';
import { PLAN40_SUBTRACTION_RECIPE_RECORDS as p40, PLAN40_RECIPE_ASSOCIATION_SETS as sets } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { PLAN59_RECORDS as p59 } from '../../../src/content/data/plan59-directed-endpoint-records.js';
import { PLAN72_RECORDS as p72 } from '../../../src/content/plan72-mixed-addition-task.js';
import { PLAN74_RECORDS as p74 } from '../../../src/content/plan74-mixed-addition-task.js';
import { PLAN78_RECORDS as p78 } from '../../../src/content/plan78-mixed-subtraction-task.js';
import { PLAN82_RECORDS as p82 } from '../../../src/content/plan82-mixed-subtraction-task.js';
const candidates=JSON.parse(readFileSync(new URL('../plan-85-cross-recipe-problem-bank-expansion/plan40-candidates.json',import.meta.url)));
const gcd=(a,b)=>b?gcd(b,a%b):a;
const norm=f=>{let n=BigInt(f.numerator),d=BigInt(f.denominator);if(f.whole)n+=BigInt(f.whole)*d;const g=gcd(n,d);return `${n/g}/${d/g}`};
const key=(a,b)=>`${norm(a)} | ${norm(b)}`;
const mixed={'mixed-number-addition-without-regrouping':p72,'mixed-number-addition-with-regrouping':p74,'mixed-number-subtraction-without-decomposition':p78,'mixed-number-subtraction-with-decomposition':p82};
const unaryOrOther=new Set(['bar-to-line-same-amount','symbolic-fraction-comparison','number-line-collection','fraction-distance','two-whole-location','whole-plus-fraction-construction','mixed-to-improper-bridge']);
const inventory=[];
for(const type of PRACTICE_TYPES) for(const item of type.items??[]){
  let pair,kind,source;
  const fixture=resolveCuratedFixture(item.fixtureId,item.authoringRevision);
  if(fixture?.left&&fixture?.right){pair=[fixture.left,fixture.right];kind=fixture.selector.includes('subtraction')?'subtraction':'addition';source=`fixture:${fixture.id}@${fixture.authoringRevision}`;}
  else if(type.id==='directed-number-line-endpoint'){const r=p59.find(x=>x.itemId===item.id);assert(r);pair=[r.start,r.amount];kind=r.operation==='subtract'?'subtraction':'addition';source='plan59';}
  else if(mixed[type.id]){const r=mixed[type.id].find(x=>x.itemId===item.id);assert(r);pair=r.operands;kind=type.id.includes('subtraction')?'subtraction':'addition';source=type.id;}
  else {assert(unaryOrOther.has(type.id),`unclassified ${type.id}/${item.id}`);kind='other';source=type.id;}
  inventory.push({type:type.id,item:item.id,kind,source,...(pair?{normalized:key(...pair)}:{})});
}
for(const r of p40) inventory.push({type:'plan40-registry-including-holdouts',item:r.itemId,kind:'subtraction',normalized:key(r.sourceForms.left,r.sourceForms.right)});
const sourceFiles=[];
function walk(url){for(const entry of readdirSync(url,{withFileTypes:true})){const u=new URL(entry.name+(entry.isDirectory()?'/':''),url);if(entry.isDirectory())walk(u);else if(/\.(js|json)$/.test(entry.name))sourceFiles.push({path:u.pathname,text:readFileSync(u,'utf8')});}}
walk(new URL('../../../src/',import.meta.url));
const overlaps=[],coverage=[];
for(let i=0;i<candidates.length;i++){
 const c=candidates[i], k=key(c.sourceForms.left,c.sourceForms.right);
 for(const row of inventory) if(row.normalized===k) overlaps.push({candidate:c.itemId,...row});
 for(const prior of candidates.slice(0,i)) assert.notEqual(k,key(prior.sourceForms.left,prior.sourceForms.right),'candidate operand collision');
 for(const value of [c.itemId,c.fixtureId,c.stimulusId].filter(Boolean)) assert(!sourceFiles.some(f=>f.text.includes(value)),`identity already present in source: ${value}`);
 for(const prior of candidates.slice(0,i)){assert.notEqual(c.itemId,prior.itemId);assert.notEqual(c.fixtureId,prior.fixtureId);if(c.stimulusId)assert.notEqual(c.stimulusId,prior.stimulusId);}
 const l=c.sourceForms.left,r=c.sourceForms.right,t=BigInt(c.targetDenominator);assert.equal(t%BigInt(l.denominator),0n);assert.equal(t%BigInt(r.denominator),0n);
 const ln=BigInt(l.numerator)*(t/BigInt(l.denominator)),rn=BigInt(r.numerator)*(t/BigInt(r.denominator));assert(ln>rn);
 const invalid=c.candidates?Object.entries(c.candidates).filter(([side,f])=>norm(f)!==norm(c.sourceForms[side])).map(([side])=>side):[];
 if(c.candidates)assert.equal(invalid.length,1,`expected one wrong candidate: ${c.itemId}`);
 coverage.push({item:c.itemId,recipe:c.recipeId,fixture:c.fixtureId,target:c.targetDenominator,difference:`${ln-rn}/${t}`,invalid,requiredSide:c.requiredSide??null});
}
assert(!sets.some(s=>s.id==='unlike-subtraction-vetted-set'&&s.revision==='3'));
const approved=new Set(['plan85-isolated-identify-five-eighths-one-fourth-8|takeaway-8-5-minus-2','plan85-isolated-identify-three-fourths-one-half-4|three-fourths-subtract-two-fourths','plan85-isolated-identify-five-sixths-one-half-6|five-sixths-subtract-three-sixths']);
const unapproved=overlaps.filter(x=>x.kind==='subtraction'&&!approved.has(`${x.candidate}|${x.item}`));
const out={baseline:'fd97c687af922b9e341212c5e2c8d4502fd855fa',scope:'current chooser pairs, Plan 40 registry/holdouts; source-text identity scan',inventory,overlaps,unapproved,coverage,sourceFilesScanned:sourceFiles.length};
writeFileSync(new URL('./pilot-audit.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
assert.equal(unapproved.length,0,JSON.stringify(unapproved));
console.log(JSON.stringify({chooserEntries:inventory.length-p40.length,registeredPlan40:p40.length,sourceFilesScanned:sourceFiles.length,overlaps,coverage},null,2));
