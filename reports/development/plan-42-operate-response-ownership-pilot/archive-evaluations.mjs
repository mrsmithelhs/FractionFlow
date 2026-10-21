import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=process.cwd();
const target=path.join(root,'reports/development/plan-42-operate-response-ownership-pilot/evaluation');
if(fs.existsSync(target))throw new Error('Evaluation archive already exists; inspect before writing.');
const normalized=text=>text.replaceAll(root.replaceAll('\\','/')+'/','').replaceAll(root+'\\','').replaceAll(root.replaceAll('\\','\\\\')+'\\\\','');
const manifest={date:'2026-10-21',requestedModel:'gpt-6-luna',reasoningEffort:'medium',coldContext:true,serialWriters:true,limits:'One run per arm plus one scope correction; model runtime identity and billed usage not independently verified. Text root prefixes normalized; assertions/source diffs and PNG bytes preserved. Probes reproduce at their original report path in their isolated F1 commit, not against production main.',arms:[]};
for(const [arm,baseline,commit] of [['a','d7936a71bbbb099fb9394a727bbac1d751e79afa','c1f076019610cfd19f91f594dc3a3ee85fa799ac'],['b','436e54a0ed58ff8437a22e61815c2c3da098954d','675ea1a825e64edbb67fd575a7375b5607a48d18']]){
 const checkout=path.join(root,`node_modules/.plan42-eval-${arm}`);
 const source=path.join(checkout,'reports/development/plan-42-maintenance-arm');
 const dest=path.join(target,`arm-${arm}`);
 fs.cpSync(source,dest,{recursive:true});
 const files=[];
 const visit=folder=>{for(const entry of fs.readdirSync(folder,{withFileTypes:true})){const file=path.join(folder,entry.name);if(entry.isDirectory()){visit(file);continue;}if(/\.(md|json|mjs)$/.test(entry.name))fs.writeFileSync(file,normalized(fs.readFileSync(file,'utf8')));files.push({file:path.relative(dest,file).replaceAll('\\','/'),sha256:createHash('sha256').update(fs.readFileSync(file)).digest('hex')});}};
 visit(dest);
 const patch=execFileSync('git',['-C',checkout,'diff',baseline,commit,'--','src','tests'],{encoding:'utf8'});
 fs.writeFileSync(path.join(dest,'temporary-f1.patch'),patch);
 manifest.arms.push({arm,baseline,commit,sourceReportPath:'reports/development/plan-42-maintenance-arm',sourceFiles:execFileSync('git',['-C',checkout,'diff','--name-only',baseline,commit,'--','src'],{encoding:'utf8'}).trim().split(/\r?\n/),files});
}
fs.writeFileSync(path.join(target,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Archived both isolated evaluation artifacts; no F1 source merged.');
