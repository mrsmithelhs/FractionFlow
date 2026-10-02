# Plan 15 Repair 02 — visible comparison mark and clipping witness

Resolve the two independently reproduced R2 cases in `repair-01-review.md`. Scope is the two prototype witnesses, bounded runner support, seeded verifier, associated meaningful tests, and progress report. Leave the repaired prototype UI, focus behavior, static endpoints, math, learner bundle, and original 27 learner routes unchanged.

- Require the comparison gap mark to contribute visible distinguishing paint against its surrounding background. An opaque white fill/border on the white card must fail, even though the marker has valid dimensions. Preserve acceptance of the actual bracket and hatch without relying on labels or class-name differences.
- Reject fully clipped required operation graphics, including the verified ancestor `clip-path: inset(100%)` case. Use a bounded rendered check appropriate to these graphics; a new general visibility framework is not required.
- Add both exact CSS seeds to the failing-first browser verification. The erased-gap seed must fail both comparison motion modes while unaffected takeaway passes. The fully clipped representation seed must fail all four prototype executions. Keep all existing hidden/collapsed/erased-removal checks and the restored clean 4/4 run.

Run unit tests, complete build, all 31 route executions, filtered reciprocal routes, expanded seeded verifier, packet lint, and diff check. Record actual seeded failures and restored passes; do not use the ordinary green run as their substitute. Screen/evidence regeneration is needed only if the repair changes the rendered product or measurement script; this repair does not request such changes.

Commit scoped repair and verification work, then commit the updated progress report last. Preserve delivered status; no push or deployment. Return for technical re-review, followed by owner rendered-screen acceptance. Stop if changes beyond this bounded evidence scope appear necessary.
