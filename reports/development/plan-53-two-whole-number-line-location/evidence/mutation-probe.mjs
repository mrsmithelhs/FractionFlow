import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { strict as assert } from 'node:assert';
const output='reports/development/plan-53-two-whole-number-line-location/evidence/mutation-receipt.json';
const pure=['node_modules/vitest/vitest.mjs','run','tests/interaction-plan53-two-whole.test.js'];
const browser=['reports/development/plan-53-two-whole-number-line-location/evidence/browser-probe.mjs'];
const lifecycle=['reports/development/plan-53-two-whole-number-line-location/evidence/lifecycle-probe.mjs'];
const cases=[
 {name:'whole-scale',file:'src/app/styles.css',from:'.plan53-bar { display: flex; width: 50%;',to:'.plan53-bar { display: flex; width: 100%;',args:browser,reason:'AssertionError'},
 {name:'boundary-index',file:'src/content/plan53-two-whole-location-task.js',from:'correctPosition: matches[0].id',to:'correctPosition: candidates[(Number(record.form.numerator) + 1) % candidates.length].id',args:pure,reason:'expected'},
 {name:'premature-verification',file:'src/interaction/plan53-two-whole-location-scene.js',from:'verification: resolved ? admitted.verification : null',to:'verification: admitted.verification',args:pure,reason:'toBeNull'},
 {name:'lost-help-on-view-change',file:'src/app/app.js',from:'        visualView = !visualView;',to:'        if (isPlan53(state)) plan53HelpOpen = false;\n        visualView = !visualView;',args:lifecycle,reason:'AssertionError'},
 {name:'lost-draft-on-view-change',file:'src/app/app.js',from:'        visualView = !visualView;',to:'        if (isPlan53(state)) state = {...state, placement:null};\n        visualView = !visualView;',args:lifecycle,reason:'AssertionError'},
 {name:'lost-assistance',file:'src/interaction/plan53-two-whole-location-episode.js',from:"next = { ...state, placement: intent.candidateId, placementRevision:",to:"next = { ...state, assistanceHistory: [], placement: intent.candidateId, placementRevision:",args:pure,reason:'toHaveLength'},
];
const run=args=>spawnSync(process.execPath,args,{encoding:'utf8',timeout:120000});
const receipts=[];
for(const test of cases) {
 const original=readFileSync(test.file,'utf8'); assert.equal(original.split(test.from).length,2,`${test.name}: injection target must occur once`);
 let result;
 try {writeFileSync(test.file,original.replace(test.from,test.to)); result=run(test.args);}
 finally {writeFileSync(test.file,original);}
 const log=(result.stdout||'')+(result.stderr||'');
 assert.notEqual(result.status,0,`${test.name} mutation unexpectedly passed`);assert.ok(log.includes(test.reason),`${test.name} failed for unexpected reason: ${log}`);
 receipts.push({mutation:test.name,injected:true,exit:result.status,expectedFailureMarker:test.reason,markerObserved:true,restored:true});
}
for(const [name,args] of [['pure',pure],['geometry',browser],['lifecycle',lifecycle]]) {const result=run(args);assert.equal(result.status,0,`${name} restored run failed: ${result.stdout}\n${result.stderr}`);receipts.push({restoredRun:name,exit:result.status});}
writeFileSync(output,JSON.stringify(receipts,null,2));console.log(JSON.stringify(receipts,null,2));
