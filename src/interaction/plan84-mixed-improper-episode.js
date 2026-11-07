import { deepFreeze } from '../content/schema.js';
import { admitPlan84Record, validatePlan84Context } from '../content/plan84-mixed-improper-task.js';
import { createSupportConfiguration, HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from './support.js';
import { validateActiveCondition } from './episode-definition.js';

export const PLAN84_ID = 'phase-5-mixed-to-improper-bridge';
export const PLAN84_CONDITION = deepFreeze({id:'plan84-static-bridge',revision:'1',display:'not-applicable',choreography:'not-applicable',promptCadence:'D-05-focused-key-beats',connectionMaking:'not-applicable'});
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const keys = (o,k) => o && typeof o === 'object' && !Array.isArray(o) && same(Object.keys(o).sort(),[...k].sort());
const fail = message => { throw new TypeError(`invalid bridge intent: ${message}`); };
const identity = c => ({setId:c.setId,setRevision:c.setRevision,itemId:c.itemId,itemRevision:c.itemRevision,definitionId:c.definitionId,definitionRevision:c.definitionRevision});
const record = c => ({itemId:c.itemId,itemRevision:c.itemRevision,mixed:c.mixed,options:c.options});
export const plan84IntentContext = state => deepFreeze(identity(state.taskContext));
export function createPlan84Episode({taskContext,support=HIGH_SUPPORT_CONFIGURATION,activeCondition=PLAN84_CONDITION,episodeDefinition}={}) {
  const context=validatePlan84Context(taskContext), profile=createSupportConfiguration(support);
  if (![HIGH_SUPPORT_CONFIGURATION,MEDIUM_SUPPORT_CONFIGURATION].some(s => same(profile,createSupportConfiguration(s))) || !same(validateActiveCondition(activeCondition),PLAN84_CONDITION)) fail('support or condition');
  return deepFreeze({schemaVersion:'fractionflow.episode-state/v1',status:'active',revision:0,draftRevision:0,episodeDefinition,taskContext:context,support:profile,activeCondition:PLAN84_CONDITION,
    beatSchedule:[{id:'compare',kind:'compare'},{id:'resolve',kind:'resolve'}],schedulePosition:0,beat:'compare',selection:null,evaluation:{status:'unchecked',draftRevision:null},established:{choice:null},
    intentHistory:[],assistanceHistory:[],retryHistory:[],responseProvenance:[],completedBeats:[],helpHistory:[],replayHistory:[],supportHistory:[]});
}
export function applyPlan84Intent(state,intent) {
  if (state?.schemaVersion !== 'fractionflow.episode-state/v1' || state.episodeDefinition?.id !== PLAN84_ID || state.episodeDefinition.revision !== '1' || state.status !== 'active' || state.beat !== 'compare') fail('state');
  const context=validatePlan84Context(state.taskContext), expected=identity(context), admitted=admitPlan84Record(record(context));
  if (!intent || !keys(intent.context,Object.keys(expected)) || !Object.keys(expected).every(k => intent.context[k] === expected[k])) fail('context');
  let next; const eventRevision=state.revision+1;
  if (intent.type === 'select-mixed-improper') {
    if (!keys(intent,['type','context','choice']) || !Number.isInteger(intent.choice) || intent.choice < 0 || intent.choice >= context.options.length) fail('choice');
    if (state.selection === intent.choice) return state;
    next={...state,selection:intent.choice,draftRevision:state.draftRevision+1,evaluation:{status:'unchecked',draftRevision:null}};
  } else if (intent.type === 'check-mixed-improper') {
    if (!keys(intent,['type','context','revision']) || intent.revision !== state.draftRevision) fail('stale check');
    const status=state.selection === null ? 'incomplete' : state.selection === admitted.correctIndex ? 'accepted' : 'incorrect';
    next={...state,evaluation:{status,draftRevision:state.draftRevision},
      ...(status === 'incorrect' ? {retryHistory:[...state.retryHistory,{eventRevision}]} : {}),
      ...(status === 'accepted' ? {status:'resolved',beat:'resolve',schedulePosition:1,established:{choice:state.selection},responseProvenance:[...state.responseProvenance,{action:structuredClone(intent),selection:state.selection,eventRevision}]} : {})};
  } else fail('unknown');
  return deepFreeze({...next,revision:eventRevision,intentHistory:[...state.intentHistory,structuredClone(intent)]});
}
