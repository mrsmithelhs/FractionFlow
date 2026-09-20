import { deepFreeze } from '../content/schema.js';
import { candidateDenominatorsForInstance } from '../content/eligibility.js';
import { reflectionChoicesForInstance } from '../content/data/reflection-choices.js';
import { makeContentIdentity } from './provenance.js';
import { validateActiveCondition } from './episode-definition.js';

export const SCENE_SCHEMA_VERSION = 'fractionflow.scene/v1';
export const EPISODE_STATE_SCHEMA_VERSION = 'fractionflow.episode-state/v1';

export const REPRESENTATION_ROLES = Object.freeze([
  'fraction-bar',
  'symbolic',
  'number-line',
]);

export const PRESENTATION_MODES = Object.freeze([
  'standard-motion',
  'reduced-motion',
  'instant-test',
]);

const REPRESENTATION_VERDICT_KEYS = Object.freeze({
  'fraction-bar': 'fractionBar',
  symbolic: 'symbolic',
  'number-line': 'numberLine',
});

const VALID_VERDICTS = Object.freeze([
  'eligible',
  'ineligible',
  'not-in-phase-2',
]);

const SCENE_HISTORY_KEYS = Object.freeze([
  'intentHistory',
  'completedBeats',
  'helpHistory',
  'replayHistory',
  'retryHistory',
  'responseProvenance',
]);

export class SceneProjectionError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'SceneProjectionError';
    this.code = code;
    this.details = details;
  }
}

function isPlainRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function wireError(path, message) {
  throw new SceneProjectionError(
    'INVALID_SCENE_INPUT',
    `${path} is not canonical JSON-wire data: ${message}`,
  );
}

function canonicalWireCopy(value, path = 'value', seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || Object.is(value, -0)) {
      wireError(path, 'numbers must be finite and must not be negative zero');
    }
    return value;
  }
  if (typeof value === 'undefined' || typeof value === 'function'
    || typeof value === 'symbol' || typeof value === 'bigint') {
    wireError(path, `unsupported ${typeof value}`);
  }
  if (typeof value !== 'object') wireError(path, `unsupported ${typeof value}`);
  if (seen.has(value)) wireError(path, 'circular values are not allowed');
  seen.add(value);

  let copy;
  if (Array.isArray(value)) {
    const lengthDescriptor = Object.getOwnPropertyDescriptor(value, 'length');
    if (!lengthDescriptor || !Object.prototype.hasOwnProperty.call(lengthDescriptor, 'value')) {
      wireError(path, 'array length must be a data property');
    }
    const arrayLength = lengthDescriptor.value;
    for (const key of Reflect.ownKeys(value)) {
      if (key === 'length') continue;
      if (typeof key !== 'string' || !/^(0|[1-9]\d*)$/.test(key)
        || Number(key) >= arrayLength || Number(key) >= 2 ** 32 - 1) {
        wireError(path, 'arrays must contain only dense JSON index keys');
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !descriptor.enumerable
        || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
        wireError(`${path}[${key}]`, 'array entries must be enumerable data properties');
      }
    }
    copy = [];
    for (let index = 0; index < arrayLength; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) {
        wireError(`${path}[${index}]`, 'sparse arrays are not canonical JSON-wire data');
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      copy[index] = canonicalWireCopy(descriptor.value, `${path}[${index}]`, seen);
    }
  } else {
    if (!isPlainRecord(value) || Object.prototype.hasOwnProperty.call(value, 'toJSON')) {
      wireError(path, 'only plain records and arrays are allowed');
    }
    copy = Object.create(null);
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') {
        wireError(path, 'records must not contain symbol keys');
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !descriptor.enumerable
        || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
        wireError(`${path}.${key}`, 'record entries must be enumerable data properties');
      }
    }
    for (const key of Object.keys(value).sort()) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      copy[key] = canonicalWireCopy(descriptor.value, `${path}.${key}`, seen);
    }
  }
  seen.delete(value);
  return copy;
}

function canonicalWireSerialize(value, path = 'value') {
  const copy = canonicalWireCopy(value, path);
  return serializeCanonicalValue(copy);
}

