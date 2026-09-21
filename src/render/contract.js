import { projectScene, assertSceneCurrent } from '../interaction/scene.js';

/**
 * Presentation Layer Shared Boundary Contract
 *
 * Enforces the architectural boundary between the Instructional Engine and Presentation:
 * 1. Condition C: The container validates once through assertSceneCurrent(), and pure
 *    renderers receive only the returned frozen scene. Renderers do NOT receive or hold
 *    instructional state.
 * 2. Condition D: The role switch to symbolic is data-driven, driven strictly by the
 *    refusal's own continuation.representationRole value, not by container heuristics.
 * 3. Renderers are pure display consumers that produce deterministic DOM and never
 *    compute mathematical truth.
 */

export const RENDERER_ROLES = Object.freeze([
  'fraction-bar',
  'symbolic',
]);

export class RenderContractError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'RenderContractError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Resolves a renderable frozen scene from episode state.
 *
 * Handles data-driven continuation: if the initial role yields a capability refusal
 * (such as LCD > 30 for fraction-bar per DECISION-011), it reads the continuation role
 * named by the refusal itself (e.g. 'symbolic') and re-projects.
 *
 * Validates the final scene through assertSceneCurrent() and returns the fresh frozen scene.
 *
 * @param {object} options
 * @param {object} options.state - Validated Plan 05 episode state
 * @param {string} [options.initialRole='fraction-bar'] - Primary representation role
 * @param {string} [options.presentationMode='standard-motion'] - Presentation mode
 * @returns {object} Fresh, validated, frozen scene
 */
export function resolveRenderableScene({
  state,
  initialRole = 'fraction-bar',
  presentationMode = 'standard-motion',
  isReplaying = false,
} = {}) {
  if (!state || typeof state !== 'object') {
    throw new RenderContractError('INVALID_INPUT', 'state is required to resolve scene');
  }

  let role = initialRole;
  let sceneResult = projectScene({ state, representationRole: role, presentationMode, isReplaying });

  // Condition D: Data-driven role switch from refusal continuation
  if (sceneResult && sceneResult.kind === 'capability-refusal') {
    const continuationRole = sceneResult.continuation?.representationRole;
    if (continuationRole && continuationRole !== role) {
      role = continuationRole;
      sceneResult = projectScene({ state, representationRole: role, presentationMode, isReplaying });
    }
  }

  // If still a refusal with no continuation, it cannot be rendered
  if (sceneResult && sceneResult.kind === 'capability-refusal') {
    throw new RenderContractError(
      'UNRENDERABLE_SCENE',
      `scene capability refusal has no authorized continuation: ${sceneResult.status}`,
      { refusal: sceneResult },
    );
  }

  // Assert currency and return the fresh, deeply frozen scene
  return assertSceneCurrent(sceneResult, { state, representationRole: role, presentationMode, isReplaying });
}

/**
 * Validates that a renderer input is a valid, non-refusal, frozen scene.
 * Used by pure renderers to verify their incoming scene parameter.
 *
 * @param {object} scene
 */
export function assertValidScene(scene) {
  if (!scene || typeof scene !== 'object') {
    throw new RenderContractError('INVALID_SCENE', 'scene must be a non-null object');
  }
  if (scene.kind !== 'scene' || !scene.meaning || !scene.presentation) {
    throw new RenderContractError('INVALID_SCENE', 'input is not a valid projected scene');
  }
  if (!Object.isFrozen(scene) || !Object.isFrozen(scene.meaning)) {
    throw new RenderContractError('MUTABLE_SCENE', 'renderers require deeply frozen scenes');
  }
}
