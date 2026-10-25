import assert from 'node:assert/strict';

const mismatchFailure = 'Plan39 Repair03 shared anchor/highlight assertion failed';

export async function assertPlan39TokenContainment(page) {
  await page.mouse.move(0, 0);
  const geometry = await page.locator('.app-visual-view .plan39-repair-token').evaluate((token) => {
    const bounds = (element) => {
      const { left, right, top, bottom, width, height } = element.getBoundingClientRect();
      return { left, right, top, bottom, width, height };
    };
    const style = getComputedStyle(token);
    return {
      tile: bounds(token),
      content: [...token.querySelectorAll('.symbolic-fraction, .symbolic-numerator, .symbolic-denominator')].map(bounds),
      background: style.backgroundColor,
      zIndex: Number(style.zIndex),
    };
  });
  assert(geometry.tile.width >= 44 && geometry.tile.height >= 44, 'Fraction tile retains a minimum touch target');
  assert.equal(geometry.content.length, 3, 'Fraction tile contains its fraction, numerator and denominator');
  for (const content of geometry.content) {
    assert(content.left >= geometry.tile.left + 2 && content.right <= geometry.tile.right - 2
      && content.top >= geometry.tile.top + 2 && content.bottom <= geometry.tile.bottom - 2,
    'Fraction glyphs must remain inside the opaque tile border');
  }
  assert.equal(geometry.background, 'rgb(255, 255, 255)', 'Fraction tile has an opaque white background');
  assert(geometry.zIndex > 2, 'Fraction tile stays above the number-line points');
  return geometry;
}

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
    const ringStyle = rings.length === 1
      ? getComputedStyle(element.querySelector('.plan39-candidate-point.is-drop-preview')).boxShadow
      : '';
    return { anchor, axisY, halfBand, bounds: { left: bounds.left, right: bounds.right }, nearestId: nearest?.id ?? null, rings, ringStyle, points };
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
  assert.match(observed.ringStyle, /rgb\(255, 255, 255\).*5px.*rgb\(51, 65, 85\).*8px/, 'Repair03 live target ring has a light separator and solid dark neutral outline');
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
  return { grip, targetId, anchor: observed.anchor, axisY: observed.axisY, nearestId: observed.nearestId, selectedId, ringsBeforeRelease: observed.rings, ringStyle: observed.ringStyle };
}

async function beginLitGesture(page, targetId) {
  const token = page.locator('.app-visual-view .plan39-repair-token');
  const frame = page.locator('.app-visual-view .plan39-axis-frame');
  const priorId = await token.getAttribute('data-candidate-id');
  const tokenBox = await token.boundingBox();
  const target = await frame.locator(`.plan39-candidate-point[data-candidate-id="${targetId}"]`).boundingBox();
  assert(tokenBox && target && priorId && targetId !== priorId, 'Repair03 cancellation witness needs a placed token and a different offered point');
  const pointerStart = { x: tokenBox.x + tokenBox.width / 2, y: tokenBox.y + tokenBox.height / 2 };
  const pointerTarget = { x: target.x + target.width / 2, y: pointerStart.y };
  await page.mouse.move(pointerStart.x, pointerStart.y);
  await page.mouse.down();
  await page.mouse.move(pointerTarget.x, pointerTarget.y, { steps: 8 });
  const rings = await frame.locator('.plan39-candidate-point.is-drop-preview').count();
  assert.equal(rings, 1, 'Repair03 cancellation witness must begin with a lit live ring');
  return { priorId, targetId };
}

async function assertCancellationCleanup(page, frame, token, points) {
  const escape = await beginLitGesture(page, points[0].id);
  await page.keyboard.press('Escape');
  const escapeRings = await frame.locator('.plan39-candidate-point.is-drop-preview').count();
  const afterEscape = await token.getAttribute('data-candidate-id');
  assert.equal(escapeRings, 0, 'Escape cancellation clears the live ring');
  assert.equal(afterEscape, escape.priorId, 'Escape cancellation restores the prior placement');
  await page.mouse.up();

  const originalViewport = page.viewportSize();
  assert(originalViewport, 'Repair03 resize cancellation requires a fixed browser viewport');
  await page.setViewportSize({ width: 1093, height: 614 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const frameWidthBefore = await frame.evaluate((element) => element.getBoundingClientRect().width);
  const resize = await beginLitGesture(page, points.find(({ id }) => id !== escape.priorId)?.id ?? points[1].id);
  await page.setViewportSize({ width: 1000, height: 614 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const frameWidthAfter = await frame.evaluate((element) => element.getBoundingClientRect().width);
  const resizeRings = await frame.locator('.plan39-candidate-point.is-drop-preview').count();
  const afterResize = await token.getAttribute('data-candidate-id');
  assert.equal(frameWidthAfter, frameWidthBefore, 'Wide resize witness keeps the max-width frame unchanged');
  assert.equal(resizeRings, 0, 'Resize cancellation clears the live ring');
  assert.equal(afterResize, resize.priorId, 'Resize cancellation restores the prior placement');
  await page.mouse.up();
  await page.setViewportSize(originalViewport);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  return {
    escape: { ringsBefore: 1, ringsAfter: escapeRings, priorId: escape.priorId, selectedIdAfter: afterEscape },
    resize: { viewportBefore: { width: 1093, height: 614 }, viewportAfter: { width: 1000, height: 614 }, frameWidthBefore, frameWidthAfter,
      ringsBefore: 1, ringsAfter: resizeRings, priorId: resize.priorId, selectedIdAfter: afterResize },
  };
}

export async function runPlan39Repair03AnchorWitness(page, { seed = null } = {}) {
  const token = page.locator('.app-visual-view .plan39-repair-token');
  const frame = page.locator('.app-visual-view .plan39-axis-frame');
  assert.equal(await page.locator('.plan39-bar-track').count(), 0, 'Repair03 starts with no answer bar before Check');
  const unplacedContainment = await assertPlan39TokenContainment(page);
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
  const placedContainment = await assertPlan39TokenContainment(page);
  assert.equal(await token.getAttribute('data-candidate-id'), right.id);
  assert.equal(await page.locator('.app-visual-view .plan39-check-position').isEnabled(), true, 'placement enables explicit Check only');
  assert.equal(await page.locator('.plan39-bar-track').count(), 0, 'placement does not auto-submit');
  const cancellation = seed ? null : await assertCancellationCleanup(page, frame, token, points);
  return { candidateIds: points.map(({ id }) => id), first, second, cancellation,
    unplacedContainment, placedContainment, explicitCheckEnabled: true, barCountBeforeCheck: 0 };
}
