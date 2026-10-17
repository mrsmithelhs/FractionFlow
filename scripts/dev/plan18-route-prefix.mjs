import { PRACTICE_TYPES } from '../../src/app/practice-types.js';
import { resolveAuthoredContent, resolveCuratedFixture } from '../../src/content/authored-content-catalog.js';
import { addAtCommonDenominator, createFraction, convertToDenominator, equalFractions } from '../../src/math/index.js';
import { PLAN34_FULL_ADDITION_TASK_RECORDS } from '../../src/content/data/plan34-full-addition-task-records.js';

const PLAN34_DEFINITION = 'phase-3-reusable-full-addition';

function action(method, target, extra = {}) {
  return { method, target, ...extra };
}

function formsFor(item, fixture, denominator) {
  const target = BigInt(denominator);
  const left = convertToDenominator(createFraction(BigInt(fixture.left.numerator), BigInt(fixture.left.denominator)), target);
  const right = convertToDenominator(createFraction(BigInt(fixture.right.numerator), BigInt(fixture.right.denominator)), target);
  const total = addAtCommonDenominator(
    createFraction(BigInt(fixture.left.numerator), BigInt(fixture.left.denominator)),
    createFraction(BigInt(fixture.right.numerator), BigInt(fixture.right.denominator)),
    target,
  );
  return { left, right, total };
}

/**
 * Assemble a Plan18-only, exact-response browser path through the preserved set
 * prefix. The resulting actions use the same visible controls as authored route
 * rows; this helper never reads app internals or changes learner state directly.
 */
export function buildPlan18RetainedPrefixActions({ view, supportProfile }) {
  if (!['visual', 'linear'].includes(view)) throw new TypeError('Plan18 prefix view must be visual or linear');
  if (!['high-support', 'medium-support'].includes(supportProfile)) throw new TypeError('Plan18 prefix support must be registered');
  const type = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
  if (type?.setId !== 'unlike-addition-vetted-set' || type?.setRevision !== '6' || type.items.length !== 13) {
    throw new Error('Plan18 prefix requires the exact registered set@6 with two appended items');
  }
  const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
  const field = (name) => name.startsWith('input.')
    ? name
    : `#${view === 'visual' ? '' : 'linear-'}${name}`;
  const tasks = [];
  const append = (method, target, description, extra = {}) => tasks.push(action(method, target, { description, ...extra }));

  for (let index = 0; index < 11; index += 1) {
    const item = type.items[index];
    const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
    const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
    if (!fixture || !authored) throw new Error(`missing exact Plan18 prefix content ${item.fixtureId}@${item.authoringRevision}`);
    const denominator = item.targetDenominator ?? item.targetDenominators?.[0];
    if (!denominator) throw new Error(`Plan18 prefix item ${item.id} has no authored target denominator`);
    const { left, right, total } = formsFor(item, fixture, denominator);
    const expectedLeft = String(left.numerator);
    const expectedRight = String(right.numerator);
    const expectedTotal = String(total.numerator);
    const episodeHost = `${host} .active-beat-controls`;

    append('click', `${episodeHost} .control-btn`, `Prefix ${index + 1}: acknowledge visible encounter for ${item.id}`);
    if (item.episodeDefinitionId === PLAN34_DEFINITION) {
      const candidates = PLAN34_FULL_ADDITION_TASK_RECORDS.find((record) => record.itemId === item.id)?.candidates;
      if (!candidates || item.patternId !== 'full-addition.inspect-keep-repair') {
        if (item.patternId !== 'full-addition.construct-equivalent') {
          throw new Error(`unsupported Plan34 prefix pattern ${item.patternId}`);
        }
        for (const [side, numerator] of [['left', expectedLeft], ['right', expectedRight]]) {
          append('fill', `${host} ${field(`transform-num-input-${side}`)}`, `Prefix ${index + 1}: enter exact ${side} equivalent ${numerator}/${denominator}`, { value: numerator });
          append('click', `${host} .control-submit-btn`, `Prefix ${index + 1}: accept exact ${side} equivalent`);
        }
      } else {
        for (const [side, correctNumerator] of [['left', expectedLeft], ['right', expectedRight]]) {
          const candidate = candidates[side];
          if (!candidate) throw new Error(`Plan34 inspect record missing ${side} candidate for ${item.id}`);
          const isCorrect = equalFractions(
            createFraction(BigInt(candidate.numerator), BigInt(candidate.denominator)),
            createFraction(BigInt(correctNumerator), BigInt(denominator)),
          );
          if (isCorrect) {
            append('click', `${episodeHost} button.control-choice-btn >> nth=0`, `Prefix ${index + 1}: keep exact ${side} candidate`);
          } else {
            append('click', `${episodeHost} .inspect-change-button`, `Prefix ${index + 1}: change false ${side} candidate`);
            append('fill', `${host} ${field(`transform-num-input-${side}`)}`, `Prefix ${index + 1}: enter exact ${side} equivalent ${correctNumerator}/${denominator}`, { value: correctNumerator });
            append('click', `${host} .control-submit-btn`, `Prefix ${index + 1}: accept exact ${side} repair`);
          }
        }
      }
      append('fill', `${host} ${field('operate-sum-input')}`, `Prefix ${index + 1}: enter exact total ${expectedTotal}/${denominator}`, { value: expectedTotal });
      append('click', `${host} .control-submit-btn`, `Prefix ${index + 1}: submit exact operation`);
      append('click', `${episodeHost} .control-btn`, `Prefix ${index + 1}: finish the visible episode`);
    } else {
      append('click', `${episodeHost} .control-choice-btn >> nth=1`, `Prefix ${index + 1}: identify unlike unit sizes`);
      if (supportProfile === 'medium-support') {
        append('fill', `${host} input.control-numeric-input`, `Prefix ${index + 1}: enter the authored denominator ${denominator}`, { value: String(denominator) });
        append('click', `${host} .control-submit-btn`, `Prefix ${index + 1}: submit the denominator`);
      } else {
        append('click', `${episodeHost} .control-choice-btn >> nth=0`, `Prefix ${index + 1}: select authored denominator ${denominator}`);
      }
      for (const [side, numerator] of [['left', expectedLeft], ['right', expectedRight]]) {
        append('fill', `${host} ${field('input.control-numeric-input')}`, `Prefix ${index + 1}: enter exact ${side} equivalent ${numerator}/${denominator}`, { value: numerator });
        append('click', `${host} .control-submit-btn`, `Prefix ${index + 1}: accept exact ${side} equivalent`);
      }
      append('fill', `${host} ${field('input.control-numeric-input')}`, `Prefix ${index + 1}: enter exact total ${expectedTotal}/${denominator}`, { value: expectedTotal });
      append('click', `${host} .control-submit-btn`, `Prefix ${index + 1}: submit exact operation`);
      append('click', `${episodeHost} .control-btn`, `Prefix ${index + 1}: continue from the resolved operation`);
      append('clickEquivalentChoice', `${host} ${view === 'linear' ? '.linear-matching-choice-btn' : '.matching-choice-btn'}`, `Prefix ${index + 1}: select the exact first operand in the authored reflection`, {
        numerator: String(left.numerator), denominator: String(left.denominator),
      });
    }
    append('click', '.app-next-button', `Prefix ${index + 1}: use visible completion-gated Next`);
  }
  return tasks;
}
