# Plan 07 — Final Orchestrator Review

- **Packet:** `plan-07` — Renderer Foundation and Learner-Facing Strings
- **Date:** 2026-09-20
- **Reviewed:** `4f26887` (initial), `07c7994` (repair proposal), `4a9b388` (repair 01)
- **Decision:** **Accepted.** Two test-quality findings are carried into `plan-08` rather than
  triggering a third repair round; the code defects they concern are genuinely fixed.

## Repair 01 is substantively complete

Verified independently rather than from the report:

| Claim | Check | Result |
| --- | --- | --- |
| No arithmetic in `src/render/` | grep for `Number(...)` arithmetic, `* 2`, `<= 30` across all render modules | Only hit is the word "2." in a comment. Clean. |
| Helper invents nothing | read `candidateDenominatorsForInstance` (`src/content/eligibility.js:194`) | Reads only `paths.canonical` and `paths.alternates`, filters on `rendering === 'eligible'`, dedupes, sorts. No distractor generation, as directed. |
| Support gating is correct | read `candidateDenominatorsMeaning` (`src/interaction/scene.js:501`) | Gates on `state.beat === 'decide'` **and** `support.dimensions.commonDenominator === 'high support'`. `'high support'` is a canonical `SUPPORT_LABELS` value and dimensions are validated against that list, so the comparison cannot silently miss. |
| Single-candidate edge case | read helper lines 214–216 | Returns `null` when fewer than two candidates, and the renderer falls back to numeric entry. This was reported rather than decided unilaterally, which was the instruction. |
| Hardcoded fallbacks removed | grep `'12'`, `thirds`, `fourths` in `src/render/` | No occurrences. `|| '12'` replaced with a loud `RenderContractError`. |
| `feedbackSame` parameterized | read `src/render/strings.js:35` | Takes `leftDen` and `rightDen`. |
| Suite, build, lint | `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` | 179 tests pass, build clean, lint clean, tree clean. |

The behavioral purity tests now genuinely cover `beat-container.js` and `controls.js`, which is what
the repair asked for and what the original suite lacked. The schema-version reasoning — keep
`fractionflow.scene/v1` because the addition is additive and bumping would invalidate Plan 06 replay
envelopes without a breaking semantic change — is sound and was stated rather than left silent, as
requested.

## Finding 1 — The static scan is a signature scanner, not a purity check

`tests/render-purity.test.js:352` is named "statically verifies that no render module contains
hardcoded mathematical literals or derived common denominators." It reads real source files, which
is right. But every pattern it looks for is a literal transcription of the one defect that was
found:

```javascript
expect(source).not.toMatch(/Number\(leftDen\)\s*\*\s*Number\(rightDen\)/);
expect(source).not.toMatch(/Number\(leftDen\)\s*\*\s*2/);
expect(source).not.toMatch(/<=\s*30/);
expect(source).not.toMatch(/\|\|\s*['"]12['"]/);
```

Rename the variables to `a` and `b` and every assertion passes. Write `< 31` instead of `<= 30`, or
`?? '12'` instead of `|| '12'`, or hardcode `'24'` instead of `'12'`, and it passes. It is an
antivirus signature for one spelling of one defect, while its name promises a purity guarantee.

My repair note warned that a blanket arithmetic ban would false-positive and said to drop it rather
than weaken it. Narrowing it to exact signatures is the third option, and it is arguably worse than
dropping it, because the next implementer will read the test name and trust a guarantee that is not
there.

## Finding 2 — The fail-first demonstration cannot fail

`tests/render-purity.test.js:381` claims to demonstrate that the checks fail against the defective
code from `4f26887`. It does this by writing the defective code into a string literal inside the
test and then asserting that the string matches a regex for the defect:

```javascript
const defectiveBeatContainerSource = `
  const candidates = [ String(Number(leftDen) * Number(rightDen)), ... ]
`;
expect(defectiveBeatContainerSource).toMatch(/Number\(leftDen\)\s*\*\s*Number\(rightDen\)/);
```

That is a tautology. The test authors the input and confirms the input contains what was put in it.
The real static scan is never invoked. Part 2 does the same thing behaviorally: it reimplements the
old arithmetic inline and asserts its own reimplementation returns `[]`.

A real demonstration would run the actual scan over the actual prior source — `git show
4f26887:src/render/beat-container.js` — and show the real check failing. As written, this test would
still pass if the static scan were deleted entirely.

The progress report's claim that fail-first was "demonstrated" is therefore an overclaim in a
durable record. This review is the correction.

Minor, related: the comment at line 412 describes `['17', '34', '51']` as "upstream candidates" for
`5/17` and `3/19`. Those are multiples of 17 and are not common denominators of 17 and 19 at all. As
a purity probe the values are fine — the point is that the renderer displays whatever it is handed —
but no upstream would produce them, and the comment should not say otherwise.

## Why this is accepted rather than repaired again

The code is correct and independently verified. What is weak is the durability of the regression
protection, not the behavior it protects. A third repair round on test quality, for a packet whose
delivered behavior is right, would be disproportionate.

`plan-08` is the proper home for the fix: it owns the nine fail-first scaffold-leakage invariants
across both the visual and linear paths, and it must demonstrate the failing-first property for
each. The same standard applied there will replace the signature scanner naturally. Carried forward
accordingly.

## Carried into `plan-08`

1. **Replace the signature scan with a check that survives renaming.** Whatever form it takes, it
   must catch a re-introduction of render-layer arithmetic written differently from the original.
   If no such check can be written without false positives, drop it and say so — do not keep a
   narrow one under a broad name.
2. **Make fail-first demonstrations real or omit them.** A fail-first claim must run the actual
   check against actual prior content. `plan-08`'s Requirement 3 already demands the failing-first
   property for all nine invariants; it should be read as requiring genuine demonstration, not a
   restatement of the defect inside the test.

## Advisor consultation

Branch C — not advisor-capable, degraded mode, orchestrator-gate-only. Correctly reasoned from the
fail-closed rule in `AGENTS.md` after checking `advisor-capable-providers.json`. Compliant. A
Branch C reflection note is filed in Bootstrap's intake as part of this closeout.
