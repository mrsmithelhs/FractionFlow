import { PLAN36_SUBTRACTION_RECORDS } from '../../src/content/data/plan36-like-denominator-subtraction-records.js';

function action(method, target, extra = {}) {
  return { method, target, ...extra };
}

/**
 * Builds visible learner actions traversing all 8 subtraction items through
 * mounted production controls with zero dispatch fallback.
 */
export function buildPlan38SubtractionSetActions({ view, supportProfile } = {}) {
  if (!['visual', 'linear'].includes(view)) {
    throw new TypeError('Plan38 route view must be visual or linear');
  }
  const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
  const numInputId = view === 'linear'
    ? '#linear-operate-fraction-numerator-input'
    : '#operate-fraction-numerator-input';
  const denInputId = view === 'linear'
    ? '#linear-operate-fraction-denominator-input'
    : '#operate-fraction-denominator-input';

  const actions = [];

  PLAN36_SUBTRACTION_RECORDS.forEach((record, index) => {
    const itemNum = index + 1;
    const diffNum = Number(record.leftNumerator) - Number(record.rightNumerator);
    const den = record.denominator;

    // 1. Encounter: acknowledge by clicking "Take away"
    actions.push(action('click', `${host} .active-beat-controls button`, {
      description: `Plan38 ${itemNum}: acknowledge takeaway encounter (${record.itemId})`,
    }));

    // 2. Linear view removal status assertion
    if (view === 'linear') {
      actions.push(action('assertText', `${host} .linear-takeaway-removal-status`, {
        value: `${record.rightNumerator}/${den} is taken away from ${record.leftNumerator}/${den}.`,
        description: `Plan38 ${itemNum}: assert linear removal status`,
      }));
    }

    // 3. Operate: fill difference numerator and denominator
    actions.push(action('fill', `${host} ${numInputId}`, {
      value: String(diffNum),
      description: `Plan38 ${itemNum}: enter difference numerator ${diffNum}`,
    }));
    actions.push(action('fill', `${host} ${denInputId}`, {
      value: String(den),
      description: `Plan38 ${itemNum}: enter denominator ${den}`,
    }));

    // 4. Submit
    actions.push(action('click', `${host} .control-submit-btn`, {
      description: `Plan38 ${itemNum}: submit subtraction result`,
    }));

    // 5. Resolve: finish
    actions.push(action('click', `${host} .active-beat-controls button`, {
      description: `Plan38 ${itemNum}: finish completed subtraction task`,
    }));

    // 6. Navigation
    if (index < PLAN36_SUBTRACTION_RECORDS.length - 1) {
      actions.push(action('click', '.app-next-button', {
        description: `Plan38 ${itemNum}: advance only after completion`,
      }));
    } else {
      // Final item: verify exhaustion notice, return, re-entry
      actions.push(action('assert', host, {
        assertions: [
          {
            type: 'containsText',
            target: '.app-navigation-notice',
            value: 'You’ve tried every problem in this set.',
          },
        ],
        description: 'Plan38: verify exhaustion notice on final item',
      }));
      actions.push(action('click', '.app-return-button', {
        description: 'Plan38: return to entry from exhaustion',
      }));
      actions.push(action('assertFocused', '.app-entry-title', {
        description: 'Plan38: verify focus on entry title after return',
      }));
      actions.push(action('click', '[data-practice-type="like-denominator-subtraction"]', {
        description: 'Plan38: re-enter subtraction set',
      }));
      if (view === 'linear') {
        actions.push(action('click', '.app-view-controls .app-secondary-button', {
          description: 'Plan38: switch to linear path on re-entry',
        }));
      }
      actions.push(action('assertText', `${host} .active-beat-controls button`, {
        value: 'Take away',
        description: 'Plan38: first item ready on re-entry',
      }));
    }
  });

  return actions;
}
