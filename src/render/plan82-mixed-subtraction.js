import { createMixedNumeral } from './symbolic.js';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const numeral=o=>createMixedNumeral({whole:o.whole,remainder:{numerator:o.numerator,denominator:o.denominator},hasWhole:true,hasRemainder:true,name:o.name});
const count=(n,one,many)=>`${n} ${n===1?one:many}`;
function bars(rows,kind) {
  const group=el('div',`plan82-model plan82-${kind}-model`);group.setAttribute('aria-hidden','true');
  rows.forEach((row,i)=>{const line=el('div','plan82-row');line.append(el('span','plan82-row-label',kind==='original' ? (i===rows.length-1?'Eighth pieces':`Whole ${i+1}`) : (i<rows.length-2?`Whole ${i+1}`:i===rows.length-2?'Renamed eighths':'Original eighths')));const bar=el('div','plan58-bar plan82-bar');for(const cell of row)bar.append(el('span',`plan58-part plan82-${cell}`,cell==='removed'?'×':cell==='remaining'?'●':''));line.append(bar);group.append(line);});
  return group;
}
export function createPlan82Renderer({container,view,dispatch,progression,helpOpen,toggleHelp,active}) {
  let root,model,destroyed=false,helpInput=null,helpComposing=false; const inputs={},composing=new Set();
  const valid=n=>!destroyed&&active()&&root?.isConnected&&root.contains(n);
  const intent=(type,extra={})=>({type,context:model.context,...extra});
  function commit(input,field){if(!valid(input))return false;if(input.value.length>32){input.value=model.draft[field];root.querySelector('.plan82-feedback').textContent='Use at most 32 characters.';return false;}dispatch(intent('edit-mixed-subtraction',{field,raw:input.value}));return true;}
  function flushComposition(){if(helpComposing && helpInput){helpComposing=false;dispatch(intent('edit-rename',{raw:helpInput.value}));}for(const field of [...composing]){composing.delete(field);if(!commit(inputs[field],field))return false;}return true;}
  function mount(scene){
    model=scene.meaning.subtraction;root=el('section','plan82-subtraction');root.setAttribute('aria-label','Subtract mixed numbers');
    const operands=el('div','plan82-operands'),feedback=el('p','plan82-feedback');feedback.id=`plan82-guidance-${view}`;feedback.tabIndex=-1;
    const controls=el('div','plan58-controls');
    for(const field of ['whole','pieces']){
      const label=el('label','plan58-label'),input=el('input');input.type='text';input.inputMode='numeric';input.autocomplete='off';input.setAttribute('aria-describedby',feedback.id);
      input.addEventListener('compositionstart',()=>composing.add(field));input.addEventListener('compositionend',()=>{if(composing.delete(field))commit(input,field);});input.addEventListener('input',e=>{if(!composing.has(field)&&!e.isComposing)commit(input,field);});
      label.append(el('span','',field==='whole'?'Whole units left':'Eighth pieces left'));
      if(field==='pieces'){const row=el('span','plan74-piece-entry');const suffix=el('span','plan74-denominator','/ 8');suffix.setAttribute('aria-hidden','true');row.append(input,suffix);label.append(row);}else label.append(input);
      controls.append(label);inputs[field]=input;
    }
    const actions=el('div','plan58-actions'),help=el('button','app-secondary-button','Rename one whole'),check=el('button','control-btn','Check');help.type=check.type='button';
    help.addEventListener('click',()=>{if(valid(help)&&flushComposition())toggleHelp();});check.addEventListener('click',()=>{if(valid(check)&&flushComposition())dispatch(intent('check-mixed-subtraction',{revision:model.draftRevision}));});actions.append(help,check);
    root.append(el('h2','plan82-prompt','Subtract these amounts.'),operands,feedback,controls,actions,el('div','plan82-help'),el('div','plan82-result'));container.append(root);update(scene);
  }
  function update(scene){
    model=scene.meaning.subtraction;const live=model.status==='active',operands=root.querySelector('.plan82-operands');operands.replaceChildren();
    model.operands.forEach((o,i)=>{const section=el('section','plan82-operand');section.append(el('h3','',i?'Amount taken away':'Starting amount'),numeral(o),el('p','plan82-operand-description',o.description));if(live&&view==='visual')section.append(bars(o.rows,'original'));operands.append(section);});
    root.querySelector('.plan82-prompt')?.toggleAttribute('hidden',!live);
    const feedback=root.querySelector('.plan82-feedback');feedback.textContent='';feedback.className='plan82-feedback';
    if(model.evaluation.status==='incorrect'){feedback.textContent='Check the amount left and try again.';feedback.classList.add('house-retry');}
    if(model.evaluation.status==='organize'){feedback.textContent='Your amount is the same. Group eight pieces into a whole, then check again.';feedback.classList.add('house-attention');}
    if(model.evaluation.status==='input'){const messages=[];for(const field of ['whole','pieces']){const s=model.evaluation.fields[field].status,label=field==='whole'?'whole units':'eighth pieces';if(s==='missing')messages.push(`Enter ${label}.`);if(s==='malformed')messages.push(`Use whole-number digits for ${label}.`);if(s==='out-of-range')messages.push(`Enter ${label} from 0 to ${field==='whole'?3:8}.`);}feedback.textContent=messages.join(' ');feedback.classList.add('house-attention');}
    if(!live){feedback.textContent="That's right.";feedback.classList.add('plan50-success');}
    const controls=root.querySelector('.plan58-controls'),actions=root.querySelector('.plan58-actions');
    if(live){for(const field of ['whole','pieces'])if(!composing.has(field)&&inputs[field].value!==model.draft[field])inputs[field].value=model.draft[field];const help=actions.querySelector('button');help.textContent=helpOpen()?'Close renaming help':'Rename one whole';help.setAttribute('aria-expanded',String(helpOpen()));}
    else {controls?.remove();actions?.remove();}
    const helpRegion=root.querySelector('.plan82-help');const previousHelpInput=helpRegion.querySelector('input');const restoreHelp=previousHelpInput===document.activeElement;const caret=restoreHelp?previousHelpInput.selectionStart:null;const caretEnd=restoreHelp?previousHelpInput.selectionEnd:null;helpRegion.replaceChildren();
    if(live&&helpOpen()){
      const a=model.operands[0];
      if(model.help.established){
        const n=model.renamed;const heading=el('h3','','Renamed starting amount');heading.tabIndex=-1;
        helpRegion.append(heading,el('p','',`${count(n.whole,"whole unit","whole units")} and ${n.total} eighths: 8 renamed and ${n.original} original.`));
        if(view==='visual') helpRegion.append(bars([...Array.from({length:n.whole},()=>Array(8).fill('filled')),Array(8).fill('exchanged'),Array.from({length:8},(_,i)=>i<n.original?'original':'empty')],'rename'));
      } else {
        const label=el('label','plan58-label'),input=el('input');input.type='text';input.inputMode='numeric';input.value=model.help.draft;input.maxLength=32;
        label.append(el('span','',`Rename one of ${a.whole} wholes. One whole is 8 eighths. ${Number(a.whole)-1} wholes and how many eighths?`),input);
        const guidance=el('p','plan82-help-feedback');guidance.tabIndex=-1;
        if(model.help.evaluation.status==='incorrect') guidance.textContent='One whole is 8 eighths. Count all the eighths.';
        if(model.help.evaluation.status==='input') guidance.textContent=model.help.evaluation.field.status==='missing'?'Enter the total eighths.':'Use whole-number digits from 0 to 15.';
        helpInput=input;input.addEventListener('compositionstart',()=>{helpComposing=true;});input.addEventListener('compositionend',()=>{if(helpComposing){helpComposing=false;dispatch(intent('edit-rename',{raw:input.value}));}});input.addEventListener('input',e=>{if(!helpComposing&&!e.isComposing)dispatch(intent('edit-rename',{raw:input.value}));});
        const checkHelp=el('button','control-btn','Check renaming');checkHelp.type='button';checkHelp.addEventListener('click',()=>{if(flushComposition())dispatch(intent('check-rename',{revision:model.help.draftRevision}));});
        helpRegion.append(label,guidance,checkHelp);if(restoreHelp){input.focus();input.setSelectionRange(caret,caretEnd);}
      }
    }
    const result=root.querySelector('.plan82-result');result.replaceChildren();if(!live){
      const s=model.settled,n=model.renamed;
      result.append(el('p','',`Rename: ${count(n.whole,"whole unit","whole units")} and ${n.total} eighths, with 8 renamed and ${n.original} original. Take away ${count(s.removedWhole,"whole unit","whole units")}, all ${s.removedOriginal} original eighths, and ${s.removedExchanged} renamed eighths. Left: ${count(s.remainingWhole,"whole unit","whole units")} and ${s.remainingPieces} eighths.`));
      if(view==='visual'){
        result.append(el('p','plan82-key','× taken away · ● left · empty never filled'),bars([...s.wholeCells.map(x=>Array(8).fill(x)),s.exchangedCells,s.originalCells],'settled'));
      }
      const line=el('p');line.append('The difference is ',createMixedNumeral(s.notation));result.append(line);
      const p=progression();if(p?.notice)result.append(el('p','',p.notice));if(p?.onAction){const next=el('button','control-btn',p.label);next.type='button';next.addEventListener('click',()=>{if(valid(next))p.onAction();});result.append(next);}
    }
  }
  return {mount,update,flushComposition,focusFeedback:()=>root?.querySelector('.plan82-feedback')?.focus(),focusHelp:()=> (root?.querySelector('.plan82-help input') ?? root?.querySelector('.plan82-help h3'))?.focus(),focusHelpFeedback:()=>root?.querySelector('.plan82-help-feedback')?.focus(),focusFinal:()=>inputs.whole?.focus(),focusHelpToggle:()=>root?.querySelector('.plan58-actions button')?.focus(),destroy:()=>{destroyed=true;root?.remove();root=null;}};
}
