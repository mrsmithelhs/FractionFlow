# Plan 49 delivery review and bounded Repair 01

Date: 2026-11-01. Implementation/evidence `c7a2988`, progress `c185a4a`.
Disposition: **bounded repair required before owner rendered/task acceptance**.

Parent inspected the public-state adapter, dispatcher/scene/replay changes,
renderer/app bindings, tests, browser journeys and narrow screenshot. Independent
focused rerun: four files, 17/17 tests passed. Public revision-2 identity and
chronology, helper-phase/epoch guards, optional relation completion and historical
v9 oracles are consistent with the approved direction in the inspected scope.
Parent did not rerun the full suite, build or browser matrix. Existing 118-route
regression evidence is separate from the new helper's sampled standalone browser
journeys. No duplicate Terra pass was used.

## 1. Reuse shared fraction typography in the helper

`makeConstruction` emits accepted equations and source fractions in helper labels
as slash-delimited text, such as `First: 2/3 = 10/15` and `...as 3/5?`. The packet
requires shared typography and the owner has repeatedly requested consistent
stacked fractions. Use the existing symbolic fraction component for mathematical
forms in these contexts, retaining meaningful input labels/accessibility and
compact inline alignment. Do not add repeated textual equations or explanation
paragraphs. Keep the single original comparison expression and useful accepted
construction context; this is a presentation correction, not a new task.

## 2. Replace vacuous falsification with production-path evidence

The wrong-conversion seed creates `11/15` and expects the exact core to consider
it equal to `2/3`, deliberately failing an assertion that cannot pass for correct
math. It neither causes production conversion acceptance nor feeds the bad form
through the current rendered task. Other seeds currently mutate isolated copies
of projection/state and test those same fields. These are limited invariant
examples, not strong evidence that normal mounted witnesses detect the defects.

Add a small mounted verifier with reusable ordinary assertions on actual rendered
construction, using the exact core independently for accepted-form fidelity and
checking answer/model withholding and target-revision reset. Run it clean; inject
a future accepted form, a wrong accepted/displayed conversion and stale work into
the state/DOM/behavior actually consumed by that mounted path; each relevant
ordinary assertion must fail. Remove mutations and show the same assertions pass.
No seed-specific throw, fabricated acceptance receipt or assertion of known-wrong
math as true. Browser seeds are not required if meaningful mounted proof suffices;
report the layer accurately. Replace or clearly retire the old overstated cases.

## Bounded browser/access follow-up

Refresh affected helper screenshots after the typography change. Add one short
real sequential Tab journey through opening help, target input/Check and at least
one renaming action, asserting meaningful label and connected focus after the
transition. The current `locator.press` focuses each named control directly; it
does not establish reachability via Tab. Keep existing limitations honest; no
physical-device or assistive-technology claim follows. Do not enlarge the harness
or repeat the whole matrix per draft. Once settled, run required final validation
and retain the actual clean receipts, isolating historical runner artifacts.

No mathematics redesign, larger bank, new strategy or broad extraction requested.
No second advisor is needed; parent will inspect these corrections directly.
Commit scoped code/evidence and progress separately last; return for re-review.
Plan49 remains in progress; no status/owner acceptance/push/deploy authority.
