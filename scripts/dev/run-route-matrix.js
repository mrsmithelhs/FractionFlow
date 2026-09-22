#!/usr/bin/env node
'use strict';

/**
 * FractionFlow — Reachable Behavior Route Contract & Browser Route Matrix Runner
 *
 * Executes the declarative route matrix (tests/routes/route-matrix.json) against the
 * production-built static application in a real browser using Playwright.
 *
 * Enforces the Three Non-Negotiable Rules and Conditions A-D:
 * 1. Registered Configuration Completeness: fails if any registered condition has no row.
 * 2. Negative Control Diversity: fails if output is identical to negative control.
 * 3. Non-execution & Narrative Rejection: fails on skipped rows or unexecutable witnesses.
 * Condition A: Dispatch-fallback loophole closed; verified fast-forward witnesses & zero-dispatch paths.
 * Condition B: Declared sameness expressible & verified.
 * Condition C: Both premise routes (twelfths & twenty-fourths, both answers).
 * Condition D: Maintained browser driver (Playwright against dist/).
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const rootDir = path.resolve(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');
const matrixPath = path.join(rootDir, 'tests/routes/route-matrix.json');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].replace(/^\/FractionFlow/, '');
    if (!reqPath || reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(distDir, reqPath);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Not found: ${reqPath}`);
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

/**
 * Validate schema and static invariants before running browser tests.
 */
