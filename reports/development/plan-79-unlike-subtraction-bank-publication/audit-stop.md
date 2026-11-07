# Duplicate audit stop

At baseline `527815ee2f6eb2b467951cb189ad4a9b9ec68c5f`, the live Plan 36 item `takeaway-12-8-minus-3` has ordered operands 8/12 − 3/12, while Plan 40 `plan40-inspect-two-thirds-one-fourth-12` has 2/3 − 1/4. Both normalize to 2/3 − 1/4. They are distinct instructional task types, but the order requires stopping on an actual collision; orchestration must decide its disposition. No adopted candidate collides with these or other inventoried subtraction pairs. The Plan 40 item is inventoried twice as a live entry and as its registry record; this is not a second collision.

Reproduce: `node reports/development/plan-79-unlike-subtraction-bank-publication/audit.mjs`, then compare distinct item IDs among `inventory` entries where `kind` is `subtraction` and `normalized` matches. The audit resolves all 54 earlier unclassified live entries via their source-specific records. The scope and remaining identity-audit limitation are in progress.md. No live activation occurred.
