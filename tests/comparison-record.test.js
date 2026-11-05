import { describe, it, expect } from 'vitest';
import { resolvePlan49Context } from '../src/interaction/plan49-comparison-construction.js';
import { applyObservation, createRecordAdmission, emptyRoot, identityFromContext, projectRecord, validateRoot } from '../src/app/comparison-record.js';
import { createComparisonRecordStorage } from '../src/app/comparison-record-storage.js';
const token = n => n.toString(16).padStart(32, '0');
const assistance = { model:'no', help:'no', construction:'no' };
const obs = (n, kind='first-retry', item='plan45-compare-02') => ({kind,token:token(n),identity:identityFromContext(resolvePlan49Context(item)),support:'high',assistance});
describe('comparison record', () => {
  it('retains one unresolved retry, updates acceptance and preserves assistance timing', () => {
    let r=emptyRoot(token(100),true); r=applyObservation(r,token(100),obs(1)).root;
    expect(r.entries[0]).toMatchObject({first:'retry',outcome:'unresolved',acceptedAssistance:null});
    const accepted={...obs(1,'acceptance'),assistance:{...assistance,help:'yes'}};
    r=applyObservation(r,token(100),accepted).root;
    expect(r.entries[0]).toMatchObject({first:'retry',outcome:'accepted',firstAssistance:assistance,acceptedAssistance:{help:'yes'}});
    expect(applyObservation(r,token(100),accepted).result).toBe('duplicate');
  });
  it('admits immutable work only while live and keeps admitted work after retirement', () => {
    const admission=createRecordAdmission({token:token(1),generation:token(100),identity:obs(1).identity,support:'high'});
    const mutable={...assistance}; const first=admission.capture('first-retry',mutable); mutable.help='yes';
    expect(first.observation.assistance.help).toBe('no');
    expect(admission.capture('first-retry',assistance)).toBeNull();
    const accepted=admission.capture('acceptance',{...assistance,help:'yes'});
    admission.retire();
    expect(admission.capture('first-accepted',assistance)).toBeNull();
    let root=emptyRoot(token(100),true);
    root=applyObservation(root,first.generation,first.observation).root;
    root=applyObservation(root,accepted.generation,accepted.observation).root;
    expect(root.entries[0].outcome).toBe('accepted');
    const retired=createRecordAdmission({token:token(2),generation:token(100),identity:obs(2).identity,support:'high'});
    retired.retire(); expect(retired.capture('first-retry',assistance)).toBeNull();
  });  it('bounds storage and refuses late acceptance of evicted records', () => {
    let r=emptyRoot(token(100),true); for(let n=1;n<=31;n++) r=applyObservation(r,token(100),obs(n)).root;
    expect(r.entries).toHaveLength(30); expect(r.entries[0].token).toBe(token(2));
    expect(applyObservation(r,token(100),obs(1,'acceptance')).result).toBe('missing');
    expect(applyObservation(r,token(101),obs(40)).result).toBe('stale');
  });
  it('recognizes reversed repeated pairs without breadth inference', () => {
    let r=emptyRoot(token(100),true); r=applyObservation(r,token(100),obs(1,'first-accepted')).root;
    r=applyObservation(r,token(100),obs(2,'first-accepted','plan45-compare-08')).root;
    expect(projectRecord(r).map(x=>x.repeated)).toEqual([false,true]);
  });
  it('rejects arbitrary fields, corrupted or incompatible revisions and unknown assistance', () => {
    const r=emptyRoot(token(100),true);
    expect(()=>applyObservation(r,token(100),{...obs(1),raw:'pasted text'})).toThrow();
    expect(()=>validateRoot({...r,contract:2})).toThrow();
    expect(()=>applyObservation(r,token(100),{...obs(1),assistance:{...assistance,help:'maybe'}})).toThrow();
    expect(()=>identityFromContext({...resolvePlan49Context('plan45-compare-02'),cueId:'changed'})).toThrow();
  });
  it('does not report a save when the storage transaction aborts', async () => {
    const root=emptyRoot(token(100),true);
    const fakeDb={transaction() {
      const tx={ error:new Error('synthetic quota abort'), objectStore() { return {
        get() { const request={}; queueMicrotask(()=>{request.result=root;request.onsuccess();}); return request; },
        put() { queueMicrotask(()=>tx.onabort()); }
      }; }, abort() { queueMicrotask(()=>tx.onabort()); } }; return tx;
    }};
    const fakeIdb={open() {const request={};queueMicrotask(()=>{request.result=fakeDb;request.onsuccess();});return request;}};
    const storage=createComparisonRecordStorage({indexedDB:fakeIdb});
    await expect(storage.record(token(100),obs(1))).rejects.toThrow('synthetic quota abort');
    expect(root.entries).toHaveLength(0);
  });  it('rejects contradictory assistance on reads and acceptance updates', () => {
    let root=emptyRoot(token(100),true);
    const yes={...assistance,model:'yes'};
    root=applyObservation(root,token(100),{...obs(1,'first-accepted'),assistance:yes}).root;
    const corrupt=structuredClone(root); corrupt.entries[0].acceptedAssistance={...corrupt.entries[0].acceptedAssistance,model:'no'};
    expect(()=>validateRoot(corrupt)).toThrow();
    let retry=emptyRoot(token(100),true);
    retry=applyObservation(retry,token(100),{...obs(2),assistance:yes}).root;
    expect(()=>applyObservation(retry,token(100),obs(2,'acceptance'))).toThrow();
    expect(()=>applyObservation(retry,token(100),{...obs(2,'acceptance'),assistance:{...assistance,model:'unknown'}})).toThrow();
    const uncertain={...assistance,model:'unknown'};
    let unknown=emptyRoot(token(100),true);
    unknown=applyObservation(unknown,token(100),{...obs(3),assistance:uncertain}).root;
    expect(applyObservation(unknown,token(100),{...obs(3,'acceptance'),assistance:uncertain}).result).toBe('updated');
    expect(()=>applyObservation(unknown,token(100),obs(3,'acceptance'))).toThrow();
  });
  it('closes a late success after a blocked open without breaking a newer open', async () => {
    const requests=[]; let oldClosed=0, newClosed=0;
    const root=emptyRoot(token(100),true);
    const working={close(){newClosed++;},transaction(){const tx={objectStore(){return {get(){const req={};queueMicrotask(()=>{req.result=root;req.onsuccess();queueMicrotask(()=>tx.oncomplete());});return req;}}}};return tx;}};
    const fakeIdb={open(){const req={};requests.push(req);return req;}};
    const storage=createComparisonRecordStorage({indexedDB:fakeIdb});
    const first=storage.read(); requests[0].onblocked(); await expect(first).rejects.toThrow('open blocked');
    const second=storage.read(); requests[1].result=working; requests[1].onsuccess();
    requests[0].result={close(){oldClosed++;}}; requests[0].onsuccess();
    expect((await second).generation).toBe(token(100)); expect(oldClosed).toBe(1); expect(newClosed).toBe(0);
    expect((await storage.read()).generation).toBe(token(100));
  });  it('reports unavailable storage without claiming success', async () => {
    const storage=createComparisonRecordStorage({indexedDB:null});
    await expect(storage.enable()).rejects.toThrow('storage unavailable');
  });
});
