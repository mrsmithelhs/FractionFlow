# Plan 41 — Investigation: phase-boundary maintainability and response ownership

Date: 2026-10-20. Baseline HEAD `2b7a60f` (product source identical to `a6801d1`; only the scope proposal
was added). Scope and seam were confirmed by the owner via the orchestrator: the **operate-beat fraction
response region** is the comparison seam; git-history cost evidence is acceptable; no test, build or route
reruns were performed. This report recommends; it authorizes nothing. The proposed slice is in
[recommended-source-slice.md](recommended-source-slice.md); thread capabilities and reporting are in
[progress.md](progress.md) and are not repeated here.

## 0. How to read the evidence tags

| Tag | Meaning |
|---|---|
| **V** | I read it in current source, a diff or a git record this session. |
| **T** | A read-only Haiku-tier tracer reported it with file:line; I did not re-read it. Treat as a lead, not a finding. |
| **O** | Official-source claim fetched by the Haiku researcher on 2026-10-20 (not independently re-fetched). |
| **P** | Prediction. Not observed. |
| **H** | Hypothesis, untested. |

Line counts, test counts and commit counts are supporting signals only (packet rule). Nothing here is a
token, time or performance estimate, because none was measured in a comparable way.

## 1. Historical claims rechecked against the post-Plan-40 baseline

The 2026-10-10 reviews (baseline `703a64f`) are hypothesis sources, not current defects.

| Historical claim | Now | Reading |
|---|---|---|
| Remount token duplicated in both renderers, 19 fields | **V** 23 keys, byte-identical (`beat-container.js:329-353`, `linear-path.js:458-482`; `diff` empty). Plans 38/40 added `takeawayRemoval`, `takeawayHelpOpen` to both. | Holds; duplicated block grew by edits that had to be mirrored. |
| Drafts scraped from DOM by id strings; help/draft/focus state in `app.js` | **V** `app.js:293-303` closure state; capture/restore at `:925-1010`; **third** draft family (operation) now exists. | Holds and grew. |
| `path-closure.js` accepts ≥2 choices vs ≥3 elsewhere | **V** no `choices`/length test remains in `path-closure.js`; validator requires ≥3 (`authored-task-data.js:47`). | Resolved or moot; not a current finding. |
| Fixture-revision map duplicated in premise/reflection modules | **V** `AUTHORED_REVISIONS_BY_FIXTURE` no longer exists in `src`. Plan 32 added an authored catalog/materializer. | Resolved; content scaling has improved (see §5 control). |
| Mock DOM too thin for Vue's patcher | **V** `tests/fixtures/mock-dom.js` contains no `insertBefore`/`nextSibling`. Vue's runtime need for them is **P** (not tried). | Compatibility inferred only. |
| Line sizes | `app.js` 1395 (973 at the 10-10 note), `beat-container.js` 1307, `linear-path.js` 1193 **V**. | Context only. |
| Route-matrix draft witnesses non-vacuous | **V** one is not: see §6. | New evidence-workflow finding. |

## 2. Hypotheses and outcomes

| # | Hypothesis | Falsifying observation | Outcome |
|---|---|---|---|
| H1 | Response lifecycle (draft, help, focus, remount) is split across app + two renderers by an implicit protocol, so response edits need mirrored multi-file changes. | A traced response revision needs one edit site, or defects trace to evidence workflow only. | **Supported as an observed duplicate-edit cost and as a maintenance hazard.** The Plan 40 repair needed 4 source files with the same 2-line addition in both renderers (**V**, §3 trace A). No *current* learner-facing defect on the operate seam was found; the verified historical defect (Plan 25 focus loss) was on the transform seam and is repaired. |
| H2 | Admission/task-context construction is a per-plan branch chain that adds an edit site per family. | A new family or item is data-only, or branches come from one registry. | **Partly supported.** Branches are real and repetitive (**T/V**, §5.2) but each encodes a distinct versioned contract, and the data-only item control works (§5.1). No defect observed. Rank second. |
| H3 | A bridge representation cannot be added without another large app/renderer branch unless a response interface exists. | Predicted Plan 39 edit list stays within content/interaction/render modules. | **Supported as a prediction (P).** Plan 39 §4.3 needs preview/help/focus preservation across view switches, which today is done by per-family closure variables in `app.js` (§5.3). |
| H4 | Templates/components (incl. Vue) would beat vanilla extraction on the same seam for readability and edit cost. | Paper comparison shows equal/worse locality or cost dominated by interop and test-environment change. | **Not distinguishable on paper** (§7). The measurable differences are tooling/interop costs; the readability benefit is an owner-judgment question no source reading can settle. |
| H5 | No refactor is justified; docs/guards suffice. | Traces show duplicated edits or protocol hazards guards cannot remove. | **Falsified for "guards alone."** Guards are needed (§6) but do not remove the mirrored block or the second selection procedure. |
| H6 | Part of the cost is evidence-workflow failure, not source organization. | — | **Supported**, classified per incident in §6. |

