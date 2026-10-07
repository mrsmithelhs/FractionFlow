const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('playwright');
const { createStaticServer } = require('./run-route-matrix.js');

const root = path.resolve(__dirname, '../..');
const sourcePath = path.join(root, 'src/interaction/episode.js');
const reportDir = path.join(root, 'reports/development/plan-22-denominator-path-closure-repair');
const evidenceDir = path.join(reportDir, 'evidence');
const diagnosticsPath = path.join(evidenceDir, 'guard-seed-and-rendered-measurements.json');
const guard = 'if (state.episodeDefinition.revision === EPISODE_DEFINITION_REVISION) {';
const bypass = 'if (false /* Plan 22 sensitivity seed: admission guard disabled */) {';
const routes = [
  {
    id: 'ROUTE-PLAN22-36-MATCHING-VISUAL',
    expectedFailure: "waiting for locator('.app-visual-view .recovery-feedback')",
  },
  {
    id: 'ROUTE-PLAN22-36-PREMISE-LINEAR-REDUCED',
    expectedFailure: "waiting for locator('.app-linear-view .recovery-feedback')",
  },
];

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function run(args, label) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: 'utf8',
    timeout: 180_000,
    maxBuffer: 8 * 1024 * 1024,
    windowsHide: true,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  if (result.error) throw new Error(`${label} could not run: ${result.error.message}\n${output}`);
  return { exitCode: result.status, output };
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

async function readPageEvidence(page, viewSelector, inputSelector) {
  return page.evaluate(({ viewSelector, inputSelector }) => {
    const view = document.querySelector(viewSelector);
    const feedback = view?.querySelector('.recovery-feedback');
    const input = view?.querySelector(inputSelector);
    const submit = view?.querySelector('.control-submit-btn');
    const activeBeat = view?.querySelector('.active-beat');
    const rect = (element) => {
      if (!element) return null;
      const value = element.getBoundingClientRect();
      return {
        x: value.x,
        y: value.y,
        top: value.top,
        right: value.right,
        bottom: value.bottom,
        left: value.left,
        width: value.width,
        height: value.height,
        documentX: value.x + window.scrollX,
        documentY: value.y + window.scrollY,
        viewportIntersection: {
          left: Math.max(0, value.left),
          top: Math.max(0, value.top),
          right: Math.max(0, Math.min(innerWidth, value.right)),
          bottom: Math.max(0, Math.min(innerHeight, value.bottom)),
        },
      };
    };
    const active = document.activeElement;
    const activeDescription = active
      ? `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ''}${active.className && typeof active.className === 'string' ? `.${active.className.trim().split(/\s+/).join('.')}` : ''}`
      : null;
    return {
      viewport: { width: innerWidth, height: innerHeight },
      document: {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        verticallyScrollable: document.documentElement.scrollHeight > document.documentElement.clientHeight,
      },
      conditionId: document.querySelector('.fractionflow-app')?.getAttribute('data-condition-id'),
      supportCode: document.querySelector('.fractionflow-app')?.getAttribute('data-support-code'),
      activeElement: activeDescription,
      feedback: feedback?.textContent ?? null,
      feedbackRole: feedback?.getAttribute('role') ?? null,
      feedbackBounds: rect(feedback),
      inputValue: input?.value ?? null,
      inputBounds: rect(input),
      submitBounds: rect(submit),
      activeBeatBounds: rect(activeBeat),
      transformInputPresent: !!view?.querySelector('#transform-num-input-left'),
      viewHidden: view?.hasAttribute('hidden') ?? null,
    };
  }, { viewSelector, inputSelector });
}

async function startMediumPractice(page, serverUrl, { conditionId = null } = {}) {
  await page.goto(serverUrl, { waitUntil: 'networkidle' });
  await page.locator('.app-gear-button').tap();
  if (conditionId) {
    await page.locator(`[data-condition-id="${conditionId}"]`).tap();
    await page.locator('.app-gear-button').tap();
  }
  await page.locator('[data-support-id="medium-support"]').tap();
  await page.locator('.app-practice-button').tap();
  await page.locator('.app-visual-view .control-btn').tap();
  await page.locator('.app-visual-view .control-choice-btn:has-text("No, different sizes")').tap();
}

