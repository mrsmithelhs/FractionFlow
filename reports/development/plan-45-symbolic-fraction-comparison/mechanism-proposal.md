# Plan 45 Requirement 0 — Mechanism Proposal

Date: 2026-10-31  
Status: submitted for orchestrator approval; no source changes authorized yet.  
Preflight: `node scripts/dev/plan-status.js check 45` returned `RUNNABLE`.  
Initial tree: clean, `main...origin/main [ahead 117]`.

## Task understanding and gate

Deliver one symbolic-first comparison goal with a fixed ordered batch of twelve
positive proper-fraction pairs. The learner makes one `<`, `=`, or `>` response.
No bars appear initially. Optional help can model exactly one selected source
fraction; the first requested side stays locked for that problem attempt through
help close/reopen, retry, view changes and renderer remounts. Both aligned honest
models appear only after the relation is accepted. Existing More/Less support
profiles and shared direct progression remain the only modes.

This is Requirement 0 only. The proposal is persisted here and sent to the
orchestrator. I will make no production source or test changes before explicit
approval. After approval, Requirement 1 will first establish the pure content and
instructional contract and stop at Checkpoint 1 before broad app/route integration.

## Current source findings

- `src/math/fraction.js` and `src/math/classify.js` expose exact fraction creation,
  normalization/comparison and benchmark operations. Comparison should reuse
  exact arithmetic; no addition/subtraction operation is appropriate.
- Existing curated tasks are resolved through `src/app/app.js`, represented in
  `src/app/practice-types.js`, scheduled by `src/interaction/beat-schedule.js`,
  and classified in `src/interaction/episode.js` before scene projection in
  `src/interaction/scene.js`.
- `src/interaction/replay.js` currently accepts replay schemas v1 through v8.
  V8 is specifically bound to Plan 39 bridge repair. Plan 45 adds new context and
  intent meanings, so it must use a new comparison-only replay schema (proposed
  v9) and exact context validator. Existing v1-v8 shapes and fixture meanings
  remain unchanged. Confirm against actual current replay oracles before coding;
  do not assign v9 until the final context/intent wire is approved.
- `src/app/app.js` owns raw response drafts, help visibility, selected view, focus
  policy, and direct progression descriptors. `src/render/beat-container.js` and
  `src/render/linear-path.js` own their mounted response region and recovery shell.
  `src/render/contract.js` is the renderer validation seam. The renderers must
  receive only validated scene meaning and dispatch raw learner intent.
- Plan 43's direct local Next/final Back boundary is already shared in the app;
  comparison should provide completion eligibility and its result scene to that
  boundary, not implement a second progression mechanism.
- Existing support profiles are registered in `src/app/support-levels.js` and
  broad dimensions are projected through app/scene. Neither profile may auto-show
  a model. More may project one short strategy cue; Less keeps identical optional
  assistance available by request.

## Proposed data, identities and validation

Add a comparison-specific task module and curated data module rather than forcing
the items through an arithmetic-shaped recipe or operation enum:

- Definition: `phase-4-symbolic-fraction-comparison@1` (proposed identity).
- Practice set: `symbolic-fraction-comparison-vetted-set@1`.
- Task data: `plan45-symbolic-fraction-comparison-task-data@1`.
- Ordered records: stable `plan45-compare-01` through `plan45-compare-12`, each
  with authored `itemId`, authoring revision, ordered positive proper source
  forms, and a cue ID. No record stores expected relation, correctness flag, or
  normalized display fraction.
- The fixed schedule identity/revision is carried by practice item metadata and a
  task-local schedule definition. Its entries represent compare, accept/recover,
  and terminal result/progression; it does not reuse add/subtract operation beats.

The task validator rejects unknown keys, malformed wire integers, unsupported
cue IDs, duplicate item IDs, non-positive/non-proper operands and any denominator
above 10. It creates exact fractions through the existing math API, derives the
expected relation with `compareFractions`, derives normalized identity with
`simplifyFraction`, and derives any half-benchmark cue context with exact APIs.
Source numerator/denominator wires and left-to-right order remain unchanged for
display, scene and replay. No universal LCD<=30 rule is added because only each
source bar is represented before acceptance.

## Instruction, intent, scene and response ownership

The episode state owns `modelChoice: null | first | second`, help-request
provenance and submitted/check outcome. The first valid model request is an
instructional intent; a second side request while locked fails closed, including
when stale or duplicated. Model choice survives every renderer remount because
it is derived from replayable episode state, not a renderer flag. A fresh episode
created by Next, explicit restart, or return/re-entry starts unlocked.

The app owns the raw relation draft, help disclosure open state, selected view,
draft restoration on remount, and focus timing, following Plan 42's bounded
response-handle pattern. A dedicated comparison response region composes one
native three-option radio group plus Check, and emits the raw relation wire only
when Check is activated. Empty or unsupported values are refused; they are never
coerced to a default. The renderer owns neither comparison truth nor support
policy.

Before acceptance, validated scene state contains both original source forms,
the learner's own draft, help state, and at most the selected source model. It
contains no expected relation, correctness bit, correct-option marker, or
answer-bearing feedback. Wrong Check emits generic local recovery, preserves all
three choices and the selected model, and returns focus to a connected current
response control. After acceptance, the scene carries the submitted relation,
concise useful verification, and both aligned same-whole models. Linear and visual
views project equivalent information and the same pre-acceptance withholding.