## 3. The three maintenance traces and the control

### Trace A — fraction-response copy/control revision (observed history + walk-through)

Anchor: the Plan 40 repair `dab636c` (visible labels shortened, separate accessible names added). **V** from
`git show dab636c`:

| File | Change | Needed? |
|---|---|---|
| `src/render/strings.js` | two visible strings shortened; two aria strings added | Edited |
| `src/render/controls.js` | `createFractionResponseInput` gained two aria-label params | Edited |
| `src/render/beat-container.js` | two new params passed at the call site | Edited |
| `src/render/linear-path.js` | the same two params, same lines | Edited (mirror) |
| tests | `render-plan40-subtraction-recipes.test.js`, route/test evidence files | Edited |

Files read for context only (T): `app.js` (id constants; not changed), `scene.js`/`episode.js`. So one control
revision touched four source files, with one *pure duplicate* edit. Caveat: this is one commit; copy edits
elsewhere show visual and linear sometimes differ legitimately (`d140bd8`: `+6/-1` visual vs `+10/-12` linear).

Broader signal (**V**, `git log`/`--numstat` since 2026-10-07): 18 commits touched either renderer; 14 touched
both; 11 of those 14 added line counts within 2 of each other. This is a supporting signal, not a cost measure.

Current-source reading for the operate seam (**V**, `diff` after normalizing id prefixes): the 68-line `case
'operate'` block (`beat-container.js:707-774` vs `linear-path.js:834-901`) differs only in the id prefix, the
help paragraph id and which help string it uses (`visualHelp`/`linearHelp`). The renderer chooses the response
control by *scene* facts (takeaway / `already-shared-unit` / else sum).

### Trace B — help/draft/focus across view switch and reset (source-traced, not rerun)

Ownership today (V = read by me; T = tracer):

| Duty | Owner | Where |
|---|---|---|
| Unsubmitted operate draft value | `app.js` closure `operationDrafts` | V `:298`, T capture `:982-990`, restore `:992-1000` |
| Help-open flags | `app.js` (`transformHelpOpen`, `subtractionHelpOpen`, `decideHelpOpen`; Plan 20 via `activityNotice`) | V `:293-295`, T paths `:597-646` |
| Help paragraph | renderer (Plans 36/40) or app (Plan 20 cue, decide cue) | V `beat-container.js:710-716`; T `app.js:1034-1057` |
| Help button placement | `app.js` moves one button into `.active-beat-controls` after each render | V `app.js:1012-1136` region (read in part), T detail |
| Which input is "the operate response" | **two procedures**: renderer by scene; app by definition-id lists | V renderer `:708-756`; V app `:965-980` |
| Remount decision | duplicated 23-key token + `replaceChildren()` | V both files |
| Focus after help/submit/recovery | `app.js` only; renderers make no operate focus calls | V `:1284-1296`, T `:1297-1330` |
| Reset | `resetEpisodeUiState`, `startPractice`, `retry/next/return` | T `:693-826` |
| Correctness, next beat | `src/math`, `src/interaction` — protected | — |

Flow summary (T, spot-checked): view toggle captures all three draft families from the old host, flips
visibility, restores into the new host, then re-places help and re-focuses (`:539-573`); help click captures,
dispatches and focuses per family branch (`:597-646`); `render()` captures, resets by beat, re-renders both
renderers, restores and re-places help (`:1138-1220`); `dispatchAction` captures drafts, applies the intent,
then chooses focus by action and definition (`:1222-1331`).

