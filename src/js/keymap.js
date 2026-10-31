// keymap.js: which physical keyboard keys the calculator uses.
//
// commandForKey(event) returns an engine key name ('7', '+', '=', 'CLEAR', ...) or null.
// null means "this key is not ours": the browser must handle it (Tab, F5, Ctrl+C, ...).
// The function only reads the event; it does not touch the page, so it can be tested in Node.
(function (root) {
  'use strict';

  const SIMPLE_KEYS = {
    '.': '.',
    ',': '.', // a comma works as a decimal point (approved alias; the display always shows a period)
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '=': '=',
    Enter: '=',
    Backspace: 'BACKSPACE',
    Escape: 'CLEAR',
  };

  function commandForKey(event) {
    if (!event || typeof event.key !== 'string') return null;
    // Never take over browser shortcuts such as Ctrl+C, Ctrl+R or Alt+Left.
    if (event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return null;
    const key = event.key;
    if (key.length === 1 && key >= '0' && key <= '9') return key;
    return Object.prototype.hasOwnProperty.call(SIMPLE_KEYS, key) ? SIMPLE_KEYS[key] : null;
  }

  const api = { commandForKey };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CalcKeymap = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
