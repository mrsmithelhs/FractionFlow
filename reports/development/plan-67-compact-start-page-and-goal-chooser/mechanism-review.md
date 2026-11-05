# Plan 67 Requirement 0 review — amend before source

2026-11-05. Read mechanism.md pinned to `71ccb1d` and sampled current launch/
install/hash code, partial-registry mounted tests and route-contract hash guards.
The broad direction matches adoption, but source authority remains on hold for
the following bounded clarifications. No advisor or new research is needed.

## 1. Capability availability versus invalid configuration

The adopted design says to skip empty groups and project admitted capabilities.
The proposal instead rejects empty groups and every configured identity absent
from the supplied registry, then disables the entire catalog. Existing legitimate
partial-registry tests (e.g. Plan40) demonstrate that availability is not always
the full eleven-goal catalog. Do not rewrite these fixtures just to satisfy a new
all-goals-required assumption.

Distinguish intentional unavailability from invalid/duplicate configuration or an
admitted goal lacking a mapping. Filter unavailable known capabilities, skip empty
groups, and retain available mapped launches. An unavailable configured primary
must not silently select another goal; show a truthful unavailable primary/fallback
while preserving the available chooser where safe. An absent optional session
capability is not itself a corrupt standalone catalog. Define invalid-map behavior
explicitly and test both availability and errors. No new catalog/framework needed.

## 2. Exact entry failure boundary

Preparation-before-install and post-commit display failure are distinct. Name the
proposed helper/API and call sites, the exact point considered committed, retained
chooser/focus on preparation refusal, and retired-renderer/handle state on display
failure. Do not catch all startPractice errors as preparation or broadly generalize
sessionDisplayFailure into an undefined app transaction/cleanup refactor.

Show treatment of entry primary/browse, record launch and fragment entry without
changing active-episode navigation/exit policy or destroying old valid work on
failed preparation. If active hash navigation needs a broader behavior change,
surface it separately rather than infer it from entry reorganization. Existing
session-controller behavior is not new source scope.

## 3. Protected current-route migration checkpoint

The proposed script changes are plausible, but current production rows overlap
protected prefix/non-family hashes in route-contract.test.js. Before changing a
protected row/hash, list exact affected production route IDs/contexts, existing
assertions and minimal visible-chooser step changes. Identify frozen historical
rows/fixtures/context maps that remain byte-identical. Request explicit approval of
that concrete migration; do not replace baseline hashes to conceal witness weakening.
Name tests needing only visible entry setup versus semantic contract changes.

Amend the proposal and send the clarification directly. Source stays held pending
approval; report-only edits permitted. Parent owns this review. Plan66 has released
its checkpoint Git window; coordinate the next brief proposal commit before staging.
No status, source implementation, new owner policy, push or deployment follows.
