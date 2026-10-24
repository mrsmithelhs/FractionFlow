import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

function action(method, target, extra = {}) {
  return { method, target, ...extra };
}

export function buildPlan43WitnessActions(config) {
  const { branch, view = 'visual', inputMode = 'mouse' } = config;
  const actions = [];
  const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
  const prefix = view === 'linear' ? 'linear-' : '';

  // Helper for clicking/tapping/pressing
  const interact = (target, desc) => {
    if (inputMode === 'touch') {
      return action('tap', target, { description: desc });
    }
    return action('click', target, { description: desc });
  };

  const pressKey = (target, key, desc) => {
    return action('pressKey', target, { value: key, description: desc });
  };

  const fill = (target, value, desc) => {
    return action('fill', target, { value: String(value), description: desc });
  };

  const screenshot = (filename, caption, desc) => {
    return action('screenshot', '', {
      file: `reports/development/plan-43-shared-episode-completion-and-progression/evidence/screenshots/${filename}`,
      caption,
      description: desc,
    });
  };

  // Switch view if linear requested: practice must be started first, then view switched
  const startAndSwitchView = (practiceTypeId, practiceDesc) => {
    actions.push(interact(`[data-practice-type="${practiceTypeId}"]`, practiceDesc));
    if (view === 'linear') {
      actions.push(action('click', '.app-view-controls .app-secondary-button', {
        description: 'Switch to accessible linear view',
      }));
    }
  };

  // Branch 1: Addition recipe 1 — Construct (Item 0: 2/3 + 1/4 -> Item 1: 1/2 + 1/3)
  if (branch === 'addition-construct') {
    startAndSwitchView('sum-under-one', 'Start addition practice');
    actions.push(interact(`${host} .control-btn`, 'Item 1 encounter: acknowledge'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '8', 'Transform left: 8/12'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left conversion'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '3', 'Transform right: 3/12'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit right conversion'));
    actions.push(fill(`${host} #${prefix}operate-sum-input`, '11', 'Operate sum: 11/12'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit operation sum'));

    // Assert resolve state before advance
    actions.push(action('assert', `${host} .active-beat-controls button`, {
      description: 'Assert local Next problem button present in resolve',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Next problem' },
        { type: 'hasSelector', target: '.app-next-button[hidden]' },
      ],
    }));
    actions.push(action('assertFocused', `${host} .active-beat-controls button`, {
      description: 'Assert focus landed on local progression button',
    }));
    actions.push(screenshot('branch-01-addition-construct-before.png', 'Addition construct before Next', 'Capture accepted construct item before advance'));

    // Advance directly via local button
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance directly to item 2'));
    actions.push(screenshot('branch-01-addition-construct-after.png', 'Addition construct after Next', 'Capture fresh item 2 mounted'));

    // Assert fresh item 2 postconditions
    actions.push(action('assert', host, {
      description: 'Assert item 2 mounted fresh with clean state',
      assertions: [
        { type: 'hasSelector', target: `${host} .control-btn` },
        { type: 'notHasSelector', target: `${host} #${prefix}transform-num-input-left` },
        { type: 'notHasSelector', target: `${host} .active-beat-recovery` },
      ],
    }));
    return actions;
  }

  // Branch 2: Addition recipe 2 — Inspect (Item 1: 1/2 + 1/3 in linear view)
  if (branch === 'addition-inspect') {
    startAndSwitchView('sum-under-one', 'Start addition practice');
    // Solve item 0 in linear
    actions.push(interact(`${host} .control-btn`, 'Item 1 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '8', 'Item 1 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '3', 'Item 1 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit right'));
    actions.push(fill(`${host} #${prefix}operate-sum-input`, '11', 'Item 1 sum'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit sum'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 2'));

    // Solve item 1 (inspect: 1/2 + 1/3 in twelfths)
    actions.push(interact(`${host} .control-btn`, 'Item 2 encounter'));
    // Left candidate is 5/12 (not equal to 1/2), repair to 6
    actions.push(interact(`${host} .inspect-change-button`, 'Repair left candidate 5/12'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '6', 'Enter corrected left 6/12'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left repair'));
    // Right candidate is 4/12 (equal to 1/3), keep
    actions.push(interact(`${host} button[aria-label^="Keep"]`, 'Keep valid right candidate 4/12'));
    // Operate: 6/12 + 4/12 = 10/12
    actions.push(fill(`${host} #${prefix}operate-sum-input`, '10', 'Item 2 sum 10/12'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit sum'));

    // Assert resolve state
    actions.push(action('assert', `${host} .active-beat-controls button`, {
      description: 'Assert local Next problem button present in resolve',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Next problem' },
      ],
    }));
    actions.push(screenshot('branch-02-addition-inspect-before.png', 'Addition inspect before Next', 'Capture accepted inspect item before advance'));

    // Advance via keyboard Enter
    actions.push(pressKey(`${host} .active-beat-controls button`, 'Enter', 'Keyboard Enter to advance to item 3'));
    actions.push(screenshot('branch-02-addition-inspect-after.png', 'Addition inspect after Next', 'Capture fresh item 3 mounted'));

    actions.push(action('assert', host, {
      description: 'Assert item 3 mounted fresh with clean state',
      assertions: [
        { type: 'hasSelector', target: `${host} .control-btn` },
        { type: 'notHasSelector', target: `${host} #${prefix}operate-sum-input` },
        { type: 'notHasSelector', target: `${host} .active-beat-recovery` },
      ],
    }));
    return actions;
  }

  // Branch 3: Addition recipe 3 — Identify-side (Item 6 in unlike subtraction)
  if (branch === 'addition-identify') {
    startAndSwitchView('unlike-denominator-subtraction', 'Start unlike subtraction practice');
    // Item 1: construct (1/2 - 1/5 = 3/10)
    actions.push(interact(`${host} .control-btn`, 'Item 1 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '5', 'Item 1 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '2', 'Item 1 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit right'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '3', 'Item 1 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '10', 'Item 1 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 2'));

    // Item 2: construct (3/4 - 2/5 = 7/20)
    actions.push(interact(`${host} .control-btn`, 'Item 2 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '15', 'Item 2 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '8', 'Item 2 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit right'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '7', 'Item 2 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '20', 'Item 2 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 3'));

    // Item 3: construct (5/6 - 3/8 = 11/24)
    actions.push(interact(`${host} .control-btn`, 'Item 3 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '20', 'Item 3 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 3 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '9', 'Item 3 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 3 submit right'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '11', 'Item 3 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '24', 'Item 3 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 3 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 4'));

    // Item 4: inspect (2/3 - 1/4 = 5/12)
    actions.push(interact(`${host} .control-btn`, 'Item 4 encounter'));
    actions.push(interact(`${host} .inspect-change-button`, 'Item 4 repair left candidate'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '8', 'Enter corrected left 8/12'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left repair'));
    actions.push(interact(`${host} button[aria-label^="Keep"]`, 'Item 4 keep right candidate'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '5', 'Item 4 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '12', 'Item 4 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 4 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 5'));

    // Item 5: inspect (7/10 - 1/4 = 9/20)
    actions.push(interact(`${host} .control-btn`, 'Item 5 encounter'));
    actions.push(interact(`${host} button[aria-label^="Keep"]`, 'Item 5 keep left candidate'));
    actions.push(interact(`${host} .inspect-change-button`, 'Item 5 repair right candidate'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '5', 'Enter corrected right 5/20'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit right repair'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '9', 'Item 5 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '20', 'Item 5 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 5 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 6'));

    // Item 6: inspect (5/6 - 7/10 = 4/30)
    actions.push(interact(`${host} .control-btn`, 'Item 6 encounter'));
    actions.push(interact(`${host} .inspect-change-button`, 'Item 6 repair left candidate'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '25', 'Enter corrected left 25/30'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left repair'));
    actions.push(interact(`${host} button[aria-label^="Keep"]`, 'Item 6 keep right candidate'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '4', 'Item 6 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '30', 'Item 6 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 6 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 7'));

    // Item 7: identify-side (5/6 - 1/3 = 3/6)
    actions.push(interact(`${host} .control-btn`, 'Item 7 encounter'));
    actions.push(interact(`${host} .nested-side-choice >> nth=1`, 'Select right side 1/3 for renaming'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '2', 'Transform right to 2/6'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit right conversion'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '3', 'Operate diff num 3/6'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '6', 'Operate diff den 6'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit operation diff'));

    // Assert resolve
    actions.push(action('assert', `${host} .active-beat-controls button`, {
      description: 'Assert local Next problem button present in resolve',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Next problem' },
      ],
    }));
    actions.push(screenshot('branch-03-addition-identify-before.png', 'Identify side before Next', 'Capture accepted identify-side item before advance'));

    actions.push(interact(`${host} .active-beat-controls button`, 'Advance directly to item 8'));
    actions.push(screenshot('branch-03-addition-identify-after.png', 'Identify side after Next', 'Capture fresh item 8 mounted'));

    actions.push(action('assert', host, {
      description: 'Assert item 8 mounted fresh with clean state',
      assertions: [
        { type: 'hasSelector', target: `${host} .control-btn` },
        { type: 'notHasSelector', target: `${host} #${prefix}transform-num-input-right` },
        { type: 'notHasSelector', target: `${host} .active-beat-recovery` },
      ],
    }));
    return actions;
  }

  // Branch 4: Plan 20 same-denominator addition return (Item 0: 2/7 + 3/7)
  if (branch === 'plan20-same-denom-return') {
    startAndSwitchView('like-denominator-addition', 'Start same-denominator addition practice');
    actions.push(interact(`${host} .control-btn`, 'Item 1 encounter'));
    actions.push(interact(`${host} .control-choice-btn >> nth=0`, 'Notice: same units'));
    actions.push(fill(`${host} #operate-fraction-numerator-input`, '5', 'Enter numerator 5'));
    actions.push(fill(`${host} #operate-fraction-denominator-input`, '7', 'Enter denominator 7'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit sum 5/7'));

    // Assert terminal resolve with Back to start
    actions.push(action('assert', `${host} .active-beat-controls`, {
      description: 'Assert terminal Back to start and exhaustion notice',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Back to start' },
        { type: 'containsText', target: `${host} .progression-notice`, value: 'You’ve tried every problem in this set.' },
      ],
    }));
    actions.push(screenshot('branch-04-plan20-same-denom-before.png', 'Plan 20 before return', 'Capture single-item completion before return'));

    // Activate Back to start
    actions.push(interact(`${host} .active-beat-controls button`, 'Click Back to start'));
    actions.push(screenshot('branch-04-plan20-same-denom-after.png', 'Plan 20 after return', 'Capture entry page after return'));

    // Assert entry page is visible and title focused
    actions.push(action('assert', '.app-entry-page', {
      description: 'Assert entry page visible after return',
      assertions: [
        { type: 'notHasSelector', target: '.app-entry-page[hidden]' },
        { type: 'hasSelector', target: '.app-episode[hidden]' },
      ],
    }));
    return actions;
  }

  // Branch 5: Same-denominator subtraction takeaway (Item 0: 5/8 - 2/8)
  if (branch === 'subtraction-takeaway') {
    startAndSwitchView('like-denominator-subtraction', 'Start like-denominator subtraction practice');
    actions.push(interact(`${host} .active-beat-controls button`, 'Item 1 encounter: Take away'));
    actions.push(fill(`${host} #operate-fraction-numerator-input`, '3', 'Enter numerator 3'));
    actions.push(fill(`${host} #operate-fraction-denominator-input`, '8', 'Enter denominator 8'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit difference 3/8'));

    actions.push(action('assert', `${host} .active-beat-controls button`, {
      description: 'Assert local Next problem button present in resolve',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Next problem' },
      ],
    }));
    actions.push(screenshot('branch-05-subtraction-takeaway-before.png', 'Subtraction takeaway before Next', 'Capture like-denominator takeaway before advance'));

    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 2'));
    actions.push(screenshot('branch-05-subtraction-takeaway-after.png', 'Subtraction takeaway after Next', 'Capture fresh item 2 mounted'));

    actions.push(action('assert', host, {
      description: 'Assert item 2 mounted fresh with clean state',
      assertions: [
        { type: 'hasSelector', target: `${host} .active-beat-controls button` },
        { type: 'notHasSelector', target: `${host} #operate-fraction-numerator-input` },
        { type: 'notHasSelector', target: `${host} .active-beat-recovery` },
      ],
    }));
    return actions;
  }

  // Branch 6: Unlike subtraction construct (Item 0: 1/2 - 1/5)
  if (branch === 'unlike-subtraction-construct') {
    startAndSwitchView('unlike-denominator-subtraction', 'Start unlike subtraction practice');
    actions.push(interact(`${host} .control-btn`, 'Item 1 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '5', 'Transform left: 5/10'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left conversion'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '2', 'Transform right: 2/10'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit right conversion'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '3', 'Operate diff num: 3/10'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '10', 'Operate diff den: 10'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit difference'));

    actions.push(action('assert', `${host} .active-beat-controls button`, {
      description: 'Assert local Next problem button present in resolve',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Next problem' },
      ],
    }));
    actions.push(screenshot('branch-06-unlike-subtraction-construct-before.png', 'Unlike subtraction construct before Next', 'Capture unlike subtraction construct before advance'));

    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 2'));
    actions.push(screenshot('branch-06-unlike-subtraction-construct-after.png', 'Unlike subtraction construct after Next', 'Capture fresh item 2 mounted'));

    actions.push(action('assert', host, {
      description: 'Assert item 2 mounted fresh with clean state',
      assertions: [
        { type: 'hasSelector', target: `${host} .control-btn` },
        { type: 'notHasSelector', target: `${host} #${prefix}transform-num-input-left` },
        { type: 'notHasSelector', target: `${host} .active-beat-recovery` },
      ],
    }));
    return actions;
  }

  // Branch 7: Unlike subtraction inspect (Item 3 in linear view)
  if (branch === 'unlike-subtraction-inspect') {
    startAndSwitchView('unlike-denominator-subtraction', 'Start unlike subtraction practice');
    // Item 1: construct
    actions.push(interact(`${host} .control-btn`, 'Item 1 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '5', 'Item 1 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '2', 'Item 1 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit right'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '3', 'Item 1 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '10', 'Item 1 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 2'));

    // Item 2: construct
    actions.push(interact(`${host} .control-btn`, 'Item 2 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '15', 'Item 2 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '8', 'Item 2 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit right'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '7', 'Item 2 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '20', 'Item 2 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 3'));

    // Item 3: construct
    actions.push(interact(`${host} .control-btn`, 'Item 3 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '20', 'Item 3 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 3 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '9', 'Item 3 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 3 submit right'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '11', 'Item 3 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '24', 'Item 3 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 3 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 4'));

    // Item 4: inspect (2/3 - 1/4 = 5/12)
    actions.push(interact(`${host} .control-btn`, 'Item 4 encounter'));
    actions.push(interact(`${host} .inspect-change-button`, 'Item 4 repair left candidate'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '8', 'Enter corrected left 8/12'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left repair'));
    actions.push(interact(`${host} button[aria-label^="Keep"]`, 'Item 4 keep right candidate'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '5', 'Item 4 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '12', 'Item 4 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 4 submit diff'));

    actions.push(action('assert', `${host} .active-beat-controls button`, {
      description: 'Assert local Next problem button present in resolve',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Next problem' },
      ],
    }));
    actions.push(screenshot('branch-07-unlike-subtraction-inspect-before.png', 'Unlike subtraction inspect before Next', 'Capture inspect subtraction before advance'));

    actions.push(pressKey(`${host} .active-beat-controls button`, 'Enter', 'Keyboard Enter to advance to item 5'));
    actions.push(screenshot('branch-07-unlike-subtraction-inspect-after.png', 'Unlike subtraction inspect after Next', 'Capture fresh item 5 mounted'));

    actions.push(action('assert', host, {
      description: 'Assert item 5 mounted fresh with clean state',
      assertions: [
        { type: 'hasSelector', target: `${host} .control-btn` },
        { type: 'notHasSelector', target: `${host} #${prefix}operate-fraction-numerator-input` },
        { type: 'notHasSelector', target: `${host} .active-beat-recovery` },
      ],
    }));
    return actions;
  }

  // Branch 8: Unlike subtraction identify (Item 6 in visual view)
  if (branch === 'unlike-subtraction-identify') {
    startAndSwitchView('unlike-denominator-subtraction', 'Start unlike subtraction practice');
    // Solve items 1 to 6
    // Item 1: construct
    actions.push(interact(`${host} .control-btn`, 'Item 1 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '5', 'Item 1 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '2', 'Item 1 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit right'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '3', 'Item 1 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '10', 'Item 1 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 2'));

    // Item 2: construct
    actions.push(interact(`${host} .control-btn`, 'Item 2 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '15', 'Item 2 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '8', 'Item 2 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit right'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '7', 'Item 2 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '20', 'Item 2 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 3'));

    // Item 3: construct
    actions.push(interact(`${host} .control-btn`, 'Item 3 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '20', 'Item 3 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 3 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '9', 'Item 3 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 3 submit right'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '11', 'Item 3 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '24', 'Item 3 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 3 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 4'));

    // Item 4: inspect
    actions.push(interact(`${host} .control-btn`, 'Item 4 encounter'));
    actions.push(interact(`${host} .inspect-change-button`, 'Item 4 repair left candidate'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '8', 'Enter corrected left 8/12'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left repair'));
    actions.push(interact(`${host} button[aria-label^="Keep"]`, 'Item 4 keep right candidate'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '5', 'Item 4 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '12', 'Item 4 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 4 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 5'));

    // Item 5: inspect
    actions.push(interact(`${host} .control-btn`, 'Item 5 encounter'));
    actions.push(interact(`${host} button[aria-label^="Keep"]`, 'Item 5 keep left candidate'));
    actions.push(interact(`${host} .inspect-change-button`, 'Item 5 repair right candidate'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '5', 'Enter corrected right 5/20'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit right repair'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '9', 'Item 5 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '20', 'Item 5 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 5 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 6'));

    // Item 6: inspect
    actions.push(interact(`${host} .control-btn`, 'Item 6 encounter'));
    actions.push(interact(`${host} .inspect-change-button`, 'Item 6 repair left candidate'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '25', 'Enter corrected left 25/30'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left repair'));
    actions.push(interact(`${host} button[aria-label^="Keep"]`, 'Item 6 keep right candidate'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '4', 'Item 6 diff num'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '30', 'Item 6 diff den'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 6 submit diff'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 7'));

    // Item 7: identify-side
    actions.push(interact(`${host} .control-btn`, 'Item 7 encounter'));
    actions.push(interact(`${host} .nested-side-choice >> nth=1`, 'Select right side 1/3'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '2', 'Transform right to 2/6'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit right conversion'));
    actions.push(fill(`${host} #${prefix}operate-fraction-numerator-input`, '3', 'Operate diff num 3/6'));
    actions.push(fill(`${host} #${prefix}operate-fraction-denominator-input`, '6', 'Operate diff den 6'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit diff'));

    actions.push(action('assert', `${host} .active-beat-controls button`, {
      description: 'Assert local Next problem button present in resolve',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Next problem' },
      ],
    }));
    actions.push(screenshot('branch-08-unlike-subtraction-identify-before.png', 'Unlike subtraction identify before Next', 'Capture identify subtraction before advance'));

    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 8'));
    actions.push(screenshot('branch-08-unlike-subtraction-identify-after.png', 'Unlike subtraction identify after Next', 'Capture fresh item 8 mounted'));

    actions.push(action('assert', host, {
      description: 'Assert item 8 mounted fresh with clean state',
      assertions: [
        { type: 'hasSelector', target: `${host} .control-btn` },
        { type: 'notHasSelector', target: `${host} #${prefix}transform-num-input-right` },
        { type: 'notHasSelector', target: `${host} .active-beat-recovery` },
      ],
    }));
    return actions;
  }

  // Branch 9: Number line locate (bridge-01-half-2)
  if (branch === 'number-line-locate') {
    startAndSwitchView('bar-to-line-same-amount', 'Start number line practice');
    actions.push(interact(`${host} .plan39-stepper-next`, 'Step right'));
    actions.push(interact(`${host} .plan39-stepper-previous`, 'Step left to 1/2'));
    actions.push(interact(`${host} .plan39-check-position`, 'Check position'));

    actions.push(action('assert', `${host} .plan39-finish`, {
      description: 'Assert local Next problem button present in resolve',
      assertions: [
        { type: 'containsText', target: `${host} .plan39-finish`, value: 'Next problem' },
      ],
    }));
    actions.push(screenshot('branch-09-number-line-locate-before.png', 'Number line locate before Next', 'Capture number line locate before advance'));

    actions.push(interact(`${host} .plan39-finish`, 'Advance to item 2'));
    actions.push(screenshot('branch-09-number-line-locate-after.png', 'Number line locate after Next', 'Capture fresh item 2 mounted'));

    actions.push(action('assert', host, {
      description: 'Assert item 2 mounted fresh with clean state',
      assertions: [
        { type: 'hasSelector', target: `${host} .plan39-stepper-next` },
        { type: 'hasSelector', target: `${host} .plan39-check-position[disabled]` },
      ],
    }));
    return actions;
  }

  // Branch 10: Substantive reflection milestone Continue -> reflect -> Next
  if (branch === 'substantive-reflection') {
    startAndSwitchView('sum-under-one', 'Start addition practice');
    // Item 1: construct
    actions.push(interact(`${host} .control-btn`, 'Item 1 encounter'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '8', 'Item 1 left'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '3', 'Item 1 right'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit right'));
    actions.push(fill(`${host} #${prefix}operate-sum-input`, '11', 'Item 1 sum'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 1 submit sum'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 2'));

    // Item 2: inspect
    actions.push(interact(`${host} .control-btn`, 'Item 2 encounter'));
    actions.push(interact(`${host} .inspect-change-button`, 'Repair left candidate 5/12'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '6', 'Enter corrected left 6/12'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left repair'));
    actions.push(interact(`${host} button[aria-label^="Keep"]`, 'Item 2 keep right'));
    actions.push(fill(`${host} #${prefix}operate-sum-input`, '10', 'Item 2 sum'));
    actions.push(interact(`${host} .control-submit-btn`, 'Item 2 submit sum'));
    actions.push(interact(`${host} .active-beat-controls button`, 'Advance to item 3'));

    // Item 3: reflection item (one-half-plus-one-fifth)
    actions.push(interact(`${host} .control-btn`, 'Item 3 encounter'));
    actions.push(interact(`${host} .control-choice-btn >> nth=1`, 'Notice: different units'));
    actions.push(interact(`${host} button[aria-label="Common denominator 10"]`, 'Decide denominator 10'));
    actions.push(fill(`${host} #${prefix}transform-num-input-left`, '5', 'Transform left 5/10'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit left'));
    actions.push(fill(`${host} #${prefix}transform-num-input-right`, '2', 'Transform right 2/10'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit right'));
    actions.push(fill(`${host} #${prefix}operate-sum-input`, '7', 'Operate sum 7/10'));
    actions.push(interact(`${host} .control-submit-btn`, 'Submit sum'));

    // At resolve milestone: button says Continue
    actions.push(action('assert', `${host} .active-beat-controls button`, {
      description: 'Assert Continue button present at milestone resolve',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Continue' },
      ],
    }));
    actions.push(action('assertFocused', `${host} .active-beat-controls button`, {
      description: 'Assert Continue button is focused at milestone',
    }));
    actions.push(screenshot('branch-10-reflection-milestone-before.png', 'Reflection milestone before Continue', 'Capture resolve milestone before Continue'));

    // Press Enter on Continue to enter reflect beat
    actions.push(pressKey(`${host} .active-beat-controls button`, 'Enter', 'Keyboard Enter on Continue to enter reflection'));

    // In reflect beat: assert active element is the reflection choice, and next problem button does NOT exist
    actions.push(action('assert', host, {
      description: 'Assert reflect beat active with connected reflection controls focused',
      assertions: [
        { type: 'hasSelector', target: `${host} .active-beat-controls .control-choice-btn` },
        { type: 'notHasSelector', target: `${host} .active-beat-controls .control-action-btn` },
      ],
    }));
    actions.push(action('assertFocused', `${host} .active-beat-controls .control-choice-btn >> nth=0`, {
      description: 'Assert focus landed on connected reflection control, not BODY',
    }));

    // Submit matching reflection choice (the bar with 5 of 10 shaded)
    actions.push(interact(`${host} button[aria-label*="5 of 10"]`, 'Select matching reflection choice 5/10'));

    // Now in resolved reflection: button says Next problem
    actions.push(action('assert', `${host} .active-beat-controls button`, {
      description: 'Assert local Next problem button present after reflection answered',
      assertions: [
        { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Next problem' },
      ],
    }));
    actions.push(screenshot('branch-10-reflection-milestone-after.png', 'Reflection milestone after response', 'Capture resolved reflection state'));

    // Press Enter to advance to item 4
    actions.push(pressKey(`${host} .active-beat-controls button`, 'Enter', 'Keyboard Enter on Next problem'));

    actions.push(action('assert', host, {
      description: 'Assert item 4 mounted fresh with clean state',
      assertions: [
        { type: 'hasSelector', target: `${host} .control-btn` },
        { type: 'notHasSelector', target: `${host} #${prefix}operate-sum-input` },
        { type: 'notHasSelector', target: `${host} .active-beat-recovery` },
      ],
    }));
    return actions;
  }

  throw new Error(`Unknown Plan 43 branch: ${branch}`);
}
