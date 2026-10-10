# Plan 31 Requirement 0 mechanism review

Date: 2026-10-10. Orchestrator approval under the owner's Plan 31 initiation and
direct bidirectional supervision authorization. Implementer: FF Impl 31,
`01a1274f-4ecf-7c23-90ec-ef8cc5709520`.

## Disposition

Approved to implement the proposed shared compact fraction notation mechanism
within the packet. Owner rendered-screen acceptance remains required at delivery.
No content/math/task change, framework migration, status change or deployment.

Root inspected `symbolic.js`, both bar-readout constructors, the linear matching
question/options, the control render hook and renderer CSS. Existing validated
scene forms suffice; no projection expansion is approved on this evidence.
Existing screenshots are historical baseline, not new rendered verification.

## Implementation constraints

- Reuse/extend `createSymbolicFraction` with a compact intrinsic-width variant.
  Preserve ordinary/persistent outer lane reserves and persistent numerator/
  denominator references used by updates. Do not recreate bar roots, tracks or
  motion anchors merely to change notation; no changes to motion/glow timing.
- Make divider width follow the wider numeral plus shared font-relative padding.
  Verify rendered width under wider hosts; percentage CSS alone does not prove
  the invariant. Preserve existing large symbolic-expression behavior.
- Compose visible linear question words around a structured source fraction.
  Keep the full semantic question independent of visual `textContent`, since
  stacked numeral serialization can concatenate numbers. Retain the hidden
  fieldset legend and coherent spoken fraction wording; no duplicate visible
  questions or duplicate fraction announcement. Do not parse prose for forms.
- Use the existing `renderOption` hook and native button behavior with explicit
  complete accessible names. Preserve callbacks, targets and focus contracts.
- Renderer typography owns CSS. App chrome CSS stays outside scope unless a
  demonstrated conflict returns for review. Structured wording fragments in
  `strings.js` or small controls adjustments are allowed only if necessary for
  this composition, preserving wording and other callers' behavior.

## Owned paths and verification

Approved source candidates: `src/render/symbolic.js`, `fraction-bar.js`,
`linear-path.js`, `src/styles/render.css`; conditional bounded `controls.js` and
`strings.js` as above. Focused verification may use existing renderer/linear/
purity/route tests, `tests/routes/route-matrix.json` and
`scripts/dev/run-route-matrix.js`. Announce the final exact test/witness list
before editing; routine choices within this scope do not need another gate.
Own report/evidence files under this packet's directory; an evidence-only capture
script may live there. No shared-harness refactor or new dependency is authorized.

Follow packet width/wrapping/access/zoom/motion evidence requirements and the
seeded notation-independent leakage test. Inspected targets must exist; retain
legacy invariant meanings. Browser name checks do not establish physical-device
or assistive-technology performance.

This review is a prose-only disposition; separate advisor consultation was not
warranted. The source implementation retains inherited advisor declaration and
disposition requirements. Stop on load-bearing mechanism/instructional changes.
Commit scoped work and progress last; no push.
