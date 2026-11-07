import { deepFreeze } from '../content/schema.js';
import { validatePlan78Context } from '../content/plan78-mixed-subtraction-task.js';
import { PLAN78_CONDITION, PLAN78_ID, plan78IntentContext } from './plan78-mixed-subtraction-episode.js';

export function projectPlan78Subtraction(state) {
  const context=validatePlan78Context(state.taskContext);
  const active=state.status==='active' && state.beat==='construct' && state.schedulePosition===0;
  const resolved=state.status==='resolved' && state.beat==='resolve' && state.schedulePosition===1;
  if (state.episodeDefinition?.id!==PLAN78_ID || state.episodeDefinition.revision!=='1' || JSON.stringify(state.activeCondition)!==JSON.stringify(PLAN78_CONDITION) || !(active||resolved)) throw new TypeError('invalid subtraction scene state');
  const operands=context.operands.map(o=>({...o,name:`${o.whole} and ${o.numerator} eighths`}));
  let settled=null;
  if (resolved) {
    const [a,b]=context.operands, d=state.established.difference;
    if (!d) throw new TypeError('missing difference');
    settled={wholeCells:Array.from({length:Number(a.whole)},(_,i)=>i<Number(b.whole)?'removed':'remaining'),pieceCells:Array.from({length:8},(_,i)=>i>=Number(a.numerator)?'empty':i<Number(b.numerator)?'removed':'remaining'),removedWhole:Number(b.whole),removedPieces:Number(b.numerator),remainingWhole:Number(d.whole),remainingPieces:Number(d.remainder.numerator),notation:{whole:d.whole,remainder:d.remainder,hasWhole:true,hasRemainder:d.remainder.numerator!=='0',name:d.remainder.numerator==='0'?d.whole:`${d.whole} and ${d.remainder.numerator} eighths`}};
  }
  return deepFreeze({context:plan78IntentContext(state),status:state.status,draftRevision:state.draftRevision,operands,draft:structuredClone(state.draft),evaluation:structuredClone(state.evaluation),support:state.support,helpRequested:state.assistanceHistory.length>0,settled});
}
