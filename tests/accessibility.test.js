// Automated accessibility checks that need no browser: colour contrast read from the real stylesheet,
// and a few rules about the HTML. (Screen readers and real users still need a human: see the test plan.)
//   WCAG 1.4.3 text contrast >= 4.5:1, WCAG 1.4.11 control borders and focus ring >= 3:1.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'css', 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');

// Read the colours from ":root { --name: #RRGGBB; }".
const colour = {};
for (const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;/g)) colour[m[1]] = m[2].toUpperCase();

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05); // not rounded: 4.499 does not pass 4.5 (WCAG note)
}

test('T-NFR-04: the colours the page uses were found in the stylesheet', () => {
  for (const name of ['panel', 'page', 'digit', 'func', 'op', 'eq', 'eq-ink', 'border', 'ink', 'ink2', 'op-ink', 'err', 'focus']) {
    assert.match(colour[name] || '', /^#[0-9A-F]{6}$/, 'missing colour --' + name);
  }
});

test('T-NFR-04: text contrast is at least 4.5:1 (WCAG 1.4.3, Level AA)', () => {
  const pairs = [
    ['display text on panel', 'ink', 'panel'], ['expression line on panel', 'ink2', 'panel'], ['digit key text', 'ink', 'digit'],
    ['function key text', 'ink', 'func'], ['operator key text', 'op-ink', 'op'], ['equals key text', 'eq-ink', 'eq'],
    ['error text on panel', 'err', 'panel'], ['help and title text on page', 'ink', 'page'], ['help text on panel', 'ink', 'panel'],
  ];
  for (const [label, fg, bg] of pairs) {
    const r = ratio(colour[fg], colour[bg]);
    assert.ok(r >= 4.5, `${label}: ${r.toFixed(2)}:1`);
  }
});

test('T-NFR-04: key borders and the focus ring have at least 3:1 contrast (WCAG 1.4.11, Level AA)', () => {
  const pairs = [
    ['key border on panel', 'border', 'panel'], ['key border on white key', 'border', 'digit'], ['key border on function key', 'border', 'func'],
    ['key border on operator key', 'border', 'op'], ['key border on page', 'border', 'page'],
    ['focus ring on panel', 'focus', 'panel'], ['focus ring on page', 'focus', 'page'], ['equals key against panel', 'eq', 'panel'],
  ];
  for (const [label, fg, bg] of pairs) {
    const r = ratio(colour[fg], colour[bg]);
    assert.ok(r >= 3, `${label}: ${r.toFixed(2)}:1`);
  }
});

test('T-NFR-04: the stylesheet defines a visible focus style and respects reduced motion', () => {
  assert.match(css, /\.key:focus-visible[\s\S]*?outline:\s*3px solid var\(--focus\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /outline:\s*(none|0)\b/, 'a focus outline is never removed');
});

test('T-NFR-03: keys are designed at least 48 x 48 px', () => {
  assert.match(css, /\.key\s*\{[^}]*min-width:\s*48px/);
  const minHeight = Number((css.match(/\.key\s*\{[^}]*min-height:\s*(\d+)px/) || [])[1]);
  assert.ok(minHeight >= 48, 'min-height ' + minHeight);
});

test('T-NFR-04: the page has a title, one h1, a language, a viewport meta tag and a live display', () => {
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.doesNotMatch(html, /user-scalable\s*=\s*no|maximum-scale\s*=\s*1\b/, 'zooming must not be disabled');
  assert.match(html, /<output[^>]*aria-live="polite"/);
  assert.match(html, /role="alert"/);
});
