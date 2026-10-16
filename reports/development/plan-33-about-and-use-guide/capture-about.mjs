import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const repo = resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const dist = join(repo, 'dist');
const evidenceDir = join(repo, 'reports/development/plan-33-about-and-use-guide/evidence');
const base = process.argv[2];
if (!base || !base.startsWith('/') || !base.endsWith('/')) {
  throw new Error('Pass the configured base URL, for example /FractionFlow/ or /.');
}

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};
const server = createServer(async (request, response) => {
  let pathname = new URL(request.url, 'http://localhost').pathname;
  if (base !== '/' && pathname.startsWith(base)) pathname = pathname.slice(base.length);
  pathname = pathname.replace(/^\/+/, '') || 'index.html';
  const file = resolve(dist, normalize(pathname));
  const relativeFile = relative(dist, file);
  if (relativeFile === '..' || relativeFile.startsWith(`..${sep}`) || resolve(file) !== file) {
    response.writeHead(400).end();
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = { plan: 'plan-33', base, pages: [], externalRequests: [], apiCalls: [], storageWrites: [] };

try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.exposeBinding('__recordPlan33Evidence', (_source, entry) => {
    if (entry.type === 'api') results.apiCalls.push(entry.name);
    if (entry.type === 'storage') results.storageWrites.push(entry);
  });
  await context.addInitScript(() => {
    const originalStorageSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function (...args) {
        const name = this === window.localStorage ? 'localStorage' : this === window.sessionStorage ? 'sessionStorage' : 'storage';
        window.__fractionFlowStorageWrites ??= [];
        const entry = { store: name, key: String(args[0]) };
        window.__fractionFlowStorageWrites.push(entry);
        window.__recordPlan33Evidence({ type: 'storage', ...entry });
        return originalStorageSet.apply(this, args);
    };
    for (const [name, proto, method] of [
      ['fetch', window, 'fetch'], ['XMLHttpRequest.send', XMLHttpRequest.prototype, 'send'],
      ['sendBeacon', navigator, 'sendBeacon'], ['WebSocket', window, 'WebSocket'],
      ['EventSource', window, 'EventSource'],
    ]) {
      const original = proto[method];
      if (typeof original !== 'function') continue;
      try {
        proto[method] = function (...args) {
          window.__fractionFlowApiCalls ??= [];
          window.__fractionFlowApiCalls.push(name);
          window.__recordPlan33Evidence({ type: 'api', name });
          return Reflect.apply(original, this, args);
        };
      } catch { /* Instrumentation must not change feature availability. */ }
    }
  });
  const page = await context.newPage();
  page.on('request', (request) => {
    if (!request.url().startsWith(origin)) results.externalRequests.push(request.url());
  });

  for (const viewport of [{ width: 360, height: 740 }, { width: 1366, height: 768 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${origin}${base}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(evidenceDir, `entry-${viewport.width}x${viewport.height}-${base === '/' ? 'root' : 'pages'}.png`), fullPage: true });
    const entry = await page.evaluate(() => ({
      title: document.title,
      practiceLabels: [...document.querySelectorAll('.app-entry-page [data-practice-type]')].map((button) => button.textContent.trim()),
      aboutHref: document.querySelector('.app-about-link')?.getAttribute('href'),
      hiddenEpisodeCount: [...document.querySelectorAll('.app-episode[hidden]')].length,
      document: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, clientWidth: document.documentElement.clientWidth },
    }));
    if (entry.aboutHref !== './about.html' || entry.document.scrollWidth > viewport.width) throw new Error(`Entry invariant failed at ${viewport.width}: ${JSON.stringify(entry)}`);
    results.pages.push({ surface: 'entry', viewport, ...entry });
    const entryVerticalFit = entry.document.scrollHeight <= viewport.height;
    results.pages.at(-1).verticalFit = entryVerticalFit;
    if (viewport.width === 360 && !entryVerticalFit) throw new Error(`Entry did not fit vertically at 360x${viewport.height}: ${JSON.stringify(entry.document)}`);
    if (viewport.width === 360) {
      await page.keyboard.press('Tab');
      const firstTab = await page.evaluate(() => ({ text: document.activeElement.textContent.trim(), practice: document.activeElement.matches('[data-practice-type="sum-under-one"]') }));
      if (!firstTab.practice) throw new Error(`First Tab missed practice control: ${JSON.stringify(firstTab)}`);
      await page.keyboard.press('Tab'); // entry settings gear
      await page.keyboard.press('Tab'); // second practice choice
      await page.keyboard.press('Tab'); // About link
      const aboutFocused = await page.evaluate(() => ({ text: document.activeElement.textContent.trim(), href: document.activeElement.getAttribute('href') }));
      if (aboutFocused.href !== './about.html') throw new Error(`Keyboard sequence did not reach About link: ${JSON.stringify(aboutFocused)}`);
      results.pages.push({ surface: 'keyboard-entry-about', firstTab, aboutFocused });
      await page.keyboard.press('Enter');
      await page.waitForURL((url) => url.pathname.endsWith('/about.html'));
      await page.waitForLoadState('domcontentloaded');
    } else {
      await page.getByRole('link', { name: 'About FractionFlow' }).click();
      await page.waitForURL((url) => url.pathname.endsWith('/about.html'));
      await page.getByRole('link', { name: 'Back to practice' }).click();
      await page.waitForURL((url) => url.pathname === base);
      results.pages.push({ surface: 'pointer-return', pathname: new URL(page.url()).pathname });
      await page.goto(`${origin}${base}about.html`, { waitUntil: 'networkidle' });
    }

    const about = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector('h1')?.textContent.trim(),
      backHref: document.querySelector('.back')?.getAttribute('href'),
      figureCount: document.querySelectorAll('figure').length,
      episodeCount: document.querySelectorAll('.app-episode, [data-episode-id]').length,
      bodyText: document.body.innerText,
      scroll: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight },
      stackWidth: getComputedStyle(document.querySelector('.fraction')).width,
      figureName: document.querySelector('figure')?.getAttribute('aria-labelledby'),
    }));
    if (about.title !== 'About FractionFlow' || about.heading !== 'About FractionFlow' || about.backHref !== './' || about.figureCount !== 1 || about.episodeCount !== 0 || about.scroll.width > viewport.width) {
      throw new Error(`About invariant failed at ${viewport.width}: ${JSON.stringify(about)}`);
    }
    if (viewport.width === 360 && about.scroll.height <= about.scroll.clientHeight) throw new Error('Small viewport About page did not demonstrate natural scrolling.');
    await page.screenshot({ path: join(evidenceDir, `about-${viewport.width}x${viewport.height}-${base === '/' ? 'root' : 'pages'}.png`), fullPage: true });
    results.pages.push({ surface: 'about', viewport, ...about });

    if (viewport.width === 360) {
      await page.keyboard.press('Tab');
      const backFocused = await page.evaluate(() => ({ text: document.activeElement.textContent.trim(), href: document.activeElement.getAttribute('href') }));
      if (backFocused.href !== './') throw new Error(`First About Tab missed Back to practice: ${JSON.stringify(backFocused)}`);
      await page.keyboard.press('Enter');
      await page.waitForURL((url) => url.pathname === base);
      results.pages.push({ surface: 'keyboard-return', firstTab: backFocused, pathname: new URL(page.url()).pathname });
      await page.waitForLoadState('domcontentloaded');
      await page.keyboard.press('Tab');
      const firstPracticeAfterReturn = await page.evaluate(() => ({ practice: document.activeElement.matches('[data-practice-type="sum-under-one"]'), label: document.activeElement.textContent.trim() }));
      if (!firstPracticeAfterReturn.practice) throw new Error(`First Tab after keyboard return missed practice: ${JSON.stringify(firstPracticeAfterReturn)}`);
      results.pages.push({ surface: 'keyboard-return-first-tab', ...firstPracticeAfterReturn });
      await page.goto(`${origin}${base}about.html`, { waitUntil: 'networkidle' });
    }

    if (viewport.width === 360) {
      await page.evaluate(() => { document.body.style.fontSize = '200%'; });
      const enlarged = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
        height: document.documentElement.scrollHeight,
        fractionWidth: document.querySelector('.fraction').getBoundingClientRect().width,
      }));
      if (enlarged.width > enlarged.viewport) throw new Error(`About has horizontal overflow with enlarged text: ${JSON.stringify(enlarged)}`);
      await page.screenshot({ path: join(evidenceDir, `about-360x740-enlarged-${base === '/' ? 'root' : 'pages'}.png`), fullPage: true });
      results.pages.push({ surface: 'about-enlarged-text', viewport, ...enlarged });
      await page.evaluate(() => { document.body.style.fontSize = ''; });
    }

    if (viewport.width === 360) {
      await page.getByRole('link', { name: 'Back to practice' }).click();
      await page.waitForSelector('.app-entry-page');
      if (new URL(page.url()).pathname !== base || new URL(page.url()).hash) throw new Error(`Return did not resolve to base entry: ${page.url()}`);
      await page.keyboard.press('Tab');
      const firstTabAfterReturn = await page.evaluate(() => ({ text: document.activeElement.textContent.trim(), practice: document.activeElement.matches('[data-practice-type="sum-under-one"]') }));
      if (!firstTabAfterReturn.practice) throw new Error(`Return first Tab missed practice: ${JSON.stringify(firstTabAfterReturn)}`);
      await page.locator('.app-practice-button').click();
      await page.waitForSelector('.app-episode:not([hidden])');
      const fragment = new URL(page.url()).hash;
      if (fragment !== '#sum-under-one') throw new Error(`Registered fragment launch changed: ${fragment}`);
      results.pages.push({ surface: 'return-and-practice', firstTabAfterReturn, fragment });
    }
  }

  const instrumentation = await page.evaluate(() => ({
    apiCalls: window.__fractionFlowApiCalls || [],
    storageWrites: window.__fractionFlowStorageWrites || [],
    localStorageEntries: localStorage.length,
    sessionStorageEntries: sessionStorage.length,
  }));
  results.storageEntries = { localStorage: instrumentation.localStorageEntries, sessionStorage: instrumentation.sessionStorageEntries };
  if (results.externalRequests.length || results.apiCalls.length || results.storageWrites.length || Object.values(results.storageEntries).some((count) => count !== 0)) {
    throw new Error(`Unexpected external request, app API use, or browser storage observed: ${JSON.stringify(results)}`);
  }
  await writeFile(join(evidenceDir, `journey-${base === '/' ? 'root' : 'pages'}.json`), `${JSON.stringify(results, null, 2)}\n`);
} finally {
  await browser.close();
  await new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose()));
}

