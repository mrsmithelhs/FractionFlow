# Plan 92 desktop and Chromebook fit investigation

Date: 2026-11-08
Scope: report-only geometry investigation; no application source or admission rule changed.

## Candidate recommendation

Treat **CSS viewport width at least 768 px, height at least 740 px, and root text size 16–32 px** as a conservative candidate desktop/Chromebook class for follow-up review. This is a candidate for the next owner/orchestration decision, not an admitted range. The family fit helper still requires a mounted measured working area of at least `max(262 px, 15 × root font size)` for unlike-denominator subtraction; comparison uses its separate `8.2 × font` factor. Any future eligibility must continue to use the live working-area measurement and both view widths, not viewport dimensions alone.

The actual working area at 768×740 was 666.6 px at 16 px root text and 623.0 px at 32 px. Intermediate root sizes sampled at 125%, 150%, and 175% measured 664.9, 655.0, and 639.0 px. Thus, the narrowest measurement in that screen series is still 143 px above the subtraction floor of 480 px. At 1024×768/16 px, the measured area was 894.4 px. The 1024 px measurement supplements the prior standard-text sample; it does not demonstrate every viewport height or actual device/browser zoom configuration.

## Evidence

The report fixture `desktop92-boundary.json` was produced with the existing `gate92-fit-witness.mjs` and exact public item identities. Chrome 157.0.8103.38 measured 11 conditions: 1024, 1000, 960, 900, 850, 800, and 768 px wide at 16 px root text/768 or 740 px height, plus 768×740 at root sizes 16, 20, 24, 28, and 32 px. The receipt includes both visual and linear views, both support levels, and the real task journey states emitted by that harness. It is not browser zoom; the harness changes the CSS root font size.

For width 1024, 1000, 960, 900, 850, 800, and 768 at 16 px root text, minimum working-area widths across captured nonzero stages were 894.4, 873.0, 837.4, 784.0, 739.5, 695.0, and 666.6 px respectively. The 900 px condition has 10 fewer stage samples because one journey's page evaluation was interrupted by navigation. The failed run was `plan40-inspect-two-thirds-one-fourth-12 / medium-support / linear / 900×768 / initial`; the remaining journeys completed. This is an incomplete journey, not evidence of a layout defect.

Across available stages, no document-level horizontal scroll-width overflow was recorded. The harness emits symbolic-expression overflow diagnostic flags for expected nested structures, but its recorded descendants showed no intersections with an overflow-clipping ancestor in this sample. These are geometry diagnostics, not a visual review of every state. The remaining `overflowElements` counts include legitimate nested scroll or size differences and should not be interpreted alone as clipping.

## CSS and layout considerations

`src/app/styles.css` caps the app episode and entry region at `68rem` (1088 px at a 16 px root), while the app shell uses responsive `clamp(1rem, 3vw, 2.75rem)` padding. At 1024 px this leaves a measured episode working area of 894.4 px. The only nearby width-specific rule found in the file is `@media (max-width: 32rem)`; it does not activate in the candidate 768 px and wider viewport class at the sampled root sizes. No intervening breakpoint was identified in the inspected styles. The fit function itself takes the narrower of visual/linear probe widths and verifies the active host matches that measurement within 0.5 px.

## Start / Next and limits

This witness mounts public practice fixtures directly by exact item identity. It exercises task controls and captures stages, but it does **not** go through managed Start, generated visit selection, Start scratch preflight, or Next between generated visits. The prior `integration92-journeys.mjs` evidence is separate and covers Start/complete journeys only at 1093×614/16 px and 650×740/32 px; it does not provide Start/Next measurements in both views across this proposed desktop class. Therefore Start/Next in the proposed class remains an explicit evidence gap.

No source eligibility was widened, no default exposure is recommended from this report alone, and this measurement does not establish fitness at all intermediate heights, actual Chromebook hardware, browser zoom, assistive technologies, or learner use. Before admission, run mounted managed Start and Next at representative low/high widths and heights, both views and supports, verify exact generated identities/conditions and task-critical controls, and visually review the narrowest working-area screenshots. Keep any range conditional on the measured working-area floor.

## Reproduction

From the repository root, set these values in PowerShell and run the existing witness:

```powershell
$env:FIT92_CONDITIONS='1024x768@100,1000x768@100,960x768@100,900x768@100,850x768@100,800x768@100,768x740@100,768x740@125,768x740@150,768x740@175,768x740@200'
$env:FIT92_OUTPUT='desktop92-boundary.json'
node reports/development/plan-92-generated-managed-practice/gate92-fit-witness.mjs
```

The run produced 484 candidate journeys and retained one navigation-interrupted journey described above. The JSON receipt is the detailed artifact; this note is its bounded interpretation.

## Normal-text follow-up (orchestration scope)

This section supersedes the earlier broad root-text candidate discussion for the current range gate. It addresses **16 px root text only** and does not use enlarged-text samples to justify admission.

### Mounted Start and Next witness

`desktop92-preview.html`, `desktop92-preview.js`, and `desktop92-startnext.mjs` mount the real app at 1024×614, 1200×740, and 1366×768, in both visual and linear views. The deterministic `selectManifest` test hook supplied seed 0's `C-I-S-T` manifest: comparison `plan45-compare-02`, identify `plan40-identify-two-thirds-five-twelfths-12`, inspect `plan40-inspect-two-thirds-one-fourth-12`, and construct `plan76-construct-five-sixths-one-tenth-30`. Each of six runs clicked Start, answered the comparison correctly, and used its progression control to advance to the selected identify item.

The independent managed-fit probe area and active host widths matched to within 0.02 px in every mounted sample:

- 1024×614: 894.4 px in both views.
- 1200×740: 1026 px in both views.
- 1366×768: 1022 px in both views.

For the subtraction floor at 16 px, `max(262 px, 15 × 16 px) = 262 px`; all three measured areas exceed it by a wide margin. No document horizontal overflow or hidden/clip-ancestor clipping was recorded. At 1024×614 visual view, two visible elements extended below the viewport after Next, within the vertically scrollable page; this is viewport continuation rather than clipped content. The receipt records the measured bounds and stage geometry.

The 900×768/16 px retry for the exact previously interrupted inspect identity completed 4/4 journeys across supports and views; working area was 784 px. Its earlier interruption therefore did not reproduce.

### Gate limitations

The `selectManifest` hook injects a deterministic `fit:true` manifest. It bypasses production Plan 92 admission, the natural generator/seed path, and the Start scratch-preflight used by normal selection. This is mounted evidence for Start, task completion, Next, active host geometry, and tested viewport clipping behavior only. It does not authorize production eligibility, establish natural selection availability for every screen, assess all candidate content, or replace visual/owner acceptance. The current supported range should remain conditional on the app's actual measured fit probe.

Reproduction from the repository root:

```powershell
node reports/development/plan-92-generated-managed-practice/desktop92-startnext.mjs
$env:FIT92_ITEMS='plan40-inspect-two-thirds-one-fourth-12'
$env:FIT92_CONDITIONS='900x768@100'
$env:FIT92_OUTPUT='desktop92-900-retry.json'
node reports/development/plan-92-generated-managed-practice/gate92-fit-witness.mjs
```
