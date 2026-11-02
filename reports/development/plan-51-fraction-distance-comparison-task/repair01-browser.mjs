import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const output = new URL('./evidence/repair01/', import.meta.url);
await mkdir(output, { recursive: true });
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0, strictPort: true } });
let browser;
try {
  await server.listen();
  const address = server.httpServer.address();
  const url = `http://127.0.0.1:${address.port}/`;
  browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  for (const size of [{ width: 360, height: 740, deviceScaleFactor: 1 }, { width: 1093, height: 614, deviceScaleFactor: 1.25 }]) {
    const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: size.deviceScaleFactor, reducedMotion: 'reduce', hasTouch: true });
    const page = await context.newPage();
    await page.goto(url);
    await page.locator('[data-practice-type="fraction-distance"]').click();
    const host = page.locator('.app-visual-view');
    if (await host.getByRole('radio', { name: 'First amount is less than second amount' }).count() !== 1) throw new Error('full relation name absent');
    await host.evaluate(node => { node.querySelector('summary').click(); [...node.querySelectorAll('button')].find(button => button.textContent === 'Comparison tip').click(); });
    if (!await host.locator('details').evaluate(node => node.open) || !await host.getByText('Compare same-size parts.').isVisible()) throw new Error('same-turn comparison help closed');
    await host.locator('summary').click();
    await page.screenshot({ path: new URL(`./evidence/repair01/compare-${size.width}.png`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
    const traversal = [];
    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim().slice(0, 50), value: document.activeElement?.value }));
      traversal.push(info);
      if (info.tag === 'INPUT' && info.value === '<') break;
    }
    if (traversal.at(-1)?.value !== '<') throw new Error('sequential keyboard traversal did not reach relation');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const before = await host.locator('.plan45-model').count();
    const activeMetrics = await page.evaluate(() => {
      const rect = node => { const r = node.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
      return { viewportWidth: document.documentElement.clientWidth, prompt: rect(document.querySelector('.app-visual-view .plan45-prompt')),
        controls: [...document.querySelectorAll('.app-visual-view .plan51-response input, .app-visual-view .plan51-response button')].map(rect),
        fractions: [...document.querySelectorAll('.app-visual-view .plan45-expression .symbolic-fraction')].map(rect), documentHeight: document.documentElement.scrollHeight };
    });
    if ([activeMetrics.prompt, ...activeMetrics.controls, ...activeMetrics.fractions].some(box => box.left < 0 || box.right > activeMetrics.viewportWidth)
      || activeMetrics.controls.some(box => box.height < 44)) throw new Error('active control or fraction geometry failed');
    await page.screenshot({ path: new URL(`./evidence/repair01/distance-${size.width}.png`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
    if (await page.evaluate(() => document.activeElement?.getAttribute('data-plan51-focus')) !== 'numerator') throw new Error('numerator was not focused after comparison');
    await page.keyboard.type('3');
    await page.keyboard.press('Tab');
    if (await page.evaluate(() => document.activeElement?.getAttribute('data-plan51-focus')) !== 'denominator') throw new Error('keyboard did not reach denominator');
    await page.keyboard.type('8');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    if (await host.locator('[data-plan51-focus="numerator"]').getAttribute('aria-describedby') !== 'plan51-feedback-visual') throw new Error('wrong-distance feedback not associated');
    await host.locator('summary').click();
    await host.getByRole('button', { name: 'Show both amounts' }).tap();
    if (!await host.locator('details').evaluate(node => node.open) || await host.locator('.plan45-model').count() !== 2) throw new Error('touch model help closed');
    if (await host.getByRole('img', { name: 'One whole has 8 equal parts; 2 parts are shown.' }).count() !== 1) throw new Error('model role/name absent');
    await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab');
    if (await page.evaluate(() => document.activeElement?.getAttribute('data-plan51-focus')) !== 'numerator') throw new Error('keyboard did not return to numerator');
    await page.keyboard.press('Control+A'); await page.keyboard.type('4');
    await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    if (await host.getByText("That's right.", { exact: true }).count() !== 1) throw new Error('success acknowledgment missing or duplicated');
    await page.screenshot({ path: new URL(`./evidence/repair01/accepted-${size.width}.png`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
    const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth,
      next: (() => { const r = document.querySelector('.app-visual-view .plan51-next').getBoundingClientRect(); return { width: r.width, height: r.height }; })(),
      tracks: [...document.querySelectorAll('.app-visual-view .plan45-model-track')].map(node => ({ width: node.getBoundingClientRect().width, left: node.getBoundingClientRect().left, cells: node.children.length })) }));
    if (before !== 0 || metrics.scrollWidth > metrics.clientWidth || metrics.tracks.length !== 2
      || metrics.tracks.some(track => track.cells !== 8) || metrics.tracks[0].width !== metrics.tracks[1].width
      || metrics.tracks[0].left !== metrics.tracks[1].left || metrics.next.height < 44) throw new Error('layout or withholding assertion failed');
    results.push({ size, beforePairedModels: before, traversal, activeMetrics, metrics });
    const racePage = await context.newPage();
    await racePage.goto(url);
    await racePage.locator('[data-practice-type="fraction-distance"]').click();
    const raceHost = racePage.locator('.app-visual-view');
    await raceHost.locator('input[value="<"]').check();
    await raceHost.locator('.plan51-response button[type="submit"]').click();
    await raceHost.evaluate(node => { node.querySelector('summary').click(); [...node.querySelectorAll('button')].find(button => button.textContent === 'Show both amounts').click(); });
    if (!await raceHost.locator('details').evaluate(node => node.open) || await raceHost.locator('.plan45-model').count() !== 2) throw new Error('same-turn visual distance help closed');
    await raceHost.locator('summary').focus(); await racePage.keyboard.press('Enter');
    if (await raceHost.locator('details').evaluate(node => node.open)) throw new Error('visual keyboard close failed');
    await raceHost.locator('summary').tap();
    if (!await raceHost.locator('details').evaluate(node => node.open)) throw new Error('visual touch reopen failed');
    await racePage.locator('.app-view-toggle').click();
    if (!await racePage.locator('.app-linear-view details').evaluate(node => node.open)) throw new Error('disclosure lost on view switch');
    results.at(-1).repairHelpChecks = 'same-turn visual comparison and distance, keyboard close, touch reopen and view switch passed';
    await racePage.close();
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(url);
  await page.locator('[data-practice-type="fraction-distance"]').click();
  // The ordinary learner entry hides the condition menu; expose it for this test-only support sample.
  await page.evaluate(() => { document.querySelector('.app-gear-button').click(); document.querySelector('[data-support-id="medium-support"]').click(); });
  await page.getByRole('button', { name: 'Try this problem again' }).click();
  await page.locator('.app-view-toggle').click();
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  const linear = page.locator('.app-linear-view');
  await linear.evaluate(node => { node.querySelector('summary').click(); [...node.querySelectorAll('button')].find(button => button.textContent === 'Symbol tip').click(); });
  if (!await linear.locator('details').evaluate(node => node.open) || !await linear.getByText('The open side faces the greater amount.').isVisible()) throw new Error('same-turn linear help closed');
  await linear.locator('summary').focus(); await page.keyboard.press('Enter');
  if (await linear.locator('details').evaluate(node => node.open)) throw new Error('keyboard help close failed');
  await linear.locator('input[value="<"]').check();
  await linear.locator('.plan51-response button[type="submit"]').click();
  if (await linear.locator('.plan45-model').count() !== 0) throw new Error('unexpected paired model in linear distance stage');
  await linear.evaluate(node => { node.querySelector('summary').click(); [...node.querySelectorAll('button')].find(button => button.textContent === 'Show both amounts').click(); });
  if (!await linear.locator('details').evaluate(node => node.open) || await linear.locator('.plan45-model').count() !== 2) throw new Error('linear model help closed');
  await linear.locator('[data-plan51-focus="numerator"]').fill('1');
  await linear.locator('[data-plan51-focus="denominator"]').fill('2');
  await linear.locator('.plan51-response button[type="submit"]').click();
  const linearText = await linear.innerText();
  if (!linearText.includes('4 of the 8 equal parts') || !linearText.includes('Distance:')) throw new Error('linear verification missing source-unit distance');
  const enlarged = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  if (enlarged.scrollWidth > enlarged.clientWidth) throw new Error('enlarged text overflows horizontally');
  await page.screenshot({ path: new URL('./evidence/repair01/linear-enlarged.png', import.meta.url).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
  results.push({ size: { width: 360, height: 740 }, view: 'linear', support: 'Less', textScale: '200% root font', linearText, enlarged,
    repairHelpChecks: 'same-turn comparison and distance, keyboard close and explicit model request passed' });
  await context.close();
  await writeFile(new URL('./evidence/repair01/browser-sample.json', import.meta.url), JSON.stringify({ url, source: 'Vite served current working tree', results }, null, 2));
} finally {
  await browser?.close();
  await server.close();
}
