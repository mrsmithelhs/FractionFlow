export async function dragTokenToRatio(page, { view = 'visual', ratio, yOffset = 0 } = {}) {
  const gesture = await beginTokenDrag(page, { view });
  await moveTokenDrag(page, gesture, { ratio, yOffset });
  await endTokenDrag(page, gesture);
  return gesture;
}

export async function beginTokenDrag(page, { view = 'visual' } = {}) {
  const host = page.locator(`.app-${view}-view`);
  const tokenBox = await host.locator('.plan39-repair-token').boundingBox();
  const frameBox = await host.locator('.plan39-axis-frame').boundingBox();
  const axisBox = await host.locator('.plan39-axis-line').boundingBox();
  if (!tokenBox || !frameBox || !axisBox) throw new Error('Plan39 pointer drag needs a visible token, axis and track');
  const pointerX = tokenBox.x + tokenBox.width / 2;
  const pointerY = tokenBox.y + tokenBox.height / 2;
  const anchorX = tokenBox.x + tokenBox.width / 2;
  const anchorY = tokenBox.y + tokenBox.height;
  await page.mouse.move(pointerX, pointerY);
  await page.mouse.down();
  return {
    page,
    frameBox,
    axisY: axisBox.y + axisBox.height / 2,
    grabOffset: { x: pointerX - anchorX, y: pointerY - anchorY },
    view,
  };
}

export async function moveTokenDrag(page, gesture, { ratio, yOffset = 0 } = {}) {
  const targetX = gesture.frameBox.x + gesture.frameBox.width * ratio + gesture.grabOffset.x;
  const targetY = gesture.axisY + yOffset + gesture.grabOffset.y;
  await page.mouse.move(targetX, targetY + 8, { steps: 4 });
  await page.mouse.move(targetX, targetY, { steps: 4 });
}

export async function endTokenDrag(page, gesture) {
  await page.mouse.up();
  return gesture;
}

export async function tapTrackAtRatio(page, { view = 'visual', ratio, inputMode = 'mouse' } = {}) {
  const host = page.locator(`.app-${view}-view`);
  const frameBox = await host.locator('.plan39-axis-frame').boundingBox();
  if (!frameBox) throw new Error('Plan39 track tap needs a visible track');
  const x = frameBox.x + frameBox.width * ratio;
  const y = frameBox.y + frameBox.height / 2;
  if (inputMode === 'touch') await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
  return frameBox;
}

export async function choosePlan39RadioByKeyboard(page, { view = 'linear', candidateId } = {}) {
  const radio = page.locator(`.app-${view}-view input[type="radio"][data-candidate-id="${candidateId}"]`);
  await radio.focus();
  await radio.press('Space');
  return radio;
}
