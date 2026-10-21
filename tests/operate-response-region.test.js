import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createOperateResponse } from '../src/render/operate-response.js';
import { STRINGS } from '../src/render/strings.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('operate response ownership region', () => {
  let doc;

  beforeEach(() => {
    doc = setupMockDOM();
  });

  afterEach(() => teardownMockDOM());

  function mount({ prefix, mode, helpOpen = false }) {
    const activeBeatRoot = doc.createElement('section');
    const controlsRoot = doc.createElement('div');
    activeBeatRoot.appendChild(controlsRoot);
    doc.body.appendChild(activeBeatRoot);
    const actions = [];
    const scene = {
      meaning: {
        takeaway: mode === 'takeaway' ? { removalStatus: 'complete' } : null,
        quantities: { left: { currentForm: { denominator: '5' } } },
        unitRelationship: {
          commonUnit: { kind: mode === 'shared' ? 'already-shared-unit' : 'needs-conversion' },
        },
        status: { recovery: null },
      },
    };
    const response = createOperateResponse({
      scene,
      strings: STRINGS,
      inputPrefix: prefix,
      taskHelpId: `${prefix}-help`,
      taskHelpText: 'Task help',
      helpOpen,
      activeBeatRoot,
      controlsRoot,
      dispatchAction: (action) => actions.push(action),
    });
    response.elements.forEach((element) => controlsRoot.appendChild(element));
    return { ...response, actions, activeBeatRoot, controlsRoot };
  }

  for (const prefix of ['operate', 'linear-operate']) {
    it(`keeps raw fraction drafts and submit wiring for ${prefix}`, () => {
      const region = mount({ prefix, mode: 'takeaway', helpOpen: true });
      expect(region.controlsRoot.children.map((child) => child.tagName)).toEqual(['P', 'FIELDSET']);
      expect(region.controlsRoot.children[0].id).toBe(`${prefix}-help`);
      const n = region.handle.primaryInput();
      const d = region.controlsRoot.querySelector(`#${prefix}-fraction-denominator-input`);
      const emptyDraft = region.handle.readDraft();
      n.value = ' 03 ';
      d.value = ' 08 ';
      expect(region.handle.readDraft()).toEqual({ ...emptyDraft, numerator: ' 03 ', denominator: ' 08 ' });
      region.handle.writeDraft({ ...emptyDraft, numerator: '4', denominator: '9' });
      expect(region.handle.readDraft()).toEqual({ ...emptyDraft, numerator: '4', denominator: '9' });
      expect(region.handle.writeDraft({ ...emptyDraft, context: 'other-operation', numerator: '8', denominator: '9' })).toBe(false);
      region.controlsRoot.querySelector('.control-submit-btn').click();
      expect(region.actions).toEqual([{
        type: 'submit-subtraction-result',
        proposed: { kind: 'fraction', numerator: '4', denominator: '9' },
      }]);
    });

    it(`uses shared fraction or single response payload for ${prefix}`, () => {
      const shared = mount({ prefix, mode: 'shared' });
      expect(shared.handle.kind).toBe('fraction');
      shared.handle.writeDraft({ ...shared.handle.readDraft(), numerator: '7', denominator: '5' });
      shared.controlsRoot.querySelector('.control-submit-btn').click();
      expect(shared.actions[0]).toEqual({
        type: 'submit-operation-result',
        proposed: { kind: 'fraction', numerator: '7', denominator: '5' },
      });

      const single = mount({ prefix, mode: 'single' });
      expect(single.handle.kind).toBe('single');
      const emptyDraft = single.handle.readDraft();
      single.handle.writeDraft({ ...emptyDraft, value: ' 12 ' });
      expect(single.handle.readDraft()).toEqual({ ...emptyDraft, value: ' 12 ' });
      single.controlsRoot.querySelector('.control-submit-btn').click();
      expect(single.actions[0]).toEqual({
        type: 'submit-operation-result',
        proposed: { kind: 'fraction', numerator: '12', denominator: '5' },
      });
    });

    it(`checks live visibility, both fields, and invalidated handles for ${prefix}`, () => {
      const region = mount({ prefix, mode: 'takeaway' });
      const numerator = region.handle.primaryInput();
      const denominator = region.controlsRoot.querySelector(`#${prefix}-fraction-denominator-input`);
      region.activeBeatRoot.setAttribute('hidden', '');
      expect(region.handle.readDraft()).toBeNull();
      expect(region.handle.writeDraft({ ...region.handle.readDraft(), context: 'another-context', numerator: '1', denominator: '2' })).toBe(false);
      expect(region.handle.focusPrimary()).toBe(false);
      region.activeBeatRoot.removeAttribute('hidden');
      expect(region.handle.primaryInput()).toBe(numerator);

      denominator.parentNode.removeChild(denominator);
      expect(() => region.handle.readDraft()).toThrow(/missing its current numerator or denominator/);
      region.invalidate();
      expect(region.handle.readDraft()).toBeNull();
      expect(region.handle.writeDraft(null)).toBe(false);
      expect(region.handle.focusPrimary()).toBe(false);
    });
  }
});

