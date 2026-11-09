import {randomRecordToken} from './comparison-record-storage.js';
import {isMagnitudeEpisodeComplete} from './magnitude-session.js';

// Isolated review seam. Only installed, learner-accessible managed episodes are
// admitted; queued writes carry the authoritative epoch captured at Start.
export function createPlan92Observer({bridge,crypto=globalThis.crypto,onError=()=>{}}){
 let epoch=null,visit=0,active=null,queue=Promise.resolve(),admissions=new Map();
 const enqueue=work=>{queue=queue.then(work).catch(error=>{onError(error)});};
 const firstActions=new Set(['submit-fraction-comparison','select-renaming-side','submit-equivalent-form','keep-inspected-form','repair-inspected-form','submit-subtraction-result']);
 const assistance=state=>((state.helpHistory?.length??0)>0||(state.assistanceHistory?.length??0)>0)?'assisted':'unknown';
 return Object.freeze({
  beginVisit(currentEpoch){epoch=currentEpoch??null;visit++;active=null;admissions=new Map()},
  install({session,manifest}){
   if(!epoch||manifest?.id!=='plan92-prototype') {active=null;return;}
   const entry=manifest.entries[session.index],key=`${visit}:${session.index}`;if(!entry){active=null;return;}
   let admission=admissions.get(key);if(!admission){
    try{admission={token:randomRecordToken(crypto),epoch,entry,first:false,accepted:false,help:false};}catch(e){onError(e);active=null;return;}
    admissions.set(key,admission);enqueue(()=>bridge.writeExposure(admission.epoch,entry,admission.token));
   }
   active=admission;
  },
  observe({before,after,action}){
   const a=active;if(!a||before?.taskContext?.itemId!==a.entry.itemId||after?.taskContext?.itemId!==a.entry.itemId)return;
   if(!firstActions.has(action?.type)||after.responseProvenance?.length!==before.responseProvenance?.length+1)return;
   const response=after.responseProvenance.at(-1),kind=response?.classification?.kind;
   if(!a.first){a.first=true;const retry=(after.retryHistory?.length??0)>(before.retryHistory?.length??0)||kind==='comparison-retry';const used=a.help?'assisted':assistance(before);enqueue(()=>bridge.recordFirst(a.epoch,a.token,retry?'retry':'accepted',used));}
   if(!a.accepted&&isMagnitudeEpisodeComplete(after,a.entry)){a.accepted=true;const used=a.help?'assisted':assistance(after);enqueue(()=>bridge.recordAcceptance(a.epoch,a.token,used));}
  },
  helpOpened(){if(active)active.help=true},
  retire(){active=null},
  settled(){return queue},
 });
}
