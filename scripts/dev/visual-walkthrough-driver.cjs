// Bounded screenshot/input pilot. The model-facing handle never exposes Page/DOM.
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');

async function createVisualWalkthrough({
  url, outputDir, executablePath, mode = 'mouse',
  viewport = { width: 1093, height: 614 },
  maxActions = 24, maxCaptures = 28, startAtBlank = false,
} = {}) {
  const target = new URL(url);
  if (target.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(target.hostname)) {
    throw new Error('Pilot accepts only the supplied local HTTP site');
  }
  if (!['mouse', 'keyboard', 'touch'].includes(mode) || !outputDir) throw new Error('Invalid pilot options');
  if (![viewport.width, viewport.height, maxActions, maxCaptures].every(Number.isInteger)
    || viewport.width < 320 || viewport.height < 240 || maxActions < 1 || maxActions > 30
    || maxCaptures < 1 || maxCaptures > 34) throw new Error('Invalid pilot bounds');
  const directory = path.resolve(outputDir);
  await fs.mkdir(directory, { recursive: true });
  if ((await fs.readdir(directory)).length) throw new Error('Use a new empty run directory');
  const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : { channel: 'chrome' }) });
  try {
    const context = await browser.newContext({ viewport, hasTouch: mode === 'touch', reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const journal = { startedAt: new Date().toISOString(), browserVersion: browser.version(),
      requestedViewport: viewport, mode, url: target.href, maxActions, maxCaptures,
      interface: 'Screenshots and coordinate/key actions only; other tool access remains instruction-restricted',
      actions: [], captures: [], pageErrors: [] };
    page.on('pageerror', (error) => journal.pageErrors.push(error.message));
    const save = () => fs.writeFile(path.join(directory, 'journal.json'), `${JSON.stringify(journal, null, 2)}\n`);
    let closed = false;
    let siteOpened = !startAtBlank;
    const coordinate = (x, y) => {
      if (![x, y].every(Number.isFinite) || x < 0 || y < 0 || x > viewport.width || y > viewport.height) {
        throw new Error('Use coordinates within the screenshot');
      }
    };
    async function snapshot(note = '') {
      if (closed || journal.captures.length >= maxCaptures) throw new Error('Capture budget exhausted or session closed');
      const file = path.join(directory, `screen-${String(journal.captures.length + 1).padStart(2, '0')}.png`);
      const bytes = await page.screenshot({ path: file });
      journal.captures.push({ file: path.basename(file), note: String(note).slice(0, 400),
        at: new Date().toISOString(), afterAction: journal.actions.length,
        sha256: createHash('sha256').update(bytes).digest('hex') });
      await save();
      return { file, bytes, mimeType: 'image/png', actionCount: journal.actions.length };
    }
    async function action(input) {
      if (closed || journal.actions.length >= maxActions || journal.captures.length >= maxCaptures) throw new Error('Action/capture budget exhausted or session closed');
      const entry = { ...input, at: new Date().toISOString() };
      journal.actions.push(entry);
      try {
        if (input.type === 'key') {
          if (mode !== 'keyboard' || !['Tab', 'Shift+Tab', 'Enter', 'Space', 'Escape', 'ArrowLeft', 'ArrowRight',
            'ArrowUp', 'ArrowDown', 'PageDown', 'PageUp', 'Home', 'End'].includes(input.key)) throw new Error('Key not allowed in this run');
          await page.keyboard.press(input.key);
        } else if (mode === 'keyboard') throw new Error('This run permits keyboard input only');
        else if (input.type === 'wheel' && mode === 'mouse') {
          if (!Number.isFinite(input.deltaY) || Math.abs(input.deltaY) > 1000) throw new Error('Invalid scroll');
          await page.mouse.wheel(0, input.deltaY);
        } else if (['click', 'move', 'down', 'up'].includes(input.type) && mode === 'mouse') {
          if (input.type !== 'up') coordinate(input.x, input.y);
          if (input.type === 'click') await page.mouse.click(input.x, input.y);
          if (input.type === 'move') await page.mouse.move(input.x, input.y, { steps: 8 });
          if (input.type === 'down') { await page.mouse.move(input.x, input.y); await page.mouse.down(); }
          if (input.type === 'up') await page.mouse.up();
        } else if (input.type === 'tap' && mode === 'touch') {
          coordinate(input.x, input.y); await page.touchscreen.tap(input.x, input.y);
        } else throw new Error('Unsupported action for this input mode');
        entry.status = 'executed';
      } catch (error) { entry.status = 'failed'; entry.error = error.message; await save(); throw error; }
      return snapshot(input.note || input.type);
    }
    await page.goto(startAtBlank ? 'about:blank' : target.href);
    await save();
    return Object.freeze({ snapshot, action,
      async openSite() {
        if (siteOpened || closed || journal.captures.length >= maxCaptures) throw new Error('Site already opened or session budget exhausted');
        siteOpened = true;
        await page.goto(target.href); return snapshot('Open supplied local site');
      },
      async close(note = '') {
        if (closed) return;
        closed = true; journal.finishedAt = new Date().toISOString(); journal.closeNote = String(note).slice(0, 800);
        await browser.close(); await save();
        return { directory, actions: journal.actions.length, captures: journal.captures.length, pageErrors: journal.pageErrors };
      },
    });
  } catch (error) {
    await browser.close().catch(() => {});
    throw error;
  }
}

module.exports = { createVisualWalkthrough };
