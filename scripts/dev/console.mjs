import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { commandForAction, menuInventory } from './console-commands.mjs';
import { OwnedServers } from './console-servers.mjs';

export async function execute(invocation, { spawnImpl = spawn } = {}) {
  return new Promise((resolve) => {
    let child;
    try { child = spawnImpl(invocation.executable, invocation.args, { cwd: invocation.cwd, shell: false, stdio: invocation.stdio, windowsHide: true }); }
    catch (error) { resolve({ ok: false, launchError: error.message }); return; }
    child.once('error', (error) => resolve({ ok: false, launchError: error.message }));
    child.once('exit', (code, signal) => resolve({ ok: code === 0, code, signal }));
  });
}

async function ask(rl, prompt) { return (await rl.question(prompt)).trim(); }
async function confirm(rl, invocation) {
  output.write(`\nThis action may write local files.\nCommand: ${invocation.display}\n`);
  return (await ask(rl, 'Run this command? (y/N): ')).toLowerCase() === 'y';
}
export async function confirmAndRun(invocation, confirmFn, executeFn = run) {
  if (!await confirmFn(invocation)) return { ok: false, cancelled: true };
  return executeFn(invocation);
}
async function run(invocation, options = {}) {
  output.write(`\n> ${invocation.display}\n`);
  const result = await execute(invocation, options);
  if (result.launchError) output.write(`Launch error: ${result.launchError}\n`);
  else if (result.code !== 0) output.write(`Command exited with ${result.code ?? result.signal}\n`);
  return result;
}

export async function runConsole({ inputStream = input, outputStream = output, servers = new OwnedServers(), handleSigint = true } = {}) {
  const rl = readline.createInterface({ input: inputStream, output: outputStream });
  let interrupted = false;
  let cleanupPromise;
  const cleanup = () => cleanupPromise ||= (async () => {
    const results = await servers.stopAll();
    for (const result of results) {
      if (!result.ok) outputStream.write(`Cleanup failed for ${result.name}: ${result.reason}\n`);
      else if (result.note) outputStream.write(`Cleanup note for ${result.name}: ${result.note}\n`);
    }
    return results;
  })();
  const closeInput = () => { rl.close(); inputStream.pause?.(); inputStream.unref?.(); };
  const onSigint = () => { if (interrupted) return; interrupted = true; outputStream.write('\nStopping owned servers…\n'); void cleanup().finally(closeInput); };
  if (handleSigint) process.once('SIGINT', onSigint);
  try {
    while (!interrupted) {
      outputStream.write('\nFractionFlow local development console\n  1. Local development\n  2. Tests & builds\n  3. Packet status\n  4. Advanced\n  0. Exit\n');
      const choice = await ask(rl, 'Choose an action: ');
      if (choice === '0' || choice.toLowerCase() === 'exit') break;
      if (choice === '1') {
        const action = await ask(rl, 'Local: 1 learner, 2 subtraction prototype, 3 stop owned server, 4 status, 0 back: ');
        if (action === '1' || action === '2') {
          const name = action === '1' ? 'learner' : 'prototype';
          outputStream.write(`Starting ${name} server (owned by this console)…\n`);
          const result = await servers.start(name);
          if (result.state === 'ready') outputStream.write(`${result.duplicate ? 'Already running' : 'Ready'}: ${result.url}\n`);
          else if (result.duplicate) outputStream.write(`${name} server is ${result.state}; no second process was started.\n`);
          else outputStream.write(`Could not start ${name}: ${result.reason || result.launchError}\n`);
        } else if (action === '3') {
          const entries = servers.status();
          if (!entries.length) outputStream.write('No owned servers.\n');
          else {
            const name = await ask(rl, `Stop which owned server (${entries.map((entry) => entry.name).join('/')})? `);
            const result = await servers.stop(name);
            outputStream.write(result.ok ? `Stopped ${name}.${result.note ? ` ${result.note}` : ''}\n` : `Stop failed: ${result.reason}\n`);
          }
        } else if (action === '4') outputStream.write(`${JSON.stringify(servers.status(), null, 2)}\n`);
      } else if (choice === '2') {
        const action = await ask(rl, 'Tests & builds: 1 npm test, 2 npm run build, 0 back: ');
        if (action === '1') await run(commandForAction('test'));
        else if (action === '2') { const invocation = commandForAction('build'); const result = await confirmAndRun(invocation, (item) => confirm(rl, item)); if (result.cancelled) outputStream.write('Cancelled; nothing executed.\n'); }
      } else if (choice === '3') {
        const action = await ask(rl, 'Packet status: 1 list, 2 check, 3 lint, 0 back: ');
        const actionByChoice = { 1: 'list', 3: 'lint' };
        if (action === '2') {
          const id = await ask(rl, 'Packet id: ');
          if (/^[a-z0-9-]+$/i.test(id)) await run(commandForAction('check', [id])); else outputStream.write('Invalid packet id.\n');
        } else if (actionByChoice[action]) await run(commandForAction(actionByChoice[action]));
      } else if (choice === '4') {
        const action = await ask(rl, 'Advanced: 1 npm run test:routes, 2 render packet index, 0 back: ');
        if (action === '1') await run(commandForAction('routes'));
        else if (action === '2') { const invocation = commandForAction('render'); const result = await confirmAndRun(invocation, (item) => confirm(rl, item)); if (result.cancelled) outputStream.write('Cancelled; nothing executed.\n'); }
      }
    }
  } catch (error) { if (!interrupted) outputStream.write(`Console error: ${error.message}\n`); }
  finally { if (handleSigint) process.removeListener('SIGINT', onSigint); await cleanup(); closeInput(); }
  return interrupted ? 130 : 0;
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.includes('--list')) { output.write(`${JSON.stringify(menuInventory(), null, 2)}\n`); return 0; }
  return runConsole();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) process.exitCode = await main();
