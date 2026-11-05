# Plan 63 Repair 02 — refresh an already-open record

2026-11-04. Reviewed Repair01 source `342e848`, evidence `b33afd6`, progress
`3f27043`. Its scoped lifecycle/presentation changes address the prior findings;
23 focused tests passed independently. Original pair labels and semantic focus
keys improve the inspected narrow/enlarged screenshots. No new advisor is needed.

One ordinary real-browser path remains incorrect. Parent isolated Chrome probe:

1. Enable remembering; correctly compare, return and View record (one row).
2. Use the record's Practice comparison button, correctly compare again and return.
3. The panel remains open with one row, while IndexedDB contains two entries.

No data is lost, but the visible record does not reflect the newly completed work.
Controller writes do not refresh its cached projection, and return to entry does
not request a refresh after queued observations settle.

Fix within record controller/panel and, only if needed, the narrow return-to-entry
hook in app.js. Bring the projection up to date after committed observations or
when returning to a visible record, including delayed retry→acceptance writes.
Do not expose a premature successful save, block practice on storage, steal focus,
discard already-admitted work, overwrite clear/stop results or let a disposed/older
refresh win. Do not add polling, a general event bus, storage policy or task changes.

Test the real two-comparison path with an already-open record and no manual
View/Hide or page reload. Include a deliberately delayed acceptance so the list
eventually shows one corrected entry, not a stale unresolved copy or duplicate.
Retain clear/stop race, disposed-controller and old-control protections. Focus stays
on the existing sensible navigation/record control; background list refresh must
not pull it away. Use final state assertions rather than arbitrary sleep as proof.

Run focused record/controller/mounted tests and targeted browser regression,
including the prior stale Clear/Practice and pending-write-after-destroy cases.
No repeat advisor or broad suite/matrix by default. Preserve earlier receipts and
source timing, update repair report, explicit scoped commits and progress last.
Send for inline review and release source/Git windows. Plan63 remains in-progress;
no owner acceptance, status/push/deployment changes or broader work authorization.
