import assert from 'node:assert/strict';

const mismatchFailure = 'Plan39 Repair03 shared anchor/highlight assertion failed';

async function dragToOfferedPoint(page, targetId, grip, seed = null) {
  const token = page.locator('.app-visual-view .plan39-repair-token');
  const frame = page.locator('.app-visual-view .plan39-axis-frame');
  const tokenBox = await token.boundingBox();
  const axisBox = await frame.locator('.plan39-axis-line').boundingBox();
  const target = await frame.locator(`.plan39-candidate-point[data-candidate-id="${targetId}"]`).boundingBox();
  assert(tokenBox && axisBox && target, 'Repair03 token, axis and offered point must be measurable');

  const anchorStart = { x: tokenBox.x + tokenBox.width / 2, y: tokenBox.y + tokenBox.height };
  const pointerStart = {
    x: grip === 'edge' ? tokenBox.x + tokenBox.width - 2 : tokenBox.x + tokenBox.width / 2,
    y: tokenBox.y + tokenBox.height / 2,
  };
  const offset = { x: pointerStart.x - anchorStart.x, y: pointerStart.y - anchorStart.y };
  const anchorTarget = { x: target.x + target.width / 2, y: anchorStart.y };
  const pointerTarget = { x: anchorTarget.x + offset.x, y: pointerStart.y };

  await page.mouse.move(pointerStart.x, pointerStart.y);
  await page.mouse.down();
  await page.mouse.move(pointerTarget.x, pointerTarget.y, { steps: 8 });

  const observed = await frame.evaluate((element) => {
    const moving = document.querySelector('.app-visual-view .plan39-repair-token').getBoundingClientRect();
    const axis = element.querySelector('.plan39-axis-line').getBoundingClientRect();
    const bounds = element.getBoundingClientRect();
    const anchor = { x: moving.left + moving.width / 2, y: moving.bottom };
    const points = [...element.querySelectorAll('.plan39-candidate-point')].map((point, index) => {
      const rect = point.getBoundingClientRect();
      return { id: point.getAttribute('data-candidate-id'), index, x: rect.left + rect.width / 2 };
    });
    const nearest = points.slice().sort((left, right) => {
      const delta = Math.abs(left.x - anchor.x) - Math.abs(right.x - anchor.x);
      const tolerance = Number.EPSILON * Math.max(1, Math.abs(left.x), Math.abs(right.x), Math.abs(anchor.x)) * 8;
      if (Math.abs(delta) > tolerance) return delta;
      return left.x - right.x || left.index - right.index;
    })[0];
    const axisY = axis.top + axis.height / 2;
    const halfBand = Math.max(22, bounds.height / 2);
    const rings = [...element.querySelectorAll('.plan39-candidate-point.is-drop-preview')]
      .map((point) => point.getAttribute('data-candidate-id'));
    return { anchor, axisY, halfBand, bounds: { left: bounds.left, right: bounds.right }, nearestId: nearest?.id ?? null, rings, points };
  });

  const inBand = observed.anchor.x >= observed.bounds.left && observed.anchor.x <= observed.bounds.right
    && Math.abs(observed.anchor.y - observed.axisY) <= observed.halfBand;
  assert(inBand, 'Repair03 natural horizontal drag must retain an eligible bottom-centre anchor');
  assert(Math.abs(observed.anchor.y - observed.axisY) <= 1, 'Repair03 horizontal drag keeps the bottom-centre anchor aligned with the axis');

  if (seed === 'highlight-anchor-mismatch') {
    await frame.evaluate((element, expectedId) => {
      const alternative = [...element.querySelectorAll('.plan39-candidate-point')]
        .find((point) => point.getAttribute('data-candidate-id') !== expectedId);
      element.querySelector('.plan39-candidate-point.is-drop-preview')?.classList.remove('is-drop-preview');
      alternative?.classList.add('is-drop-preview');
    }, observed.nearestId);
    observed.rings = await frame.locator('.plan39-candidate-point.is-drop-preview').evaluateAll((nodes) => nodes.map((point) => point.getAttribute('data-candidate-id')));
  }

  let assertionError = null;
  try {
    assert.deepEqual(observed.rings, [observed.nearestId], mismatchFailure);
  } catch (error) {
    assertionError = error;
  }

  if (assertionError) {
    await page.keyboard.press('Escape');
    await page.mouse.up();
    if (seed === 'highlight-anchor-mismatch') {
      throw new Error(`${mismatchFailure}: expected ${observed.nearestId}, saw ${observed.rings.join(',')}`);
    }
    throw assertionError;
  }

  await page.mouse.up();
  const selectedId = await token.getAttribute('data-candidate-id');
  const remainingRings = await frame.locator('.plan39-candidate-point.is-drop-preview').count();
  assert.equal(selectedId, observed.nearestId, 'Repair03 release must select the same offered point as its live ring');
  assert.equal(remainingRings, 0, 'Repair03 release clears the transient ring');
  return { grip, targetId, anchor: observed.anchor, axisY: observed.axisY, nearestId: observed.nearestId, selectedId, ringsBeforeRelease: observed.rings };
}

export async function runPlan39Repair03AnchorWitness(page, { seed = null } = {}) {
  const token = page.locator('.app-visual-view .plan39-repair-token');
  const frame = page.locator('.app-visual-view .plan39-axis-frame');
  assert.equal(await page.locator('.plan39-bar-track').count(), 0, 'Repair03 starts with no answer bar before Check');
  await page.locator('.app-visual-view .plan39-stepper-previous').click();
  const points = await frame.locator('.plan39-candidate-point').evaluateAll((nodes) => nodes.map((node, index) => ({
    id: node.getAttribute('data-candidate-id'),
    index,
    x: node.getBoundingClientRect().left + node.getBoundingClientRect().width / 2,
  })));
  assert(points.length >= 3, 'Repair03 witness requires at least three offered locations');
  const mid = points[Math.floor(points.length / 2)];
  const right = points.at(-1);
  const first = await dragToOfferedPoint(page, mid.id, 'center');
  const second = await dragToOfferedPoint(page, right.id, 'edge', seed);
  assert.equal(await token.getAttribute('data-candidate-id'), right.id);
  assert.equal(await page.locator('.app-visual-view .plan39-check-position').isEnabled(), true, 'placement enables explicit Check only');
  assert.equal(await page.locator('.plan39-bar-track').count(), 0, 'placement does not auto-submit');
  return { candidateIds: points.map(({ id }) => id), first, second, explicitCheckEnabled: true, barCountBeforeCheck: 0 };
}
