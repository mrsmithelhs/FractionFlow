import { createRecordAdmission, identityFromContext, projectRecord } from './comparison-record.js';
import { createComparisonRecordStorage, randomRecordToken } from './comparison-record-storage.js';
import { HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from '../interaction/support.js';
import { PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION } from '../interaction/episode-definition.js';
import { admitMagnitudeManifest, sessionRecordContext } from './magnitude-session.js';

const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
function contextFor(state) {
  if (state?.episodeDefinition?.id !== 'phase-4-symbolic-fraction-comparison' || state.episodeDefinition.revision !== '2'
      || !same(state.activeCondition, PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION)) return null;
  const support = same(state.support, HIGH_SUPPORT_CONFIGURATION) ? 'high' : same(state.support, MEDIUM_SUPPORT_CONFIGURATION) ? 'medium' : null;
  if (!support) return null;
  try { return { identity: identityFromContext(state.taskContext), support }; } catch { return null; }
}
function assistance(state, helpOpened) {
  if (!Array.isArray(state.assistanceHistory)) return {model:'unknown',help:'unknown',construction:'unknown'};
  const types = state.assistanceHistory.map(x=>x?.type);
  const known = new Set(['comparison-model-request','comparison-help-request','construction-opened','construction-target-revised','construction-help','construction-attempt']);
  if (types.some(t=>!known.has(t))) return {model:'unknown',help:'unknown',construction:'unknown'};
  return {model:types.includes('comparison-model-request')?'yes':'no', help:helpOpened || types.includes('comparison-help-request')?'yes':'no', construction:types.some(t=>t.startsWith('construction-'))?'yes':'no'};
}
export function createComparisonRecordController({ storage = createComparisonRecordStorage(), onChange = () => {} } = {}) {
  let root = null, ready = false, disposed = false, active = null, epoch = 0, message = '';
  let queue = Promise.resolve();
  const channel = typeof globalThis.BroadcastChannel === 'function' ? new BroadcastChannel('fractionflow-comparison-record-change') : null;
  if (channel) channel.onmessage = () => { if (!disposed) refresh(); };
  const notify = () => { if (!disposed) onChange(snapshot()); };
  function snapshot() { return { ready, enabled:Boolean(root?.enabled), entries:root ? projectRecord(root) : [], message, eligible:Boolean(active) }; }
  async function refresh() {
    if (disposed) return;
    const ticket=++epoch;
    try { const value=await storage.read(); if(disposed || ticket!==epoch)return; const invalidated=Boolean(active && (!value?.enabled || active.generation !== value.generation)); if (invalidated) retire(); root=value;ready=true;message=invalidated?'This problem is no longer being remembered.':''; }
    catch { if(disposed || ticket!==epoch)return;retire();root=null;ready=false;message='This record cannot be read. You can reset it.'; }
    notify();
  }
  function retire() { active?.admission.retire();active=null; }
  function install(state, sessionController = null) {
    if (disposed) return false;
    retire();
    if (!ready || !root?.enabled) return false;
    const context=contextFor(state); if(!context)return false;
    let sessionGeneration = null;
    if (sessionController !== null) {
      try {
        const sessionContext = sessionRecordContext(sessionController, state);
        if (!sessionContext) return false;
        const { session, manifest, episode, installed } = sessionContext;
        const admitted = admitMagnitudeManifest(manifest, session.supportId);
        const expected = admitted.prepared[session.index];
        if (!session.active || session.id !== manifest.id || session.revision !== manifest.revision || episode !== state
          || !expected || !installed || !same(installed.state.taskContext, expected.state.taskContext)
          || !same(state.taskContext, expected.state.taskContext) || !same(state.support, expected.state.support)) return false;
        sessionGeneration = session.generation;
      } catch { return false; }
    }
    try { active={admission:createRecordAdmission({token:randomRecordToken(),generation:root.generation,...context}),generation:root.generation,sessionController,sessionGeneration,first:false,helpOpened:false}; return true; }
    catch { message='Practice is available, but this browser could not save the record.';notify();return false; }
  }
  function helpOpened() { if(!disposed && active) active.helpOpened=true; }
  function observe(before,after,action) {
    if (disposed || !active || action?.type !== 'submit-fraction-comparison' || !contextFor(before) || after?.responseProvenance?.length !== before.responseProvenance.length+1) return;
    if (active.sessionController && sessionRecordContext(active.sessionController, after)?.session.generation !== active.sessionGeneration) { retire(); return; }
    const kind=after.responseProvenance.at(-1)?.classification?.kind;
    if (!['comparison-retry','correct-comparison'].includes(kind)) return;
    if (active.first && kind==='comparison-retry') return;
    const origin=active;
    const capture=active.admission.capture(active.first?'acceptance':kind==='correct-comparison'?'first-accepted':'first-retry',assistance(before,active.helpOpened));
    if (!capture)return; active.first=true;
    queue=queue.then(async()=>{
      const ticket=epoch;
      const result=await storage.record(capture.generation,capture.observation);
      if(['stale','missing'].includes(result)) throw new Error(result);
      // Read only after transaction completion. Do not let an older read replace a
      // later clear/stop/refresh, or surface results after the shell is retired.
      if (disposed || ticket!==epoch || root?.generation!==capture.generation) return;
      try {
        const latest=await storage.read();
        if (!disposed && ticket===epoch && root?.generation===capture.generation && latest?.generation===capture.generation) {
          root=latest;notify();
        }
      } catch { /* The committed write stands; a later explicit refresh can report availability. */ }
    }).catch(()=>{if (!disposed && active===origin) {message='Practice is available, but this browser could not save the record.';notify();}});
  }
  async function change(method) {
    if (disposed) return;
    const ticket=++epoch; retire();
    try { const next=await storage[method](); if(disposed || ticket!==epoch)return; root=next;ready=true;channel?.postMessage('changed');message=method==='reset'?'Record reset. Remembering is off.':method==='stop'?'Remembering is off. Earlier activity remains until cleared.':method==='clear'?(next?.enabled?'Record cleared. A new problem is needed before activity can be remembered.':'Record cleared. Remembering is off.'):'Remembering is on. A new problem is needed before activity can be remembered.'; }
    catch {if(disposed || ticket!==epoch)return;root=null;ready=false;message=method==='clear'?'The record could not be cleared. Please try again.':'Practice is available, but this browser could not save the record.';}
    notify();
  }
  return {refresh,install,retire,observe,helpOpened,snapshot,enable:()=>change('enable'),stop:()=>change('stop'),clear:()=>change('clear'),reset:()=>change('reset'),destroy(){disposed=true;retire();++epoch;channel?.close();}};
}