Verified or tracer-reported hazards (hypotheses until a defect is shown):

1. **Two selection procedures for one question.** `getVisibleOperationInput` picks by definition id and selector
   style (id for Plans 36/40 and sum families, a class selector for Plan 20), while the renderer picks by scene.
   Today they agree (T: tracer found no counter-example). A definition whose scene takes the other branch
   would look up the wrong element and capture/restore/focus would silently no-op (null returns, T `:922-979`).
   **V** for the code shape; **H** for any live mismatch.
2. **Per-definition focus/placement sites.** T lists ≈30 definition-keyed branch sites in `app.js`. **V**: the
   take-away focus preservation (`:552`) and install-time focus (`:731`) test only
   `isPlan36SubtractionDefinition`; Plan 40 is absent there. Whether Plan 40 ever has a take-away encounter was
   **not verified** — it may be intentional (Plan 40 uses a different schedule). Open question, not a defect.
3. **Silent failure style.** Captures, restores and focus calls skip on null (T). The Plan 25 focus-loss defect
   was found by review, not by an assertion — an evidence-workflow lesson as much as a source one.
4. **View toggle updates `isReplaying=false` without `render()`** (T, verified-by-reading by tracer; not
   re-read by me). Left as an untested observation.

### Trace C — Plan 39 locate integration (all **P**)

Plan 39 asks for: preview selection preserved across Visual↔Linear, help state and recovery preserved, focus
routed through `encounter → locate → recovery → help → resolve` (`plan-39…md` §4.3). Predicted edit sites
(**P**; tracer-read of current files, number-line files confirmed absent **V**):

- New modules: `src/render/number-line.js`, `src/content/plan37-bar-to-line-bridge-task.js`, a records file.
- Existing coordinators needing edits: `eligibility.js` (hard-sets `numberLine: NOT_IN_PHASE_2` for every
  instance, T `:147`), `episode-definition.js`, `episode.js` (definition-keyed chain at **V** `:1262-1281` rejects
  task context from any unlisted definition with `UNSUPPORTED_TASK_CONTEXT`; further chains T), `replay.js`
  (new version, definition-keyed ternary), `scene.js` (**V** the number-line branch `:522-531` throws unless
  the verdict is `not-in-phase-2`), both renderers (a new branch at the top of each render path),
  `strings.js`, `practice-types.js`, `app.js` (`canonicalInstance`, `createInitialState`, focus/help rules).
- **New draft state.** Unconfirmed preview must never reach `applyIntent` (T: `appendIntent` records every applied
  intent into `learnerIntents`). So the preview is UI draft, and today the only place UI drafts live is the
  `app.js` closure. Without a response interface Plan 39 would add a fourth capture/restore/reset family.

Observed analogues for scale (**V**, `git show --numstat`): `app.js` grew `+144` (Plan 20), `+111` (Plan 38),
`+51` (Plan 40, which reused the existing fraction control), `+43` (Plan 35). Plan 40 shows reuse works when the
new task reuses an existing control; Plan 39's locate control is a new kind, so reuse will not apply (**P**).

### Control — adding one live Plan 40 record (T for the list; V for the two spot-checked pins)

| Category | Files |
|---|---|
| Must change | `src/content/data/plan40-reusable-subtraction-recipes-records.js` (record + set membership); must pass `validatePlan40SubtractionRecipeRecord` |
| Auto-derived | `practice-types.js` (items built from the set), `authored-content-catalog.js`, replay/definition modules |
| Break on a 10th item (pins, not logic) | `scripts/dev/plan40-route-subtraction.mjs:92` (**V** throws unless `items.length === 9`), `tests/content-plan40-subtraction-recipes.test.js` (counts and exact id arrays), `tests/app-plan40-subtraction-recipes.test.js:26`, `tests/routes-plan40-subtraction-recipes.test.js:58`, `tests/routes/plan34-context-map.json:89-99` (must mirror the set), `tests/replay-plan40-v6-compatibility.test.js:131` |
| Merely read | validator, interaction/render/leakage tests |

