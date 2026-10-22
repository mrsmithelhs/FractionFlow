// Same bounded driver through the command tool's persistent stdin session.
const readline = require('node:readline');
const { createVisualWalkthrough } = require('./visual-walkthrough-driver.cjs');

async function main() {
  const args = process.argv.slice(2);
  const options = { viewport: { width: 1093, height: 614 } };
  let serveBuilt = false;
  for (let i = 0; i < args.length; i += 1) {
    const flag = args[i];
    if (flag === '--blank') options.startAtBlank = true;
    else if (flag === '--serve-built') serveBuilt = true;
    else if (['--url', '--output-dir', '--mode', '--chrome-path', '--width', '--height'].includes(flag)) {
      const value = args[++i];
      if (!value) throw new Error(`Missing value for ${flag}`);
      if (flag === '--url') options.url = value;
      if (flag === '--output-dir') options.outputDir = value;
      if (flag === '--mode') options.mode = value;
      if (flag === '--chrome-path') options.executablePath = value;
      if (flag === '--width') options.viewport.width = Number(value);
      if (flag === '--height') options.viewport.height = Number(value);
    } else throw new Error(`Unknown option ${flag}`);
  }
  let server;
  let handle;
  const print = ({ bytes, ...result }) => console.log(JSON.stringify(result));
  const lines = readline.createInterface({ input: process.stdin, terminal: false });
  let closedSummary;
  async function shutdown(note) {
    try {
      if (handle && !closedSummary) closedSummary = await handle.close(note);
    } finally {
      try {
        if (server) {
          const closingServer = server;
          server = null;
          closingServer.closeAllConnections();
          await new Promise(resolve => closingServer.close(resolve));
        }
      } finally { lines.close(); process.stdin.pause(); process.stdin.unref?.(); }
    }
    return closedSummary;
  }
  try {
    if (serveBuilt) {
      if (options.url) throw new Error('Use either --serve-built or --url');
      const { createStaticServer } = require('./run-route-matrix.js');
      server = createStaticServer();
      await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
      options.url = `http://127.0.0.1:${server.address().port}/FractionFlow/`;
    }
    handle = await createVisualWalkthrough(options);
    print({ ready: true, ...await handle.snapshot('Command-tool session ready') });
    for await (const line of lines) {
      if (!line.trim()) continue;
      try {
        const command = JSON.parse(line);
        if (command.method === 'snapshot') print(await handle.snapshot(command.note));
        else if (command.method === 'openSite') print(await handle.openSite());
        else if (command.method === 'action') print(await handle.action(command.input));
        else if (command.method === 'close') {
          const result = { closed: true, ...await shutdown(command.note) };
          await new Promise(resolve => process.stdout.write(`${JSON.stringify(result)}\n`, resolve));
          // readline's pending TTY iterator can retain stdin after resources close.
          process.exit(0);
        } else throw new Error('Use snapshot, openSite, action or close');
      } catch (error) { console.log(JSON.stringify({ error: error.message })); }
    }
  } finally {
    await shutdown('Command stream ended');
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
