import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const css='src/app/styles.css';
const original=readFileSync(css,'utf8');
const before='.plan59-frame { height: 175px; margin-bottom: 2.5em; }';
if (!original.includes(before)) throw new Error('reserve injection site missing');
let failure;
try {
 writeFileSync(css,original.replace(before,'.plan59-frame { height: 175px; margin-bottom: 0; }'));
 const result=spawnSync('node',['reports/development/plan-59-directed-number-line-endpoint/evidence/repair-01/browser-probe.mjs'],{encoding:'utf8',timeout:60000});
 const output=(result.stdout||'')+(result.stderr||'');
 if(result.error || result.signal || result.status===0 || !output.includes('WITNESS_BENCHMARK_FEEDBACK_CLEARANCE')) throw new Error(`invalid seed failure: ${result.error || result.signal || output.slice(-1000)}`);
 const at=output.indexOf('WITNESS_BENCHMARK_FEEDBACK_CLEARANCE');
 failure={exit:result.status,marker:'WITNESS_BENCHMARK_FEEDBACK_CLEARANCE',excerpt:output.slice(Math.max(0,at-120),at+350)};
} finally { writeFileSync(css,original); }
const clean=spawnSync('node',['reports/development/plan-59-directed-number-line-endpoint/evidence/repair-01/browser-probe.mjs'],{encoding:'utf8',timeout:60000});
if(clean.error || clean.signal || clean.status!==0 || !clean.stdout.includes('PASS')) throw new Error(`restoration failed: ${clean.stderr}`);
writeFileSync('reports/development/plan-59-directed-number-line-endpoint/evidence/repair-01/reserve-seed-receipt.json',JSON.stringify({failure,restored:'clean pass'},null,2));
console.log('PASS reserve removal rejected by named assertion and restoration clean');
