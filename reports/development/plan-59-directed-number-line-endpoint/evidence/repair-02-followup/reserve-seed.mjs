import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const file='src/render/plan59-directed-endpoint.js', original=readFileSync(file,'utf8');
const normalized=original.replace(/\r\n/g,'\n');
const before="if (!current.dragging && current.token.parentElement?.classList.contains('plan59-tray')) {";
if (!normalized.includes(before)) throw new Error('reserve seed site missing');
let failure;
try {
 writeFileSync(file,normalized.replace(before,"if (false && !current.dragging && current.token.parentElement?.classList.contains('plan59-tray')) {"));
 const run=spawnSync('node',['reports/development/plan-59-directed-number-line-endpoint/evidence/repair-02-followup/drag-probe.mjs'],{encoding:'utf8',timeout:60000});
 const output=(run.stdout||'')+(run.stderr||''); const marker='WITNESS_DURING_TRAY';
 if(run.error||run.signal||run.status===0||!output.includes(marker)) throw new Error(`invalid seed failure: ${run.error||run.signal||output.slice(-1000)}`);
 const at=output.indexOf(marker);failure={marker,exit:run.status,excerpt:output.slice(Math.max(0,at-100),at+350)};
} finally {writeFileSync(file,original);}
const clean=spawnSync('node',['reports/development/plan-59-directed-number-line-endpoint/evidence/repair-02-followup/drag-probe.mjs'],{encoding:'utf8',timeout:60000});
if(clean.error||clean.signal||clean.status!==0||!clean.stdout.includes('PASS')) throw new Error(`clean restoration failed: ${clean.stderr}`);
writeFileSync('reports/development/plan-59-directed-number-line-endpoint/evidence/repair-02-followup/reserve-seed-receipt.json',JSON.stringify({failure,restored:'clean pass'},null,2));
console.log('PASS in-flight reserve removal rejected and clean restoration passed');
