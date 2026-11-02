import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const renderer='src/render/plan59-directed-endpoint.js';
const app='src/app/app.js';
const episode='src/interaction/plan59-directed-endpoint-episode.js';
const originals = Object.fromEntries([renderer,app,episode].map(path=>[path,readFileSync(path,'utf8')]));
const cases=[
 {name:'wrong-start',path:renderer,from:'const start = Number(model.start.numerator);',to:'const start = Number(model.start.numerator) + 1;',marker:'WITNESS_START'},
 {name:'wrong-arrow',path:renderer,from:"line.setAttribute('x1', String(start / denominator * 100));",to:"line.setAttribute('x1', String(selected / denominator * 100));",marker:'WITNESS_DIRECTION_DISTANCE'},
 {name:'tick-drift',path:renderer,from:'tick.style.left = `${i / denominator * 100}%`;',to:'tick.style.left = `${(i + 1) / denominator * 100}%`;',marker:'WITNESS_TICK_SCALE'},
 {name:'premature-arrow',path:renderer,from:"if (!live) {\n        const arrow",to:"if (true) {\n        const arrow",marker:'WITNESS_PREMATURE_ARROW'},
 {name:'premature-result',path:renderer,from:'section.append(expression);',to:"if (live) expression.append(element('span', '', '= 3/4'));\n    section.append(expression);",marker:'WITNESS_PREMATURE_RESULT'},
 {name:'lost-draft',path:app,from:'visualView = !visualView;',to:"visualView = !visualView; if (isPlan59(state)) state = createEpisode({ episodeDefinition: state.episodeDefinition, taskContext: state.taskContext, support: state.support, activeCondition: state.activeCondition });",marker:'WITNESS_DRAFT_VIEW'},
 {name:'lost-help',path:app,from:'visualView = !visualView;',to:'visualView = !visualView; if (isPlan59(state)) plan59HelpOpen = false;',marker:'WITNESS_HELP_VIEW'},
 {name:'lost-assistance',path:episode,from:"assistanceHistory: [...state.assistanceHistory, { kind: 'placement-help', eventRevision }]",to:'assistanceHistory: []',marker:'WITNESS_ASSISTANCE_HISTORY',unit:true},
];
const receipt=[];
try {
 for (const c of cases) {
  const normalized = originals[c.path].replace(/\r\n/g, '\n');
  if (!normalized.includes(c.from)) throw new Error(`missing injection site ${c.name}`);
  writeFileSync(c.path, normalized.replace(c.from,c.to));
  const command=c.unit?'npx.cmd':'node';
  const args=c.unit?['vitest','run','tests/interaction-plan59-directed-endpoint.test.js']:['reports/development/plan-59-directed-number-line-endpoint/evidence/browser-probe.mjs'];
  const run=spawnSync(command,args,{encoding:'utf8',timeout:60000,shell:c.unit});
  const output=(run.stdout||'')+(run.stderr||'');
  if (run.error || run.signal || run.status===0 || !output.includes(c.marker)) throw new Error(`${c.name} did not fail for ${c.marker}: ${run.error || run.signal || output.slice(-1500)}`);
  const index=output.indexOf(c.marker);
  receipt.push({name:c.name,marker:c.marker,exit:run.status,excerpt:output.slice(Math.max(0,index-120),index+260)});
  console.log('REJECTED',c.name,c.marker);
  writeFileSync(c.path,originals[c.path]);
 }
} finally { for (const [path,content] of Object.entries(originals)) writeFileSync(path,content); }
const clean=spawnSync('node',['reports/development/plan-59-directed-number-line-endpoint/evidence/browser-probe.mjs'],{encoding:'utf8',timeout:60000});
if(clean.status!==0 || clean.error || clean.signal || !clean.stdout.includes('PASS')) throw new Error(`clean restoration failed: ${clean.stderr}`);
writeFileSync('reports/development/plan-59-directed-number-line-endpoint/evidence/mutation-receipt.json',JSON.stringify({receipt,clean:'passed'},null,2));
console.log('CLEAN RESTORATION PASS');
