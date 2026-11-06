import { afterEach, expect, it, vi } from 'vitest';
afterEach(()=>{vi.doUnmock('../src/content/data/plan45-symbolic-fraction-comparison-records.js');vi.resetModules();});
it('rejects a reversed equivalent underlying pair after isolated registry drift',async()=>{
 vi.doMock('../src/content/data/plan45-symbolic-fraction-comparison-records.js',async importOriginal=>{const actual=await importOriginal();return {...actual, PLAN45_COMPARISON_RECORDS:actual.PLAN45_COMPARISON_RECORDS.map(record=>record.itemId==='plan45-compare-02'?{...record,sourceForms:{first:{numerator:'3',denominator:'4'},second:{numerator:'1',denominator:'4'}}}:record)};});
 const {selectPracticeSession,admitMagnitudeManifest}=await import('../src/app/magnitude-session.js');
 // 3/4,1/4 and distance-01's 2/8,6/8 represent the same unordered pair.
 expect(()=>admitMagnitudeManifest(selectPracticeSession(0))).toThrow(/repeated item or pair/);
 expect(()=>admitMagnitudeManifest(selectPracticeSession(1))).not.toThrow();
});
