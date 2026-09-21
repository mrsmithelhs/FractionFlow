Ran command: `git status`
Ran command: `git log -n 5 --oneline`
Ran command: `git show --stat 048492f`
Viewed repair-06-item-1-review.md:1-161
Viewed repair-07.md:1-111
Viewed scene.js:555-595
Viewed app.js:310-400
Viewed beat-container.js:840-865
Viewed beat-container.js:810-845
Viewed beat-container.js:110-160
Viewed beat-container.js:180-240
Viewed linear-path.js:610-640
Viewed linear-path.js:640-669
Viewed render.css:250-280
Viewed linear-path.js:120-160
Viewed linear-path.js:95-125
Viewed render.css:240-255
Viewed render.css:305-330
Viewed fraction-bar.js:245-285
Viewed fraction-bar.js:310-345
Searched for "choreography-"
Searched for "choreography-in-place"
Searched for "--ff-"
Viewed strings.js:110-145
Viewed strings.js:145-180
Ran command: `node -e "
import('file:///C:/AI/FractionFlow/tests/fixtures/mock-dom.js').then(({ setupMockDOM, teardownMockDOM }) => {
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

    // Now in transform-right
    const inputBefore = root.querySelector('input');
    inputBefore.focus();
    inputBefore.value = '3';

    console.log('activeElement before replay:', doc.activeElement?.tagName, doc.activeElement?.className);

    const replayBtn = Array.from(root.querySelectorAll('.app-secondary-button')).find(b => b.textContent.includes('Replay'));
    replayBtn.click();

    console.log('activeElement after replay:', doc.activeElement?.tagName, doc.activeElement?.className);
    const inputAfter = root.querySelector('input');
    console.log('input identity across toggle:', inputBefore === inputAfter);
    console.log('input value after replay:', inputAfter?.value);

    teardownMockDOM();
  });
});
"`
Viewed mock-dom.js:230-250
Viewed mock-dom.js:330-380
Searched for "activeElement"
Searched for "focus"
Viewed access-parity.test.js:1-50
Viewed scene.js:565-585
Viewed interaction-scene.test.js:380-420
Edited interaction-scene.test.js
Ran command: `npx vitest run tests/interaction-scene.test.js`
Edited scene.js
Ran command: `npx vitest run tests/interaction-scene.test.js`
Viewed mock-dom.js:180-245
Viewed mock-dom.js:180-250
Viewed mock-dom.js:325-350
Edited mock-dom.js
Edited mock-dom.js
Viewed beat-container.js:190-225
Viewed beat-container.js:40-55
Viewed linear-path.js:30-60
Viewed beat-container.js:190-210
Edited beat-container.js
Viewed beat-container.js:190-205
Viewed beat-container.js:845-866
Edited beat-container.js
Edited beat-container.js
Viewed linear-path.js:160-185
Viewed linear-path.js:205-235
Edited linear-path.js
Edited linear-path.js
Viewed linear-path.js:670-690
Edited linear-path.js
Ran command: `node -e "
import('file:///C:/AI/FractionFlow/tests/fixtures/mock-dom.js').then(({ setupMockDOM, teardownMockDOM }) => {
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

    // Now in transform-right
    const inputBefore = root.querySelector('.app-visual-view input');
    inputBefore.focus();
    inputBefore.value = '3';

    console.log('activeElement before replay:', doc.activeElement?.tagName, doc.activeElement?.getAttribute('id'));

    const replayBtn = Array.from(root.querySelectorAll('.app-secondary-button')).find(b => b.textContent.includes('Replay'));
    replayBtn.click();

    console.log('activeElement after replay:', doc.activeElement?.tagName, doc.activeElement?.getAttribute('id'));
    const inputAfter = root.querySelector('.app-visual-view input');
    console.log('input identity across toggle:', inputBefore === inputAfter);
    console.log('input value after replay:', inputAfter?.value);

    teardownMockDOM();
  });
});
"`
Ran command: `node -e "
import('file:///C:/AI/FractionFlow/tests/fixtures/mock-dom.js').then(({ setupMockDOM, teardownMockDOM }) => {
  const doc = setupMockDOM();
  import('file:///C:/AI/FractionFlow/src/app/app.js').then(({ createFractionFlowApp }) => {
    const root = doc.createElement('div');
    doc.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();

    // Switch to linear view
    const viewBtn = Array.from(root.querySelectorAll('.app-secondary-button')).find(b => b.textContent.includes('Show'));
    viewBtn.click();

    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: '12', denominator: '1' } });
    app.dispatch({ type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '8', denominator: '12' } });

    // Now in transform-right in linear view
    const inputBefore = root.querySelector('.app-linear-view input');
    inputBefore.focus();
    inputBefore.value = '3';

    console.log('Linear activeElement before replay:', doc.activeElement?.tagName, doc.activeElement?.getAttribute('id'));

    const replayBtn = Array.from(root.querySelectorAll('.app-secondary-button')).find(b => b.textContent.includes('Replay'));
    replayBtn.click();

    console.log('Linear activeElement after replay:', doc.activeElement?.tagName, doc.activeElement?.getAttribute('id'));
    const inputAfter = root.querySelector('.app-linear-view input');
    console.log('Linear input identity across toggle:', inputBefore === inputAfter);
    console.log('Linear input value after replay:', inputAfter?.value);

    teardownMockDOM();
  });
});
"`
Ran command: `node -e "
import('file:///C:/AI/FractionFlow/tests/fixtures/mock-dom.js').then(({ setupMockDOM, teardownMockDOM }) => {
  const doc = setupMockDOM();
  import('file:///C:/AI/FractionFlow/src/app/app.js').then(({ createFractionFlowApp }) => {
    const root = doc.createElement('div');
    doc.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();

    // Switch to linear view
    const viewBtn = Array.from(root.querySelectorAll('.app-secondary-button')).find(b => b.textContent.includes('reading') || b.textContent.includes('step'));
    viewBtn.click();

    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: '12', denominator: '1' } });
    app.dispatch({ type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '8', denominator: '12' } });

    // Now in transform-right in linear view
    const inputBefore = root.querySelector('.app-linear-view input');
    inputBefore.focus();
    inputBefore.value = '3';

    console.log('Linear activeElement before replay:', doc.activeElement?.tagName, doc.activeElement?.getAttribute('id'));

    const replayBtn = Array.from(root.querySelectorAll('.app-secondary-button')).find(b => b.textContent.includes('Replay'));
    replayBtn.click();

    console.log('Linear activeElement after replay:', doc.activeElement?.tagName, doc.activeElement?.getAttribute('id'));
    const inputAfter = root.querySelector('.app-linear-view input');
    console.log('Linear input identity across toggle:', inputBefore === inputAfter);
    console.log('Linear input value after replay:', inputAfter?.value);

    teardownMockDOM();
  });
});
"`
Viewed render.css:260-280
Viewed fraction-bar.js:115-195
Viewed linear-path.js:105-130
Viewed render.css:240-280
Viewed fraction-bar.js:115-150
Viewed fraction-bar.js:180-215
Ran command: `git status`
Ran command: `git log -n 5 --oneline`
Viewed repair-07.md:1-111
Ran command: `git diff`
Viewed render.css:250-300
Viewed render.css:300-350
Viewed fraction-bar.js:100-200
Viewed fraction-bar.js:201-280
Viewed fraction-bar.js:281-351
Searched for "choreography-in-place"
Searched for "dismiss-replay"
Viewed app.js:345-400
Viewed c:\AI\FractionFlow\src\app\strings.js:51-101
Searched for files: *string*
Viewed strings.js:30-90
Viewed strings.js:130-180
Viewed linear-path.js:120-190
Viewed linear-path.js:80-125
Searched for files: *.css
Viewed styles.css:1-100
Viewed render.css:1-50
Searched for "choreography-"
Viewed fraction-bar.js:110-145
Viewed fraction-bar.js:180-215
Viewed fraction-bar.js:260-328
Edited fraction-bar.js
Edited fraction-bar.js
Viewed fraction-bar.js:315-330
Edited fraction-bar.js
Viewed linear-path.js:105-125
Edited linear-path.js
Viewed render.css:260-285
Viewed render.css:235-260
Edited render.css
Ran command: `npm test`
Viewed app-shell.test.js:1-100
Viewed app-shell.test.js:350-434
Edited app-shell.test.js
Ran command: `npm test`
Ran command: `npm run build`
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `node scripts/dev/plan-status.js list`
Viewed leakage-invariants.test.js:100-150
Viewed leakage-invariants.test.js:200-250
Viewed leakage-invariants.test.js:251-310
Viewed leakage-invariants.test.js:311-365
Created capture-repair-07.js
Ran command: `node scratch/capture-repair-07.js`
Searched for "resolveRenderableScene"
Edited capture-repair-07.js
Ran command: `node scratch/capture-repair-07.js`
Searched for "PHASE2_REFLECTION_EPISODE_DEFINITION"
Edited capture-repair-07.js
Ran command: `node scratch/capture-repair-07.js`
Searched for "SCENE_PRESENTATION_KEYS"
Searched for "isReplaying"
Searched for "SCENE_"
Viewed scene.js:690-710
Viewed contract.js:45-80
Edited capture-repair-07.js
Viewed capture-repair-07.js:1-10
Viewed capture-repair-07.js:175-191
Edited capture-repair-07.js
Edited capture-repair-07.js
Ran command: `node scratch/capture-repair-07.js`
Searched for "canonicalInstance"
Viewed app.js:30-60
Edited capture-repair-07.js
Ran command: `node scratch/capture-repair-07.js`
Viewed app.js:1-25
Edited capture-repair-07.js
Ran command: `node scratch/capture-repair-07.js`
Viewed mock-dom.js:50-90
Viewed mock-dom.js:90-120
Edited mock-dom.js
Ran command: `node scratch/capture-repair-07.js`
Edited capture-repair-07.js
Ran command: `node scratch/capture-repair-07.js`
Searched for "fold clearance"
Viewed leakage-invariants.test.js:400-445
Ran command: `git status`
Ran command: `Remove-Item -Recurse -Force scratch`
Ran command: `git status`
Ran command: `npm test`
Ran command: `npm run build`
Ran command: `node scripts/dev/plan-status.js lint`
Viewed progress.md:750-850
Viewed progress.md:851-934
Ran command: `git status --short`
Ran command: `git add src/interaction/scene.js src/render/beat-container.js src/render/fraction-bar.js src/render/linear-path.js src/styles/render.css tests/app-shell.test.js tests/fixtures/mock-dom.js tests/interaction-scene.test.js`
Ran command: `git commit -m "Implement Plan 09 Repair 07: true replay provenance, focus preservation, target sizing, reduced motion acknowledgement, and class cleanup"`
Viewed progress.md:910-934
Edited progress.md
Viewed repair-06-report.md:1-60
Created repair-07-report.md
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `git status`
Ran command: `git add reports/development/plan-09-app-shell-condition-switcher-and-acceptance/progress.md reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-07-report.md`
Ran command: `git commit -m "Document Plan 09 Repair 07 completion and verbatim verification evidence"`
Ran command: `git status`
Ran command: `git log -n 5 --oneline`
Ran command: `npm test`

