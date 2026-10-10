# FractionFlow maintainability and revision architecture: independent Claude review

Date: 2026-10-10. Assignment: `reports/orchestration/maintainability-architecture-claude-handoff.md`.
This is a design review. It does not authorize a migration, a pilot, a dependency change or any packet or status change.

## 0. Identity, inspected state and method

| Item | Record |
|---|---|
| Lead reviewer | Claude Code. Runtime-reported model: Opus 5.5 (`claude-opus-5-5`). The reviewer did not verify this independently. |
| Helpers requested | Four read-only `explorer` subagents. Two were requested with the `sonnet` alias: copy/notation and motion traces, and help-lifecycle and admission traces. Two were requested with the `haiku` alias: a test-coupling audit, and incident extraction from the Plan 25/26 reviews. |
| Helper identities observed | Self-reported only: "Sonnet 5.5 / `claude-sonnet-5-5`" (×2) and "Haiku 5.5 / `claude-haiku-5-5`" (×2). These are not independently verified. The explorer helpers had no shell, so the lead ran every git command. |
| Verification of helper claims | The lead re-read every helper claim this review relies on in source. Those claims are cited below with file:line. Two helper claims stay marked as inference: that a re-render collapses an opened `<details>`, and that the Vue runtime cannot run on the mock DOM. |
| Inspected revision | HEAD `703a64f`. The working tree was clean at start and before writing. All findings refer to committed files at that revision. |
| Commands actually run | `git rev-parse`, `git status --short`, `git log --oneline` with `--grep`/`-S` searches, `git show --stat/--numstat` for 7863584, 24b2297, 99244b2, 92e13db, ac0078a, 7e9ed1e, 9693853, 9273fa8, b418e8a, ef172ca, and `node scripts/dev/plan-status.js list`. `npx vitest run` gave 28 files and 321 tests passing, about 6 s wall time, in the default node environment with the hand-rolled mock DOM. Everything else was read-only `grep`/`sed` source reading. |
| Not run | `npm run build`, `npm run test:routes` (the Playwright route matrix), any browser, physical device, assistive technology or zoom check. No prototype was built. No dependency was installed. Nothing in this review is browser-verified. Statements about rendered behavior come from source or from the cited delivery reviews. |
| External sources | Official Vue documentation, cited where used (§9). |
| Advisor declaration | This is a prose-only review deliverable, so a higher-tier advisor consultation was not warranted. The helpers were bounded read-only assistants, not advisors. |
| Independence | The Gemini review was not read. No other chat was contacted. |

## 1. Verdict

**Do not adopt Vue now, and do not split files by size.** Repository history shows two recurring costs, and component markup addresses neither of them:

1. **Contracts not enforced at one seam.** Admission accepts what renderers refuse. Capability limits and registries are duplicated.
2. **DOM lifecycle ownership split three ways.** `app.js` and the two twin renderers share it through an implicit protocol: a hand-copied 19-field remount token, DOM id strings, and a help button that one module moves into another module's subtree.

A third, separate cost was evidence production.

Markup discoverability is real friction, but no recorded defect traces to it. The incidents with the largest blast radius do trace to the lifecycle protocol and to contract drift.

The smallest useful intervention has four parts:

- **(P1)** Make admission and capability limits single-sourced and checked for every registered item.
- **(P2)** Repair test guards that can pass vacuously or silently stop scanning.
- **(P3)** Write a short, accurate revision map.
- **(P4)** Make evidence capture a default output of the route runner.

After these, one reversible **vanilla pilot** should give the transform-response region (help, drafts, focus) one owner, used by both renderers, with an explicit focus and draft API instead of id-string queries.

That pilot builds the same seams a later Vue component would need: scene in, intents out, explicit key, explicit focus targets. If the owner later wants Vue, none of it is wasted.

No accepted or draft packet needs pausing. Plan 31's brief needs two corrections before initiation (§8). P1 should land before Plan 19 implementation.

### Prioritized recommendations

