import { EventEmitter, once as onceEvent } from 'node:events';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { createServer } from 'vite';
import { commandForAction, menuInventory, packageScriptInvocation, serverInvocation } from '../scripts/dev/console-commands.mjs';
import { confirmAndRun, execute, runConsole } from '../scripts/dev/console.mjs';
import { OwnedServers } from '../scripts/dev/console-servers.mjs';

function child(pid = 1234) {
  const value = new EventEmitter(); value.pid = pid; value.exitCode = null; value.signalCode = null; value.connected = true; value.sent = [];
  value.stdout = new PassThrough(); value.stderr = new PassThrough();
  value.send = (message) => { value.sent.push(message); if (message.type === 'stop') setImmediate(() => { value.emit('message', { type: 'stopped' }); value.connected = false; value.exitCode = 0; value.emit('exit', 0, null); }); };
  return value;
}
async function unusedLoopbackPort() {
  const probe = net.createServer();
  await new Promise((resolve, reject) => probe.once('error', reject).listen(0, '127.0.0.1', resolve));
  const { port } = probe.address();
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return port;
}
async function runServerThroughMenu(name, port) {
  const input = new PassThrough(); const output = new PassThrough(); let mainMenus = 0; let resultText = '';
  output.on('data', (chunk) => {
    const text = String(chunk); resultText += text;
    if (text.includes('Local: 1 learner')) input.write(name === 'learner' ? '1\n' : '2\n');
    if (text.includes('Choose an action:')) { mainMenus++; input.write(mainMenus === 1 ? '1\n' : '0\n'); }
  });
  const servers = new OwnedServers({ ports: { [name]: port }, cleanupTimeoutMs: 5000 });
  const exitCode = await runConsole({ inputStream: input, outputStream: output, servers, handleSigint: false });
  return { exitCode, resultText };
}

