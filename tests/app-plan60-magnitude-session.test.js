import { describe, it, expect } from 'vitest';
import { MAGNITUDE_SESSION_MANIFEST as manifest, admitMagnitudeManifest, createMagnitudeSessionController, isMagnitudeEpisodeComplete } from '../src/app/magnitude-session.js';
import { applyIntent } from '../src/interaction/episode.js';
import { plan51IntentContext } from '../src/interaction/plan51-distance-episode.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';

const act = (controller, intent) => { const { episode } = controller.current(); const next = applyIntent(episode, intent); expect(controller.updateEpisode(episode, next)).toBe(true); return next; };
const next = controller => { const { session, episode } = controller.current(); const p = controller.prepareTransition('next', session, episode); expect(p.ok).toBe(true); expect(controller.commit(p.ticket)).toBe(true); };
const finishCompare = (controller, relation) => act(controller, { type: 'submit-fraction-comparison', proposed: relation });

describe('Plan 60 pure manifest and navigation', () => {
  it('admits exact live registered references and both real support profiles deterministically', () => {
    for (const support of ['high-support', 'medium-support']) {
      const a = admitMagnitudeManifest(manifest, support), b = admitMagnitudeManifest(structuredClone(manifest), support);
      expect(a).toEqual(b);
      expect(a.prepared.map(x => x.state.taskContext.itemId)).toEqual(['plan45-compare-02','plan45-compare-08','plan45-compare-11','distance-01']);
      expect(a.prepared.map(x => x.state.episodeDefinition.revision)).toEqual(['2','2','2','1']);
      expect(a.prepared.map(x => x.state.beatSchedule.map(b => b.kind))).toEqual([['compare','resolve'],['compare','resolve'],['compare','resolve'],['compare','distance','resolve']]);
    }
    const variants = [];
    for (const mutate of [m => m.entries.reverse(), m => m.entries[1] = structuredClone(m.entries[0]), m => m.entries[0].definitionRevision = '1', m => m.entries[3].recipeRevision = '2', m => m.entries[0].itemId = 'unknown', m => m.entries[0].extra = true, m => m.revision = '2']) { const m = structuredClone(manifest); mutate(m); variants.push(m); }
    for (const value of variants) expect(() => admitMagnitudeManifest(value)).toThrow();
    expect(() => admitMagnitudeManifest(manifest, 'unknown')).toThrow();
  });
  it('runs the full sequence with wrong correction, real replay, deliberate Next and final exhaustion', () => {
    const c = createMagnitudeSessionController(manifest, 'medium-support');
    expect(c.prepareTransition('next', c.current().session, c.current().episode).reason).toBe('unfinished');
    const wrong = finishCompare(c, '<'); expect(wrong.status).toBe('active'); expect(c.current().session.index).toBe(0);
    let s = finishCompare(c, '>'); expect(replayEpisode(createReplayEnvelope(s))).toEqual(s); expect(c.current().session.index).toBe(0);
    next(c); finishCompare(c, '<'); next(c); finishCompare(c, '='); next(c);
    let d = c.current().episode; expect(d.taskContext.itemId).toBe('distance-01');
    d = act(c, { type: 'submit-distance-comparison', context: plan51IntentContext(d), proposed: '<' });
    expect(isMagnitudeEpisodeComplete(d, manifest.entries[3])).toBe(false);
    expect(c.prepareTransition('next', c.current().session, d).reason).toBe('unfinished');
    d = act(c, { type: 'submit-distance-fraction', context: plan51IntentContext(d), numerator: '4', denominator: '8' });
    expect(replayEpisode(createReplayEnvelope(d))).toEqual(d);
    expect(c.prepareTransition('next', c.current().session, d).reason).toBe('exhausted');
    expect(c.current().episode).toBe(d);
    expect(createMagnitudeSessionController().current().session.index).toBe(0);
  });
  it('preserves accepted state across each failed preparation, retries, and refuses stale or duplicate tickets', () => {
    let shouldFail = false;
    const c = createMagnitudeSessionController(manifest, 'high-support', { prepare: (entry, support) => { if (shouldFail) throw Error('injected'); return admitMagnitudeManifest(manifest, support).prepared[manifest.entries.findIndex(x => x.itemId === entry.itemId)]; } });
    for (const relation of ['>','<','=']) {
      finishCompare(c, relation); const before = c.current(); shouldFail = true;
      expect(c.prepareTransition('next', before.session, before.episode).reason).toBe('preparation-failed');
      expect(c.current()).toEqual(before); shouldFail = false;
      const p = c.prepareTransition('next', before.session, before.episode); const duplicate = c.prepareTransition('next', before.session, before.episode);
      expect(c.commit(p.ticket)).toBe(true); expect(c.commit(p.ticket)).toBe(false); expect(c.commit(duplicate.ticket)).toBe(false);
      expect(c.prepareTransition('next', before.session, before.episode).ok).toBe(false);
    }
  });
  it('restarts only the current record and invalidates old episode, tickets and exit controls', () => {
    const c = createMagnitudeSessionController(); finishCompare(c, '>'); next(c);
    const before = c.current(); const restart = c.prepareTransition('restart', before.session, before.episode);
    expect(c.commit(restart.ticket)).toBe(true); expect(c.current().session.index).toBe(1);
    expect(c.current().episode.status).toBe('active'); expect(c.updateEpisode(before.episode, before.episode)).toBe(false);
    const old = c.current(); const ticket = c.prepareTransition('restart', old.session, old.episode);
    expect(c.exit(old.session)).toBe(true); expect(c.commit(ticket.ticket)).toBe(false); expect(c.exit(old.session)).toBe(false); expect(c.current().episode).toBeNull();
  });
});

it('retains current work on restart failure or invalid candidate and rejects a ticket after an intervening reducer edit', () => {
  let mode = 'fail';
  const c = createMagnitudeSessionController(manifest, 'high-support', { prepare: (entry, support) => {
    if (mode === 'fail') throw new Error('injected');
    if (mode === 'invalid') return { state: {} };
    return admitMagnitudeManifest(manifest, support).prepared[manifest.entries.findIndex(x => x.itemId === entry.itemId)];
  } });
  const initial = c.current();
  expect(c.prepareTransition('restart', initial.session, initial.episode).reason).toBe('preparation-failed');
  expect(c.current()).toEqual(initial);
  mode = 'invalid'; expect(c.prepareTransition('restart', initial.session, initial.episode).reason).toBe('invalid-candidate');
  expect(c.current()).toEqual(initial);
  mode = 'good'; const ticket = c.prepareTransition('restart', initial.session, initial.episode);
  const edited = act(c, { type: 'submit-fraction-comparison', proposed: '<' });
  expect(c.commit(ticket.ticket)).toBe(false); expect(c.current().episode).toBe(edited); expect(c.current().session.index).toBe(0);
});
