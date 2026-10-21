# Plan 41 — Recommended first source slice and follow-up evaluation

Date: 2026-10-20. Companion to [investigation.md](investigation.md); evidence tags (V/T/O/P/H) and findings
are defined there and not repeated. **This document recommends and designs; it does not authorize any source
change, dependency, packet or push.** A separately approved source packet and owner disposition are required
(DECISION-047). Everything about predicted effect below is labeled prediction.

## 1. Recommendation

**Adopt one first slice: give the operate-beat fraction response region a single owner with an explicit
region handle, in vanilla JS, before Plan 39.** Precede it with a small guard-repair packet. Do not refactor
admission, the remount token, `episode.js`/`replay.js`/`scene.js`, or other regions yet. Offer, as a separate
owner decision, a controlled template/Vue comparison on the same seam after this slice is evaluated.

A "no refactor" outcome is **not** recommended: the duplicated 68-line operate block, the mirrored control
revision (`dab636c`: four source files, one pure duplicate edit), the two competing procedures that decide the
operate input, and Plan 39's coming need for a fourth draft/focus family are real and are not removed by docs
or stronger guards alone. What would change this recommendation: the owner prefers to start Plan 39 on ad hoc
state and accept the extra branch; or the guard-repair packet shows the mirrored block is already unified;
or the follow-up edit baseline (§7) shows the current structure is cheap for a cold-start agent.

## 2. Preconditions (separate, small, evidence-only packet — "P0")

These repair the witnesses the slice would rely on. They edit shared tests/harness, which Plan 41 forbids, so
they need their own packet:

1. Strengthen `ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION` (`route-matrix.json:12871-12960`) to assert input
   values and focus, and prove it fails against a seeded defect (the repo already uses witness seeds).
2. Make `render-purity.test.js` scan `src/render/**` by glob rather than a nine-name list
   (`:459-469`), so a new module is scanned; or add the new file explicitly.
3. Make the draft-across-toggle unit tests re-query nodes after each toggle, as
   `app-plan40-subtraction-recipes.test.js:115-176` already does (T), instead of reading captured references.

Cost class: small, tooling only, no learner-visible change.

## 3. Module ownership and interface sketch (illustrative, not final API)

New module `src/render/operate-response.js` (name provisional). It owns, for the `operate` beat only:
the response controls (fraction pair or single sum input, per the *scene* rule the renderers already use),
the submit button, the inline error paragraph, and the plan-36/40 task-help paragraph that currently sits in
the same `case 'operate'`. It builds DOM from a scene and returns a handle. It never evaluates answers; it
passes the learner's raw submitted form to the existing `onSubmit`.

```js
// sketch only
createOperateResponse({ variant: 'visual' | 'linear', scene, strings, helpOpen, recovery,
                        onSubmit /* existing dispatchAction shape */ }) => {
  element,                       // appended into .active-beat-controls as today
  handle: {
    kind: 'fraction' | 'sum',
    primaryInput(),              // connected, visible element or null
    readDraft(),                 // { numerator, denominator } raw strings
    writeDraft(draft),
    focusPrimary(),              // false if not focusable (explicit, not silent)
  },
}
// each renderer additionally exposes:
renderer.getResponseRegion('operate')  // current handle or null
```

Ownership rules (from the founding docs, investigation §4):

- **Drafts stay owned by `app.js`** (one `operationDrafts` store above both persistent renderers). The module
  reads/writes through the handle on request; it does not keep a copy that survives a rebuild, and neither
  renderer reads the other (`04` §20, §68–70).
- **Scene in, intents out.** Existing intents (`submit-operation-result`, `submit-subtraction-result`, …) and
  payloads are unchanged. No new intent, no change to `src/interaction`, replay or provenance.
- **Visual/linear difference is a parameter**, not a fork: id prefix and the visual/linear help string. The
  surrounding shells (heading level, layout, completed-beat summaries) are untouched and remain separate.
- The remount token and `replaceChildren()` stay as they are in this slice; the handle is re-acquired after
  each render. (Token extraction is a later, separately evidenced step.)

## 4. Existing callers and what changes (predicted)

