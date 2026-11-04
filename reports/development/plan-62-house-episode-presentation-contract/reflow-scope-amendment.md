# Plan 62 ordinary-comparison reflow amendment

2026-11-03. During approved implementation the investigator measured ordinary
comparison at 360px/200% root text overflowing to 418px, including initial and retry
states. Its help/response grid min-content exceeded the 262px available column.
This is distinct from the separately deferred entry-title issue. Parent inspected
the active renderer/CSS diff and the existing relation/response rules; the exact
overflow numbers remain implementer-run observations pending delivery verification.

Authorize a focused ordinary-comparison reflow fix in `src/app/styles.css` alongside
the approved Plan51 work. Restrict selectors to the Plan45 comparison root and its
actual help/response descendants; preserve Plan49 optional construction. Permit
shrinkable grid tracks/minimums and wrapping as justified by geometry. Do not reduce
type/target size, clip content, hide labels, CSS-reorder controls or apply a global
fieldset/button/grid rule. No renderer or task-state expansion follows from this.

Show initial, open-help/construction and retry reflow with actual bounds at narrow
normal/enlarged text and Chromebook, both access paths where relevant. Distinguish
root text scaling from browser zoom. Reuse focused verification and the one already
requested Terra consultation; no second reviewer for mechanical follow-up.

The reported pre-existing view-switch focus issue is not authorized for an app
rewrite. Provide exact real-control repro, baseline versus changed behavior, active
element connection/visibility and affected input/draft before requesting a repair.
If this slice introduces lost focus or makes controls inaccessible, resolve within
approved presentation ownership or stop for a separate named scope amendment.

Browser sandbox launch failure is an environment result, not a failing product route.
Use the normal approved elevated launch path or supported isolated runner; preserve
exact browser/configuration and failed-launch attribution. Do not weaken assertions,
silently omit routes or rewrite old evidence to obtain a pass. Keep reports scoped.
