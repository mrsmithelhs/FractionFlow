import { deepFreeze } from '../content/schema.js';
import { admitPlan84Record, validatePlan84Context } from '../content/plan84-mixed-improper-task.js';
import { PLAN84_ID, PLAN84_CONDITION, plan84IntentContext } from './plan84-mixed-improper-episode.js';

export function projectPlan84Bridge(state) {
  const c=validatePlan84Context(state.taskContext), active=state.status==='active' && state.beat==='compare' && state.schedulePosition===0, resolved=state.status==='resolved' && state.beat==='resolve' && state.schedulePosition===1;
  if (state.episodeDefinition?.id!==PLAN84_ID || state.episodeDefinition.revision!=='1' || JSON.stringify(state.activeCondition)!==JSON.stringify(PLAN84_CONDITION) || !(active || resolved)) throw new TypeError('invalid bridge scene state');
  const [whole,numerator,denominator]=c.mixed;
  const result={context:plan84IntentContext(state),status:state.status,draftRevision:state.draftRevision,mixed:{whole,numerator,denominator},options:structuredClone(c.options),selection:state.selection,evaluation:structuredClone(state.evaluation),support:state.support};
  if (resolved) {
    const {correctIndex}=admitPlan84Record({itemId:c.itemId,itemRevision:c.itemRevision,mixed:c.mixed,options:c.options});
    if (state.established.choice!==correctIndex) throw new TypeError('invalid accepted bridge');
    const d=Number(denominator), n=Number(numerator), index=d+n, subdivisions=2*d;
    const unit=d===2?'halves':d===4?'fourths':'eighths';
    const remainderUnit=n===1 ? (d===2?'half':d===4?'fourth':'eighth') : unit;
    result.verification={fraction:structuredClone(c.options[correctIndex]),index,subdivisions,
      markerPercent:index/subdivisions*100,
      ticks:Array.from({length:subdivisions+1},(_,i)=>({percent:i/subdivisions*100,benchmark:i%d===0?String(i/d):null})),
      explanation:`One whole is ${d} ${unit}; ${d} ${unit} and ${n} ${remainderUnit} make ${c.options[correctIndex][0]} ${unit}. Both names mark the same amount.`};
  }
  return deepFreeze(result);
}
