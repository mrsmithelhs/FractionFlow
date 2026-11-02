import { createServer } from 'vite';
import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
const server=await createServer({server:{host:'127.0.0.1',port:5301,strictPort:true}}); await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1093,height:614}});
 await page.goto('http://127.0.0.1:5301/FractionFlow/#directed-number-line-endpoint');
 await page.evaluate(async()=>{
  const module=await import('/FractionFlow/src/app/app.js');
  const events=[]; const add=EventTarget.prototype.addEventListener, remove=EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener=function(type,fn,opts){if((this===window||this===document)&&['scroll','resize','keydown'].includes(type)) events.push({op:'add',target:this===window?'window':'document',type,fn});return add.call(this,type,fn,opts);};
  EventTarget.prototype.removeEventListener=function(type,fn,opts){if((this===window||this===document)&&['scroll','resize','keydown'].includes(type)) events.push({op:'remove',target:this===window?'window':'document',type,fn});return remove.call(this,type,fn,opts);};
  const root=document.createElement('div');root.id='isolated-plan59-app';document.body.append(root);
  window.plan59Probe={events,root,make:()=>module.createFractionFlowApp({root}),app:null};
  window.plan59Probe.app=window.plan59Probe.make().mount();
 });
 const host=page.locator('#isolated-plan59-app'),axis=host.locator('.plan59-axis:visible'),tile=host.locator('.plan59-drag-tile:visible');
 await axis.scrollIntoViewIfNeeded();const card=await tile.boundingBox(),line=await axis.boundingBox();
 const x=card.x+card.width/2,y=card.y+card.height/2,dy=y-(card.y+card.height);
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(line.x+line.width/2,line.y+line.height/2+dy,{steps:5});
 assert.equal(await host.locator('.is-dragging').count(),1);
 const old=await tile.elementHandle();await page.evaluate(()=>window.plan59Probe.app.destroy());await page.mouse.up();
 assert.equal(await host.locator('.is-dragging, .plan53-highlight').count(),0,'WITNESS_DESTROY_GHOST');
 const outstanding=await page.evaluate(()=>{const e=window.plan59Probe.events;return e.filter(a=>a.op==='add'&&!e.some(b=>b.op==='remove'&&b.target===a.target&&b.type===a.type&&b.fn===a.fn)).map(({target,type})=>({target,type}));});
 assert.deepEqual(outstanding,[],'WITNESS_DESTROY_LISTENERS');
 await old.evaluate(el=>el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:1,clientX:100,clientY:100})));
 await page.evaluate(()=>{window.plan59Probe.app=window.plan59Probe.make().mount();});
 assert.equal(await host.locator('.plan59-position').first().textContent(),'Endpoint not placed.','WITNESS_DESTROY_REMOUNT');
 console.log('PASS captured app teardown, listeners and fresh remount');
} finally {await browser.close();await server.close();}
