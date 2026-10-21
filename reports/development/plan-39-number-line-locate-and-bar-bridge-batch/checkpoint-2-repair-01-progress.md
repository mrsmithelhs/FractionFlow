# Plan 39 Checkpoint 2 Repair 01 Progress

Date: 2026-10-21. This report records the bounded Repair 01 after the rejected
Checkpoint 2 (`ad913ce`). It does not replace that failed receipt or authorize
Stage 6, route-matrix edits, owner acceptance, packet completion, or deployment.

## Repair result

The repaired learner surface uses the canonical practice-type id
`bar-to-line-same-amount` and the learner label “Place fractions on a number
line.” Visual locate mode uses a discrete left/right stepper that moves the
visible point as a preview; the explicit Check Position action is the only
submission. Linear mode remains a native radio group. The source bar retains
intrinsic fraction typography and visibly divided segments, and the same
zero-to-one endpoints align with the number line. At resolve, the connector
joins the source shade edge to the accepted point, including the non-half 5/6
case. Renderer geometry only positions already-projected exact forms; it does
not determine correctness or instructional classification.

The app owns the opaque task-local preview and focus/reset lifecycle; the active
region reads and writes its current controls and preview handle. Repeated
selection reacquires the replaced track. Help controls reference the mounted
help paragraph, and Continue focuses the new encounter controls. Completed
episodes no longer expose a spent Finish action. The entry and completed copy
does not duplicate the source fraction or repeat an already completed request.

## Verification performed on final source

- `npm test`: 56 test files, 504 tests passed.
- `npm run build:learner`: passed; Vite emitted the learner production bundle.
- `npm run build:prototype`: passed; Vite emitted the subtraction prototype.
- `mounted-repair-probe.mjs`: passed in mounted Chrome at 360×740, DPR 1. It
  measured prompt and full controls in one viewport at scrollY 0; the source
  bar and axis endpoints both measured x=41..319; the half shade edge, connector
  start, and accepted point center all measured x=180. The 112×64 stepper
  controls and 310×44 Check control satisfy the 44px target floor. Three
  failing-first mutations were rejected by the ordinary assertions: enabling
  Check before selection, making selection auto-submit, and undersizing the
  stepper target. Clean run had no browser errors.
- `coverage-probe.mjs`: all eight contexts passed: high b8 and odd b3, medium
  records 07 and 08, both visual and linear modes, at 360×740 DPR 1 and
  1093×614 DPR 1.25. Assertions cover actual viewport/DPR, no initial
  selection, preview without grading, explicit resolution, candidate counts,
  control size/non-overlap/hit targets, common-scroll prompt/control containment,
  line/bar endpoint alignment, readable distinct candidate descriptions,
  keyboard radio navigation, and no spent Finish after completion. It also
  checks source/accepted connector geometry, including medium 5/6.
- `agency-journey-probe.mjs`: passed mounted Continue focus; wrong-endpoint
  recovery and connected focus; help open/close/reopen and correct
  `aria-controls` targets through view changes; repeated recovery; retry reset;
  return/re-entry reset; accepted Check and Next to a fresh encounter. No browser
  errors were observed.

The report-local probes, their JSON results, and representative screenshots are
in `evidence/checkpoint-2/repair-01/`. This includes actual viewport captures
for high b8 and medium 5/6 at both tested viewport sizes, plus locate/resolve
captures for all eight coverage contexts. The probes use the built static app
served in-process and real mounted Chrome interactions; they are bounded browser
evidence, not assistive-technology or physical-device verification.

The broad combined `npm run build` command had previously encountered a
Windows `EPERM` while creating the prototype output directory in the same
combined invocation. Each required build target was rerun independently on
the final source and passed as recorded above. No dependency was installed.

## Scope and remaining gate

Changes remain within the approved app/render/style/focused-test and
report-local evidence scope. No math, content, interaction, replay, route-matrix,
historical fixture, packet status, or parent-owned review record was changed in
this repair. The original Checkpoint 2 receipt remains preserved as history.

The mechanism is submitted for parent re-review. Stage 6 is not authorized until
that review approves this repaired checkpoint. No owner rendered-page/agency
acceptance or deployment gate is claimed. Physical touch hardware and
assistive-technology behavior remain unverified. Consultation disposition:
orchestrator-gate-only; parent-provided read-only review/technical direction was
used, and no child advisor or fan-out was run by this writer.