| Caller | Today | After the slice (**P**) |
|---|---|---|
| `beat-container.js:707-774` | builds the operate response inline | calls `createOperateResponse({variant:'visual'})` |
| `linear-path.js:834-901` | the same block, mirrored | calls `createOperateResponse({variant:'linear'})` |
| `app.js:965-980` `getVisibleOperationInput` | selects by definition id and selector style | `renderer.getResponseRegion('operate')?.primaryInput()` |
| `app.js:982-1000` capture/restore | per-definition id lists | `handle.readDraft()` / `handle.writeDraft()` |
| `app.js:1290-1311` operate focus calls | `getVisibleOperationInput()?.focus()` | `handle?.focusPrimary()`; the *decision* of when to focus stays in `app.js` |
| `controls.js` | `createFractionResponseInput`, `createNumericInput` | reused unchanged |
| Tests/routes | id- and class-pinned (T) | unchanged for the pilot (parity scaffolding) |

Not changed: `src/math`, `src/content`, `src/interaction`, `scene.js`, `replay.js`, `practice-types.js`,
help-button reparenting, the Plan 20 help cue, the decide and transform regions.

## 5. Protected contracts and exclusions

Preserve: exact math ownership; immutable instructional state; learner agency; raw submitted forms; support
selection; visible/accessible parity; reduced motion; historical replay identities and deterministic
reconstruction; leakage invariants (the module must not render a future/correct value before it is asked);
static deployment/privacy posture. Presentation must not acquire answer evaluation (`render-purity` guard).
DOM ids, classes, accessible names and visible copy stay byte-identical during the slice as *temporary parity
scaffolding*, not as a permanent ban on better markup.

Excluded (each would add a confounder): admission/`canonicalInstance` changes; remount-token extraction;
decide/transform region migration; help-button reparenting; completed/recovery region extraction; animation
code; any registry that erases version boundaries; a generic plugin or focus-coordinator system; any new
dependency; any template or framework in this slice.

## 6. Checks and rollback

