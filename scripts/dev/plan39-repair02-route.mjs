import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../../src/content/data/plan37-bar-to-line-bridge-records.js';
import { beginTokenDrag, dragTokenToRatio, endTokenDrag, moveTokenDrag, tapTrackAtRatio, choosePlan39RadioByKeyboard } from './plan39-repair02-playwright-helpers.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sameAmount = (a, b) => BigInt(a.numerator) * BigInt(b.denominator) === BigInt(b.numerator) * BigInt(a.denominator);

function expectedCandidate(record, supportProfile) {
  const candidates = supportProfile === 'high-support'
    ? Array.from({ length: Number(record.partitionDenominator) + 1 }, (_, index) => ({
      id: `partition-${index}-of-${record.partitionDenominator}`,
      form: { numerator: String(index), denominator: record.partitionDenominator },
    }))
    : record.sparseCandidates;
  const match = candidates.find(({ form }) => sameAmount(form, record.sourceForm));
  if (!match) throw new Error(`No exact offered location for ${record.itemId}`);
  return match;
}

function exactScale(record, supportProfile) {
  const candidates = supportProfile === 'high-support'
    ? Array.from({ length: Number(record.partitionDenominator) + 1 }, (_, index) => ({
      id: `partition-${index}-of-${record.partitionDenominator}`,
      form: { numerator: String(index), denominator: record.partitionDenominator },
    }))
    : record.sparseCandidates;
  const gcd = (a, b) => b === 0n ? a : gcd(b, a % b);
  const scale = supportProfile === 'high-support'
    ? BigInt(record.partitionDenominator)
    : candidates.reduce((lcm, { form }) => {
      const denominator = BigInt(form.denominator);
      return lcm / gcd(lcm, denominator) * denominator;
    }, 1n);
  return {
    scale: scale.toString(),
    positions: candidates.map(({ form, id }, index) => {
      const units = BigInt(form.numerator) * (scale / BigInt(form.denominator));
      return {
        id,
        units: units.toString(),
        label: supportProfile === 'high-support'
          ? `Step ${units} of ${scale} equal steps from 0`
          : `${String.fromCharCode(65 + index)}: ${units} of ${scale} equal steps from 0`,
      };
    }),
  };
}

async function exactCandidateRatio(page, view, id) {
  return page.locator(`.app-${view}-view .plan39-candidate-point[data-candidate-id="${id}"]`)
    .evaluate((point) => Number.parseFloat(point.style.left) / 100);
}

async function chooseLocation(page, { view, supportProfile, interaction, pointerKind, record }) {
  const candidate = expectedCandidate(record, supportProfile);
  if (view === 'visual') {
    const ratio = await exactCandidateRatio(page, view, candidate.id);
    if (interaction === 'drag') await dragTokenToRatio(page, { view, ratio });
    else if (interaction === 'tap') await tapTrackAtRatio(page, { view, ratio, inputMode: pointerKind });
    else throw new Error(`Visual Repair02 journey does not support ${interaction}`);
  } else {
    if (interaction !== 'keyboard') throw new Error(`Linear Repair02 journey requires keyboard; got ${interaction}`);
    await choosePlan39RadioByKeyboard(page, { view, candidateId: candidate.id });
  }
  return candidate;
}

