# Plan 53 repair 01 implementer report

2026-11-02. Implements the four items in `repair-01-brief.md`; orchestration and
owner rendered/task disposition remain pending. The accepted success message now
uses “That's right.” Nonempty incomplete/retry guidance has unique per-view IDs;
visual placement buttons and the linear select reference the appropriate guidance,
and the references disappear on revision. The visual tile also references active
guidance. A focused Chrome lifecycle probe verifies those DOM associations, both
views, revision and the success copy; it does not demonstrate actual AT speech.

The existing mutation probes now use distinct named ordinary assertion markers.
The runner rejects launch errors, timeouts, signal termination and failures without
the appropriate marker; `evidence/mutation-receipt.json` records the actual failed
assertion excerpt for each injected scale, boundary, premature reveal, help/draft
view-switch and assistance-history defect, restoration and passing clean runs.

One full historical route matrix ran in an isolated snapshot of HEAD with the
repair renderer copied in, an isolated dependency copy, build, temporary fixture
root and output directories. `node scripts/dev/run-route-matrix.js --browser-channel
chrome --quiet` reported **117 route rows, 119 browser executions, 119 passed,
0 failed**. The isolated log is `evidence/repair01-historical-matrix.log` (SHA-256
`AD7BDC13421B79611955F6608E5EBAD5B12C97D8590E660D022DDA09BA9B7A4A`). Historical
repository fixtures and receipts were not overwritten. An initial launch used a
per-command temporary path unavailable to the following shell; that accidental
root launch was interrupted before matrix receipts, then the isolated run above
completed. The repository status showed no historical tracked evidence changes.

Focused Plan 53 and Plan 43 tests passed (23 tests); lifecycle and keyboard/reset/
resize Chrome probes passed. The isolated build passed. Packet lint and diff check
are recorded at delivery. Orchestration independently ran the full suite, 607/607,
before this bounded repair; it was not repeated here. No additional advisor ran,
per repair brief; the earlier consolidated review remains attributed in delivery.md.
Eighths at 200% still have 8.375 px candidate spacing and require owner/device
judgment; synthetic browser checks are not physical-device or learner evidence.
