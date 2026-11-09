import { createSymbolicFraction } from '../render/symbolic.js';

export function createComparisonRecordPanel({ host, controller, practice, clearIncludesExpanded = false }) {
  const doc=host.ownerDocument ?? globalThis.document;
  const box=doc.createElement('details'); box.className='comparison-record-panel';
  const summary=doc.createElement('summary'); summary.textContent='Practice record'; box.appendChild(summary);
  const content=doc.createElement('div'); box.appendChild(content); host.appendChild(box);
  let alive=true, busy=false, view=false, confirmation=null, renderVersion=0, actionEpoch=0;
  const button=(key,label,fn)=>{
    const version=renderVersion, b=doc.createElement('button');b.type='button';b.textContent=label;
    b.setAttribute('data-record-control',key);b.disabled=busy;
    b.addEventListener('click',()=>{if(alive && version===renderVersion && !busy){++actionEpoch;fn();}});content.appendChild(b);return b;
  };
  function paragraph(text){const p=doc.createElement('p');p.textContent=text;content.appendChild(p);return p;}
  async function perform(method){
    if(!alive || busy)return;busy=true;render();await controller[method]();
    if(!alive)return;busy=false;confirmation=null;render(['enable','stop','reset'].includes(method)?'toggle':method);
  }
  function render(requestedFocus=null){
    if(!alive)return;
    const focused=doc.activeElement;
    const previous=content.contains?.(focused) ? focused?.getAttribute?.('data-record-control') : null;
    const s=controller.snapshot();++renderVersion;content.replaceChildren();
    if(s.message){const p=paragraph(s.message);p.setAttribute('role','status');}
    if(confirmation){
      const prompt={stop:'Stop remembering? Earlier activity stays until you clear it.',clear:clearIncludesExpanded?'Clear the comparison record and expanded practice history on this browser? Both remembering choices will stay as they are.':`Clear comparison activity on this browser? Remembering stays ${s.enabled?'on':'off'}.`,reset:'Reset this unreadable record? This clears it and stops remembering.'}[confirmation];
      paragraph(prompt);button('confirm',confirmation==='stop'?'Stop remembering':confirmation==='clear'?'Clear record':'Reset record',()=>perform(confirmation));
      button('cancel','Cancel',()=>{const target=confirmation==='stop'?'toggle':confirmation;confirmation=null;render(target);});
    } else if(!s.ready){
      paragraph('Practice is available without a record.');button('reset','Reset record and stop remembering',()=>{confirmation='reset';render('confirm');});
    } else {
      paragraph(s.enabled?'Remembering comparison activity on this browser. Anyone using it may see or add to the record.':'Not remembering. A browser record may be shared or lost.');
      if(!s.enabled && s.entries.length)paragraph('Earlier activity remains until cleared.');
      button('toggle',s.enabled?'Stop remembering':'Start remembering',()=>s.enabled?(confirmation='stop',render('confirm')):perform('enable'));
      button('view',view?'Hide record':'View record',async()=>{const ticket=actionEpoch;view=!view;if(view)await controller.refresh();if(alive && ticket===actionEpoch)render('view');});
      if(s.entries.length)button('clear','Clear record',()=>{confirmation='clear';render('confirm');});
      if(view){
        paragraph('Comparison activity on this browser');if(!s.entries.length)paragraph('No recorded comparison activity.');
        const list=doc.createElement('ol');content.appendChild(list);
        for(const {entry,index} of s.entries.map((entry,index)=>({entry,index})).reverse()){
          const li=doc.createElement('li');const pair=doc.createElement('span');pair.className='comparison-record-pair';
          pair.appendChild(createSymbolicFraction(entry.sourceForms.first.numerator,entry.sourceForms.first.denominator,{ariaPrefix:'First fraction'}));
          const separator=doc.createElement('span');separator.textContent=' and ';pair.appendChild(separator);
          pair.appendChild(createSymbolicFraction(entry.sourceForms.second.numerator,entry.sourceForms.second.denominator,{ariaPrefix:'Second fraction'}));li.appendChild(pair);
          const text=entry.first==='accepted'?'Compared correctly.':entry.outcome==='accepted'?'Tried again, then compared correctly.':'Tried again; no correct choice recorded.';
          const label=doc.createElement('span');label.textContent=' — '+text+(entry.repeated?' A repeated pair.':'');li.appendChild(label);
          const details=doc.createElement('details'),heading=doc.createElement('summary');heading.textContent='Assistance details';heading.setAttribute('data-record-control',`detail-${entry.itemId}-${index}`);details.appendChild(heading);
          const p=doc.createElement('p');const describe=a=>['model','help','construction'].map(k=>`${k}: ${a[k]}`).join(', ');
          p.textContent=`Before first choice: ${describe(entry.firstAssistance)}.${entry.acceptedAssistance&&entry.first==='retry'?` Before correct choice: ${describe(entry.acceptedAssistance)}.`:''}`;details.appendChild(p);li.appendChild(details);list.appendChild(li);
        }
        button('practice','Practice comparison',()=>{if(alive)practice();});
      }
    }
    const key=requestedFocus ?? previous;
    if(key){const match=[...content.querySelectorAll('[data-record-control]')].find(el=>el.getAttribute('data-record-control')===key && !el.disabled);(match ?? summary).focus();}
  }
  box.addEventListener('toggle',()=>{if(alive && box.open)controller.refresh(); else if(alive)++actionEpoch;});
  render();return {render,destroy(){alive=false;++renderVersion;++actionEpoch;box.parentNode?.removeChild(box);}};
}