| # | Recommendation | Demonstrated problem it addresses | Size (rough estimate) | Risk |
|---|---|---|---|---|
| P1 | Admission completeness test over every registered practice item × condition × support level. Shared capability constants for minimum choices and bar range, used by the validator, `path-closure.js` and the renderer guards. One fixture-revision map. Exhaustion copy that does not hard-code "both". | Plan 26 finding 1 (92e13db → ac0078a). Residual drift still present (§3, I-3). | Small | Low. No learner-visible change. |
| P2 | Leakage and parity helpers must assert that their target exists. `render-purity` must glob `src/render/**` instead of reading a fixed list of nine files. Correct overclaiming test titles. Remove the dead CSS rule. Make the `strings.js` header true. | Vacuous-pass and silent-bypass risks (§6). | Small | Low. |
| P3 | A short revision map in `docs/development/`. It describes only what exists: both stylesheets, the four notation paths, the active-beat token, the draft/focus protocol, the admission chain, motion ownership, and the tests that pin each. Correct Plan 31's stylesheet pointer. | Routing errors: the Plan 31 brief still points at the wrong stylesheet, and Plan 21's discovery cost. | Small | Very low. |
| P4 | The route runner writes a declared screenshot and measurement manifest with captions and input-mode records. Counts are derived, not hard-coded. An assertion kind checks "active element is connected, visible and equals X". | Plan 25 incident 4; Plan 26 incidents 2–4. | Small–medium | Low. Tooling only. |
| P5 | One reversible vanilla lifecycle pilot on the transform-response region (§7). | Mirrored renderer edits, the duplicated token, id-string coupling, and recurring focus defects. | Medium | Medium. It touches the most focus-sensitive region. Serialize it with Plan 31. |
| — | Vue, templates or a general app-shell split | Not demonstrated to address an observed defect class (§5). | Large | High. |

## 2. What the existing architecture made easy

These are credits the evidence supports. Any change must keep them.

- **Pure, independently constructible episodes.** Plan 26 compared Next, Retry and return against independently built `createEpisode` states (plan26-practice-set.test.js:213-214, :288, :388). Plan 25 captured exact pre-mutation replay oracles for revisions 1 and 2. Those checks were cheap because the reducer is pure.
- **Math reuse.** Plan 25's multiplier classification reused `scaleFactorForDenominator`. No arithmetic entered presentation.
- **One scene feeds both renderers.** Visual/linear meaning cannot diverge at the state level. Divergence is confined to markup.
- **Fixture-agnostic navigation.** Plan 26's Next/Retry did not branch on fixture identity. A third item needs data, not new app or renderer code (§4c).
- **Motion is well contained.** Subdivision reveal lives in one file (`fraction-bar.js:205-289`). It tracks cancellation explicitly in `activeBoundaryAnimations`, keys boundary nodes by identity, and the browser route witnesses check node persistence, one animation per new boundary, and document-coordinate conservation (`scripts/dev/run-route-matrix.js:388-535`).
- **A fast feedback loop.** 321 unit tests run in about 6 s.

## 3. Incident and evidence table

Classes:

- **P**: learner-facing product defect.
- **E**: missing proof or evidence gap.
- **V**: verifier or report defect.
- **C**: copy or placement rework.
- **L**: latent drift found by this review, with no learner exposure observed.
- **F**: process or environment friction.

Repair counts reflect review strictness as much as architecture, so no causal percentages are inferred.

