// Read-only admission and exact arithmetic probe; run from repository root.
import { resolvePlan45ComparisonContext } from '../../../../src/content/plan45-symbolic-fraction-comparison-task.js';
import { resolvePlan49Context } from '../../../../src/interaction/plan49-comparison-construction.js';
import { resolvePlan51Context, admitPlan51Record } from '../../../../src/content/plan51-distance-task.js';
import { createFraction, compareFractions } from '../../../../src/math/index.js';

const ids = ['plan45-compare-02', 'plan45-compare-08', 'plan45-compare-11'];
const results = ids.map(id => {
  const c = resolvePlan45ComparisonContext(id);
  const live = resolvePlan49Context(id);
  const f = x => createFraction(BigInt(x.numerator), BigInt(x.denominator));
  const order = compareFractions(f(c.sourceForms.first), f(c.sourceForms.second));
  return { itemId: id, setId: c.practiceSetId, setRevision: c.practiceSetRevision,
    definition: `${c.definitionId}@${c.definitionRevision}`, liveDefinition: `${live.definitionId}@${live.definitionRevision}`, recipe: `${c.recipeId}@${c.recipeRevision}`,
    forms: c.sourceForms, relation: order < 0 ? '<' : order > 0 ? '>' : '=', cue: c.cueId };
});
const c = resolvePlan51Context('distance-01');
const { relation, distance, range } = admitPlan51Record({ itemId: c.itemId, itemRevision: c.itemRevision, sourceForms: c.sourceForms });
results.push({ itemId: c.itemId, setId: c.setId, setRevision: c.setRevision,
  definition: `${c.definitionId}@${c.definitionRevision}`, recipe: `${c.recipeId}@${c.recipeRevision}`,
  forms: c.sourceForms, relation, distance: { numerator: String(distance.numerator), denominator: String(distance.denominator) }, range });
console.log(JSON.stringify(results, null, 2));
