# Plan 49 Requirement 0 — mechanism proposal

Date: 2026-11-01  
Disposition: proposed for orchestrator approval; no source changes authorized by this document.  
Preflight: `node scripts/dev/plan-status.js check 49` returned RUNNABLE. Initial `main` was ahead 138; three untracked Plan 39 route-run JSON files belong to other work and are untouched.

## Investigation and reuse boundary

Plan 45's comparison reducer (`src/interaction/plan45-comparison-episode.js`) has a two-entry compare/resolve schedule, exact-key intents, separate assistance history and a first-source model lock. Its scene (`src/interaction/scene.js`) exposes the selected model and original forms before acceptance, and the renderer (`src/render/plan45-comparison.js`) shows the paired models only after acceptance. The expected relation can exist in internal classification/provenance; it must not cross the pre-acceptance scene/DOM/accessibility boundary. The app's captured response handle and per-render scope guard (`src/app/app.js`) are essential: Plan 45 Repair 01 established that callbacks looking up a mutable current handle permit retired controls to mutate a later item.

`src/math/fraction.js` and `src/math/validation.js` provide exact common-denominator validity, side reasons, scale factors and amount-preserving conversion; these are exported by `src/math/index.js`. The existing interaction classifiers require arithmetic instances; denominator eligibility additionally imposes arithmetic coverage and fraction-bar limits. The task-help and transform-help handlers in `src/interaction/episode.js` depend on arithmetic content, scheduled entries and established common denominator. Do not invent an addition/subtraction instance. Reuse exact math/validation directly, and the accepted Plan 24 denominator-product cue and Plan 25 requested multiplier question/accepted-factor cue as behavior and copy; adapt narrowly within comparison. If a small input-based extraction avoids duplicated validation, preserve existing arithmetic callers and their results. Existing visual/linear help controls are coupled to arithmetic scenes, so adapt their accessible behavior, not their instance-dependent handlers.

The close-pair cue in `plan45ComparisonHelpText` actually discloses the LCD numerically. Revision 1 and replay v9 must continue to reproduce this historical behavior. For new launches, propose a revision-2 nonnumeric cue, “Try naming both amounts with the same-size parts.” If a numerical cue has already been disclosed in a historical revision-1 episode, it remains recorded as requested assistance and is never reclassified as independent. Revision-1 episodes retain their old behavior and cannot enter the new workspace; no cross-revision live migration. This avoids asking a learner to discover a denominator already supplied by the new cue.

## Proposed local flow and copy

Keep one existing Need help disclosure. Add “Use the same denominator” within it. The relation choices and Check remain available throughout; entering, closing, reopening or abandoning assistance never submits a relation. The workspace replaces its own completed question rather than building a transcript. Originals and accepted symbolic work remain compact context. All controls occur beside their active question.

1. “Choose a denominator both fractions can use.” Learner enters a positive whole number and checks it. Optional local “Help me find one” records a request and shows “Try multiplying [first denominator] by [second denominator] to find one common denominator.” This supplies a method, not the product; the learner computes and submits the target. Non-common target gets exact side-specific or generic recovery; malformed input gets a usable retry. A valid but unavailable target receives “That is a common denominator, but this workspace can use numbers up to 144. Try another.” No auto-entry or automatic opening.
2. On accepted target, ask “Rename [first original] in [target]ths. What is the numerator?” A requested local helper asks “What multiplier turns [source denominator] parts into [target]?” and uses a separate raw factor input; after acceptance it replaces that question with “Multiply the top by [accepted factor], too.” Learner still enters and checks the numerator. Wrong factor or numerator yields local non-revealing recovery. For a source already at the target, show its original as the unchanged accepted form and do not ask for factor 1 or a redundant numerator. Then do the same for the second source, never supplying its as-yet-unconstructed numerator.
3. Show the two learner-accepted symbolic forms with “Compare these amounts.” The learner makes the original relation choice. No relation is selected or filled. Keep only the already chosen original source model before relation acceptance; no new filled models or hidden second model. The existing paired verification and direct Next/final Back appear only after acceptance.

Proposed symbolic workspace admission is any positive common denominator at most **144**, after exact mathematical validity is established. 144 is a bounded symbolic-input policy, not a mathematical or bar capacity. A valid target above it is unavailable, not wrong. No new large partitioned representation is needed; source bars retain existing source denominators. Every pair admits its LCD and twice its LCD within 144. A product hint yields at most 72 for the current set. An admitted target is not restricted to the least or authored targets. Test parsing and bounded integer handling at the checkpoint; stop if existing exact capabilities cannot support this policy.

Exact audit from the 12 registered source records (LCD; equivalent forms at LCD, for review only, not prefilled UI):

| Item | Originals | LCD | Forms |
|---|---|---:|---|
| 01 | 2/3, 3/5 | 15 | 10/15, 9/15 |
| 02 | 5/8, 3/8 | 8 | unchanged, unchanged |
| 03 | 4/6, 6/9 | 18 | 12/18, 12/18 |
| 04 | 6/9, 4/6 | 18 | 12/18, 12/18 |
| 05 | 3/4, 5/6 | 12 | 9/12, 10/12 |
| 06 | 5/6, 3/4 | 12 | 10/12, 9/12 |
| 07 | 2/3, 7/10 | 30 | 20/30, 21/30 |
| 08 | 3/8, 5/8 | 8 | unchanged, unchanged |
| 09 | 3/5, 3/7 | 35 | 21/35, 15/35 |
| 10 | 3/8, 5/9 | 72 | 27/72, 40/72 |
| 11 | 4/8, 1/2 | 8 | unchanged, 4/8 |
| 12 | 1/2, 4/8 | 8 | 4/8, unchanged |

