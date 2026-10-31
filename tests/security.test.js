// Static checks of the source files (inspection made repeatable).
//  T-NFR-06: no eval, no Function constructor, no innerHTML, no outside scripts.
//  T-NFR-08: the calculation files never touch the page.
//  T-NFR-07: the page needs no build step or server.
//  T-NFR-04: every button has an accessible name.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const src = path.join(__dirname, '..', 'src');
const read = (rel) => fs.readFileSync(path.join(src, rel), 'utf8');
// Comments may legitimately say "never use innerHTML", so the code checks look at the code only.
const code = (rel) => read(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:"'])\/\/.*$/gm, '$1');
const jsFiles = ['js/engine.js', 'js/format.js', 'js/keymap.js', 'js/app.js'];

test('T-NFR-06: no eval, Function constructor, string timers or innerHTML in the JavaScript', () => {
  for (const f of jsFiles) {
    const text = code(f);
    assert.doesNotMatch(text, /\beval\s*\(/, f + ' uses eval');
    assert.doesNotMatch(text, /\bnew\s+Function\b|\bFunction\s*\(/, f + ' uses the Function constructor');
    assert.doesNotMatch(text, /\bset(Timeout|Interval)\s*\(\s*['"`]/, f + ' uses a string timer');
    assert.doesNotMatch(text, /\binnerHTML\b|\bouterHTML\b|\binsertAdjacentHTML\b|document\.write/, f + ' writes HTML');
  }
});

test('T-NFR-06: the page loads only its own files (no CDN, no outside URLs)', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /(src|href)\s*=\s*["']\s*(https?:)?\/\//i);
  assert.match(html, /Content-Security-Policy/);
  for (const f of [...jsFiles, 'css/styles.css']) assert.doesNotMatch(read(f), /https?:\/\//, f + ' mentions an outside URL');
});

test('T-NFR-06: no storage, cookies or network calls (no personal data is kept)', () => {
  for (const f of jsFiles) {
    assert.doesNotMatch(code(f), /localStorage|sessionStorage|document\.cookie|fetch\s*\(|XMLHttpRequest|indexedDB/, f);
  }
});

test('T-NFR-08: engine.js, format.js and keymap.js never touch the page', () => {
  for (const f of ['js/engine.js', 'js/format.js', 'js/keymap.js']) {
    assert.doesNotMatch(code(f), /\bdocument\b|\bwindow\b|\bnavigator\b|\blocation\b|\bgetElementById\b|\bquerySelector/, f);
  }
});

test('T-NFR-07: classic scripts only, in the right order, with no build step', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /type\s*=\s*["']module["']/);
  const order = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(order, ['js/engine.js', 'js/format.js', 'js/keymap.js', 'js/app.js']);
  for (const f of jsFiles) assert.doesNotMatch(code(f), /^\s*(import|export)\s/m, f + ' uses import/export');
});

test('T-NFR-04: every button has a name, a type, and the page has a language', () => {
  const html = read('index.html');
  assert.match(html, /<html[^>]*\slang="en"/);
  const buttons = [...html.matchAll(/<button\b([^>]*)>([^<]*)<\/button>/g)];
  assert.equal(buttons.length, 19, 'the calculator has 19 keys');
  for (const [, attrs, text] of buttons) {
    assert.ok(/aria-label="[^"]+"/.test(attrs) || /^\d$/.test(text.trim()), `unnamed button: ${attrs} ${text}`);
    assert.match(attrs, /type="button"/);
  }
});
