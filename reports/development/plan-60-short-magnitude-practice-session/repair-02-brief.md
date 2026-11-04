# Plan 60 Repair 02 — session entry layout

2026-11-03. Owner authorized limited Plan60-specific presentation repairs and a
separate house-presentation packet. Orchestration returned Plan60 to in-progress
for this repair; the implementer must not change packet status. No new task mechanism gate
is required for this small shell presentation fix. Inspect before editing and stop
if a broader change is needed.

## Owned change

Make the existing “Compare fractions, then find a distance” entry choice follow
neighboring practice choices' width/alignment/wrapping and spacing. Currently it
is directly under the flex-column entry page rather than a start-aligned practice
list (`app.js` session entry creation, `styles.css` entry/list rules). Reuse the
existing list/layout mechanism or one equally small session-specific rule; do not
hard-code a width that breaks narrow screens or change all buttons globally.

Keep its existing unsaved-place cue clearly associated. Preserve exact learner
text, entry order, first-Tab/gear access, session entry data hooks, callback guards,
focus destination, session lifecycle and failure notice. Do not redesign the entry
page, remove the cue or add explanatory paragraphs.

Own only the necessary entry markup and/or precisely scoped entry CSS, focused
verification and new repair evidence/report. Do not edit Plan45/49/Plan51 renderers,
expression separators, Help/Check arrangement, task controls or the session
controller. Cross-type harmonization is reserved for draft Plan62.

## Verify and deliver

Inspect actual computed bounds at 360×740 and Chromebook1093×614, plus 200% text
for wrapping/overflow. Compare neighboring buttons' alignment and intended sizing;
do not require equal width for intrinsically longer labels. Capture representative
entry screenshots and compact measurements; preserve historical receipts.
Use the real button to enter the session and check existing focus/start behavior.
Check keyboard entry/gear order and that nearby About/credit remain reachable.

Run focused affected shell checks, build/lint/diff as appropriate. No additional
advisor or broad matrix repetition is warranted for this small layout repair unless
new behavioral changes or failures arise; report such a scope issue first.
Coordinate source/Git window, stage explicit owned paths, commit progress.md last,
then send delivery directly to FF Orch 12+. Keep owner review and separate deployment
gates. No storage, status changes, push or deployment.
