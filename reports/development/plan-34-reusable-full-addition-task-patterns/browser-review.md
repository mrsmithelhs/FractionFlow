# Plan 34 independent browser review notes

Date: 2026-10-16. Parent used installed Chrome headless at 360x740 with reduced
motion, serving current production build locally. Actual mounted controls only:
Begin, encounter Next, left/right conversion submissions, operation, Finish,
Next problem, then encounter Next for the first inspection task.

## Confirmed browser defect and bounded repair direction

The first inspection task left its active control section empty. Browser pageerror:
InvalidCharacterError from DOMTokenList.add because the token
`control-choice-btn inspect-change-button` contains spaces. The shared button
helper accepts one class token; new visual/linear callers supplied two together.
MockDOM had accepted this invalid token, so mounted tests did not catch it.
Parent directed the sole Luna writer to fix the callers and prove the actual
production browser journey. This does not authorize a broad helper rewrite.

`evidence/orchestration-inspect-first.png` captures this FAILURE, not an accepted
screen. It shows source fractions and an empty active control section. Do not
count it as passing rendered evidence or present it as product acceptance.

Parent also clarified the inspect question should name first/second source to
avoid ambiguity with two source fractions visible. This is bounded copy direction
within the adopted task mechanism. No owner product decision or deployment
permission was inferred. Clean browser verification remains pending.

Pre-Plan34 route matrix (57 rows) SHA256:
164b7c6175a3a5be644563d9ba52e6912a971370d821bf61b7a9cd257a4b6b14.
New routes may be added; baseline actions/assertions must remain equal and mapped
explicitly to historical-v4/current-production/prototype contexts as appropriate.

## Independent clean native-keyboard verification

Parent reran current production dist in installed Chrome at360x740, reduced motion.
Only page.keyboard Tab/Enter/type/Control+A were used for interaction: no clicks,
locator.press, fill, focus setters or dispatch. A bounded Tab walk checked the
actual activeElement before each intended control. Initial first Tab reached the
practice button. Completed canonical construct (encounter, two conversions,
operation, Finish), Next to second identity, encounter, false Keep, invalid repair7,
then corrected repair6. Native app focus reached the repair field after Change;
accepted repair advanced to the second-fraction question. Help was visible and
browser pageerror collection stayed empty. This verifies bounded keyboard
completion/correction, not assistive-technology or physical-device behavior.

Passing artifact: evidence/orchestration-keyboard-repair-verified.png, captured at
the next active side after corrected repair. The earlier empty-control image is
still retained as failure evidence. Parent did not change product source while
running this verification. Full matrix/touch/measurement review remains pending.

## Final bounded Sol review disposition

Requested gpt-6-sol medium/default-role read-only reviewer inspected StageC source
and route definitions while child finalized evidence. No edits or test runs;
requested versus observed runtime model identity remains distinct. Reviewer
confirmed temporary current-source historicalv4 versus productionv5 separation,
strict context map and unchanged parsed baseline57 objects, no product test
recognition, no replay/oracle alteration. Seeds exercise ordinary mounted-text
guards, not proof of every accessible/scene/animation property by themselves.

Parent adopted two coverage findings for completion before delivery: return the
deep inspection journey to linear before accepted repair/sum/Finish (it had
switched visual for draft proof), and complete the fifth bank item's valid/false
inspection path in both views rather than stopping at false Keep. These are
bounded evidence repairs, not new task/product scope. Parent will verify final
routes and artifacts directly; another generic advisor pass is unnecessary.

## Independent replay-wire corruption check

Parent constructed the live second-item inspect replayv2 via current registered
fixture, pure task-context resolver and createEpisode/createReplayEnvelope. A
script independently corrupted each of all16 taskContext pins, then tested missing
context, extra envelope key, extra taskContext key, and v1 schema with v2 payload.
All20 malformed envelopes were rejected. No arithmetic was hand-revalidated and
no product source or frozen replay oracle changed. This supplements the committed
round-trip and legacy-oracle tests; it is not proof of unsupported future schemas.

## Technical delivery verification — accepted for owner review

Parent independently reran both sensitivity seeds, each detected exactly one
intended assertion failure with no unrelated failure, then a clean full Chrome
matrix:63/63 executions across61 rows (49historicalv4,10productionv5,4prototype).
Compact per-execution results are persisted in orchestration-validation.json.
The temporary verbose log is not retained; it repeated existing geometry traces.
Parent also independently passed376tests, both builds, packet lint and diffcheck.
All57baseline parsed route objects are unchanged, with the original formatting
preserved and only four new rows appended. The comma needed to append rows is
not a raw-file hash-preservation claim.

Parent reviewed13layout records:360x740,360x752,1366x768; both views; no horizontal
overflow; all question/control bounds recorded;10records require vertical scroll.
Question/control reachability is supported by actual mounted browser interactions,
not merely positive bounding boxes. Parent inspected representative final images
and verified the deep inspection finishes linear and fifth identity finishes
visual then Retry/linear. No remaining confirmed technical blocker was found.

Disposition: implementation/evidence accepted for technical delivery, pending final
report review and owner rendered/agency acceptance. This does not close the packet,
claim learning/engagement effectiveness, physical-device/assistive-technology
coverage, sampling/general variation capability, or authorize push/deployment.
