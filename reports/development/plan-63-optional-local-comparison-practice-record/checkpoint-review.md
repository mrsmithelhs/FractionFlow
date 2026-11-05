# Plan 63 pure checkpoint review — bounded repairs required

2026-11-04. Reviewed pure source/probe `5e8268e` and checkpoint `dca6998`.
App/episode/UI integration is NOT approved yet. No additional advisor is needed.

Independent verification: read both modules, tests and browser script; seven unit
tests passed and the isolated Chrome two-tab probe passed (Chrome156.0.8078.80).
Retained-window deduplication and lack of mounted lifecycle proof are stated honestly.
The storage/projection separation fits the approved mechanism.

Two reproduced gaps need correction within the existing pure ownership:

1. `validateEntry` accepts `first: accepted` with first assistance `model: yes`
   but acceptance assistance `model: no`. Those snapshots describe the same
   response and must agree. For retry → acceptance, cumulative assistance already
   observed as yes cannot become no/unknown; define the valid transition without
   inventing knowledge from an unknown flag. Enforce valid combinations during
   root validation and updates; use negative cases for stored and incoming data.
   Reject contradictions rather than normalize away evidence.
2. Storage `open()` rejects on `onblocked`, clears the cached promise, then can
   receive `onsuccess` later. It currently leaves that late connection open and
   untracked. A synthetic event-order repro confirms close is not called. Track
   settlement/retirement and close late results instead of leaving a connection
   that may block future upgrades; guard upgrade work after rejection where needed.
   Do not introduce a destructive reset or broad retry loop. Add a focused event-order
   regression, including a later successful open unaffected by the old request.

Keep all existing clear/stop, transaction-completion and disabled reset semantics.
Run focused tests and the actual storage probe after the small repairs. Do not
repeat full-suite/build/matrix or commission another reviewer for this checkpoint.
Commit scoped repair/evidence, update checkpoint attribution, release Git and send
back for inline follow-up. The later app-boundary tests remain mandatory, especially
rapid navigation, retirement, exact support/assistance provenance and async ordering.

The two-tab script's delayed retry/acceptance calls are launched from different
pages; its passing result is not a guarantee of caller ordering across tabs.
Integration must explicitly serialize one episode's admitted observations and test
it, rather than assume cross-page evaluation timing supplies that queue.
