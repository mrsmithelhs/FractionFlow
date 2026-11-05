export function createComparisonRecordPanel({ host, controller, practice }) {
  const doc=host.ownerDocument ?? globalThis.document;
  const box=doc.createElement('details'); box.className='comparison-record-panel';
  const summary=doc.createElement('summary'); summary.textContent='Practice record'; box.appendChild(summary);
  const content=doc.createElement('div'); box.appendChild(content); host.appendChild(box);
  let alive=true, busy=false, view=false, confirmation=null;
  const button=(label, fn)=>{const b=doc.createElement('button');b.type='button';b.textContent=label;b.setAttribute('data-record-control',label);b.disabled=busy;b.addEventListener('click',fn);content.appendChild(b);return b;};
  function paragraph(text){const p=doc.createElement('p');p.textContent=text;content.appendChild(p);return p;}
  async function perform(method){ if(busy)return;busy=true;render();await controller[method]();busy=false;confirmation=null;if(alive)render(); }
  function render(){
    if(!alive)return; const focused=doc.activeElement; const focusKey=content.contains?.(focused) ? focused?.getAttribute?.('data-record-control') : null; const s=controller.snapshot(); content.replaceChildren();
    if(s.message) {const p=paragraph(s.message);p.setAttribute('role','status');}
    if(!s.ready){paragraph('Practice is available without a record.');button('Reset record and stop remembering',()=>{confirmation='reset';render();});}
    else {
      paragraph(s.enabled?'Remembering comparison activity on this browser. Anyone using it may see or add to the record.':'Not remembering. A browser record may be shared or lost.');
      if(!s.enabled && s.entries.length) paragraph('Earlier activity remains until cleared.');
      button(s.enabled?'Stop remembering':'Start remembering',()=>s.enabled?(confirmation='stop',render()):perform('enable'));
      button(view?'Hide record':'View record',async()=>{view=!view;if(view)await controller.refresh();render();});
      if(s.entries.length)button('Clear record',()=>{confirmation='clear';render();});
      if(view){
        paragraph('Comparison activity on this browser');
        if(!s.entries.length)paragraph('No recorded comparison activity.');
        const list=doc.createElement('ol');content.appendChild(list);
        for(const entry of [...s.entries].reverse()){
          const li=doc.createElement('li');
          const text=entry.first==='accepted'?'Compared correctly.':entry.outcome==='accepted'?'Tried again, then compared correctly.':'Tried again; no correct choice recorded.';
          const label=doc.createElement('span'); label.textContent=text+(entry.repeated?' A repeated pair.':''); li.appendChild(label);
          const details=doc.createElement('details'), heading=doc.createElement('summary');heading.textContent='Assistance details';details.appendChild(heading);
          const p=doc.createElement('p');const describe=a=>['model','help','construction'].map(k=>`${k}: ${a[k]}`).join(', ');
          p.textContent=`Before first choice: ${describe(entry.firstAssistance)}.${entry.acceptedAssistance&&entry.first==='retry'?` Before correct choice: ${describe(entry.acceptedAssistance)}.`:''}`;details.appendChild(p);li.appendChild(details);list.appendChild(li);
        }
        button('Practice comparison',practice);
      }
    }
    if(confirmation){
      const prompt={stop:'Stop remembering? Earlier activity stays until you clear it.',clear:`Clear comparison activity on this browser? Remembering stays ${s.enabled?'on':'off'}.`,reset:'Reset this unreadable record? This clears it and stops remembering.'}[confirmation];
      paragraph(prompt);button(confirmation==='stop'?'Stop remembering':confirmation==='clear'?'Clear record':'Reset record',()=>perform(confirmation));button('Cancel',()=>{confirmation=null;render();});
    }
    if(focusKey) { const match=[...content.querySelectorAll('[data-record-control]')].find(el=>el.getAttribute('data-record-control')===focusKey && !el.disabled); (match ?? summary).focus(); }
  }
  box.addEventListener('toggle',()=>{if(box.open)controller.refresh();});
  render(); return {render,destroy(){alive=false;box.parentNode?.removeChild(box);}};
}
