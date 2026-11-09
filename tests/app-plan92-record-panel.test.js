import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPlan92RecordPanel } from '../src/app/plan92-record-panel.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('Plan 92 isolated expanded history panel', () => {
  afterEach(teardownMockDOM);
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
  it('does not open history while consent is off, then shows only summarized outcomes', async () => {
    const doc=setupMockDOM(), root=doc.createElement('div');doc.body.appendChild(root);
    const bridge={readHistory:vi.fn(async()=>({meta:{enabled:true},entries:[{role:'C',first:'retry',accepted:'yes',firstAssistance:'assisted',acceptedAssistance:'assisted',identity:{answer:'secret'}}]})),enableExpanded:vi.fn(),stopExpanded:vi.fn(),clear:vi.fn()};
    const panel=createPlan92RecordPanel({root,bridge});
    expect(await panel.refresh()).toBe(false);expect(bridge.readHistory).not.toHaveBeenCalled();
    panel.setConsentEnabled(true);await panel.refresh();expect(bridge.readHistory).not.toHaveBeenCalled();
    await panel.elements.inspectButton.click();await settle();
    expect(bridge.readHistory).toHaveBeenCalledTimes(1);
    expect(panel.elements.list.textContent).toContain('first response needed another try');
    expect(panel.elements.list.textContent).not.toContain('secret');
    panel.destroy();
  });
  it('enables explicitly, stops without deleting entries, and confirms cross-record Clear', async()=>{
    const doc=setupMockDOM(),root=doc.createElement('div');doc.body.appendChild(root);
    let on=false;const meta={enabled:true,epoch:'x'};const bridge={readHistory:vi.fn(),readExpandedMeta:vi.fn(async()=>({enabled:on})),enableExpanded:vi.fn(async()=>{on=true;return meta;}),stopExpanded:vi.fn(async()=>{on=false;return 'stopped';}),clear:vi.fn(async()=>({legacyEnabled:true,expandedEnabled:false}))};
    const ask=vi.fn(()=>true), panel=createPlan92RecordPanel({root,bridge,confirm:ask});
    await panel.elements.enableButton.click();
    await settle();
    expect(bridge.enableExpanded).toHaveBeenCalledTimes(1);
    await panel.elements.stopButton.click();await settle();expect(bridge.stopExpanded).toHaveBeenCalledTimes(1);
    expect(panel.elements.status.textContent).toContain('Earlier entries remain until you clear');
    await panel.elements.clearButton.click();await settle();expect(ask).toHaveBeenCalledTimes(1);expect(bridge.clear).toHaveBeenCalledTimes(1);
    expect(panel.elements.status.textContent).toContain('Both practice records were cleared');
  });
  it('reports failed storage operations without claiming success', async()=>{
    const doc=setupMockDOM(),root=doc.createElement('div');doc.body.appendChild(root);
    let on=false;const bridge={readHistory:vi.fn(async()=>{throw Error('quota')}),readExpandedMeta:vi.fn(async()=>({enabled:on})),enableExpanded:vi.fn(async()=>{throw Error('blocked')}),stopExpanded:vi.fn(),clear:vi.fn(async()=>{throw Error('blocked')})};
    const panel=createPlan92RecordPanel({root,bridge,confirm:()=>true});
    await panel.elements.enableButton.click();await settle();expect(panel.elements.status.textContent).toContain('result could not be confirmed');
    on=true;panel.setConsentEnabled(true);await panel.elements.inspectButton.click();await settle();expect(panel.elements.status.textContent).toContain('result could not be confirmed');
    await panel.elements.clearButton.click();await settle();expect(panel.elements.status.textContent).toContain('result could not be confirmed');
    expect(panel.elements.status.textContent).not.toContain('cleared');
  });
  it('guards duplicate actions while pending and synchronizes consent from metadata', async()=>{
    const doc=setupMockDOM(),root=doc.createElement('div');doc.body.appendChild(root);
    let resolveEnable;let on=false;const bridge={readExpandedMeta:vi.fn(async()=>({enabled:on})),enableExpanded:vi.fn(()=>new Promise(resolve=>{resolveEnable=resolve;})),readHistory:vi.fn(),stopExpanded:vi.fn(),clear:vi.fn()};
    const panel=createPlan92RecordPanel({root,bridge});
    const pending=panel.elements.enableButton.click();expect(panel.elements.enableButton.disabled).toBe(true);
    await panel.elements.enableButton.click();expect(bridge.enableExpanded).toHaveBeenCalledTimes(1);
    on=true;resolveEnable({enabled:true});await pending;await settle();
    expect(bridge.readExpandedMeta).toHaveBeenCalledTimes(1);expect(panel.elements.status.textContent).toContain('Remembering is on');
  });
  it('does not inspect off-state history automatically, but View can inspect stored entries after Stop', async()=>{
    const doc=setupMockDOM(),root=doc.createElement('div');doc.body.appendChild(root);
    let on=false;const history={meta:{enabled:false},entries:[{role:'I',first:'accepted',accepted:'yes',firstAssistance:'unassisted'}]};
    const bridge={readExpandedMeta:vi.fn(async()=>({enabled:on})),readHistory:vi.fn(),inspectHistory:vi.fn(async()=>history)};
    const panel=createPlan92RecordPanel({root,bridge});
    expect(await panel.refresh()).toBe(false);expect(bridge.inspectHistory).not.toHaveBeenCalled();expect(bridge.readHistory).not.toHaveBeenCalled();
    await panel.elements.inspectButton.click();await settle();
    expect(bridge.inspectHistory).toHaveBeenCalledTimes(1);expect(bridge.readHistory).not.toHaveBeenCalled();
    expect(panel.elements.status.textContent).toContain('Remembering is off. Earlier stored entries');
    expect(panel.elements.list.textContent).toContain('first response was accepted');
  });
  it('uses authoritative consent before Stop when this tab has stale off-state', async()=>{
    const doc=setupMockDOM(),root=doc.createElement('div');doc.body.appendChild(root);let on=true;
    const bridge={readExpandedMeta:vi.fn(async()=>({enabled:on})),stopExpanded:vi.fn(async()=>{on=false;} )};
    const panel=createPlan92RecordPanel({root,bridge,consentEnabled:false});
    await panel.elements.stopButton.click();await settle();
    expect(bridge.stopExpanded).toHaveBeenCalledTimes(1);expect(bridge.readExpandedMeta).toHaveBeenCalledTimes(2);
    expect(panel.elements.status.textContent).toContain('Remembering stopped');
  });
});