Before acceptance (browser checks are the owner/orchestrator's to run; this packet ran none):

1. `npm test` (487 tests at `2e48512`) plus new handle tests that fail when the target is missing (non-vacuous).
2. Frozen replay oracles unchanged (`tests/fixtures/plan38-v5-replay-oracles.json`, the v6 compatibility test).
3. Existing operate routes re-run **unchanged**, in a real browser: `ROUTE-PLAN40-HELP-RECOVERY-VIEW-TOGGLE`,
   the Plan 20 and Plan 34 operate routes, and the strengthened Plan 38 draft route; confirm route/execution
   counts are unchanged.
4. Matched screenshots of operate with help closed/open and with recovery, both views, at the existing 360px
   and 1366px references; one reduced-motion and one touch journey.
5. Purity guard scans the new module and passes; no new import of `src/content` from `src/render`.

Rollback: revert the slice commit(s). There is no data, replay or identity migration to unwind. Because the
handle is additive until `app.js` stops selecting by definition id, an intermediate commit can add the module
and renderers first, then switch `app.js`, keeping each step independently revertible.

## 7. Falsifiable follow-up edit and evaluation design

The evaluation tests the benefit the slice claims (fewer duplicate edits, clearer ownership), not line counts.
It designs the study only; no source refactor or run happens in Plan 41.

**Follow-up edit F1 (no new pedagogy).** On the operate fraction response, change the visible response-group
label and the per-input visible labels via `strings.js`, rename the submit button's visible text for this
region, and associate the existing inline error paragraph with both inputs through `aria-describedby` while it
is visible. This mirrors the shape of `dab636c` (copy + control + accessible name) so the baseline is
observed history. *Owner option:* substitute a pure copy edit; the criteria below are unchanged.

**Arms.** (A) the commit immediately before the slice; (B) the slice commit. Same brief, same models, same
tooling, cold start for each arm, run by an agent that has not read this investigation, to control for my
familiarity. Repeat at least twice per arm if budget allows; report each run, not a mean. Record model/context
differences. Report cost (turns, elapsed time, tokens) only if observed on both arms under comparable
conditions; otherwise omit it.

**Record per run:**

| Item | Capture |
|---|---|
| Files edited / files opened-for-context | list with reasons |
| Concepts needed | e.g. remount token, id coupling, draft store, focus rule — named by the agent, checked by the reviewer |
| Duplicate edits | count of places where the same change is applied twice |
| Wrong first guesses | files or sites opened that proved irrelevant |
| Ownership clarity | can the reviewer point to the one place that decides input form, draft, help and focus? |
| Owner readability | the owner reads the module and its call sites and answers three questions ("where is the label set?", "what happens to a typed draft when the view changes?", "who decides where focus goes after a wrong answer?"), noting hesitation and errors |
| Browser behavior | the five scenarios below, run in a real browser against the final build |

**Browser scenarios (actual behavior, not unit tests alone):**
S1 type a partial draft → switch Visual↔Linear → value preserved and focus kept; S2 open/close help → focus
and `aria-expanded`/`aria-controls` correct; S3 wrong submit → recovery shown → focus returns to the response;
S4 Retry / Next / return-to-entry → drafts, help and focus reset as today; S5 reduced motion and 360px
layout unchanged, no future/correct value in DOM or accessible text. Use the existing routes plus matched
screenshots; no incidental markup is frozen beyond F1's intended change.

**Pre-registered falsification.** The claimed benefit is **false** if any of: (i) F1 still requires an edit in
both renderers' operate code, or any change to `app.js` draft/focus selection; (ii) any S1–S5 regresses, or a
route selector or accessible name must change beyond F1's intended change; (iii) the cold-start arm B needs as
many or more files/concepts or wrong first guesses than arm A; (iv) the owner finds the help/draft flow harder
to follow than before. Fewer lines, agent confidence or passing unit tests are never sufficient on their own.
If A and B are indistinguishable, the finding is "consistent with both," and the next step is the controlled
comparison below, not adoption.

## 8. Optional controlled comparison (separately gated; nothing installed or built here)

If the owner wants the readability question answered rather than argued: from the pre-slice commit, produce a
**throwaway-branch** O3 (Vue SFC) and, optionally, O2 (vanilla template) version of *the same operate response
seam* with the same handle semantics, then apply the same F1 with cold-start agents and the same S1–S5. Record
separately: files/concepts, duplicate edits, owner readability, mount/unmount and focus handling code,
test-environment work, dependency/lockfile delta, and observed build/test cost. This needs its own approved
packet and explicit dependency approval; Plan 41 authorizes neither. Run it after the O1 evaluation so the
slice is not confounded, and only if O1's evaluation leaves the readability question open.

## 9. Ordering relative to Plan 39

| Item | Before Plan 39? | Why |
|---|---|---|
| P0 guard repairs (§2) | Yes | The slice's parity checks depend on them; independent and small |
| Operate response-region slice (§3–6) | Yes (recommended) | Plan 39 §4.3 needs preview/help/focus preservation; the handle gives it a pattern instead of a fourth closure family. Keep the handle minimal so Plan 39's locate region validates it rather than inheriting operate-specific assumptions |
| F1 evaluation (§7) | Yes, at least the baseline arm | Cheap, and informs the owner choice |
| Remount-token extraction | No | Wait until two region owners exist (**H**: a token composed from region keys may be cleaner) |
| Admission/task-context helper | No | Defer until Plan 39 shows its actual `canonicalInstance` cost |
| `episode.js`/`replay.js`/`scene.js` chains | No | Version-boundary risk; Plan 39 needs its own sequential replay version regardless |
| Decide/transform migration, template/Vue comparison | No | Needs number-line and F1 evidence |

Owner choice: if the owner prefers not to delay Plan 39, the fallback is to start Plan 39 with its preview
state behind the same minimal handle interface *without* migrating operate. This captures much of the benefit
for the new region only, leaves the duplicated operate block in place, and is not a pure win; Plan 41 cannot
distinguish the two orderings on current evidence beyond the reasoning above.

## 10. Source-approval stop

Nothing here is authorized. Adopting this slice needs: owner disposition of Plan 41; a P0 packet and a source
packet, each with their own Requirement 0 mechanism gate, explicit dependency on Plan 41 and (for Plan 39) an
explicit Plan 39 dependency on the adopted slice; and the separate rendered-acceptance and deployment gates.
