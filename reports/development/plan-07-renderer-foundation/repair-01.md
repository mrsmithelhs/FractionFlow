# Plan 07 — Repair 01

- **Packet:** `plan-07` — Renderer Foundation and Learner-Facing Strings
- **Date:** 2026-09-19
- **Raised by:** orchestrator review of the delivered work (commits `4f26887`, `93d549f`)
- **Status of packet:** returned to `in-progress`. Not accepted.

The delivered work is substantially good and the four mechanism conditions are genuinely met. Two
defects block acceptance, both in `src/render/beat-container.js`, and both are in the class this
packet exists to prevent. A third, smaller one repeats a defect already fixed elsewhere.

## Blocker 1 — The render layer computes mathematics

`src/render/beat-container.js:235-240`, in the `decide` beat:

```javascript
const leftDen = scene.meaning.quantities.left.currentForm.denominator;
const rightDen = scene.meaning.quantities.right.currentForm.denominator;
const candidates = [
  String(Number(leftDen) * Number(rightDen)),
  String(Number(leftDen) * 2),
  String(Number(rightDen) * 2),
].filter((v, i, arr) => arr.indexOf(v) === i && Number(v) <= 30).sort((a, b) => Number(a) - Number(b));
```

The presentation layer is deriving candidate common denominators by multiplying and doubling
operand denominators, then filtering by the DECISION-011 ceiling. This violates:

- the packet's first non-goal — "No denominator, equivalence, sum, or correctness outcome computed
  in `src/render/`";
- Requirement 2, renderer purity;
- the separation rule itself, by creating a second source of mathematical truth in the layer that is
  supposed to have none.

It is also mathematically fragile on its own terms. `leftDen * rightDen` is the LCD only when the
denominators are relatively prime — true for this family, but an arithmetic assumption baked into a
renderer that is supposed to be reusable. `leftDen * 2` is not necessarily a common denominator at
all. And the `<= 30` ceiling is now duplicated in the presentation layer, where it will silently
drift from `src/content/eligibility.js` the first time DECISION-011 is revised.

**The purity test did not catch this because it never looked here.** `tests/render-purity.test.js`
proves by construction that `fraction-bar.js` and `symbolic.js` compute nothing. `beat-container.js`
— the module that actually computes — is not covered by it. That is the proxy-metric pattern the
project's guardrails name: 171 passing tests, and the single claim they were meant to establish is
untested in the one place it fails.

**Required repair.** The candidate list must come from upstream, not from arithmetic in the
renderer. The scene does not currently expose one: `unitRelationship` carries `sourceDenominators`,
`commonUnit` (only once established), and `authoredCoverage`, and there is no candidate field
anywhere in `scene.meaning`. The content layer does hold the material —
`src/content/eligibility.js` returns `paths: { canonical, alternates }`.

So this is a genuine upstream gap, and the correct response was to **stop and report it**, not to
compute a substitute. Do that now. Report the gap with a proposed shape for exposing candidates
through the scene, and stop for orchestrator approval before implementing it. Exposing candidates
will touch `src/interaction/scene.js`, which is outside this packet's write scope, so it needs
explicit authorization rather than an in-packet decision.

Note for the proposal: leakage invariant 2 permits a constrained choice list containing a valid
target, but the scene must not reveal which candidate is correct. A candidate list that contains
exactly one valid option would violate that, so the shape matters.

## Blocker 2 — Hardcoded `'12'` fallback

`src/render/beat-container.js:264`, in the `transform` beat:

```javascript
const targetDen = scene.meaning.unitRelationship.commonUnit?.targetDenominator || '12';
```

When `commonUnit` is absent the renderer silently falls back to the canonical instance's common
denominator. For any other eligible instance this renames against the wrong unit and does so without
error. A missing `commonUnit` at the `transform` beat is an upstream inconsistency and must fail
loudly — throw a `RenderContractError` — not be papered over with a literal.

This is the same canonical-instance leakage as mechanism-gate Condition A, which was correctly
fixed in `strings.js`. The fix did not reach its siblings.

## Finding 3 — `feedbackSame` hardcodes the canonical denominators

`src/render/strings.js:35`:

```javascript
feedbackSame: 'Look at the parts: one bar has thirds and one has fourths.',
```

Wrong for every instance except `2/3 + 1/4`. Same defect class as Condition A. Parameterize it, or
replace it with wording that does not name specific unit sizes.

## Also worth doing while you are here

Neither of these blocks acceptance on its own.

- **Extend the purity test to every render module**, not just the two renderers. The test's own
  framing — "proves by construction that X does not compute mathematics" — should hold for
  `beat-container.js` and `controls.js` too. A module-level check that no render source performs
  arithmetic on mathematical values would be stronger than a per-renderer behavioral test, and would
  have caught Blocker 1.
- **The Remaining Risks section lists only what `plan-08` and `plan-09` will do.** That is scope, not
  risk. A report with no self-identified limitation is weaker than one that names, for instance, that
  `tests/fixtures/mock-dom.js` is a hand-rolled mini-DOM that models class and attribute selectors
  but not layout, focus order, or assistive-technology behavior — so nothing here is accessibility
  evidence, and `plan-08` will be the first real test of these claims. State that plainly.

## Acceptance checks for this repair

- [ ] No arithmetic on mathematical values anywhere in `src/render/`. Candidate denominators, target
      denominators, and any other mathematical fact are read from upstream, never derived.
- [ ] The upstream gap is reported and its resolution approved before any change to
      `src/interaction/scene.js`.
- [ ] No literal `'12'`, `'3'`, `'4'`, `thirds`, or `fourths` anywhere in `src/render/` outside test
      fixtures. A missing upstream value throws rather than defaulting.
- [ ] Purity coverage extended to all render modules, and demonstrated to fail against the code as
      delivered at `4f26887`.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Repair appended to the progress report, including a corrected Remaining Risks section.

## What is accepted and should not be redone

- All four mechanism-gate conditions are genuinely implemented. `resolveRenderableScene` is a single
  validation point that hands renderers only a frozen scene with no instructional state (Condition C),
  and the role switch reads `sceneResult.continuation?.representationRole` with no container
  heuristics (Condition D).
- `strings.js` satisfies Condition A for `validLeast` and Condition B for DECISION-026, with both a
  check-the-premise yes/no whose correct answer varies and a "none of these" matching option.
- DECISION-025 is correctly implemented: `role="img"` on the parent, `aria-hidden` on every segment,
  no listeners, nothing focusable.
- `tests/render-foundation.test.js` exercises the real pipeline through `createEpisode`,
  `projectScene`, and `resolveRenderableScene`, including a real capability refusal and role switch.
  That is meaningful integration coverage, not a synthetic stand-in.
- The Branch C advisor declaration is compliant and correctly reasoned from the fail-closed rule.
- The "built against WCAG 2.2 AA" wording is correct throughout; no conformance is claimed.