describe('local development console', () => {
it('Windows package scripts use cmd.exe with shell disabled and a stable invocation object', () => {
  const invocation = packageScriptInvocation('dev', ['--host', '127.0.0.1', '--port', '5173', '--strictPort'], 'win32');
  expect(invocation.executable).toBe('cmd.exe');
  expect(invocation.args.slice(0, 3)).toEqual(['/d', '/s', '/c']);
  expect(invocation.args[3]).toBe('npm run dev -- --host 127.0.0.1 --port 5173 --strictPort');
  expect(invocation.display).toMatch(/cmd\.exe \/d \/s \/c/);
  expect(invocation.cwd.endsWith('FractionFlow')).toBe(true);
  expect(() => packageScriptInvocation('dev', ['--foo & whoami'], 'win32')).toThrow(/Unsupported Windows/);
});

it('menu inventory is noninteractive and includes no packet set command', () => {
  const inventory = menuInventory();
  expect(inventory.map((item) => item.id)).toEqual(['local', 'tests-builds', 'packet-status', 'advanced', 'exit']);
  expect(JSON.stringify(inventory)).not.toContain('plan-status.js set');
  expect(commandForAction('prototype')).toEqual(serverInvocation('prototype'));
  expect(commandForAction('prototype').args.at(-2)).toBe('prototype');
  expect(commandForAction('prototype').args.at(-1)).toBe('5174');
});

it('confirmation cancellation dispatches nothing; acceptance passes the displayed object through unchanged', async () => {
  const invocation = commandForAction('build'); let calls = 0;
  const denied = await confirmAndRun(invocation, async (shown) => shown === invocation && false, async () => { calls++; });
  expect(denied.cancelled).toBe(true); expect(calls).toBe(0);
  const accepted = await confirmAndRun(invocation, async (shown) => shown === invocation, async (executed) => { calls++; return executed; });
  expect(accepted).toBe(invocation); expect(calls).toBe(1);
});

it('runner reports launch errors separately from child exit codes', async () => {
  const invocation = commandForAction('test');
  const launch = await execute(invocation, { spawnImpl: () => { throw new Error('missing cmd'); } });
  expect(launch.launchError).toBe('missing cmd');
  const spawned = new EventEmitter();
  const failed = execute(invocation, { spawnImpl: () => { queueMicrotask(() => spawned.emit('exit', 7, null)); return spawned; } });
  expect(await failed).toEqual({ ok: false, code: 7, signal: null });
});

it.skipIf(process.platform !== 'win32')('Windows cmd wrapper launches the real console inventory script', async () => {
  const invocation = packageScriptInvocation('dev:console', ['--list'], 'win32');
  const result = await execute(invocation, { spawnImpl: (file, args, options) => spawn(file, args, { ...options, stdio: 'ignore' }) });
  expect(result.launchError).toBeUndefined(); expect(result.code).toBe(0);
});

it('direct Node child invocation preserves a helper path containing spaces', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'fraction flow console '));
  const helperPath = path.join(directory, 'tiny helper.mjs');
  try {
    await writeFile(helperPath, 'process.exitCode = 0;\n', 'utf8');
    const invocation = { executable: process.execPath, args: [helperPath], cwd: directory, stdio: ['ignore', 'ignore', 'ignore'], shell: false };
    const result = await execute(invocation);
    expect(result.code).toBe(0);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

it('interactive menu exit stops a ready owned server and returns', async () => {
  const input = new PassThrough(); const output = new PassThrough(); let mainMenus = 0; let starts = 0; let cleanups = 0;
  output.on('data', (chunk) => {
    const text = String(chunk);
    if (text.includes('Local: 1 learner')) input.write('1\n');
    if (text.includes('Choose an action:')) { mainMenus++; input.write(mainMenus === 1 ? '1\n' : '0\n'); }
  });
  const servers = {
    async start(name) { starts++; return { ok: true, state: 'ready', url: `http://127.0.0.1:5173/${name}/` }; },
    status() { return [{ name: 'learner', state: 'ready', url: 'http://127.0.0.1:5173/learner/' }]; },
    async stop() { return { ok: true }; },
    async stopAll() { cleanups++; return [{ name: 'learner', ok: true }]; },
  };
  expect(await runConsole({ inputStream: input, outputStream: output, servers, handleSigint: false })).toBe(0);
  expect(starts).toBe(1); expect(cleanups).toBe(1);
});

it('real learner/prototype helpers serve on isolated ports, exit-clean, and leave an independent server alive', async () => {
  const learnerPort = await unusedLoopbackPort();
  const prototypePort = await unusedLoopbackPort();
  const externalPort = await unusedLoopbackPort();
  const external = await createServer({ configFile: 'vite.config.js', server: { host: '127.0.0.1', port: externalPort, strictPort: true }, optimizeDeps: { noDiscovery: true, include: [] } });
  try {
    await external.listen();
    const collision = await runServerThroughMenu('learner', externalPort);
    expect(collision.exitCode).toBe(0); expect(collision.resultText).toMatch(/startup error: Port .* is already in use/);
    expect(collision.resultText).not.toContain('Cleanup failed');
    const stillIndependent = await fetch(`http://127.0.0.1:${externalPort}/FractionFlow/`);
    expect(stillIndependent.status).toBe(200); expect(await stillIndependent.text()).toContain('<title>FractionFlow — Fraction practice</title>');
    const learner = await runServerThroughMenu('learner', learnerPort);
    expect(learner.exitCode).toBe(0); expect(learner.resultText).toContain(`Ready: http://127.0.0.1:${learnerPort}/FractionFlow/`);
    await expect(fetch(`http://127.0.0.1:${learnerPort}/FractionFlow/`, { signal: AbortSignal.timeout(300) })).rejects.toThrow();
    const prototype = await runServerThroughMenu('prototype', prototypePort);
    expect(prototype.exitCode).toBe(0); expect(prototype.resultText).toContain(`Ready: http://127.0.0.1:${prototypePort}/FractionFlow/prototypes/subtraction/`);
    await expect(fetch(`http://127.0.0.1:${prototypePort}/FractionFlow/prototypes/subtraction/`, { signal: AbortSignal.timeout(300) })).rejects.toThrow();
    const independent = await fetch(`http://127.0.0.1:${externalPort}/FractionFlow/`);
    expect(independent.status).toBe(200); expect(await independent.text()).toContain('<title>FractionFlow — Fraction practice</title>');
  } finally { await external.close(); }
  await expect(fetch(`http://127.0.0.1:${externalPort}/FractionFlow/`, { signal: AbortSignal.timeout(300) })).rejects.toThrow();
}, 20000);

it('owned start is idempotent and Stop requests one cooperative child close', async () => {
  const serverChild = child(); const calls = [];
  const spawnImpl = (file, args) => { calls.push([file, args]); setImmediate(() => serverChild.emit('message', { type: 'ready', url: 'http://127.0.0.1:5173/FractionFlow/' })); return serverChild; };
  const owned = new OwnedServers({ platform: 'win32', env: {}, spawnImpl, fetchImpl: async (url) => {
    if (new URL(url).pathname === '/FractionFlow/' && serverChild.exitCode === null) return { ok: true, text: async () => '<title>FractionFlow — Fraction practice</title>' };
    throw new Error('closed');
  }, timeoutMs: 500 });
  const first = await owned.start('learner'); expect(first.ok).toBe(true);
  expect((await owned.start('learner')).duplicate).toBe(true);
  expect(calls.length).toBe(1);
  const [stopped, repeatedStop] = await Promise.all([owned.stop('learner'), owned.stop('learner')]);
  expect(stopped.ok).toBe(true); expect(repeatedStop).toBe(stopped);
  expect(calls[0][0]).toMatch(/node(?:\.exe)?$/i);
  expect(serverChild.sent.filter((message) => message.type === 'stop')).toHaveLength(1);
  expect((await owned.stop('learner')).ok).toBe(false);
});

it('duplicate start during readiness does not claim a ready URL or spawn twice', async () => {
  const serverChild = child(); let resolveFetch; let spawned = 0;
  const owned = new OwnedServers({
    platform: 'win32', env: {}, timeoutMs: 1000, output: { write() {} },
    spawnImpl: () => { spawned++; setImmediate(() => serverChild.emit('message', { type: 'ready', url: 'http://127.0.0.1:5173/FractionFlow/' })); return serverChild; },
    fetchImpl: () => new Promise((resolve) => { resolveFetch = resolve; }),
  });
  const starting = owned.start('learner');
  for (let i = 0; i < 20 && !resolveFetch; i++) await new Promise((resolve) => setTimeout(resolve, 10));
  const duplicate = await owned.start('learner');
  expect(duplicate).toEqual({ ok: false, duplicate: true, url: null, state: 'starting' });
  expect(spawned).toBe(1);
  resolveFetch({ ok: true, text: async () => '<title>FractionFlow — Fraction practice</title>' });
  expect((await starting).state).toBe('ready');
  // End the mocked owned process without exercising OS process management.
  serverChild.exitCode = 0; serverChild.emit('exit', 0, null);
});

it('late failure from a replaced child cannot stop or remove its replacement', async () => {
  const first = child(2001); const second = child(2002); let spawns = 0;
  const owned = new OwnedServers({
    platform: 'win32', env: {}, output: { write() {} }, timeoutMs: 1000,
    spawnImpl: () => { spawns++; if (spawns === 2) setImmediate(() => second.emit('message', { type: 'ready', url: 'http://127.0.0.1:5173/FractionFlow/' })); return spawns === 1 ? first : second; },
    fetchImpl: async () => ({ ok: true, text: async () => '<title>FractionFlow — Fraction practice</title>' }),
  });
  const firstStart = owned.start('learner');
  await new Promise((resolve) => setTimeout(resolve, 10));
  first.exitCode = 1; first.emit('exit', 1, null);
  const secondStart = owned.start('learner');
  const firstResult = await firstStart; const secondResult = await secondStart;
  expect(firstResult.ok).toBe(false); expect(secondResult.state).toBe('ready');
  expect(owned.status()).toEqual([{ name: 'learner', state: 'ready', url: 'http://127.0.0.1:5173/FractionFlow/' }]);
  const cleanup = await owned.stop('learner'); expect(cleanup.ok).toBe(true);
  expect(owned.status()).toEqual([]);
});

it('startup cancellation and repeated cleanup share the same cooperative stop', async () => {
  const serverChild = child();
  const owned = new OwnedServers({ platform: 'win32', env: {}, timeoutMs: 1000, cleanupTimeoutMs: 500, output: { write() {} }, spawnImpl: () => serverChild, fetchImpl: async () => { throw new Error('not ready or port closed'); } });
  const starting = owned.start('learner');
  await new Promise((resolve) => setTimeout(resolve, 10));
  const [stopped, stoppedAgain] = await Promise.all([owned.stop('learner'), owned.stop('learner')]);
  const failedStart = await starting;
  expect(stopped.ok).toBe(true); expect(stoppedAgain).toBe(stopped);
  expect(failedStart.reason).toMatch(/startup canceled/);
  expect(serverChild.sent.filter((message) => message.type === 'stop')).toHaveLength(1);
});

it('real startup cancellation awaits helper close and child exit', async () => {
  const port = await unusedLoopbackPort();
  const owned = new OwnedServers({ ports: { learner: port }, cleanupTimeoutMs: 5000 });
  const starting = owned.start('learner');
  const stopping = owned.stop('learner');
  const [result, cleanup] = await Promise.all([starting, stopping]);
  expect(result.ok).toBe(false); expect(result.reason).toMatch(/startup canceled/);
  expect(cleanup.ok).toBe(true);
  await expect(fetch(`http://127.0.0.1:${port}/FractionFlow/`, { signal: AbortSignal.timeout(300) })).rejects.toThrow();
});

it('parent IPC disconnect cooperatively closes a ready server helper', async () => {
  const port = await unusedLoopbackPort(); let childProcess;
  const owned = new OwnedServers({ ports: { learner: port }, spawnImpl: (...args) => { childProcess = spawn(...args); return childProcess; } });
  const ready = await owned.start('learner'); expect(ready.state).toBe('ready');
  const exited = onceEvent(childProcess, 'exit');
  childProcess.disconnect();
  const [code] = await exited;
  expect(code).toBe(0);
  await expect(fetch(`http://127.0.0.1:${port}/FractionFlow/`, { signal: AbortSignal.timeout(300) })).rejects.toThrow();
});

it('reports missing close acknowledgement instead of treating child exit as successful cleanup', async () => {
  const serverChild = child();
  serverChild.send = (message) => { serverChild.sent.push(message); setImmediate(() => { serverChild.connected = false; serverChild.exitCode = 1; serverChild.emit('exit', 1, null); }); };
  const owned = new OwnedServers({ platform: 'win32', env: {}, cleanupTimeoutMs: 200, spawnImpl: () => serverChild });
  const entry = { name: 'learner', state: 'ready', child: serverChild, exited: false, messages: [], waiters: [], url: 'http://127.0.0.1:5173/FractionFlow/' };
  serverChild.on('exit', () => { entry.exited = true; for (const wake of entry.waiters.splice(0)) wake(); });
  owned.entries.set('learner', entry);
  const result = await owned.stop('learner');
  expect(result.ok).toBe(false); expect(result.reason).toMatch(/exited before close acknowledgement/);
  expect(owned.status()[0].state).toBe('cleanup-failed');
});

it('a ChildProcess error with a live PID does not count as process exit or erase ownership', async () => {
  const serverChild = child(4567);
  const owned = new OwnedServers({ platform: 'win32', env: {}, output: { write() {} }, spawnImpl: () => serverChild });
  const starting = owned.start('learner');
  await new Promise((resolve) => setTimeout(resolve, 10));
  serverChild.connected = false;
  serverChild.emit('error', new Error('IPC channel failure'));
  const result = await starting;
  expect(result.reason).toMatch(/process may still be live/);
  expect(owned.status()).toEqual([{ name: 'learner', state: 'cleanup-failed', url: null }]);
  expect(serverChild.exitCode).toBe(null);
});

it('foreign server response without this child ready evidence never registers ownership', async () => {
  const serverChild = child();
  const owned = new OwnedServers({ platform: 'win32', env: {}, output: { write() {} }, spawnImpl: () => serverChild, fetchImpl: async () => ({ ok: true, text: async () => '<title>FractionFlow — Fraction practice</title>' }), timeoutMs: 150, cleanupTimeoutMs: 150 });
  const result = await owned.start('learner');
  expect(result.ok).toBe(false); expect(result.reason).toMatch(/timed out waiting/);
  expect(owned.status()).toEqual([]);
  expect(serverChild.sent.some((message) => message.type === 'stop')).toBe(true);
});
});
