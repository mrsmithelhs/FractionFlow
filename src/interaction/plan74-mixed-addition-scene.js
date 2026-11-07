import { deepFreeze } from '../content/schema.js';
import { validatePlan74Context } from '../content/plan74-mixed-addition-task.js';
import { PLAN74_CONDITION, PLAN74_ID, plan74IntentContext } from './plan74-mixed-addition-episode.js';
import { parsePlan58Field } from './plan58-whole-plus-fraction-episode.js';
export function projectPlan74Addition(state) {
  const context=validatePlan74Context(state.taskContext), active=state.status==='active' && state.beat==='construct' && state.schedulePosition===0, resolved=state.status==='resolved' && state.beat==='resolve' && state.schedulePosition===1;
  if (state.episodeDefinition?.id!==PLAN74_ID || state.episodeDefinition.revision!=='1' || JSON.stringify(state.activeCondition)!==JSON.stringify(PLAN74_CONDITION) || !(active||resolved)) throw new TypeError('invalid addition scene state');
  const d=Number(context.operands[0].denominator), unit=({3:'thirds',4:'fourths',8:'eighths'})[d];
  const region=(field,max)=>parsePlan58Field(state.draft[field],max);
  const regions={whole:region('whole',4),pieces:region('pieces',16)};
  const pieceUnit=unit.slice(0,-1);
  const operands=context.operands.map(form => {
    const whole=Number(form.whole), count=Number(form.numerator);
    const singular=count===1 ? pieceUnit : unit;
    return { ...form, name:`${form.whole} and ${count} ${singular}`, description:`${whole} whole ${whole===1?'unit':'units'} and ${count} ${singular}`,
      rows:[...Array.from({length:whole},()=>Array.from({length:d},()=>true)),Array.from({length:d},(_,i)=>i<count)] };
  });
  // Limit the draft graphic to three rows; the complete count summary is always present.
  const rowCount=(regions.whole.value ?? 0)+(regions.pieces.value > 0 ? Math.ceil(regions.pieces.value / d) : 0);
  const draftRows=rowCount<=3 ? {
    whole:regions.whole.status==='valid' ? Array.from({length:regions.whole.value},()=>Array.from({length:d},()=>true)) : [],
    pieces:regions.pieces.status==='valid' && regions.pieces.value>0 ? [Array.from({length:Math.ceil(regions.pieces.value/d)},(_,row)=>Array.from({length:d},(_,i)=>row*d+i<regions.pieces.value))].flat() : [],
  } : null;
  const grouping=resolved?state.established.grouping:null;
  const notation=grouping?{whole:grouping.whole,remainder:grouping.remainder,hasWhole:true,hasRemainder:grouping.remainder.numerator !== '0',name:grouping.remainder.numerator === '0' ? grouping.whole : `${grouping.whole} and ${grouping.remainder.numerator} ${grouping.remainder.numerator === '1' ? unit.slice(0,-1) : unit}`} : null;
  return deepFreeze({context:plan74IntentContext(state),status:state.status,draftRevision:state.draftRevision,operands,unit,pieceUnit,pieceLimit:d,draftLimit:16,grouping: resolved ? { originalWholes: Number(context.operands[0].whole)+Number(context.operands[1].whole), sourcePieces: Number(context.operands[0].numerator)+Number(context.operands[1].numerator), firstPieces: Number(context.operands[0].numerator), secondGrouped: 8-Number(context.operands[0].numerator), remainder: Number(grouping.remainder.numerator), totalWholes: Number(grouping.whole) } : null,draft:structuredClone(state.draft),regions,draftRows,evaluation:structuredClone(state.evaluation),support:state.support,helpRequested:state.assistanceHistory.length>0,notation});
}
