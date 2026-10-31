// Browser verification of src/index.html. NOT part of `node --test` (it opens a real browser).
//
//   node tests/browser-check.js                 Microsoft Edge or Google Chrome (first one found)
//   BROWSER="C:\path\to\chrome.exe" node tests/browser-check.js
//   node tests/browser-check.js --firefox       Firefox (set FIREFOX="C:\path\to\firefox.exe" if it is not found)
//   node tests/browser-check.js --shots         also save screenshots to evidence/screenshots/
//
// How it works: it starts the browser headless, opens the page from file://, and controls it with
// a protocol built into the browser (DevTools Protocol for Edge and Chrome, WebDriver BiDi for Firefox),
// using only Node.js built-ins. It clicks with the mouse, presses real keys and reads the page.
// Nothing is sent anywhere. See tests/browser-backends.js for the two drivers.
// Checks that need Chromium's accessibility-tree command are reported as SKIP in Firefox, not as passed.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { startChromium, startFirefox } = require('./browser-backends.js');

const root = path.resolve(__dirname, '..');
const pageUrl = pathToFileURL(path.join(root, 'src', 'index.html')).href;
const wantShots = process.argv.includes('--shots');

function findChromium() {
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
function findFirefox() {
  const candidates = [
    process.env.FIREFOX,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'Mozilla Firefox', 'firefox.exe'),
    'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
    '/usr/bin/firefox', '/Applications/Firefox.app/Contents/MacOS/firefox',
  ].filter(Boolean);
  return candidates.find((p) => fs.existsSync(p));
}

