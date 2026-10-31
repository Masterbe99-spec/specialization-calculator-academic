// Browser verification of src/index.html. NOT part of `node --test` (it opens a real browser).
//
//   node tests/browser-check.js                 look for Microsoft Edge or Google Chrome
//   BROWSER="C:\path\to\browser.exe" node tests/browser-check.js
//   node tests/browser-check.js --shots         also save screenshots to evidence/screenshots/
//
// How it works: it starts the browser in headless mode, opens the page from file://, and controls it
// with the Chrome DevTools Protocol over a WebSocket (built into Node 22+). It clicks with the mouse,
// presses real keys, and reads the page. Nothing is installed and nothing is sent anywhere.
// It tests ONE browser (the one found), so Firefox is not covered.
'use strict';
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const pageUrl = pathToFileURL(path.join(root, 'src', 'index.html')).href;
const wantShots = process.argv.includes('--shots');
const PORT = 9333;

function findBrowser() {
  const candidates = [
    process.env.BROWSER,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/microsoft-edge',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ].filter(Boolean);
  return candidates.find((p) => fs.existsSync(p));
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || detail === undefined ? '' : '   -> ' + detail}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const exe = findBrowser();
  if (!exe) { console.log('No Edge or Chrome found. Set the BROWSER environment variable.'); process.exit(2); }
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'calc-browser-'));
  const child = spawn(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1000,900', pageUrl], { stdio: 'ignore' });

  let ws;
  try {
    // Find the page and connect.
    let target;
    for (let i = 0; i < 60 && !target; i++) {
      await sleep(250);
      try {
        const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
        target = list.find((t) => t.type === 'page' && t.url.startsWith('file:'));
      } catch (e) { /* browser still starting */ }
    }
    if (!target) throw new Error('Could not connect to the browser');
    const version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
    console.log(`Browser: ${version.Browser}   Page: ${pageUrl}\n`);

    ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let nextId = 1;
    const pending = new Map();
    const problems = []; // console errors, exceptions, CSP violations
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
      if (msg.method === 'Runtime.exceptionThrown') problems.push('exception: ' + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
      if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type)) problems.push('console.' + msg.params.type + ': ' + msg.params.args.map((a) => a.value || a.description).join(' '));
      if (msg.method === 'Log.entryAdded' && ['error', 'warning'].includes(msg.params.entry.level)) problems.push('log ' + msg.params.entry.level + ': ' + msg.params.entry.text + ' ' + (msg.params.entry.url || ''));
    };
    const send = (method, params = {}) => new Promise((res, rej) => {
      const id = nextId++;
      pending.set(id, (msg) => (msg.error ? rej(new Error(method + ': ' + msg.error.message)) : res(msg.result)));
      ws.send(JSON.stringify({ id, method, params }));
    });
    const evalJs = async (expression) => {
      const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error('page error: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
      return r.result.value;
    };

    await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
    await send('Accessibility.enable');
    await send('Page.reload'); await sleep(800);

    // ---- helpers that act like a user ----
    const text = (id) => evalJs(`document.getElementById('${id}').textContent`);
    const display = () => text('display');
    const KEYCODES = { Enter: [13, '\r'], Backspace: [8], Escape: [27], Tab: [9], ' ': [32, ' '] };
    async function pressKey(key, modifiers = 0) {
      const [vk, txt] = KEYCODES[key] || [key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0, key.length === 1 ? key : undefined];
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key.length === 1 ? undefined : key, windowsVirtualKeyCode: vk, text: txt, modifiers });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key.length === 1 ? undefined : key, windowsVirtualKeyCode: vk, modifiers });
    }
    async function typeKeys(seq) { for (const ch of seq) await pressKey(ch === '\n' ? 'Enter' : ch); }
    async function clickKey(dataKey) {
      const pos = await evalJs(`(() => { const b = document.querySelector('[data-key="${dataKey}"]'); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
      for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
        await send('Input.dispatchMouseEvent', { type, x: pos.x, y: pos.y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: type === 'mouseMoved' ? 0 : 1 });
      }
    }
    // Click a sequence like "7+8=": letters c, b, n stand for Clear, Backspace, Negate.
    const NAMES = { c: 'CLEAR', b: 'BACKSPACE', n: 'NEGATE' };
    async function clicks(seq) { for (const ch of seq) await clickKey(NAMES[ch] || ch); }
    const clear = () => clickKey('CLEAR');
    const topOf = (dataKey) => evalJs(`document.querySelector('[data-key="${dataKey}"]').getBoundingClientRect().top`);
    const shot = async (file) => {
      if (!wantShots) return;
      const r = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(root, 'evidence', 'screenshots', file), Buffer.from(r.data, 'base64'));
    };
    const setViewport = (w, h = 800) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });

    // ================= 1. Page load =================
    await setViewport(1000, 800);
    check('LOAD: the page loaded without console errors, exceptions or CSP violations', problems.length === 0, problems.join(' | '));
    check('LOAD: the calculation scripts are defined (CalcEngine, CalcFormat, CalcKeymap)', await evalJs(`typeof CalcEngine === 'object' && typeof CalcFormat === 'object' && typeof CalcKeymap === 'object'`));
    check('LOAD: the display starts at 0', (await display()) === '0');
    check('LOAD: the page is loaded from file:// (no server)', (await evalJs('location.protocol')) === 'file:');
    check('LOAD: the Content-Security-Policy is present and the app still runs under it', await evalJs(`!!document.querySelector('meta[http-equiv="Content-Security-Policy"]')`) && (await evalJs(`document.querySelectorAll('[data-key]').length`)) === 19);

    // ================= 2. Mouse: every operation =================
    const mouseCases = [
      ['T-FR-03 mouse: 7 + 8 =', '7+8=', '15'], ['T-FR-03 mouse: 9 - 4 =', '9-4=', '5'], ['T-FR-03 mouse: 6 x 7 =', '6*7=', '42'],
      ['T-FR-03 mouse: 8 / 2 =', '8/2=', '4'], ['T-FR-03 mouse: 1.5 + 2.25 =', '1.5+2.25=', '3.75'], ['T-FR-03 mouse: 2 - 5 = (negative)', '2-5=', '-3'],
      ['T-FR-05 mouse: 2 + 3 x 4 = (immediate execution)', '2+3*4=', '20'], ['T-FR-10 mouse: 0.1 + 0.2 =', '0.1+0.2=', '0.3'],
      ['T-FR-10 mouse: 1 / 3 =', '1/3=', '0.333333333333'], ['T-FR-08 mouse: 5 + x 3 = (operator replaced)', '5+*3=', '15'],
      ['T-FR-02 mouse: 1 . 5 . 2 (second point ignored)', '1.5.2', '1.52'], ['T-FR-12 mouse: 13 digits typed, 12 kept', '1234567890123', '123456789012'],
      ['T-FR-15 mouse: 5 +/- shows -5', '5n', '-5'], ['T-FR-07 mouse: 123 backspace', '123b', '12'],
      ['T-FR-04 mouse: 7 + 2 = then 5 starts a new number', '7+2=5', '5'], ['T-FR-18 mouse: 7 + 2 = = (no repeat)', '7+2==', '9'],
    ];
    for (const [name, seq, expected] of mouseCases) {
      await clear(); await clicks(seq);
      const got = await display();
      check(name + ` -> ${expected}`, got === expected, `got "${got}"`);
    }
    await clear(); await clicks('7+');
    check('T-FR-16: the expression line shows the pending operation "7 +"', (await text('expression')) === '7 +', await text('expression'));
    await clear();
    check('T-FR-06: Clear returns the display to 0 and empties the expression line', (await display()) === '0' && (await text('expression')) === '');

    // ================= 3. Division by zero and recovery =================
    await clear();
    const topBefore = await topOf('7');
    await clicks('5/0=');
    const topAfter = await topOf('7');
    check('T-FR-09: 5 / 0 = shows "Error" with the message "Cannot divide by zero"', (await display()) === 'Error' && (await text('error')) === 'Cannot divide by zero', `${await display()} / ${await text('error')}`);
    check('T-FR-09: the failed calculation stays visible ("5 ÷ 0")', (await text('expression')) === '5 ÷ 0', await text('expression'));
    check('T-FR-09: the display never shows NaN or Infinity', !/NaN|Infinity/.test((await display()) + (await text('error'))));
    check('UI: the keys do not move when the error appears (fixed display height)', topBefore === topAfter, `${topBefore} -> ${topAfter}`);
    await shot('2026-10-31-app-error-desktop.png');
    await clicks('7');
    check('T-FR-09: a digit recovers from the error (display 7, message gone)', (await display()) === '7' && (await text('error')) === '', `${await display()} / "${await text('error')}"`);
    await clicks('+1=');
    check('T-FR-09: calculation after recovery is correct (7 + 1 = 8)', (await display()) === '8', await display());
    await clear(); await clicks('5/0='); await clear();
    check('T-FR-09: Clear recovers from the error', (await display()) === '0' && (await text('error')) === '');
    // Overflow with the keyboard
    await typeKeys('999999999999*999999999999\n');
    check('T-FR-11: 999999999999 x 999999999999 = shows 9.99999999998e+23', (await display()) === '9.99999999998e+23', await display());
    let guard = 0;
    while ((await display()) !== 'Error' && guard++ < 40) await typeKeys('*999999999999\n');
    check('T-FR-11: repeated multiplication overflows with the message "Number too large"', (await display()) === 'Error' && (await text('error')) === 'Number too large', `${await display()} / ${await text('error')} after ${guard} steps`);
    await pressKey('Escape');

    // ================= 4. Keyboard =================
    await pressKey('Escape');
    await typeKeys('12+30*2\n');
    check('T-FR-13 keyboard: 12 + 30 * 2 Enter -> 84', (await display()) === '84', await display());
    await pressKey('Escape');
    check('T-FR-13 keyboard: Escape clears', (await display()) === '0');
    await typeKeys('1,5+1=');
    check('T-FR-13 keyboard: a comma works as a decimal point (1,5 + 1 = 2.5)', (await display()) === '2.5', await display());
    await pressKey('Escape'); await typeKeys('123'); await pressKey('Backspace');
    check('T-FR-13 keyboard: Backspace deletes the last digit (123 -> 12)', (await display()) === '12', await display());
    await pressKey('Escape'); await typeKeys('9-4\n');
    check('T-FR-13 keyboard: - and Enter (9 - 4 = 5)', (await display()) === '5', await display());
    await pressKey('Escape'); await typeKeys('8/2=');
    check('T-FR-13 keyboard: / and = (8 / 2 = 4)', (await display()) === '4', await display());
    await pressKey('Escape'); await typeKeys('5/0\n');
    check('T-FR-09 keyboard: 5 / 0 Enter shows the error, and a digit recovers', (await display()) === 'Error' && (await (async () => { await pressKey('3'); return display(); })()) === '3');
    await pressKey('Escape');
    const ctrlNotBlocked = await evalJs(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, cancelable: true, bubbles: true }))`);
    const keyF5NotBlocked = await evalJs(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F5', cancelable: true, bubbles: true }))`);
    const ourKeyBlocked = !(await evalJs(`document.dispatchEvent(new KeyboardEvent('keydown', { key: '7', cancelable: true, bubbles: true }))`));
    check('T-FR-13: browser shortcuts (Ctrl+C, F5) are not blocked, calculator keys are handled', ctrlNotBlocked && keyF5NotBlocked && ourKeyBlocked);
    await pressKey('Escape');

    // ================= 5. Focus, Tab, Enter and Space =================
    // Reload first: browsers start Tab from the last element that was clicked, so a fresh page is needed.
    await send('Page.reload'); await sleep(800);
    for (let i = 0; i < 5; i++) await pressKey('Tab');
    check('T-NFR-04: Tab reaches the keys in visual order (C, backspace, sign, divide, 7)', (await evalJs(`document.activeElement.dataset.key`)) === '7', await evalJs(`document.activeElement.dataset.key`));
    const ring = await evalJs(`(() => { const s = getComputedStyle(document.activeElement); return { w: s.outlineWidth, st: s.outlineStyle, off: s.outlineOffset }; })()`);
    check('T-NFR-04: the focused key has a visible 3 px focus ring', ring.st === 'solid' && ring.w === '3px', JSON.stringify(ring));
    await shot('2026-10-31-app-focus-desktop.png');
    await pressKey('Enter');
    check('T-NFR-04: Enter on a focused key presses that key (7), not "equals"', (await display()) === '7', await display());
    await pressKey(' ');
    check('T-NFR-04: Space on a focused key presses that key (77)', (await display()) === '77', await display());
    await pressKey('Escape'); await clicks('4+5');
    const focusAfterClick = await evalJs('document.activeElement.tagName');
    await pressKey('Enter');
    check('UI: after a mouse click focus is released, so Enter means "equals" (4 + 5 Enter = 9)', focusAfterClick === 'BODY' && (await display()) === '9', `${focusAfterClick}, ${await display()}`);
    await pressKey('Escape');
    await send('Page.reload'); await sleep(800);
    for (let i = 0; i < 20; i++) await pressKey('Tab'); // 19 keys, then the help summary
    check('T-NFR-04: Tab continues to the help summary after the last key', (await evalJs(`document.activeElement.tagName`)) === 'SUMMARY', await evalJs(`document.activeElement.tagName`));
    await pressKey('Enter');
    check('T-NFR-04: Enter on the help summary opens it (it is not taken as "equals")', (await evalJs(`document.querySelector('details').open`)) === true && (await display()) === '0');
    await pressKey('Enter');
    await evalJs('document.activeElement.blur()');

    // ================= 6. Accessibility tree =================
    const ax = (await send('Accessibility.getFullAXTree')).nodes;
    const buttons = ax.filter((n) => n.role && n.role.value === 'button' && !n.ignored);
    const names = buttons.map((n) => (n.name && n.name.value) || '');
    check('T-NFR-04: the accessibility tree has 19 buttons, all with a name', buttons.length === 19 && names.every((n) => n.length > 0), `${buttons.length} buttons; names: ${names.join(', ')}`);
    const wanted = ['Clear', 'Delete last digit', 'Change sign', 'Divided by', 'Times', 'Minus', 'Plus', 'Equals', 'Decimal point'];
    check('T-NFR-04: the operator keys are named in words (Divided by, Times, Minus, Plus, Equals ...)', wanted.every((w) => names.includes(w)), names.join(', '));
    const status = ax.find((n) => n.role && n.role.value === 'status');
    check('T-NFR-04: the display is exposed as a live status region', !!status, ax.filter((n) => !n.ignored).map((n) => n.role && n.role.value).slice(0, 20).join(','));
    const alertNode = ax.find((n) => n.role && n.role.value === 'alert');
    check('T-NFR-04: the error line is exposed as an alert', !!alertNode);
    check('T-NFR-04: the page language is English', (await evalJs('document.documentElement.lang')) === 'en');

    // ================= 7. Responsive layout =================
    for (const width of [320, 360, 768, 1280]) {
      await setViewport(width, 900);
      await clear(); await clicks('1234567890123n');
      const longNegative = await evalJs(`(() => { const d = document.getElementById('display'); return { text: d.textContent, fits: d.scrollWidth <= d.clientWidth + 1 }; })()`);
      await clear(); await typeKeys('999999999999*999999999999\n');
      const exponent = await evalJs(`(() => { const d = document.getElementById('display'); return { text: d.textContent, fits: d.scrollWidth <= d.clientWidth + 1, height: d.getBoundingClientRect().height }; })()`);
      const layout = await evalJs(`(() => {
        const keys = [...document.querySelectorAll('.key')].map((k) => k.getBoundingClientRect());
        const calc = document.querySelector('.calc').getBoundingClientRect();
        const screen = document.querySelector('.screen');
        return { docWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth,
          minW: Math.min(...keys.map((r) => r.width)), minH: Math.min(...keys.map((r) => r.height)),
          allInside: keys.every((r) => r.left >= 0 && r.right <= window.innerWidth + 0.5),
          calcInside: calc.left >= 0 && calc.right <= window.innerWidth + 0.5,
          screenFits: screen.scrollHeight <= screen.clientHeight + 1 };
      })()`);
      check(`T-NFR-05 @${width}px: no horizontal scrolling (page width ${layout.docWidth} <= ${layout.innerWidth})`, layout.docWidth <= layout.innerWidth, JSON.stringify(layout));
      check(`T-NFR-05 @${width}px: all 19 keys and the panel are inside the viewport`, layout.allInside && layout.calcInside);
      check(`T-NFR-03 @${width}px: every key is at least 48 x 48 px (smallest ${layout.minW.toFixed(1)} x ${layout.minH.toFixed(1)})`, layout.minW >= 48 && layout.minH >= 48);
      check(`T-FR-12 @${width}px: a 12-digit negative number fits the display ("${longNegative.text}")`, longNegative.fits && longNegative.text === '-123456789012', JSON.stringify(longNegative));
      check(`T-FR-11 @${width}px: an exponential result fits the display ("${exponent.text}")`, exponent.fits && exponent.text === '9.99999999998e+23', JSON.stringify(exponent));
      check(`UI @${width}px: the display area does not overflow`, layout.screenFits);
      if (width === 320) {
        await clear(); await clicks('7+8');
        await shot('2026-10-31-app-typing-320px.png');
        await clear(); await clicks('5/0=');
        await shot('2026-10-31-app-error-320px.png');
      }
      if (width === 1280) { await clear(); await clicks('7+8'); await shot('2026-10-31-app-typing-desktop.png'); }
    }
    await setViewport(1000, 800); await clear();

    // ================= 8. Random keys in the real page =================
    let seed = 20261031;
    const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const pool = '0123456789.+-*/=\n,'.split('');
    let randomOk = true; let bad = '';
    for (let i = 0; i < 400; i++) {
      const k = pool[Math.floor(rand() * pool.length)];
      await pressKey(k === '\n' ? 'Enter' : k);
      if (i % 25 === 0) await pressKey('Escape');
      const d = await display();
      if (!/^(Error|-?\d+(\.\d*)?|-?\d(\.\d+)?e[+-]\d+)$/.test(d)) { randomOk = false; bad = d; break; }
    }
    check('T-NFR-02 (browser): 400 random key presses never produce an invalid display', randomOk, bad);

    // ================= 9. Console =================
    check('CONSOLE: no console errors, warnings, exceptions or CSP violations during the whole run', problems.length === 0, problems.join(' | '));
  } finally {
    try { ws && ws.close(); } catch (e) { /* ignore */ }
    child.kill();
    await sleep(500);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* the browser may still hold files */ }
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed} passed, ${failed} failed, ${results.length} checks`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error('browser-check crashed:', e.message); process.exit(2); });