## Help, support and presentation boundary

One optional disclosure groups notation guidance, one authored reasoning cue and
the first/second model choice. Initial arrangement: symbolic fractions and prompt
first; relation group and Check second; one closed Help disclosure below. After a
model request, replace the side-choice controls in the same disclosure area with
the chosen side label and its truthful single bar plus a one-half benchmark where
appropriate. No second filled bar or empty comparator appears before acceptance.
On acceptance, the result region retains the comparison and shows the paired
models, then the shared local Next problem or final Back to start control.

Proposed cues are “Can one half separate these amounts?”, “Both fractions count
three parts. Compare the size of each part.”, “These amounts are close. Could
same-size parts help?”, and the notation cue “The open side faces the greater
amount.” Cue selection is authored; benchmark truth/value is derived exactly.
Wrong relation does not diagnose a misconception. Existing generic wrong-check
recovery, response-region accessibility and relation radio requirements apply.
Any shared reviewer/presentation condition must be checked for honest applicability
to this static comparison. Do not claim that premise renaming or choreography
conditions apply. If current condition capability prevents an honest static task
registration, propose one narrow capability behavior before integration; do not
redesign global reviewer settings.

## Compatibility and replay policy

Keep current replay schemas v1-v8 and all arithmetic/number-line definitions,
route objects, context maps, action objects, and historical results unchanged.
Introduce a comparison-only v9 envelope only after exact v9 context fields and
comparison intent wires are frozen. V9 must reject non-comparison definitions;
comparison identities must resolve against the authoritative 12-item registry,
and reconstructed source forms/revisions must exactly match it. Invalid identity,
intent, model side, relation, or envelope keys refuse explicitly. Replay applies
the recorded first model request and relation/check chronology; it does not infer
model choice from the current renderer or rewrite prior results. Before deciding
the final schema version, check all current fixtures/oracles and the replay
validator's exact-key rules. Append isolated current Plan 45 witnesses; never
relabel or regenerate old fixtures as Plan 45 evidence.

Generation protection remains app-owned: a comparison response handle is tied to
the current schedule position, item ID, response prompt and episode generation.
Stale model requests or Check submissions are ignored/refused and cannot mutate
the first accepted model selection. Next uses Plan 43's shared eligibility,
preparation, generation guard, one-step fresh installation and focus policy.

## Proposed implementation ownership (subject to gate)

Core task/data/definition ownership:

- `src/content/plan45-symbolic-fraction-comparison-task.js`
- `src/content/data/plan45-symbolic-fraction-comparison-records.js`
- `src/interaction/episode-definition.js`
- `src/interaction/beat-schedule.js`
- `src/interaction/classification.js`
- `src/interaction/episode.js`
- `src/interaction/scene.js`
- `src/interaction/provenance.js`
- `src/interaction/replay.js`
- `src/render/contract.js`
- new `src/render/compare-response.js`, mounted by `src/render/beat-container.js` and
  `src/render/linear-path.js`
- `src/app/practice-types.js`, `src/app/app.js`, and `src/app/conditions.js`
- `src/render/strings.js`, `src/styles/render.css`, and `src/app/styles.css` only as
  needed for concise copy, 44px target sizing, focused layout and view parity
- focused content, interaction, scene, replay compatibility, response, app and
  route tests; append-only changes to `tests/routes/route-matrix.json` and
  `tests/routes/plan34-context-map.json`; new Plan 45 evidence under this report
  folder.

Route/build output is shared. Before touching it, serialize with other writers,
recheck tree state, and preserve every existing route object and context entry.
No dependency, Bootstrap, packet status, push, or deployment changes.

## Evidence map and sampled journeys

- Pure contract: all 12 exact relations, normalization identities, proper-fraction
  and denominator limits, cue derivation, raw form/order preservation, malformed
  record rejection, invalid intent/model rejection.
- Mounted deterministic checks: each actual item ID progresses through one
  selected relation, Check, acceptance or recovery, retained model lock/draft,
  actual next identity and final exhaustion. Full bank claims come only from the
  deterministic/mounted sweep.
- Browser sample: outcomes `<`, `=`, `>`; both model sides; wrong then revised;
  More and Less; visual and linear; help close/reopen; model request then view
  switch/remount/resize/200% text; recovery, accepted pair, Next and final Back.
- Falsification seeds mutate actual DOM/state/handler before ordinary assertions:
  (1) reveal both bars or expected answer before acceptance; (2) alter locked model
  on retry or view remount; (3) invert `<`/`>` or treat equality as inequality;
  (4) stale/no-op Next. Save the real failing assertion and then a clean recovery.
- Viewports: 360x740, 360x752, 1366x768, 1093x614 at DPR 1.25. Record model
  containment, unit geometry, overflow, scroll position, focus reach, keyboard
  path, browser-touch path and reduced motion. Physical-device and assistive-tech
  claims remain unavailable unless separately performed.

## Stop condition

Await explicit orchestrator approval of this mechanism and exact file ownership.
No source, test, route, or app integration files have been changed in this stage.
