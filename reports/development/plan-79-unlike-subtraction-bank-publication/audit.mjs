import {writeFileSync,readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {PRACTICE_TYPES} from '../../../src/app/practice-types.js';
import {resolveCuratedFixture} from '../../../src/content/authored-content-catalog.js';
import {PLAN40_SUBTRACTION_RECIPE_RECORDS as p40,PLAN40_RECIPE_ASSOCIATION_SETS as sets} from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import {PLAN35_ADDITION_RECIPE_RECORDS as p35} from '../../../src/content/data/plan35-addition-recipe-records.js';
import {PLAN37_BAR_TO_LINE_BRIDGE_RECORDS as p37} from '../../../src/content/data/plan37-bar-to-line-bridge-records.js';
import {PLAN45_COMPARISON_RECORDS as p45} from '../../../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import {PLAN50_RECORDS as p50} from '../../../src/content/data/plan50-number-line-collection-records.js';
import {PLAN51_DISTANCE_RECORDS as p51} from '../../../src/content/data/plan51-distance-records.js';
import {PLAN53_RECORDS as p53} from '../../../src/content/data/plan53-two-whole-location-records.js';
import {PLAN58_RECORDS as p58} from '../../../src/content/data/plan58-whole-plus-fraction-records.js';
import {PLAN59_RECORDS as p59} from '../../../src/content/data/plan59-directed-endpoint-records.js';
import {PLAN72_RECORDS as p72} from '../../../src/content/plan72-mixed-addition-task.js';
import {PLAN74_RECORDS as p74} from '../../../src/content/plan74-mixed-addition-task.js';
const candidates=JSON.parse(readFileSync(new URL('../plan-76-unlike-subtraction-problem-bank-expansion/expanded-records.json',import.meta.url)));
const sources={ 'bar-to-line-same-amount':[p37,'plan37-bar-to-line-bridge-records','unary bridge'], 'symbolic-fraction-comparison':[p45,'plan45-symbolic-fraction-comparison-records','comparison'], 'number-line-collection':[p50,'plan50-number-line-collection-records','collection'], 'fraction-distance':[p51,'plan51-distance-records','distance'], 'two-whole-location':[p53,'plan53-two-whole-location-records','unary location'], 'whole-plus-fraction-construction':[p58,'plan58-whole-plus-fraction-records','unary construction'], 'directed-number-line-endpoint':[p59,'plan59-directed-endpoint-records','directed operation'], 'mixed-number-addition-without-regrouping':[p72,'plan72-mixed-addition-task','addition'], 'mixed-number-addition-with-regrouping':[p74,'plan74-mixed-addition-task','addition']};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const norm=f=>{let n=BigInt(f.numerator),d=BigInt(f.denominator);if(f.whole)n+=BigInt(f.whole)*d;const g=gcd(n,d);return `${n/g}/${d/g}`};
const key=(a,b)=>`${norm(a)} | ${norm(b)}`;
let inventory=[];
for(const type of PRACTICE_TYPES) for(const item of type.items??[]){
 const f=resolveCuratedFixture(item.fixtureId,item.authoringRevision); let source,kind,record,pair;
 if(f?.left&&f?.right){source=`curated:${f.id}@${f.authoringRevision}`;kind=f.selector.includes('subtraction')?'subtraction':'addition';pair=[f.left,f.right];}
 else {const spec=sources[type.id];assert(spec,`unclassified type ${type.id}`);[,,kind]=spec;record=spec[0].find(x=>x.itemId===item.id);assert(record,`missing ${type.id}/${item.id}`);source=spec[1];if(type.id==='directed-number-line-endpoint'){kind=record.operation==='subtract'?'subtraction':'addition';pair=[record.start,record.amount]}else if(record.operands)pair=record.operands;else if(record.sourceForms?.first)pair=[record.sourceForms.first,record.sourceForms.second];}
 inventory.push({type:type.id,item:item.id,definition:item.episodeDefinitionId,source,kind,...(pair?{orderedOperands:pair,normalized:key(...pair)}:{record})});
}
for(const r of p40)inventory.push({type:'plan40 registry including holdouts',item:r.itemId,source:'plan40-reusable-subtraction-recipes-records',kind:'subtraction',orderedOperands:[r.sourceForms.left,r.sourceForms.right],normalized:key(r.sourceForms.left,r.sourceForms.right)});
const collisions=[],crossOperation=[];
for(let i=0;i<candidates.length;i++){const c=candidates[i];const k=key(c.sourceForms.left,c.sourceForms.right);for(const row of inventory) if(row.normalized===k){const target=row.kind==='subtraction'?collisions:row.kind==='addition'?crossOperation:null;if(target) target.push({candidate:c.itemId,other:row.item,source:row.source,kind:row.kind});}for(const prior of candidates.slice(0,i))if(k===key(prior.sourceForms.left,prior.sourceForms.right))collisions.push({candidate:c.itemId,other:prior.itemId,source:'adopted batch'});
 assert(!inventory.some(x=>x.item===c.itemId));assert(!p40.some(x=>x.itemId===c.itemId));assert(!resolveCuratedFixture(c.fixtureId,c.authoringRevision));assert(![...p40,...p35].some(x=>x.stimulusId && x.stimulusId===c.stimulusId && x.stimulusRevision===c.stimulusRevision));
 for(const other of candidates.slice(0,i)){assert(c.itemId!==other.itemId);assert(c.fixtureId!==other.fixtureId||c.authoringRevision!==other.authoringRevision);assert(!c.stimulusId||c.stimulusId!==other.stimulusId||c.stimulusRevision!==other.stimulusRevision)}
}
assert(!sets.some(s=>s.id==='unlike-subtraction-vetted-set'&&s.revision==='2'));
const coverage=candidates.map(c=>{const l=c.sourceForms.left,r=c.sourceForms.right,t=BigInt(c.targetDenominator),ln=BigInt(l.numerator)*(t/BigInt(l.denominator)),rn=BigInt(r.numerator)*(t/BigInt(r.denominator));assert(t%BigInt(l.denominator)===0n&&t%BigInt(r.denominator)===0n);const invalid=c.candidates?Object.entries(c.candidates).filter(([side,f])=>norm(f)!==norm(c.sourceForms[side])).map(([side])=>side):[];return {item:c.itemId,recipe:c.recipeId,target:c.targetDenominator,relationship:BigInt(l.denominator)%BigInt(r.denominator)===0n||BigInt(r.denominator)%BigInt(l.denominator)===0n?'nested':gcd(BigInt(l.denominator),BigInt(r.denominator))===1n?'relatively prime':'shared factor',requiredSides:c.requiredSides,invalid,difference:`${ln-rn}/${t}`}});
const out={baseline:'527815ee2f6eb2b467951cb189ad4a9b9ec68c5f',liveEntries:inventory.length-p40.length,inventory,collisions,crossOperation,coverage};writeFileSync(new URL('./audit-results.json',import.meta.url),JSON.stringify(out,null,2)+'\n');assert.equal(collisions.length,0,JSON.stringify(collisions));console.log(JSON.stringify({live:out.liveEntries,collisions,crossOperation,coverage},null,2));
