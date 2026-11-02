import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Each defect changes production source, then runs the same ordinary assertions.
const cases = [
  { id: 'source-order', file: 'src/content/data/plan51-distance-records.js', from: "first: { numerator: '2', denominator: '8' }, second: { numerator: '6', denominator: '8' }", to: "first: { numerator: '6', denominator: '8' }, second: { numerator: '2', denominator: '8' }" },
  { id: 'subtraction-order', file: 'src/content/plan51-distance-task.js', from: 'subtractFractions(order > 0 ? forms[0] : forms[1], order > 0 ? forms[1] : forms[0])', to: 'subtractFractions(order > 0 ? forms[1] : forms[0], order > 0 ? forms[0] : forms[1])' },
  { id: 'premature-pair', file: 'src/interaction/plan51-distance-scene.js', from: "pairedAmounts: state.beat === 'resolve' || (state.beat === 'distance' && asked('distance-help', 'both-amounts'))", to: "pairedAmounts: state.beat === 'resolve' || state.beat === 'distance'" },
  { id: 'wrong-unit', file: 'src/content/plan51-distance-task.js', from: 'denominator: Number(forms[0].denominator), count:', to: 'denominator: Number(forms[0].denominator) + 1, count:' },
  { id: 'lost-comparison', file: 'src/interaction/plan51-distance-episode.js', from: 'comparison: intent.proposed }, feedback: null', to: 'comparison: null }, feedback: null' },
];
const output = [];
const run = () => spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', 'tests/interaction-plan51-distance.test.js', 'tests/app-plan51-distance.test.js'], { encoding: 'utf8', windowsHide: true });
for (const test of cases) {
  const original = readFileSync(test.file, 'utf8');
  if (!original.includes(test.from) || original.split(test.from).length !== 2) throw new Error(`mutation target missing or ambiguous: ${test.id}`);
  try {
    writeFileSync(test.file, original.replace(test.from, test.to));
    const result = run();
    if (result.error || result.status === 0) throw new Error(`mutation was not detected: ${test.id}`);
    output.push({ id: test.id, exit: result.status, output: result.stdout + result.stderr });
  } finally { writeFileSync(test.file, original); }
}
const clean = run();
if (clean.error || clean.status !== 0) throw new Error(`clean recovery failed: ${clean.stderr}`);
output.push({ id: 'clean-recovery', exit: clean.status, output: clean.stdout + clean.stderr });
writeFileSync(fileURLToPath(new URL('./evidence/mutation-receipt.json', import.meta.url)), JSON.stringify(output, null, 2));
