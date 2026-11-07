import { createMixedNumeral } from './symbolic.js';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const numeral=o=>createMixedNumeral({whole:o.whole,remainder:{numerator:o.numerator,denominator:o.denominator},hasWhole:true,hasRemainder:true,name:o.name});
export function createPlan78Renderer({container,view,dispatch,progression,helpOpen,toggleHelp,active}) {
  let root,model,destroyed=false; const inputs={},composing=new Set();
  const valid=n=>!destroyed&&active()&&root?.isConnected&&root.contains(n);
  const intent=(type,extra={})=>({type,context:model.context,...extra});
  function commit(input,field){if(!valid(input))return false;if(input.value.length>32){input.value=model.draft[field];root.querySelector('.plan78-feedback').textContent='Use at most 32 characters.';return false;}dispatch(intent('edit-mixed-subtraction',{field,raw:input.value}));return true;}
  function flushComposition(){for(const field of [...composing]){composing.delete(field);if(!commit(inputs[field],field))return false;}return true;}
  function mount(scene){
    model=scene.meaning.subtraction;root=el('section','plan78-subtraction');root.setAttribute('aria-label','Subtract mixed numbers');
    const operands=el('div','plan78-operands'),feedback=el('p','plan78-feedback');feedback.id=`plan78-guidance-${view}`;feedback.tabIndex=-1;
    const controls=el('div','plan58-controls');
    for(const field of ['whole','pieces']){
      const label=el('label','plan58-label'),input=el('input');input.type='text';input.inputMode='numeric';input.autocomplete='off';input.setAttribute('aria-describedby',feedback.id);
      input.addEventListener('compositionstart',()=>composing.add(field));input.addEventListener('compositionend',()=>{if(composing.delete(field))commit(input,field);});input.addEventListener('input',e=>{if(!composing.has(field)&&!e.isComposing)commit(input,field);});
      label.append(el('span','',field==='whole'?'Whole units left':'Eighth pieces left'));
      if(field==='pieces'){const row=el('span','plan74-piece-entry');const suffix=el('span','plan74-denominator','/ 8');suffix.setAttribute('aria-hidden','true');row.append(input,suffix);label.append(row);}else label.append(input);
      controls.append(label);inputs[field]=input;
    }
    const actions=el('div','plan58-actions'),help=el('button','app-secondary-button','Help'),check=el('button','control-btn','Check');help.type=check.type='button';
    help.addEventListener('click',()=>{if(valid(help)&&flushComposition())toggleHelp();});check.addEventListener('click',()=>{if(valid(check)&&flushComposition())dispatch(intent('check-mixed-subtraction',{revision:model.draftRevision}));});actions.append(help,check);
    root.append(el('h2','plan78-prompt','Subtract these amounts.'),operands,feedback,controls,actions,el('div','plan78-help'),el('div','plan78-result'));container.append(root);update(scene);
  }
  function update(scene){
    model=scene.meaning.subtraction;const live=model.status==='active',operands=root.querySelector('.plan78-operands');operands.replaceChildren();
    model.operands.forEach((o,i)=>{const section=el('section','plan78-operand');section.append(el('h3','',i?'Amount taken away':'Starting amount'),numeral(o));operands.append(section);});
    const feedback=root.querySelector('.plan78-feedback');feedback.textContent='';feedback.className='plan78-feedback';
    if(model.evaluation.status==='incorrect'){feedback.textContent='Check the amount left and try again.';feedback.classList.add('house-retry');}
    if(model.evaluation.status==='organize'){feedback.textContent='Your amount is the same. Group eight pieces into a whole, then check again.';feedback.classList.add('house-attention');}
    if(model.evaluation.status==='input'){const messages=[];for(const field of ['whole','pieces']){const s=model.evaluation.fields[field].status,label=field==='whole'?'whole units':'eighth pieces';if(s==='missing')messages.push(`Enter ${label}.`);if(s==='malformed')messages.push(`Use whole-number digits for ${label}.`);if(s==='out-of-range')messages.push(`Enter ${label} from 0 to ${field==='whole'?3:8}.`);}feedback.textContent=messages.join(' ');feedback.classList.add('house-attention');}
    if(!live){feedback.textContent="That's right.";feedback.classList.add('plan50-success');}
    const controls=root.querySelector('.plan58-controls'),actions=root.querySelector('.plan58-actions');
    if(live){for(const field of ['whole','pieces'])if(!composing.has(field)&&inputs[field].value!==model.draft[field])inputs[field].value=model.draft[field];const help=actions.querySelector('button');help.textContent=helpOpen()?'Close help':'Help';help.setAttribute('aria-expanded',String(helpOpen()));}
    else {controls?.remove();actions?.remove();}
    const helpRegion=root.querySelector('.plan78-help');helpRegion.replaceChildren();if(live&&helpOpen())helpRegion.append(el('p','','Think about the whole units and eighth pieces in each number. Which amount is taken away?'));
    const result=root.querySelector('.plan78-result');result.replaceChildren();if(!live){
      const s=model.settled;result.append(el('p','',`Taken away: ${s.removedWhole} whole units and ${s.removedPieces} eighths. Remaining: ${s.remainingWhole} whole units and ${s.remainingPieces} eighths.`));
      if(view==='visual'){
        const key=el('p','','R = removed, L = left, – = not in the starting amount');result.append(key);
        const rows=[...s.wholeCells.map(x=>Array(8).fill(x)),s.pieceCells];
        for(const row of rows){const bar=el('div','plan58-bar plan78-bar');bar.setAttribute('aria-hidden','true');for(const cell of row)bar.append(el('span',`plan58-part plan78-${cell}`,cell==='removed'?'R':cell==='remaining'?'L':'–'));result.append(bar);}
      }
      const line=el('p');line.append('The difference is ',createMixedNumeral(s.notation));result.append(line);
      const p=progression();if(p?.notice)result.append(el('p','',p.notice));if(p?.onAction){const next=el('button','control-btn',p.label);next.type='button';next.addEventListener('click',()=>{if(valid(next))p.onAction();});result.append(next);}
    }
  }
  return {mount,update,flushComposition,focusFeedback:()=>root?.querySelector('.plan78-feedback')?.focus(),destroy:()=>{destroyed=true;root?.remove();root=null;}};
}
