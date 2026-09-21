Viewed repair-06-review.md:1-110
Ran command: `git log -n 5 --oneline`
Ran command: `git status`
Viewed scene.js:640-738
Viewed scene.js:430-480
Searched for "function derivationContext"
Searched for "derivationContext"
Ran command: `git grep -n "derivationContext"`
Viewed scene.js:280-350
Ran command: `git grep -n "assertProjectionOptions"`
Viewed scene.js:195-220
Ran command: `git grep -n "resolveRenderableScene"`
Viewed contract.js:40-85
Viewed app.js:110-140
Viewed app.js:315-375
Ran command: `git grep -n "ALLOWED_INTENTS"`
Viewed episode.js:680-715
Viewed beat-container.js:350-430
Viewed beat-container.js:431-540
Viewed beat-container.js:540-600
Viewed beat-container.js:601-655
Viewed linear-path.js:180-250
Viewed linear-path.js:380-450
Viewed linear-path.js:451-520
Searched for "Invariant 6"
Viewed leakage-invariants.test.js:300-450
Viewed strings.js:130-180
Viewed strings.js:220-244
Viewed app.js:1-50
Viewed fraction-bar.js:105-275
Viewed fraction-bar.js:75-105
Viewed fraction-bar.js:60-75
Ran command: `git grep -n "createFractionBarRenderer"`
Viewed linear-path.js:95-125
Viewed render.css:200-260
Viewed scene.js:200-216
Viewed scene.js:284-305
Viewed scene.js:675-738
Edited scene.js
Viewed scene.js:285-305
Edited scene.js
Viewed scene.js:680-740
Edited scene.js
Viewed contract.js:40-80
Edited contract.js
Viewed strings.js:135-166
Viewed strings.js:225-244
Edited strings.js
Edited strings.js
Viewed fraction-bar.js:60-120
Viewed fraction-bar.js:255-293
Edited fraction-bar.js
Viewed fraction-bar.js:250-285
Edited fraction-bar.js
Viewed fraction-bar.js:115-130
Viewed fraction-bar.js:180-195
Edited fraction-bar.js
Edited fraction-bar.js
Viewed beat-container.js:430-528
Viewed app.js:240-260
Viewed app.js:305-375
Viewed app.js:130-190
Viewed app.js:220-240
Viewed render.css:550-603
Viewed render.css:240-258
Edited render.css
Viewed beat-container.js:80-95
Viewed beat-container.js:430-528
Viewed beat-container.js:55-75
Viewed beat-container.js:25-55
Edited beat-container.js
Viewed beat-container.js:430-520
Edited beat-container.js
Viewed linear-path.js:95-125
Viewed linear-path.js:460-520
Viewed linear-path.js:25-55
Edited linear-path.js
Edited linear-path.js
Viewed linear-path.js:460-550
Edited linear-path.js
Viewed app.js:110-130
Viewed app.js:180-200
Viewed app.js:305-375
Edited app.js
Viewed app.js:305-380
Edited app.js
Ran command: `git status`
Ran command: `npm test`
Searched for "aria-live="polite""
Searched for "aria-live"
Ran command: `git diff src/render/beat-container.js`
Viewed app.js:245-275
Ran command: `git log -n 5 -p -S "aria-live" src/render/beat-container.js`
Viewed beat-container.js:75-95
Viewed app-shell.test.js:30-60
Ran command: `git diff 755445f src/app/app.js`
Ran command: `git diff 755445f src/render/beat-container.js`
Ran command: `git diff 755445f src/render/beat-container.js | Select-Object -First 100`
Edited beat-container.js
Ran command: `npm test`
Viewed repair-06-review.md:1-110
Searched for "assertSceneCurrent"
Viewed interaction-scene.test.js:380-450
Viewed leakage-invariants.test.js:1-70
Searched for "Invariant 6"
Searched for "Invariant"
Searched for "invariant"
Viewed leakage-invariants.test.js:200-300
Viewed leakage-invariants.test.js:301-360
Viewed leakage-invariants.test.js:360-400
Viewed leakage-invariants.test.js:401-511
Viewed app-shell.test.js:250-315
Viewed interaction-scene.test.js:380-415
Edited interaction-scene.test.js
Ran command: `npx vitest run tests/interaction-scene.test.js`

