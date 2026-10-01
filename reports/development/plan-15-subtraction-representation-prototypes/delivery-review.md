# Plan 15 delivery review

- Date: 2026-10-01.
- Implementation: `61b9f67`; report: `bb2f1be`.
- Disposition: received as `delivered`; bounded Repair 01 required. No owner rendered-screen acceptance, representation preference, push, or deployment.

## Verified foundation

The orchestrator independently ran the suite (271 tests), complete learner/prototype build, and full browser route matrix (31 passed from 29 rows). Packet lint and diff check passed. A parsed deep comparison with `f6f6252` confirms all original 27 route rows are exactly preserved. The learner bundle filenames/sizes match the preceding build; source scope inspection confirms no math, episode, app, or learner-renderer changes. A separate read-only review checked the math model and route/render implementation.

The exact math functions, fixed fixtures, persistent removal marks, equivalent-answer acceptance, plain retry, fixture reset, and isolated build are appropriate for the approved prototype. The draft register and observation guide retain the intended disqualification posture and handling limits. These facts do not override the findings below.

## Findings

### R1 — Redundant completed controls and explanatory copy

The supplied screenshots agree with `prototypes/subtraction/main.js`: after action, `Remove one part` becomes `Parts marked`, and `Show the gap` becomes `Gap shown`. Both receive `aria-disabled=true` but remain native enabled buttons and keyboard stops. Real browser clicks followed by keyboard traversal confirmed that focus stays on, and can return to, these inactive controls. The endpoint additionally shows a model note and a separate counting instruction.

The owner's concern is justified: the spent button advertises an action without providing one and occupies a full control row; the surrounding copy repeats state/instruction. Remove the completed control and the extra explanatory model note, retaining the visual operation evidence and one short answer instruction. Transfer focus to the numerator input when the final operation action completes so removing the focused control does not lose the keyboard position. Earlier takeaway clicks must retain the removal control. Preserve meaningful semantic operation state without supplying the numeric answer.

### R2 — Visual negative control does not reject invisible graphics

The two prototype rows capture `#representation-visual.innerHTML`; wrapper classes, quantity labels, and notes guarantee different captures regardless of visible graphics. Operation assertions check selector counts rather than visible rendered marks.

The orchestrator seeded a derived-output-only CSS defect: `.fraction-whole, .gap-grid { visibility: hidden !important; }`. A filtered takeaway run auto-included its comparison counterpart; all four standard/reduced-motion executions still passed despite absent bars and marks. The built CSS was restored byte-for-byte in `finally`; no source was changed. This independently verifies that the current acceptance instrument misses a material visual failure.

Strengthen the two prototype witnesses to check visible bars and actual operation geometry/marks, and compare a representation-only rendered witness that does not gain diversity from labels/classes. Demonstrate failure for hidden/collapsed graphics and success for the genuine representations. Preserve all 27 learner rows and existing learner assertions.

### R3 — Configured transition duration reported as observed motion

`render()` replaces `visual.innerHTML` after each action. Newly inserted elements have their final styles; the comparison marker has no opacity change. The evidence script reads `getComputedStyle(...).transitionDuration` and asserts nonzero duration for standard motion. This measures a declaration, not an executed transition.

Real browser operation clicks in both modes showed replacement of the visual node, no active animations, and no `transitionrun` events. The reported measured standard transitions are unsupported. Standard motion was optional at the gate. Prefer keeping the current immediate static endpoints and correcting the capture assertions, measurement terminology, and report; no animation work is necessary. If actual motion is proposed instead, keep it narrowly learner-triggered and prove its execution separately from its declaration.

## Repair and acceptance boundary

See `repair-01.md` for the authorized bounded repair and checks. Packet remains `delivered`. Keyboard/touch evidence is bounded browser evidence; native device typing and meaningful nonvisual gap interpretation are not inferred from keyboard completion. No real learner observations were conducted. After repair, technical re-review and owner review of refreshed rendered screens remain required.
