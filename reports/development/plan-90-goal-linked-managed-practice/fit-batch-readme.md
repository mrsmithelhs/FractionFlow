# Plan 90 comparison and distance fit witness

This report-local Playwright witness measures the four adopted comparison records and two distance records in the mounted app. It narrows each public practice type to one exact registered item, chooses one of the two registered support profiles, launches through the ordinary chooser, and walks the real task controls in both views.

The runner visits widths **360, 480, 768, and 1093 CSS pixels**, each at the default root font and at 200% root CSS font. The latter is text scaling; this witness does not emulate browser zoom. Each journey records browser version, exact item, definition, support, active view, stage, viewport, root font, document and working-area dimensions, visible control geometry, and element overflow measurements. A run records its failing stage and the command exits nonzero if any journey is incomplete. It still writes the partial observations for diagnosis.

Journeys capture initial and help states, a wrong answer and recovery, correct response, and completion/Next. Comparison journeys request a source model when the registered task exposes that control. Distance journeys complete comparison, enter the distance response, submit the exact distance, and advance.

Run from the repository root:

```powershell
node reports/development/plan-90-goal-linked-managed-practice/fit-batch.mjs
```

Output is written to `fit-batch-observations.json` in this directory. This isolated-record witness is useful for measuring the six candidates but does not prove managed scheduler admission or a real multi-item Start-to-Next session. Geometry and completion are evidence for review, not automatic fit decisions. It does not establish usability, learner performance, physical-device behavior, assistive-technology speech, or browser zoom behavior. No width or support class beyond the explicitly recorded conditions can be inferred.
