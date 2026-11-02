import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const file='src/render/plan59-directed-endpoint.js'; const original=readFileSync(file,'utf8'); const normalized=original.replace(/\r\n/g,'\n');
const cases=[
 {name:'anchor-offset',from:'offsetX: event.clientX - (box.left + box.width / 2)',to:'offsetX: 0',marker:'WITNESS_TILE_ANCHOR'},
 {name:'escape-cancellation',from:"if (event.key === 'Escape' && gesture) cancelGesture();",to:"if (event.key === 'Escape' && gesture) return;",marker:'WITNESS_CANCEL_DRAFT'},
];
const receipt=[];
try {
 for(const c of cases){
  if(!normalized.includes(c.from)) throw new Error(`missing seed ${c.name}`);
  writeFileSync(file,normalized.replace(c.from,c.to));
  const run=spawnSync('node',['reports/development/plan-59-directed-number-line-endpoint/evidence/repair-02/drag-probe.mjs'],{encoding:'utf8',timeout:60000});
  const output=(run.stdout||'')+(run.stderr||'');
  if(run.error||run.signal||run.status===0||!output.includes(c.marker)) throw new Error(`invalid ${c.name} failure: ${run.error||run.signal||output.slice(-1200)}`);
  const at=output.indexOf(c.marker);receipt.push({name:c.name,marker:c.marker,exit:run.status,excerpt:output.slice(Math.max(0,at-100),at+350)});
  writeFileSync(file,original); console.log('REJECTED',c.name,c.marker);
 }
} finally {writeFileSync(file,original);}
const clean=spawnSync('node',['reports/development/plan-59-directed-number-line-endpoint/evidence/repair-02/drag-probe.mjs'],{encoding:'utf8',timeout:60000});
if(clean.error||clean.signal||clean.status!==0||!clean.stdout.includes('PASS')) throw new Error(`clean restoration failed: ${clean.stderr}`);
writeFileSync('reports/development/plan-59-directed-number-line-endpoint/evidence/repair-02/mutation-receipt.json',JSON.stringify({receipt,restored:'clean pass'},null,2));
console.log('PASS clean restoration');
