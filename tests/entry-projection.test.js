import { describe, it, expect, afterEach, vi } from 'vitest';
import { projectEntryCapabilities } from '../src/app/entry-projection.js';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { MAGNITUDE_SESSION_MANIFEST } from '../src/app/magnitude-session.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

afterEach(() => { vi.restoreAllMocks(); teardownMockDOM(); });
describe('compact entry capabilities', () => {
  it('projects every admitted capability once in browse and names the primary', () => {
    const p = projectEntryCapabilities(PRACTICE_TYPES, MAGNITUDE_SESSION_MANIFEST);
    expect(p.errors).toEqual([]); expect(p.primary.type.id).toBe('sum-under-one');
    expect(p.groups.flatMap(g => g.entries).filter(e => e.kind === 'practice').map(e => e.type.id).sort()).toEqual(PRACTICE_TYPES.map(t => t.id).sort());
    expect(p.groups.flatMap(g => g.entries).filter(e => e.kind === 'session')).toHaveLength(1);
  });
  it('cycles four admitted goals by UTC day and filters missing candidates', () => {
    const ids = ['sum-under-one', 'symbolic-fraction-comparison', 'bar-to-line-same-amount', 'whole-plus-fraction-construction'];
    expect([0, 1, 2, 3, 4, -1].map(day => projectEntryCapabilities(PRACTICE_TYPES, null, day).primary.type.id)).toEqual([...ids, ids[0], ids[3]]);
    const partial = PRACTICE_TYPES.filter(t => ids.slice(1, 3).includes(t.id));
    expect(projectEntryCapabilities(partial, null, 0).primary.type.id).toBe(ids[1]);
    expect(projectEntryCapabilities(partial, null, 1).primary.type.id).toBe(ids[2]);
    expect(() => projectEntryCapabilities(partial, null, NaN)).toThrow('invalid featured rotation day');
  });
  it('keeps the sampled document day across a date change, return and remount', () => {
    const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
    const clock = vi.spyOn(Date, 'now').mockReturnValue(0);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test', entryTestHooks: { rotationDay: 0 } }).mount();
    const first = root.querySelector('.app-practice-button').getAttribute('data-practice-type');
    clock.mockReturnValue(86_400_000 * 99);
    root.querySelector('.app-practice-button').click(); expect(app.getState().taskContext.itemId).toBe('two-thirds-plus-one-fourth'); root.querySelector('.app-return-button').click();
    expect(root.querySelector('.app-practice-button').getAttribute('data-practice-type')).toBe(first);
    expect(doc.activeElement).toBe(root.querySelector('.app-entry-title'));
    app.destroy(); app.mount(); expect(root.querySelector('.app-practice-button').getAttribute('data-practice-type')).toBe(first);
    app.destroy();
  });
  it('shares its startup sample between separate app instances in one document', () => {
    const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
    const clock = vi.spyOn(Date, 'now').mockReturnValue(0);
    const a = createFractionFlowApp({ root }).mount();
    const first = root.querySelector('.app-practice-button').getAttribute('data-practice-type'); a.destroy();
    clock.mockReturnValue(86_400_000 * 99);
    const b = createFractionFlowApp({ root }).mount();
    expect(root.querySelector('.app-practice-button').getAttribute('data-practice-type')).toBe(first); b.destroy();
  });
  it('offers Choose first when no eligible featured capability exists', () => {
    const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
    const distance = PRACTICE_TYPES.find(t => t.id === 'fraction-distance');
    const app = createFractionFlowApp({ root, practiceTypes: [distance], entryTestHooks: { rotationDay: 0 } }).mount();
    expect(root.querySelector('.app-practice-button')).toBeNull();
    expect(root.querySelector('.app-featured-label')).toBeNull();
    expect(root.querySelector('.app-entry-page button')).toBe(root.querySelector('[data-entry-chooser]'));
    root.querySelector('[data-entry-chooser]').click(); root.querySelector('[data-practice-type="fraction-distance"]').click();
    expect(app.getState().taskContext.itemId).toBe('distance-01'); app.destroy();
  });
  it('keeps partial capabilities, skips empty groups and diagnoses unmapped or duplicate admissions', () => {
    const type = PRACTICE_TYPES.find(t => t.id === 'fraction-distance');
    const p = projectEntryCapabilities([type]);
    expect(p.primary).toBeNull(); expect(p.groups.map(g => g.label)).toEqual(['Compare and distance']);
    expect(projectEntryCapabilities([type, type, { id: 'unknown' }]).errors).toHaveLength(2);
    const collision = projectEntryCapabilities([{ id: 'session:short-magnitude-practice' }], MAGNITUDE_SESSION_MANIFEST);
    expect(collision.errors).toContain('unmapped practice: session:short-magnitude-practice');
    expect(collision.groups.flatMap(g => g.entries).filter(e => e.kind === 'session')).toHaveLength(1);
  });
  it('uses the explicitly requested historical flat entry independently of progression', () => {
    const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
    const app = createFractionFlowApp({ root, navigationMode: 'direct', entryMode: 'historical-flat', presentationMode: 'instant-test' }).mount();
    expect(root.querySelector('[data-entry-chooser]')).toBeNull();
    expect(root.querySelector('.app-featured-label')).toBeNull();
    expect(root.querySelector('.app-entry-line').textContent).toBe('See how different-sized fraction parts fit together.');
    expect(root.querySelector('[data-practice-type="like-denominator-addition"]').hasAttribute('hidden')).toBe(false);
    root.querySelector('[data-practice-type="like-denominator-addition"]').click();
    expect(app.getState().episodeDefinition.id).toBe('phase-3-like-denominator-addition');
    root.querySelector('.app-return-button').click();
    expect(doc.activeElement).toBe(root.querySelector('.app-entry-title'));
    app.destroy();
  });
  it('uses compact entry with legacy episode progression unless flat entry is requested', () => {
    const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
    const app = createFractionFlowApp({ root, navigationMode: 'legacy-acknowledged', presentationMode: 'instant-test' }).mount();
    expect(root.querySelector('[data-entry-chooser]')).not.toBeNull();
    expect(root.querySelector('[data-entry-chooser]').getAttribute('aria-expanded')).toBe('false');
    app.destroy();
  });
  it('toggles the chooser and ignores a retired chooser callback after remount', () => {
    const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
    const old = root.querySelector('[data-entry-chooser]'); old.focus(); old.click();
    expect(old.getAttribute('aria-expanded')).toBe('true'); expect(doc.activeElement).toBe(old);
    old.click(); expect(old.getAttribute('aria-expanded')).toBe('false');
    app.destroy(); app.mount(); old.click();
    expect(root.querySelector('[data-entry-chooser]').getAttribute('aria-expanded')).toBe('false'); app.destroy();
  });
  it('rejects an unknown entry mode', () => { const doc = setupMockDOM(); expect(() => createFractionFlowApp({ root: doc.createElement('div'), entryMode: 'other' })).toThrow('unknown entry mode'); });
  it.each(['prepare', 'display'])('retains an entry and permits fresh launch after %s failure', kind => {
    const doc = setupMockDOM(), root = doc.createElement('div'); doc.body.appendChild(root);
    let fail = true, retiredControl;
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test', entryTestHooks: { [kind]: () => { if (fail) { retiredControl = root.querySelector('.app-visual-view .control-btn'); throw Error('injected'); } } } }); app.mount();
    const chooser = root.querySelector('[data-entry-chooser]'); chooser.click();
    const goal = root.querySelector('[data-practice-type="like-denominator-addition"]'); goal.click();
    expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);
    expect(doc.activeElement).toBe(root.querySelector('.app-session-entry-notice'));
    fail = false; goal.click();
    expect(app.getState().episodeDefinition.id).toBe('phase-3-like-denominator-addition');
    expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(true);
    if (kind === 'display') { expect(retiredControl).not.toBeNull(); const state = app.getState(); retiredControl.click(); expect(app.getState()).toBe(state); }
    root.querySelector('.app-return-button').click();
    expect(chooser.getAttribute('aria-expanded')).toBe('false'); expect(doc.activeElement).toBe(root.querySelector('.app-entry-title'));
    app.destroy();
  });
});
