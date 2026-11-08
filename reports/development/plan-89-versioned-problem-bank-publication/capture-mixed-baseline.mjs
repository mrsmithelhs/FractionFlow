// Capture only before mixed-family changes; refuse to overwrite frozen evidence.
import { existsSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createEpisode, applyIntent } from '../../../src/interaction/episode.js';
import { getEpisodeDefinition } from '../../../src/interaction/episode-definition.js';
import { createReplayEnvelope, replayEpisode } from '../../../src/interaction/replay.js';
import { resolvePlan74Context } from '../../../src/content/plan74-mixed-addition-task.js';
import { resolvePlan78Context } from '../../../src/content/plan78-mixed-subtraction-task.js';
import { resolvePlan82Context } from '../../../src/content/plan82-mixed-subtraction-task.js';
import { PLAN74_ID, PLAN74_CONDITION, plan74IntentContext } from '../../../src/interaction/plan74-mixed-addition-episode.js';
import { PLAN78_ID, plan78IntentContext } from '../../../src/interaction/plan78-mixed-subtraction-episode.js';
import { PLAN82_ID, plan82IntentContext } from '../../../src/interaction/plan82-mixed-subtraction-episode.js';
const output=new URL('./mixed-baseline-oracles.json',import.meta.url);assert(!existsSync(output));
const specs=[{id:PLAN74_ID,resolve:resolvePlan74Context,item:'plan74-add-01',context:plan74IntentContext,condition:PLAN74_CONDITION,kind:'addition',whole:'4',pieces:'0'},
 {id:PLAN78_ID,resolve:resolvePlan78Context,item:'plan78-subtract-01',context:plan78IntentContext,kind:'subtraction',whole:'2',pieces:'3'},
 {id:PLAN82_ID,resolve:resolvePlan82Context,item:'plan82-subtract-01',context:plan82IntentContext,kind:'subtraction',whole:'1',pieces:'5'}];
const witnesses=specs.map(x=>{
 let s=createEpisode({episodeDefinition:getEpisodeDefinition(x.id,'1'),taskContext:x.resolve(x.item),...(x.condition?{activeCondition:x.condition}:{})});
 const send=(type,fields={})=>{s=applyIntent(s,{type,context:x.context(s),...fields});};
 send(`request-mixed-${x.kind}-help`,{helpKind:x.id===PLAN82_ID?'rename':'unit'});send(`edit-mixed-${x.kind}`,{field:'whole',raw:x.whole});send(`edit-mixed-${x.kind}`,{field:'pieces',raw:x.pieces});send(`check-mixed-${x.kind}`,{revision:s.draftRevision});
 assert.equal(s.status,'resolved');const envelope=createReplayEnvelope(s);assert.deepEqual(replayEpisode(envelope),s);
 return {itemId:x.item,envelope,expected:s};
});
writeFileSync(output,JSON.stringify({baseline:'cd4c60f086805eff6737e9cfa831c9c8337a71c9',witnesses},null,2)+'\n',{flag:'wx'});
