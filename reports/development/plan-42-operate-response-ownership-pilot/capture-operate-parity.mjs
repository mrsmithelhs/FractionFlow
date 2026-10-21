#!/usr/bin/env node
// Fresh A/B snapshots of operation controls in both renderer views. All interaction
// uses Playwright pointer clicks/fills; no application source or route file is changed.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const reportDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(process.argv[2]);
const label = process.argv[3];
if (!repoRoot || !['baseline-a', 'production-b'].includes(label)) throw new Error('Usage: node capture-operate-parity.mjs <repo-root> <baseline-a|production-b>');
const requireAtRepo = createRequire(path.join(repoRoot, 'package.json'));
const { chromium } = requireAtRepo('playwright');
const { executeAction } = requireAtRepo('./scripts/dev/run-route-matrix.js');
const matrix = JSON.parse(fs.readFileSync(path.join(repoRoot, 'tests/routes/route-matrix.json'), 'utf8'));
const routes = new Map(matrix.routes.map((route) => [route.id, route]));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const relative = pathname.replace(/^\/FractionFlow\/?/, '') || 'index.html';
  const file = path.resolve(repoRoot, 'dist', relative);
  if (!file.startsWith(path.resolve(repoRoot, 'dist') + path.sep) && file !== path.resolve(repoRoot, 'dist', 'index.html')) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
const pause = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (buf) => requireAtRepo('node:crypto').createHash('sha256').update(buf).digest('hex');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const captures = [];
const viewports = { mobile: { width: 360, height: 740 }, desktop: { width: 1366, height: 768 } };
async function openRoute(routeId, viewport, options = {}) {
  const route = routes.get(routeId);
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: options.reducedMotion ? 'reduce' : 'no-preference', hasTouch: Boolean(options.hasTouch) });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/FractionFlow/`);
  await page.waitForSelector('.fractionflow-app');
  for (const action of route.actions) {
    if (action.method === 'screenshot') continue;
    await executeAction(page, action, routeId);
    if (await page.locator(options.inputSelector).count()) break;
  }
  await page.waitForSelector(options.inputSelector, { state: 'visible', timeout: 5000 });
  return { page, context };
}
async function capture(page, name) {
  await pause();
  const info = await page.evaluate(() => {
    const root = document.documentElement;
    const view = document.querySelector('.app-visual-view:not([hidden]), .app-linear-view:not([hidden])');
    const controls = view?.querySelector('.active-beat-controls');
    const box = (node) => { if (!node) return null; const r = node.getBoundingClientRect(); return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2), visible: getComputedStyle(node).display !== 'none' && r.width > 0 && r.height > 0 }; };
    const inputs = [...(controls?.querySelectorAll('input') || [])].map((node) => ({ id: node.id, value: node.value, focused: node === document.activeElement, box: box(node) }));
    const help = controls?.querySelector('[id$="task-help"]');
    const recovery = view?.querySelector('.recovery-feedback');
    return {
      viewport: { width: innerWidth, height: innerHeight }, dpr: devicePixelRatio,
      document: { width: root.scrollWidth, height: root.scrollHeight }, scroll: { x: scrollX, y: scrollY },
      horizontalOverflowPx: Math.max(0, root.scrollWidth - root.clientWidth), view: view?.className,
      controls: box(controls), directChildren: [...(controls?.children || [])].map((node) => ({ tag: node.tagName, id: node.id, className: node.className, box: box(node) })),
      inputs, helpVisible: Boolean(help && getComputedStyle(help).display !== 'none' && box(help)?.visible),
      recoveryText: recovery?.textContent?.trim() || null, activeTag: document.activeElement?.tagName, activeId: document.activeElement?.id || null,
      inputMode: inputs.map((item) => controls.querySelector(`#${CSS.escape(item.id)}`)?.getAttribute('inputmode') || null),
    };
  });
  const bytes = await page.screenshot();
  const out = path.join(reportDir, 'evidence', `${label}-${name}.png`);
  fs.writeFileSync(out, bytes);
  captures.push({ name, sha256: sha256(bytes), bytes: bytes.length, observation: info });
}
async function exerciseFraction(view, viewportName) {
  const { page, context } = await openRoute('ROUTE-PLAN38-RESPONSIVE-VIEWPORTS', viewports[viewportName], { inputSelector: '.app-visual-view #operate-fraction-numerator-input', hasTouch: viewportName === 'mobile' });
  await capture(page, `fraction-${view}-closed-${viewportName}`);
  await page.locator('.app-secondary-button[aria-expanded]').click();
  await capture(page, `fraction-${view}-help-${viewportName}`);
  const n = `.app-${view}-view #operate-fraction-numerator-input`;
  const d = `.app-${view}-view #operate-fraction-denominator-input`;
  await page.locator(n).fill('98'); await page.locator(d).fill('8');
  await page.locator(`.app-${view}-view .control-submit-btn`).click();
  await capture(page, `fraction-${view}-recovery-${viewportName}`);
  await page.locator('.app-view-toggle').click();
  const newView = view === 'visual' ? 'linear' : 'visual';
  await page.waitForSelector(`.app-${newView}-view:not([hidden])`);
  await capture(page, `fraction-${newView}-help-open-after-switch-${viewportName}`);
  const help = page.locator('.app-secondary-button[aria-expanded]');
  if (await help.isVisible()) {
    await help.click();
    await capture(page, `fraction-${newView}-help-closed-${viewportName}`);
    await help.click();
    await capture(page, `fraction-${newView}-help-open-${viewportName}`);
  }
  await context.close();
}
try {
  // Fresh pair-form sample at mobile width; pointer switch exercises both views.
  await exerciseFraction('visual', 'mobile');
  // Single numeric response on desktop. This task has no visible task-help cue.
  const { page, context } = await openRoute('ROUTE-PLAN34-CONSTRUCT-VISUAL-DEEP', viewports.desktop, { inputSelector: '.app-visual-view #operate-sum-input' });
  await capture(page, 'single-visual-closed-desktop');
  await page.locator('.app-view-toggle').click();
  await page.waitForSelector('.app-linear-view:not([hidden])');
  await capture(page, 'single-linear-closed-desktop');
  await page.locator('.app-linear-view #linear-operate-sum-input').fill('999');
  await page.locator('.app-linear-view .control-submit-btn').click();
  await capture(page, 'single-linear-recovery-desktop');
  await context.close();
  const receipt = { label, browser: 'Chrome via Playwright', commit: requireAtRepo('node:child_process').execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), productSource: label === 'production-b' ? 'corrected B 436e54a; main HEAD includes later report commits' : 'guarded pre-extraction baseline A d7936a7', interaction: 'registered route prefix plus Playwright pointer clicks and numeric input fills', captures };
  fs.writeFileSync(path.join(reportDir, 'evidence', `${label}-operate-parity.json`), `${JSON.stringify(receipt, null, 2)}\n`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