async function readGeometry(page, view) {
  return page.locator(`.app-${view}-view`).evaluate((host) => {
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height, top: box.top, bottom: box.bottom };
    };
    const prompt = host.querySelector('.active-beat-prompt');
    const controls = host.querySelector('.plan39-controls');
    const targets = [...host.querySelectorAll('.plan39-stepper-move, .plan39-candidate, .plan39-check-position')];
    const labels = [...host.querySelectorAll('.plan39-candidates input[type="radio"]')]
      .map((radio) => radio.getAttribute('aria-label'));
    return {
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      prompt: prompt ? rect(prompt) : null,
      controls: controls ? rect(controls) : null,
      targets: targets.map(rect),
      minimumTargetWidth: Math.min(...targets.map((target) => rect(target).width)),
      minimumTargetHeight: Math.min(...targets.map((target) => rect(target).height)),
      linearOptionLabels: labels,
      linearOptionLabelsDistinct: labels.length === new Set(labels).size,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
}

export async function runPlan39Repair02Set(page, {
  view = 'visual',
  supportProfile = 'high-support',
  interaction = 'drag',
  pointerKind = 'mouse',
  startAt = 0,
  endAt = 7,
  screenshot = null,
  resizeCheck = null,
  stepperEndpointCheck = false,
} = {}) {
  if (!['visual', 'linear'].includes(view)
    || !['high-support', 'medium-support'].includes(supportProfile)
    || !['drag', 'tap', 'keyboard'].includes(interaction)
    || !['mouse', 'touch'].includes(pointerKind)
    || !Number.isInteger(startAt) || !Number.isInteger(endAt) || startAt < 0 || endAt < startAt || endAt > 7) {
    throw new TypeError('Invalid Plan 39 Repair02 route parameters');
  }

  const host = `.app-${view}-view`;
  const results = [];
  for (let index = 0; index <= endAt; index += 1) {
    const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[index];
    if (index > 0) {
      await page.locator('.app-next-button').click();
      await page.locator(`${host} .plan39-repair-token`).waitFor();
    }
    const barsAtInitial = await page.locator('.plan39-bar-track').count();
    if (barsAtInitial !== 0) throw new Error('Plan39 Repair02 pre-check bar assertion failed: bar exists before placement');
    if (view === 'visual') {
      const initialLabels = await page.locator(`${host} .plan39-stepper-move`).allTextContents();
      if (initialLabels.map((label) => label.trim()).join('|') !== '← Place leftmost|Place rightmost →') {
        throw new Error('Plan39 Repair02 initial-actionable-control assertion failed');
      }
      if (stepperEndpointCheck && index === startAt) {
        const offered = await page.locator(`${host} .plan39-candidate-point`).evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-candidate-id')));
        await page.locator(`${host} .plan39-stepper-previous`).click();
        if (await page.locator(`${host} .plan39-repair-token`).getAttribute('data-candidate-id') !== offered[0]) {
          throw new Error('Plan39 Repair02 offered-endpoint control assertion failed');
        }
        for (let position = 1; position < offered.length; position += 1) await page.locator(`${host} .plan39-stepper-next`).click();
        if (await page.locator(`${host} .plan39-repair-token`).getAttribute('data-candidate-id') !== offered.at(-1)) {
          throw new Error('Plan39 Repair02 offered-endpoint control assertion failed');
        }
      }
    }
    const scale = await readGeometry(page, view);
    if (scale.horizontalOverflow > 0.5) throw new Error(`Plan39 Repair02 responsive assertion failed: overflow ${scale.horizontalOverflow}px`);
    if (view === 'linear') {
      const expectedLabels = exactScale(record, supportProfile).positions.map(({ label }) => label);
      if (!scale.linearOptionLabelsDistinct || JSON.stringify(scale.linearOptionLabels) !== JSON.stringify(expectedLabels)) {
        throw new Error('Plan39 Repair02 exact-distinct-option assertion failed');
      }
    }

    const selected = await chooseLocation(page, { view, supportProfile, interaction, pointerKind, record });
    const token = page.locator(`${host} .plan39-repair-token`);
    const selectedId = view === 'visual'
      ? await token.getAttribute('data-candidate-id')
      : await page.locator(`${host} input[type="radio"]:checked`).getAttribute('data-candidate-id');
    if (selectedId !== selected.id) throw new Error(`Plan39 Repair02 exact-selection assertion failed: ${selectedId} !== ${selected.id}`);
    if (view === 'visual') {
      const movementLabels = await page.locator(`${host} .plan39-stepper-move`).allTextContents();
      if (movementLabels.map((label) => label.trim()).join('|') !== '← Move left|Move right →') {
        throw new Error('Plan39 Repair02 post-placement-control assertion failed');
      }
    }
    if (await page.locator('.plan39-bar-track').count() !== 0) {
      throw new Error('Plan39 Repair02 pre-check bar assertion failed: selection revealed a bar');
    }
    const check = page.locator(`${host} .plan39-check-position`);
    if (!(await check.isEnabled())) throw new Error('Plan39 Repair02 explicit-Check assertion failed: placement did not enable Check');
    const pendingLabel = await token.getAttribute('aria-label');
    const pendingGeometry = await readGeometry(page, view);
    let resizedAlignment = null;
    if (resizeCheck && index === startAt && view === 'visual') {
      const originalViewport = page.viewportSize();
      await page.setViewportSize({ width: resizeCheck.width, height: resizeCheck.height });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      resizedAlignment = await page.locator(`${host} .plan39-axis-frame`).evaluate((frame, candidateId) => {
        const point = frame.querySelector(`.plan39-candidate-point[data-candidate-id="${candidateId}"]`);
        const tokenElement = frame.closest('.plan39-representation-stack')?.querySelector('.plan39-repair-token');
        if (!point || !tokenElement) return null;
        const pointRect = point.getBoundingClientRect();
        const tokenRect = tokenElement.getBoundingClientRect();
        return { tokenCenterX: tokenRect.left + tokenRect.width / 2, pointCenterX: pointRect.left + pointRect.width / 2,
          errorPx: Math.abs((tokenRect.left + tokenRect.width / 2) - (pointRect.left + pointRect.width / 2)) };
      }, selected.id);
      if (!resizedAlignment || resizedAlignment.errorPx > 1) throw new Error(`Plan39 Repair02 resize reanchor assertion failed: ${JSON.stringify(resizedAlignment)}`);
      await page.setViewportSize(originalViewport);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    }
    if (screenshot && index === startAt) await page.screenshot({ path: path.join(rootDir, screenshot), fullPage: true });
    if (index < startAt) {
      await check.click();
      await page.locator(`${host} .plan39-finish`).waitFor();
      await page.locator(`${host} .plan39-finish`).click();
      continue;
    }

    await check.click();
    if (await page.locator(`${host} .plan39-finish`).count() !== 1
      || await page.locator(`${host} .plan39-feedback`).count() !== 0) {
      throw new Error(`Plan39 Repair02 accepted-check assertion failed for ${record.itemId}`);
    }
    if (view === 'visual') {
      const barCount = await page.locator(`${host} .plan39-bar-track`).count();
      const connectorCount = await page.locator(`${host} .plan39-connector-overlay`).count();
      if (barCount !== 1 || connectorCount !== 1) {
        throw new Error(`Plan39 Repair02 accepted-representation assertion failed for ${record.itemId}`);
      }
    } else {
      const relation = await page.locator(`${host} .plan39-resolution-description`).textContent();
      const position = exactScale(record, supportProfile).positions.find(({ id }) => id === selected.id);
      const expectedRelation = `${position.units} of ${exactScale(record, supportProfile).scale} equal steps from 0 is ${record.sourceForm.numerator}/${record.sourceForm.denominator}.`;
      if (relation !== expectedRelation) {
        throw new Error(`Plan39 Repair02 exact-result assertion failed for ${record.itemId}: ${relation}`);
      }
    }
    results.push({
      itemId: record.itemId,
      source: record.sourceForm,
      selectedId,
      pendingLabel,
      barsAtInitial,
      barsAfterCheck: await page.locator('.plan39-bar-track').count(),
      geometry: pendingGeometry,
      resizedAlignment,
    });
    await page.locator(`${host} .plan39-finish`).click();
  }
  return results;
}

export async function runPlan39Repair02BoundaryWitness(page, { seed = null } = {}) {
  const token = page.locator('.app-visual-view .plan39-repair-token');
  const frame = page.locator('.app-visual-view .plan39-axis-frame');
  const points = await frame.locator('.plan39-candidate-point').evaluateAll((elements) => elements.map((element) => ({
    id: element.getAttribute('data-candidate-id'), ratio: Number.parseFloat(element.style.left) / 100,
  })));
  const sourceToken = await token.getAttribute('aria-label');
  const idBefore = await token.getAttribute('data-candidate-id');
  const frameBox = await frame.boundingBox();
  if (!frameBox || frameBox.height < 44) throw new Error('Plan39 Repair02 drop-band assertion failed');
  if (seed === 'hidden-bar-before-check') {
    await page.evaluate(() => {
      for (const host of document.querySelectorAll('.app-visual-view, .app-linear-view')) {
        const fake = document.createElement('div');
        fake.className = 'plan39-bar-track';
        fake.hidden = true;
        host.appendChild(fake);
      }
    });
  }
  if (await page.locator('.plan39-bar-track').count() !== 0) throw new Error('Plan39 Repair02 pre-check bar assertion failed');

  if (idBefore) {
    const previousRatio = points.find(({ id }) => id === idBefore)?.ratio;
    if (previousRatio === undefined) throw new Error('Plan39 Repair02 prior-placement setup failed');
    await dragTokenToRatio(page, { view: 'visual', ratio: previousRatio, yOffset: frameBox.height + 30 });
    if (await token.getAttribute('data-candidate-id') !== idBefore) throw new Error('Plan39 Repair02 outside-drop assertion failed');
    const gesture = await beginTokenDrag(page, { view: 'visual' });
    await moveTokenDrag(page, gesture, { ratio: points[0].ratio });
    await page.keyboard.press('Escape');
    await endTokenDrag(page, gesture);
    if (await token.getAttribute('data-candidate-id') !== idBefore) throw new Error('Plan39 Repair02 cancel-restoration assertion failed');
  } else {
    await dragTokenToRatio(page, { view: 'visual', ratio: points[0].ratio, yOffset: frameBox.height + 30 });
    if (await token.getAttribute('data-candidate-id') !== null) throw new Error('Plan39 Repair02 outside-drop assertion failed');
  }

  if (seed === 'auto-check-on-placement') {
    await token.evaluate((element) => {
      element.addEventListener('pointerup', () => document.querySelector('.app-visual-view .plan39-check-position')?.click(), { once: true });
    });
  }
  const correctId = expectedCandidate(PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[0], 'high-support').id;
  const correctPoint = points.find(({ id }) => id === correctId);
  const expectedWrong = points.find(({ id }) => id !== correctId) || points[0];
  const tieRatio = (points[0].ratio + correctPoint.ratio) / 2;
  await dragTokenToRatio(page, { view: 'visual', ratio: tieRatio });
  if (await page.locator('.app-visual-view .plan39-check-position').count() !== 1
    || await page.locator('.app-visual-view .plan39-feedback').count() !== 0) {
    throw new Error('Plan39 Repair02 preview-before-check assertion failed');
  }
  if (seed === 'correctness-aware-snap') {
    await token.evaluate((element, id) => element.setAttribute('data-candidate-id', id), correctId);
  }
  const selected = await token.getAttribute('data-candidate-id');
  if (selected !== expectedWrong.id) {
    throw new Error('Plan39 Repair02 nearest-offered selection assertion failed');
  }
  const preserveId = selected;
  const cancelGesture = await beginTokenDrag(page, { view: 'visual' });
  await moveTokenDrag(page, cancelGesture, { ratio: points.at(-1).ratio });
  await page.keyboard.press('Escape');
  await endTokenDrag(page, cancelGesture);
  if (seed === 'cancel-loses-prior-placement') await token.evaluate((element) => element.removeAttribute('data-candidate-id'));
  if (await token.getAttribute('data-candidate-id') !== preserveId) throw new Error('Plan39 Repair02 cancel-restoration assertion failed');
  await dragTokenToRatio(page, { view: 'visual', ratio: points.at(-1).ratio, yOffset: frameBox.height + 30 });
  if (seed === 'outside-drop-accepted') await token.evaluate((element, id) => element.setAttribute('data-candidate-id', id), points.at(-1).id);
  if (await token.getAttribute('data-candidate-id') !== preserveId) throw new Error('Plan39 Repair02 outside-drop assertion failed');
  const help = page.locator('.app-support-controls > .app-secondary-button:not(.app-replay-button):not(.app-restart-button)');
  await help.click();
  await page.locator('.app-view-controls .app-secondary-button').click();
  const preservedRadio = page.locator(`.app-linear-view input[type="radio"][data-candidate-id="${preserveId}"]`);
  if (!(await preservedRadio.isChecked()) || await page.locator('#linear-plan39-help').count() !== 1
    || await page.locator('.plan39-bar-track').count() !== 0) {
    throw new Error('Plan39 Repair02 pending view-switch preservation assertion failed');
  }
  await page.locator('.app-view-controls .app-secondary-button').click();
  if (await token.getAttribute('data-candidate-id') !== preserveId || await page.locator('#visual-plan39-help').count() !== 1) {
    throw new Error('Plan39 Repair02 pending view-switch restoration assertion failed');
  }
  await help.click();
  await page.locator('.app-visual-view .plan39-check-position').click();
  if (await page.locator('.app-visual-view .plan39-feedback').count() !== 1
    || await page.locator('.plan39-bar-track').count() !== 0) {
    throw new Error('Plan39 Repair02 wrong-check/no-bar assertion failed');
  }
  await page.locator('.app-restart-button').click();
  if (await token.getAttribute('data-candidate-id') !== null || await page.locator('.plan39-bar-track').count() !== 0) {
    throw new Error('Plan39 Repair02 reset-boundary assertion failed');
  }
  return { sourceToken, priorPlacement: idBefore, selected, nearestPoint: expectedWrong, pointCount: points.length };
}