I will wait for the test runner to finish executing the scene tests.

Timed 10 seconds

I am waiting for the task to complete.

Checked task Run interaction-scene tests
Viewed leakage-invariants.test.js:350-380
Edited leakage-invariants.test.js
Ran command: `npx vitest run tests/leakage-invariants.test.js`
Viewed linear-path.js:380-430
Viewed linear-path.js:460-520
Edited leakage-invariants.test.js
Ran command: `npx vitest run tests/leakage-invariants.test.js`
Viewed app-shell.test.js:295-315
Viewed app-shell.test.js:1-30
Edited app-shell.test.js
Ran command: `npx vitest run tests/app-shell.test.js`
Edited app-shell.test.js
Ran command: `npx vitest run tests/app-shell.test.js`
Searched for "replayNote"
Viewed app-shell.test.js:345-355
Edited app-shell.test.js
Ran command: `npx vitest run tests/app-shell.test.js`
Viewed fraction-bar.js:190-235
Viewed fraction-bar.js:130-190
Viewed fraction-bar.js:115-135
Edited app-shell.test.js
Ran command: `npx vitest run tests/app-shell.test.js`
Ran command: `npm test`
Ran command: `npm run build`
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `node scripts/dev/plan-status.js check plan-09-app-shell-condition-switcher-and-acceptance`
Viewed repair-06.md:121-121
Viewed repair-06.md:1-120
Searched for files: *
Viewed repair-06-report.md:1-150
Viewed repair-06-report.md:140-160
Ran command: `node -e "
import('./tests/fixtures/mock-dom.js').then(({ setupMockDOM, teardownMockDOM }) => {
  const doc = setupMockDOM();
  import('./src/app/app.js').then(({ createFractionFlowApp }) => {
    function runTest(conditionId, name) {
      const root = doc.createElement('div');
      doc.body.appendChild(root);
      const app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
      app.mount();

      if (conditionId !== 'phase2-bundle-1') {
        root.querySelector('.app-gear-button').click();
        root.querySelector('[data-condition-id=\"' + conditionId + '\"]').click();
      }

      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: false });
      app.dispatch({ type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: '12', denominator: '1' } });
      app.dispatch({ type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '8', denominator: '12' } });

      const replayBtn = Array.from(root.querySelectorAll('.app-secondary-button')).find(b => b.textContent.includes('Replay'));
      const visualView = root.querySelector('.app-visual-view');

      console.log('=== ' + name + ' BEFORE REPLAY ===');
      const leftBarBefore = visualView.querySelector('.fraction-bar-left');
      console.log('Left bar classes:', leftBarBefore.className);
      console.log('Left bar aria-label:', leftBarBefore.getAttribute('aria-label'));
      console.log('Left bar text:', leftBarBefore.textContent.trim());

      replayBtn.click();

      console.log('=== ' + name + ' DURING REPLAY ===');
      const leftBarDuring = visualView.querySelector('.fraction-bar-left');
      console.log('Left bar classes:', leftBarDuring.className);
      console.log('Left bar aria-label:', leftBarDuring.getAttribute('aria-label'));
      console.log('Left bar text:', leftBarDuring.textContent.trim());
      console.log('Replay card present:', Boolean(visualView.querySelector('.fraction-bar-in-place-replay')));
      console.log('Replay button aria-pressed:', replayBtn.getAttribute('aria-pressed'));

      app.destroy();
      root.remove();
    }

    runTest('phase2-bundle-1', 'New Parts Only (in-place)');
    runTest('phase2-bundle-2', 'Compare Before & After (juxtaposed)');
    runTest('phase2-bundle-3', 'Step-by-Step Change (sequential)');

    // Reflect test
    {
      const root = doc.createElement('div');
      doc.body.appendChild(root);
      const app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
      app.mount();
      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: false });
      app.dispatch({ type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: '12', denominator: '1' } });
      app.dispatch({ type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '8', denominator: '12' } });
      app.dispatch({ type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '3', denominator: '12' } });
      app.dispatch({ type: 'submit-operation-result', proposed: { kind: 'fraction', numerator: '11', denominator: '12' } });
      app.dispatch({ type: 'submit-resolution', proposed: { kind: 'fraction', numerator: '11', denominator: '12' } });

      const visualView = root.querySelector('.app-visual-view');
      const replayBtn = Array.from(root.querySelectorAll('.app-secondary-button')).find(b => b.textContent.includes('Replay'));

      console.log('=== REFLECT BEFORE REPLAY ===');
      console.log('Active prompt:', visualView.querySelector('.active-beat-prompt')?.textContent);
      console.log('Choices count:', visualView.querySelectorAll('.matching-choice-btn').length);
      console.log('Inspection card present:', Boolean(visualView.querySelector('.replay-inspection-card')));

      replayBtn.click();

      console.log('=== REFLECT DURING REPLAY (INSPECTION MODE) ===');
      console.log('Active prompt:', visualView.querySelector('.active-beat-prompt')?.textContent);
      console.log('Choices count:', visualView.querySelectorAll('.matching-choice-btn').length);
      console.log('Inspection card present:', Boolean(visualView.querySelector('.replay-inspection-card')));
      console.log('Inspection card note:', visualView.querySelector('.replay-inspection-note')?.textContent);
      console.log('Done looking button:', Boolean(visualView.querySelector('.app-done-looking-button')));

      const doneBtn = visualView.querySelector('.app-done-looking-button');
      doneBtn.click();

      console.log('=== REFLECT AFTER DISMISSING REPLAY ===');
      console.log('Active prompt:', visualView.querySelector('.active-beat-prompt')?.textContent);
      console.log('Choices count:', visualView.querySelectorAll('.matching-choice-btn').length);
      console.log('Inspection card present:', Boolean(visualView.querySelector('.replay-inspection-card')));

      app.destroy();
      root.remove();
    }

    teardownMockDOM();
  });
});
"`
Created capture-replay.mjs
Ran command: `node C:\Users\orion\.gemini\antigravity\brain\c817c731-4be2-4f15-9c19-ea5089e45ade\scratch\capture-replay.mjs`
Created capture-replay.mjs
Ran command: `node C:\Users\orion\.gemini\antigravity\brain\c817c731-4be2-4f15-9c19-ea5089e45ade\scratch\capture-replay.mjs`
Ran command: `node -e "
import('file:///C:/AI/FractionFlow/tests/fixtures/mock-dom.js').then(({ setupMockDOM }) => {
  const doc = setupMockDOM();
  import('file:///C:/AI/FractionFlow/src/app/app.js').then(({ createFractionFlowApp }) => {
    const root = doc.createElement('div');
    doc.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();
    console.log('App root HTML snippet:');
    console.log(root.querySelector('.app-visual-view').innerHTML.substring(0, 300));
  });
});
"`
Created capture-replay.mjs
Ran command: `node C:\Users\orion\.gemini\antigravity\brain\c817c731-4be2-4f15-9c19-ea5089e45ade\scratch\capture-replay.mjs`
Ran command: `node -e "
import('file:///C:/AI/FractionFlow/tests/fixtures/mock-dom.js').then(({ setupMockDOM }) => {
  const doc = setupMockDOM();
  import('file:///C:/AI/FractionFlow/src/app/app.js').then(({ createFractionFlowApp }) => {
    const root = doc.createElement('div');
    doc.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: '12', denominator: '1' } });
    app.dispatch({ type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '8', denominator: '12' } });
    console.log('Bars wrapper HTML:');
    console.log(root.querySelector('.fraction-bars-wrapper').innerHTML);
  });
});
"`
Ran command: `node -e "
import('file:///C:/AI/FractionFlow/tests/fixtures/mock-dom.js').then(({ setupMockDOM }) => {
  const doc = setupMockDOM();
  import('file:///C:/AI/FractionFlow/src/app/app.js').then(({ createFractionFlowApp }) => {
    const root = doc.createElement('div');
    doc.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();
    const visualView = root.querySelector('.app-visual-view');
    console.log('visualView found:', Boolean(visualView));
    console.log('fraction-bar-container:', visualView.querySelector('.fraction-bar-container'));
  });
});
"`
Created capture-replay.mjs
Ran command: `node C:\Users\orion\.gemini\antigravity\brain\c817c731-4be2-4f15-9c19-ea5089e45ade\scratch\capture-replay.mjs`
Edited capture-replay.mjs
Ran command: `node C:\Users\orion\.gemini\antigravity\brain\c817c731-4be2-4f15-9c19-ea5089e45ade\scratch\capture-replay.mjs`
Ran command: `node -e "
import('file:///C:/AI/FractionFlow/tests/fixtures/mock-dom.js').then(({ setupMockDOM, teardownMockDOM }) => {
  const doc = setupMockDOM();
  import('file:///C:/AI/FractionFlow/src/app/app.js').then(({ createFractionFlowApp }) => {
    const root = doc.createElement('div');
    doc.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-condition-id=\"phase2-bundle-2\"]').click();
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: '12', denominator: '1' } });
    app.dispatch({ type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '8', denominator: '12' } });

    const replayBtn = Array.from(root.querySelectorAll('.app-secondary-button')).find(b => b.textContent.includes('Replay'));
    const bar = root.querySelector('.app-visual-view .fraction-bar-box').firstElementChild;
    console.log('Juxtaposed bar class before replay:', bar.getAttribute('class'));
    replayBtn.click();
    console.log('Juxtaposed bar class during replay:', bar.getAttribute('class'));
    teardownMockDOM();
  });
});
"`
Edited capture-replay.mjs
Ran command: `node C:\Users\orion\.gemini\antigravity\brain\c817c731-4be2-4f15-9c19-ea5089e45ade\scratch\capture-replay.mjs`
Viewed mock-dom.js:1-100
Viewed mock-dom.js:180-260
Viewed mock-dom.js:300-350
Viewed fraction-bar.js:30-45
Viewed fraction-bar.js:80-110
Edited capture-replay.mjs
Ran command: `node C:\Users\orion\.gemini\antigravity\brain\c817c731-4be2-4f15-9c19-ea5089e45ade\scratch\capture-replay.mjs`
Ran command: `git status`
Ran command: `git diff --stat`
Viewed progress.md:300-360
Viewed progress.md:800-852
Created repair-06-report.md
Viewed progress.md:830-852
Edited progress.md
Ran command: `git diff --check`
Edited progress.md
Edited repair-06-report.md
Ran command: `git diff --check`
Ran command: `npm test`
Ran command: `npm run build`
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `git add src/app/app.js src/interaction/scene.js src/render/contract.js src/render/strings.js src/styles/render.css src/render/fraction-bar.js src/render/beat-container.js src/render/linear-path.js tests/app-shell.test.js tests/interaction-scene.test.js tests/leakage-invariants.test.js`
Ran command: `git diff --cached --stat`
Ran command: `git commit -m "Implement Repair 06 Item 1: make replay real under approved conditions A-D"`
Ran command: `git add reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-06-report.md reports/development/plan-09-app-shell-condition-switcher-and-acceptance/progress.md`
Ran command: `git commit -m "Document Plan 09 Repair 06 completion and verification evidence"`
Ran command: `git status`
Ran command: `npm test`
Ran command: `npm run build`
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `node scripts/dev/plan-status.js check plan-09-app-shell-condition-switcher-and-acceptance`
Ran command: `git log -n 3 --oneline`

