import { deepFreeze } from '../content/schema.js';
import { admitPlan82Record, validatePlan82Context } from '../content/plan82-mixed-subtraction-task.js';
import { createFraction, createMixedNumber, equalMixedNumbers } from '../math/index.js';
import { createSupportConfiguration, HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from './support.js';
import { validateActiveCondition } from './episode-definition.js';
import { parsePlan58Field } from './plan58-whole-plus-fraction-episode.js';

export const PLAN82_ID='phase-5-mixed-number-subtraction-with-decomposition';
export const PLAN82_CONDITION=deepFreeze({id:'plan82-static-subtraction',revision:'1',display:'not-applicable',choreography:'not-applicable',promptCadence:'D-05-focused-key-beats',connectionMaking:'not-applicable'});
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const keys=(o,k)=>o && typeof o==='object' && !Array.isArray(o) && same(Object.keys(o).sort(),[...k].sort());
const fail=m=>{throw new TypeError(`invalid subtraction intent: ${m}`);};
const identity=c=>({setId:c.setId,setRevision:c.setRevision,itemId:c.itemId,itemRevision:c.itemRevision,definitionId:c.definitionId,definitionRevision:c.definitionRevision});
export const plan82IntentContext=state=>deepFreeze(identity(state.taskContext));
export function createPlan82Episode({taskContext,support=HIGH_SUPPORT_CONFIGURATION,activeCondition=PLAN82_CONDITION,episodeDefinition}={}) {
  const context=validatePlan82Context(taskContext),profile=createSupportConfiguration(support);
  if (!same(episodeDefinition?.id,PLAN82_ID) || episodeDefinition?.revision!=='1' || ![HIGH_SUPPORT_CONFIGURATION,MEDIUM_SUPPORT_CONFIGURATION].some(s=>same(profile,createSupportConfiguration(s))) || !same(validateActiveCondition(activeCondition),PLAN82_CONDITION)) fail('configuration');
  return deepFreeze({schemaVersion:'fractionflow.episode-state/v1',status:'active',revision:0,draftRevision:0,episodeDefinition,taskContext:context,support:profile,activeCondition:PLAN82_CONDITION,beatSchedule:[{id:'construct',kind:'construct'},{id:'resolve',kind:'resolve'}],schedulePosition:0,beat:'construct',draft:{whole:'',pieces:''},help:{draft:'',draftRevision:0,evaluation:{status:'unchecked'},established:false},evaluation:{status:'unchecked',draftRevision:null,fields:null},established:{difference:null},intentHistory:[],assistanceHistory:[],retryHistory:[],responseProvenance:[],completedBeats:[],helpHistory:[],replayHistory:[],supportHistory:[]});
}
export function applyPlan82Intent(state,intent) {
  if (state?.schemaVersion!=='fractionflow.episode-state/v1' || state.episodeDefinition?.id!==PLAN82_ID || state.episodeDefinition.revision!=='1' || state.status!=='active' || state.beat!=='construct') fail('state');
  const context=validatePlan82Context(state.taskContext),id=identity(context);
  if (!intent || !keys(intent.context,Object.keys(id)) || !Object.keys(id).every(k=>intent.context[k]===id[k])) fail('context');
  let next=state; const eventRevision=state.revision+1;
  if (intent.type==='edit-mixed-subtraction') {
    if (!keys(intent,['type','context','field','raw']) || !['whole','pieces'].includes(intent.field) || typeof intent.raw!=='string' || intent.raw.length>32) fail('edit');
    if (state.draft[intent.field]===intent.raw) return state;
    next={...state,draft:{...state.draft,[intent.field]:intent.raw},draftRevision:state.draftRevision+1,evaluation:{status:'unchecked',draftRevision:null,fields:null}};
  } else if (intent.type==='request-mixed-subtraction-help') {
    if (!keys(intent,['type','context','helpKind']) || intent.helpKind!=='rename') fail('help');
    next={...state,assistanceHistory:[...state.assistanceHistory,{kind:'rename-help',eventRevision}]};
  } else if (intent.type==='edit-rename') {
    if (!keys(intent,['type','context','raw']) || typeof intent.raw!=='string' || intent.raw.length>32 || state.help.established || !state.assistanceHistory.length) fail('help edit');
    if (state.help.draft===intent.raw) return state;
    next={...state,help:{...state.help,draft:intent.raw,draftRevision:state.help.draftRevision+1,evaluation:{status:'unchecked'}}};
  } else if (intent.type==='check-rename') {
    if (!keys(intent,['type','context','revision']) || intent.revision!==state.help.draftRevision || state.help.established || !state.assistanceHistory.length) fail('help check');
    const field=parsePlan58Field(state.help.draft,15);
    const {renamed}=admitPlan82Record({itemId:context.itemId,itemRevision:context.itemRevision,operands:context.operands});
    const status=field.status!=='valid'?'input':BigInt(field.value)===renamed.fraction.numerator?'accepted':'incorrect';
    next={...state,help:{...state.help,evaluation:{status,field},established:status==='accepted'}};
  } else if (intent.type==='check-mixed-subtraction') {
    if (!keys(intent,['type','context','revision']) || intent.revision!==state.draftRevision) fail('stale check');
    const fields={whole:parsePlan58Field(state.draft.whole,3),pieces:parsePlan58Field(state.draft.pieces,8)};
    let status='input',difference=null;
    if (fields.whole.status==='valid' && fields.pieces.status==='valid') {
      const {result}=admitPlan82Record({itemId:context.itemId,itemRevision:context.itemRevision,operands:context.operands});
      const candidate=createMixedNumber(fields.whole.value,createFraction(fields.pieces.value,8));
      status=!equalMixedNumbers(candidate,result)?'incorrect':fields.pieces.value===8?'organize':'accepted';
      if (status==='accepted') difference={whole:String(result.whole),remainder:{numerator:String(result.fraction.numerator),denominator:'8'}};
    }
    next={...state,evaluation:{status,draftRevision:state.draftRevision,fields},...(status==='incorrect'?{retryHistory:[...state.retryHistory,{eventRevision}]}:{}),...(difference?{status:'resolved',beat:'resolve',schedulePosition:1,established:{difference},responseProvenance:[...state.responseProvenance,{action:structuredClone(intent),draft:structuredClone(state.draft),assistanceHistory:structuredClone(state.assistanceHistory),notation:'app-supplied',eventRevision}]}:{})};
  } else fail('unknown');
  return deepFreeze({...next,revision:eventRevision,intentHistory:[...state.intentHistory,structuredClone(intent)]});
}