async function validateMatrixIntegrity(matrix, registeredConditions) {
  const errors = [];

  if (!matrix || !Array.isArray(matrix.routes) || matrix.routes.length === 0) {
    errors.push('Route matrix must contain a non-empty "routes" array.');
    return { valid: false, errors };
  }

  const routeIds = new Set();
  const configurationsCovered = new Set();

  for (const route of matrix.routes) {
    if (!route.id) errors.push('Route missing required "id".');
    if (routeIds.has(route.id)) errors.push(`Duplicate route id: "${route.id}".`);
    routeIds.add(route.id);

    if (!route.behavior) errors.push(`Route "${route.id}" missing required "behavior".`);
    if (!route.configuration) errors.push(`Route "${route.id}" missing required "configuration".`);
    configurationsCovered.add(route.configuration);

    if (!route.startingSurface) errors.push(`Route "${route.id}" missing required "startingSurface".`);
    if (!route.viewport || !route.viewport.width || !route.viewport.height) {
      errors.push(`Route "${route.id}" missing explicit "viewport" geometry.`);
    }
    if (!route.motionMode) errors.push(`Route "${route.id}" missing required "motionMode".`);
    if (!['browser', 'harness'].includes(route.witness)) {
      errors.push(`Route "${route.id}" has invalid witness "${route.witness}".`);
    }

    // Rule 3: No skipped rows, no unexecutable narrative witnesses
    if (route.skipped || route.notRun) {
      errors.push(`FATAL (Rule 3): Route "${route.id}" is marked skipped/notRun.`);
    }
    if (!Array.isArray(route.actions) || route.actions.length === 0) {
      errors.push(`FATAL (Rule 3): Route "${route.id}" lacks concrete actions.`);
    }
    if (!route.expect || !route.expect.assertions || route.expect.assertions.length === 0) {
      errors.push(`FATAL (Rule 3): Route "${route.id}" lacks executable expect assertions.`);
    }

    // Condition A: Dispatch-fallback enforcement
    for (const action of route.actions || []) {
      if (action.method === 'dispatch-fallback') {
        if (!action.reason) {
          errors.push(`FATAL (Condition A): Route "${route.id}" step ${action.step} has dispatch-fallback without a "reason".`);
        } else if (action.reason === 'fast-forward') {
          if (!action.witnessRouteId) {
            errors.push(`FATAL (Condition A): Route "${route.id}" step ${action.step} fast-forward must specify "witnessRouteId".`);
          }
        }
      }
    }
  }

  // Cross-reference dispatch-fallback witness routes
  for (const route of matrix.routes) {
    for (const action of route.actions || []) {
      if (action.method === 'dispatch-fallback' && action.reason === 'fast-forward') {
        const witness = matrix.routes.find((r) => r.id === action.witnessRouteId);
        if (!witness) {
          errors.push(`FATAL (Condition A): Route "${route.id}" references non-existent witnessRouteId "${action.witnessRouteId}".`);
        } else {
          const hasDispatch = witness.actions.some((a) => a.method === 'dispatch-fallback');
          if (hasDispatch) {
            errors.push(`FATAL (Condition A): Witness route "${action.witnessRouteId}" referenced by "${route.id}" itself contains dispatch-fallback.`);
          }
        }
      }
    }
  }

  // Condition A: Verify at least one visual and one linear zero-dispatch traversal to resolve
  const zeroDispatchVisual = matrix.routes.find((r) => (
    r.id === 'ROUTE-TRAVERSAL-VISUAL-NO-DISPATCH' &&
    r.actions.every((a) => a.method !== 'dispatch-fallback')
  ));
  if (!zeroDispatchVisual) {
    errors.push('FATAL (Condition A): Missing visual full-traversal route with zero dispatch fallback.');
  }

  const zeroDispatchLinear = matrix.routes.find((r) => (
    r.id === 'ROUTE-TRAVERSAL-LINEAR-NO-DISPATCH' &&
    r.actions.every((a) => a.method !== 'dispatch-fallback')
  ));
  if (!zeroDispatchLinear) {
    errors.push('FATAL (Condition A): Missing linear full-traversal route with zero dispatch fallback.');
  }

  // Rule 1: Every registered configuration must have at least one route witness
  if (registeredConditions && Array.isArray(registeredConditions)) {
    for (const condition of registeredConditions) {
      if (!configurationsCovered.has(condition.id)) {
        errors.push(`FATAL (Rule 1): Registered configuration "${condition.id}" has no declared route witness in the matrix.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Execute a single action against Playwright page.
 */
async function executeAction(page, action, routeId) {
  switch (action.method) {
    case 'click':
      await page.locator(action.target).click();
      break;

    case 'fill':
      await page.locator(action.target).fill(String(action.value));
      break;

    case 'pressKey':
      await page.locator(action.target).press(action.value);
      break;

    case 'focus':
      await page.locator(action.target).focus();
      break;

    case 'dispatch-fallback':
      throw new Error(
        `dispatch-fallback in route "${routeId}" requires a mounted app dispatch seam which is not allowed in production static bundle.`
      );

    default:
      throw new Error(`Unknown action method: "${action.method}" in route "${routeId}".`);
  }
}

/**
 * Capture output representation for negative control / declared same comparisons.
 */
async function captureOutput(page, captureDef) {
  if (!captureDef) return '';
  const { target, type } = captureDef;

  if (target === 'activeElement') {
    return page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return 'none';
      const tag = el.tagName.toLowerCase();
      const cls = el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
      return `${tag}${cls}`;
    });
  }

  const locator = page.locator(target);
  const count = await locator.count();
  if (count === 0) return '__NOT_FOUND__';

  switch (type) {
    case 'innerHTML':
      return locator.first().innerHTML();
    case 'outerHTML':
      return locator.first().evaluate((el) => el.outerHTML);
    case 'textContent':
      return locator.first().textContent();
    case 'attribute':
      return locator.first().getAttribute(captureDef.attribute || '');
    case 'inputValue':
      return locator.first().inputValue();
    case 'activeElementSelector':
      return page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return 'none';
        const tag = el.tagName.toLowerCase();
        const cls = el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
        return `${tag}${cls}`;
      });
    default:
      return locator.first().innerHTML();
  }
}

/**
 * Verify assertions on page.
 */
async function verifyAssertions(page, assertions, routeId) {
  for (const assertion of assertions) {
    const { type, target, value, attribute } = assertion;

    if (type === 'activeElementEquals') {
      const activeDesc = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return '';
        const tag = el.tagName.toLowerCase();
        const cls = el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
        return `${tag}${cls}`;
      });
      if (!activeDesc.includes(value)) {
        throw new Error(
          `Route "${routeId}" activeElement assertion failed: expected "${value}", observed "${activeDesc}".`
        );
      }
      continue;
    }

    const locator = page.locator(target);

    switch (type) {
      case 'hasSelector': {
        const count = await locator.count();
        if (count === 0) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" not found.`);
        }
        break;
      }

      case 'notHasSelector': {
        const count = await locator.count();
        if (count > 0) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" should not exist, but found ${count}.`);
        }
        break;
      }

      case 'containsText': {
        const text = await locator.first().textContent();
        if (!text || !text.includes(value)) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" does not contain text "${value}". Observed: "${text}".`);
        }
        break;
      }

      case 'notContainsText': {
        const text = await locator.first().textContent();
        if (text && text.includes(value)) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" unexpectedly contains text "${value}".`);
        }
        break;
      }

      case 'attributeEquals': {
        const attrVal = await locator.first().getAttribute(attribute);
        if (attrVal !== value) {
          throw new Error(`Route "${routeId}" assertion failed: attribute "${attribute}" on "${target}" was "${attrVal}", expected "${value}".`);
        }
        break;
      }

      case 'inputValueEquals': {
        const inputVal = await locator.first().inputValue();
        if (inputVal !== value) {
          throw new Error(`Route "${routeId}" assertion failed: input value on "${target}" was "${inputVal}", expected "${value}".`);
        }
        break;
      }

      default:
        throw new Error(`Unknown assertion type: "${type}" in route "${routeId}".`);
    }
  }
}

