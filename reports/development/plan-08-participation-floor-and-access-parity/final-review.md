# Plan 08 — Final Orchestrator Review

- **Packet:** `plan-08` — Participation Floor and Access Parity
- **Date:** 2026-09-20
- **Reviewed:** `2f5f0e3` (proposal), `ab6882c` (implementation), `08e3f38` (report), `3019ce9` + `78cda79` (Repair 01)
- **Decision:** **Accepted.**

## Repair 01 is complete and disciplined

Verified independently:

- `git diff --stat ab6882c HEAD -- src/` is empty. The repair was documentation and test-naming only,
  as instructed.
- The §44 column now reads **"Human Review Required (not yet performed)"**, and every cell states an
  obligation rather than a finding — "Manual tabbing sequence audit and Enter/Space activation review
  required in real browser," "Reduced-motion inspection required in browser with OS preference
  enabled." The word "verified" is gone.
- The mechanized cell for keyboard operation now states plainly that Enter/Space activation is
  deferred to `plan-09`, which is the honest position and was available all along.
- `tests/access-parity.test.js:254` is renamed to "evidences focus reachability, native element type,
  and non-drag tap completion," which is exactly what it does. Twenty-plus
  `expect(['BUTTON','INPUT']).toContain(el.tagName)` assertions were added, so the claim that native
  elements carry the activation guarantee is now itself tested.
- Section 7 is retitled "Structural Self-Assessment," carries an authority note stating that full
  rubric evaluation is pending owner and teacher review against rendered screens, and explicitly
  says `plan-09` does not inherit "rubric satisfied" as a settled result. Each criterion reads
  "Structurally addressed" rather than "Satisfied."
- 200 tests pass, build clean, lint clean, tree clean.

## What this packet delivered

The substance was accepted before the repair and stands:

- **The leakage suite is the strongest test work in the project.** All nine invariants run the same
  assertion function against real mounted output and against a deliberately leaking fixture, so each
  is proven to catch the leak it names, in both directions. This is the genuine failing-first
  property that `plan-07` claimed and did not have.
- **The behavioral purity probe is rename-proof.** Feeding `candidateDenominators: ['7','19']` for
  operands 3 and 4 — values no correct computation could produce — and asserting faithful display is
  a stronger guarantee than any regex over source, and it cannot be defeated by renaming a variable.
  It replaced the tautological test rather than sitting beside it.
- **The `plan-07` boundary held.** The linear path was built on it without renegotiation;
  `src/render/linear-path.js` imports only from the render layer. The access-modality architecture
  approved at `plan-07`'s three-path gate survived contact with an implementation, which is what that
  gate existed to find out.
- **OQ-04 recorded as `none`**, with a rationale that correctly distinguishes a perceptual modality
  translation from an instructional adaptation.
- **DECISION-026 has parity.** The check-the-premise form is implemented in the linear path with its
  own `premisePromptLinear` variant, and both paths dispatch identical action payloads.
- **Section 8 separates exercised environments from the targeted matrix** without blurring them, and
  Section 11 names live browser geometry and screen-reader behavior as `plan-09` obligations.

## Standing note carried forward

Six times across `plan-07` and `plan-08`, a label promised more than its body delivered: a purity
suite covering two of five modules; a static scan matching four literal regexes; a tautological
fail-first test; a keyboard test asserting `tabIndex`; an evidence column listing activities; a
rubric marked satisfied on unmeasurable criteria. Each was caught, each was cheaply repaired, and the
underlying code was sound every time.

The rate did not fall between packets, so `plan-09` should assume it will recur. The cheapest guard
is the one that caught all six: **read the body against the name before crediting the claim, and
check which modules a test actually imports.** This is recorded in the session handoff.

`plan-09` inherits two specific instances that are not yet closed anywhere: the 48px and 85% layout
figures are design intent with no measurement, and the DECISION-021 rubric is structurally
self-assessed but not evaluated. Both are correctly labeled in this packet's report; `plan-09` owns
turning them into evidence or dropping them.

## Advisor consultation

Branch C — not advisor-capable, degraded mode, orchestrator-gate-only. Correctly reasoned from the
fail-closed rule, and the report states plainly that consultation was warranted by the behavioral
surface but unavailable. Compliant. A Branch C reflection note is filed in Bootstrap's intake.
