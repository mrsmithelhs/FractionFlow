import { deepFreeze } from '../content/schema.js';
import { admitPlan72Record, validatePlan72Context } from '../content/plan72-mixed-addition-task.js';
import { createFraction, createMixedNumber, equalMixedNumbers } from '../math/index.js';
import { createSupportConfiguration, HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from './support.js';
import { validateActiveCondition } from './episode-definition.js';
import { parsePlan58Field } from './plan58-whole-plus-fraction-episode.js';

export const PLAN72_CONDITION = deepFreeze({ id:'plan72-static-addition', revision:'1', display:'not-applicable', choreography:'not-applicable', promptCadence:'D-05-focused-key-beats', connectionMaking:'not-applicable' });
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const keys = (o,k) => o && typeof o === 'object' && !Array.isArray(o) && same(Object.keys(o).sort(), [...k].sort());
const fail = msg => { throw new TypeError(`invalid mixed addition intent: ${msg}`); };
const identity = c => ({setId:c.setId,setRevision:c.setRevision,itemId:c.itemId,itemRevision:c.itemRevision,definitionId:c.definitionId,definitionRevision:c.definitionRevision});
export const plan72IntentContext = state => deepFreeze(identity(state.taskContext));
export function createPlan72Episode({ taskContext, support = HIGH_SUPPORT_CONFIGURATION, activeCondition = PLAN72_CONDITION, episodeDefinition } = {}) {
  const context = validatePlan72Context(taskContext), profile = createSupportConfiguration(support);
  if (![HIGH_SUPPORT_CONFIGURATION,MEDIUM_SUPPORT_CONFIGURATION].some(s => same(profile,createSupportConfiguration(s))) || !same(validateActiveCondition(activeCondition), PLAN72_CONDITION)) fail('configuration');
  return deepFreeze({schemaVersion:'fractionflow.episode-state/v1',status:'active',revision:0,draftRevision:0,episodeDefinition,taskContext:context,support:profile,activeCondition:PLAN72_CONDITION,beatSchedule:[{id:'construct',kind:'construct'},{id:'resolve',kind:'resolve'}],schedulePosition:0,beat:'construct',draft:{whole:'',pieces:''},evaluation:{status:'unchecked',draftRevision:null,fields:null},established:{grouping:null},intentHistory:[],assistanceHistory:[],retryHistory:[],responseProvenance:[],completedBeats:[],helpHistory:[],replayHistory:[],supportHistory:[]});
}
export function applyPlan72Intent(state,intent) {
  if (state?.schemaVersion !== 'fractionflow.episode-state/v1' || state.episodeDefinition?.id !== PLAN72_ID || state.episodeDefinition.revision !== '1' || state.status !== 'active' || state.beat !== 'construct') fail('state');
  const context = validatePlan72Context(state.taskContext), id = identity(context);
  if (!intent || !keys(intent.context,Object.keys(id)) || !Object.keys(id).every(k => intent.context[k] === id[k])) fail('context');
  let next = state; const eventRevision = state.revision + 1;
  if (intent.type === 'edit-mixed-addition') {
    if (!keys(intent,['type','context','field','raw']) || !['whole','pieces'].includes(intent.field) || typeof intent.raw !== 'string' || intent.raw.length > 32) fail('edit');
    if (state.draft[intent.field] === intent.raw) return state;
    next = {...state,draft:{...state.draft,[intent.field]:intent.raw},draftRevision:state.draftRevision+1,evaluation:{status:'unchecked',draftRevision:null,fields:null}};
  } else if (intent.type === 'request-mixed-addition-help') {
    if (!keys(intent,['type','context','helpKind']) || intent.helpKind !== 'unit') fail('help');
    next = {...state,assistanceHistory:[...state.assistanceHistory,{kind:'unit-help',eventRevision}]};
  } else if (intent.type === 'check-mixed-addition') {
    if (!keys(intent,['type','context','revision']) || intent.revision !== state.draftRevision) fail('stale check');
    const d = Number(context.operands[0].denominator), fields = {whole:parsePlan58Field(state.draft.whole,4),pieces:parsePlan58Field(state.draft.pieces,d)};
    let status='input', grouping=null;
    if (fields.whole.status === 'valid' && fields.pieces.status === 'valid') {
      const { result } = admitPlan72Record({itemId:context.itemId,itemRevision:context.itemRevision,operands:context.operands});
      const candidate = createMixedNumber(fields.whole.value,createFraction(fields.pieces.value,d));
      status = equalMixedNumbers(candidate,result) ? 'accepted' : 'incorrect';
      if (status === 'accepted') grouping={whole:String(result.whole),remainder:{numerator:String(result.fraction.numerator),denominator:String(result.fraction.denominator)},exactValue:{numerator:String(result.whole * result.fraction.denominator + result.fraction.numerator),denominator:String(result.fraction.denominator)}};
    }
    next={...state,evaluation:{status,draftRevision:state.draftRevision,fields},...(status==='incorrect'?{retryHistory:[...state.retryHistory,{eventRevision}]}:{}),...(grouping?{status:'resolved',beat:'resolve',schedulePosition:1,established:{grouping},responseProvenance:[...state.responseProvenance,{action:structuredClone(intent),draft:structuredClone(state.draft),assistanceHistory:structuredClone(state.assistanceHistory),notation:'app-supplied',eventRevision}]}:{})};
  } else fail('unknown');
  return deepFreeze({...next,revision:eventRevision,intentHistory:[...state.intentHistory,structuredClone(intent)]});
}
export const PLAN72_ID = 'phase-4-mixed-number-addition-without-regrouping';
