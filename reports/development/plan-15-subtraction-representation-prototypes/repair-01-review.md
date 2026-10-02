# Plan 15 Repair 01 re-review

- Date: 2026-10-02.
- Reviewed implementation/evidence `9254ae5` and report `f6dcd50`.
- Disposition: R1 and R3 satisfied; R2 improved but not yet satisfied. Packet remains delivered; rendered-screen acceptance remains owner-gated.

## Satisfied repairs

The refreshed screens remove the spent operation buttons and duplicate model notes, retain the operation graphics, and show one answer instruction. Independent Edge browser keyboard actions on the nested fixture confirm that an intermediate takeaway removal retains its visible button and focus; the final action in both prototypes hides the button and focuses the numerator. Shift+Tab then Tab traverses fixture selector to numerator without revisiting the spent control. Source changes limit focus movement to the operation-completion branches.

Unused transitions are removed, and the evidence script records executed events and active animation counts. The committed 32 measurements describe static endpoints in both motion preferences instead of treating configured durations as executed motion. Native mobile keyboard entry and real learner observations remain untested.

The orchestrator independently ran 271 tests, both builds, all 31 browser executions, the seeded visual verifier, packet lint, and diff check. All ordinary checks passed. Existing seeds now reject hidden graphics (4/4), collapsed graphics (4/4), and erased removal hatch (both takeaway executions, while comparison passes). The restored clean run passes 4/4. Deep comparison confirms the original 27 learner rows are unchanged. A read-only source reviewer also inspected the repair.

## Remaining R2 defect — required paint can be invisible

The geometry witness checks opaque paint and box dimensions but does not distinguish opaque white from a white surrounding card, or fully clipped graphics from visible graphics. The orchestrator independently reproduced both cases using only temporary built CSS, restoring the original bytes in `finally` after each run:

1. `.gap-marker { background: white !important; border-color: white !important; }` erases the comparison bracket against its white background. The filtered reciprocal run still passes all four executions, including both comparison witnesses. The two bars and computed style data still supply capture diversity without a visible gap mark.
2. `#representation-visual { clip-path: inset(100%) !important; }` clips away both operation representations. All four executions still pass because rectangles/paint declarations persist and ancestor clipping is absent from the witness.

These are verified gaps in the required rendered evidence, not defects in the unmodified prototype screens. The hatch-specific fix should be complemented by an actual comparison-mark distinction and rejection of fully clipped required graphics. Repair 02 is confined to the visual witness and failing-first verification; it does not reopen the satisfied surface/focus or static-motion work.

No source changes, push, deployment, owner acceptance, or representation choice were made during this review.
