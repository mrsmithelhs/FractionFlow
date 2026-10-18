# Plan 35 mounted-wiring checkpoint review - 2026-10-17

Baseline `110493e`. Parent inspected the live-set derivation, exact task binding,
catalog changes, shared copy/render diff and mock-DOM journeys. The set has 21
items, 13 generalized recipe associations and eight preserved legacy workflows;
test-only hold-outs are excluded. Historical Plan18/34 tests now explicitly mount
their pinned practice versions rather than asserting those versions are current.

During implementation parent identified fixture-versus-task identity mismatch,
Replay accidentally exposed for construct/inspect, side-help target fallback and
literal twelfths copy at new targets. Child corrected them before returning.
Construct/inspect encounter cues now derive from the validated target; identify
does not acquire that cue. Shared controls retain the accepted new-fraction wording.

Parent independently ran the full suite: 44 files, 402 tests passed. This includes
six mock-DOM task journeys across recipes, targets, profiles and views, with
requested help, wrong responses, completion, Next and reset. Mock-DOM tests do
not establish native control behavior, browser focus, geometry or motion.

A default-role Sol low advisor reviewed read-only without tests/writes. Requested
configuration was supplied; runtime identity was not independently observable.
The advisor found no new blocker in live/hold-out mapping, reused fixture binding,
Replay, help-target copy or the shared visual/linear controls. Its one reported
injected-instance regression is rejected as a regression: parent inspected
`110493e:src/app/practice-types.js` and `110493e:src/app/app.js`; the prior default
set@6 already inherited the Plan34 top-level definition while the injected path
passed no item/task context. Existing injected tests intentionally use legacy v4.
Changing this pre-existing unshipped API behavior would be incidental scope.

C1 is accepted for a scoped commit and native-browser/route evidence stage.
There is no delivered or owner acceptance claim. C2 must pin historical set@6
page/data/helper consistently, separately traverse current set@7, demonstrate
meaningful target/help/recovery/focus/motion behavior and measure actual bounds.
