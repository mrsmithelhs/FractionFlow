import { deepFreeze } from '../content/schema.js';
import { validatePlan82Context, admitPlan82Record } from '../content/plan82-mixed-subtraction-task.js';
import { PLAN82_CONDITION, PLAN82_ID, plan82IntentContext } from './plan82-mixed-subtraction-episode.js';

export function projectPlan82Subtraction(state) {
  const context=validatePlan82Context(state.taskContext);
  const active=state.status==='active' && state.beat==='construct' && state.schedulePosition===0;
  const resolved=state.status==='resolved' && state.beat==='resolve' && state.schedulePosition===1;
  if (state.episodeDefinition?.id!==PLAN82_ID || state.episodeDefinition.revision!=='1' || JSON.stringify(state.activeCondition)!==JSON.stringify(PLAN82_CONDITION) || !(active||resolved)) throw new TypeError('invalid subtraction scene state');
  const operands=context.operands.map(o=>{
    const whole=Number(o.whole), pieces=Number(o.numerator);
    return {...o,name:`${whole} and ${pieces} ${pieces===1?'eighth':'eighths'}`,description:`${whole} whole ${whole===1?'unit':'units'} and ${pieces} ${pieces===1?'eighth':'eighths'}`,
      rows:[...Array.from({length:whole},()=>Array(8).fill('filled')),Array.from({length:8},(_,i)=>i<pieces?'filled':'empty')]};
  });
  let renamed=null,settled=null;
  if (state.help.established || resolved) {
    const [a,b]=context.operands, exact=admitPlan82Record({itemId:context.itemId,itemRevision:context.itemRevision,operands:context.operands});
    renamed={whole:Number(exact.renamed.whole),original:Number(a.numerator),exchanged:8,total:Number(exact.renamed.fraction.numerator)};
    if(resolved) {
      const shortfall=Number(b.numerator)-Number(a.numerator), remaining=8-shortfall;
      settled={removedWhole:Number(b.whole),removedOriginal:Number(a.numerator),removedExchanged:shortfall,remainingWhole:Number(exact.result.whole),remainingPieces:remaining,
        wholeCells:Array.from({length:renamed.whole},(_,i)=>i<Number(b.whole)?'removed':'remaining'),
        exchangedCells:Array.from({length:8},(_,i)=>i<shortfall?'removed':'remaining'),
        originalCells:Array.from({length:8},(_,i)=>i<Number(a.numerator)?'removed':'empty'),
        notation:{whole:String(exact.result.whole),remainder:{numerator:String(exact.result.fraction.numerator),denominator:'8'},hasWhole:exact.result.whole!==0n,hasRemainder:true,name:exact.result.whole===0n?`${remaining} eighths`:`${exact.result.whole} and ${remaining} eighths`}};
    }
  }
  return deepFreeze({context:plan82IntentContext(state),status:state.status,draftRevision:state.draftRevision,operands,draft:structuredClone(state.draft),evaluation:structuredClone(state.evaluation),support:state.support,help:structuredClone(state.help),helpRequested:state.assistanceHistory.length>0,renamed,settled});
}
