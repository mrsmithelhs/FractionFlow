# Plan 11 Repair 01 — Replay trigger and motion witness closure

## Authorization and scope

Bounded repair of the approved Plan 11 mechanism; not a new instructional/product
policy. Read `delivery-review.md` and `mechanism-review.md`, run packet preflight,
and implement the fixes below. Do not change packet status, math/content/interaction/
scene contracts, identities, support policy, subtraction prototypes or orchestrator
review records. No push or deployment. Leave Plan 22's denominator repair separate.

Permitted scope: `src/render/fraction-bar.js`, `scripts/dev/run-route-matrix.js`,
`tests/route-contract.test.js`, `tests/routes/route-matrix.json`, meaningful targeted
renderer tests if needed, and this packet's updated progress/evidence. Identify any
additional necessary paths before broadening. No source change is needed for the
already passing ordinary choreography or static inspection behavior unless a
confirmed dependency of this fix requires it.

## Required fixes

1. **New accepted work during Replay.** Start the approved new-boundary effect when
   a genuinely new conversion is accepted while the previous conversion is being
   replayed. Repro: left 8/12 accepted → real Replay click → right 3/12 submitted.
   Preserve the difference between that response and dismissing an already-established
   Replay. Do not merely remove `!wasReplaying` without regression evidence. Help,
   ordinary dismissal/updates, mode/view changes and restored old content must not
   spontaneously animate. Reduced mode must reach the same correct endpoint instantly.

2. **Actual partial and settled paint.** Measure partial height against the actual
   inner boundary layer rather than the bordered outer track. Require a sample
   strictly between zero and full interior height with useful measured tolerance.
   At settlement, assert each newly introduced boundary spans the proper interior,
   remains connected and positioned as its supplied grid requires. Preserve anchor
   identities/geometry and visible question/control checks.

3. **Durable failing-first sensitivity.** Add reproducible no-op keyframe and
   half-height-new-boundary seeds. Browser-only overrides are acceptable and avoid
   working-tree source mutation. Both must fail at the intended paint/settlement
   assertion, not for an unrelated missing route or control. Retain previous disabled-
   motion, static-mode accidental-motion, reduced-motion accidental-motion and shared
   subtraction verifier coverage. Restore/clean-run evidence after the seeds.

4. **Reduced Replay through mounted controls.** Add a reduced-motion Replay journey:
   accepted conversion → Replay held at the starting form without running effects →
   real Show-new-parts activation → immediate correct endpoint, no running effects.
   Check persistent bar anchors, response input/value/focus as applicable, and no
   stale replay after reset/re-entry. Retain standard-motion Replay and both static
   reflection Done-looking focus routes. New matrix rows/executions are allowed;
   preserving the old 39/41 count is not a requirement that can override coverage.

## Acceptance evidence

- Real-control regression for the Replay-then-new-conversion sequence in standard
  and reduced motion; correct math/state and permitted animation behavior.
- No old conversion restarts on help/dismissal/repeated updates or standard-mode restoration.
- No-op and half-height seeds fail specifically; clean geometry/paint witnesses pass.
- Standard/reduced Replay endpoints and input/focus continuity verified at reference
  360px viewports, without changing Inspection Mode semantics.
- Meaningful targeted tests, full `npm test`, learner/prototype build, full browser
  matrix, shared seeded verifier, packet lint and `git diff --check` pass.

Apply inherited advisor declaration/disposition rules. Commit explicit scoped paths,
then updated progress report last. Report the exact new route count and all limits.
Stop for delivery re-review; owner motion/deployed acceptance remains pending.