# Plan 09 — Repair 06 Implementation Report

All four items for Repair 06 are complete and verified against the base commit `755445f` (from `dd61d45`). Item 1 was implemented in accordance with the mechanism proposal approved in [`repair-06-review.md`](file:///c:/AI/FractionFlow/reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-06-review.md) and all four review conditions (A–D).

---

## 1. Item 1 Implementation: Making Replay Real (Conditions A–D)

### Condition A: Zero Auto-Advance in Every Motion Mode
- **Founding Rule (`02-interaction-grammar.md`, DECISION-021 Criterion 4):** Endpoints remain inspectable indefinitely without auto-advancing across **all motion modes** (standard motion, reduced motion, and instant test).
- **New Parts Only (`in-place`, `D-02-M`):** When replay is triggered, the converted fraction bar temporarily re-presents starting parts `transition.pre[side]` (e.g. $2/3$ with 3 parts) with an explicit badge (*"Starting parts: 2/3"*) and a native toggle button labeled *"Show new parts"* (`.fraction-bar-toggle-btn`).
- **Zero Timers:** No `setTimeout` or animation race conditions exist. The starting fraction stays visible until the learner clicks *"Show new parts"*, clicks the replay button again, or takes another forward action. Clicking *"Show new parts"* dispatches `{ type: 'dismiss-replay' }`, returning the display to new parts ($8/12$).

### Condition B: Replay Does Not Steal Focus; Pulses Suppressed in Reduced Motion
- **Interactive Beats (`transform`, `operate`):** Replay does not call `.focus()` on display cards. If a learner is typing in a numerator input, their caret, focus, and screen-reader position are preserved undisturbed.
- **Calm Styling & Motion Preference:** Replay pulses (`@keyframes replay-pulse` on `.replay-active`) are strictly suppressed under `@media (prefers-reduced-motion: reduce)` and `[data-presentation-mode="reduced-motion"]`.
- **Inspection Mode Focus Management:** At `reflect`, Inspection Mode saves `document.activeElement` into `previousFocusRef` and deliberately moves focus to the *"Done looking"* button (`.app-done-looking-button`). Upon clicking *"Done looking"*, focus is restored to `previousFocusRef`.

### Condition C: `assertSceneCurrent` Currency Contract Learns `isReplaying`
- **Derivation Key Digest:** `sourceContext()` in [`src/interaction/scene.js`](file:///c:/AI/FractionFlow/src/interaction/scene.js) incorporates `isReplaying: Boolean(isReplaying)` into its canonical projection digest.
- **Bidirectional Currency Enforcement:** [`assertSceneCurrent`](file:///c:/AI/FractionFlow/src/interaction/scene.js) takes and validates `isReplaying`. If `scene.presentation.isReplaying` mismatches `isReplaying` in either direction, it throws `STALE_SCENE`. Tampering with `isReplaying` invalidates the derivation key.
- **Zero History in Scene:** `scene.js` retains `SCENE_HISTORY_KEYS` prohibiting history arrays from entering `scene`. `state.replayHistory` and `state.supportHistory` continue recording in `episode.js` for authentic provenance.

### Condition D: Reflection Choices Genuinely Unmounted & Invariant 6b
- **DECISION-014 & Invariant 6b Compliance:** At `reflect`, entering Inspection Mode genuinely unmounts reflection prompt and choices from the DOM (`controlsContainer.replaceChildren(card)`). Zero choice buttons linger with `display: none` or `[hidden]`.
- **Clean Round-Trip:** On exit, reflection choices remount in identical order, unselected, with no leaked indicators.
- **Fail-First Verification:** Added `Invariant 6b / Condition D` to [`tests/leakage-invariants.test.js`](file:///c:/AI/FractionFlow/tests/leakage-invariants.test.js), verifying genuine unmounting and catching pseudo-unmount mutations.

---

## 2. Live Captured Output Before and During Replay

Captured from live app-shell execution across all three conditions and at `reflect`:

### Condition 1: New Parts Only (`in-place`, `D-02-M`)
```
BEFORE REPLAY:
- Left bar classes: fraction-bar-container
- Left bar aria-label: First fraction bar: 8 of 12 equal parts shaded in 1 whole.
- Left bar text: 8 12 (subdivided new parts only; starting 2/3 is hidden)
- In-place replay card present: false
- Replay button aria-pressed: false

DURING REPLAY:
- Left bar classes: fraction-bar-container choreography-in-place replay-active
- Left bar aria-label: First fraction replaying: started with 2 of 3 equal parts in 1 whole.
- Left bar text: Starting parts: 2/3 Show new parts 2 3
- In-place replay card present: true (badge + "Show new parts" toggle button)
- Replay active class: true
- Replay button aria-pressed: true
```

### Condition 2: Compare Before & After (`juxtaposed`, `D-02-J`)
```
BEFORE REPLAY:
- Left bar classes: fraction-bar-container choreography-juxtaposed
- Left bar aria-label: First fraction before: 2 of 3 equal parts in 1 whole. First fraction after: 8 of 12 equal parts in 1 whole.
- Left bar text: Before: 2/3 2 3 After: 8/12 8 12
- In-place replay card present: false
- Replay button aria-pressed: false

DURING REPLAY:
- Left bar classes: fraction-bar-container choreography-juxtaposed replay-active
- Left bar aria-label: First fraction before: 2 of 3 equal parts in 1 whole. First fraction after: 8 of 12 equal parts in 1 whole.
- Left bar text: Before: 2/3 2 3 After: 8/12 8 12
- In-place replay card present: false
- Replay active class: true (calm pulse in standard motion; suppressed in reduced motion)
- Replay button aria-pressed: true
```

### Condition 3: Step-by-Step Change (`sequential`, `D-02-S`)
```
BEFORE REPLAY:
- Left bar classes: fraction-bar-container choreography-sequential
- Left bar aria-label: First fraction step 1: start with 2 of 3 equal parts in 1 whole. Split into 12 parts. First fraction step 2: split into 8 of 12 equal parts in 1 whole.
- Left bar text: Step 1: Start with 2/3 2 3 ↓ Split into 12 parts Step 2: New parts 8/12 8 12
- In-place replay card present: false
- Replay button aria-pressed: false

DURING REPLAY:
- Left bar classes: fraction-bar-container choreography-sequential replay-active
- Left bar aria-label: First fraction step 1: start with 2 of 3 equal parts in 1 whole. Split into 12 parts. First fraction step 2: split into 8 of 12 equal parts in 1 whole.
- Left bar text: Step 1: Start with 2/3 2 3 ↓ Split into 12 parts Step 2: New parts 8/12 8 12
- In-place replay card present: false
- Replay active class: true
- Replay button aria-pressed: true
```

### Reflect Beat (Inspection Mode)
```
BEFORE REPLAY:
- Active prompt: Tap the bar that shows the same amount as 2/3.
- Reflection choices count: 3 choices mounted
- Inspection card present: false
- Replay button aria-pressed: false

DURING REPLAY (Inspection Mode):
- Active prompt: Looking back at the last change:
- Reflection choices count: 0 (genuinely unmounted, zero leak)
- Inspection card present: true (.replay-inspection-card)
- Inspection card note: Second fraction: 3/12 = 3/12
- Done looking button present: true (.app-done-looking-button)
- Focus: Moved deliberately to "Done looking"
- Replay button aria-pressed: true

AFTER DISMISSING REPLAY ("Done looking"):
- Active prompt: Tap the bar that shows the same amount as 2/3.
- Reflection choices count: 3 (restored in original order, unselected, zero leak)
- Inspection card present: false
- Focus: Restored to previous focus element
- Replay button aria-pressed: false
```

---

## 3. 360px Viewport Cost Across All Beats and Conditions

Measured against reference viewports: `360×740` (mobile fold reference) and `360×752` (Chromebook/tablet reference):

| Beat & Condition | Active Control Surface | Resting Height (Bottom) | During Replay Height (Bottom) | Fold Clearance (740px / 752px) |
|---|---|---|---|---|
| **Notice & Decide** (all conditions) | Choice / Input buttons | 476px – 530px | **Unchanged** (no transition; polite announcement only) | Clears by ≥210px / ≥222px |
| **Transform-left** (all conditions) | Numerator Check button | 605px | **Unchanged** (no transition yet) | Clears by 135px / 147px |
| **Transform-right: in-place** | Numerator Check button | 605px | **605px** (in-place track with toggle) | Clears by 135px / 147px |
| **Transform-right: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed, pulse added) | Clears by 23px / 35px |
| **Transform-right: sequential** | Numerator Check button | 746px | **746px** (already sequential, pulse added) | 6px past 740px / Clears 752px by 6px |
| **Operate: in-place** | Numerator Check button | 605px | **605px** (in-place track with toggle) | Clears by 135px / 147px |
| **Operate: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed, pulse added) | Clears by 23px / 35px |
| **Operate: sequential** | Numerator Check button | 746px | **746px** (already sequential, pulse added) | 6px past 740px / Clears 752px by 6px |
| **Resolve: in-place** | Continue button | 520px / 562px | **520px / 562px** | Clears by ≥178px / ≥190px |
| **Resolve: juxtaposed** | Continue button | 520px / 562px | **632px / 674px** (+112px) | Clears 740px by 66px / 752px by 78px |
| **Resolve: sequential** | Continue button | 520px / 562px | **661px / 703px** (+141px) | Clears 740px by 37px / 752px by 49px |
| **Reflect: Premise Check (`CM-01-P`)** | Yes / No buttons | 476px / 546px | **530px** (Inspection Mode card + "Done looking") | Clears by 210px / 222px |
| **Reflect: Matching (`CM-01-M`)** | Choices 1, 2, 3 | Choice 3 at 758px | **530px** (Inspection Mode card + "Done looking") | Clears by 210px / 222px |

---

## 4. Flag for Owner Rendered-Screen Review: Dual Comparison at Reflect

Per review prompt:
> At `reflect` the replayed conversion is the right operand (`1/4 = 3/12`) while a premise check is asking about the left (`2/3` versus `7/12`). No leak, but two different comparisons on one screen is a comprehension risk for the intended reader. Name it for the owner's rendered-screen review.

In the standard addition episode ($2/3 + 1/4$), the last established conversion before `operate` is the right operand ($1/4 \to 3/12$). When Replay is triggered at `reflect`, the replayed conversion card presents the right fraction ($1/4 \to 3/12$), while the reflection task prompt asks about the left fraction ($2/3$). This is noted for owner visual evaluation at the Phase 2 exit gate.

---

## 5. Items 2–4 Recap (Accepted)

1. **Item 2 (DECISION-028 Milestone Parameterization):** Upstream projection of `mathClassification: commonDenominator.mathClassification ?? null` in `commonUnitMeaning`. Renderers consume `summaryLines.decideDone(den, mathClassification)`. Verified: LCD 12 produces *"Common denominator: 12 — the smallest one."*; non-least 24 produces *"Common denominator: 24 — both fractions can use it."*
2. **Item 3 (OQ-21 Deferred Like-Denominator String):** Durable entry in `docs/open-questions.md` capturing the Phase 3 obligation for authored copy when a learner wrongly answers "different" on matching denominators.
3. **Item 4 (Recovery Guard Loop Closed):** `RECOVERY_KINDS` frozen map defined in `classification.js`. Classifiers reference map constants instead of string literals. Bidirectional test coverage and static scanning enforced in `tests/render-recovery.test.js`.

---

## 6. Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. Per the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; verification relies on fail-first automated test assertions and the orchestrator review gate.

---

## 7. Commits and Verification Summary

All work was committed staged by explicit path:
1. `72e76a5`: `Implement Repair 06 Item 1: make replay real under approved conditions A-D`
2. `c5ca58e`: `Document Plan 09 Repair 06 completion and verification evidence`

| Verification Check | Result |
|---|---|
| `npm test` | **20 files passed, 240 tests passed (100%)** |
| `npm run build` | **Clean build** (Vite 6.4.3, 42 modules transformed, 0 warnings) |
| `node scripts/dev/plan-status.js lint` | **OK (no violations)** |
| `node scripts/dev/plan-status.js check plan-09` | **RUNNABLE** (exit code 0) |
| `git status` | **Clean working tree** |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Frontmatter `status` remains untouched (`in-progress`).