import { deepFreeze } from '../content/schema.js';
import { currentScheduleEntry } from './beat-schedule.js';

function contentIdentity(content) {
  return {
    schemaVersion: content.schemaVersion,
    id: content.id,
    source: content.source,
    request: content.request,
    provenance: content.provenance,
    selector: content.request.selector,
    overlays: content.request.overlays,
    sourceForms: {
      left: content.operands.left.initialForm,
      right: content.operands.right.initialForm,
    },
  };
}

function visibleFields(state) {
  if (state.episodeDefinition?.id === 'phase-3-reusable-addition-recipes'
    && state.episodeDefinition?.revision === '1') {
    if (state.beat === 'transform') return {
      representationRole: 'fraction-bar',
      visible: state.taskContext.patternId === 'full-addition.inspect-keep-repair'
        ? ['source-forms', 'authored-candidate', 'target-context']
        : ['source-forms', 'target-context'],
      supplied: [], hidden: ['correct-conversion', 'other-candidate-validity', 'operation-result'],
    };
    if (state.beat === 'operate') return {
      representationRole: 'symbolic', visible: ['accepted-conversions', 'validated-original-operand', 'operation', 'target-context'],
      supplied: [], hidden: ['unsubmitted-operation-result'],
    };
    if (state.beat === 'resolve') return { representationRole: 'symbolic', visible: ['operation-result', 'finish-navigation'], supplied: [], hidden: [] };
    return { representationRole: 'fraction-bar', visible: ['source-forms', 'target-context'], supplied: [], hidden: ['required-renaming-side', 'correct-conversion', 'operation-result'] };
  }
  if (state.episodeDefinition?.id === 'phase-3-nested-renaming-addition'
    && state.episodeDefinition?.revision === '1') {
    if (state.beat === 'transform') return { representationRole: 'fraction-bar', visible: ['source-forms', 'selected-renaming-side', 'target-context'], supplied: [], hidden: ['correct-conversion', 'operation-result'] };
    if (state.beat === 'operate') return { representationRole: 'symbolic', visible: ['constructed-conversion', 'validated-original-operand', 'operation', 'target-context'], supplied: [], hidden: ['unsubmitted-operation-result'] };
    if (state.beat === 'resolve') return { representationRole: 'symbolic', visible: ['operation-result', 'finish-navigation'], supplied: [], hidden: [] };
    return { representationRole: 'fraction-bar', visible: ['source-forms', 'target-context'], supplied: [], hidden: ['required-renaming-side', 'correct-conversion', 'operation-result'] };
  }
  if (state.episodeDefinition?.id === 'phase-3-reusable-full-addition'
    && state.episodeDefinition?.revision === '1') {
    if (state.beat === 'transform') {
      return {
        representationRole: 'fraction-bar',
        visible: state.taskContext.patternId === 'full-addition.inspect-keep-repair'
          ? ['source-forms', 'authored-candidate', 'target-context']
          : ['source-forms', 'target-context'],
        supplied: [],
        hidden: ['correct-conversion', 'other-candidate-validity', 'operation-result'],
      };
    }
    if (state.beat === 'operate') return {
      representationRole: 'symbolic', visible: ['accepted-conversions', 'operation', 'target-context'],
      supplied: [], hidden: ['unsubmitted-operation-result'],
    };
    if (state.beat === 'resolve') return {
      representationRole: 'symbolic', visible: ['operation-result', 'finish-navigation'],
      supplied: [], hidden: [],
    };
    return {
      representationRole: 'fraction-bar', visible: ['source-forms', 'target-context'],
      supplied: [], hidden: ['candidate-validity', 'correct-conversion', 'operation-result'],
    };
  }
  const isPlan20 = state.episodeDefinition?.id === 'phase-3-like-denominator-addition'
    && state.episodeDefinition?.revision === '1';
  if (isPlan20 && state.beat === 'operate') {
    return {
      representationRole: state.established.route === 'symbolic-continuation'
        ? 'symbolic'
        : 'fraction-bar',
      visible: ['source-forms', 'already-shared-unit', 'operation'],
      supplied: state.nextResponseSupport === 'demonstrate' ? ['reviewed-demonstration'] : [],
      hidden: ['learner-operation-result'],
    };
  }
  const fields = {
    encounter: ['source-forms', 'stable-whole', 'operation'],
    notice: ['source-forms', 'operand-denominators', 'unit-relationship'],
    decide: ['source-forms', 'operand-denominators'],
    transform: ['source-forms', 'selected-common-denominator'],
    operate: ['converted-forms', 'selected-common-denominator', 'operation'],
    resolve: ['operation-result'],
    reflect: ['validated-transition', 'result-state'],
  };
  const hidden = {
    encounter: ['future-common-denominator', 'converted-forms', 'operation-result'],
    notice: ['future-common-denominator', 'converted-forms', 'operation-result'],
    decide: ['converted-forms', 'operation-result'],
    transform: ['unsubmitted-conversion', 'operation-result'],
    operate: ['unsubmitted-operation-result'],
    resolve: ['preferred-final-form', 'unsubmitted-resolution'],
    reflect: [],
  };
  return {
    representationRole: state.established.route === 'symbolic-continuation'
      ? 'symbolic'
      : 'fraction-bar',
    visible: fields[state.beat] ?? [],
    supplied: state.nextResponseSupport === 'demonstrate' ? ['reviewed-demonstration'] : [],
    hidden: hidden[state.beat] ?? [],
  };
}

