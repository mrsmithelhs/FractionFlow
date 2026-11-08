import { expect, it } from 'vitest';
import { selectFittingPracticeSession, admitMagnitudeManifest } from '../src/app/magnitude-session.js';
it('selects only eligible admitted three-slot combinations, reproducibly', () => {
 const allowed=['plan45-compare-09','plan45-compare-10','distance-04'];
 for(let seed=0;seed<4;seed++) {
  const m=selectFittingPracticeSession(seed,allowed);
  expect(m.entries.map(x=>x.itemId)).toEqual(allowed);
  expect(admitMagnitudeManifest(m).manifest).toEqual(m);
 }
});
it('fails closed when a slot has no fit candidate or inputs are malformed', () => {
 expect(selectFittingPracticeSession(0,['plan45-compare-02','plan45-compare-10'])).toBeNull();
 expect(()=>selectFittingPracticeSession(0,['distance-01','distance-01'])).toThrow();
 expect(()=>selectFittingPracticeSession(-1,[])).toThrow();
});
