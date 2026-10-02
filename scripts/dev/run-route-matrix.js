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
const validMotionModes = new Set(['standard-motion', 'reduced-motion']);
const seededPrototypeVisualDefects = Object.freeze({
  hidden: `#representation-visual .fraction-whole,
#representation-visual .gap-grid { visibility: hidden !important; }`,
  collapsed: `#representation-visual .fraction-whole,
#representation-visual .gap-grid {
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  border: 0 !important;
  overflow: hidden !important;
}
#representation-visual .bar-segment,
#representation-visual .gap-marker { display: none !important; }`,
  'erased-removal-mark': `#representation-visual .bar-segment.is-removed {
  background-color: #3976bd !important;
  background-image: none !important;
  border-color: #17457f !important;
}
#representation-visual .bar-segment.is-removed::after {
  content: none !important;
  display: none !important;
}`,
  'erased-comparison-gap-mark': `.gap-marker {
  background: white !important;
  border-color: white !important;
}`,
  'fully-clipped-representation': `#representation-visual {
  clip-path: inset(100%) !important;
}`,
});
const startingSurfaces = Object.freeze({
  'mounted-app-entry': Object.freeze({
    path: '',
    readySelector: '.fractionflow-app',
  }),
  'subtraction-takeaway-prototype': Object.freeze({
    path: 'prototypes/subtraction/index.html?mode=takeaway&fixture=0',
    readySelector: '#subtraction-prototype[data-mode="takeaway"]',
  }),
  'subtraction-comparison-prototype': Object.freeze({
    path: 'prototypes/subtraction/index.html?mode=comparison&fixture=0',
    readySelector: '#subtraction-prototype[data-mode="comparison"]',
  }),
});

function resolveStartingSurface(surfaceId) {
  return startingSurfaces[surfaceId] || null;
}

function getRouteMotionModes(route) {
  if (Array.isArray(route.motionModes)) return route.motionModes;
  return typeof route.motionMode === 'string' ? [route.motionMode] : [];
}

function expandRouteExecutions(routes) {
  return routes.flatMap((route) => getRouteMotionModes(route).map((motionMode) => ({
    route,
    motionMode,
  })));
}

function selectRoutesForRun(routes, filter) {
  if (!filter) return routes;

  const selected = new Set(routes.filter((route) => route.id.includes(filter)).map((route) => route.id));
  let changed = true;
  while (changed) {
    changed = false;
    for (const route of routes) {
      if (!selected.has(route.id) || route.negativeControl?.sameMotionMode !== true) continue;
      const targetId = route.negativeControl.targetRouteId;
      if (routes.some((candidate) => candidate.id === targetId) && !selected.has(targetId)) {
        selected.add(targetId);
        changed = true;
      }
    }
  }
  return routes.filter((route) => selected.has(route.id));
}

