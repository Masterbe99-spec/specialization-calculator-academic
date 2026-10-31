// Browser drivers used by tests/browser-check.js. Node built-ins only (fetch, WebSocket, child_process).
//
//  startChromium(exe, url)  Edge or Chrome, controlled with the Chrome DevTools Protocol.
//  startFirefox(exe, url)   Firefox, controlled with WebDriver BiDi (built into Firefox; no driver program needed).
//
// Both return the same small object so that the checks can be written once:
//   version, problems[], requests[], evalJs(expr), pressKey(key, modifiers), mouseClick(x, y),
//   setViewport(width, height, scale), reload(), screenshot(), axTree() (null if not available),
//   evalUnderCsp(expr) (null if not available), close()
// modifiers: 8 = Shift (the only one used).
'use strict';
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const openSocket = (url) => new Promise((resolve, reject) => {
  const ws = new WebSocket(url);
  ws.onopen = () => resolve(ws);
  ws.onerror = (e) => reject(new Error('WebSocket error ' + (e.message || '')));
});

// ------------------------------------------------------------------ Chromium (Edge, Chrome)
async function startChromium(exe, pageUrl) {
  const PORT = 9333;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'calc-browser-'));
  const child = spawn(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1000,900', pageUrl], { stdio: 'ignore' });

  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find((t) => t.type === 'page' && t.url.startsWith('file:'));
    } catch (e) { /* browser still starting */ }
  }
  if (!target) { child.kill(); throw new Error('Could not connect to the browser'); }
  const version = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).Browser;
  const ws = await openSocket(target.webSocketDebuggerUrl);

  let nextId = 1;
  const pending = new Map();
  const problems = [];
  const requests = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
    if (msg.method === 'Network.requestWillBeSent') requests.push(msg.params.request.url);
    if (msg.method === 'Runtime.exceptionThrown') problems.push('exception: ' + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
    if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type)) problems.push('console.' + msg.params.type + ': ' + msg.params.args.map((a) => a.value || a.description).join(' '));
    if (msg.method === 'Log.entryAdded' && ['error', 'warning'].includes(msg.params.entry.level)) problems.push('log ' + msg.params.entry.level + ': ' + msg.params.entry.text + ' ' + (msg.params.entry.url || ''));
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const id = nextId++;
    pending.set(id, (msg) => (msg.error ? rej(new Error(method + ': ' + msg.error.message)) : res(msg.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
  await send('Accessibility.enable'); await send('Network.enable');

  const KEYCODES = { Enter: [13, '\r'], Backspace: [8], Escape: [27], Tab: [9], ' ': [32, ' '] };
  return {
    name: 'chromium', shotSuffix: '', networkBlocked: false, reportsSubresources: true, version, problems, requests,
    async evalJs(expression) {
      const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error('page error: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
      return r.result.value;
    },
    async pressKey(key, modifiers = 0) {
      const [vk, txt] = KEYCODES[key] || [key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0, key.length === 1 ? key : undefined];
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key.length === 1 ? undefined : key, windowsVirtualKeyCode: vk, text: txt, modifiers });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key.length === 1 ? undefined : key, windowsVirtualKeyCode: vk, modifiers });
    },
    async mouseClick(x, y) {
      for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
        await send('Input.dispatchMouseEvent', { type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: type === 'mouseMoved' ? 0 : 1 });
      }
    },
    setViewport: (width, height, scale = 1) => send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: false }),
    reload: () => send('Page.reload'),
    async screenshot() { return Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).data, 'base64'); },
    async axTree() { return (await send('Accessibility.getFullAXTree')).nodes; },
    // DELIBERATE: tries eval() inside the page with the page's CSP enforced, to prove it is blocked. The app never uses eval.
    async evalUnderCsp(expression) {
      const r = await send('Runtime.evaluate', { expression, returnByValue: true, allowUnsafeEvalBlockedByCSP: false });
      return r.result.value;
    },
    async close() {
      try { ws.close(); } catch (e) { /* ignore */ }
      child.kill(); await sleep(500);
      try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* the browser may still hold files */ }
    },
  };
}

// ------------------------------------------------------------------ Firefox (WebDriver BiDi)
function bidiValue(v) { // turn a BiDi "remote value" into a plain JavaScript value
  if (!v) return undefined;
  switch (v.type) {
    case 'undefined': return undefined;
    case 'null': return null;
    case 'string': case 'boolean': return v.value;
    case 'number': return v.value === 'NaN' ? NaN : v.value === 'Infinity' ? Infinity : v.value === '-Infinity' ? -Infinity : v.value === '-0' ? -0 : v.value;
    case 'array': case 'set': return (v.value || []).map(bidiValue);
    case 'object': return Object.fromEntries((v.value || []).map(([k, val]) => [typeof k === 'string' ? k : bidiValue(k), bidiValue(val)]));
    default: return v.value;
  }
}
const FF_KEYS = { Enter: '', Backspace: '', Escape: '', Tab: '', Shift: '' };