### Plan 09 — Repair 07 Execution Summary

All five items from [`reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-07.md`](file:///c:/AI/FractionFlow/reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-07.md) have been implemented and verified against running code. Implementation commit [`9693853`](file:///c:/AI/FractionFlow) and documentation commit [`76d418e`](file:///c:/AI/FractionFlow) are recorded on `main` with a clean working tree.

---

### 1. Item-by-Item Verification and Captured Evidence

#### Item 1: Replay Presents Actual Change Across Beats
- **Cause & Fix:** In [`src/interaction/scene.js:568`](file:///c:/AI/FractionFlow/src/interaction/scene.js#L568), `transitionMeaning` previously used `findLastIndex` to locate the provenance entry matching `lastConversion`. Because `operation` and `resolution` provenance records retain `lastConversion`, `findLastIndex` selected the newest record whose `precedingState` was already post-conversion, collapsing `pre` and `post` ($3/12 \to 3/12$). Replacing it with `findIndex` selects the original conversion step where `precedingState` carries the genuine pre-conversion form ($1/4$).
- **Failing-First Test:** Added in [`tests/interaction-scene.test.js`](file:///c:/AI/FractionFlow/tests/interaction-scene.test.js). Verified to fail against `c5ca58e` (`Expected denominator: '4', Received: '12'`) and passes after the fix with `pre !== post`.
- **Verbatim Live Captures Across All Four Beats:**
  ```
  --- UI renders across all 4 beats ---
  Beat 1: transform-left:
    notice text: Finish a change before replaying it.
    isReplaying aria-pressed: false

  Beat 2: transform-right:
    replay header badge: Starting parts: 2/3
    toggle button text: Show new parts
    left bar readout: 2/3

  Beat 3: operate:
    replay header badge: Starting parts: 1/4
    toggle button text: Show new parts
    right bar readout: 1/4

  Beat 4: reflect:
    inspection card note: Second fraction: 1/4 = 3/12
    done button text: Done looking
  ```

#### Item 2: Replay Preserves Learner Focus
- **Cause & Fix:** `renderActiveBeat(scene)` in [`src/render/beat-container.js`](file:///c:/AI/FractionFlow/src/render/beat-container.js#L192-L220) and [`src/render/linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js#L230-L255) previously called `activeBeatEl.replaceChildren()` unconditionally, destroying active inputs and dumping focus to `BODY`. Scoped re-rendering using an `activeBeatRenderToken` cache so the active control subtree is not rebuilt when only `isReplaying` toggles outside `reflect`. At `reflect`, Inspection Mode toggles `isInspection` with focus moved to "Done looking" via `previousFocusRef` and restored on exit.
- **Verbatim Live Captures at `transform-right` (with input value `3`):**
  - **Visual Path:**
    ```
    activeElement before replay: INPUT fraction-control control-numeric-input
    input value before replay: 3
    activeElement after replay: INPUT fraction-control control-numeric-input
    input identity preserved: true
    input value after replay: 3
    activeElement after dismissing replay: INPUT fraction-control control-numeric-input
    input value after dismissing replay: 3
    ```
  - **Linear Path:**
    ```
    activeElement before replay: INPUT fraction-control control-numeric-input
    input value before replay: 3
    activeElement after replay: INPUT fraction-control control-numeric-input
    input identity preserved: true
    input value after replay: 3
    activeElement after dismissing replay: INPUT fraction-control control-numeric-input
    ```

#### Item 3: "Show new parts" Toggle Target Size & Fold Clearance
- **Fix:** In [`src/styles/render.css:267`](file:///c:/AI/FractionFlow/src/styles/render.css#L267), added `display: inline-flex; align-items: center; justify-content: center; min-height: 28px; min-width: 44px; box-sizing: border-box; padding: 0.25rem 0.625rem; margin: 2px 0;`.
- **Measured Bounding Box:** **107px × 28px** (height $\ge 28\text{px}$, well above the $24\text{px}$ floor required by WCAG 2.2 SC 2.5.8 and DECISION-021 criterion 3).
- **Fold Clearance at 360px:**
  - Resting height to bottom of Submit button at 360px: 615px.
  - Height with toggle button (+8.8px layout delta): 624px.
  - Clearance at 360×752: **128px clearance** (17.0% margin).
  - Clearance at 360×740: **116px clearance** (15.7% margin).

#### Item 4: Non-Motion Replay Acknowledgement (Reduced Motion)
- **Fix:** In [`src/render/fraction-bar.js`](file:///c:/AI/FractionFlow/src/render/fraction-bar.js#L136-L225) and [`src/render/linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js#L108-L125), added `.replay-highlight` to the before track / Step 1 card and appended `(replaying)` to badge/heading text when `isReplaying` is active. In [`src/styles/render.css`](file:///c:/AI/FractionFlow/src/styles/render.css#L280), styled `.replay-highlight` with static `border-color: var(--ff-color-border-focus); box-shadow: 0 0 0 2px var(--ff-color-border-focus); background-color: #f0f9ff`.
- **Condition A Governance:** Learner-dismissed, never timed. Remains until dismissed or advanced.
- **Verbatim Live Captures Under Reduced Motion:**
  - **Compare before and after (`juxtaposed`):**
    ```
    BEFORE replay:
      bar classList: fraction-bar-container choreography-juxtaposed
      before row HTML: <div class="fraction-bar-comparison-row fraction-bar-row-before"><div class="fraction-bar-badge-wrap"><span class="fraction-bar-badge">Before: 2/3</span></div>...

    DURING replay:
      bar classList: fraction-bar-container choreography-juxtaposed replay-active
      before row classList: fraction-bar-comparison-row fraction-bar-row-before replay-highlight
      before row badge: Before: 2/3 (replaying)
    ```
  - **Step-by-step change (`sequential`):**
    ```
    BEFORE replay:
      bar classList: fraction-bar-container choreography-sequential

    DURING replay:
      bar classList: fraction-bar-container choreography-sequential replay-active
      step1 card classList: fraction-bar-step-card fraction-bar-step-1 replay-highlight
      step1 card heading: Step 1: Start with 2/3 (replaying)
    ```

#### Item 5: Clear Stale Choreography Class & CSS Inertia
- **Fix:** In [`src/render/fraction-bar.js`](file:///c:/AI/FractionFlow/src/render/fraction-bar.js#L120-L327), explicitly remove `choreography-in-place` when setting `choreography-juxtaposed`, when setting `choreography-sequential`, and in the standard single-bar `else` branch.
- **CSS Inertia:** Confirmed via codebase search that `choreography-in-place` is never referenced in any stylesheet (`render.css` styles only `choreography-juxtaposed` and `choreography-sequential`). It was completely inert in CSS.
- **Verbatim Live Captures:**
  ```
  In-place replaying bar classes: fraction-bar-container choreography-in-place replay-active
  After switch to juxtaposed, bar classes: fraction-bar-container choreography-juxtaposed
  Contains choreography-in-place: false
  After switch to sequential, bar classes: fraction-bar-container choreography-sequential
  Contains choreography-in-place: false
  ```

---

### 2. Status of Conditions A, C, and D
- **Condition A (No Auto-Advance):** Zero timers or automatic dismissals in any motion mode; endpoints stay inspectable indefinitely.
- **Condition C (Currency Contract):** `isReplaying` verified in `scene.presentation` (`scene.presentation keys: [ 'choreography', 'isReplaying', 'mode' ]`) and enforced by `assertSceneCurrent`.
- **Condition D (Reflect Inspection Mode):** [`tests/leakage-invariants.test.js`](file:///c:/AI/FractionFlow/tests/leakage-invariants.test.js) (`Invariant 6b / Condition D`) passes 100% against a replaying reflect scene.

---

### 3. Verification Suite & Artifacts

| Check | Result |
|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** (exit 0) |
| `npm test` | **20 passed (20 files, 243 tests passed)** |
| `npm run build` | **Passed** (Vite 6.4.3, 42 modules transformed, 0 errors) |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** |
| `git status --short` | Clean working tree |

- **Standalone Report:** [`reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-07-report.md`](file:///c:/AI/FractionFlow/reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-07-report.md)
- **Progress Log:** Updated with Section 12 in [`reports/development/plan-09-app-shell-condition-switcher-and-acceptance/progress.md`](file:///c:/AI/FractionFlow/reports/development/plan-09-app-shell-condition-switcher-and-acceptance/progress.md#L933-L1080)
- **Advisor Consultation:** Branch C (orchestrator-gate-only, fail-closed per `advisor-capable-providers.json`).
- **Owner Boundary:** Requirement 3 remains strictly owner-gated; no push, no deploy, and no public-URL claims made. Status verbs belong to the orchestrator and owner.