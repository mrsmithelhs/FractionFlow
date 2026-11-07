import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.argv[2]; if(!root) throw Error('supply isolated checkout');
const load=p=>import(pathToFileURL(path.join(root,p)).href);
const {PRACTICE_TYPES}=await load('src/app/practice-types.js');
const {resolveCuratedFixture}=await load('src/content/authored-content-catalog.js');
const {PLAN40_SUBTRACTION_RECIPE_RECORDS:all}=await load('src/content/data/plan40-reusable-subtraction-recipes-records.js');
const candidates=all.filter(r=>r.itemId.startsWith('plan76-'));
const items=PRACTICE_TYPES.flatMap(p=>p.items??[]);
const existing=all.filter(r=>!r.itemId.startsWith('plan76-'));
for(const c of candidates){
 assert(!items.some(i=>i.id===c.itemId),`live item identity collision ${c.itemId}`);
 assert(!existing.some(r=>r.itemId===c.itemId || (r.fixtureId===c.fixtureId && r.authoringRevision===c.authoringRevision) || (c.stimulusId && r.stimulusId===c.stimulusId && r.stimulusRevision===c.stimulusRevision)));
}
const gcd=(a,b)=>b?gcd(b,a%b):a;
const normalized=f=>{const n=BigInt(f.numerator),d=BigInt(f.denominator),g=gcd(n,d); return `${n/g}/${d/g}`};
const key=(l,r)=>`${normalized(l)} - ${normalized(r)}`;
const clashes=[]; let checked=0, unresolved=0;
for(const item of items){
 const fixture=resolveCuratedFixture(item.fixtureId,item.authoringRevision);
 if(!fixture?.left || !fixture?.right){unresolved++; continue;}
 checked++;
 for(const c of candidates) if(key(fixture.left,fixture.right)===key(c.sourceForms.left,c.sourceForms.right)) clashes.push({candidate:c.itemId,other:item.id,fixture:fixture.id,selector:fixture.selector});
}
for(const c of candidates) for(const r of existing) if(key(r.sourceForms.left,r.sourceForms.right)===key(c.sourceForms.left,c.sourceForms.right)) clashes.push({candidate:c.itemId,other:r.itemId,selector:'plan40'});
console.log(JSON.stringify({liveItemEntries:items.length,resolvedBinaryFixtures:checked,unresolvedOrUnaryEntries:unresolved,plan40ExistingRecords:existing.length,collisions:clashes},null,2));
