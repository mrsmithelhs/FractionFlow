# Plan 11 Repair 02 technical re-review

Date: 2026-10-05. Implementation `82fcd51`; final implementer report `c93934d`.
Working tree was clean at review start.

## Disposition

**Technical acceptance: accepted.** The original trigger/paint/Replay findings and
Repair 02's actual whole-position and translation-witness defects are closed for
the reviewed paths. No further source repair is required by this review. Plan 11
remains delivered because owner rendered-motion and deployed-URL acceptance are
outstanding. No push, deployment, packet completion or Plan 22 initiation is authorized.

## Verified behavior

The persistent renderer converts dismissed Replay controls into an empty measured
layout reserve. It has no children, text, focusable controls, pointer behavior or
visible decoration and is hidden from accessibility semantics. Re-entering Replay
reuses that node; a no-transition fresh episode removes it. The code and mounted
reset/re-entry witness establish these lifecycle boundaries.

In the independent clean Edge run, the new right-conversion journey retained:

| Quantity | Before | During | Settled |
|---|---|---|---|
| Whole document box | x=41, y=264.84375, 218×44 | same | same |
| Fill document box | x=43, y=266.84375, 53.5×40 | same | same |

Whole/fill position and dimension deltas were zero after correcting for observed
scroll. The existing root-relative geometry and per-boundary connection, full-height
and grid assertions remain supplementary. The 12px whole-bar translation seed now
fails at the document-position conservation assertion, with exactly one intended
failure and no unrelated failure. All five earlier motion seeds still fail at
their intended checks.

Reduced Replay retained the same input node containing the unsubmitted `8` and
selection [0,1]. The real Show new parts click focused the button during activation;
after removal, the active element was the connected document body. The field is
restored to its production numeric type before later submission. Reduced right
acceptance also retains the whole/fill document positions with no running effect.

The reduced Show observer itself checks root-relative geometry. Orchestration
therefore added an independent browser-only capture listener around the real Show
click, measuring the track before and after two paint frames using document
coordinates. Both measurements were x=41, y=161, 218×44; the filtered clean route
passed. This closes the actual clean-path observation without claiming that the
reduced Show helper has its own translation failure seed. Reusing the stronger
document-position helper there is a future harness improvement, not a confirmed
remaining product defect.

## Independent verification

- Full unit/pure tests: 280/280 across 24 files passed.
- Learner and separate subtraction-prototype builds passed.
- Full local Edge matrix: 43/43 executions across 41 rows passed, including both
  support profiles, standard/reduced Replay, static comparison modes and both
  Inspection Mode focus-return routes.
- Six motion sensitivity seeds: exactly the intended failure detected for each.
- Shared subtraction verifier: all specified seeded defects detected and clean
  restored run 4/4 passed.
- Packet lint and diff check passed before review documentation was added.
- Code review of renderer reserve, CSS and scroll-corrected witness found no
  confirmed remaining blocking defect. A separate read-only reviewer ran eight
  reduced Replay/Show cycles in Edge: the wrapper stayed 147.84375px high, the
  single reserve stayed 83.84375px high with no children/buttons and aria-hidden
  true, and no height accumulation occurred. Return/re-entry restored the ordinary
  108px wrapper with zero Replay controls/reserves. No advisor identity claim is
  inferred from this review.
- The same reviewer separately exercised the production `type=number` field under
  both motion preferences: unsubmitted value `3`, node identity, connection and
  numeric type survived Show new parts, then ordinary submission reached 3/12.
  This supplements the text-selection surrogate without claiming numeric caret APIs.

A managed Windows process-launch error (1909) occurred after the independent
validation processes started. Their completed outputs were retrieved successfully;
narrow alternate-permission read/browser commands allowed inspection to continue.
No account, credential, ACL, source or build workaround was applied.

## Limits and next gate

The selection witness temporarily changes `type=number` to `type=text` on the same
mounted node because numeric inputs do not expose text-selection APIs. Its result
proves populated value/node/text-selection continuity; it does not prove a native
numeric-input caret or mobile keyboard behavior. Physical-device, AT and child
usability remain untested. The reserve's visual spacing and animation calmness
remain part of the owner's rendered judgment, not conclusions from these checks.

Plan 22's separate denominator-path repair remains necessary before the combined
public release. Present the concrete repaired candidate for explicit publication
authorization, then obtain Plan 11's required owner deployed-URL acceptance.
The status remains delivered throughout these pending gates.

Advisor consultation is not warranted for this prose-only review record.
