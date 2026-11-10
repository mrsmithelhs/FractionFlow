# Plan 92 recorded episode lag driver

## Artifact

`lag92-recorded-episodes.mjs` is a reusable Playwright driver for the isolated
owner preview. It creates disposable same-origin databases, establishes a
seed-only comparison from clean databases, opts into expanded local history
through the visible control, and runs mounted Start, response, completion, and
Next interactions across changed seeds. The positive episodes are recorded by
the mounted observer and the real storage bridge; the script contains no direct
positive IndexedDB writes.

The driver retains an episode snapshot after every completed installed problem,
requires at least ten completed exposures, and searches for a behavioral
recorded-lag witness: the actual selected item must differ from its clean
same-seed choice, carry the recent or older-review diagnostic, and have a
better effective priority than the clean choice. Witness output includes seed,
role, selected IDs, candidate priorities, endpoint event IDs/tokens/ordinals,
and an ordinal-derived count of intervening recorded exposures. It separately
drives the expanded Stop, opt-in-off, Clear, and legacy controls.

## Registered-writer execution evidence

The final driver ran successfully against the isolated preview after recorder
registration integration. It recorded 14 distinct completed observer-written
exposures across four changed-seed visits, with the full retained history
captured after the tenth completion. The two actual selection changes were:

- Recent return, seed 2: the mounted session chose `plan45-compare-02` at
  priority 0 instead of the clean same-seed `plan45-compare-09` at priority 1.
  The endpoint ordinals were 1 and 4, giving 2 intervening recorded episodes.
  The older endpoint itself was the same-generation `plan45-compare-02` event
  with first response `retry` and later acceptance `yes`; its tentative need is
  3. This satisfies the tightened rule that recent need must come from that
  endpoint. Both endpoint tokens and the real response history are in the JSON
  witness.
- Older review draw, seed 3: the mounted session chose
  `plan40-identify-one-half-one-eighth-8` at priority 0 instead of the clean
  same-seed `plan40-identify-two-thirds-five-twelfths-12` at priority 1. The
  endpoint ordinals were 2 and 10, giving 7 intervening recorded episodes.
  The selected candidate had an explicit seeded review opportunity and the
  witness carries both endpoint tokens.

Visible Clear, expanded Stop, an expanded-off Start, and legacy opt-in, Stop,
re-enable, and Clear checks all passed. Stop preserved 14 expanded entries;
opt-in-off added no expanded exposure; Clear emptied both records while
preserving the legacy enabled choice. The registered-writer rerun had no page
errors or driver limitations.

An earlier run before recorder registration succeeded as a preliminary browser
observation. This later run uses the recorder lease APIs, drains and releases
the observer before normal page closure, and supersedes that preliminary result
for the recorded-lag check. Both runs are isolated synthetic-browser evidence,
not learner evidence or proof of ordinary Start activation.

## Remaining evidence boundary

No unresolved driver-to-preview integration gap remained in this run. The
artifact still does not establish owner rendered acceptance, ordinary app
activation, or learner outcomes. Future positive witnesses remain invalid if
snapshots or endpoints are unreliable, endpoint tokens do not belong to the
retained active generation, the mounted selected item does not change from the
clean same-seed baseline, or the policy count differs from
`newerOrdinal - olderOrdinal - 1`.
