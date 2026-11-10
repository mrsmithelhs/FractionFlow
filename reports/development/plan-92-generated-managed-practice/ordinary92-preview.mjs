// Attended local review: the ordinary app runs in a fresh, temporary browser
// context. Closing its window discards its browser storage.
import { createServer } from 'vite';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--seed' || !/^\d+$/.test(args[1]) || Number(args[1]) > 0xffffffff)) {
  throw new Error('Use no arguments or --seed followed by an integer from 0 to 4294967295.');
}
const seed = args.length ? Number(args[1]) : null;
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--no-proxy-server'] });
  const context = await browser.newContext({ viewport: { width: 1093, height: 750 } });
  if (seed !== null) await context.addInitScript(value => {
    const random = crypto.getRandomValues.bind(crypto); let unused = true;
    crypto.getRandomValues = array => {
      if (unused && array instanceof Uint32Array && array.length === 1) { unused = false; array[0] = value; return array; }
      return random(array);
    };
  }, seed);
  const page = await context.newPage();
  const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
  console.log(`Review window: ${url}`);
  if (seed !== null) console.log(`The first Start in each tab uses review seed ${seed}; subsequent Starts use ordinary randomness.`);
  console.log('This window uses temporary browser data. To test another tab, duplicate this tab in the review window. Close the window to finish.');
  await page.goto(url);
  await new Promise(resolve => browser.once('disconnected', resolve));
} finally {
  if (browser?.isConnected()) await browser.close();
  await server.close();
}