Conclusion: **content scaling is already achieved** at the source level (one data file plus validators). The
cost of a new item is pin updates, which are evidence-workflow edits, not source organization. A new *task or
representation* (Plan 39) is a different cost class (≈10 coordinators plus a new draft family, **P**).

## 4. Responsibility map for the operate response region

Reading locality today for "change how the operate response looks or behaves": `strings.js`, `controls.js`,
both renderers (mirrored), `app.js` capture/restore/focus/help sections, plus id-pinned tests and route rows (T:
`tests/app-plan40-subtraction-recipes.test.js:115-176`, `tests/plan38-rendered-subtraction.test.js`,
`tests/routes/route-matrix.json` `#operate-*` rows). Visual vs linear differences in this region are only
naming/help copy (**V**), so there is **no intentional renderer difference to preserve** inside the region; the
*surrounding* shells do differ (heading level, layout) and must stay separate.

Constraints from the founding docs (**T**, headings/lines per tracer; §61 **V**):

- `04-system-architecture.md` §61: framework choice is deferred; component tooling must not create
  independent widgets. §60: dependencies must earn their complexity; no runtime CDN/third-party for core
  practice. §68–70: minimal app state; renderers may not keep alternate copies. §20: renderers do not
  synchronize with each other directly. No text mandates a DOM structure or forbids UI-draft state.
- `05-quality-and-validation.md` #70: switching representation must not reset correct work; #44 accessible
  alternative must not reveal what the visual asks the learner to reason out; #37–38 keyboard operability and
  focus order.

Design consequence: a response module may exist, but unsubmitted drafts must be owned **above both renderers**
(the visual and linear hosts are two persistent renderers, T `app.js:1175-1209`), not duplicated inside each
region and not exchanged renderer-to-renderer.

## 5. Candidate ranking

### 5.1 Candidate 1 — response-region ownership (**rank 1; precede Plan 39**)

Evidence: mirrored 68-line block (V), token duplicated and growing (V), 4-file/2-mirror control revision (V),
two selection procedures (V), third draft family (V), Plan 39 needs a fourth (P). Defect evidence on this seam
is thin; the case is duplicate-edit cost plus hazard plus an imminent consumer, not a defect history.

### 5.2 Candidate 2 — practice admission/task context (**rank 2; wait**)

`canonicalInstance` (`app.js:54-198`) has one validation block per Plan 18/20/34/35/36/40; Plans 35 and 40
share an identical nine-field compare, Plan 36 compares eight (T). `createInitialState` selects a task context
through a ternary chain keyed differently from `canonicalInstance` for Plans 34/18 (T; works only when `item`
is supplied). This is repetitive, but each block encodes a versioned, intentionally distinct contract, and a
registry risks erasing historical version boundaries (packet constraint). No defect observed; Plan 40 cost `+51`
lines in `app.js`. Revisit after Plan 39 shows what its bridge actually adds there. A narrow helper for
"compare a resolved context to an item over named fields" is a possible later, separately-gated step.

### 5.3 Candidate 3 — representation integration interface (**rank 3; do not build ahead of Plan 39**)

Plan 39 explicitly forbids a general representation-switching framework. The smallest interface that Plan 39
needs is the response-region handle of Candidate 1; anything more would be speculative. Let Plan 39 add its
number-line renderer module and revisit with evidence.

## 6. Evidence-workflow findings (separate from source organization)

| # | Finding | Evidence | Class |
|---|---|---|---|
| W1 | `ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION` claims "draft preservation and focus across views" but step 6's assertion is only `hasSelector`; final check is a `capture` with no value assertion | **V** `route-matrix.json:12871-12960` | Weak assertion. Plan 40's route and `app-plan40` test **do** assert values (T), so this is local, not systemic |
| W2 | `notHasSelector` passes on zero matches | **V** `run-route-matrix.js:2533-2539`; renamed class → vacuous pass | Guard weakness |
| W3 | Some unit tests read drafts from node references captured before the toggle (stale-reference) | T `app-shell.test.js:117,132`, `plan20…test.js:325-334` | Weak assertion |
| W4 | `render-purity.test.js` scans a fixed nine-file list; `src/app`, `src/interaction`, `src/content` unscanned; a new render module is unscanned until added | **V** `render-purity.test.js:459-469` | Guard gap (matters for any new module) |
| W5 | Count/id pins (nine items, 81 routes, exact id arrays) turn data additions into multi-file edits | V one, T others | Test coupling |
| W6 | Earlier evidence defects (stale builds, in-memory captures, screenshot captions) | Plan 40 repair records; 2026-10-10 reviews | Evidence workflow |