function evidenceCategory(state) {
  if (state.nextResponseSupport === 'demonstrate') return 'supported-construction';
  if (state.supportHistory.some((entry) => entry.type === 'task-help-request')) return 'supported-construction';
  if (state.expectedResponse?.evidenceCategory === 'prediction') return 'prediction';
  if (
    state.support.label === 'independent'
    && state.helpHistory.length === 0
    && state.replayHistory.length === 0
    && state.retryHistory.length === 0
    && state.expectedResponse?.evidenceCategory === 'independent-transfer'
  ) {
    return 'independent-transfer';
  }
  return 'supported-construction';
}

export function createResponseProvenance({ state, intent, classification, nextState }) {
  const supportActions = state.supportHistory.map((entry) => entry.type);
  const scheduleEntry = currentScheduleEntry(state);
  const record = {
    schemaVersion: 'fractionflow.response-provenance/v1',
    responseIndex: state.responseProvenance.length,
    contentIdentity: contentIdentity(state.content),
    episodeDefinition: {
      id: state.episodeDefinition.id,
      revision: state.episodeDefinition.revision,
    },
    ...(state.taskContext ? { taskContext: state.taskContext } : {}),
    activeCondition: state.activeCondition,
    support: state.support,
    beat: state.beat,
    schedulePosition: state.schedulePosition,
    scheduleEntryId: scheduleEntry?.id ?? null,
    expectedResponse: state.expectedResponse,
    visibility: visibleFields(state),
    prompt: {
      promptId: state.expectedResponse.promptId,
      promptDensity: state.activeCondition.promptCadence,
      predictionOpportunity: state.expectedResponse.evidenceCategory === 'prediction',
      connectionMakingDemand: state.activeCondition.connectionMaking,
    },
    helpHistory: state.helpHistory,
    replayHistory: state.replayHistory,
    retryHistory: state.retryHistory,
    supportActions,
    learnerAction: intent,
    classification,
    evidenceCategory: evidenceCategory(state),
    resultingState: {
      status: nextState.status,
      beat: nextState.beat,
      schedulePosition: nextState.schedulePosition,
      scheduleEntryId: currentScheduleEntry(nextState)?.id ?? scheduleEntry?.id ?? null,
      established: nextState.established,
      revision: nextState.revision,
    },
  };
  return deepFreeze(record);
}

export function makeContentIdentity(content) {
  return deepFreeze(contentIdentity(content));
}
