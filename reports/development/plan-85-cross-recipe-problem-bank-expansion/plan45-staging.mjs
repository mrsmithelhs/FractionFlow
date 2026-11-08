import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { resolvePlan45ComparisonContext as resolveProduction } from '../../../src/content/plan45-symbolic-fraction-comparison-task.js';

const root = path.resolve(process.cwd());
const out = path.dirname(fileURLToPath(import.meta.url));
const candidates = JSON.parse(await fs.readFile(path.join(out, 'plan45-candidates.json'), 'utf8'));
const source = path.join(root, 'src');
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'plan45-validation-'));
const assertInside = (base, target) => {
  const rel = path.relative(path.resolve(base), path.resolve(target));
  if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) throw new Error('Refusing destination outside disposable directory: ' + target);
};
assertInside(os.tmpdir(), temp);
try {
  const copiedSrc = path.join(temp, 'src');
  assertInside(temp, copiedSrc);
  await fs.cp(source, copiedSrc, { recursive: true });
  const dataFile = path.join(copiedSrc, 'content/data/plan45-symbolic-fraction-comparison-records.js');
  assertInside(temp, dataFile);
  let text = await fs.readFile(dataFile, 'utf8');
  const at = text.indexOf('\n];\n\nexport const PLAN45_COMPARISON_RECORDS');
  if (at < 0) throw Error('Could not locate copied authoredPairs terminator');
  const rows = candidates.map((x, i) => `  { itemId: 'plan45-compare-${String(i + 13).padStart(2, '0')}', sourceForms: { first: { numerator: '${x.first[0]}', denominator: '${x.first[1]}' }, second: { numerator: '${x.second[0]}', denominator: '${x.second[1]}' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: '${x.cue}' },`).join('\n');
  text = text.slice(0, at) + '\n' + rows + text.slice(at);
  await fs.writeFile(dataFile, text);
  const task = await import(pathToFileURL(path.join(copiedSrc, 'content/plan45-symbolic-fraction-comparison-task.js')).href);
  const plan49 = await import(pathToFileURL(path.join(copiedSrc, 'interaction/plan49-comparison-construction.js')).href);
  const records = task.listPlan45ComparisonRecords();
  const key = x => {
    const gcd = (a,b) => b ? gcd(b,a%b) : a;
    const norm = f => { const g=gcd(f[0],f[1]); return [f[0]/g,f[1]/g]; };
    const pair=[norm(x.first),norm(x.second)].sort((a,b)=>a[0]/a[1]-b[0]/b[1]);
    return pair.map(p=>p.join('/')).join('|');
  };
  const allKeys=records.map(r=>key({first:[+r.sourceForms.first.numerator,+r.sourceForms.first.denominator],second:[+r.sourceForms.second.numerator,+r.sourceForms.second.denominator]}));
  if(new Set(allKeys).size !== 30) throw Error(`distinct unordered exact pairs=${new Set(allKeys).size}; expected 30`);
  const validated = candidates.map((_,i)=>task.validatePlan45ComparisonRecord(records[i+12]));
  if(validated.length!==22) throw Error('candidate count mismatch');
  assert.throws(()=>task.validatePlan45ComparisonBatch(records)); // The original batch contract is fixed at 12.
  for(const r of records.slice(12)) assert.throws(()=>resolveProduction(r.itemId));
  for(const r of records.slice(12)) plan49.validatePlan49Context(plan49.resolvePlan49Context(r.itemId));
  const relations={less:0,equal:0,greater:0};
  for(const r of candidates){
    const diff=r.first[0]*r.second[1]-r.second[0]*r.first[1]; relations[diff<0?'less':diff>0?'greater':'equal']++;
    if(r.cue==='compare.same-denominator' && r.first[1]!==r.second[1]) throw Error('same-denominator cue mismatch');
    if(r.cue==='compare.same-count-unit-size' && r.first[0]!==r.second[0]) throw Error('same-count cue mismatch');
    if(r.cue==='compare.equivalence' && diff!==0) throw Error('equivalence cue mismatch');
    if(r.cue==='compare.complements-to-one' && r.first[0]*r.second[1]+r.second[0]*r.first[1]!==r.first[1]*r.second[1]) throw Error('complements cue mismatch');
  }
  if(JSON.stringify(relations)!==JSON.stringify({less:9,equal:4,greater:9})) throw Error('candidate relation balance changed');
  const negativeControls=[];
  for(const [label,change] of [
    ['unsupported denominator',r=>({...r,sourceForms:{...r.sourceForms,first:{numerator:'1',denominator:'11'}}})],
    ['unregistered identity',r=>({...r,itemId:'plan45-compare-99'})],
    ['invalid cue',r=>({...r,cueId:'compare.answer-reveal'})],
  ]) { try { task.validatePlan45ComparisonRecord(change(records[12])); negativeControls.push({label,rejected:false}); } catch(e) { negativeControls.push({label,rejected:true,message:e.message}); } }
  if(negativeControls.some(x=>!x.rejected)) throw Error('negative control unexpectedly passed');
  console.log(JSON.stringify({liveRecords:12, liveDistinctPairs:new Set(allKeys.slice(0,12)).size, candidates:candidates.length, totalDistinctPairs:new Set(allKeys).size, validatedCandidates:validated.length, plan49Contexts:validated.length, relations, negativeControls},null,2));
} finally { await fs.rm(temp,{recursive:true,force:true}); }