| # | Incident | Pointer | Verified observation | Class | Inferred cause | Uncertainty |
|---|---|---|---|---|---|---|
| I-1 | Opening task help leaves focus on BODY in both paths | P25 delivery-review P2. Fix in 24b2297 (`app.js` +5/−2). | The help click dispatches, the token includes `taskHelp`/`taskHelpOpen` (`beat-container.js:271-272`, `linear-path.js:327-328`), and `activeBeatEl.replaceChildren()` (`beat-container.js:289`) detaches the focused node. The fix calls `.focus()` after dispatch (`app.js:421-423`). | P (+E: the matrix passed without an active-element check) | Lifecycle ownership is split. The remount is decided in the renderer, the focus target is chosen in app.js, and no contract connects them. | Low |
| I-2 | Stale `aria-controls` after multiplier acceptance | P25 progress, advisor consultation, within 7863584 | app.js builds `aria-controls` from renderer id strings (`app.js:759`). A remount removed the referenced node. | P (caught before delivery) | The same id-string coupling as I-1. | Medium. Known from the report only. |
| I-3 | Admission accepted 2 choices and above-whole distractors that the renderers refuse | P26 delivery-review finding 1. 92e13db → ac0078a. | Validator now requires ≥3 (`authored-task-data.js:33`). Renderers require ≥3 (`beat-container.js:842`, `linear-path.js:753`). **Residual:** `path-closure.js:25-26` still accepts `>= 2`. The bar-range rule is restated separately in `matching-choice.js:9-14`. | P (latent, fixed) + **L** (residual) | Capability limits are restated in four places with no shared source. | Low |
| I-4 | Fixture-revision registry duplicated | This review | `AUTHORED_REVISIONS_BY_FIXTURE` is defined separately in `premise-checks.js:58` and `reflection-choices.js:73`. Missing one entry returns `null` silently. | L | Copy-paste registry | Low |
| I-5 | No test admits every registered item | This review, confirmed by grep | `PRACTICE_TYPES` appears only in `entry-page.test.js:28` (length) and `plan26-practice-set.test.js:358,365`. Admission (`app.js:39-74`) runs lazily on Start/Next/Retry. | L | Admission is a runtime composition, not a checked contract. | Medium. Indirect coverage via plan26 journeys exists for the current two items only. |
| I-6 | Recurring focus/lifecycle repairs across plans | 9693853 (P09 R07), 9273fa8 and b418e8a (P12/P14 inspection focus), 24b2297 (P25) | 9273fa8 makes identical-size +20/−2 edits in both renderers. b418e8a makes +4/−1 edits in both renderers. 9693853 (+25/−1 and +32/−6 in the renderers) and 9273fa8 extend `mock-dom.js` by +31 and +24 lines. | P (historical, fixed) | Lifecycle logic is duplicated across twin renderers, and the test double has to grow with each focus feature. | Low on the pattern. Causal weight unknown. |
| I-7 | Help feature needed near-mirror edits in both renderers | 7863584 numstat | `beat-container.js` +74/−15 and `linear-path.js` +73/−19. Also `app.js` +90, `episode.js` +81. | Cost, not a defect | The transform-response block exists twice (`beat-container.js:476-544` vs `linear-path.js:534-598`). | Low |
| I-8 | Cross-layer intent and provenance design for local help | P25 retrospective incident 1. cfbfc7e, 7863584. | The generic `request-help` escalation would have mislabeled provenance. A new task-local intent was added at revision 3. | Design complexity, essential | Genuine instructional semantics. The architecture made the risk visible. | Low. No UI architecture would remove this. |
| I-9 | Question shown twice; label vs supporting-text roles | 99244b2 (`controls.js` +12, `render.css` +6) | Resolved by an `aria-describedby` supporting text in the shared control API. | C | Copy placement. Screenshot review caught it. | Low |
| I-10 | Browser coverage gaps; no persisted artifacts | P26 delivery-review finding 2; ac0078a; 7e9ed1e | The first delivery had one Plan 26 visual journey, and captures were held in memory only. Repairs added 64, then 68 screenshots, and 184 records. | E | The route runner has no default artifact output. | Low |
| I-11 | Touch journey and scroll bounds overstated | P26 repair-01-review; 7e9ed1e | Only Next was tapped. The scroll check only tested intersection. | V | Ad hoc journey helpers | Low |
| I-12 | "Before Retry" screenshot read as wrong-answer feedback | P26 retrospective incident 4 | It was an unsubmitted draft with no caption. | V | No caption manifest | Low |
| I-13 | Plan 31 brief routes to the wrong stylesheet | `plan-31-shared-fraction-typography.md` Authority section; scoping note | `main.js:1-2` loads `src/app/styles.css` (app chrome only) and `src/styles/render.css` (all fraction, bar, symbolic and choice rules, plus `--ff-*` tokens). The scoping note "corrected" the path to `styles.css`, which is the wrong file for typography. | Routing defect (open) | There are two stylesheets and no map. | Low |
| I-14 | Hard-coded route counts | P25 retrospective incident 4; `route-contract.test.js:107,109,202,273-275` | 54/52/56 are pinned literals. Each added row is a count edit. | F / test coupling | Count pins | Low |
| I-15 | Approval delivery retries; Git metadata elevation; Edge sandbox profile | P21/P26 retrospectives; P25/P26 reviews | Not related to source structure. | F | Environment | Low |
| I-16 | Admission discovery across layers | P21 retrospective incident 1 | The answer sat across six registries and tables. | Documentation/routing | No admission report | Low |

**What the table does not show:** an incident caused by not finding where markup is built. The copy rework (I-9) was found by screenshot and fixed in a small diff. That is the main reason this review does not rank "structured markup" first.

## 4. The four representative revisions today

### (a) Copy or stacked-fraction notation

**Current ownership.**

- **A sentence edit** touches `src/render/strings.js` only, for example `helpMultiplierInstruction` at :82-84. Tests that pin the text also change: `app-shell.test.js:216-218` and others, plus `route-matrix.json` `containsText` rows.
- **Notation is produced by four separate mechanisms:**
  1. `createSymbolicFraction` (`symbolic.js:14-46`), which is stacked with `role=math` and the label "N over D".
  2. The bar readout's own stacked markup, duplicated within `fraction-bar.js` (:45-58 and :98-109, with text updates at :188-189) and called from 12 sites.
  3. About 30 inline `${n}/${d}` templates in the two renderers, plus about 12 in `strings.js`.
  4. Linear choice text, `"2/3"`, at `linear-path.js:760`.
