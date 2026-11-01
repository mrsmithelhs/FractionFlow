import { describe,it,expect,afterAll } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createEpisode,applyIntent } from '../src/interaction/episode.js';
import { PLAN49_COMPARISON_EPISODE_DEFINITION as definition } from '../src/interaction/episode-definition.js';
import { resolvePlan49Context } from '../src/interaction/plan49-comparison-construction.js';
import { createFraction, equalFractions } from '../src/math/index.js';
import { resolveRenderableScene } from '../src/render/contract.js';
const evidence=[];
function seed(name, mutation, check, recovery) { let failure; try { check(); } catch(e) { failure=String(e.message); } expect(failure).toBeTruthy(); recovery(); evidence.push({name,mutation,observedAssertionFailure:failure,cleanRecovery:true}); }
function start(){return createEpisode({episodeDefinition:definition,taskContext:resolvePlan49Context('plan45-compare-01')});}
function apply(s,type,x={}){return applyIntent(s,{type,...x});}
afterAll(()=>writeFileSync('reports/development/plan-49-optional-common-denominator-comparison-help/evidence/falsification-seeds.json',JSON.stringify({seeds:evidence},null,2)+'\n'));
describe('Plan 49 failing-first assertions',()=>{
 it('detects premature future-form disclosure',()=>{ let s=apply(start(),'open-comparison-construction'); s=apply(s,'submit-comparison-denominator',{phase:'denominator',proposed:'15'}); const scene=resolveRenderableScene({state:s,initialRole:'fraction-bar',presentationMode:'instant-test'}); const mutated=structuredClone(scene.meaning.comparison.construction); mutated.acceptedForms.second={numerator:'9',denominator:'15'}; seed('future-form','insert second answer into pre-construction projection',()=>expect(mutated.acceptedForms.second).toBeNull(),()=>expect(scene.meaning.comparison.construction.acceptedForms.second).toBeNull()); });
 it('detects stale work after target revision',()=>{let s=apply(start(),'open-comparison-construction');s=apply(s,'submit-comparison-denominator',{phase:'denominator',proposed:'15'});s=apply(s,'submit-comparison-numerator',{phase:'first',proposed:'10'});const old=s.construction.acceptedForms.first;s=apply(s,'revise-comparison-denominator');const bad={...s.construction,acceptedForms:{...s.construction.acceptedForms,first:old}};seed('stale-form','retain old accepted form after revision',()=>expect(bad.acceptedForms.first).toBeNull(),()=>expect(s.construction.acceptedForms.first).toBeNull());});
 it('detects a wrong accepted conversion against exact core',()=>{let s=apply(start(),'open-comparison-construction');s=apply(s,'submit-comparison-denominator',{phase:'denominator',proposed:'15'});const bad=createFraction(11n,15n);const source=createFraction(2n,3n);seed('wrong-conversion','treat 11/15 as accepted equivalent of 2/3',()=>expect(equalFractions(bad,source)).toBe(true),()=>{s=apply(s,'submit-comparison-numerator',{phase:'first',proposed:'11'});expect(s.construction.phase).toBe('first');expect(s.construction.recovery).toBe('incorrect-numerator');});});
});
