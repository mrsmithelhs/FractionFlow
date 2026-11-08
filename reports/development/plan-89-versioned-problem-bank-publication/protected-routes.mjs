// Run the existing evidence-writing route runner only in a verified disposable copy.
import { mkdtemp, cp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, relative, sep, isAbsolute, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve(process.cwd()),prefix=resolve(tmpdir(),'fractionflow-plan89-routes-'),dest=resolve(await mkdtemp(prefix));
assert(dest.startsWith(prefix)&&dest!==root);
const inside=p=>{const target=resolve(dest,p),rel=relative(dest,target);assert(rel&&!isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+sep));return target;};
for(const name of ['src','scripts','tests','docs','reports','prototypes','index.html','package.json','vite.config.js','vite.subtraction.config.js'])await cp(resolve(root,name),inside(name),{recursive:true});
await cp(resolve(root,'node_modules'),inside('node_modules'),{recursive:true});
const build=spawnSync(process.execPath,['scripts/dev/build.mjs'],{cwd:dest,encoding:'utf8',maxBuffer:20_000_000});assert.equal(build.status,0,build.stderr||build.stdout);
const run=spawnSync(process.execPath,['scripts/dev/run-route-matrix.js','--filter','ROUTE-PLAN40','--browser-channel','chrome','--quiet'],{cwd:dest,encoding:'utf8',maxBuffer:20_000_000});
const output=dirname(fileURLToPath(import.meta.url));await writeFile(join(output,'protected-routes-log.txt'),`${(run.stdout+'\n'+run.stderr).trimEnd()}\n`);
assert.equal(run.status,0,run.stderr||run.stdout);
const receipt=await readFile(inside('reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-route-matrix-summary.json'),'utf8');await writeFile(join(output,'protected-routes-summary.json'),receipt);
console.log(JSON.stringify({destination:dest,status:run.status,log:'protected-routes-log.txt'}));
