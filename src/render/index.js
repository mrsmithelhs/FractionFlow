/**
 * Presentation Layer Entry Point (src/render/)
 *
 * Exports the shared boundary contract, centralized strings catalog,
 * pure fraction-bar and symbolic renderers, discrete controls, and the beat container.
 */

export { STRINGS } from './strings.js';
export {
  RENDERER_ROLES,
  RenderContractError,
  resolveRenderableScene,
  assertValidScene,
} from './contract.js';
export { createFractionBarRenderer, createTakeawayBar } from './fraction-bar.js';
export { createSymbolicRenderer } from './symbolic.js';
export {
  createButton,
  createNumericInput,
  createFractionResponseInput,
  createChoiceGroup,
} from './controls.js';
export { createBeatContainer } from './beat-container.js';
export { createLinearPathRenderer } from './linear-path.js';
export { createOperateResponse } from './operate-response.js';