The table is an investigation audit, to be independently exercised by algorithms and tests at the pure checkpoint, not a per-item answer table for implementation. Items 09 and 10 both exceed the old bar limit of 30.

## Contract proposed for the checkpoint

Use local comparison responsibility, retaining compare/resolve schedule and original source order. Proposed new revision-2-only exact-key intents: `open-comparison-construction` (no payload); `request-comparison-construction-help` (`helpKind`: `denominator` or `multiplier`, with side derived from current phase); `submit-comparison-denominator` (`proposed`: canonical nonnegative whole wire); `submit-comparison-multiplier` (`proposed`: same wire); `submit-comparison-numerator` (`proposed`: same wire); and `revise-comparison-denominator` (no payload). The existing three comparison intents retain their meanings. An explicit revise action returns to denominator entry and clears target-dependent accepted forms/factors and helper drafts, with a visible notice; originals, relation draft, source-model lock, prior assistance and attempt history remain. Only current-phase submissions are admissible; duplicate or stale requests and retired controls cannot advance another side or item. Parser-invalid user text remains app-local with feedback; malformed external intent is rejected atomically. Pin exact wire shape and deterministic duplicate semantics in checkpoint 1, before serializer edits.

Proposed episode-owned `assistance.construction`: inactive or `{ phase: denominator | first | second | ready, target: null | decimal-string, acceptedForms: {first: null | form, second: null | form}, activeMultiplier: null | decimal-string, attempts: [...], requestedHelp: [...] }`. The precise serializable shape is to be frozen at checkpoint 1. State transitions derive side and factor from validated source/target, check amount preservation upstream, maintain helper attempt/error records separately from final relation retries, and record requested help and constructive participation in provenance. Use only learner-accepted forms or unchanged originals in scene; project current prompt, current non-answer-bearing recovery, permitted accepted context and current actions. Do not project future numerator, expected factor on a wrong attempt, relation truth, or private classification.

App owns raw denominator, factor, numerator and relation drafts, disclosure visibility, selected view and focus. Preserve them across close/reopen, wrong checks, view/resize/remount; reset target-dependent drafts on explicit revise and all help state on Next, restart or return/re-entry. Capture current item, episode generation, render scope and active phase in each handler, refresh bindings on rerender, revoke old scopes, and focus a connected current question/control after transitions. Relation remains independently actionable even with a partially completed workspace. No assistance phase auto-starts after an error.

## Revision and replay proposal

Pin `phase-4-symbolic-fraction-comparison@2` to the new assistance and cue policy, with a new comparison-only replay v10 envelope; keep revision 1 bound to v9, exact old three-intent validation and historical outcomes. V10 accepts only revision 2 and its explicit whitelist; v9 rejects new intents, v10 rejects revision 1, other definitions and malformed contexts. Preserve the existing authoritative set/item/source identity, make definition revision explicit in reconstructed context, and verify exact keys and identity against records. Replay chronological accepted instructional intents including requested help and attempts; unsent drafts, disclosure state, focus and view stay app-local. Revision registration, context reconstruction and actual schema availability need confirmation in pure checkpoint; no serializer edits before that gate. Capture pre-change v9 full-state oracles, including numerical cue and model/retry paths, and compare unchanged results afterward.

## Discriminating journeys and evidence

Close pair: 2/3 and 3/5; optionally request nonnumeric reasoning, open workspace, request product help, enter 15, enter first numerator 10, request multiplier help for 3/5 and enter 3, then enter 9. Choose the relation independently. At every pre-acceptance stage inspect both visible and hidden/accessibility trees for future numerator, relation and second model leaks.

Recovery/withdrawal: on 3/8 and 5/9 enter 24 (non-common), correct to 72, make a wrong multiplier and correct it, leave a numerator draft, close/reopen and switch views. Explicitly revise to another admitted common target where available; 144 is valid here, invalidating earlier forms. Alternatively close the workspace and submit the saved original relation draft. A correct final relation remains possible even with unfinished help. Test valid-but-unavailable 216 separately, and verify fresh Next/restart/re-entry and old detached controls cannot change later state.

Pure tests: independently computed integer oracles for all 12 LCDs, validity and conversion, valid non-least, malformed/zero, 144/above boundary, equality, unchanged sides and reversed operands; phase and intent refusals, helpers, invalidation, provenance and legacy/new replay. Mounted/browser evidence: optional short path, requested-help and recovery, both views, keyboard and non-drag touch, stale controls and focus/draft continuity; 360x740 and 1093x614 DPR 1.25 bounds and scroll, no overflow. Include real failing-first answer/model leak, stale-state and conversion seeds, clean recovery, final suite/build/settled matrix/lint/diff. Browser samples are not learner, physical-device or assistive-technology evidence.

## Proposed file ownership and gate

After approval, pure scope: `src/interaction/plan45-comparison-episode.js`, `classification.js`, `scene.js`, `provenance.js`, `episode-definition.js`, comparison content/context module and focused tests; only narrowly extracted helpers if necessary. At the separate pure checkpoint, document the exact contract and audit in `checkpoint-1.md` and stop for approval before broad mounted integration. Subsequent integration may touch `src/interaction/replay.js`, `src/app/app.js`, `src/render/plan45-comparison.js`, render contract/strings and necessary styles, focused tests and additive route/evidence artifacts. Definition and replay compatibility must be proven before serializer changes. Serialize shared source/build/route work with other writers. No packet status, push or deployment changes.

This proposal is unapproved. Owner rendered-page/task acceptance remains separate from mechanism and technical review. The requested Terra-medium read-only review is reserved for substantial settled integration, not this investigation; no consultation ran at this docs-only gate.
