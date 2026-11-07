// Synthetic proof only: never launches, discovers, or stops the real lifecycle test.
const { fork } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { performance } = require('node:perf_hooks');

const role = process.argv[2];
if (role === 'helper') {
  const server = net.createServer(socket => socket.end('owned'));
  server.listen(0, '127.0.0.1', () => process.send({ event: 'listener-ready', port: server.address().port }));
  process.on('message', message => { if (message === 'stop') server.close(() => { process.send({ event: 'stop-ack' }, () => process.disconnect()); }); });
} else if (role === 'worker') {
  process.send({ event: 'worker-started' });
  if (process.argv[3] === 'pass') process.send({ event: 'work-complete' });
  else process.send({ event: 'await-blocked' });
  process.on('message', message => { if (message === 'stop') process.send({ event: 'stop-ack' }, () => process.disconnect()); });
} else if (role === undefined) {
  void main().catch(error => { console.error(error.stack); process.exitCode = 1; });
} else throw Error('Unknown role');

async function main() {
  const root = fs.realpathSync(path.resolve(__dirname, '../../..'));
  assert.equal(fs.realpathSync(process.cwd()), root, 'run from the canonical root');
  const dir = path.join(__dirname, '.controlled-proof-disposable');
  fs.mkdirSync(dir); // Refuse reuse, symlinks, or overwrite of an earlier run.
  assert.equal(fs.realpathSync(dir), dir);
  const results = [];
  for (const mode of ['pass', 'timeout']) results.push(await attempt(mode, dir));
  fs.writeFileSync(path.join(__dirname, 'controlled-proof-evidence.json'), JSON.stringify({ version: 1, synthetic: true, deadlineMs: 2000, cleanupLimitMs: 3000, attempts: results }, null, 2) + '\n', { flag: 'wx' });
  // Only after both attempts and all owned closures succeeded: remove our known disposable files.
  for (const name of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, name));
  fs.rmdirSync(dir);
  console.log('Both synthetic attempts completed and owned resources were accounted for.');
}

function listen(server) { return new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', () => resolve(server.address().port)); }); }
function close(server) { return new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
function connect(port) { return new Promise((resolve, reject) => { const socket = net.connect({ host: '127.0.0.1', port }); socket.once('connect', () => { socket.end(); resolve(); }); socket.once('error', reject); }); }
function assertClosed(port) { return new Promise((resolve, reject) => { const probe = net.createServer(); probe.once('error', reject); probe.listen(port, '127.0.0.1', () => probe.close(error => error ? reject(error) : resolve())); }); }
function bounded(promise, ms, label) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error(`${label} exceeded ${ms}ms`)), ms); })]).finally(() => clearTimeout(timer));
}

