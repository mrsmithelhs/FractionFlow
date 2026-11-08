# Plan 90 placement fit witness

This report-local Playwright fixture measures the two adopted M1 placement candidates in the existing public standalone Plan 39 task: `bridge-06-three-eighths-8` and its designated substitute `bridge-02-fourth-4`. Each journey launches one exact item through the normal standalone chooser, uses definition revision @2, and exercises real controls for an incorrect Check and recovery, a correct Check and explanation, optional task help, and completion.

The runner covers high and medium support, visual and linear views, viewports 360×740, 1093×614 and 1440×900, and 100%/200% CSS root font sizes. It records the identity and definition, current stage, viewport and root font, document overflow, app/working-area geometry, visible element bounds and element overflow. Incomplete journeys write partial observations and exit nonzero.

Run from the repository root:

```powershell
node reports/development/plan-90-goal-linked-managed-practice/placement-fit-batch.mjs
```

The output defaults to `placement-fit-batch-observations.json` in this directory. The CSS root-font change is text scaling, not browser zoom. This evidence does not test a physical device or assistive-technology speech, establish learning outcomes, or automatically classify records as fit. It uses standalone one-item launches and does not establish managed Start admission, multi-family session completion, or cross-family transitions. The fixture only narrows the existing public standalone practice type; it does not edit or activate managed session code.
