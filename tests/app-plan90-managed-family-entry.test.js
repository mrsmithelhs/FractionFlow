import { afterEach, describe, expect, it } from 'vitest';
import { PLAN90_FAMILY_ENTRIES, prepareManagedFamilyEntry } from '../src/app/managed-family-entry.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';

const entries = Object.values(PLAN90_FAMILY_ENTRIES);
afterEach(() => teardownMockDOM());

describe('Plan 90 managed family preparation', () => {
  it('prepares every admitted family entry with both registered support settings', () => {
    for (const entry of entries) {
      for (const supportId of ['high-support', 'medium-support']) {
        const prepared = prepareManagedFamilyEntry(entry, supportId);
        expect(prepared.type.id).toBe(entry.typeId);
        expect(prepared.itemIndex).toBeGreaterThanOrEqual(0);
        expect(prepared.state.episodeDefinition).toMatchObject({ id: entry.definitionId, revision: entry.definitionRevision });
        expect(prepared.state.taskContext).toMatchObject({
          itemId: entry.itemId,
          fixtureId: entry.fixtureId,
          definitionId: entry.definitionId,
          definitionRevision: entry.definitionRevision,
          taskDataId: entry.taskDataId,
          taskDataRevision: entry.taskDataRevision,
        });
        expect(prepared.state.taskContext.recipeId ?? prepared.state.taskContext.patternId).toBe(entry.recipeId);
        expect(prepared.state.taskContext.recipeRevision ?? prepared.state.taskContext.patternRevision).toBe(entry.recipeRevision);
        expect(Object.isFrozen(prepared)).toBe(true);
        expect(Object.isFrozen(prepared.state)).toBe(true);
        expect(replayEpisode(createReplayEnvelope(prepared.state))).toEqual(prepared.state);
      }
    }
  });

  it('preserves a supplied registered active condition', () => {
    const entry = entries[0];
    const condition = { id: 'phase2-bundle-2', revision: '1', display: 'D-01-B', choreography: 'D-02-J', promptCadence: 'D-05-focused-key-beats', connectionMaking: 'CM-01-M' };
    expect(prepareManagedFamilyEntry(entry, 'high-support', condition).state.activeCondition).toEqual(condition);
  });

  it('constructs the same initial state as the mounted standalone route for every item and support', () => {
    for (const entry of entries) for (const supportId of ['high-support', 'medium-support']) {
      const prepared = prepareManagedFamilyEntry(entry, supportId);
      const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
      const type = { ...prepared.type, items: [prepared.type.items[prepared.itemIndex]] };
      const app = createFractionFlowApp({root,practiceTypes:[type],presentationMode:'instant-test'}).mount();
      root.querySelector('.app-gear-button').click(); root.querySelector(`[data-support-id="${supportId}"]`).click();
      const chooser = root.querySelector('[data-entry-chooser]');
      if (chooser.getAttribute('aria-expanded') === 'false') chooser.click();
      root.querySelector(`[data-practice-type="${entry.typeId}"]`).click();
      expect(app.getState()).toEqual(prepared.state);
      app.destroy(); teardownMockDOM();
    }
  });

  it('rejects changed identity fields, extra fields, and unadmitted held records', () => {
    const entry = entries.find(candidate => candidate.stimulusId) ?? entries[0];
    const tampered = [
      { ...entry, itemRevision: 'changed' },
      { ...entry, fixtureId: `${entry.fixtureId}-changed` },
      { ...entry, ...(entry.stimulusId ? { stimulusId: `${entry.stimulusId}-changed` } : { stimulusId: 'unregistered-stimulus' }) },
      { ...entry, extra: true },
      { ...entry, itemId: 'plan40-v3-held-out-item' },
    ];
    for (const candidate of tampered) {
      expect(() => prepareManagedFamilyEntry(candidate, 'high-support')).toThrow(TypeError);
    }
  });
});
