# Plan 42 maintenance evaluation — parent assessment

Date: 2026-10-21. One cold Luna-medium worker per arm, run serially with the same
committed F1 brief. Requested model/settings recorded; runtime model identity and
billed usage not independently observed. Neither F1 patch is adopted production.

## Result

The pilot shows a concrete improvement in edit locality and ownership, not a
measured overall agent-efficiency gain. The same temporary change required four
render-source files before extraction and three after. The duplicate pass-through
edits in the two renderer cases became one change in the shared response region.
Neither arm needed app draft/focus edits. The production extraction separately
removed app operation-control selectors and form-definition lists.

| | Arm A | Arm B |
|---|---|---|
| Baseline | `d7936a7` guarded, before extraction | `436e54a` corrected extraction |
| Final isolated F1 commit | `c1f0760` (initial `20c7708`) | `675ea1a` |
| Render-source files changed | controls, strings, visual renderer, linear renderer | controls, strings, shared operate region |
| Mirrored response call-site changes | Both renderer cases | One shared takeaway branch |
| Scope error on first implementation | Association enabled for every fraction input | Same error |
| Parent correction | Explicit default-off takeaway opt-in plus negative control | Same correction |
| Focused worker checks | 14 tests; final build and Chrome probe | 30 tests; builds, negative control and Chrome probe |

Counts are different existing suites, not a comparative quality score. Parent
independently ran Arm A's eight render-foundation tests including the new negative
control, and Arm B's non-takeaway negative-control script; both passed. Parent
inspected actual source patches, scripts, result receipts and reports, rather
than accepting the workers' scope claims. Both final patches explicitly enable
association only for takeaway responses and preserve unrelated descriptions.

## What the evidence establishes

Both mounted Chrome probes used registered practice controls and no injected
episode state. They cover visual and linear local malformed/repeated submits,
unique alert identity, token preservation, clear-on-input, valid-submit cleanup,
and sampled help/draft/reset/recovery behavior. Viewports/preferences differ:
A used 360×780 and B 360×740, both reduced-motion preference. These are reasonable
functional samples, not an identical-layout experiment or actual motion-event,
touch-device or assistive-technology validation. The final production parity
work is separate and still required.

Submission synchronously replaces the response. Checking old input references
for removal of the local alert token is intentional for that local cleanup
contract, distinct from claiming the currently mounted draft was preserved.
Positive current-form assertions precede that submit. Negative controls confirm
the shared generic fraction helper did not inherit the scoped association.

The raw reports show substantial context reading in both arms. B read fewer
renderer edit sites but also consulted interaction/build/app context. Grouped
self-reported reading logs cannot establish a reliable causal reduction in
concepts, files read, tokens, elapsed time or total maintenance cost. No comparable
timing/usage instrumentation was collected; do not invent savings.

Both workers initially overscoped the semantic change and needed parent feedback.
Both had browser-server/tooling discovery costs; parent guided use of the existing
in-process static server. A also corrected a guessed probe answer. These are
test-authoring/workflow observations, not failures of the exact math core and not
costs cured by extraction. No claim that shared construction prevents scope errors.

## Disposition and remaining questions

Recommend retaining the bounded extraction if final production parity passes:
it removes a demonstrable duplicate edit and competing control-selection knowledge.
The evidence for total agent efficiency and owner markup readability is inconclusive.
An extra handle/context contract and lifecycle checks add concepts; the extraction
does not make those costs vanish. Owner code-reading remains optional and useful.

MAINT-42-A is supplied this technical evidence, pending final review/owner acceptance.
Do not close MAINT-42-B/C: Plan 39 must assess preview-state fit, then deferred
decide/transform ownership and remount duplication. The token remains duplicated
and now includes operation-response context dependencies; no claim it was unified.
Admission, harness contention and Vue/template readability remain deferred questions,
not automatically resolved or automatically funded by this result.

## Reproduction and archive

`evaluation/manifest.json` records baselines, final commits, source-file lists and
artifact hashes. `evaluation/arm-a` and `arm-b` retain reports, probes, receipts,
PNG evidence and source/test patches. Only machine-local root prefixes in text
were normalized; assertions and image bytes were preserved. Original F1 commits
were detached and never merged. Native worktrees are temporary; reproduce from
the main-history baseline plus archived patch if detached objects are later pruned.

Restore each archived arm's report/probe files to their original relative path
`reports/development/plan-42-maintenance-arm/` in its isolated checkout before
running them. Their imports/output paths assume that location and their F1 source,
not the production main tree. Do not execute archived F1 probes against main or
mistake their `Your answer` / `Check answer` screens for adopted product copy.
