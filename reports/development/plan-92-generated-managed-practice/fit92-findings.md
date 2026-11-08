# Plan 92 first batch mounted fit witness

This report-local witness exercises exact public standalone candidates in the mounted app. It does not exercise Plan 92 managed admission, whole-visit scratch preflight, or candidate-to-candidate transitions. Geometry is evidence for review and is not itself a fit decision.

Run from the repository root with `node reports/development/plan-92-generated-managed-practice/fit92-witness.mjs`. The script writes full per-stage observations to `fit92-observations.json`; set `FIT92_PORT` to choose a different local Vite port, `FIT92_CONDITIONS` to override the comma-separated `widthxheight@root-text-percent` matrix, `FIT92_ITEMS` to select exact identities, `FIT92_SCREENSHOTS=1` to capture initial-stage screenshots, or `FIT92_OUTPUT` to choose another JSON filename in this directory.

## Scope and method

The exact first batch is comparison 02, 09 and 10; subtraction identify one-half minus one-eighth, two-thirds minus five-twelfths, and seven-eighths minus one-fourth; inspect two-thirds minus one-fourth and three-fourths minus one-fifth; construct one-half minus one-fifth, five-sixths minus one-tenth, and five-sixths minus three-eighths. Each candidate is isolated through its public practice chooser, then completed with real controls. The witness records initial task geometry, help where available, response/recovery geometry, and completion. It checks exact identity, active view and selected support at each measured stage.

The matrix is 360×740 at 100% and 200% root text, 480×740 at 200%, 600×740 at 200%, and 1093×614 at 100%; each is measured in visual and linear views with high and medium support. This is 220 journeys. The run used Chrome `157.0.8103.38`. Root-font changes enlarge CSS text; they do not emulate browser zoom. No timing or cold-start/preflight performance is measured.

## Result

All 220 journeys completed, with no browser errors or incomplete task paths. The three comparison candidates showed no document horizontal overflow in this sampled matrix. All eight subtraction candidates showed document horizontal overflow at 360×740/200% and 480×740/200% (8 of 20 journeys per candidate); no document horizontal overflow appeared at 360×740/100%, 600×740/200%, or 1093×614/100%. The raw observations retain per-stage nested element overflow, which occurs even when the document itself does not overflow and needs visual interpretation. These results flag the two narrow enlarged-text conditions for review; they do not certify any candidate as fit or unfit across all supported environments.

The matrix excludes intermediate text sizes, actual browser zoom, other registered display conditions, physical Chromebook hardware, assistive technology, learner usability, and managed Start/preflight. Visual review of the raw geometry and an actual mounted managed preview remain necessary. Do not use the standalone observations as admission evidence by themselves.

## Additional wide run and representative screenshots

A separate `FIT92_CONDITIONS=1093x614@100` run covered all 11 candidates with both views and supports: 44/44 journeys completed with no failures; no document horizontal overflow was observed. Its raw data is `fit92-wide-observations.json`. A second narrow screenshot run covered the subtraction construction candidate `plan40-construct-five-sixths-three-eighths-24` at 480×740/200%, both views and supports: 4/4 journeys completed; see `fit92-narrow-screenshot-observations.json`. The retained high-support screenshots show the visual and linear initial task at the narrow enlarged-text condition and at 1093×614/100% in `fit92-screenshots/`. Screenshots are examples for inspection, not exhaustive visual review.
