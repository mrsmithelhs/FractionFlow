# Plan 74 batch authoring guide (pilot)

This guide is for an isolated trial batch, not permission to change the live practice. Run commands from the repository root with Node. Create a JavaScript ES module in your isolated checkout exporting `records` and `membership`:

```js
export const records = [
  { itemId: 'your-unique-id', itemRevision: '1', operands: [['1','3','8'], ['2','5','8']] },
];
export const membership = {
  setId: 'your-trial-set', setRevision: '1',
  items: [{ itemId: 'your-unique-id', itemRevision: '1' }],
};
```

Each operand is `[whole, numerator, denominator]`, all positive integer strings; both denominators are `8`, each fraction is proper, and the numerators together must make at least 8 and fewer than 16 eighths. The organized answer's whole count must be at most 4 so the existing task can accept it. IDs must be unique, membership entries must refer to existing IDs and matching revisions, and membership order is deliberate. The validator derives arithmetic; do not author answers. The example illustrates the format and is an existing live problem, not a suggested trial item.

Run:

```text
node reports/development/plan-77-mixed-addition-modular-authoring-pilot/validate-batch.mjs path/to/your-batch.mjs
```

A valid batch exits 0. Errors exit 1 and identify the item or membership and reason; load/usage failures exit 2. Correct the batch and rerun. The module is executable JavaScript; use only a file you trust. This check does not register records or prove learner experience. The live data and membership in `src/content/data/plan74-mixed-addition.js` are historical revision 1: do not edit them for the trial. A mounted-task witness requires the separately controlled isolated substitution described by orchestration; never merge trial records into the live bank.
