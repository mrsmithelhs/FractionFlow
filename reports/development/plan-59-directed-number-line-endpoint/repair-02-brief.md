# Plan 59 Repair 02 — draggable End

2026-11-02. Owner rendered review requests a draggable End item consistent with
other placement tasks: start in a distinct drag-start area, highlight target
positions while moving and drop tentatively. Plan59 remains delivered pending
this requested revision and owner acceptance; previous technical review is historical.
No push/deployment or task closure is authorized.

## Mechanism checkpoint before source

Inspect current Plan53/50 drag lifecycle and Plan59 renderer. Propose the smallest
reuse/adaptation, including pointer anchor, capture/cancel, highlight/drop mapping,
layout reserve, keyboard/access parity and stale-generation guards. Send proposal
directly to orchestration and stop before source. No general drag framework or
wholesale renderer copy. Identify any actual need for shared extraction before edits.

This changes input modality, not math, authored records, episode intents or replay
semantics: preserve all six, fixed supplied Start, initially null endpoint and
explicit Check. Do not bump definition/replay identities merely for a gesture
without semantic change; flag any actual compatibility consequence at the gate.

## Required behavior after approval

- Put the word End in a clearly separate drag-start tray with familiar hover/grab
  affordance and solid contained tile. No default location. Replace the visible
  “Endpoint not placed” sentence with the useful physical affordance; retain coherent
  accessible unplaced/current-position descriptions for buttons and the tile.
- Drag the unplaced or already placed End using primary pointer capture. Preserve
  pointer-to-tile offset so an off-center grab does not shift its mathematical anchor.
  The nearest valid candidate highlight must predict the drop result. Release sets
  a tentative endpoint only; no correctness feedback or advance until Check.
- Supplied Start remains fixed and distinct. Do not pre-reveal the derived target
  through a tile label, highlight, accessible name or arrow. Selection is learner
  work, not acceptance. No answer-derived attractor or viewport-based truth.
- Invalid/off-line drop, pointer cancellation, capture loss, view change, resize,
  restart/navigation and destruction cancel transient drag without committing an
  unintended response or changing prior draft/help. Retired callbacks cannot mutate
  the next or same-item restarted attempt. Preserve document scroll appropriately.
- Keep direct tap/click, large step correction and linear controls as alternatives;
  no drag requirement or extra direction question. One concise placement instruction,
  not separate repeated instructions for every input method. No duplicate live path.
- Reserve active tray space as needed so placement/revision does not move the line
  under the pointer. Remove the spent tray after acceptance. Keep benchmark/feedback
  clearance and Start/End separation fixed by Repair01, including enlarged text.
  Tile text stays contained and off the line. Accepted directed interval and direct
  progression remain as approved; no new celebratory effect or empty Finish.

## Evidence and delivery

Verify unplaced drag and redrag, off-center grabs and neighboring drop boundaries,
highlight/drop agreement, invalid drop/cancel, resize/access/reset/navigation during
drag, stale controls, tap/keyboard alternatives, wrong/revised/help and accepted
addition/subtraction. Include mouse and emulated touch at360x740, ChromebookDPR1.25
and200%text. Same-snapshot geometry must preserve whole scale, active line stability,
benchmark clearance and accepted direction. Do not claim physical-finger usability.

Add ordinary assertions with an anchor/snap mismatch or cancellation defect seed,
record intended failure and clean restoration; preserve existing state/arrow/clearance
witnesses. Save representative tray/drag-highlight/accepted screenshots and measurements,
not a per-item quota. Run focused affected tests/browser checks, build/lint/diff;
broaden regression only for shared behavior changes. No repeated full historical
matrix for a task-local gesture. No automatic second reviewer: propose a bounded
Terra-medium consultation only if the actual implementation warrants it; no Sol/Astra,
substitution or fan-out. Parent independently verifies the substantial concerns.

Commit explicit scoped paths and progress separately last with coordinated Git
window. Preserve old evidence/review records and unrelated receipts. No status or
acceptance edits, broad framework, persistence, new content, push or deployment.
