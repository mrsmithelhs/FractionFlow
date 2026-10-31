import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { serverInvocation } from './console-commands.mjs';

const SERVERS = {
  learner: { port: 5173, title: 'FractionFlow — Fraction practice', path: (env) => normalizeBase(env.BASE_PATH || '/FractionFlow/') },
  prototype: { port: 5174, title: 'FractionFlow subtraction prototype', path: (env) => `${normalizeBase(env.BASE_PATH || '/FractionFlow/')}prototypes/subtraction/` },
};
const live = (entry) => Boolean(entry?.child && !entry.exited);
function normalizeBase(base) { const leading = base.startsWith('/') ? base : `/${base}`; return leading.endsWith('/') ? leading : `${leading}/`; }

export class OwnedServers {
  constructor({ platform = process.platform, env = process.env, spawnImpl = spawn, fetchImpl = fetch, output = process.stdout, timeoutMs = 15000, cleanupTimeoutMs = 5000, ports = {} } = {}) {
    this.platform = platform; this.env = env; this.spawnImpl = spawnImpl; this.fetchImpl = fetchImpl; this.output = output;
    this.timeoutMs = timeoutMs; this.cleanupTimeoutMs = cleanupTimeoutMs; this.entries = new Map(); this.ports = { learner: 5173, prototype: 5174, ...ports };
    for (const [name, port] of Object.entries(this.ports)) if (!SERVERS[name] || !Number.isInteger(port) || port < 1024 || port > 65535) throw new Error(`Invalid server port mapping for ${name}.`);
  }
  status() { return [...this.entries.values()].map(({ name, state, url }) => ({ name, state, url: state === 'ready' ? url : null })); }
  start(name) {
    const spec = SERVERS[name]; if (!spec) throw new Error(`Unknown server: ${name}`);
    const prior = this.entries.get(name);
    if (prior && live(prior)) return Promise.resolve({ ok: prior.state === 'ready', duplicate: true, url: prior.state === 'ready' ? prior.url : null, state: prior.state });
    const invocation = serverInvocation(name, this.ports[name]);
    const entry = { name, state: 'starting', invocation, readyUrl: null, exited: false, messages: [], waiters: [], port: this.ports[name] };
    this.entries.set(name, entry);
    let child;
    try { child = this.spawnImpl(invocation.executable, invocation.args, { cwd: invocation.cwd, env: { ...this.env }, shell: false, stdio: invocation.stdio, windowsHide: true }); }
    catch (error) { entry.state = 'failed'; this.entries.delete(name); return Promise.resolve({ ok: false, launchError: error.message }); }
    entry.child = child;
    child.stdout?.on('data', (chunk) => this.output.write(String(chunk)));
    child.stderr?.on('data', (chunk) => this.output.write(String(chunk)));
    child.on('message', (message) => {
      entry.messages.push(message);
      if (message?.type === 'ready') { entry.readyUrl = message.url; entry.readyEvidence = true; }
      if (message?.type === 'start-error') entry.startError = message.error;
      if (message?.type === 'stop-error') entry.stopError = message.error;
      for (const wake of entry.waiters.splice(0)) wake();
    });
    child.on('error', (error) => {
      entry.spawnError = error;
      if (child.pid == null) { entry.launchFailed = true; entry.exited = true; entry.state = 'failed'; }
      else { entry.ipcError = error; if (entry.state !== 'stopping') entry.state = 'cleanup-failed'; }
      for (const wake of entry.waiters.splice(0)) wake();
    });
    child.once('exit', (code, signal) => { entry.exit = { code, signal }; entry.exited = true; if (entry.state !== 'stopping') entry.state = 'exited'; for (const wake of entry.waiters.splice(0)) wake(); });
    return this.awaitReady(name, entry, spec);
  }
  async awaitReady(name, entry, spec) {
    const deadline = Date.now() + this.timeoutMs;
    while (Date.now() < deadline && live(entry)) {
      if (entry.startError) break;
      if (entry.ipcError) break;
      if (entry.readyEvidence && entry.readyUrl) {
        try {
          const expected = new URL(entry.readyUrl);
          if (expected.hostname !== '127.0.0.1' || Number(expected.port) !== entry.port || expected.pathname !== spec.path(this.env)) throw new Error('Child reported an unexpected URL.');
          const response = await this.fetchImpl(expected, { signal: AbortSignal.timeout(1000) });
          const body = await response.text();
          if (response.ok && body.includes(`<title>${spec.title}</title>`) && live(entry) && entry.state === 'starting') {
            entry.url = expected.href; entry.state = 'ready'; return { ok: true, url: entry.url, state: 'ready' };
          }
        } catch (error) { if (error.message === 'Child reported an unexpected URL.') { entry.startError = error.message; break; } }
      }
      await new Promise((resolve) => { const timer = setTimeout(resolve, 75); entry.waiters.push(() => { clearTimeout(timer); resolve(); }); });
    }
    const reason = entry.cancelled ? 'startup canceled by stop/console shutdown' : entry.startError ? `startup error: ${entry.startError}` : entry.launchFailed ? `launch error: ${entry.spawnError?.message || 'child could not start'}` : entry.ipcError ? `child IPC error while process may still be live: ${entry.ipcError.message}` : entry.exit ? `process exited (${entry.exit.code ?? entry.exit.signal})` : 'timed out waiting for this child readiness and matching app response';
    if (entry.launchFailed) { if (this.entries.get(name) === entry) this.entries.delete(name); return { ok: false, reason }; }
    if (entry.startError) {
      const exitDeadline = Date.now() + this.cleanupTimeoutMs;
      while (!entry.exited && Date.now() < exitDeadline) await delay(30);
      if (entry.exited) { if (this.entries.get(name) === entry) this.entries.delete(name); return { ok: false, reason }; }
      entry.state = 'cleanup-failed';
      return { ok: false, reason: `${reason}; child did not exit after reporting startup failure` };
    }
    const cleanup = await this.stopEntry(entry);
    if (!cleanup.ok && cleanup.reason !== 'No server owned by this console.') return { ok: false, reason: `${reason}; cleanup failed: ${cleanup.reason}` };
    if (this.entries.get(name) === entry) this.entries.delete(name);
    return { ok: false, reason };
  }
  stop(name) {
    const entry = this.entries.get(name);
    if (!entry) return Promise.resolve({ ok: false, reason: 'No server owned by this console.' });
    return this.stopEntry(entry);
  }
  stopEntry(entry) {
    if (entry.stopPromise) return entry.stopPromise;
    entry.stopPromise = this.stopOwnedEntry(entry);
    return entry.stopPromise;
  }
  async stopOwnedEntry(entry) {
    const name = entry.name;
    if (entry.exited) {
      if (this.entries.get(name) === entry) this.entries.delete(name);
      return { ok: true, alreadyExited: true, note: 'Child had already exited before Stop; shutdown acknowledgement and any crash-time descendant cleanup were unavailable.' };
    }
    if (!entry.child?.connected) { entry.state = 'cleanup-failed'; return { ok: false, reason: 'Owned IPC channel is disconnected before close acknowledgement.' }; }
    entry.cancelled = entry.state === 'starting';
    entry.state = 'stopping';
    try { entry.child.send({ type: 'stop' }); }
    catch (error) { entry.state = 'cleanup-failed'; return { ok: false, reason: `Could not request cooperative close: ${error.message}` }; }
    const deadline = Date.now() + this.cleanupTimeoutMs;
    while (Date.now() < deadline && !entry.exited && !entry.stopError && !entry.messages.some((message) => message?.type === 'stopped')) {
      await new Promise((resolve) => { const timer = setTimeout(resolve, 50); entry.waiters.push(() => { clearTimeout(timer); resolve(); }); });
    }
    const acknowledged = entry.messages.some((message) => message?.type === 'stopped');
    if (entry.stopError) { entry.state = 'cleanup-failed'; return { ok: false, reason: `Child close failed: ${entry.stopError}` }; }
    if (!acknowledged) { entry.state = 'cleanup-failed'; return { ok: false, reason: entry.exited ? 'Child exited before close acknowledgement.' : 'Timed out waiting for close acknowledgement.' }; }
    while (Date.now() < deadline && !entry.exited) await delay(30);
    if (!entry.exited) { entry.state = 'cleanup-failed'; return { ok: false, reason: 'Child acknowledged close but did not exit before timeout.' }; }
    if (entry.exit?.code !== 0) { entry.state = 'cleanup-failed'; return { ok: false, reason: `Child exited after close acknowledgement with ${entry.exit?.code ?? entry.exit?.signal}.` }; }
    const spec = SERVERS[name];
    let portClear = false;
    try { await this.fetchImpl(`http://127.0.0.1:${entry.port}/`, { signal: AbortSignal.timeout(300) }); }
    catch { portClear = true; }
    if (this.entries.get(name) === entry) this.entries.delete(name);
    return { ok: true, portClear, ...(portClear ? {} : { note: 'Expected port is responding after owned child exit; occupant is unverified and was left untouched.' }) };
  }
  stopAll() {
    if (this.stopAllPromise) return this.stopAllPromise;
    this.stopAllPromise = (async () => {
      const results = [];
      for (const entry of [...this.entries.values()]) results.push({ name: entry.name, ...await this.stopEntry(entry) });
      return results;
    })();
    return this.stopAllPromise;
  }
}

export { SERVERS };
