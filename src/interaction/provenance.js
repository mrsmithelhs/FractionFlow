import { deepFreeze } from '../content/schema.js';

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
  const record = {
    schemaVersion: 'fractionflow.response-provenance/v1',
    responseIndex: state.responseProvenance.length,
    contentIdentity: contentIdentity(state.content),
    episodeDefinition: {
      id: state.episodeDefinition.id,
      revision: state.episodeDefinition.revision,
    },
    activeCondition: state.activeCondition,
    support: state.support,
    beat: state.beat,
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
      established: nextState.established,
      revision: nextState.revision,
    },
  };
  return deepFreeze(record);
}

export function makeContentIdentity(content) {
  return deepFreeze(contentIdentity(content));
}
