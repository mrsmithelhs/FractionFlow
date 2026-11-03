import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const file='src/render/plan59-directed-endpoint.js',original=readFileSync(file,'utf8'),normalized=original.replace(/\r\n/g,'\n');
const cases=[
 {name:'collision-overlap',from:'if (startBox.left < endBox.right && endBox.left < startBox.right) {',to:'if (false && startBox.left < endBox.right && endBox.left < startBox.right) {',marker:'WITNESS_COLLISION_STACK'},
 {name:'success-order',from:'if (!live) section.append(feedback);',to:'/* seed: success appended after workspace */',from2:'if (live) section.append(feedback);',to2:'section.append(feedback);',marker:'WITNESS_SUCCESS_ORDER'},
];const receipt=[];
try{for(const c of cases){
 if(!normalized.includes(c.from)||c.from2&&!normalized.includes(c.from2))throw new Error(`missing seed ${c.name}`);
 let changed=normalized.replace(c.from,c.to);if(c.from2)changed=changed.replace(c.from2,c.to2);writeFileSync(file,changed);
 const r=spawnSync('node',['reports/development/plan-59-directed-number-line-endpoint/evidence/repair-03/layout-probe.mjs'],{encoding:'utf8',timeout:60000});const output=(r.stdout||'')+(r.stderr||'');
 if(r.error||r.signal||r.status===0||!output.includes(c.marker))throw new Error(`invalid ${c.name} seed: ${r.error||r.signal||output.slice(-1200)}`);
 const at=output.indexOf(c.marker);receipt.push({name:c.name,marker:c.marker,exit:r.status,excerpt:output.slice(Math.max(0,at-100),at+350)});writeFileSync(file,original);console.log('REJECTED',c.name,c.marker);
}}finally{writeFileSync(file,original);}
const clean=spawnSync('node',['reports/development/plan-59-directed-number-line-endpoint/evidence/repair-03/layout-probe.mjs'],{encoding:'utf8',timeout:60000});
if(clean.error||clean.signal||clean.status!==0||!clean.stdout.includes('PASS'))throw new Error(`restoration failed: ${clean.stderr}`);
writeFileSync('reports/development/plan-59-directed-number-line-endpoint/evidence/repair-03/mutation-receipt.json',JSON.stringify({receipt,restored:'clean pass'},null,2));console.log('PASS clean restoration');