function canonicalSceneResult(value) {
  try {
    const copy = canonicalWireCopy(value, 'scene result');
    return {
      copy,
      serialized: serializeCanonicalValue(copy),
    };
  } catch (error) {
    if (error instanceof SceneProjectionError && error.code === 'INVALID_SCENE_INPUT') {
      throw new SceneProjectionError('INVALID_SCENE_RESULT', error.message);
    }
    throw error;
  }
}

function serializeCanonicalValue(value) {
  if (value === null) return 'null';
  if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((child) => serializeCanonicalValue(child)).join(',')}]`;
  }
  return `{${Object.keys(value).sort().map((key) => (
    `${JSON.stringify(key)}:${serializeCanonicalValue(value[key])}`
  )).join(',')}}`;
}

function copyAndFreeze(value, path) {
  return deepFreeze(canonicalWireCopy(value, path));
}

function assertStateShape(state) {
  if (!isPlainRecord(state) || state.schemaVersion !== EPISODE_STATE_SCHEMA_VERSION) {
    throw new SceneProjectionError(
      'INVALID_SCENE_INPUT',
      'state must be a Plan 05 episode state',
    );
  }

  // Validate the complete input boundary, but deliberately discard this copy. The scene
  // must not carry instructional-history arrays even though the source state does.
  canonicalWireCopy(state, 'state');
  for (const key of SCENE_HISTORY_KEYS) {
    if (!Array.isArray(state[key])) {
      throw new SceneProjectionError('INVALID_SCENE_INPUT', `state.${key} must be an array`);
    }
  }
  if (!state.content || typeof state.content !== 'object') {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', 'state.content is required');
  }
  if (!state.episodeDefinition || typeof state.episodeDefinition !== 'object') {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', 'state.episodeDefinition is required');
  }
  if (!state.activeCondition || typeof state.activeCondition !== 'object') {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', 'state.activeCondition is required');
  }
  try {
    validateActiveCondition(state.activeCondition);
  } catch (error) {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', `active condition is invalid: ${error.message}`);
  }
}

function assertProjectionOptions({ representationRole, presentationMode }) {
  if (!REPRESENTATION_ROLES.includes(representationRole)) {
    throw new SceneProjectionError(
      'INVALID_SCENE_INPUT',
      `unsupported representation role: ${String(representationRole)}`,
    );
  }
  if (!PRESENTATION_MODES.includes(presentationMode)) {
    throw new SceneProjectionError(
      'INVALID_SCENE_INPUT',
      `unsupported presentation mode: ${String(presentationMode)}`,
    );
  }
}

function contentIdentity(state) {
  try {
    return copyAndFreeze(makeContentIdentity(state.content), 'content identity');
  } catch (error) {
    if (error instanceof SceneProjectionError) throw error;
    throw new SceneProjectionError('INVALID_SCENE_INPUT', `content identity is invalid: ${error.message}`);
  }
}

function currentSupportConsequence(state) {
  const lastHelp = state.helpHistory.at(-1) ?? null;
  return {
    nextResponseSupport: state.nextResponseSupport ?? null,
    lastHelp: lastHelp
      ? {
        type: lastHelp.type,
        level: lastHelp.level,
        beat: lastHelp.beat,
      }
      : null,
  };
}

function instructionalSourceContext(state) {
  return {
    schemaVersion: state.schemaVersion,
    revision: state.revision,
    status: state.status,
    beat: state.beat,
    episodeDefinition: {
      id: state.episodeDefinition.id,
      revision: state.episodeDefinition.revision,
    },
    activeCondition: state.activeCondition,
    support: state.support,
    expectedResponse: state.expectedResponse,
    established: state.established,
    supportConsequence: currentSupportConsequence(state),
    pendingResponse: state.pendingResponse,
    lastRecovery: state.lastRecovery,
  };
}

function contentProjectionSource(state) {
  const facts = state.content.representationFacts;
  const resultEstablished = Boolean(
    state.established?.operation || state.established?.resolution,
  );
  return {
    operands: {
      left: {
        exactValue: state.content.operands.left.exactValue,
        initialForm: state.content.operands.left.initialForm,
        currentForm: state.content.operands.left.currentForm,
      },
      right: {
        exactValue: state.content.operands.right.exactValue,
        initialForm: state.content.operands.right.initialForm,
        currentForm: state.content.operands.right.currentForm,
      },
    },
    eligibility: facts.eligibility,
    alternateRepresentationRecommendation: facts.alternateRepresentationRecommendation,
    wholeSpan: resultEstablished ? facts.wholeSpan : null,
  };
}

function sourceContext({ state, representationRole, presentationMode }) {
  return {
    contentIdentity: contentIdentity(state),
    contentProjection: contentProjectionSource(state),
    instructional: instructionalSourceContext(state),
    representationRole,
    presentationMode,
  };
}

function derivationContext(input) {
  const context = copyAndFreeze(
    sourceContext(input),
    'scene derivation source context',
  );
  return {
    sourceContext: context,
    key: canonicalWireSerialize(context, 'scene derivation source context'),
  };
}

function capabilityRefusal({
  state,
  role,
  verdict,
  reason,
  path = null,
  continuation = null,
  derivation,
}) {
  const refusal = {
    schemaVersion: SCENE_SCHEMA_VERSION,
    kind: 'capability-refusal',
    representationRole: role,
    status: reason === 'not-in-phase-2'
      ? 'not-in-phase-2'
      : 'valid-but-outside-representation-capability',
    verdict,
    path,
    continuation,
    sourceContext: derivation.sourceContext,
    derivationKey: derivation.key,
    contentId: state.content.id,
  };
  return deepFreeze(copyAndFreeze(refusal, 'scene capability refusal'));
}

function validVerdict(value, name) {
  if (!VALID_VERDICTS.includes(value)) {
    throw new SceneProjectionError(
      'UNRESOLVED_CAPABILITY',
      `${name} must be an explicit Plan 05 capability verdict`,
    );
  }
  return value;
}

function pathSummary(state) {
  const path = state.established?.commonDenominator;
  if (!path) return null;
  if (typeof path !== 'object' || path.rendering === undefined) {
    throw new SceneProjectionError(
      'UNRESOLVED_CAPABILITY',
      'established common-denominator path has no rendering verdict',
    );
  }
  const rendering = validVerdict(path.rendering, 'established path rendering');
  if (rendering === 'not-in-phase-2') {
    throw new SceneProjectionError(
      'INCONSISTENT_CAPABILITY',
      'a selected common-denominator path cannot be not-in-phase-2',
    );
  }
  return {
    kind: path.kind ?? null,
    validity: path.validity ?? null,
    targetDenominator: path.targetDenominator ?? null,
    rendering,
    authoredCoverage: path.authoredCoverage ?? null,
    continuation: path.continuation ?? null,
    reasons: path.reasons ?? [],
  };
}

function capabilityFor(state, role, derivation) {
  const key = REPRESENTATION_VERDICT_KEYS[role];
  const eligibility = state.content?.representationFacts?.eligibility;
  if (!eligibility || typeof eligibility !== 'object') {
    throw new SceneProjectionError(
      'UNRESOLVED_CAPABILITY',
      'content representation eligibility is missing',
    );
  }
  const instanceVerdict = validVerdict(eligibility[key], `content eligibility.${key}`);
  const path = pathSummary(state);

  if (role === 'number-line') {
    if (instanceVerdict !== 'not-in-phase-2') {
      throw new SceneProjectionError(
        'INCONSISTENT_CAPABILITY',
        'number-line capability must be explicitly not-in-phase-2 in Plan 05',
      );
    }
    return capabilityRefusal({
      state,
      role,
      verdict: instanceVerdict,
      reason: 'not-in-phase-2',
      path,
      derivation,
    });
  }

  if (role === 'fraction-bar' && path?.rendering === 'ineligible') {
    const continuation = path.continuation === 'symbolic'
      ? { representationRole: 'symbolic', route: 'symbolic-continuation' }
      : null;
    return capabilityRefusal({
      state,
      role,
      verdict: path.rendering,
      reason: 'valid-but-outside-representation-capability',
      path,
      continuation,
      derivation,
    });
  }

  if (instanceVerdict === 'ineligible') {
    const continuation = state.content.representationFacts.alternateRepresentationRecommendation
      === 'symbolic-continuation'
      ? { representationRole: 'symbolic', route: 'symbolic-continuation' }
      : null;
    return capabilityRefusal({
      state,
      role,
      verdict: instanceVerdict,
      reason: 'valid-but-outside-representation-capability',
      path,
      continuation,
      derivation,
    });
  }

  if (instanceVerdict !== 'eligible') {
    throw new SceneProjectionError(
      'INCONSISTENT_CAPABILITY',
      `${role} cannot use the ${instanceVerdict} instance verdict`,
    );
  }

  return {
    instance: instanceVerdict,
    activePath: path,
    authoredCoverage: path?.authoredCoverage ?? null,
    continuation: path?.continuation ?? null,
  };
}

function wireFormFor(state, side) {
  const established = state.established?.conversions?.[side];
  return established ?? state.content.operands[side].currentForm;
}

function quantityScene(state, side) {
  const operand = state.content.operands[side];
  const currentForm = wireFormFor(state, side);
  if (!currentForm || currentForm.kind !== 'fraction') {
    throw new SceneProjectionError(
      'INVALID_SCENE_INPUT',
      `${side} current form must be a fraction wire value`,
    );
  }
  return {
    id: side,
    quantity: {
      exactValue: operand.exactValue,
    },
    sourceForm: operand.initialForm,
    currentForm,
    unit: {
      denominator: currentForm.denominator,
    },
    count: {
      numerator: currentForm.numerator,
    },
    whole: {
      kind: 'stable-unit-whole',
      id: `${side}-stable-whole`,
      extent: {
        lowerWhole: '0',
        upperWhole: '1',
      },
    },
  };
}

function taskMeaning(state) {
  const expected = state.expectedResponse;
  if (!expected) {
    return {
      beat: state.beat,
      responsibility: null,
      promptId: null,
      inputKind: null,
      target: null,
      evidenceCategory: null,
    };
  }
  return {
    beat: state.beat,
    responsibility: expected.responsibility,
    promptId: expected.promptId,
    inputKind: expected.inputKind,
    target: expected.target ?? null,
    evidenceCategory: expected.evidenceCategory,
  };
}

function candidateDenominatorsMeaning(state) {
  if (state.beat !== 'decide') return null;
  const supportLevel = state.support?.dimensions?.commonDenominator;
  if (supportLevel !== 'high support') return null;
  return candidateDenominatorsForInstance(state.content);
}

function commonUnitMeaning(state) {
  const commonDenominator = state.established?.commonDenominator;
  if (!commonDenominator) return null;
  return {
    targetDenominator: commonDenominator.targetDenominator,
    validity: commonDenominator.validity,
    kind: commonDenominator.kind,
    rendering: commonDenominator.rendering,
    authoredCoverage: commonDenominator.authoredCoverage,
  };
}

function operationMeaning(state) {
  const operation = state.established?.operation;
  const resolution = state.established?.resolution;
  if (!operation && !resolution) {
    return {
      operation: state.content.request.operation,
      currentForms: null,
      rawResult: null,
      resultWholeSpan: null,
      preferredFinalForm: null,
    };
  }

  return {
    operation: state.content.request.operation,
    currentForms: {
      left: state.established.conversions.left,
      right: state.established.conversions.right,
    },
    rawResult: operation?.proposed ?? null,
    resultWholeSpan: state.content.representationFacts.wholeSpan,
    preferredFinalForm: resolution?.proposed ?? null,
  };
}

function transitionMeaning(state) {
  const lastConversion = state.established?.lastConversion;
  if (!lastConversion) return null;
  const provenanceIndex = state.responseProvenance.findLastIndex((entry) => {
    const candidate = entry?.resultingState?.established?.lastConversion;
    if (!candidate || candidate.side !== lastConversion.side
      || candidate.targetDenominator !== lastConversion.targetDenominator) {
      return false;
    }
    return canonicalWireSerialize(candidate.form, 'last conversion form')
      === canonicalWireSerialize(lastConversion.form, 'last conversion form');
  });
  if (provenanceIndex < 0) {
    throw new SceneProjectionError(
      'UNRESOLVED_TRANSITION',
      'the established conversion has no matching Plan 05 provenance record',
    );
  }
  const preceding = [...state.responseProvenance]
    .slice(0, provenanceIndex)
    .reverse()
    .find((entry) => entry?.resultingState?.established?.conversions);
  const precedingConversions = preceding?.resultingState?.established?.conversions;
  if (!precedingConversions
    || !Object.prototype.hasOwnProperty.call(precedingConversions, 'left')
    || !Object.prototype.hasOwnProperty.call(precedingConversions, 'right')) {
    throw new SceneProjectionError(
      'UNRESOLVED_TRANSITION',
      'the established conversion has no preceding Plan 05 endpoints',
    );
  }
  return {
    type: 'equivalent-renaming',
    status: 'known-endpoints',
    changed: [lastConversion.side],
    pre: {
      left: precedingConversions.left ?? state.content.operands.left.initialForm,
      right: precedingConversions.right ?? state.content.operands.right.initialForm,
    },
    post: {
      left: state.established.conversions.left ?? state.content.operands.left.initialForm,
      right: state.established.conversions.right ?? state.content.operands.right.initialForm,
    },
  };
}

function sceneMeaning(state, representationRole, capability) {
  const left = quantityScene(state, 'left');
  const right = quantityScene(state, 'right');
  const recovery = state.lastRecovery
    ? {
      beat: state.lastRecovery.beat,
      classification: state.lastRecovery.classification,
    }
    : null;
  return {
    representationRole,
    condition: state.activeCondition,
    reflectionChoices: state.beat === 'reflect'
      ? reflectionChoicesForInstance(state.content)
      : null,
    quantities: { left, right },
    unitRelationship: {
      sourceDenominators: {
        left: left.unit.denominator,
        right: right.unit.denominator,
      },
      candidateDenominators: candidateDenominatorsMeaning(state),
      commonUnit: commonUnitMeaning(state),
      authoredCoverage: state.established?.commonDenominator?.authoredCoverage ?? null,
    },
    currentTask: taskMeaning(state),
    availableAction: state.expectedResponse
      ? {
        responsibility: state.expectedResponse.responsibility,
        inputKind: state.expectedResponse.inputKind,
        target: state.expectedResponse.target ?? null,
      }
      : null,
    status: {
      episode: state.status,
      recovery,
    },
    operation: operationMeaning(state),
    transition: transitionMeaning(state),
    capability,
    support: state.support,
    supportConsequence: currentSupportConsequence(state),
  };
}

function assertNoSceneHistory(scene) {
  for (const key of SCENE_HISTORY_KEYS) {
    if (Object.prototype.hasOwnProperty.call(scene, key)) {
      throw new SceneProjectionError('INVALID_SCENE_INPUT', `scene must not carry ${key}`);
    }
  }
}

export function projectScene({ state, representationRole, presentationMode } = {}) {
  assertStateShape(state);
  assertProjectionOptions({ representationRole, presentationMode });
  const derivation = derivationContext({ state, representationRole, presentationMode });
  const capability = capabilityFor(state, representationRole, derivation);
  if (capability.kind === 'capability-refusal') return capability;

  const scene = {
    schemaVersion: SCENE_SCHEMA_VERSION,
    kind: 'scene',
    meaning: sceneMeaning(state, representationRole, capability),
    presentation: {
      mode: presentationMode,
    },
    derivation,
  };
  const frozen = deepFreeze(copyAndFreeze(scene, 'scene'));
  assertNoSceneHistory(frozen);
  return frozen;
}

export function assertSceneCurrent(sceneResult, { state, representationRole, presentationMode } = {}) {
  if (!sceneResult || typeof sceneResult !== 'object') {
    throw new SceneProjectionError('INVALID_SCENE_RESULT', 'scene result is required');
  }
  assertStateShape(state);
  assertProjectionOptions({ representationRole, presentationMode });
  const current = derivationContext({ state, representationRole, presentationMode });
  const supplied = canonicalSceneResult(sceneResult);
  const sceneKey = supplied.copy.derivation?.key ?? supplied.copy.derivationKey;
  if (sceneKey !== current.key) {
    throw new SceneProjectionError(
      'STALE_SCENE',
      'scene derivation does not match the current upstream state',
      { expected: current.key, actual: sceneKey ?? null },
    );
  }

  const expected = projectScene({ state, representationRole, presentationMode });
  const expectedCanonical = canonicalWireSerialize(expected, 'expected scene result');
  if (supplied.serialized !== expectedCanonical) {
    throw new SceneProjectionError(
      'SCENE_INTEGRITY',
      'scene result payload does not match the canonical projection for the current inputs',
    );
  }
  return expected;
}

export function isSceneCurrent(sceneResult, input) {
  try {
    assertSceneCurrent(sceneResult, input);
    return true;
  } catch (error) {
    if (error instanceof SceneProjectionError && error.code === 'STALE_SCENE') return false;
    throw error;
  }
}
