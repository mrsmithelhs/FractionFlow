// Caller-mounted optional history controls. Creation and refresh never enable
// expanded history; the learner must choose the explicit Remember action.
export function createPlan92RecordPanel({
  root,
  bridge,
  consentEnabled = false,
  confirm = (message) => globalThis.confirm?.(message) ?? false,
  onStatus = () => {},
} = {}) {
  if (!root?.ownerDocument && !globalThis.document) throw new TypeError('a document root is required');
  if (!bridge) throw new TypeError('record bridge is required');
  const doc = root.ownerDocument || globalThis.document;
  let enabled = consentEnabled === true, busy = false, destroyed = false;
  const controls = [];
  const section = doc.createElement('section');
  section.className = 'plan92-record-panel';
  section.setAttribute('aria-labelledby', 'plan92-record-title');
  const title = doc.createElement('h2');
  title.id = 'plan92-record-title';
  title.textContent = 'Optional expanded practice history';
  section.appendChild(title);

  const description = doc.createElement('p');
  description.textContent = 'When you choose Remember, this browser can save problems seen, first response results, later completion, and help used when available. The history helps choose future practice. Anyone using this browser may view or add to it. Practice works without remembering, and this history stays on this device.';
  section.appendChild(description);
  const separateRecord = doc.createElement('p');
  separateRecord.textContent = 'The comparison practice record has its own Remember and Stop choices. Turning expanded remembering on or off does not change those choices. Clear removes both records.';
  section.appendChild(separateRecord);

  const status = doc.createElement('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  section.appendChild(status);
  const recorderStatus = doc.createElement('p');
  recorderStatus.className = 'plan92-recorder-status';
  recorderStatus.setAttribute('role', 'status');
  recorderStatus.setAttribute('aria-live', 'polite');
  section.appendChild(recorderStatus);
  const list = doc.createElement('ul');
  section.appendChild(list);

  const button = (label, action) => {
    const element = doc.createElement('button');
    element.type = 'button';
    element.textContent = label;
    controls.push(element);
    element.addEventListener('click', action);
    section.appendChild(element);
    return element;
  };
  const run = async (action) => {
    if (busy || destroyed) return;
    busy = true;
    controls.forEach((element) => { element.disabled = true; });
    try { await action(); }
    finally {
      busy = false;
      if (!destroyed) controls.forEach((element) => { element.disabled = false; });
    }
  };
  const announceError = () => { status.textContent = 'The result could not be confirmed. Refresh the record and try again.'; };
  const syncConsent = async () => {
    if (bridge.readExpandedMeta) {
      const meta = await bridge.readExpandedMeta();
      enabled = meta?.enabled === true;
    }
  };
  const renderEntries = (entries) => {
    list.textContent = '';
    for (const entry of entries || []) {
      const item = doc.createElement('li');
      const activity = ({
        C: 'Compared two fractions',
        I: 'Identified which fraction needed a change to its denominator',
        S: 'Checked which equivalent fraction to keep and which to fix',
        T: 'Found a common denominator and subtracted',
      })[entry.role] || 'Worked on a fraction problem';
      const firstResponse = entry.first === 'unknown'
        ? 'response not recorded'
        : entry.first === 'accepted' ? 'first response was accepted' : 'first response needed another try';
      const finished = entry.accepted === 'yes' ? 'finished' : 'not recorded as finished';
      const help = entry.firstAssistance === 'unknown'
        ? 'help not recorded'
        : entry.firstAssistance === 'assisted' ? 'used help' : 'no help recorded';
      item.textContent = `${activity}: ${firstResponse}; ${finished}. ${help}.`;
      list.appendChild(item);
    }
    if (!(entries || []).length) {
      const item = doc.createElement('li');
      item.textContent = 'No expanded practice history is stored.';
      list.appendChild(item);
    }
  };

  const inspectButton = button('View expanded history', async () => run(async () => {
    try {
      await syncConsent();
      const value = bridge.inspectHistory ? await bridge.inspectHistory() : enabled ? await bridge.readHistory() : null;
      if (!value) {
        list.textContent = '';
        status.textContent = enabled ? 'No expanded practice history is available.' : 'Expanded history is not available on this browser version.';
        return;
      }
      renderEntries(value.entries);
      status.textContent = value.meta?.enabled
        ? 'Expanded history loaded.'
        : 'Remembering is off. Earlier expanded entries remain available to view; no new ones are being saved.';
    } catch { announceError(); }
  }));
  const enableButton = button('Remember expanded practice on this browser', async () => run(async () => {
    try {
      const result = await bridge.enableExpanded();
      await syncConsent();
      if (!result?.enabled || !enabled) throw Error('consent not confirmed');
      status.textContent = 'Expanded remembering is on for this browser. You can view or clear the history, or stop expanded remembering.';
    } catch {
      try { await syncConsent(); } catch { /* Keep the last known consent state. */ }
      announceError();
    }
  }));
  const stopButton = button('Stop expanded remembering', async () => run(async () => {
    try { await syncConsent(); }
    catch { announceError(); return; }
    if (!enabled) { status.textContent = 'Expanded remembering is already off.'; return; }
    try {
      await bridge.stopExpanded();
      await syncConsent();
      if (enabled) throw Error('stop not confirmed');
      list.textContent = '';
      status.textContent = 'Expanded remembering stopped. Earlier entries remain until you clear the records.';
    } catch {
      try { await syncConsent(); } catch { /* Keep the last known consent state. */ }
      announceError();
    }
  }));
  const clearButton = button('Clear practice records on this browser', async () => run(async () => {
    const approved = await confirm('Clear the expanded history, if present, and the separate comparison practice record on this browser? Your remembering choices will stay as they are.');
    if (!approved) return;
    try {
      await bridge.clear();
      await syncConsent();
      list.textContent = '';
      status.textContent = 'Practice records were cleared. Expanded history was cleared if present; your remembering choices were kept.';
    } catch {
      try { await syncConsent(); } catch { /* Keep the last known consent state. */ }
      announceError();
    }
  }));

  const recorderMessages = Object.freeze({
    idle: '',
    available: 'Expanded history can be recorded in this tab.',
    busy: 'Another tab is using expanded history. Practice continues here; recording may be unavailable in this tab.',
    unavailable: 'Expanded history is not recording in this tab. Practice continues without it.',
  });
  const setRecorderStatus = (state) => {
    if (destroyed) return;
    const message = Object.hasOwn(recorderMessages, state) ? recorderMessages[state] : 'Expanded history recording status is unavailable. Practice continues.';
    recorderStatus.textContent = message;
    try { onStatus(message); } catch { /* UI status hooks must not interrupt practice. */ }
  };

  root.appendChild(section);
  return Object.freeze({
    setConsentEnabled(value) {
      enabled = value === true;
      if (!enabled) list.textContent = '';
    },
    setRecorderStatus,
    async refresh() {
      if (bridge.readExpandedMeta) {
        try { await syncConsent(); }
        catch { announceError(); return null; }
      }
      list.textContent = '';
      status.textContent = enabled
        ? 'Expanded remembering is on. Choose View expanded history to inspect saved entries.'
        : 'Expanded history is off. Practice can continue without remembering.';
      return enabled;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      section.parentNode?.removeChild(section);
    },
    elements: Object.freeze({ section, status, recorderStatus, list, inspectButton, enableButton, stopButton, clearButton }),
  });
}
