import { describe, it, expect } from 'vitest';
import { COMPARISON_SESSION_MANIFEST as manifest, MAGNITUDE_SESSION_MANIFEST, admitMagnitudeManifest, createMagnitudeSessionController } from '../src/app/magnitude-session.js';
import { createComparisonRecordController } from '../src/app/comparison-record-controller.js';
import { emptyRoot } from '../src/app/comparison-record.js';
import { applyIntent } from '../src/interaction/episode.js';

describe('Plan 69 fixed session and record boundary', () => {
  it('admits only literal manifests and runs exactly four comparisons', () => {
    for (const support of ['high-support', 'medium-support']) {
      expect(admitMagnitudeManifest(manifest, support).prepared.map(p => p.state.taskContext.itemId)).toEqual(['plan45-compare-02','plan45-compare-09','plan45-compare-11','plan45-compare-10']);
      const c = createMagnitudeSessionController(manifest, support);
      for (const [index, relation] of ['>','>','=','<'].entries()) {
        const before = c.current(); expect(before.session.index).toBe(index);
        const accepted = applyIntent(before.episode, { type: 'submit-fraction-comparison', proposed: relation });
        expect(c.updateEpisode(before.episode, accepted)).toBe(true);
        const p = c.prepareTransition('next', c.current().session, accepted);
        if (index === 3) expect(p.reason).toBe('exhausted');
        else { expect(p.ok).toBe(true); expect(c.commit(p.ticket)).toBe(true); expect(c.commit(p.ticket)).toBe(false); }
      }
    }
    for (const base of [manifest, MAGNITUDE_SESSION_MANIFEST]) for (const mutate of [m=>m.entries.reverse(), m=>m.entries[0].itemRevision='bad', m=>m.id='unknown', m=>m.entries.push(m.entries[0])]) {
      const bad=structuredClone(base); mutate(bad); expect(()=>admitMagnitudeManifest(bad)).toThrow();
    }
    expect(()=>admitMagnitudeManifest(manifest, 'bad')).toThrow();
  });
  it('admits each actual installed member, rejecting mismatches and retired contexts', async () => {
    const storage={read:async()=>emptyRoot('a'.repeat(32),true)};
    const record=createComparisonRecordController({storage}); await record.refresh();
    for (const m of [manifest, MAGNITUDE_SESSION_MANIFEST]) {
      const c=createMagnitudeSessionController(m);
      for (let index=0; index<3+(m===manifest?1:0); index++) {
        const current=c.current(); expect(record.install(current.episode,c)).toBe(true);
        expect(record.install(current.episode,{current:()=>current})).toBe(false);
        expect(record.install({...current.episode},c)).toBe(false);
        const relation=m===manifest?['>','>','=','<'][index]:['>','<','='][index];
        const next=applyIntent(current.episode,{type:'submit-fraction-comparison',proposed:relation}); c.updateEpisode(current.episode,next);
        if(index<3) { const p=c.prepareTransition('next',c.current().session,next); expect(c.commit(p.ticket)).toBe(true); }
      }
      const last=c.current(); c.exit(last.session); expect(record.install(last.episode,c)).toBe(false);
    }
    record.destroy();
  });
  it('rejects an observation after its session has exited', async () => {
    const writes=[]; const record=createComparisonRecordController({storage:{read:async()=>emptyRoot('a'.repeat(32),true),record:async(...args)=>{writes.push(args);return 'inserted';}}});
    await record.refresh(); const c=createMagnitudeSessionController(manifest); const {episode,session}=c.current(); expect(record.install(episode,c)).toBe(true);
    const next=applyIntent(episode,{type:'submit-fraction-comparison',proposed:'>'}); c.updateEpisode(episode,next); c.exit(session);
    record.observe(episode,next,{type:'submit-fraction-comparison'}); await new Promise(resolve=>setTimeout(resolve,0));
    expect(writes).toHaveLength(0); expect(record.snapshot().eligible).toBe(false); record.destroy();
  });
  it('records each eligible session comparison through the existing observation queue', async () => {
    const writes=[]; const record=createComparisonRecordController({storage:{read:async()=>emptyRoot('a'.repeat(32),true),record:async(g,o)=>{writes.push(o);return 'inserted';}}});
    await record.refresh(); const c=createMagnitudeSessionController(manifest);
    for (const [i,relation] of ['>','>','=','<'].entries()) {
      const {episode}=c.current(); expect(record.install(episode,c)).toBe(true);
      const next=applyIntent(episode,{type:'submit-fraction-comparison',proposed:relation}); c.updateEpisode(episode,next); record.observe(episode,next,{type:'submit-fraction-comparison'}); record.retire();
      if(i<3) { const p=c.prepareTransition('next',c.current().session,next); expect(c.commit(p.ticket)).toBe(true); }
    }
    await new Promise(resolve=>setTimeout(resolve,0)); expect(writes.map(w=>w.identity.itemId)).toEqual(manifest.entries.map(e=>e.itemId)); expect(writes.every(w=>w.kind==='first-accepted')).toBe(true); record.destroy();
  });
});
