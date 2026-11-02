import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
const receipt = { cases: [], clean: [] };
const digest = data => createHash('sha256').update(data).digest('hex');
const sanitize = value => value.replaceAll(process.cwd(), '<repo>').replaceAll(process.cwd().replaceAll('\\', '/'), '<repo>');
const cases = [
 {name:'unit-scale', edits:[['src/app/styles.css', '\n.plan58-controls,', '\n.plan58-region:nth-child(2) .plan58-bar { width: 50%; }\n.plan58-controls,']], args:['reports/development/plan-58-whole-plus-fraction-construction/evidence/browser-probe.mjs'], witness:'WITNESS_UNIT_SCALE'},
 {name:'premature-reveal', edits:[['src/interaction/plan58-whole-plus-fraction-scene.js', 'verification: resolved ? structuredClone(state.established.grouping) : null', "verification: resolved ? structuredClone(state.established.grouping) : { leaked: true }"]], args:['node_modules/vitest/vitest.mjs','run','tests/interaction-plan58-construction.test.js'], witness:'expected { leaked: true } to be null'},
 {name:'improper-accepted', edits:[['src/interaction/plan58-whole-plus-fraction-episode.js', "fields.pieces.value >= d ? 'organize'", "false ? 'organize'"]], args:['node_modules/vitest/vitest.mjs','run','tests/interaction-plan58-construction.test.js'], witness:"expected 'accepted' to be 'organize'"},
 {name:'raw-loss', edits:[['src/interaction/plan58-whole-plus-fraction-episode.js', '[intent.field]: intent.raw', "[intent.field]: String(Number(intent.raw))"]], args:['node_modules/vitest/vitest.mjs','run','tests/interaction-plan58-construction.test.js'], witness:'WITNESS_RAW_DRAFT'},
 {name:'retired-callback', edits:[['src/render/plan58-whole-plus-fraction.js', 'const valid = node => !destroyed && active() && root?.isConnected && root.contains(node);', 'const valid = node => true;'], ['src/app/app.js', 'const active = () => generation === currentEpisodeGeneration && isPlan58(state);', 'const active = () => isPlan58(state);']], args:['reports/development/plan-58-whole-plus-fraction-construction/evidence/lifecycle-probe.mjs'], witness:'WITNESS_SAME_ITEM_RETIRED_CALLBACK'},
];
for (const test of cases) {
 const originals = new Map();
 let entry;
 try {
  for (const [file, from, to] of test.edits) { const source=readFileSync(file,'utf8'); assert.ok(source.includes(from),`${test.name}: mutation target`); originals.set(file,source); writeFileSync(file,source.replace(from,to)); }
  const result=spawnSync(process.execPath,test.args,{encoding:'utf8',timeout:60000});
  const output=(result.stdout||'')+(result.stderr||'');
  assert.equal(result.error,undefined,`${test.name}: launch or timeout`); assert.equal(result.signal,null,`${test.name}: signal`); assert.notEqual(result.status,0,`${test.name}: unexpectedly passed`);
  assert.ok(output.includes(test.witness),`${test.name}: unexpected failure\n${output.slice(-2500)}`);
  const at = output.indexOf(test.witness);
  entry = { name: test.name, edits: test.edits.map(([file,from]) => ({file, target:from, originalSha256:digest(originals.get(file))})), witness:test.witness, exitCode:result.status, signal:result.signal, failureExcerpt:sanitize(output.slice(Math.max(0,at-160), Math.min(output.length,at+300))) };
  console.log(`${test.name}: intended assertion failed`);
 } finally { for (const [file,source] of originals) writeFileSync(file,source); }
 entry.restored = [...originals].every(([file,source]) => digest(readFileSync(file)) === digest(source));
 assert.ok(entry.restored, `${test.name}: restoration`); receipt.cases.push(entry);
}
for (const args of [['node_modules/vitest/vitest.mjs','run','tests/interaction-plan58-construction.test.js'], ['reports/development/plan-58-whole-plus-fraction-construction/evidence/browser-probe.mjs'], ['reports/development/plan-58-whole-plus-fraction-construction/evidence/lifecycle-probe.mjs']]) {
 const result = spawnSync(process.execPath,args,{encoding:'utf8',timeout:90000});
 assert.equal(result.error,undefined, 'clean launch or timeout'); assert.equal(result.signal,null, 'clean signal'); assert.equal(result.status,0, `clean failed: ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
 receipt.clean.push({ command:['node',...args], exitCode:result.status, signal:result.signal, excerpt:sanitize((result.stdout||'').slice(-1200)) });
}
writeFileSync('reports/development/plan-58-whole-plus-fraction-construction/evidence/repair01-mutation-receipt.json', JSON.stringify(receipt,null,2)+'\n');
console.log('all mutations restored; clean probes passed');
