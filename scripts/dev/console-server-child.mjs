import { createServer, loadConfigFromFile } from 'vite';

const specs = {
  learner: { configFile: 'vite.config.js', port: 5199, base: (value) => normalizeBase(value || '/FractionFlow/') },
  prototype: { configFile: 'vite.subtraction.config.js', port: 5174, base: (value) => `${normalizeBase(value || '/FractionFlow/')}prototypes/subtraction/` },
};
function normalizeBase(base) { const leading = base.startsWith('/') ? base : `/${base}`; return leading.endsWith('/') ? leading : `${leading}/`; }
const kind = process.argv[2];
const spec = specs[kind];
if (!spec) { process.stderr.write('Expected fixed server kind: learner or prototype.\n'); process.exit(2); }
const port = Number(process.argv[3] || spec.port);
if (!Number.isInteger(port) || port < 1024 || port > 65535) { process.stderr.write('Server port must be an integer from 1024 through 65535.\n'); process.exit(2); }
spec.port = port;

let server = null;
let startupPromise = null;
let closePromise = null;
let shutdownPromise = null;
let startupError = null;
let stopRequested = false;
let ackSent = false;
let parentDisconnected = false;
let selfDisconnect = false;

function send(message) {
  return new Promise((resolve) => {
    if (!process.connected) { resolve(false); return; }
    process.send(message, (error) => resolve(!error));
  });
}
function closeServer() {
  if (!closePromise) closePromise = server ? server.close() : Promise.resolve();
  return closePromise;
}
function shutdown() {
  if (!shutdownPromise) shutdownPromise = (async () => {
    stopRequested = true;
    if (startupPromise) await startupPromise.catch(() => {});
    await closeServer();
    if (!parentDisconnected && !ackSent) { ackSent = true; await send({ type: 'stopped' }); }
    selfDisconnect = true;
    if (process.connected) process.disconnect();
  })();
  return shutdownPromise;
}

process.on('message', (message) => {
  if (message?.type === 'stop') void shutdown().catch(async (error) => {
    if (!ackSent) { ackSent = true; await send({ type: 'stop-error', error: error.message }); }
    process.exitCode = 1;
    selfDisconnect = true;
    if (process.connected) process.disconnect();
  });
});
process.on('disconnect', () => {
  if (selfDisconnect) return;
  parentDisconnected = true;
  void shutdown().then(() => process.exit(0), () => process.exit(1));
});

startupPromise = (async () => {
  const loaded = await loadConfigFromFile('serve', spec.configFile);
  const configuredIncludes = loaded?.config?.optimizeDeps?.include || [];
  if (configuredIncludes.length) throw new Error('Console server does not override configured optimizeDeps.include entries; use the regular Vite command for this configuration.');
  server = await createServer({
    configFile: spec.configFile,
    server: { host: '127.0.0.1', port: spec.port, strictPort: true },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  if (stopRequested) return;
  await server.listen();
})();

try {
  await startupPromise;
  if (stopRequested) await shutdown();
  else if (startupError) throw startupError;
  else {
    const url = `http://127.0.0.1:${spec.port}${spec.base(process.env.BASE_PATH)}`;
    if (!await send({ type: 'ready', url })) throw new Error('Could not send owned-server readiness over IPC.');
  }
} catch (error) {
  startupError = error;
  let closeFailed = false;
  try { await closeServer(); }
  catch (closeError) { closeFailed = true; startupError = new Error(`${error.message}; Vite close failed: ${closeError.message}`); }
  if (stopRequested) {
    if (closeFailed) {
      if (!ackSent) { ackSent = true; await send({ type: 'stop-error', error: startupError.message }); }
      process.exitCode = 1;
    } else {
      if (!ackSent) { ackSent = true; await send({ type: 'stopped' }); }
      process.exitCode = 0;
    }
  } else {
    await send({ type: 'start-error', error: startupError.message });
    process.exitCode = 1;
  }
  selfDisconnect = true;
  if (process.connected) process.disconnect();
}