function routeCaptureKey(routeId, motionMode) {
  return routeId + '::' + motionMode;
}

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
    else if (!resolveStartingSurface(route.startingSurface)) {
      errors.push(`Route "${route.id}" has unknown startingSurface "${route.startingSurface}".`);
    }
    if (!route.viewport || !route.viewport.width || !route.viewport.height) {
      errors.push(`Route "${route.id}" missing explicit "viewport" geometry.`);
    }
    const hasMotionMode = typeof route.motionMode === 'string';
    const hasMotionModes = Object.hasOwn(route, 'motionModes');
    if (hasMotionMode && hasMotionModes) {
      errors.push(`Route "${route.id}" must use either "motionMode" or "motionModes", not both.`);
    } else if (!hasMotionMode && !hasMotionModes) {
      errors.push(`Route "${route.id}" missing required motion mode declaration.`);
    } else {
      const modes = getRouteMotionModes(route);
      if (modes.length === 0) {
        errors.push(`Route "${route.id}" must declare at least one motion mode.`);
      }
      if (new Set(modes).size !== modes.length) {
        errors.push(`Route "${route.id}" repeats a motion mode.`);
      }
      for (const mode of modes) {
        if (!validMotionModes.has(mode)) {
          errors.push(`Route "${route.id}" has invalid motion mode "${mode}".`);
        }
      }
    }
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

    // Known defect schema validation
    if (route.knownDefect !== undefined && route.knownDefect !== null) {
      if (typeof route.knownDefect !== 'object' || Array.isArray(route.knownDefect)) {
        errors.push(`Route "${route.id}" has invalid "knownDefect": must be an object.`);
      } else {
        if (!route.knownDefect.id || typeof route.knownDefect.id !== 'string' || !route.knownDefect.id.trim()) {
          errors.push(`Route "${route.id}" has "knownDefect" missing required non-empty "id".`);
        }
        if (!route.knownDefect.description || typeof route.knownDefect.description !== 'string' || !route.knownDefect.description.trim()) {
          errors.push(`Route "${route.id}" has "knownDefect" missing required non-empty "description".`);
        }
        if (!route.knownDefect.trackedIn || typeof route.knownDefect.trackedIn !== 'string' || !route.knownDefect.trackedIn.trim()) {
          errors.push(`Route "${route.id}" has "knownDefect" missing required non-empty "trackedIn".`);
        }
      }
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

  for (const route of matrix.routes) {
    if (!route.negativeControl) continue;
    const target = matrix.routes.find((candidate) => candidate.id === route.negativeControl.targetRouteId);
    if (!target) {
      if (route.negativeControl.sameMotionMode === true) {
        errors.push(`Route "${route.id}" negative control references missing route "${route.negativeControl.targetRouteId}".`);
      }
      continue;
    }
    if (route.negativeControl.sameMotionMode === true) {
      const targetModes = getRouteMotionModes(target);
      for (const mode of getRouteMotionModes(route)) {
        if (!targetModes.includes(mode)) {
          errors.push(`Route "${route.id}" requires negative control "${target.id}" under "${mode}", but that mode is not declared.`);
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

    case 'assertText': {
      const actual = await page.locator(action.target).first().textContent();
      if (!actual || !actual.includes(action.value)) {
        throw new Error(
          `Route "${routeId}" expected "${action.target}" to contain "${action.value}" after step ${action.step}; observed "${actual}".`,
        );
      }
      break;
    }

    case 'focus':
      await page.locator(action.target).focus();
      break;

    case 'assertFocused': {
      const target = page.locator(action.target);
      const count = await target.count();
      if (count === 0 || !await target.first().evaluate((element) => element === document.activeElement)) {
        throw new Error(`Route "${routeId}" expected "${action.target}" to have focus after step ${action.step}.`);
      }
      break;
    }

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
    case 'renderedFractionRepresentation':
      return locator.first().evaluate((root) => {
        const round = (value) => Math.round(value * 100) / 100;
        const describeGraphic = (element, pseudo = null) => {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element, pseudo);
          return {
            geometry: {
              x: round(box.x),
              y: round(box.y),
              width: round(box.width),
              height: round(box.height),
            },
            paint: {
              display: style.display,
              visibility: style.visibility,
              opacity: style.opacity,
              backgroundColor: style.backgroundColor,
              backgroundImage: style.backgroundImage,
              borderTopColor: style.borderTopColor,
              borderTopWidth: style.borderTopWidth,
              borderRightColor: style.borderRightColor,
              borderRightWidth: style.borderRightWidth,
              borderBottomColor: style.borderBottomColor,
              borderBottomWidth: style.borderBottomWidth,
              borderLeftColor: style.borderLeftColor,
              borderLeftWidth: style.borderLeftWidth,
              content: style.content,
              transform: style.transform,
            },
          };
        };

        return JSON.stringify({
          bars: [...root.querySelectorAll('.fraction-whole')].map((bar) => ({
            whole: describeGraphic(bar),
            parts: [...bar.querySelectorAll('.bar-segment')].map((part) => ({
              segment: describeGraphic(part),
              mark: describeGraphic(part, '::after'),
            })),
          })),
          gaps: [...root.querySelectorAll('.gap-grid, .gap-marker')].map((gap) => (
            describeGraphic(gap)
          )),
        });
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
      case 'notVisible': {
        const count = await locator.count();
        if (count > 0 && await locator.first().isVisible()) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" should not be visible.`);
        }
        break;
      }

      case 'visibleGeometry': {
        const minCount = assertion.minCount ?? 1;
        const minWidth = assertion.minWidth ?? 12;
        const minHeight = assertion.minHeight ?? 12;
        const backgroundImageIncludes = assertion.backgroundImageIncludes?.toLowerCase();
        const requireVisibleCenterHit = assertion.requireVisibleCenterHit === true;
        const requireContrastingBorder = assertion.borderContrastAgainstAncestor === true;
        const geometries = await locator.evaluateAll((elements, checks) => elements.map((element) => {
          const box = element.getBoundingClientRect();
          let current = element;
          let styleVisible = true;
          let combinedOpacity = 1;
          while (current instanceof Element) {
            const style = getComputedStyle(current);
            combinedOpacity *= Number(style.opacity);
            if (style.display === 'none' || style.visibility === 'hidden'
              || style.visibility === 'collapse') {
              styleVisible = false;
            }
            current = current.parentElement;
          }
          const style = getComputedStyle(element);
          const colorIsVisible = (color) => {
            if (color === 'transparent') return false;
            const rgba = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/);
            return !rgba || Number(rgba[1]) > 0;
          };
          const borderPaintVisible = [
            ['borderTopWidth', 'borderTopColor'],
            ['borderRightWidth', 'borderRightColor'],
            ['borderBottomWidth', 'borderBottomColor'],
            ['borderLeftWidth', 'borderLeftColor'],
          ].some(([width, color]) => (
            Number.parseFloat(style[width]) > 0 && colorIsVisible(style[color])
          ));
          const paintVisible = (style.backgroundImage !== 'none'
            && style.backgroundImage !== '')
            || colorIsVisible(style.backgroundColor)
            || borderPaintVisible;
          let centerHitWithinElement = true;
          if (checks.requireVisibleCenterHit) {
            let hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
            centerHitWithinElement = false;
            while (hit instanceof Element) {
              if (hit === element) {
                centerHitWithinElement = true;
                break;
              }
              hit = hit.parentElement;
            }
          }

          let hasContrastingBorder = true;
          if (checks.requireContrastingBorder) {
            const readColor = (color) => {
              const channels = color.match(/[\d.]+/g)?.map(Number);
              if (!channels || channels.length < 3) return null;
              const alpha = channels.length > 3 ? channels[3] : 1;
              return alpha <= 0 ? null : channels.slice(0, 3);
            };
            let backdrop = null;
            current = element.parentElement;
            while (current instanceof Element && !backdrop) {
              backdrop = readColor(getComputedStyle(current).backgroundColor);
              current = current.parentElement;
            }
            const luminance = ([red, green, blue]) => {
              const linear = (channel) => {
                const normalized = channel / 255;
                return normalized <= 0.04045
                  ? normalized / 12.92
                  : ((normalized + 0.055) / 1.055) ** 2.4;
              };
              return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
            };
            const contrastRatio = (first, second) => {
              const levels = [luminance(first), luminance(second)].sort((a, b) => b - a);
              return (levels[0] + 0.05) / (levels[1] + 0.05);
            };
            const borderColors = [
              ['borderTopWidth', 'borderTopColor'],
              ['borderRightWidth', 'borderRightColor'],
              ['borderBottomWidth', 'borderBottomColor'],
              ['borderLeftWidth', 'borderLeftColor'],
            ].filter(([width]) => Number.parseFloat(style[width]) > 0)
              .map(([, color]) => readColor(style[color]))
              .filter(Boolean);
            hasContrastingBorder = Boolean(backdrop)
              && borderColors.some((borderColor) => contrastRatio(borderColor, backdrop) >= 3);
          }
          return {
            width: box.width,
            height: box.height,
            visible: styleVisible && combinedOpacity >= 0.1
              && element.getClientRects().length > 0 && box.width > 0 && box.height > 0,
            paintVisible,
            backgroundImage: style.backgroundImage,
            centerHitWithinElement,
            hasContrastingBorder,
          };
        }), { requireVisibleCenterHit, requireContrastingBorder });
        const undersized = geometries.filter((geometry) => (
          !geometry.visible || !geometry.paintVisible
            || geometry.width < minWidth || geometry.height < minHeight
            || (backgroundImageIncludes
              && !geometry.backgroundImage.toLowerCase().includes(backgroundImageIncludes))
            || (requireVisibleCenterHit && !geometry.centerHitWithinElement)
            || (requireContrastingBorder && !geometry.hasContrastingBorder)
        ));
        if (geometries.length < minCount || undersized.length > 0) {
          throw new Error(
            `Route "${routeId}" visible geometry assertion failed for "${target}": `
            + `found ${geometries.length}, expected at least ${minCount} visible items `
            + `of ${minWidth}x${minHeight}px${backgroundImageIncludes
              ? ` with background image containing "${backgroundImageIncludes}"`
              : ''}${requireVisibleCenterHit ? ' with a visible center hit' : ''}`
            + `${requireContrastingBorder ? ' with a contrasting border against its ancestor background' : ''}`
            + `; ${undersized.length} were hidden, clipped, unpainted, undersized, or missing required paint.`,
          );
        }
        break;
      }

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
  const {
    filter,
    verbose = false,
    preferredChannel,
    seededVisualDefect = null,
  } = options;

  if (seededVisualDefect !== null && !Object.hasOwn(seededPrototypeVisualDefects, seededVisualDefect)) {
    throw new Error(`Unknown seeded prototype visual defect "${seededVisualDefect}".`);
  }

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

  const routesToRun = selectRoutesForRun(matrix.routes, filter);
  const routeExecutions = expandRouteExecutions(routesToRun);

  if (verbose) {
    console.log(`Executing ${routeExecutions.length} browser witnesses from ${routesToRun.length} route rows using browser channel: ${browserChannel || 'default chromium'}...`);
  }

  try {
    for (const execution of routeExecutions) {
      const { route, motionMode } = execution;
      const resultId = route.id + ' [' + motionMode + ']';
      const startTime = Date.now();
      const contextOptions = {
        viewport: route.viewport,
        reducedMotion: motionMode === 'reduced-motion' ? 'reduce' : 'no-preference',
      };

      const context = await browser.newContext(contextOptions);
      const page = await context.newPage();
      page.setDefaultTimeout(5000);

      try {
        const startingSurface = resolveStartingSurface(route.startingSurface);
        const startUrl = new URL(startingSurface.path, baseUrl).toString();
        await page.goto(startUrl);
        await page.waitForSelector(startingSurface.readySelector);
        if (seededVisualDefect && route.configuration === 'plan15-subtraction-prototype') {
          await page.addStyleTag({ content: seededPrototypeVisualDefects[seededVisualDefect] });
        }

        // Execute action sequence
        for (const action of route.actions) {
          await executeAction(page, action, route.id);
        }

        // Capture output for negative control / sameness check
        const capturedVal = await captureOutput(page, route.expect.capture);
        captures.set(routeCaptureKey(route.id, motionMode), capturedVal);
        captures.set(route.id, capturedVal);

        // Verify assertions
        await verifyAssertions(page, route.expect.assertions, route.id);

        const duration = Date.now() - startTime;
        if (route.knownDefect) {
          routeResults.push({ id: resultId, routeId: route.id, motionMode, status: 'known-defect', duration, route });
          if (verbose) {
            console.log(`  ⚠ ${resultId} (${duration}ms) [KNOWN DEFECT: ${route.knownDefect.id} - ${route.knownDefect.description}]`);
          }
        } else {
          routeResults.push({ id: resultId, routeId: route.id, motionMode, status: 'pass', duration, route });
          if (verbose) {
            console.log(`  ✓ ${resultId} (${duration}ms)`);
          }
        }
      } catch (err) {
        const duration = Date.now() - startTime;
        if (route.knownDefect) {
          const cleanMsg = err.message.endsWith('.') ? err.message : `${err.message}.`;
          const defectErrMsg = `FATAL: Route "${route.id}" is marked with knownDefect "${route.knownDefect.id}", but stopped exhibiting the defect: ${cleanMsg} If this defect has been repaired, retire the "knownDefect" marker and invert the expectation assertion.`;
          routeResults.push({ id: resultId, routeId: route.id, motionMode, status: 'fail', error: defectErrMsg, duration, route });
          console.error(`  ✗ ${resultId} (${duration}ms): ${defectErrMsg}`);
        } else {
          routeResults.push({ id: resultId, routeId: route.id, motionMode, status: 'fail', error: err.message, duration, route });
          console.error(`  ✗ ${resultId} (${duration}ms): ${err.message}`);
        }
      } finally {
        await context.close();
      }
    }

    // Now enforce Rule 2 (Negative Controls) and Condition B (Declared Sameness)
    for (const res of routeResults) {
      if (res.status !== 'pass' && res.status !== 'known-defect') continue;
      const { route } = res;

      // Condition B: Declared Sameness Verification
      if (route.declaredSameAs) {
        const targetId = route.declaredSameAs.targetRouteId;
        const targetCapture = captures.get(targetId);
        const myCapture = captures.get(routeCaptureKey(res.routeId, res.motionMode));

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
        const sameMotionMode = route.negativeControl.sameMotionMode === true;
        const targetCapture = sameMotionMode
          ? captures.get(routeCaptureKey(targetId, res.motionMode))
          : captures.get(targetId);
        const myCapture = captures.get(routeCaptureKey(res.routeId, res.motionMode));

        if (sameMotionMode && targetCapture === undefined) {
          res.status = 'fail';
          res.error = `FATAL (Rule 2): Route "${route.id}" lacks a captured negative control "${targetId}" under "${res.motionMode}".`;
          console.error(`  ✗ ${res.id}: ${res.error}`);
        } else if (targetCapture !== undefined && myCapture !== undefined && myCapture === targetCapture) {
          res.status = 'fail';
          res.error = `FATAL (Rule 2): Route "${route.id}" produced output identical to negative control "${targetId}" under "${res.motionMode}".`;
          console.error(`  ✗ ${res.id}: ${res.error}`);
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const passed = routeResults.filter((r) => r.status === 'pass').length;
  const knownDefects = routeResults.filter((r) => r.status === 'known-defect').length;
  const failed = routeResults.filter((r) => r.status === 'fail').length;

  return {
    total: routeResults.length,
    routeCount: routesToRun.length,
    passed,
    knownDefects,
    failed,
    results: routeResults,
  };
}

module.exports = {
  createStaticServer,
  expandRouteExecutions,
  getRouteMotionModes,
  resolveStartingSurface,
  runRouteMatrix,
  selectRoutesForRun,
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
      const parts = [`${summary.passed} passed`];
      if (summary.knownDefects > 0) {
        parts.push(`${summary.knownDefects} known defect${summary.knownDefects === 1 ? '' : 's'}`);
      }
      parts.push(`${summary.failed} failed`);
      console.log(`\nRoute Matrix Run Complete: ${parts.join(', ')} (${summary.routeCount} route rows; ${summary.total} browser executions).`);
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
