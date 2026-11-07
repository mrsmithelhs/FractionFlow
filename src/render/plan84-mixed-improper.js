import { createMixedNumeral, createSymbolicFraction } from './symbolic.js';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const mixed=m=>createMixedNumeral({whole:m.whole,remainder:{numerator:m.numerator,denominator:m.denominator},hasWhole:true,hasRemainder:true,name:`${m.whole} and ${m.numerator} over ${m.denominator}`});
const fraction=f=>createSymbolicFraction(f[0],f[1],{variant:'compact'});
export function createPlan84Renderer({container,view,dispatch,progression,active}) {
  let root,model,destroyed=false;
  const valid=n=>!destroyed && active() && root?.isConnected && root.contains(n);
  const intent=(type,extra={})=>({type,context:model.context,...extra});
  function render(scene) {
    const focusKey=root?.contains(document.activeElement) ? document.activeElement.dataset.focusKey : null;
    model=scene.meaning.bridge;
    const section=el('section','plan84-bridge');section.setAttribute('aria-label','Name a mixed number as a fraction');
    const feedback=el('p','plan84-feedback');feedback.tabIndex=-1;feedback.dataset.focusKey='feedback';feedback.id=`plan84-guidance-${view}`;
    if(model.evaluation.status==='incomplete')feedback.textContent='Choose a fraction first.';
    if(model.evaluation.status==='incorrect')feedback.textContent='Check your choice and try again.';
    if(model.evaluation.status==='accepted')feedback.textContent="That's right.";
    if(model.evaluation.status==='incorrect')feedback.classList.add('house-retry');
    if(model.evaluation.status==='incomplete')feedback.classList.add('house-attention');
    if(model.status==='resolved')feedback.classList.add('plan50-success');
    if(model.status==='active') {
      section.append(el('h2','','Which fraction names the same amount?'),mixed(model.mixed));
      const group=el('fieldset','plan84-options');group.append(el('legend','','Choose one fraction.'));
      model.options.forEach((option,index)=>{
        const label=el('label','plan84-option'),input=el('input');input.type='radio';input.name=`plan84-choice-${view}`;input.value=String(index);input.checked=model.selection===index;input.dataset.focusKey=`choice-${index}`;
        if(feedback.textContent) input.setAttribute('aria-describedby',feedback.id);
        input.addEventListener('change',()=>{if(valid(input)&&input.checked)dispatch(intent('select-mixed-improper',{choice:index}));});
        label.append(input,fraction(option));group.append(label);
      });
      section.append(group,feedback);
      const check=el('button','control-btn','Check');check.type='button';check.dataset.focusKey='check';check.addEventListener('click',()=>{if(valid(check))dispatch(intent('check-mixed-improper',{revision:model.draftRevision}));});section.append(check);
    } else {
      section.append(feedback);
      const v=model.verification;
      const equality=el('p','plan84-equality');equality.append(mixed(model.mixed),document.createTextNode(' = '),fraction(v.fraction));section.append(equality);
      if(view==='visual') {
        const frame=el('div','plan84-frame'),axis=el('div','plan84-axis');axis.setAttribute('aria-hidden','true');
        for(const item of v.ticks){const tick=el('span','plan84-tick');tick.style.left=`${item.percent}%`;if(item.benchmark!==null)tick.append(el('span','plan84-benchmark',item.benchmark));axis.append(tick);}
        const marker=el('span','plan84-marker');marker.style.left=`${v.markerPercent}%`;axis.append(marker);
        const connector=el('span','plan84-connector');connector.style.left=`${v.markerPercent}%`;axis.append(connector);frame.append(axis);
        const labels=el('div','plan84-point-labels');labels.append(el('span','','At the marked point:'),mixed(model.mixed),fraction(v.fraction));frame.append(labels);section.append(frame);
      }
      section.append(el('p','plan84-explanation',v.explanation),el('p','plan84-linear-description',`On a number line from 0 to 2, the whole intervals from 0 to 1 and 1 to 2 are equal. Both forms name the same point.`));
      const p=progression();if(p?.notice)section.append(el('p','',p.notice));if(p?.onAction){const next=el('button','control-btn',p.label);next.type='button';next.dataset.focusKey='next';next.addEventListener('click',()=>{if(valid(next))p.onAction();});section.append(next);}
    }
    if(root)root.replaceWith(section);else container.append(section);root=section;
    if(focusKey) root.querySelector(`[data-focus-key="${focusKey}"]`)?.focus();
  }
  return {mount:render,update:render,flushComposition:()=>true,focusFeedback:()=>root?.querySelector('.plan84-feedback')?.focus(),destroy:()=>{destroyed=true;root?.remove();root=null;}};
}
