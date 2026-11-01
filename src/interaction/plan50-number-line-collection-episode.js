import { deepFreeze } from '../content/schema.js';
import { admitPlan50Record, validatePlan50Context } from '../content/plan50-number-line-collection-task.js';
import { createSupportConfiguration, HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from './support.js';
import { validateActiveCondition } from './episode-definition.js';

export const PLAN50_CONDITION = deepFreeze({ id:'plan50-static-collection', revision:'1', display:'not-applicable', choreography:'not-applicable', promptCadence:'D-05-focused-key-beats', connectionMaking:'not-applicable' });
const keys = (v,k) => v && typeof v === 'object' && !Array.isArray(v) && JSON.stringify(Object.keys(v).sort()) === JSON.stringify([...k].sort());
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const fail = message => { throw new TypeError(`invalid collection intent: ${message}`); };
const identity = c => ({ setId:c.setId, setRevision:c.setRevision, itemId:c.itemId, itemRevision:c.itemRevision, definitionId:c.definitionId, definitionRevision:c.definitionRevision });
export function createPlan50Episode({taskContext, support = HIGH_SUPPORT_CONFIGURATION, activeCondition = PLAN50_CONDITION, episodeDefinition} = {}) {
  const context = validatePlan50Context(taskContext);
  const profile = createSupportConfiguration(support);
  if (![HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION].some(x => same(profile,createSupportConfiguration(x)))) fail('unsupported support');
  const condition = validateActiveCondition(activeCondition);
  if (!same(condition,PLAN50_CONDITION)) fail('unsupported condition');
  const placements = Object.fromEntries(context.members.map(m => [m.id,null]));
  return deepFreeze({ schemaVersion:'fractionflow.episode-state/v1', status:'active', revision:0, placementRevision:0, episodeDefinition, taskContext:context, support:profile, activeCondition:condition, beatSchedule:[{id:'place-collection',kind:'place-collection'},{id:'resolve',kind:'resolve'}], schedulePosition:0, beat:'place-collection', selectedMemberId:null, placements, evaluation:{status:'unchecked', placementRevision:null, feedbackByMember:{}}, established:{collection:null}, intentHistory:[], assistanceHistory:[], completedBeats:[], helpHistory:[], replayHistory:[], retryHistory:[], supportHistory:[], responseProvenance:[] });
}
export function applyPlan50Intent(state, intent) {
  if (state?.schemaVersion !== 'fractionflow.episode-state/v1' || state.episodeDefinition?.id !== 'phase-4-number-line-collection' || state.episodeDefinition?.revision !== '1') fail('state identity');
  const c = validatePlan50Context(state.taskContext);
  if (state.status !== 'active' || state.beat !== 'place-collection') fail('phase');
  if (!intent || !keys(intent.context, Object.keys(identity(c))) || !Object.keys(identity(c)).every(k => intent.context[k] === identity(c)[k])) fail('context');
  const admitted = admitPlan50Record({itemId:c.itemId,itemRevision:c.itemRevision,purpose:c.purpose,lattice:c.lattice,members:c.members});
  const member = x => c.members.some(m => m.id === x);
  let next = state;
  if (intent.type === 'select-collection-member') {
    if (!keys(intent,['type','context','memberId']) || !member(intent.memberId)) fail('member');
    if (state.selectedMemberId === intent.memberId) return state;
    next = {...state,selectedMemberId:intent.memberId};
  } else if (intent.type === 'place-collection-member') {
    if (!keys(intent,['type','context','memberId','candidateId']) || !member(intent.memberId) || state.selectedMemberId !== intent.memberId || !admitted.candidates.some(p => p.id === intent.candidateId)) fail('placement');
    if (state.placements[intent.memberId] === intent.candidateId) return state;
    const feedback = {...state.evaluation.feedbackByMember}; delete feedback[intent.memberId];
    next = {...state,placementRevision:state.placementRevision+1,placements:{...state.placements,[intent.memberId]:intent.candidateId},evaluation:{status:'unchecked',placementRevision:state.evaluation.placementRevision,feedbackByMember:feedback}};
  } else if (intent.type === 'request-collection-help') {
    if (!keys(intent,['type','context','helpKind']) || intent.helpKind !== 'placement') fail('help');
    next = {...state,assistanceHistory:[...state.assistanceHistory,{type:'collection-help',helpKind:'placement',eventRevision:state.revision+1}]};
  } else if (intent.type === 'check-collection') {
    if (!keys(intent,['type','context','revision']) || intent.revision !== state.placementRevision) fail('stale check');
    const unplaced = c.members.filter(m => state.placements[m.id] === null);
    const feedback = Object.fromEntries(c.members.map(m => [m.id,unplaced.length ? (state.placements[m.id] === null ? 'unplaced' : 'not-graded') : (state.placements[m.id] === admitted.correctPositions[m.id] ? 'correct' : 'check-placement')]));
    const status = unplaced.length ? 'incomplete' : Object.values(feedback).every(v => v === 'correct') ? 'accepted' : 'incorrect';
    const evaluation = {status,placementRevision:state.placementRevision,feedbackByMember:feedback};
    next = {...state,evaluation, ...(status === 'accepted' ? {status:'resolved',beat:'resolve',schedulePosition:1,established:{collection:{...state.placements}},responseProvenance:[...state.responseProvenance,{episodeDefinition:{id:c.definitionId,revision:c.definitionRevision},taskContext:c,action:structuredClone(intent),evaluatedPlacements:{...state.placements},evaluation,assistanceHistory:state.assistanceHistory}]} : {})};
  } else fail('unknown intent');
  return deepFreeze({...next,revision:state.revision+1,intentHistory:[...state.intentHistory,structuredClone(intent)]});
}
export const plan50IntentContext = state => deepFreeze(identity(state.taskContext));