/**
 * Run the full route matrix suite.
 */
async function runRouteMatrix(options = {}) {
  const { filter, verbose = false, preferredChannel } = options;

  if (!fs.existsSync(distDir)) {
    throw new Error('Built distribution (dist/) not found. Run `npm run build` before running route matrix.');
  }

  // Load matrix and registered conditions
  const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  const conditionsUrl = pathToFileURL(path.join(rootDir, 'src/app/conditions.js')).href;
  const conditionsModule = await import(conditionsUrl);
  const registeredConditions = conditionsModule.REGISTERED_CONDITIONS;

  // Static integrity check
  const integrity = await validateMatrixIntegrity(matrix, registeredConditions);
  if (!integrity.valid) {
    for (const err of integrity.errors) {
      console.error(err);
    }
    throw new Error(`Route matrix integrity validation failed with ${integrity.errors.length} error(s).`);
  }

  // Start local server
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/FractionFlow/`;

  // Select browser channel
  let browserChannel = preferredChannel;
  if (!browserChannel) {
    const isWindows = process.platform === 'win32';
    if (isWindows && fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) {
      browserChannel = 'msedge';
    } else if (isWindows && fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')) {
      browserChannel = 'chrome';
    }
  }

  const browserLaunchOptions = { headless: true };
  if (browserChannel) {
    browserLaunchOptions.channel = browserChannel;
  }

  const browser = await chromium.launch(browserLaunchOptions);
  const routeResults = [];
  const captures = new Map();

  // Baseline capture for initial state
  try {
    const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const page = await context.newPage();
    await page.goto(baseUrl);
    await page.waitForSelector('.fractionflow-app');
    const initHtml = await page.locator('.app-visual-view').innerHTML();
    captures.set('INITIAL-ENCOUNTER-BASELINE', initHtml);
    captures.set('BODY-FOCUS-NEGATIVE-CONTROL', 'body');
    captures.set('INSPECTION-ACTIVE-FOCUS-BASELINE', 'button.fraction-control.app-done-looking-button');
    await context.close();
  } catch (err) {
    await browser.close();
    server.close();
    throw new Error(`Failed to capture initial baseline: ${err.message}`);
  }

  const routesToRun = filter
    ? matrix.routes.filter((r) => r.id.includes(filter))
    : matrix.routes;

  if (verbose) {
    console.log(`Executing ${routesToRun.length} route witnesses using browser channel: ${browserChannel || 'default chromium'}...`);
  }

  try {
    for (const route of routesToRun) {
      const startTime = Date.now();
      const contextOptions = {
        viewport: route.viewport,
        reducedMotion: route.motionMode === 'reduced-motion' ? 'reduce' : 'no-preference',
      };

      const context = await browser.newContext(contextOptions);
      const page = await context.newPage();
      page.setDefaultTimeout(5000);

      try {
        await page.goto(baseUrl);
        await page.waitForSelector('.fractionflow-app');

        // Execute action sequence
        for (const action of route.actions) {
          await executeAction(page, action, route.id);
        }

        // Capture output for negative control / sameness check
        const capturedVal = await captureOutput(page, route.expect.capture);
        captures.set(route.id, capturedVal);

        // Verify assertions
        await verifyAssertions(page, route.expect.assertions, route.id);

        const duration = Date.now() - startTime;
        routeResults.push({ id: route.id, status: 'pass', duration, route });

        if (verbose) {
          console.log(`  ✓ ${route.id} (${duration}ms)`);
        }
      } catch (err) {
        const duration = Date.now() - startTime;
        routeResults.push({ id: route.id, status: 'fail', error: err.message, duration, route });
        console.error(`  ✗ ${route.id} (${duration}ms): ${err.message}`);
      } finally {
        await context.close();
      }
    }

    // Now enforce Rule 2 (Negative Controls) and Condition B (Declared Sameness)
    for (const res of routeResults) {
      if (res.status !== 'pass') continue;
      const { route } = res;

      // Condition B: Declared Sameness Verification
      if (route.declaredSameAs) {
        const targetId = route.declaredSameAs.targetRouteId;
        const targetCapture = captures.get(targetId);
        const myCapture = captures.get(route.id);

        if (!targetCapture) {
          res.status = 'fail';
          res.error = `FATAL (Condition B): Route "${route.id}" declared same as "${targetId}", but target capture was missing.`;
          console.error(`  ✗ ${route.id}: ${res.error}`);
        } else if (myCapture !== targetCapture) {
          res.status = 'fail';
          res.error = `FATAL (Condition B): Route "${route.id}" was declared same as "${targetId}", but output was NOT identical.`;
          console.error(`  ✗ ${route.id}: ${res.error}`);
        }
      }

      // Rule 2: Negative Control Diversity Verification
      if (route.negativeControl) {
        const targetId = route.negativeControl.targetRouteId;
        const targetCapture = captures.get(targetId);
        const myCapture = captures.get(route.id);

        if (targetCapture !== undefined && myCapture !== undefined && myCapture === targetCapture) {
          res.status = 'fail';
          res.error = `FATAL (Rule 2): Route "${route.id}" produced output identical to negative control "${targetId}".`;
          console.error(`  ✗ ${route.id}: ${res.error}`);
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const passed = routeResults.filter((r) => r.status === 'pass').length;
  const failed = routeResults.filter((r) => r.status === 'fail').length;

  return {
    total: routeResults.length,
    passed,
    failed,
    results: routeResults,
  };
}

module.exports = {
  runRouteMatrix,
  validateMatrixIntegrity,
};

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  let filter = null;
  let verbose = true;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--filter' && args[i + 1]) {
      filter = args[++i];
    } else if (args[i] === '--quiet') {
      verbose = false;
    }
  }

  console.log('--- FractionFlow Reachable Behavior Route Contract Runner ---');
  runRouteMatrix({ filter, verbose })
    .then((summary) => {
      console.log(`\nRoute Matrix Run Complete: ${summary.passed}/${summary.total} passed (${summary.failed} failed).`);
      if (summary.failed > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error('\nFatal Execution Error:\n', err.message);
      process.exit(1);
    });
}
