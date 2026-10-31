import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function cmdToken(value) {
  const text = String(value);
  if (!/^[A-Za-z0-9_./:=+-]+$/.test(text)) throw new Error(`Unsupported Windows command argument: ${text}`);
  return text;
}

export function packageScriptInvocation(script, args = [], platform = process.platform, env = process.env) {
  if (!['dev:console', 'dev', 'dev:prototype', 'test', 'build', 'test:routes'].includes(script)) throw new Error(`Unsupported package script: ${script}`);
  if (platform === 'win32') {
    const commandLine = ['npm', 'run', script, '--', ...args].map(cmdToken).join(' ');
    return { kind: 'package-script', platform, executable: 'cmd.exe', args: ['/d', '/s', '/c', commandLine], cwd: ROOT, stdio: 'inherit', display: `cmd.exe /d /s /c "${commandLine}"` };
  }
  const executable = 'npm';
  return { kind: 'package-script', platform, executable, args: ['run', script, '--', ...args], cwd: ROOT, stdio: 'inherit', display: `${executable} run ${script}${args.length ? ` -- ${args.join(' ')}` : ''}` };
}

export function nodeScriptInvocation(script, args = []) {
  if (!['scripts/dev/plan-status.js'].includes(script)) throw new Error(`Unsupported Node command: ${script}`);
  const argv = [path.join(ROOT, script), ...args];
  const quote = (value) => /[\s"']/u.test(String(value)) ? JSON.stringify(String(value)) : String(value);
  return { kind: 'node-script', executable: process.execPath, args: argv, cwd: ROOT, stdio: 'inherit', display: [process.execPath, ...argv].map(quote).join(' ') };
}

export function serverInvocation(name, port = name === 'learner' ? 5199 : 5174) {
  if (!['learner', 'prototype'].includes(name)) throw new Error(`Unknown server: ${name}`);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Server port must be an integer from 1024 through 65535.');
  const helper = path.join(ROOT, 'scripts/dev/console-server-child.mjs');
  const args = [helper, name, String(port)];
  return { kind: 'owned-vite-server', executable: process.execPath, args, cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe', 'ipc'], shell: false, display: `${JSON.stringify(process.execPath)} ${JSON.stringify(helper)} ${name} ${port}` };
}

export function menuInventory() {
  return [
    { id: 'local', title: 'Local development', actions: [{ id: 'start-learner', command: serverInvocation('learner') }, { id: 'start-prototype', command: serverInvocation('prototype') }, { id: 'stop-owned' }, { id: 'show-servers' }] },
    { id: 'tests-builds', title: 'Tests & builds', actions: [{ id: 'test', command: commandForAction('test') }, { id: 'build', confirmationRequired: true, command: commandForAction('build') }] },
    { id: 'packet-status', title: 'Packet status', actions: [{ id: 'list', command: commandForAction('list') }, { id: 'check', commandTemplate: commandForAction('check', ['<id>']) }, { id: 'lint', command: commandForAction('lint') }] },
    { id: 'advanced', title: 'Advanced', actions: [{ id: 'routes', command: commandForAction('routes') }, { id: 'render', confirmationRequired: true, command: commandForAction('render') }] },
    { id: 'exit', title: 'Exit', actions: [] },
  ];
}

export function commandForAction(action, args = [], platform = process.platform) {
  if (action === 'test') return packageScriptInvocation('test', [], platform);
  if (action === 'build') return packageScriptInvocation('build', [], platform);
  if (action === 'routes') return packageScriptInvocation('test:routes', args, platform);
  if (action === 'learner' || action === 'prototype') return serverInvocation(action);
  if (['list', 'lint', 'render'].includes(action)) return nodeScriptInvocation('scripts/dev/plan-status.js', [action]);
  if (action === 'check') return nodeScriptInvocation('scripts/dev/plan-status.js', ['check', ...args]);
  throw new Error(`Unknown console action: ${action}`);
}