None of W1–W6 is cured by moving code; all are needed before relying on parity checks for a refactor.
Fixes touch shared tests/harness, which this packet may not edit; they belong in a separate guarded packet.

## 7. Option comparison on the same seam (operate response region)

Options: **O0** current + docs/guards; **O1** focused vanilla ownership extraction (one shared region module +
explicit handle, drafts stay app-owned); **O2** vanilla `<template>`-style declarative markup for the region
plus the same handle; **O3** Vue single-file component for the region (paper only). All except O0 assume ids,
classes and accessible names stay byte-identical during the pilot as temporary parity scaffolding, not forever.

| Criterion | O0 | O1 | O2 | O3 (Vue) |
|---|---|---|---|---|
| Reading locality for an operate revision | `strings`, `controls`, 2 renderers, `app.js`, tests (V) | module + `controls` + `strings` + `app.js` handle sites (**P**) | as O1; static scaffold readable as markup (**P**) | `.vue` file + `strings`; interop shim in each renderer and `app.js` (**P**) |
| Duplicated behavior | stays (V) | one block (**P**) | one block (**P**) | one block (**P**) |
| Explicit lifecycle interface | none | handle: `readDraft/writeDraft/focusPrimary` (**P**) | same | props/emits + template refs; focus still developer-written (**O**: refs after mount; docs silent on focus across re-patch) |
| Visual vs linear differences | n/a | variant parameter (id prefix, help copy); shells stay separate (**P**) | same | same; both instances need identical component props (**P**) |
| Where drafts live | `app.js` | `app.js` (handle read/write) | `app.js` | must stay above both instances (two persistent hosts), so `v-model` would hold only a copy (**P**) |
| Remount / DOM identity | duplicated 23-key token (V) | token unchanged in slice; region keyed by existing token (**P**) | same | `app.mount()` replaces container contents, may be called once per app; host's `replaceChildren()` would orphan a mounted app unless `unmount()` is called first (**O** for mount/unmount semantics; orphaning is **P**) |
| Test/browser cost | existing mock-DOM tests | same; add handle tests on mock DOM (**P**) | same | needs `vue`, `@vitejs/plugin-vue`, likely a DOM test environment (docs recommend Vitest + happy-dom, **O**); mock DOM lacks `insertBefore`/`nextSibling` (V) so mock-based tests probably cannot mount it (**P**) |
| Replay / leakage risk | unchanged | unchanged if the module only emits existing intents and projects scene facts (**P**) | same | same; `v-show` keeps hidden nodes in DOM (**O**), conflicting with unmount-based leakage guards, so `v-if` discipline needed |
| Owner markup readability | imperative `createElement` | modest (one place) | better for static structure (**P**) | best *if the owner reads Vue* (**H**; unknown) |
| Reversibility | n/a | single commit revert | single commit revert | revert plus dependency and lockfile removal |
| Dependency / build | none | none | none (CSP/templating mechanism not researched) | adds `vue` (3.5.44 current per changelog, **O**), `@vitejs/plugin-vue` 6.0.10, peer range includes the repo's Vite `^6.2.1` (**O**); SFC needs a build step (**O**, already present) |

What the paper comparison can and cannot say:

- **Can say:** O1/O2/O3 are all consistent with removing the duplicated block and with a handle interface; the
  handle (scene in, intents out, drafts held above both views, explicit focus target) is the part common to all
  three and is needed under every option. O3 adds two integration costs the others lack (host/rebuild
  interop; test environment) and does not remove the focus contract (**O**: docs show manual focus code).