async function startFirefox(exe, pageUrl) {
  const PORT = 9444;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'calc-firefox-'));
  // A clean throw-away profile with the first-run, update and telemetry features switched off.
  fs.writeFileSync(path.join(profile, 'user.js'), [
    'user_pref("browser.shell.checkDefaultBrowser", false);', 'user_pref("browser.startup.page", 0);',
    'user_pref("browser.aboutwelcome.enabled", false);', 'user_pref("datareporting.policy.dataSubmissionEnabled", false);',
    'user_pref("datareporting.healthreport.uploadEnabled", false);', 'user_pref("toolkit.telemetry.enabled", false);',
    'user_pref("app.update.auto", false);', 'user_pref("app.update.enabled", false);', 'user_pref("browser.search.update", false);',
    'user_pref("startup.homepage_welcome_url", "about:blank");', 'user_pref("browser.tabs.warnOnClose", false);',
    // No network at all: every web request goes to a proxy on a dead port. The calculator is a local file, so it must work anyway.
    'user_pref("network.proxy.type", 1);', 'user_pref("network.proxy.http", "127.0.0.1");', 'user_pref("network.proxy.http_port", 9);',
    'user_pref("network.proxy.ssl", "127.0.0.1");', 'user_pref("network.proxy.ssl_port", 9);', 'user_pref("network.proxy.no_proxies_on", "");',
  ].join('\n'));
  let log = '';
  // Headless by default. Firefox started by an automated session does not get real keyboard focus even with a visible window
  // (document.hasFocus() stays false; tried with browsingContext.activate and an operating-system activation call), so the
  // focus-dependent checks are skipped there. Set FIREFOX_HEADED=1 to show the window.
  const headless = process.env.FIREFOX_HEADED !== '1';
  const child = spawn(exe, [...(headless ? ['-headless'] : []), '-no-remote', '-profile', profile, `--remote-debugging-port=${PORT}`, 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });
  child.stderr.on('data', (d) => { log += d; });
  child.stdout.on('data', (d) => { log += d; });

  let ws;
  for (let i = 0; i < 80 && !ws; i++) {
    await sleep(250);
    try { ws = await openSocket(`ws://127.0.0.1:${PORT}/session`); } catch (e) { /* not listening yet */ }
  }
  if (!ws) { child.kill(); throw new Error('Could not connect to Firefox (WebDriver BiDi). Output: ' + log.slice(0, 400)); }

  let nextId = 1;
  const pending = new Map();
  const problems = [];
  const requests = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
    if (msg.type !== 'event') return;
    if (msg.method === 'log.entryAdded' && ['warn', 'error'].includes(msg.params.level)) problems.push(`log.${msg.params.level} (${msg.params.type}): ${msg.params.text}`);
    if (msg.method === 'network.beforeRequestSent' && !String(msg.params.request.url).startsWith('about:')) requests.push(msg.params.request.url);
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const id = nextId++;
    pending.set(id, (msg) => (msg.type === 'error' ? rej(new Error(`${method}: ${msg.error} ${msg.message}`)) : res(msg.result)));
    ws.send(JSON.stringify({ id, method, params }));
  });

  const session = await send('session.new', { capabilities: { alwaysMatch: {} } });
  const version = 'Firefox/' + ((session.capabilities && session.capabilities.browserVersion) || '?');
  const tree = await send('browsingContext.getTree', {});
  const context = tree.contexts[0].context;
  await send('session.subscribe', { events: ['log.entryAdded', 'network.beforeRequestSent'], contexts: [context] });
  await send('browsingContext.navigate', { context, url: pageUrl, wait: 'complete' });
  // A headless window starts without focus, and then :focus-visible and Enter/Space on buttons do not work. Give it focus.
  const activate = () => send('browsingContext.activate', { context });
  await activate();

  const evaluate = async (expression) => {
    const r = await send('script.evaluate', { expression, target: { context }, awaitPromise: true, resultOwnership: 'none', serializationOptions: { maxObjectDepth: 6 } });
    if (r.type === 'exception') throw new Error('page error: ' + (r.exceptionDetails && r.exceptionDetails.text));
    return bidiValue(r.result);
  };
  return {
    name: 'firefox', shotSuffix: '-firefox', networkBlocked: true, reportsSubresources: false, version, problems, requests,
    evalJs: evaluate,
    async pressKey(key, modifiers = 0) {
      const value = FF_KEYS[key] || key;
      const actions = [];
      if (modifiers & 8) actions.push({ type: 'keyDown', value: FF_KEYS.Shift });
      actions.push({ type: 'keyDown', value }, { type: 'keyUp', value });
      if (modifiers & 8) actions.push({ type: 'keyUp', value: FF_KEYS.Shift });
      await send('input.performActions', { context, actions: [{ type: 'key', id: 'keyboard', actions }] });
    },
    async mouseClick(x, y) {
      await send('input.performActions', { context, actions: [{ type: 'pointer', id: 'mouse', parameters: { pointerType: 'mouse' }, actions: [
        { type: 'pointerMove', x: Math.round(x), y: Math.round(y), origin: 'viewport' }, { type: 'pointerDown', button: 0 }, { type: 'pointerUp', button: 0 }] }] });
    },
    setViewport: (width, height, scale = 1) => send('browsingContext.setViewport', { context, viewport: { width, height }, devicePixelRatio: scale }),
    reload: async () => { await send('browsingContext.reload', { context, wait: 'complete' }); await activate(); },
    async screenshot() { return Buffer.from((await send('browsingContext.captureScreenshot', { context })).data, 'base64'); },
    async axTree() { return null; }, // WebDriver BiDi has no accessibility-tree command
    async evalUnderCsp() { return null; }, // BiDi evaluation may bypass the page's CSP, so the eval() test is not meaningful here
    async close() {
      try { await send('browser.close', {}); } catch (e) { /* ignore */ }
      try { ws.close(); } catch (e) { /* ignore */ }
      child.kill(); await sleep(800);
      try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* the browser may still hold files */ }
    },
  };
}

module.exports = { startChromium, startFirefox };
