# Proposed mixed-to-improper bridge

**Design only; owner adoption and separate implementation authorization required.** Learner sees a supplied stacked mixed number, for example 1 3/4, and chooses which improper fraction names the same amount. One initially unselected radio group and one Check are the complete required decision. Choices for the example: 4/4, 6/4, 7/4, 8/4. Do not reveal the line, point, completed equivalence or answer-bearing accessible descriptions before a correct Check. No selection produces “Choose a fraction first.” An incorrect Check preserves the selected choice and says “That amount is not the same. Try another.” Changing a selection clears stale feedback. No placement, reflection or confirmation is required.

After correct Check, show `1 3/4 = 7/4` at a single marked point on a [0,2] line: 0, 1 and 2 are equally spaced; divide each whole into the same four equal parts. Explain: “One whole is 4 fourths; 4 fourths and 3 fourths make 7 fourths. Both names mark the same amount.” Place both labels at or connected unambiguously to that one point. Explain in text as well as visually; allow wrapping or separate label rows without changing the shared point. The line is explanatory only.

## Proposed authored batch

| Supplied mixed form | Options, in proposed order | Exact correct choice |
|---|---|---|
| 1 1/2 | 1/2, 2/2, 3/2, 4/2 | 3/2 |
| 1 1/4 | 4/4, 5/4, 6/4, 8/4 | 5/4 |
| 1 3/4 | 4/4, 6/4, 7/4, 8/4 | 7/4 |
| 1 2/8 | 8/8, 9/8, 10/8, 12/8 | 10/8 |

These use the accepted Plan 53 [0,2] and denominator 2/4/8 bounds; each mixed fractional part is proper and nonzero. Alternatives include omitting the fractional part, an adjacent count, or the next whole, not arbitrary implausible denominators. Preserve source units; do not accept equivalent alternative spellings in the same option set. Admission should check finite registered membership, integers, 0 < numerator < denominator, value within [0,2], distinct option values, and exactly one exact value equal to `mixedToImproper(createMixedNumber(...))`; reject an ambiguous or altered record. [`bridge-witness.mjs`](bridge-witness.mjs) exercises the proposed batch against the existing exact math core; it is a design witness, not a production validator.

## Access and future evidence

Visual and linear modes offer the same labeled choices, one Check, preserved wrong choice and the same accepted explanation. Use native radio controls with a group label, keyboard selection and visible focus; no dragging is needed. Linear accepted text names 0, 1 and 2, equal whole intervals and the shared point and both forms. Feedback should be announced once and focus managed using existing house conventions. Pre-acceptance scene, DOM and accessible names must withhold the explanatory line and answer; supplied options themselves are necessarily visible.

A future mounted witness should inspect initial, incorrect, revised and accepted states in both modes; assert no premature line, point or completed equivalence in scene, DOM or accessible names; verify two equal whole intervals and identical point coordinates for both labels; verify keyboard and non-drag operation, focus and retained choice. Capture 360 × 740 at normal and 200% root text, checking readable stacked notation, choice labels, unambiguous point labels and no clipped content; also test a representative wider layout. Root text scaling is not browser zoom, emulation is not a physical device, and accessibility-tree checks are not actual screen-reader speech.

Smallest separate implementation would add a bounded authored task, exact validation and one-choice episode with withheld projection, renderer and standalone entry, plus focused tests and mounted evidence; follow existing routing, replay and ownership gates as applicable. It is worth doing if the owner values this missing learner decision enough to adopt the task, and a later study can investigate whether the explanation supports understanding. Neither this design nor a passing mounted witness establishes learner learning or transfer.