- **The string catalogue cannot express stacked notation**, because strings are plain text assigned with `textContent`.
- **Accessible names follow three conventions:** "N over D", "N/D", and "N of D equal parts".
- **The `strings.js` header is false.** It says "No inline literals in render components" (:4), but inline English remains in `beat-container.js`, `linear-path.js`, `fraction-bar.js`, `controls.js:52` and `app.js`.

**Defects still possible.**

- Stacked markup inside a question changes `textContent`. That breaks `containsText` rows (`route-matrix.json:455, 3001, 3037`) and pins such as `linear-context.test.js:176` (`'Starting fraction23New parts712'`).
- More dangerous: `notContainsText "16/24"` leakage rows (e.g. `route-matrix.json:3115`) **pass vacuously** once slash text disappears.
- Fixing one notation path leaves mixed notation on the same screen.
- In non-persistent layouts, intrinsic widths can widen the readout column, because the 3rem lane is fixed only in the persistent layout (`render.css:198-203`).

### (b) Help open, close and recovery with focus and retained drafts

**Current ownership.**

- **Instructional facts** live in the episode: `episode.js:322-371` (task-help request and multiplier attempt, revision-3 gated at :732-741) and `scene.js:269-289` (`meaning.taskHelp`, answer withheld).
- **Transient UI** lives in seven `app.js` closure variables (`:132-138`): help-open flags per beat, decide and transform drafts, the draft schedule-entry id, and two focus-preservation flags.
- **Drafts are pulled from the DOM** only at capture points (help click, dispatch, render, view toggle). Lookup uses renderer id strings rebuilt in app.js at six sites (`app.js:692-716`). There is no `input` listener and no shared constant.
- **app.js physically moves its help button into the renderer's `.active-beat-controls`** (`app.js:752-755`) after every render.
- **Both renderers decide remounts** with an identical, hand-copied 19-field `JSON.stringify` token (`beat-container.js:261-280`, `linear-path.js:317-336`), and both carry the same transform-response block.

The token is the real lifecycle contract. It is duplicated and undocumented:

- A new input that affects the active beat but is omitted from the token leaves stale UI.
- An unnecessary field causes remounts that drop focus and depend on app.js re-finding nodes by id.

**Defects still possible.**

- A new draft-bearing control that misses capture, restore or `getVisibleTransformInput`.
- A renamed id that silently desyncs app.js, because `querySelector` returns null and the code skips.
- Token drift between the twins.
- A missing focus call in the error path. The catch at `app.js:901-908` refocuses only for multiplier submits.
- Plan 25 task-help leakage checks live outside `leakage-invariants.test.js`, whose Invariant 7 covers only the legacy `request-help`.

### (c) Another same-task authored problem

**Current edit surface.** Plan 26's single-item data cost in 92e13db is the reference:

| File | Plan 26 change |
|---|---|
| `phase1-golden-cases.js` | +15 (fixture) |
| `premise-checks.js` | +29 (rows and revision map) |
| `reflection-choices.js` | +37 (rows and the *second* revision map) |
| `practice-types.js` | +20 (item) |

A third item would also need:

- the `problemsExhausted` copy changed, since `'You’ve tried both problems.'` is in `strings.js:265`;
- `plan26-practice-set.test.js` updated where it hard-codes item ids and exhaustion after item 2 (:69-71, :323-342);
- the exhaustion route row updated (`route-matrix.json:3446-3514`);
- the route counts in `route-contract.test.js` updated, if rows are added.

No app.js or renderer change is needed, which is an architecture credit. Fixture typos are caught by `validateCuratedFixture`. A missing premise/reflection row or revision-map entry is caught **only when a test or learner starts that item**.

**Defects still possible.**

- An item that is valid in unit tests but never started in CI.
- Item 0 failing inside the Start click handler, which has no try/catch (`app.js:524-531`), whereas Next has one.
- `path-closure.js`'s `>= 2` admitting a two-choice reflection that renderers refuse.
- "both" copy left after a third item is added.
- Revision maps drifting apart.

### (d) Subdivision reveal and glow motion

**Current ownership.**

