import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { strict as assert } from 'node:assert';
const cases = [
 {name:'unit-scale', edits:[['src/app/styles.css', '\n.plan58-controls,', '\n.plan58-region:nth-child(2) .plan58-bar { width: 50%; }\n.plan58-controls,']], args:['reports/development/plan-58-whole-plus-fraction-construction/evidence/browser-probe.mjs'], witness:'WITNESS_UNIT_SCALE'},
 {name:'premature-reveal', edits:[['src/interaction/plan58-whole-plus-fraction-scene.js', 'verification: resolved ? structuredClone(state.established.grouping) : null', "verification: resolved ? structuredClone(state.established.grouping) : { leaked: true }"]], args:['node_modules/vitest/vitest.mjs','run','tests/interaction-plan58-construction.test.js'], witness:'expected { leaked: true } to be null'},
 {name:'improper-accepted', edits:[['src/interaction/plan58-whole-plus-fraction-episode.js', "fields.pieces.value >= d ? 'organize'", "false ? 'organize'"]], args:['node_modules/vitest/vitest.mjs','run','tests/interaction-plan58-construction.test.js'], witness:"expected 'accepted' to be 'organize'"},
 {name:'raw-loss', edits:[['src/interaction/plan58-whole-plus-fraction-episode.js', '[intent.field]: intent.raw', "[intent.field]: String(Number(intent.raw))"]], args:['node_modules/vitest/vitest.mjs','run','tests/interaction-plan58-construction.test.js'], witness:'WITNESS_RAW_DRAFT'},
 {name:'retired-callback', edits:[['src/render/plan58-whole-plus-fraction.js', 'const valid = node => !destroyed && active() && root?.isConnected && root.contains(node);', 'const valid = node => true;'], ['src/app/app.js', 'const active = () => generation === currentEpisodeGeneration && isPlan58(state);', 'const active = () => isPlan58(state);']], args:['reports/development/plan-58-whole-plus-fraction-construction/evidence/lifecycle-probe.mjs'], witness:'WITNESS_SAME_ITEM_RETIRED_CALLBACK'},
];
for (const test of cases) {
 const originals = new Map();
 try {
  for (const [file, from, to] of test.edits) { const source=readFileSync(file,'utf8'); assert.ok(source.includes(from),`${test.name}: mutation target`); originals.set(file,source); writeFileSync(file,source.replace(from,to)); }
  const result=spawnSync(process.execPath,test.args,{encoding:'utf8',timeout:60000});
  const output=(result.stdout||'')+(result.stderr||'');
  assert.equal(result.error,undefined,`${test.name}: launch or timeout`); assert.notEqual(result.status,0,`${test.name}: unexpectedly passed`);
  assert.ok(output.includes(test.witness),`${test.name}: unexpected failure\n${output.slice(-2500)}`);
  console.log(`${test.name}: intended assertion failed`);
 } finally { for (const [file,source] of originals) writeFileSync(file,source); }
}
