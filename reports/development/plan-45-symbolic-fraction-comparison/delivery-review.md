# Plan 45 delivery review

Date: 2026-10-31. Delivery `cf4a8ef`, final progress `48c58df`.
Disposition: **bounded Repair 01 required before owner acceptance**.

Parent inspected app/response ownership, scene withholding, replay gates, renderer,
route actions, falsification evidence and final receipt. Parent independently ran
four focused files: 21/21 tests passed. Inspected narrow-screen wrong-response and
accepted-equality screenshots. The committed receipt reports 118 passing browser
executions; parent did not independently rerun the full matrix or browser suite.
The earlier Terra findings and subsequent fixes remain attributed accurately;
there was no duplicate parent reviewer pass.

## 1. Stale rendered controls bypass the scoped response handle

Confirmed in a mounted Node/mock-DOM probe against the production app:

1. Start comparison item 01 and retain its Model second amount button.
2. Accept item 01 using `>` and click local Next.
3. Item 02 has `modelChoice: null`; the retained button is disconnected.
4. Calling that old button's click changes item 02 to `modelChoice: second`.

`rendererOptions.dispatchAction` looks up the mutable current
`comparisonResponseHandle`. Consequently an old control dispatches through the new
item's valid handle rather than its own stale scope. Draft and disclosure setters
also close over mutable app state without equivalent origin checks. The handle
itself checks scope, but the renderer callbacks bypass that protection.

Repair the origin/lifecycle binding for every comparison response, assistance,
draft and disclosure callback. Retired subtrees and former item generations must
not mutate current state or drafts. Ensure current controls still function after
same-item rerenders and Next: simply capturing the initial handle in a renderer
that is reused would break later controls. Keep app-owned draft/help, shared
progression and existing ownership boundaries; no larger refactor is requested.

Add meaningful regressions retaining old controls across Next and a same-item
remount, proving rejection/no changes to current model, response, assistance
history, draft or disclosure. Prove newly mounted controls still work. Cover at
least an assistance button and response/draft path, not only direct handle calls.

## 2. Associate retry feedback with the response

The recovery paragraph has role=status but no id, and the relation group/inputs
have no aria-describedby association to it. The packet explicitly requires linked
feedback. Give the active view's feedback a unique id and associate it with the
current response control/group. Avoid duplicate ids across simultaneously mounted
visual/linear views. Preserve deliberate retry focus and remove stale association
after recovery clears. Verify the relationship through mounted assertions.

## 3. Make accepted linear copy truthful

The common accepted heading is “Check with the bars.” in both views. Linear
verification has textual amount descriptions and no bars. Use a concise neutral
heading such as “That's right.” for both, or an equally concise view-appropriate
heading. Do not add an explanatory paragraph or an extra task.

## Repair and verification scope

Implement these corrections, with focused regressions first. Inspect the revised
retry and accepted linear rendering and refresh affected screenshots; preserve
historical records. Since app lifecycle handling changes, finish with the required
clean suite/build/route receipt once settled, rather than repeated full runs for
each edit. Record exact commands, artifacts and remaining limits. Commit scoped
work and progress last, then return for re-review.

No second Terra pass is requested. Parent will inspect the repair directly.
Plan 45 stays in progress. Owner rendered-page/agency acceptance and deployment
remain separate; no push, deployment or closure is authorized here.