- **Cannot say:** whether template/SFC readability reduces owner or agent edit cost enough to pay for those
  costs. That is an unmeasured, partly subjective effect. Per the packet, no performance, bundle-size or token
  figures are asserted (the official performance page states only the compiler saving, **O**).
- **Therefore:** recommend O1 as the first slice because it delivers the shared prerequisite at the lowest cost
  and lowest reversibility burden, and offer a *separately gated* controlled O3 (or O2) comparison on the same
  seam and the same follow-up edit, to be decided by the owner after O1's evaluation (see the slice document).

Vue facts used (all **O**, fetched 2026-10-20 by the researcher): Vue 3.5.44 (changelog 2026-10-13); scaffolding
requires Node `^22.18 || >=24.12`; `@vitejs/plugin-vue` 6.0.10 with Vite peer `^5…^8`; docs silent on CSP and on
focus retention across re-patch; no `nextTick` on the template-refs page. The repo's `engines.node` is `>=22.0.0`;
the plugin's own engine range is `^20.19 || >=22.12`. None of this was installed or run.

## 8. Evidence → finding → recommendation

| Evidence | Finding | Recommendation |
|---|---|---|
| V diff `dab636c`; renderer commits (14/18 both; 11 near-equal) | A control/copy revision on the operate response needs mirrored edits in two renderers | One shared region module for the operate response |
| V operate-block `diff`; token `diff` | The region and the remount token are copy-paste duplicates | Same; token extraction deferred (§9) |
| V `app.js:965-980` vs renderer `:708-756` | Two procedures decide which input is the operate response | Handle returns the active input; `app.js` stops selecting by definition id for operate |
| V `app.js:293-303`; Plan 39 §4.3 | Drafts/help/focus are per-family closure state; Plan 39 would add another | Introduce the handle before Plan 39; Plan 39's locate region implements the same handle |
| V route row 12871-12960; V `notHasSelector`; V purity list | Parity witnesses have gaps | Guard repairs first, in a separate packet |
| T/V control list | New items are data-only plus pin updates | No source change needed for content scaling; relax pins later |
| T `canonicalInstance`/`createInitialState`; no defect | Admission is repetitive but versioned | Defer; revisit after Plan 39 |
| §7 | Paper cannot separate O1/O2/O3 on readability | O1 first; gated comparison optional |

## 9. What precedes Plan 39 and what waits

**Precede Plan 39** (recommended, subject to owner choice): (a) a small guard-repair packet (W1, W4 and the
stale-reference tests the slice will rely on); (b) the operate response-region slice. **Wait for number-line
evidence:** remount-token extraction, admission/task-context helper, `episode.js`/`replay.js`/`scene.js`
definition chains, migrating decide/transform regions, help-button reparenting, any template/Vue comparison.

## 10. Unresolved owner choices

1. Sequence: guards → slice → Plan 39, or Plan 39 first using ad hoc preview state (faster start, a fourth
   closure family, no pattern for the next representation).
2. Whether to fund a controlled O2/O3 comparison on the same seam and follow-up edit, and when (recommended:
   after O1's evaluation to avoid confounds).
3. How much weight owner direct code-reading carries (decides whether O3's potential readability gain matters)
   and whether the owner reads or wants to read Vue.
4. Whether the follow-up edit may include the small aria-association addition (§ slice F1) or must be copy-only.
5. Whether Plan 40's absence from the take-away focus sites (`app.js:552`, `:731`) is intended (open question).

## 11. Limitations

- No tests, builds, routes or browser were run (as agreed). All rendered-behavior claims come from source,
  git records or existing evidence; none is browser-verified here.
- Tracer outputs (**T**) were not re-read in full; only the claims marked **V** were. Haiku reports are
  model output; two had explicit "not verified" gaps (Plan 20 operate path, Plan 40 take-away encounter).
- Git-history cost is observed but confounded: commits mix copy, tests and evidence, and reviewer strictness
  varied. No causal share is inferred.
- Investigator familiarity: I read these files this session; any future before/after measurement must use a
  cold-start agent for both arms (see the slice document).
- The founding-doc sections were located by a tracer; I verified only §61 directly.
- Vue/Vite facts are from official pages summarized by a tracer on 2026-10-20 and were not independently
  re-fetched. No framework behavior was exercised.
