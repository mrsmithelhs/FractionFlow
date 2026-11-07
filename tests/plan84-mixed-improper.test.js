import { describe, it, expect } from 'vitest';
import { PLAN84_DATA, PLAN84_SET_V1 } from '../src/content/data/plan84-mixed-improper-records.js';
import { validatePlan84Record, validatePlan84Membership, validatePlan84InitialCoverage, admitPlan84Record, resolvePlan84Context } from '../src/content/plan84-mixed-improper-task.js';
import { getEpisodeDefinition } from '../src/interaction/episode-definition.js';
import { createEpisode, applyIntent } from '../src/interaction/episode.js';
import { plan84IntentContext } from '../src/interaction/plan84-mixed-improper-episode.js';
import { projectPlan84Bridge } from '../src/interaction/plan84-mixed-improper-scene.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';
const start=id=>createEpisode({episodeDefinition:getEpisodeDefinition('phase-5-mixed-to-improper-bridge','1'),taskContext:resolvePlan84Context(id)});
const send=(s,type,extra={})=>applyIntent(s,{type,context:plan84IntentContext(s),...extra});
const check=s=>send(s,'check-mixed-improper',{revision:s.draftRevision});
const replay=s=>expect(replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(s))))).toEqual(s);
describe('Plan 84 bridge',()=>{
  it('validates generic eligibility independently from membership and initial coverage',()=>{
    expect(PLAN84_DATA.map(r=>validatePlan84Record(r).correctIndex)).toEqual([2,0,1,3]);
    validatePlan84Membership(PLAN84_DATA,PLAN84_SET_V1);validatePlan84InitialCoverage(PLAN84_DATA);
    const future={itemId:'future',itemRevision:'1',mixed:['1','3','8'],options:[['8','8'],['11','8'],['12','8'],['16','8']]};
    expect(validatePlan84Record(future).correctIndex).toBe(1);
    validatePlan84Membership([...PLAN84_DATA,future],{...PLAN84_SET_V1,setRevision:'2',items:[...PLAN84_SET_V1.items,{itemId:'future',itemRevision:'1'}]});
    expect(()=>admitPlan84Record(future)).toThrow();
    for(const change of [r=>r.options[0]=r.options[2],r=>r.options[0]=['3','4'],r=>r.mixed[1]='0',r=>r.options[0]=['99','2']]) {const r=structuredClone(PLAN84_DATA[0]);change(r);expect(()=>validatePlan84Record(r)).toThrow();}
    expect(()=>validatePlan84Membership(PLAN84_DATA,{...PLAN84_SET_V1,items:[...PLAN84_SET_V1.items,PLAN84_SET_V1.items[0]]})).toThrow();
    expect(()=>validatePlan84InitialCoverage([PLAN84_DATA[0],PLAN84_DATA[0],PLAN84_DATA[1],PLAN84_DATA[2]])).toThrow();
  });
  it('withholds the point through wrong check and replays each state',()=>{
    for(const r of PLAN84_DATA) {
      let s=start(r.itemId);expect(projectPlan84Bridge(s).verification).toBeUndefined();replay(s);
      s=check(s);expect(s.evaluation.status).toBe('incomplete');
      const correct=validatePlan84Record(r).correctIndex;s=send(s,'select-mixed-improper',{choice:(correct+1)%4});s=check(s);
      expect(s.evaluation.status).toBe('incorrect');expect(projectPlan84Bridge(s).verification).toBeUndefined();replay(s);
      const old=s.draftRevision;s=send(s,'select-mixed-improper',{choice:correct});expect(s.evaluation.status).toBe('unchecked');
      expect(()=>send(s,'check-mixed-improper',{revision:old})).toThrow();s=check(s);
      const v=projectPlan84Bridge(s).verification;expect(v.fraction).toEqual(r.options[correct]);expect(v.index).toBe(Number(r.mixed[2])+Number(r.mixed[1]));replay(s);
      const altered=JSON.parse(JSON.stringify(createReplayEnvelope(s)));altered.taskContext.options[0][0]='99';expect(()=>replayEpisode(altered)).toThrow();
    }
  });
});
