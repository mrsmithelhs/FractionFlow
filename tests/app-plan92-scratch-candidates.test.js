import { afterEach, describe,it,expect } from 'vitest';
import { PLAN92_SCRATCH_IDENTITIES, preparePlan92ScratchBatch, preparePlan92ScratchCandidate } from '../src/app/plan92-scratch-candidates.js';
import { prepareMagnitudeEntry } from '../src/app/magnitude-session.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';

afterEach(()=>teardownMockDOM());

describe('Plan 92 isolated scratch preparation',()=>{
  it('prepares the exact eleven allowlisted records for both registered supports',()=>{
    for(const support of ['high-support','medium-support']){
      for(const condition of ['phase2-bundle-1','phase2-bundle-2','phase2-bundle-3','phase2-bundle-4']){
        const candidates=preparePlan92ScratchBatch(support,condition);
        expect(candidates).toHaveLength(11);
        expect(candidates.every(x=>x.state&&x.state.status==='active')).toBe(true);
        expect(candidates.map(x=>x.identity.itemId)).toEqual(PLAN92_SCRATCH_IDENTITIES.map(x=>x.itemId));
        for(const candidate of candidates)expect(candidate.state.activeCondition.id).toBe(candidate.identity.role==='C'?'plan45-static-comparison':condition);
      }
    }
  });
  it('matches the shared standalone comparison preparation state exactly',()=>{
    const entry=PLAN92_SCRATCH_IDENTITIES[0];
    const scratch=preparePlan92ScratchCandidate(entry,'high-support','phase2-bundle-1');
    const shared=prepareMagnitudeEntry({...entry,itemRevision:'plan45-record-v1',definitionId:'phase-4-symbolic-fraction-comparison',definitionRevision:'2',underlyingDefinitionRevision:'1',recipeId:'symbolic-fraction-comparison',recipeRevision:'1',taskDataId:'plan45-symbolic-fraction-comparison-task-data',taskDataRevision:'1'},'high-support');
    expect(scratch.state).toEqual(shared.state);
  });
  it('rejects held or changed identities and unknown condition or support',()=>{
    expect(()=>preparePlan92ScratchCandidate({...PLAN92_SCRATCH_IDENTITIES[0],itemId:'held'},'high-support','phase2-bundle-1')).toThrow();
    expect(()=>preparePlan92ScratchCandidate({...PLAN92_SCRATCH_IDENTITIES[0],setRevision:'999'},'high-support','phase2-bundle-1')).toThrow();
    expect(()=>preparePlan92ScratchCandidate(PLAN92_SCRATCH_IDENTITIES[0],'unknown','phase2-bundle-1')).toThrow();
    expect(()=>preparePlan92ScratchCandidate(PLAN92_SCRATCH_IDENTITIES[0],'high-support','unknown')).toThrow();
    for(const entry of PLAN92_SCRATCH_IDENTITIES){
      for(const field of ['authoringRevision','definitionRevision','taskDataRevision'])
        expect(()=>preparePlan92ScratchCandidate({...entry,[field]:'changed'},'high-support','phase2-bundle-1')).toThrow();
      expect(()=>preparePlan92ScratchCandidate({...entry,extra:true},'high-support','phase2-bundle-1')).toThrow();
    }
    const inspect=PLAN92_SCRATCH_IDENTITIES.find(x=>x.stimulusId);
    expect(()=>preparePlan92ScratchCandidate({...inspect,stimulusId:'changed'},'high-support','phase2-bundle-1')).toThrow();
  });
  it('matches every mounted standalone initial state and preserves replay',()=>{
    for(const entry of PLAN92_SCRATCH_IDENTITIES)for(const support of ['high-support','medium-support']){
      const candidate=preparePlan92ScratchCandidate(entry,support,'phase2-bundle-1');
      const doc=setupMockDOM(),root=doc.createElement('div');doc.body.appendChild(root);
      const type={...candidate.type,items:[candidate.type.items[candidate.itemIndex]]};
      const app=createFractionFlowApp({root,practiceTypes:[type],presentationMode:'instant-test'}).mount();
      root.querySelector('.app-gear-button').click();root.querySelector(`[data-support-id="${support}"]`).click();
      const chooser=root.querySelector('[data-entry-chooser]');if(chooser.getAttribute('aria-expanded')==='false')chooser.click();
      root.querySelector(`[data-practice-type="${entry.typeId}"]`).click();
      expect(app.getState()).toEqual(candidate.state);
      expect(replayEpisode(createReplayEnvelope(candidate.state))).toEqual(candidate.state);
      app.destroy();teardownMockDOM();
    }
  });
});
