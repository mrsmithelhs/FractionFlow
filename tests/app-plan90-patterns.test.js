import { expect, it } from 'vitest';
import { admitMagnitudeManifest, createMagnitudeSessionController, selectManagedPractice } from '../src/app/magnitude-session.js';
import { applyIntent } from '../src/interaction/episode.js';
import { getRegisteredCondition } from '../src/app/conditions.js';
import { createComparisonRecordController } from '../src/app/comparison-record-controller.js';
import { emptyRoot } from '../src/app/comparison-record.js';

const choose = (seed, ids = null) => selectManagedPractice(seed, entry => !ids || ids.includes(entry.itemId));
it('selects four ordered goal-linked patterns deterministically for the golden seeds', () => {
  const expected = [
    ['M0','plan45-compare-02','plan45-compare-09','plan45-compare-10','distance-01'],
    ['M1','plan45-compare-08','bridge-06-three-eighths-8','plan45-compare-10','distance-04'],
    ['U0','plan35-identify-half-three-tenths-10','one-half-plus-one-third','plan35-construct-half-fifth-10'],
    ['U1','plan40-identify-one-half-one-eighth-8','plan40-inspect-two-thirds-one-fourth-12','plan40-construct-half-fifth-10'],
  ];
  for(let seed=0;seed<4;seed++) {
    const result=choose(seed); expect([result.manifest.patternId,...result.manifest.entries.map(x=>x.itemId)]).toEqual(expected[seed]);
    expect(choose(seed)).toEqual(result); expect(admitMagnitudeManifest(result.manifest).prepared).toHaveLength(expected[seed].length-1);
  }
  expect(()=>choose(-1)).toThrow(); expect(()=>choose(0x100000000)).toThrow();
});
it('uses designated alternatives, cycles if required placement is missing, and supports shorter arithmetic', () => {
  const m1=['plan45-compare-08','bridge-02-fourth-4','plan45-compare-10','distance-04'];
  expect(choose(1,m1).manifest.entries.map(x=>x.itemId)).toEqual(m1);
  const addition=['plan35-identify-half-three-tenths-10','plan35-construct-half-fifth-10'];
  expect(choose(1,addition).manifest.patternId).toBe('U0');
  expect(choose(2,addition).manifest.entries.map(x=>x.itemId)).toEqual(addition);
  expect(choose(0,['distance-04']).manifest.patternId).toBe('single');
  expect(choose(0,[]).manifest).toBeNull();
});
it('rejects forged records, held entries, altered slot order and missing required placement', () => {
  const source=choose(1).manifest;
  for (const mutate of [m=>m.entries.reverse(),m=>{m.entries[1].itemRevision='changed';},m=>{m.entries[1].itemId='bridge-01-half-2';},m=>{m.entries.splice(1,1);m.slots.splice(1,1);},m=>{m.extra=true;}]) {
    const altered=structuredClone(source); mutate(altered); expect(()=>admitMagnitudeManifest(altered)).toThrow();
  }
});
it('ends early if both unstarted M1 placement options lose fit', () => {
  const manifest=choose(1).manifest;
  const controller=createMagnitudeSessionController(manifest,'high-support',{eligibleForNext:entry=>!entry.itemId.startsWith('bridge-')});
  const start=controller.current(), resolved=applyIntent(start.episode,{type:'submit-fraction-comparison',proposed:'<'});
  controller.updateEpisode(start.episode,resolved);const current=controller.current();
  expect(controller.prepareTransition('next',current.session,resolved).reason).toBe('fit-exhausted');
  expect(controller.current().episode).toBe(resolved);
});
it.each([2,3])('ends early if the required arithmetic endpoint loses fit for seed %i', seed => {
  const manifest=choose(seed).manifest, endpoint=manifest.entries.at(-1).itemId;
  const controller=createMagnitudeSessionController(manifest,'high-support',{eligibleForNext:entry=>entry.itemId!==endpoint});
  const start=controller.current(), resolved={...start.episode,beat:'resolve',schedulePosition:start.episode.beatSchedule.length-1,
    established:{...start.episode.established,operation:{proposed:{numerator:'1',denominator:'1'}}}};
  expect(controller.updateEpisode(start.episode,resolved)).toBe(true);const current=controller.current();
  expect(controller.prepareTransition('next',current.session,resolved).reason).toBe('fit-exhausted');
  expect(controller.current().episode).toBe(resolved);
});
it('applies a newly selected condition to the next family without changing the active episode', () => {
  let nextCondition = getRegisteredCondition('phase2-bundle-2').activeCondition;
  const controller=createMagnitudeSessionController(choose(1).manifest,'high-support',{getNextCondition:()=>nextCondition});
  const start=controller.current(), resolved=applyIntent(start.episode,{type:'submit-fraction-comparison',proposed:'<'});
  controller.updateEpisode(start.episode,resolved);const current=controller.current(),ticket=controller.prepareTransition('next',current.session,resolved);
  expect(ticket.ok).toBe(true);expect(controller.commit(ticket.ticket)).toBe(true);
  expect(controller.current().episode.activeCondition).toEqual(nextCondition);
  const bridge=controller.current();nextCondition=getRegisteredCondition('phase2-bundle-3').activeCondition;
  const retry=controller.prepareTransition('restart',bridge.session,bridge.episode);expect(retry.ok).toBe(true);expect(controller.commit(retry.ticket)).toBe(true);
  expect(controller.current().episode.activeCondition).toEqual(getRegisteredCondition('phase2-bundle-2').activeCondition);
});
it('records only previously eligible managed comparison identities and rejects the new comparison', async () => {
  const writes=[];
  const record=createComparisonRecordController({storage:{read:async()=>emptyRoot('a'.repeat(32),true),record:async(g,o)=>{writes.push(o);return 'inserted';}}});
  await record.refresh();const session=createMagnitudeSessionController(choose(0).manifest);
  for(const [id,relation] of [['plan45-compare-02','>'],['plan45-compare-09','>'],['plan45-compare-10','<']]) {
    const before=session.current();expect(before.episode.taskContext.itemId).toBe(id);expect(record.install(before.episode,session)).toBe(true);
    const next=applyIntent(before.episode,{type:'submit-fraction-comparison',proposed:relation});expect(session.updateEpisode(before.episode,next)).toBe(true);
    record.observe(before.episode,next,{type:'submit-fraction-comparison'});const current=session.current(),ticket=session.prepareTransition('next',current.session,next);
    expect(ticket.ok).toBe(true);expect(session.commit(ticket.ticket)).toBe(true);
  }
  expect(record.install(session.current().episode,session)).toBe(false);
  const m1=createMagnitudeSessionController(choose(1).manifest);expect(record.install(m1.current().episode,m1)).toBe(false);
  const exited=session.current();session.exit(exited.session);expect(record.install(exited.episode,session)).toBe(false);
  await new Promise(resolve=>setTimeout(resolve,0));expect(writes.map(x=>x.identity.itemId)).toEqual(['plan45-compare-02','plan45-compare-09','plan45-compare-10']);record.destroy();
});
it('preserves the same recording admission across a rolled-back Retry without duplicate first observations', async () => {
  const writes=[];const record=createComparisonRecordController({storage:{read:async()=>emptyRoot('b'.repeat(32),true),record:async(g,o)=>{writes.push(o);return 'inserted';}}});
  await record.refresh();const session=createMagnitudeSessionController(choose(0).manifest);const original=session.current();
  expect(record.install(original.episode,session)).toBe(true);
  const ticket=session.prepareTransition('restart',original.session,original.episode);expect(session.commit(ticket.ticket)).toBe(true);expect(session.rollback(ticket.ticket)).toBe(true);
  expect(record.rebindAfterRollback(session,original.episode)).toBe(true);
  const after=applyIntent(original.episode,{type:'submit-fraction-comparison',proposed:'>'});session.updateEpisode(original.episode,after);
  record.observe(original.episode,after,{type:'submit-fraction-comparison'});await new Promise(resolve=>setTimeout(resolve,0));
  expect(writes).toHaveLength(1);expect(writes[0].identity.itemId).toBe('plan45-compare-02');record.destroy();
});
