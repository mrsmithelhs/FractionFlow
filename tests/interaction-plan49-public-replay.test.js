import { describe,it,expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createEpisode,applyIntent,episodeStateSnapshot } from '../src/interaction/episode.js';
import { PLAN49_COMPARISON_EPISODE_DEFINITION as definition } from '../src/interaction/episode-definition.js';
import { resolvePlan49Context } from '../src/interaction/plan49-comparison-construction.js';
import { computeBeatSchedule } from '../src/interaction/beat-schedule.js';
import { createReplayEnvelope,replayEpisode } from '../src/interaction/replay.js';
const start=()=>createEpisode({episodeDefinition:definition,taskContext:resolvePlan49Context('plan45-compare-01')});
const a=(s,type,x={})=>applyIntent(s,{type,...x});
describe('Plan 49 public v10 contract',()=>{
 it('derives the registered revision-2 schedule from its authoritative context',()=>{
  const context=resolvePlan49Context('plan45-compare-01'); expect(computeBeatSchedule(null,definition,context)).toEqual([{id:'compare',kind:'compare'},{id:'resolve',kind:'resolve'}]);
  expect(()=>computeBeatSchedule(null,definition,{...context,definitionRevision:'1'})).toThrow();
 });
 it('refuses new actions on historical v9 and rejects nonauthoritative v10 context',()=>{
  const old=JSON.parse(readFileSync(new URL('../reports/development/plan-49-optional-common-denominator-comparison-help/v9-prechange-oracles.json',import.meta.url),'utf8')).cases[0].envelope;
  expect(()=>replayEpisode({...old,learnerIntents:[...old.learnerIntents,{type:'open-comparison-construction'}]})).toThrow();
  const fresh=createReplayEnvelope(start()); const altered={...fresh,taskContext:{...fresh.taskContext,itemId:'plan45-compare-02'}}; expect(()=>replayEpisode(altered)).toThrow();
 });
 it('round trips complete public state through revised target, wrong and accepted partial relation',()=>{
  let s=start(); s=a(s,'open-comparison-construction'); s=a(s,'submit-comparison-denominator',{phase:'denominator',proposed:'14'}); s=a(s,'submit-comparison-denominator',{phase:'denominator',proposed:'15'}); s=a(s,'submit-comparison-numerator',{phase:'first',proposed:'10'}); s=a(s,'revise-comparison-denominator'); s=a(s,'submit-comparison-denominator',{phase:'denominator',proposed:'30'}); s=a(s,'submit-fraction-comparison',{proposed:'<'}); s=a(s,'submit-fraction-comparison',{proposed:'>'});
  const envelope=createReplayEnvelope(s); expect(envelope.schemaVersion).toBe('fractionflow.episode-replay/v10'); expect(s).not.toHaveProperty('base'); expect(replayEpisode(JSON.parse(JSON.stringify(envelope)))).toEqual(s); expect(episodeStateSnapshot(s).construction.target).toBe('30');
  const p=s.responseProvenance.at(-1); expect(p.episodeDefinition.revision).toBe('2'); expect(p.construction.epoch).toBe(1); expect(p.constructionAttempts.some(x=>x.outcome==='not-common')).toBe(true);
  expect(()=>replayEpisode({...envelope,schemaVersion:'fractionflow.episode-replay/v9'})).toThrow(); expect(()=>replayEpisode({...envelope,episodeDefinition:{...envelope.episodeDefinition,revision:'1'}})).toThrow(); expect(()=>replayEpisode({...envelope,learnerIntents:[...envelope.learnerIntents,{type:'open-comparison-construction',extra:true}]})).toThrow();
 });
});