async function captureScenario(browser, serverUrl, { id, conditionId = null, linear = false, reducedMotion = false }) {
  const context = await browser.newContext({
    viewport: { width: 320, height: 740 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  await startMediumPractice(page, serverUrl, { conditionId });

  const visualInput = page.locator('.app-visual-view #decide-common-denominator-input');
  await visualInput.fill('36');
  await page.locator('.app-visual-view .control-submit-btn').tap();

  let viewSelector = '.app-visual-view';
  let inputSelector = '#decide-common-denominator-input';
  if (linear) {
    await page.locator('.app-view-toggle').tap();
    viewSelector = '.app-linear-view';
    inputSelector = '#linear-decide-common-denominator-input';
  }

  await page.locator(`${viewSelector} .recovery-feedback`).waitFor({ state: 'visible' });
  const boundary = await readPageEvidence(page, viewSelector, inputSelector);
  const boundaryPng = path.join(evidenceDir, `${id}-36-boundary.png`);
  await page.screenshot({ path: boundaryPng, fullPage: false });

  const input = page.locator(`${viewSelector} ${inputSelector}`);
  await input.fill('12');
  await page.locator(`${viewSelector} .control-submit-btn`).tap();
  await page.locator(`${viewSelector} .active-beat-prompt`).filter({ hasText: 'Rename the first fraction with 12 equal parts.' }).waitFor({ state: 'visible' });
  const recovery = await readPageEvidence(page, viewSelector, inputSelector);
  recovery.activeBeatPrompt = await page.locator(`${viewSelector} .active-beat-prompt`).textContent();
  const recoveryPng = path.join(evidenceDir, `${id}-12-recovery.png`);
  await page.screenshot({ path: recoveryPng, fullPage: false });

  await context.close();
  return {
    id,
    motionPreference: reducedMotion ? 'reduced-motion' : 'standard-motion',
    conditionId: conditionId ?? 'phase2-bundle-1',
    support: 'medium-support',
    viewport: '320x740 CSS px, touch emulation',
    view: linear ? 'linear' : 'visual',
    boundary: { screenshot: path.relative(root, boundaryPng), ...boundary },
    recoveryTo12: { screenshot: path.relative(root, recoveryPng), ...recovery },
  };
}

async function captureScreenshots() {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const serverUrl = `http://127.0.0.1:${address.port}/FractionFlow/`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const matching = await captureScenario(browser, serverUrl, {
      id: 'matching-visual-standard-320',
    });
    const premise = await captureScenario(browser, serverUrl, {
      id: 'premise-linear-reduced-320',
      conditionId: 'phase2-bundle-4',
      linear: true,
      reducedMotion: true,
    });
    return { browser: 'Microsoft Edge via Playwright', scenarios: [matching, premise] };
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

async function main() {
  fs.mkdirSync(evidenceDir, { recursive: true });
  const original = fs.readFileSync(sourcePath, 'utf8');
  ensure(original.split(guard).length === 2, 'Expected exactly one revision-2 admission guard; source was not mutated.');
  const beforeHash = sha256(original);
  const result = {
    createdAt: new Date().toISOString(),
    source: path.relative(root, sourcePath),
    originalSourceSha256: beforeHash,
    mutation: 'Temporarily changed the fresh revision-2 admission condition to false, rebuilt dist, and ran only the matching and premise Plan 22 browser routes.',
    guardSeed: [],
    restoration: null,
    cleanRoutes: [],
    renderedScenarios: [],
  };
  let restored = false;
  let failure = null;

  try {
    fs.writeFileSync(sourcePath, original.replace(guard, bypass), 'utf8');
    const seededBuild = run(['scripts/dev/build.mjs'], 'seeded build');
    ensure(seededBuild.exitCode === 0, `Seeded build failed:\n${seededBuild.output}`);

    for (const route of routes) {
      const seeded = run(['scripts/dev/run-route-matrix.js', '--filter', route.id], `${route.id} seeded browser route`);
      const routeFailure = seeded.output.split(/\r?\n/).find((line) => line.includes(`✗ ${route.id} `));
      ensure(seeded.exitCode === 1, `${route.id} seed did not produce exactly the expected failing process status (got ${seeded.exitCode}).\n${seeded.output}`);
      ensure(routeFailure && seeded.output.includes(route.expectedFailure), `${route.id} did not fail while its intended recovery-copy assertion waited for the missing boundary feedback.\n${seeded.output}`);
      const summary = seeded.output.split(/\r?\n/).find((line) => line.includes('Route Matrix Run Complete:')) ?? null;
      ensure(summary?.includes('1 failed'), `${route.id} did not isolate exactly one seeded route failure.\n${seeded.output}`);
      result.guardSeed.push({
        routeId: route.id,
        expectedExitCode: 1,
        failureAtExpectedRecoveryAssertion: routeFailure.trim(),
        expectedAssertionCallLog: route.expectedFailure,
        summary: summary.trim(),
      });
    }
  } catch (error) {
    failure = error;
  } finally {
    fs.writeFileSync(sourcePath, original, 'utf8');
    const restoredContent = fs.readFileSync(sourcePath, 'utf8');
    restored = restoredContent === original && sha256(restoredContent) === beforeHash;
    result.restoration = { byteForByteRestored: restored, restoredSourceSha256: sha256(restoredContent) };
  }

  ensure(restored, `Admission guard source was not restored byte-for-byte. Original hash ${beforeHash}.`);
  const cleanBuild = run(['scripts/dev/build.mjs'], 'clean restoration build');
  ensure(cleanBuild.exitCode === 0, `Clean restoration build failed:\n${cleanBuild.output}`);
  for (const route of routes) {
    const clean = run(['scripts/dev/run-route-matrix.js', '--filter', route.id], `${route.id} clean browser route`);
    const summary = clean.output.split(/\r?\n/).find((line) => line.includes('Route Matrix Run Complete:')) ?? null;
    ensure(clean.exitCode === 0 && summary?.includes('0 failed'), `${route.id} did not pass cleanly after restoration.\n${clean.output}`);
    result.cleanRoutes.push({ routeId: route.id, exitCode: clean.exitCode, summary: summary.trim() });
  }
  if (failure) throw failure;

  result.renderedScenarios = (await captureScreenshots()).scenarios;
  fs.writeFileSync(diagnosticsPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ diagnostics: path.relative(root, diagnosticsPath), guardSeed: result.guardSeed, cleanRoutes: result.cleanRoutes, screenshots: result.renderedScenarios.map((scenario) => [scenario.boundary.screenshot, scenario.recoveryTo12.screenshot]) }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