async function attempt(mode, dir) {
  const id = crypto.randomUUID();
  const started = performance.now();
  const raw = path.join(dir, `${mode}.jsonl`);
  const events = [];
  const ledger = { id, mode, slots: { helper: 'unlaunched', worker: 'unlaunched' }, independent: 'unbound' };
  const log = (event, details = {}) => { const row = { ms: +(performance.now() - started).toFixed(2), event, ...details }; events.push(row); fs.appendFileSync(raw, JSON.stringify(row) + '\n'); };
  const save = () => { const fd = fs.openSync(path.join(dir, `${mode}-ledger.json`), 'w'); try { fs.writeFileSync(fd, JSON.stringify(ledger)); fs.fsyncSync(fd); } finally { fs.closeSync(fd); } };
  save(); log('ledger-established-before-launch');
  const independent = net.createServer(socket => socket.end('independent'));
  const independentPort = await bounded(listen(independent), 3000, 'independent listen');
  ledger.independent = { port: independentPort, owner: 'supervisor-control' }; save();
  log('independent-listening', { port: independentPort });
  await bounded(connect(independentPort), 3000, 'independent initial connect');
  const slots = {};
  function launch(name, args) {
    assert.equal(ledger.slots[name], 'unlaunched');
    log('launch-begin', { name });
    const child = fork(__filename, args, { cwd: dir, stdio: ['ignore', 'ignore', 'ignore', 'ipc'], windowsHide: true });
    const slot = slots[name] = { child, messages: [], exited: false };
    // The live ChildProcess object is the authority for all later sends and exit events.
    ledger.slots[name] = { pid: child.pid, state: 'spawned' }; save();
    log('handle-recorded', { name, pid: child.pid });
    slot.exitPromise = new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', (code, signal) => { slot.exited = true; slot.exit = { code, signal }; log('child-exit', { name, code, signal }); resolve(slot.exit); }); });
    child.on('message', message => { slot.messages.push(message); if (message.event === 'listener-ready') { ledger.slots[name].port = message.port; save(); } log('child-message', { name, ...message }); slot.waiters?.splice(0).forEach(fn => fn()); });
    return slot;
  }
  function message(slot, event) {
    return new Promise(resolve => { const check = () => { const found = slot.messages.find(m => m.event === event); if (found) resolve(found); else (slot.waiters ||= []).push(check); }; check(); });
  }
  const helper = launch('helper', ['helper']);
  const ready = await bounded(message(helper, 'listener-ready'), 3000, 'helper ready');
  assert.notEqual(ready.port, independentPort);
  await bounded(connect(ready.port), 3000, 'owned initial connect');
  const workerDeadline = performance.now() + 2000;
  const worker = launch('worker', ['worker', mode]);
  await bounded(message(worker, 'worker-started'), Math.max(1, workerDeadline - performance.now()), 'worker started');
  const expected = mode === 'pass' ? 'work-complete' : 'await-blocked';
  await bounded(message(worker, expected), Math.max(1, workerDeadline - performance.now()), 'worker phase');
  let deadlineTimer;
  const outcome = await Promise.race([
    message(worker, 'work-complete').then(() => 'pass'),
    new Promise(resolve => { deadlineTimer = setTimeout(() => resolve('timeout'), Math.max(0, workerDeadline - performance.now())); }),
  ]);
  clearTimeout(deadlineTimer);
  assert.equal(outcome, mode, 'synthetic outcome differed from scenario');
  if (outcome === 'pass') log('worker-complete-observed');
  else log('worker-deadline', { lastCompleted: 'await-blocked', firstMissing: 'work-complete' });
  const cleanupDeadline = performance.now() + 3000;
  const cleanup = (promise, label) => bounded(promise, Math.max(1, cleanupDeadline - performance.now()), label);
  // No PID- or port-based signalling: only the exact live child handles created above.
  for (const [name, slot] of Object.entries(slots)) {
    assert(!slot.exited && slot.child.connected, `${name} ownership/IPC uncertain`);
    log('cooperative-stop-request', { name }); slot.child.send('stop');
  }
  await cleanup(Promise.all(Object.values(slots).map(slot => message(slot, 'stop-ack'))), 'stop acknowledgements');
  const exits = await cleanup(Promise.all(Object.values(slots).map(slot => slot.exitPromise)), 'child exits');
  assert(exits.every(exit => exit.code === 0 && exit.signal === null));
  await cleanup(assertClosed(ready.port), 'owned port closure'); log('owned-listener-closed');
  await cleanup(connect(independentPort), 'independent survival'); log('independent-survived');
  await cleanup(close(independent), 'independent close');
  await cleanup(assertClosed(independentPort), 'independent closure'); log('independent-closed-by-owner');
  const label = new Map([[independentPort, 'independent-port'], [ready.port, 'owned-port'], [slots.helper.child.pid, 'helper-pid'], [slots.worker.child.pid, 'worker-pid']]);
  return { mode, outcome, ledgerEstablishedBeforeLaunch: true, exactHandlesRetained: true, events: events.map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, ['pid', 'port'].includes(key) ? label.get(value) : value]))) };
}
