// Isolated, caller-mounted expanded-history controls; not wired into the app.
export function createPlan92RecordPanel({ root, bridge, consentEnabled = false, confirm = (message) => globalThis.confirm?.(message) ?? false } = {}) {
  if (!root?.ownerDocument && !globalThis.document) throw new TypeError('a document root is required');
  if (!bridge) throw new TypeError('record bridge is required');
  const doc = root.ownerDocument || globalThis.document;
  let enabled = consentEnabled === true, busy = false, destroyed = false;
  const controls = [];
  const section=doc.createElement('section'); section.className='plan92-record-panel'; section.setAttribute('aria-labelledby','plan92-record-title');
  const title=doc.createElement('h2'); title.id='plan92-record-title'; title.textContent='Practice record on this browser'; section.appendChild(title);
  const description=doc.createElement('p'); description.textContent='Remember practice on this browser? We can save which problems you see, your first response result, whether you later finish, and help used, when available. We use this record to choose future practice. Anyone using this browser may see or add to it. You can view or clear it, or stop remembering. Practice also works without remembering. This record stays on this device in this browser.'; section.appendChild(description);
  const status=doc.createElement('p'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); section.appendChild(status);
  const list=doc.createElement('ul'); section.appendChild(list);
  const button=(label,action)=>{const b=doc.createElement('button');b.type='button';b.textContent=label;controls.push(b);b.addEventListener('click',action);section.appendChild(b);return b;};
  const run=async(action)=>{if(busy)return;busy=true;controls.forEach(b=>b.disabled=true);try{await action();}finally{busy=false;controls.forEach(b=>b.disabled=false);}};
  const announceError=()=>{status.textContent='The result could not be confirmed. Refresh the record and try again.';};
  const syncConsent=async()=>{if(bridge.readExpandedMeta){const meta=await bridge.readExpandedMeta();enabled=meta?.enabled===true;}};
  const renderEntries=(entries)=>{list.textContent='';for(const entry of entries||[]){const li=doc.createElement('li');li.textContent=`${entry.role}: ${entry.first==='unknown'?'response not recorded':entry.first==='accepted'?'first response was accepted':'first response needed another try'}; ${entry.accepted==='yes'?'finished':'not recorded as finished'}. Help: ${entry.firstAssistance==='unknown'?'unknown':entry.firstAssistance}.`;list.appendChild(li);}if(!(entries||[]).length){const li=doc.createElement('li');li.textContent='No expanded practice history is stored.';list.appendChild(li);}};
  const inspectButton=button('View practice record',async()=>run(async()=>{try{await syncConsent();const value=bridge.inspectHistory?await bridge.inspectHistory():enabled?await bridge.readHistory():null;if(!value){list.textContent='';status.textContent=enabled?'No expanded practice history is available.':'No expanded history is available on this browser version.';return;}renderEntries(value.entries);status.textContent=value.meta?.enabled?'Practice record loaded.':'Remembering is off. Earlier stored entries are shown; no new entries are being remembered.';}catch{announceError();}}));
  const enableButton=button('Remember practice on this browser',async()=>run(async()=>{try{const result=await bridge.enableExpanded();await syncConsent();if(!result?.enabled||!enabled)throw Error('consent not confirmed');status.textContent='Remembering is on for this browser. You can view or clear the record, or stop remembering.';}catch{try{await syncConsent();}catch{}announceError();}}));
  const stopButton=button('Stop remembering',async()=>run(async()=>{try{await syncConsent();}catch{announceError();return;}if(!enabled){status.textContent='Remembering is already off.';return;}try{await bridge.stopExpanded();await syncConsent();if(enabled)throw Error('stop not confirmed');list.textContent='';status.textContent='Remembering stopped. Earlier entries remain until you clear the record.';}catch{try{await syncConsent();}catch{}announceError();}}));
  const clearButton=button('Clear both practice records',async()=>run(async()=>{if(!confirm('Clear the expanded practice history and the separate comparison practice record on this browser? Both records will be emptied. Your remembering choices will stay as they are.'))return;try{await bridge.clear();await syncConsent();list.textContent='';status.textContent='Both practice records were cleared. Your remembering choices were kept.';}catch{try{await syncConsent();}catch{}announceError();}}));
  root.appendChild(section);
  return Object.freeze({
    setConsentEnabled(value){enabled=value===true;if(!enabled)list.textContent='';},
    async refresh(){if(bridge.readExpandedMeta){try{await syncConsent();}catch{announceError();return null;}}list.textContent='';status.textContent=enabled?'Remembering is on. Select “View practice record” to inspect stored entries.':'Expanded history is off. Practice can continue without remembering.';return enabled;},
    destroy(){if(destroyed)return;destroyed=true;section.parentNode?.removeChild(section);},
    elements:Object.freeze({section,status,list,inspectButton,enableButton,stopButton,clearButton}),
  });
}
