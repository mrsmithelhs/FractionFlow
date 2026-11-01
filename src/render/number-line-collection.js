import { assertValidScene } from './contract.js';

// One view owns its gesture; committed placements always arrive through scene.
export function createNumberLineCollectionRenderer({container, view, dispatch, progression, helpOpen, toggleHelp}) {
  let root=null, scene=null, gesture=null, destroyed=false;
  const el=(tag, cls, text) => { const n=document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; };
  const button=(label,handler,cls='') => {const b=el('button',cls,label); b.type='button'; b.addEventListener('click',event=>{if(!destroyed && root?.isConnected && root.contains(b)) handler(event);}); return b;};
  const c=()=>scene.meaning.collection;
  const intent=(type,fields={})=>({type,context:c().context,...fields});
  function cancelGesture() { if(!gesture)return; const g=gesture; gesture=null; try {g.token.releasePointerCapture(g.pointerId);} catch {} g.token.classList.remove('is-dragging'); root?.querySelector('.plan50-highlight')?.classList.remove('plan50-highlight'); }
  const escape = e => {if(e.key === 'Escape' && gesture) {cancelGesture(); dispatch(null);}};
  document.addEventListener('keydown',escape);
  function destroy() {cancelGesture();document.removeEventListener('keydown',escape);destroyed=true;root?.remove();root=null;}
  function render(next) {
    assertValidScene(next); scene=next;
    if (gesture) return;
    const wasFocus=root?.contains(document.activeElement) ? document.activeElement?.dataset?.focusKey : null;
    const model=c(); const active=model.status==='active';
    const r=el('section','plan50-collection'); r.setAttribute('aria-label','Place fractions on a number line');
    const title=el('h2','plan50-prompt','Place each fraction on the number line. Some may belong at the same point.'); title.tabIndex=-1; r.append(title);
    const list=el('div','plan50-member-list'); list.setAttribute('aria-label','Fractions'); list.setAttribute('aria-live','polite');
    for(const m of model.members) {
      const pos=model.placements[m.id]; const count=pos ? Object.values(model.placements).filter(v=>v===pos).length : 0; const status=pos ? `${pos.slice(5)} of ${model.lattice}${count>1 ? `, ${count} labels at this point` : ''}` : 'unplaced';
      const b=button(`${m.form.numerator}/${m.form.denominator} — ${status}`,()=>dispatch(intent('select-collection-member',{memberId:m.id})), 'plan50-member');
      b.dataset.focusKey=`member-${m.id}`; const memberFeedback=model.evaluation.feedbackByMember[m.id]; if(active && model.evaluation.status!=='unchecked' && memberFeedback && memberFeedback!=='not-graded') b.setAttribute('aria-describedby',`plan50-feedback-${view}-${m.id}`); b.setAttribute('aria-pressed',String(model.selectedMemberId===m.id)); b.disabled=!active; list.append(b);
    }
    r.append(list);
    const feedback=el('p','plan50-feedback'); feedback.tabIndex=-1; feedback.dataset.focusKey='feedback'; feedback.setAttribute('role','status');
    if(model.evaluation.status==='incomplete') feedback.textContent='Place the unplaced fractions before checking.';
    else if(model.evaluation.status==='incorrect') feedback.textContent='Check the marked placements. You can move any fraction.';
    else if(model.evaluation.status==='accepted') feedback.textContent='All fractions are placed. Labels at the same point name the same amount.';
    else if(model.evaluation.placementRevision!==null) feedback.textContent='Placement changed. Check again.';
    r.append(feedback);
    if(active && model.evaluation.status!=='unchecked') {
      const details=el('ul','plan50-feedback-list');
      for(const m of model.members) {const f=model.evaluation.feedbackByMember[m.id]; if(f && f!=='not-graded') {const item=el('li','',`${m.form.numerator}/${m.form.denominator}: ${f==='correct'?'placed correctly':f==='unplaced'?'unplaced':'check this placement'}`);item.id=`plan50-feedback-${view}-${m.id}`;details.append(item);}} r.append(details);
    }
    if(view==='visual') {
      const tray=el('div','plan50-tray'); tray.setAttribute('aria-label','Unplaced fractions');
      for(const m of model.members.filter(x=>!model.placements[x.id])) tray.append(makeToken(m)); r.append(tray);
      const area=el('div','plan50-area');
      const axis=el('div','plan50-axis'); axis.setAttribute('aria-label','Number line from zero to one');
      for(const p of model.candidates) { const marker=el('span','plan50-point'); marker.dataset.candidateId=p.id; if(!model.showPartitions && ![0,model.lattice/2,model.lattice].includes(Number(p.form.numerator))) marker.classList.add('plan50-unmarked'); marker.style.left=`${Number(p.form.numerator)/model.lattice*100}%`; axis.append(marker); }
      axis.addEventListener('click',event=>{if(destroyed || !root?.isConnected || !root.contains(axis) || !active || !model.selectedMemberId)return; const candidate=nearest(axis,event.clientX,event.clientY); if(candidate)dispatch(intent('place-collection-member',{memberId:model.selectedMemberId,candidateId:candidate}));});
      area.append(axis);
      for(let i=0;i<model.members.length;i++) {const m=model.members[i], id=model.placements[m.id]; if(!id)continue; const token=makeToken(m); token.style.bottom=`calc(44px + ${i} * max(48px, 4em))`; token.style.left=`calc(var(--plan50-inset) + (100% - 2 * var(--plan50-inset)) * ${Number(id.slice(5))/model.lattice})`; area.append(token); const tether=el('span','plan50-tether'); tether.style.left=`calc(var(--plan50-inset) + (100% - 2 * var(--plan50-inset)) * ${Number(id.slice(5))/model.lattice})`; tether.style.height=`calc(22px + ${i} * max(48px, 4em))`; area.append(tether); }
      r.append(area); const ends=el('div','plan50-endpoints'); ends.append(el('span','','0'),el('span','','1'));r.append(ends);
    }
    if(active) {
      const controls=el('div','plan50-controls');
      const selected=model.members.find(m=>m.id===model.selectedMemberId); const pos=selected ? model.placements[selected.id] : null;
      const placeIndex=i=>dispatch(intent('place-collection-member',{memberId:selected.id,candidateId:`step-${i}`}));
      const left=button('Move left',()=>placeIndex(pos?Math.max(0,Number(pos.slice(5))-1):0)); left.disabled=!selected; left.dataset.focusKey='left';
      const right=button('Move right',()=>placeIndex(pos?Math.min(model.lattice,Number(pos.slice(5))+1):model.lattice)); right.disabled=!selected;right.dataset.focusKey='right'; controls.append(left,right);
      if(view==='linear') { const label=el('label','','Choose a position ');const select=el('select');select.dataset.focusKey='position'; select.disabled=!selected; const empty=el('option','','Choose a position');empty.value='';select.append(empty);for(const p of model.candidates){const o=el('option','',`${p.form.numerator} of ${model.lattice}`);o.value=p.id;select.append(o);}select.value=pos||'';select.addEventListener('change',()=>{if(!destroyed && root?.isConnected && root.contains(select) && select.value)dispatch(intent('place-collection-member',{memberId:selected.id,candidateId:select.value}));});label.append(select);controls.append(label); }
      const help=button(helpOpen()?'Close help':'Help',toggleHelp); help.dataset.focusKey='help';help.setAttribute('aria-expanded',String(helpOpen()));if(helpOpen())help.setAttribute('aria-controls',`plan50-help-${view}`);controls.append(help);
      const check=button('Check',()=>dispatch(intent('check-collection',{revision:model.placementRevision})));check.dataset.focusKey='check';controls.append(check);r.append(controls);
      if(helpOpen()) {const helpText=el('p','plan50-help','Think about the size of the parts and compare the positions.');helpText.id=`plan50-help-${view}`;r.append(helpText);}
    } else { const p=progression(); if(p?.actionKind!=='none'){if(p.notice)r.append(el('p','',p.notice));r.append(button(p.label,()=>p.onAction(),'plan50-next'));} }
    function makeToken(m) {const t=button('',()=>{if(active)dispatch(intent('select-collection-member',{memberId:m.id}));},'plan50-token');t.tabIndex=-1;t.setAttribute('aria-label',`${m.form.numerator} over ${m.form.denominator}`);t.append(el('span','',m.form.numerator),el('span','plan50-fraction-line'),el('span','',m.form.denominator));if(active)t.addEventListener('pointerdown',e=>begin(e,t,m.id));else t.disabled=true;return t;}
    function nearest(axis,x,y) { const box=axis.getBoundingClientRect();const cy=box.top+box.height/2;if(x<box.left||x>box.right||Math.abs(y-cy)>44)return null;const f=(x-box.left)/box.width*model.lattice;return `step-${Math.max(0,Math.min(model.lattice,Math.ceil(f-0.5)))}`; }
    function begin(e,token,memberId) {if(destroyed || !root?.isConnected || !root.contains(token) || !e.isPrimary || e.button!==0)return; e.preventDefault(); const box=token.getBoundingClientRect(); gesture={pointerId:e.pointerId,token,memberId,x:e.clientX,y:e.clientY,offsetX:e.clientX-(box.left+box.width/2),offsetY:e.clientY-box.bottom,dragging:false};try{token.setPointerCapture(e.pointerId);}catch{gesture=null;return;} dispatch(intent('select-collection-member',{memberId}),true); }
    r.addEventListener('pointermove',e=>{const g=gesture;if(!g||e.pointerId!==g.pointerId)return;if(!g.dragging && Math.hypot(e.clientX-g.x,e.clientY-g.y)<6)return;g.dragging=true;g.token.classList.add('is-dragging');g.token.style.position='fixed';g.token.style.left=`${e.clientX-g.offsetX}px`;g.token.style.top=`${e.clientY-g.offsetY}px`;g.token.style.bottom='auto';const axis=r.querySelector('.plan50-axis');const candidate=nearest(axis,e.clientX-g.offsetX,e.clientY-g.offsetY);r.querySelector('.plan50-highlight')?.classList.remove('plan50-highlight');if(candidate)axis.querySelector(`[data-candidate-id="${candidate}"]`)?.classList.add('plan50-highlight');});
    const finish=e=>{const g=gesture;if(!g||e.pointerId!==g.pointerId)return;const axis=r.querySelector('.plan50-axis');const candidate=g.dragging&&e.type==='pointerup'?nearest(axis,e.clientX-g.offsetX,e.clientY-g.offsetY):null;cancelGesture();if(candidate)dispatch(intent('place-collection-member',{memberId:g.memberId,candidateId:candidate}));else dispatch(null);};
    r.addEventListener('pointerup',finish);r.addEventListener('pointercancel',finish);r.addEventListener('lostpointercapture',finish);
    if(root)root.replaceWith(r);else container.append(r);root=r;
    if(wasFocus) root.querySelector(`[data-focus-key="${wasFocus}"]`)?.focus();
  }
  return {mount:render,update:render,destroy, cancelGesture, focusFeedback:()=>root?.querySelector('.plan50-feedback')?.focus()};
}