const results = [];
let skipped = 0;
function skip(name, why) {
  skipped++;
  console.log(`SKIP  ${name}   -> ${why}`);
}
function check(name, ok, detail) {
  results.push({ name, ok: !!ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || detail === undefined ? '' : '   -> ' + detail}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const wantFirefox = process.argv.includes('--firefox');
  const exe = wantFirefox ? findFirefox() : findChromium();
  if (!exe) {
    console.log(wantFirefox ? 'Firefox not found. Set the FIREFOX environment variable.' : 'No Edge or Chrome found. Set the BROWSER environment variable.');
    process.exit(2);
  }
  const backend = wantFirefox ? await startFirefox(exe, pageUrl) : await startChromium(exe, pageUrl);
  try {
    console.log(`Browser: ${backend.version}   Page: ${pageUrl}\n`);
    const { problems, requests, evalJs } = backend;
    await backend.reload(); await sleep(800);

    // ---- helpers that act like a user ----
    const text = (id) => evalJs(`document.getElementById('${id}').textContent`);
    const display = () => text('display');
    const pressKey = (key, modifiers = 0) => backend.pressKey(key, modifiers);
    async function typeKeys(seq) { for (const ch of seq) await pressKey(ch === '\n' ? 'Enter' : ch); }
    async function clickKey(dataKey) {
      const pos = await evalJs(`(() => { const b = document.querySelector('[data-key="${dataKey}"]'); b.scrollIntoView({ block: 'center', inline: 'center' }); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
      await backend.mouseClick(pos.x, pos.y);
    }
    // Click a sequence like "7+8=": letters c, b, n stand for Clear, Backspace, Negate.
    const NAMES = { c: 'CLEAR', b: 'BACKSPACE', n: 'NEGATE' };
    async function clicks(seq) { for (const ch of seq) await clickKey(NAMES[ch] || ch); }
    const clear = () => clickKey('CLEAR');
    const topOf = (dataKey) => evalJs(`document.querySelector('[data-key="${dataKey}"]').getBoundingClientRect().top`);
    const shot = async (file) => {
      if (!wantShots) return;
      fs.writeFileSync(path.join(root, 'evidence', 'screenshots', file.replace('.png', backend.shotSuffix + '.png')), await backend.screenshot());
    };
    const setViewport = (w, h = 800) => backend.setViewport(w, h, 1);
    // Some browsers (Firefox started by an automated session) never get real keyboard focus. Then behaviour that depends on focus
    // (the :focus-visible ring, Enter and Space on a focused button) cannot be tested, and those checks are skipped, not passed.
    let hasFocus = true;
    const focusCheck = (name, ok, detail) => (hasFocus ? check(name, ok, detail) : skip(name, 'this automated window has no keyboard focus (document.hasFocus() is false; a plain page behaves the same), so focus-dependent behaviour cannot be tested here'));

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
    await backend.reload(); await sleep(800);
    hasFocus = await evalJs('document.hasFocus()');
    for (let i = 0; i < 5; i++) await pressKey('Tab');
    check('T-NFR-04: Tab reaches the keys in visual order (C, backspace, sign, divide, 7)', (await evalJs(`document.activeElement.dataset.key`)) === '7', await evalJs(`document.activeElement.dataset.key`));
    const ring = await evalJs(`(() => { const s = getComputedStyle(document.activeElement); return { w: s.outlineWidth, st: s.outlineStyle, off: s.outlineOffset }; })()`);
    focusCheck('T-NFR-04: the focused key has a visible 3 px focus ring', ring.st === 'solid' && ring.w === '3px', JSON.stringify(ring));
    if (hasFocus) await shot('2026-10-31-app-focus-desktop.png'); // without real focus the ring would be missing and the picture misleading
    await pressKey('Enter');
    focusCheck('T-NFR-04: Enter on a focused key presses that key (7), not "equals"', (await display()) === '7', await display());
    await pressKey(' ');
    focusCheck('T-NFR-04: Space on a focused key presses that key (77)', (await display()) === '77', await display());
    await pressKey('Escape'); await clicks('4+5');
    const focusAfterClick = await evalJs('document.activeElement.tagName');
    await pressKey('Enter');
    check('UI: after a mouse click focus is released, so Enter means "equals" (4 + 5 Enter = 9)', focusAfterClick === 'BODY' && (await display()) === '9', `${focusAfterClick}, ${await display()}`);
    await pressKey('Escape');
    await backend.reload(); await sleep(800);
    for (let i = 0; i < 20; i++) await pressKey('Tab'); // 19 keys, then the help summary
    check('T-NFR-04: Tab continues to the help summary after the last key', (await evalJs(`document.activeElement.tagName`)) === 'SUMMARY', await evalJs(`document.activeElement.tagName`));
    await pressKey('Enter');
    focusCheck('T-NFR-04: Enter on the help summary opens it (it is not taken as "equals")', (await evalJs(`document.querySelector('details').open`)) === true && (await display()) === '0');
    await pressKey('Enter');
    await evalJs('document.activeElement.blur()');

    // ================= 6. Accessibility tree =================
    const ax = await backend.axTree();
    if (ax) {
      const buttons = ax.filter((n) => n.role && n.role.value === 'button' && !n.ignored);
      const names = buttons.map((n) => (n.name && n.name.value) || '');
      check('T-NFR-04: the accessibility tree has 19 buttons, all with a name', buttons.length === 19 && names.every((n) => n.length > 0), `${buttons.length} buttons; names: ${names.join(', ')}`);
      const wanted = ['Clear', 'Delete last digit', 'Change sign', 'Divided by', 'Times', 'Minus', 'Plus', 'Equals', 'Decimal point'];
      check('T-NFR-04: the operator keys are named in words (Divided by, Times, Minus, Plus, Equals ...)', wanted.every((w) => names.includes(w)), names.join(', '));
      const status = ax.find((n) => n.role && n.role.value === 'status');
      check('T-NFR-04: the display is exposed as a live status region', !!status, ax.filter((n) => !n.ignored).map((n) => n.role && n.role.value).slice(0, 20).join(','));
      const alertNode = ax.find((n) => n.role && n.role.value === 'alert');
      check('T-NFR-04: the error line is exposed as an alert', !!alertNode);
    } else {
      skip('T-NFR-04: accessibility tree (19 named buttons, status region, alert)', 'this browser driver has no accessibility-tree command');
    }
    // Names that every browser can report from the page itself (labels and roles in the markup):
    const markup = await evalJs(`(() => { const b = [...document.querySelectorAll('button')]; return { count: b.length, unnamed: b.filter((x) => !(x.getAttribute('aria-label') || x.textContent.trim())).length, output: document.getElementById('display').tagName, live: document.getElementById('display').getAttribute('aria-live'), alertRole: document.getElementById('error').getAttribute('role') }; })()`);
    check('T-NFR-04: in the markup there are 19 buttons, all with a label or text; the display is an <output aria-live="polite">; the error line has role="alert"', markup.count === 19 && markup.unnamed === 0 && markup.output === 'OUTPUT' && markup.live === 'polite' && markup.alertRole === 'alert', JSON.stringify(markup));
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


    // ================= 7b. Phase 4: zoom, enlarged text, live region, offline, CSP, keyboard-only =================
    // Browser zoom is emulated the way WCAG describes it: 200 % of a 1280 x 1024 window is a 640 x 512 CSS-pixel
    // viewport at 2x pixel density, and 400 % is 320 x 256 at 4x.
    async function measure() {
      return evalJs(`(() => {
        const keys = [...document.querySelectorAll('.key')].map((k) => k.getBoundingClientRect());
        const d = document.getElementById('display'); const screen = document.querySelector('.screen');
        return { docWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, dpr: window.devicePixelRatio,
          minW: Math.min(...keys.map((r) => r.width)), minH: Math.min(...keys.map((r) => r.height)),
          keysInside: keys.every((r) => r.left >= 0 && r.right <= window.innerWidth + 0.5),
          displayFits: d.scrollWidth <= d.clientWidth + 1, screenFits: screen.scrollHeight <= screen.clientHeight + 1, text: d.textContent };
      })()`);
    }
    for (const [label, w, h, scale] of [['zoom 200 %', 640, 512, 2], ['zoom 400 %', 320, 256, 4]]) {
      await backend.setViewport(w, h, scale);
      await clear(); await clicks('1234567890123n');
      const m1 = await measure();
      await clear(); await typeKeys('999999999999*999999999999\n');
      const m2 = await measure();
      check(`T-NFR-05 ${label} (${w} x ${h} CSS px @${scale}x): no horizontal scrolling, all keys inside the viewport`, m1.docWidth <= m1.innerWidth && m1.keysInside, JSON.stringify(m1));
      check(`T-NFR-05 ${label}: long numbers fit the display ("${m1.text}", "${m2.text}") and the display area does not overflow`, m1.text === '-123456789012' && m2.text === '9.99999999998e+23' && m1.displayFits && m2.displayFits && m1.screenFits && m2.screenFits, JSON.stringify([m1, m2]));
      check(`T-NFR-03 ${label}: keys stay at least 48 x 48 CSS px`, m1.minW >= 48 && m1.minH >= 48, `${m1.minW} x ${m1.minH}`);
      if (scale === 4) { await clear(); await clicks('7+8'); await shot('2026-10-31-app-zoom400-320x256.png'); }
    }
    // Enlarged text only (the browser "font size" setting), emulated by scaling the root font size.
    await setViewport(320, 900);
    for (const percent of [150, 200]) {
      await evalJs(`document.documentElement.style.fontSize = '${percent}%'`);
      await clear(); await clicks('1234567890123n');
      const t1 = await measure();
      await clear(); await typeKeys('999999999999*999999999999\n');
      const t2 = await measure();
      check(`T-NFR-05 text size ${percent} % at 320 px: no horizontal scrolling and keys inside`, t1.docWidth <= t1.innerWidth && t1.keysInside, JSON.stringify(t1));
      check(`T-NFR-05 text size ${percent} % at 320 px: long numbers stay inside the display ("${t1.text}", "${t2.text}")`, t1.text === '-123456789012' && t2.text === '9.99999999998e+23' && t1.displayFits && t2.displayFits && t1.screenFits && t2.screenFits, JSON.stringify([t1, t2]));
      if (percent === 200) { await clear(); await clicks('7+8'); await shot('2026-10-31-app-text200-320px.png'); }
    }
    await evalJs(`document.documentElement.style.fontSize = ''`);
    await setViewport(1000, 800); await clear();

    // The live region: properties from the browser's accessibility tree (this is NOT a screen-reader test).
    await clicks('7+8=');
    const axNodes = await backend.axTree();
    if (axNodes) {
      const statusNode = axNodes.find((n) => n.role && n.role.value === 'status');
      const props = Object.fromEntries(((statusNode && statusNode.properties) || []).map((q) => [q.name, q.value.value]));
      const childText = ((statusNode && statusNode.childIds) || []).map((id) => axNodes.find((n) => n.nodeId === id)).map((n) => (n && n.name && n.name.value) || '').join('');
      check('T-NFR-04 live region: the display is a polite, atomic live region (aria-live="polite", aria-atomic)', props.live === 'polite' && props.atomic === true, JSON.stringify(props));
      check('T-NFR-04 live region: after 7 + 8 = the accessibility tree holds the new value "15"', childText === '15', childText);
      await clear(); await clicks('5/0=');
      const axAlert = (await backend.axTree()).find((n) => n.role && n.role.value === 'alert');
      check('T-NFR-04 live region: the error message sits in an alert region ("Cannot divide by zero")', !!axAlert && (await text('error')) === 'Cannot divide by zero', await text('error'));
    } else {
      skip('T-NFR-04 live region: properties and values in the accessibility tree', 'this browser driver has no accessibility-tree command');
      const attrs = await evalJs(`(() => { const d = document.getElementById('display'); return { live: d.getAttribute('aria-live'), atomic: d.getAttribute('aria-atomic'), text: d.textContent }; })()`);
      check('T-NFR-04 live region (markup): aria-live="polite", aria-atomic="true", and the text updates to "15"', attrs.live === 'polite' && attrs.atomic === 'true' && attrs.text === '15', JSON.stringify(attrs));
    }
    await clear();

    // Offline operation: the page asked only for local files.
    requests.length = 0;
    await backend.reload(); await sleep(900);
    const outside = requests.filter((u) => !u.startsWith('file:'));
    if (backend.reportsSubresources) {
      check(`T-NFR-07 offline: reloading made ${requests.length} requests, all to local files, none to the network`, requests.length >= 6 && outside.length === 0, outside.join(', '));
    } else {
      // Firefox reports only the page itself for file: loads. Its test profile has all web access switched off (a proxy on a dead port),
      // so a calculator that still works proves that it needs no network.
      check(`T-NFR-07 offline: with all web access switched off the page loaded from the local file (${requests.length} request reported, none outside file:) and the calculator still works`,
        outside.length === 0 && (await display()) === '0' && (await evalJs(`typeof CalcEngine`)) === 'object', outside.join(', '));
      await clicks('2+2=');
      check('T-NFR-07 offline: a calculation works with web access switched off (2 + 2 = 4)', (await display()) === '4', await display());
      await clear();
    }

    // The Content-Security-Policy is really enforced (each attempt must be blocked and reported by the browser as a CSP violation).
    const before = problems.length;
    await evalJs(`(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective)); return 0; })()`);
    const inlineRan = await evalJs(`(() => { window.__inline = false; const s = document.createElement('script'); s.textContent = 'window.__inline = true'; document.body.appendChild(s); return window.__inline; })()`);
    const externalRan = await evalJs(`new Promise((resolve) => { const s = document.createElement('script'); s.src = 'https://example.invalid/x.js'; s.onload = () => resolve('loaded'); s.onerror = () => resolve('blocked'); document.body.appendChild(s); })`);
    // DELIBERATE: the next call tries eval() inside the page with the policy enforced, to prove it is blocked. The app never uses eval.
    const evalResult = await backend.evalUnderCsp(`(() => { try { return String(eval('1+1')); } catch (e) { return e.name; } })()`);
    await sleep(400);
    problems.splice(before); // the browser also writes these blocks to its console; they are expected here
    const violated = await evalJs('window.__csp');
    check('T-NFR-06 CSP: an inline script injected into the page does not run', inlineRan === false);
    check('T-NFR-06 CSP: a script from another website is blocked', externalRan === 'blocked', externalRan);
    if (evalResult === null) skip('T-NFR-06 CSP: eval() is blocked by the policy', 'evaluation through this driver may bypass the page policy, so the test is not meaningful');
    else check('T-NFR-06 CSP: eval() is blocked by the policy', evalResult === 'EvalError', String(evalResult));
    check('T-NFR-06 CSP: the browser raised a "securitypolicyviolation" event for the inline script and for the outside script (2 expected)', violated.length >= 2 && violated.every((d) => /^script-src/.test(d)), JSON.stringify(violated));
    await backend.reload(); await sleep(900);

    // Keyboard-only: a calculation with Tab, Shift+Tab, Space and Enter alone. No mouse, no calculator shortcut keys.
    hasFocus = await evalJs('document.hasFocus()');
    const order = await evalJs(`[...document.querySelectorAll('[data-key]')].map((b) => b.dataset.key)`);
    const expectedOrder = ['CLEAR', 'BACKSPACE', 'NEGATE', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='];
    check('T-NFR-04 focus order: the order of the keys in the page is the visual order (row by row, left to right)', JSON.stringify(order) === JSON.stringify(expectedOrder), order.join(' '));
    let currentIndex = -1;
    async function focusKey(dataKey) {
      const target = order.indexOf(dataKey);
      let guard = 0;
      while (currentIndex !== target && guard++ < 30) {
        if (currentIndex < target) { await pressKey('Tab'); currentIndex++; } else { await pressKey('Tab', 8); currentIndex--; }
      }
      const active = await evalJs(`document.activeElement.dataset.key`);
      if (active !== dataKey) throw new Error(`keyboard-only navigation failed: wanted ${dataKey}, focus is on ${active}`);
    }
    for (const [dk, how] of [['7', ' '], ['+', 'Enter'], ['8', ' '], ['=', 'Enter']]) { await focusKey(dk); await pressKey(how); }
    focusCheck('T-FR-13 keyboard only: 7 + 8 = typed with Tab, Shift+Tab, Space and Enter alone gives 15', (await display()) === '15', await display());
    await focusKey('CLEAR'); await pressKey('Enter');
    focusCheck('T-FR-13 keyboard only: the Clear key works from the keyboard', (await display()) === '0', await display());
    for (const dk of ['9', '/', '0', '=']) { await focusKey(dk); await pressKey(' '); }
    focusCheck('T-FR-09 keyboard only: 9 ÷ 0 = shows the error and its message', (await display()) === 'Error' && (await text('error')) === 'Cannot divide by zero', await display());
    await focusKey('4'); await pressKey(' ');
    focusCheck('T-FR-09 keyboard only: a digit recovers from the error', (await display()) === '4', await display());
    await backend.reload(); await sleep(900);
    await setViewport(1000, 800);

    // ================= 8. Random keys in the real page =================
    let seed = 20261031;
    const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const pool = '0123456789.+-*/=\n,'.split('');
    let randomOk = true; let bad = '';
    for (let i = 0; i < 1000; i++) {
      const k = pool[Math.floor(rand() * pool.length)];
      await pressKey(k === '\n' ? 'Enter' : k);
      if (i % 25 === 0) await pressKey('Escape');
      const d = await display();
      if (!/^(Error|-?\d+(\.\d*)?|-?\d(\.\d+)?e[+-]\d+)$/.test(d)) { randomOk = false; bad = d; break; }
    }
    check('T-NFR-02 (browser): 1000 random key presses never produce an invalid display', randomOk, bad);

    // ================= 9. Console =================
    check('CONSOLE: no console errors, warnings, exceptions or CSP violations during the whole run', problems.length === 0, problems.join(' | '));
  } finally {
    await backend.close();
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed} passed, ${failed} failed, ${results.length} checks` + (skipped ? `, ${skipped} skipped (not available in this browser)` : ''));
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error('browser-check crashed:', e.message); process.exit(2); });