- **Timing and keyframes:** `fraction-bar.js:224-289` (Web Animations API; reveal 560 ms, then a glow sequence). Color tokens are at `render.css:25-27`.
- **Reduced motion:** gated in JS by `scene.presentation.mode` from `matchMedia` (`app.js:92-97, 922-928`; `fraction-bar.js:334-340`), with a CSS fallback at `render.css:449-463`.
- **Cancellation:** handled by set membership plus `isConnected` guards.
- **Boundary identity:** keyed by reduced fraction (`fraction-bar.js:63-75`). Note that this is a gcd inside a renderer whose header says it "computes zero mathematics". `render-purity` bans only the literal names `gcd(`/`lcm(`, so it does not catch this.
- **Verification:** browser-only. The route runner hard-codes frame expectations (`run-route-matrix.js` around :388-740). The mock DOM cannot exercise `element.animate`, so unit tests fall back to the no-animation path.

**Defects still possible.**

- Witness expectations drifting from the new timing.
- The dead rule `[data-presentation-mode="reduced-motion"] .replay-active` (`render.css:460`). Nothing sets that attribute, so a forced reduced-motion override does not stop the replay pulse. This was found in source, not observed in a browser.
- `lastTransitionEndpoints` not reset on the non-in-place path (`fraction-bar.js:483-487`). This is inference with low likelihood.

## 5. Alternatives compared on the same four revisions

Options:

- **O1. Retain the stack plus targeted seams:** P1–P4 and shared primitives.
- **O2. Smaller vanilla components or declarative templates:** the P5 pilot generalized. This covers `<template>`-cloned static markup plus per-region modules.
- **O3. Partial Vue adoption.**
- **O4. Documentation, instructions and evidence tooling only.**

