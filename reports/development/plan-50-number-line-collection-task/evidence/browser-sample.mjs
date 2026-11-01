import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='reports/development/plan-50-number-line-collection-task/evidence';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const receipts=[];
try {
  for(const viewport of [{width:360,height:740},{width:1093,height:614}]) {
    const page=await browser.newPage({viewport,deviceScaleFactor:viewport.width===1093?1.25:1,reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:5207/FractionFlow/');
    await page.getByRole('button',{name:'Place fractions together on a number line'}).click();
    const visual=page.locator('.app-visual-view');
    const reach=[];for(const target of [visual.locator('.plan50-prompt'),visual.getByRole('button',{name:'Check',exact:true})]) {await target.scrollIntoViewIfNeeded();const box=await target.boundingBox();assert.ok(box && box.width>0 && box.height>0 && box.x>=0 && box.x+box.width<=viewport.width+0.1 && box.y<viewport.height && box.y+box.height>0);reach.push({box,scrollY:await page.evaluate(()=>scrollY)});}
    assert.equal(await visual.locator('.plan50-tray .plan50-token').count(),3);
    assert.equal(await visual.locator('.plan50-area .plan50-token').count(),0);
    await page.screenshot({path:`${out}/collection-${viewport.width}-unplaced.png`,fullPage:true});
    await visual.locator('.plan50-member').first().focus();await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement?.dataset.focusKey),'member-b');await page.keyboard.press('Space');
    assert.equal(await visual.locator('.plan50-member').nth(1).getAttribute('aria-pressed'),'true');
    const retiredAxis=await visual.locator('.plan50-axis').elementHandle();
    await visual.locator('.plan50-member').first().click();
    await retiredAxis.evaluate(axis=>axis.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:100,clientY:100})));
    assert.match(await visual.locator('.plan50-member').first().textContent(),/unplaced/);
    const token=visual.locator('.plan50-tray .plan50-token').first(); await token.scrollIntoViewIfNeeded();
    const t=await token.boundingBox();const axis=await visual.locator('.plan50-axis').boundingBox();
    await page.mouse.move(t.x+t.width/2,t.y+t.height/2);await page.mouse.down();await page.mouse.move(axis.x+axis.width*0.75,axis.y+axis.height/2-t.height/2,{steps:5});
    assert.equal(await visual.locator('.plan50-highlight').count(),1);assert.equal(await visual.locator('.plan50-highlight').getAttribute('data-candidate-id'),'step-6'); await page.mouse.up();
    assert.match(await visual.locator('.plan50-member').first().textContent(),/6 of 8/);
    // A drag outside the axis band cancels and retains the committed placement.
    const placed=visual.locator('.plan50-area .plan50-token').first();await placed.scrollIntoViewIfNeeded();const before=await placed.boundingBox();
    await page.mouse.move(before.x+before.width/2,before.y+before.height/2);await page.mouse.down();await page.mouse.move(before.x+10,before.y-100,{steps:4});await page.mouse.up();
    assert.match(await visual.locator('.plan50-member').first().textContent(),/6 of 8/);
    const captured=visual.locator('.plan50-area .plan50-token').first();await captured.scrollIntoViewIfNeeded();const cap=await captured.boundingBox();
    await page.mouse.move(cap.x+cap.width/2,cap.y+cap.height/2);await page.mouse.down();await page.mouse.move(cap.x+cap.width/2+15,cap.y+cap.height/2+10);
    await captured.evaluate(token=>token.releasePointerCapture(1));await page.mouse.up();
    assert.match(await visual.locator('.plan50-member').first().textContent(),/6 of 8/);
    const mid=visual.locator('.plan50-area .plan50-token').first();await mid.scrollIntoViewIfNeeded();const midbox=await mid.boundingBox();
    await page.mouse.move(midbox.x+midbox.width/2,midbox.y+midbox.height/2);await page.mouse.down();await page.mouse.move(midbox.x+midbox.width/2+15,midbox.y+midbox.height/2+10);
    await page.locator('.app-view-toggle').evaluate(b=>b.click());await page.mouse.up();
    assert.match(await page.locator('.app-linear-view .plan50-member').first().textContent(),/6 of 8/);
    await page.locator('.app-view-toggle').click();
    await page.setViewportSize({width:viewport.width+8,height:viewport.height});await page.setViewportSize(viewport);
    assert.match(await visual.locator('.plan50-member').first().textContent(),/6 of 8/);
    await visual.getByRole('button',{name:'Help',exact:true}).click();assert.equal(await visual.locator('.plan50-help').isVisible(),true);
    await visual.getByRole('button',{name:'Close help'}).click();assert.equal(await visual.locator('.plan50-help').count(),0);
    await page.screenshot({path:`${out}/collection-${viewport.width}-partial.png`,fullPage:true});
    await visual.getByRole('button',{name:'Check',exact:true}).click();
    assert.match(await visual.locator('.plan50-feedback').textContent(),/unplaced/);
    assert.equal(await page.evaluate(()=>document.activeElement?.classList.contains('plan50-feedback')),true);
    for(const idx of [1,2]) {await visual.locator('.plan50-member').nth(idx).click();const line=visual.locator('.plan50-axis');await line.scrollIntoViewIfNeeded();const a=await line.boundingBox();await page.mouse.click(a.x+a.width*0.75,a.y+a.height/2);}
    const collision=await visual.locator('.plan50-area').evaluate(area=>({ties:[...area.querySelectorAll('.plan50-tether')].map(t=>t.getBoundingClientRect().x),boxes:[...area.querySelectorAll('.plan50-token')].map(t=>t.getBoundingClientRect().toJSON())}));
    assert.ok(collision.ties.every(x=>Math.abs(x-collision.ties[0])<0.01));
    for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert.ok(collision.boxes[i].bottom<=collision.boxes[j].top || collision.boxes[j].bottom<=collision.boxes[i].top);
    await page.screenshot({path:`${out}/collection-${viewport.width}-three-collision.png`,fullPage:true});
    for(let i=0;i<3;i++){await visual.locator('.plan50-area .plan50-token').nth(i).click();assert.equal(await visual.locator('.plan50-member').nth(i).getAttribute('aria-pressed'),'true');}
    for(const [idx,step] of [[1,5],[2,4]]) {await visual.locator('.plan50-member').nth(idx).click();const line=visual.locator('.plan50-axis');await line.scrollIntoViewIfNeeded();const a=await line.boundingBox();await page.mouse.click(a.x+a.width*step/8,a.y+a.height/2);}
    const neighbors=await visual.locator('.plan50-area .plan50-token').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
    for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert.ok(neighbors[i].bottom<=neighbors[j].top || neighbors[j].bottom<=neighbors[i].top || neighbors[i].right<=neighbors[j].left || neighbors[j].right<=neighbors[i].left);
    await page.screenshot({path:`${out}/collection-${viewport.width}-neighbors.png`,fullPage:true});
    await visual.locator('.plan50-member').nth(1).click();const line=visual.locator('.plan50-axis');await line.scrollIntoViewIfNeeded();const middle=await line.boundingBox();await page.mouse.click(middle.x+middle.width/2,middle.y+middle.height/2);
    const geometry=await visual.locator('.plan50-area').evaluate(area=>{
      const a=area.getBoundingClientRect(), tokens=[...area.querySelectorAll('.plan50-token')].map(x=>x.getBoundingClientRect().toJSON());
      const ties=[...area.querySelectorAll('.plan50-tether')].map(x=>x.getBoundingClientRect().x);
      return {area:a.toJSON(),tokens,ties,overflow:document.documentElement.scrollWidth-innerWidth};
    });
    assert.equal(geometry.overflow,0); assert.equal(geometry.tokens.length,3); assert.ok(Math.abs(geometry.ties[1]-geometry.ties[2])<0.01);
    for(const box of geometry.tokens) assert.ok(box.width>=44 && box.height>=44 && box.left>=geometry.area.left && box.right<=geometry.area.right);
    for(let i=0;i<3;i++) for(let j=i+1;j<3;j++) {const a=geometry.tokens[i],b=geometry.tokens[j];assert.ok(a.right<=b.left || b.right<=a.left || a.bottom<=b.top || b.bottom<=a.top);}
    await page.screenshot({path:`${out}/collection-${viewport.width}-draft.png`,fullPage:true});
    const bigStyle=await page.addStyleTag({content:'.plan50-collection {font-size:32px} .plan50-collection button {font-size:inherit}'});
    const enlarged=await visual.locator('.plan50-area').evaluate(area=>{const a=area.getBoundingClientRect();return [...area.querySelectorAll('.plan50-token')].map(t=>{const b=t.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,areaLeft:a.left,areaRight:a.right,children:[...t.children].map(child=>child.getBoundingClientRect().toJSON())};});});
    for(const box of enlarged) {assert.ok(box.left>=box.areaLeft-0.1 && box.right<=box.areaRight+0.1);for(const child of box.children) assert.ok(child.left>=box.left-0.1 && child.right<=box.right+0.1 && child.top>=box.top-0.1 && child.bottom<=box.bottom+0.1);}
    for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert.ok(enlarged[i].bottom<=enlarged[j].top || enlarged[j].bottom<=enlarged[i].top || enlarged[i].right<=enlarged[j].left || enlarged[j].right<=enlarged[i].left);
    await page.screenshot({path:`${out}/collection-${viewport.width}-large-text.png`,fullPage:true});await bigStyle.evaluate(x=>x.remove());
    await visual.getByRole('button',{name:'Check',exact:true}).click();assert.match(await visual.locator('.plan50-feedback').textContent(),/All fractions/);
    await page.screenshot({path:`${out}/collection-${viewport.width}-accepted.png`,fullPage:true});
    await visual.locator('.plan50-next').click();assert.match(await visual.locator('.plan50-member').first().textContent(),/7\/8.*unplaced/);
    await visual.locator('.plan50-member').first().click();await visual.getByRole('button',{name:'Move right'}).click();assert.match(await visual.locator('.plan50-member').first().textContent(),/8 of 8/);
    await page.getByRole('button',{name:'Read the steps'}).click();assert.match(await page.locator('.app-linear-view .plan50-member').first().textContent(),/8 of 8/);
    const linear=page.locator('.app-linear-view');
    const retiredSelect=await linear.locator('select').elementHandle();
    await linear.locator('.plan50-member').nth(1).click();
    await retiredSelect.evaluate(select=>{select.value='step-0';select.dispatchEvent(new Event('change',{bubbles:true}));});
    assert.match(await linear.locator('.plan50-member').nth(1).textContent(),/unplaced/);
    // Wrong complete map, editable recovery, then each remaining item through direct progression.
    await linear.locator('.plan50-member').nth(1).focus(); await page.keyboard.press('Enter');
    await linear.locator('select').focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');
    assert.match(await linear.locator('.plan50-member').nth(1).textContent(),/0 of 8/);
    await linear.locator('.plan50-member').nth(2).focus(); await page.keyboard.press('Enter');
    await linear.locator('select').selectOption('step-0');
    await linear.getByRole('button',{name:'Check',exact:true}).focus(); await page.keyboard.press('Enter');
    assert.match(await linear.locator('.plan50-feedback').textContent(),/Check the marked/);
    await page.screenshot({path:`${out}/collection-${viewport.width}-wrong.png`,fullPage:true});
    for(const [member,step] of [[0,7],[1,2],[2,4]]) {await linear.locator('.plan50-member').nth(member).click();await linear.locator('select').selectOption(`step-${step}`);}
    await linear.getByRole('button',{name:'Check',exact:true}).click();assert.match(await linear.locator('.plan50-feedback').textContent(),/All fractions/);await linear.locator('.plan50-next').click();
    for(const answers of [[4,2,4],[4,0,2]]) {
      for(let i=0;i<3;i++){await linear.locator('.plan50-member').nth(i).click();await linear.locator('select').selectOption(`step-${answers[i]}`);}
      await linear.getByRole('button',{name:'Check',exact:true}).click();assert.match(await linear.locator('.plan50-feedback').textContent(),/All fractions/);
      await linear.locator('.plan50-next').click();
    }
    assert.equal(await page.getByRole('button',{name:'Place fractions together on a number line'}).isVisible(),true);
    assert.deepEqual(errors,[]);receipts.push({viewport,reach,geometry,errors,passed:true});await page.close();
  }
  await writeFile(`${out}/browser-sample.json`,JSON.stringify({receipts},null,2));
} finally { await browser.close(); }
