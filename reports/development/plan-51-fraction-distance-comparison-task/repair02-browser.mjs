import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const evidence = new URL('./evidence/repair02/', import.meta.url);
await mkdir(evidence, { recursive: true });
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0, strictPort: true } });
let browser;
try {
  await server.listen();
  const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
  browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  for (const size of [{ width: 360, height: 740, dpr: 1 }, { width: 1093, height: 614, dpr: 1.25 }]) {
    const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: size.dpr });
    const page = await context.newPage(); await page.goto(url);
    await page.locator('[data-practice-type="fraction-distance"]').click();
    const host = page.locator('.app-visual-view');
    await host.locator('input[value="<"]').check();
    await host.locator('.plan51-response button[type="submit"]').click();
    await host.locator('[data-plan51-focus="numerator"]').fill('1');
    await host.locator('[data-plan51-focus="denominator"]').fill('2');
    await host.locator('.plan51-response button[type="submit"]').click();
    const measured = await host.locator('.plan51-success').evaluate(node => {
      const style = getComputedStyle(node);
      return { text: node.textContent, background: style.backgroundColor, color: style.color, weight: style.fontWeight,
        padding: style.padding, nextFocused: document.activeElement?.classList.contains('plan51-next') };
    });
    if (measured.text !== "That's right." || measured.background !== 'rgb(241, 250, 244)' || Number(measured.weight) < 600 || !measured.nextFocused) throw new Error(`success style/content/focus mismatch: ${JSON.stringify(measured)}`);
    if (await host.locator('.plan51-result .symbolic-numerator').textContent() !== '1' || await host.locator('.plan51-result .symbolic-denominator').textContent() !== '2') throw new Error('accepted fraction changed');
    await page.screenshot({ path: fileURLToPath(new URL(`./evidence/repair02/accepted-${size.width}.png`, import.meta.url)), fullPage: true });
    results.push({ size, measured }); await context.close();
  }
  await writeFile(new URL('./evidence/repair02/browser-sample.json', import.meta.url), JSON.stringify({ url, source: 'Vite served current working tree', results }, null, 2));
} finally { await browser?.close(); await server.close(); }
