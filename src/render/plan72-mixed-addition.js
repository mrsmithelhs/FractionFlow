import { createMixedNumeral } from './symbolic.js';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
function numeral(form) { return createMixedNumeral({whole:form.whole,remainder:{numerator:form.numerator,denominator:form.denominator},hasWhole:true,hasRemainder:true,name:form.name}); }
function barsFor(rows) { const bars=el('div','plan72-bars'); bars.setAttribute('aria-hidden','true'); for(const row of rows){const bar=el('div','plan58-bar plan72-bar');for(const filled of row)bar.append(el('span',`plan58-part${filled?' is-shaded':''}`));bars.append(bar);}return bars; }
function operand(form,label,view) {
  const section=el('section','plan72-operand'); section.append(el('h3','',label),numeral(form),el('p','',form.description));
  if(view==='visual') section.append(barsFor(form.rows));
  return section;
}
export function createPlan72Renderer({container,view,dispatch,progression,helpOpen,toggleHelp,active}) {
  let root,model,destroyed=false; const inputs={}, composing=new Set();
  const valid=n=>!destroyed&&active()&&root?.isConnected&&root.contains(n);
  const intent=(type,fields={})=>({type,context:model.context,...fields});
  function commit(input,field){if(!valid(input))return false;if(input.value.length>32){input.value=model.draft[field];root.querySelector('.plan72-feedback').textContent='Use at most 32 characters.';return false;}dispatch(intent('edit-mixed-addition',{field,raw:input.value}));return true;}
  function flushComposition(){for(const field of [...composing]){composing.delete(field);if(!commit(inputs[field],field))return false;}return true;}
  function mount(scene){model=scene.meaning.addition;root=el('section','plan72-addition');root.setAttribute('aria-label','Add mixed numbers');
    const prompt=el('h2','','Add these amounts.'); const operands=el('div','plan72-operands');
    const feedback=el('p','plan72-feedback');feedback.id=`plan72-guidance-${view}`;feedback.tabIndex=-1;
    const controls=el('div','plan58-controls');for(const field of ['whole','pieces']){const label=el('label','plan58-label'),caption=el('span'),input=el('input');input.type='text';input.inputMode='numeric';input.autocomplete='off';input.dataset.field=field;input.setAttribute('aria-describedby',feedback.id);input.addEventListener('compositionstart',()=>composing.add(field));input.addEventListener('compositionend',()=>{if(composing.delete(field))commit(input,field);});input.addEventListener('input',e=>{if(!composing.has(field)&&!e.isComposing)commit(input,field);});label.append(caption,input);controls.append(label);inputs[field]=input;}
    const draft=el('div','plan72-draft');const actions=el('div','plan58-actions');const help=el('button','app-secondary-button','Help');help.type='button';help.addEventListener('click',()=>{if(valid(help)&&flushComposition())toggleHelp();});const check=el('button','control-btn','Check');check.type='button';check.addEventListener('click',()=>{if(valid(check)&&flushComposition())dispatch(intent('check-mixed-addition',{revision:model.draftRevision}));});actions.append(help,check);
    root.append(prompt,operands,feedback,controls,draft,actions,el('div','plan72-help'),el('div','plan72-result'));container.append(root);update(scene);
  }
  function update(scene){model=scene.meaning.addition;const live=model.status==='active',unit=model.unit, pieceUnit=model.pieceUnit;
    const operands=root.querySelector('.plan72-operands');operands.replaceChildren(operand(model.operands[0],'First amount',view),operand(model.operands[1],'Second amount',view));
    for(const field of ['whole','pieces']){const input=inputs[field];input.previousSibling.textContent=field==='whole'?'Whole units in the sum':`${pieceUnit[0].toUpperCase()+pieceUnit.slice(1)} pieces in the sum`;if(!composing.has(field)&&input.value!==model.draft[field])input.value=model.draft[field];input.disabled=!live;}
    const draft=root.querySelector('.plan72-draft');draft.replaceChildren(el('h3','',live?'Your draft':'Your answer'));
    for(const field of ['whole','pieces']){const region=model.regions[field],title=field==='whole'?'Whole units':`${pieceUnit} pieces`,summary=region.status==='valid'?String(region.value):region.status==='missing'?'not entered':'needs correction';draft.append(el('p','',`${title}: ${summary}`));if(view==='visual' && model.draftRows) draft.append(barsFor(model.draftRows[field]));}
    const feedback=root.querySelector('.plan72-feedback');feedback.className='plan72-feedback';feedback.textContent='';
    if(model.evaluation.status==='incorrect'){feedback.textContent='Check both amounts and try again.';feedback.classList.add('house-retry');}
    if(model.evaluation.status==='input'){const messages=[];for(const field of ['whole','pieces']){const status=model.evaluation.fields[field].status,label=field==='whole'?'whole units':`${pieceUnit} pieces`;if(status==='missing')messages.push(`Enter ${label}.`);if(status==='malformed')messages.push(`Use whole-number digits for ${label}.`);if(status==='out-of-range')messages.push(`Enter ${label} from 0 to ${field==='whole'?4:model.pieceLimit}.`);}feedback.textContent=messages.join(' ');feedback.classList.add('house-attention');}
    if(!live){feedback.textContent="That's right.";feedback.classList.add('plan50-success');}
    const actions=root.querySelector('.plan58-actions');actions.hidden=!live;const help=actions.querySelector('button');help.textContent=helpOpen()?'Close help':'Help';help.setAttribute('aria-expanded',String(helpOpen()));
    const helpRegion=root.querySelector('.plan72-help');helpRegion.replaceChildren();if(live&&helpOpen())helpRegion.append(el('p','',`Look at the whole units in each amount. Then count the ${pieceUnit} pieces in both amounts.`));
    const result=root.querySelector('.plan72-result');result.replaceChildren();if(!live){const line=el('p');line.append('The sum is ',createMixedNumeral(model.notation));result.append(line);const p=progression();if(p?.notice)result.append(el('p','',p.notice));if(p?.onAction){const next=el('button','control-btn',p.label);next.type='button';next.addEventListener('click',()=>{if(valid(next))p.onAction();});result.append(next);}}
  }
  return {mount,update,flushComposition,focusFeedback:()=>root?.querySelector('.plan72-feedback')?.focus(),destroy:()=>{destroyed=true;root?.remove();root=null;}};
}
