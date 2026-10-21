# Plan 42 Requirement 0 approval

Date: 2026-10-20. Proposal commit `7408573`; parent source inspection and one
instruction-read-only Sol-medium advisor. Requested configuration used; runtime
model identity not independently verified. No advisor writes, tests or fan-out.

Approve the proposed scene-driven shared operate region and opaque operation-local
fraction/single draft data, nullable renderer accessor and F1 local-validation
error interpretation. This approves Stage 1 guards only for execution now; the
guard-baseline review remains a stop before extraction. No wider source scope.

Conditions carried into Stage 2:

1. Preserve handle on unchanged render token. Invalidate just before actual
   control replacement and on destroy, not on every update. Test unchanged update,
   actual replacement and destruction.
2. Dynamically check current connection/containment and hidden ancestors for
   every operation. Hosts switch visibility without rerendering; don't bake
   visibility at construction or treat document.hidden as a hidden DOM ancestor.
3. Unavailable reads return null; app must not overwrite a stored draft with an
   unavailable read. App keeps an opaque reset sentinel (e.g. null), with region
   clearing semantics, instead of selecting fraction/single fields itself.
   Read raw `.value` strings; do not trim/normalize unsubmitted input.
4. Required-control loss in the current available region is an observable error
   in direct guards/tests. Validate both fraction fields and current containment;
   stale closure node references cannot validate a broken region. Null for a
   legitimate unavailable/other-beat region is distinct. No silent fallback.
5. Preserve current primary-field behavior: numerator/single pointer-driven
   preservation, with keyboard toggle focus measured separately. Existing code
   does not preserve denominator-field focus across views; do not add it here.

F1 associates only `.control-fraction-error`, enabled specifically for takeaway
operation controls. It must use unique ids per mounted group, preserve unrelated
description tokens and remove only its association after input/valid submit.
Shell `.recovery-feedback` is not relocated. F1 stays out of production.

Advisor disposition: all five lifecycle conditions and F1 clarification accepted
into implementation requirements. No blocking redesign or owner question remains.
Parent retains baseline review, evaluation-worker dispatch, final verification,
status and owner acceptance. Implementation child has no fan-out authority.
