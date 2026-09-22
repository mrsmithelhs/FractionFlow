# Plan 14 — Delivery Review

- **Date:** 2026-09-22
- **Reviewed:** `9155684`
- **Decision:** **One correction required before certification.** Everything else is accepted, verified
  independently. The packet has already justified its own existence by catching a defect that both the
  test harness and I had certified as fixed.

## Verified independently, not taken from the report

| check | result |
|---|---|
| `npm run test:routes` | **20/20 passed**, run here, headless Edge against `dist/` |
| `npm test` | 253 passed, 21 files |
| `npm run build`, `plan-status.js lint` | clean |
| `git diff 8be4ec2..9155684 -- src/` | **0 lines** — `src/` genuinely untouched |
| **Rule 1, with my own seed** | registered `orchestrator-seed-unreachable` in `conditions.js`; harness refused before launching a browser: `FATAL (Rule 1): Registered configuration "orchestrator-seed-unreachable" has no declared route witness in the matrix.` Reverted. |

Conditions A–D are all met. Two zero-dispatch traversals exist (`ROUTE-TRAVERSAL-VISUAL-NO-DISPATCH`,
`ROUTE-TRAVERSAL-LINEAR-NO-DISPATCH`); `declaredSameAs` expresses bundle 4's intentional sameness with
bundle 1 at `transform`; all four premise rows exist across both routes and both answers; Playwright
drives the built application.

## The finding is real, and it corrects me

The report states that Inspection Mode focus restoration never happens for a real user, because the
Replay button sits in `aside.app-support-panel` — **outside** the `rootEl` that
`beat-container.js:236` tests with `rootEl.contains(document.activeElement)`. A real click focuses the
button first, the guard evaluates false, `previousFocusRef` stays `null`, and "Done looking" drops
focus to `body`.

I reproduced both paths on the deployed build, at `reflect`, with a focused reflection choice:

```
A — programmatic .click()        before: choice → during: Done looking → after: choice   ✓ restores
B — focus() then .click()        before: choice → during: Done looking → after: BODY     ✗ drops
```

Path B is what a browser does on mousedown. Path A is what I did when I wrote
`focus-restore-review.md` and reported *"3 for 3"*.

**So this defect has now survived three layers of verification, each blind for a different reason:**

1. `mock-dom.js`'s `click()` never updates `document.activeElement`, so the harness could not see it.
2. My browser check used programmatic `.click()`, which does not move focus, so the browser could not
   see it either — I had the right tool and the wrong gesture.
3. Only a real click, which focuses the target before activating it, reproduces the failure.

That is the exact argument for this packet, made against the orchestrator rather than by him. The
correction to `focus-restore-review.md` is recorded in that file.

**The implementer honored the stop condition.** They found a behavior `plan-09` claims and does not
have, and reported it instead of quietly repairing `src/` to make their row pass. That was the right
call and it is why the finding is legible.

## Required correction — do not make a defect the contract

`ROUTE-FOCUS-INSPECTION-RESTORE` asserts:

```json
{ "type": "activeElementEquals", "target": "activeElement", "value": "body" }
```

and the runner has no concept of a known defect — `grep -n "knownDefect" scripts/dev/run-route-matrix.js`
returns nothing.

So the matrix now encodes a live accessibility defect as the expected behavior, and the run prints
**"20/20 passed"** while one of those passes means a keyboard and screen-reader user is still being
dropped to the top of the document. When someone repairs it, `npm run test:routes` will fail and the
repair will look like the regression.

Required:

1. A **`knownDefect`** field on a row — an id, a one-line description, and a pointer to where the defect
   is tracked.
2. The runner **surfaces it distinctly**: such a row does not count as a plain pass, and the summary
   line reports it separately (`18 passed, 1 known defect, 1 …`), so no run ever reads clean while a
   declared defect stands.
3. The runner **fails when a `knownDefect` row stops exhibiting the defect.** A marker that survives
   its own repair is how a known defect becomes permanent. When the behavior is fixed, the harness
   should demand the marker be retired and the assertion inverted.

This is the same discipline the packet applies everywhere else — the difference between "we checked"
and "we wrote down what we found" — turned on its own output.

## Not a defect, and worth saying so

`ROUTE-FOCUS-REPLAY-INTERACTIVE` records that a real click on Replay moves focus to the Replay button,
and that toggling replay off does not return focus to the numerator input; what survives is the input
node and its typed value (`"3"`), preserved by `activeBeatRenderToken`.

**That is correct behavior, not a second defect.** Repair 06's Condition B required that replay not
*steal* focus to a display card while a learner is mid-entry. Focus resting on the control the learner
just pressed is what every button on the web does, and the learner's work is intact. Nobody should
"fix" it.

## Smaller notes, none blocking

- The matrix uses `360×740` throughout, consistently. Good — and worth carrying into `plan-10`'s
  successor packets.
- `ROUTE-COND-4-TRANSFORM-SAME` has `negativeControl: null` and a `declaredSameAs` instead, which is
  the right shape: it is asserting an equality, so it has no opposite to differ from.
- The runner rejects `dispatch-fallback` against the production static build entirely, which is
  stronger than Condition A asked for. The `reason` / `witnessRouteId` validation is there as required.

## What remains

Apply the `knownDefect` correction and the packet is certifiable. Separately — and this is not
`plan-14`'s work — the focus defect itself needs a repair, and it is an accessibility defect on a
deployed slice rather than a paper finding. Recommended shape in the handoff.
