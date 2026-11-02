import { deepFreeze } from "../schema.js";
const PLAN53_RECORDS = deepFreeze([
  ["zero-fourths", "0", "4", "zero"],
  ["three-fourths", "3", "4", "proper"],
  ["four-fourths", "4", "4", "one"],
  ["five-fourths", "5", "4", "beyond-one"],
  ["six-fourths", "6", "4", "non-reduced"],
  ["three-halves", "3", "2", "equivalent-unit"],
  ["eight-fourths", "8", "4", "two"],
  ["ten-eighths", "10", "8", "conditional-density"]
].map(([itemId, numerator, denominator, purpose]) => ({ itemId, itemRevision: "1", purpose, form: { numerator, denominator } })));
export {
  PLAN53_RECORDS
};
