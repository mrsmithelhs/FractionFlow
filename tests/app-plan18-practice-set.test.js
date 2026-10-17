import { afterEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { LEGACY_PRACTICE_TYPES_V4, PLAN34_PRACTICE_TYPES_V5, PRACTICE_TYPES } from '../src/app/practice-types.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('Plan 18 set@6 app registry', () => {
  afterEach(() => { teardownMockDOM(); });

  it('preserves the v5 eleven-item prefix and appends the two registered nested items', () => {
    const v5 = PLAN34_PRACTICE_TYPES_V5[0];
    const v6 = PRACTICE_TYPES[0];
    expect(v6.setRevision).toBe('6');
    expect(v6.items.slice(0, 11)).toEqual(v5.items);
    expect(v6.items.slice(0, 11)).toEqual(LEGACY_PRACTICE_TYPES_V4[0].items.map((item) => {
      const enriched = v5.items.find((candidate) => candidate.id === item.id);
      return enriched;
    }));
    expect(v6.items.slice(11).map(({ id, fixtureId, episodeDefinitionId, episodeDefinitionRevision, targetDenominator }) => ({ id, fixtureId, episodeDefinitionId, episodeDefinitionRevision, targetDenominator }))).toEqual([
      { id: 'nested-one-half-plus-three-eighths', fixtureId: 'curated-nested-addition-one-half-three-eighths', episodeDefinitionId: 'phase-3-nested-renaming-addition', episodeDefinitionRevision: '1', targetDenominator: '8' },
      { id: 'nested-three-eighths-plus-one-half', fixtureId: 'curated-nested-addition-three-eighths-one-half', episodeDefinitionId: 'phase-3-nested-renaming-addition', episodeDefinitionRevision: '1', targetDenominator: '8' },
    ]);
  });

  it('mounts either exact nested record through the selected v6 set association', () => {
    const document = setupMockDOM();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const type = PRACTICE_TYPES[0];
    const focusedType = Object.freeze({ ...type, items: Object.freeze(type.items.slice(11)) });
    const app = createFractionFlowApp({ root, practiceTypes: [focusedType], presentationMode: 'instant-test' });
    app.mount();
    root.querySelector('.app-practice-button').click();
    expect(app.getState().taskContext.practiceSetRevision).toBe('6');
    expect(app.getState().taskContext.itemId).toBe(focusedType.items[0].id);
    app.destroy();
  });
});