| Revision | O1 retain + seams | O2 vanilla components/templates | O3 partial Vue | O4 docs/tooling only |
|---|---|---|---|---|
| (a) notation/copy | Add one `renderFraction(form, variant)` primitive plus "rich" string entries returning `[text, {fraction}, text]` segments and one naming function. Edits: `symbolic.js`, `strings.js`, `controls.js` (node labels), `fraction-bar.js` readout, `linear-path.js`, `render.css`. The four notation paths become one. | Same as O1. Templates help only static scaffolding, and fractions are dynamic. | `<Fraction>` composed inline in templates is idiomatic and genuinely nicer to read. Risks: copy migrates into templates unless an interpolation layer is added, which works against the DECISION-017 catalogue; every route `containsText`/selector row is re-audited; a new test environment is needed. | The map documents the four paths and the right stylesheet. The edit surface is unchanged. |
| (b) help/focus/drafts | Shared `activeBeatKey()` in one module. Renderers expose `responseTarget(kind)` and emit draft changes. app.js stops querying ids. | **Pilot (§7):** one transform-response module used by both renderers owns its inputs, ids and focus targets. The help button is rendered into the region through an explicit slot. | Keyed `<ActiveBeat :key>`, `v-model` drafts and template refs with `nextTick` focus. However: the key composition is the same 19-field decision; focus remains manual (Vue's accessibility guide shows developer-written `focus()` calls); and replay and provenance are unchanged. **A leaf Vue island inside an imperatively rebuilt parent is hazardous.** `activeBeatEl.replaceChildren()` would orphan a mounted Vue app unless every rebuild path unmounts it. The benefit appears only if Vue owns the whole active-beat region in both paths plus app.js's transient UI, which is not a small pilot. | A lifecycle section in the map, and active-element assertions after each remount. This catches defects but does not reduce mirrored edits. |
| (c) authored problem | P1 makes it a data edit plus one test that admits every item. Copy is parameterized by count. | No effect. | No effect. | An authoring checklist (Plan 21's suggestion). This helps, but cannot catch omissions the way P1 can. |
| (d) motion | Remove the dead rule. Let the scene supply boundary keys, since it already holds equivalent forms, so the renderer stops reducing fractions. Optionally move timing constants to tokens. | Same as O1. | `<Transition>`/`<TransitionGroup>` handle enter and leave. The persistent-node glow sequence and conservation stay custom WAAPI code in hooks. Vue's transition guide documents a cancel hook but is thin on interruption and silent on reduced motion. Keyed patching must be proven not to recreate boundary nodes the witnesses require to persist. Net: regression risk in the most carefully witnessed behavior, with no observed gain. | Document the motion contract. |

### Cross-cutting criteria

Ratings are judgments, not measurements.

| Criterion | O1 | O2 (pilot) | O3 Vue | O4 |
|---|---|---|---|---|
| Semantic clarity of markup | = | + (one region) | ++ | = |
| Stable DOM identity and remount control | + (one key) | ++ (one owner) | + (`:key` is explicit, but the hidden patcher may reuse or reorder nodes) | = |
| Accessible names | + (one naming function) | + | = (still manual) | = |
| Zoom and layout | = | = | = | = |
| Focus | + | ++ (explicit target API) | + (refs and `nextTick`; still manual) | + (assertions) |
| Animation cancellation and conservation | = (already good) | = | − (risk) | = |
| Visual/linear parity | + | ++ (one builder, two variants) | + if shared components; parity still needs two layouts | = |
| CSS ownership | + (map; dead rule) | + | ± (scoped styles could fragment `--ff-*` token ownership) | + |
| Test coupling | + (P2) | ± (keep ids for parity) | −− (mock DOM is likely unusable; change environment; re-audit 54 route rows) | + (P4) |
| Dependency, build and runtime | none | none | `vue` + `@vitejs/plugin-vue` + test utilities. The SFC compile step is mandatory. Static hosting is unaffected. | none |
| Owner understandability | + (map) | + (smaller units with named contracts) | ++ for an owner who reads Vue; − where the reactivity scheduler hides when DOM changes | + |
| Preserves inspectable completed context and blocks future answers from the DOM | = | = (keep scene-gated projection) | Requires discipline. `v-show` keeps future controls in the DOM and fails Invariant 6b; `v-if` must be used. | = |

Mathematical authority and the "no second source of instructional truth" rule are preserved under all options if components receive frozen scene data and emit intents. Under O3, every component's local reactive state becomes a new place where instructional state could leak. The same hazard already exists in app.js's transient variables, so this is a discipline concern, not a disqualifier.

## 6. Do tests favour implementation structure over learner behavior?

They mix both. The evidence does not support the claim that imperative DOM exists to suit the unit tests. The more accurate statement is that the **hand-rolled mock DOM** (`tests/fixtures/mock-dom.js`, 439 lines) and **class/id locators** couple tests to the current markup, and some guards can pass vacuously.

**Meaningful witnesses to preserve through any change:**

- **Focus identity.** `app-shell.test.js:108,126,249,266`; `plan26-practice-set.test.js:254,334,394`; browser `assertFocused`.
- **Draft preservation across view toggle and Replay.** `app-shell.test.js:116-135, 870-876`.
- **Exact visible copy and accessible names.** `app-shell.test.js:446-452`; `render-recovery.test.js:211-228`.
- **No future values.** `render-foundation.test.js:141-203`; `plan25-task-help.test.js:72,82` (scene data level).
- **State and replay identity.** `plan26-practice-set.test.js:213-214, 288, 388`; Plan 25 replay oracles.
- **Exact intent payloads from clicks.** `access-parity.test.js:268-281`.
- **Render purity intent.** `render-purity.test.js:368-456`.
- **Browser geometry, motion and conservation witnesses.** `run-route-matrix.js:388-535`.

**Coupling that obstructs safe change.**

1. **Vacuous guards.** Leakage helpers read `box.querySelector('.active-beat-prompt')?.textContent || ''` (`leakage-invariants.test.js:62`). A renamed class makes the invariant pass silently. The same failure mode applies to `notContainsText` rows when notation changes (§4a).
2. **Silent scan bypass.** `render-purity.test.js:459-469` reads a hard-coded list of nine files. Any new render module (vanilla or `.vue`) is unscanned, and moving a file throws. Arithmetic bans are name-based, which is how the gcd in `fraction-bar.js:63-75` passes.
3. **Mock internals.** Tests read `_isFocused` and `_eventListeners` (`app-shell.test.js:136, 233, 273, 523, 528`). Mock events do not bubble (`mock-dom.js:251-260`), so event delegation fails under test. tabIndex is derived from the tag, so `tabIndex >= 0` checks are tautological. There is no label association or role computation, so "accessible name" unit checks see only attributes.
4. **Overclaims.** The test titled "target >= 24px" (`render-foundation.test.js:231`) checks only that a class is present.
5. **Count and order pins.** Route counts (`route-contract.test.js:107-275`), `children.indexOf` order (`access-parity.test.js:483-487`), and Playwright `>> nth=` locators.
6. **Unmount pinning.** Invariant 6b requires zero choice nodes during replay. That is correct as a leakage guard, but it means any `v-show`/`hidden` implementation would fail. Keep it.

**Implication for Vue.** The mock DOM lacks `insertBefore`, `nextSibling` and text nodes. The Vue runtime DOM uses all of these when patching, so the current unit layer almost certainly could not mount Vue components. This is inference: no Vue mount was attempted. The Vue testing guide recommends Vitest with happy-dom and `@vue/test-utils` or Testing Library. A Vue step is therefore also a test-environment migration.

Separately, replacing the mock DOM with happy-dom or jsdom would make the existing unit tests more faithful, with bubbling and label association, even without Vue. It is a new dev dependency that has to earn its complexity, so it is listed as an owner decision rather than recommended.

## 7. Minimal intervention and the one pilot

### P1–P4 (no pilot needed)

These are specified in §1. P1 is the highest-value, lowest-risk item. It closes a defect class that has already occurred once and still has a live residual (`path-closure.js` `>= 2`).

**Purity constraint for P1.** Renderers may not import `src/content/**` (`render-purity.test.js:475-476`). Shared capability constants therefore belong in a neutral module that content, interaction and render may all import, for example alongside `src/render/contract.js`. Alternatively, the scene projection can carry capability-checked data.

### P5 pilot: one owner for the transform-response region (vanilla)

**Scope.** Only the transform beat's response area: the numerator input, the help multiplier step, and accepted/incorrect cues.

- Create one module that both renderers call with a `variant` (`visual` | `linear`). It replaces `beat-container.js:476-544` and `linear-path.js:534-598`.
- Move the active-beat token into one exported `activeBeatKey(scene, ui)` used by both renderers.
- Give the region an explicit API:
  - `responseTarget(kind)`, which returns the connected, visible element to focus;
  - a draft-change callback (an `input` listener), so drafts are pushed rather than scraped;
  - a help-button slot passed in by app.js, instead of app.js moving nodes into renderer subtrees.
- In app.js, delete the six id-string queries and the `aria-controls` string construction for transform.

**Unchanged contracts.**

- Scene shape and intents.
- Episode, definition revisions and replay envelope.
- Provenance.
- All DOM ids, classes and accessible names that route rows and unit tests assert. Keep them byte-identical for the pilot, so that parity is provable and test edits stay minimal.
- The decide beat and every other beat.
- No dependency changes.

**Parity checks before acceptance.**

- Full Vitest run.
- Full route matrix with an unchanged row and execution count.
- Plan 25's 16-case × open/recover/reopen/accept active-element sweep, re-run.
- Replay oracle verifier.
- Matched screenshots of help closed, open, incorrect and accepted, visual and linear, at both 360px references.
- One reduced-motion and one touch journey.

**Rollback.** Revert the pilot commit or commits. There is no data, replay or identity change to unwind.

**Follow-on representative edit that tests the benefit.** After acceptance, make one small owner-chosen transform-help change. Candidates:

- show the Plan 31 stacked source fraction in the multiplier question;
- add a recovery cue variant;
- move the equation's position.

Compare against 7863584 and 99244b2: files touched, whether both renderers and app.js still change, and whether any focus or draft repair is needed.

**Falsification.** The claimed benefit is false if any of the following hold:

- the follow-on edit still needs mirrored edits in both renderers or any change to app.js's draft and focus code;
- a focus or draft regression appears in the route matrix or the active-element sweep;
- the pilot requires changing route selectors or accessible names to pass;
- total lines across `app.js` and the two renderers for this region do not shrink;
- the owner, reading the pilot module and its call sites, finds the help flow harder to follow than before. This is a deliberate, subjective gate.

**Why vanilla, not Vue, for the pilot.** It tests the hypothesis the evidence supports, single lifecycle ownership, without changing the build, test environment or route-runner assumptions at the same time. A Vue island at this level would be confounded by interop with the imperative parent (§5 b). If the owner still wants a Vue comparison afterward, the pilot's seams (scene in, intents out, key, focus targets, draft events) are exactly the props and emits a Vue component would need. A throwaway-branch Vue version of the same region could then be compared on the same follow-on edit. That would be a separate owner-approved packet.

## 8. Sequencing relative to Plans 30, 31 and 19

- **Pause nothing.** None of the findings is a learner-facing defect in current accepted behavior. The residual `>= 2` drift (I-3) is latent while the authored rows have three or more choices.
- **Plan 31 (typography)** may proceed when the owner initiates it. Correct its brief first:
  1. Fraction styles live in `src/styles/render.css`, not `src/app/styles.css`.
  2. Warn that stacked markup changes `textContent`. `containsText` rows will move, and `notContainsText "16/24"`-style leakage rows can pass vacuously. Require the implementer to preserve an equivalent, non-vacuous leakage assertion.
  3. Note that bar readout markup exists in two `fraction-bar.js` constructors.

  Plan 31 is also the natural place to introduce the single fraction-notation primitive and naming function from §5a. It touches `linear-path.js` and `fraction-bar.js`, so **serialize it with the P5 pilot**. Run Plan 31 first: it is owner-visible and smaller, and the pilot's follow-on edit can then use the notation primitive.
- **Plan 19 (shared-factor family)** adds per-item definition resolution and a new authored item, exactly where admission drift lands. **P1 should land before Plan 19's implementation**, either as a small standalone packet or as an explicit Requirement 0 deliverable. It need not block Plan 19's mechanism proposal.
- **Plan 30 (compact authoring investigation)** stays independent and docs/evidence-only. It should use P1's all-items admission check as a tool rather than build a parallel validator. Its finding of the duplicated revision map would be expected, and P1 already proposes fixing it.
- **P2–P4** are independent small changes. P4 overlaps any packet that runs browser evidence, so schedule it between packets.

## 9. External sources

- Vue `key` forces replacement and lifecycle re-run; without keys Vue patches in place: https://vuejs.org/api/built-in-special-attributes.html (section `key`).
- Vue's accessibility guide shows focus moved by developer code (a `watch` on route calling `focus()`). It does not describe automatic focus management after content updates: https://vuejs.org/guide/best-practices/accessibility.html.
- Vue's testing guide recommends Vitest, a happy-dom environment in its recipe, and `@vue/test-utils`. It advises testing "what a component does, not how it does it": https://vuejs.org/guide/scaling-up/testing.html.
- Vue `<Transition>` triggers include `v-if`, `v-show` and `key` change. It provides `enter-cancelled`/`leave-cancelled` hooks. The page does not mention `prefers-reduced-motion`: https://vuejs.org/guide/built-ins/transition.html.

Pages were fetched on 2026-10-10 and summarized; no code from them was used.

## 10. Pushback against the framing

1. **"Structured markup in small units" addresses the least-evidenced cost.** Not one of sixteen recorded incidents traces to failing to find or understand markup. The costliest source incidents trace to an implicit lifecycle protocol (I-1, I-2, I-6, I-7) and to unshared contracts (I-3, I-4, I-5). Vue's strongest advantage, readable templates, mainly helps (a), which is already the cheapest revision.
2. **Line counts are a weak signal; duplication is a strong one.** A 1,047-line `beat-container.js` is not a cost by itself. A 19-field token copied verbatim into two files, plus near-identical +74/+73 edits for one feature, is a measurable maintenance tax.
3. **The orchestration correction was itself incomplete.** The scoping note "corrected" Plan 31's path to `src/app/styles.css`, but the typography rules live in `src/styles/render.css`. This supports P3: routing documents need to be checked against `main.js`, not memory.
4. **The Plan 26 repair did not fully close its defect class.** `path-closure.js` still admits two-choice reflections. Repairs fixed the instance, not the seam.
5. **Some "accessibility" unit tests prove less than their titles.** Under the mock DOM, tabIndex and target-size checks are tautological. Browser routes carry the real evidence. Do not read 321 passing unit tests as accessibility proof.
6. **A framework does not make the lifecycle contract disappear.** It relocates it into `:key` expressions and `nextTick` callbacks. The 19-field decision would still have to be made, reviewed and duplicated-or-shared.
7. **The retrospectives' emphasis on evidence quality is correct but partly tautological.** Packets require heavy evidence, so evidence work dominates any count. P4 reduces that cost. It should not be read as evidence that evidence requirements are excessive.

## 11. Unresolved owner decisions

1. Authorize P1 as a standalone small packet, or fold it into Plan 19's Requirement 0.
2. Authorize P2–P4, and the revision-map location and format.
3. Decide whether to authorize the P5 vanilla pilot, and confirm its timing after Plan 31.
4. Decide whether to replace the hand-rolled mock DOM with happy-dom or jsdom. This is a dev dependency only. It would make unit DOM tests more faithful and is a prerequisite for any Vue experiment.
5. Decide how much weight owner direct code-reading carries against agent edit cost. If it is high, a later Vue comparison on the pilot region becomes more defensible. If it is low, the pilot and map likely suffice.
6. Decide whether a Vue comparison is wanted at all after the pilot. If so, it should be a separately approved throwaway-branch experiment on the same region and the same follow-on edit.

## 12. Limits

- There is no browser, device, assistive-technology or zoom evidence. Every rendered-behavior claim is from source or from cited reviews.
- The four traces are hypothetical edit plans, not implemented comparisons. Option ratings are judgments.
- No effort, time or token attribution is possible from the record. Repair counts were not used causally.
- Helper reports were verified for every load-bearing claim used here. Some helper inferences were not used.
- Vue compatibility with the mock DOM is inferred from the mock's missing APIs, not tested.
