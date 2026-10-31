// Unit tests for the keyboard map (src/js/keymap.js): which physical keys the calculator uses.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const CalcKeymap = require('../src/js/keymap.js');
const { CalcEngine } = require('./helpers.js');
const cmd = (key, mods) => CalcKeymap.commandForKey(Object.assign({ key }, mods));

test('T-FR-13: digits and the decimal point', () => {
  for (const d of '0123456789') assert.equal(cmd(d), d);
  assert.equal(cmd('.'), '.');
});

test('T-FR-13: a comma works as a decimal point (approved alias)', () => {
  assert.equal(cmd(','), '.');
});

test('T-FR-13: operators', () => {
  for (const op of ['+', '-', '*', '/']) assert.equal(cmd(op), op);
});

test('T-FR-13: equals, backspace and clear', () => {
  assert.equal(cmd('Enter'), '=');
  assert.equal(cmd('='), '=');
  assert.equal(cmd('Backspace'), 'BACKSPACE');
  assert.equal(cmd('Escape'), 'CLEAR');
});

test('T-FR-13: keys the calculator does not use are left to the browser', () => {
  for (const k of ['a', 'x', 'F5', 'Tab', ' ', 'Shift', 'ArrowLeft', '%', 'Delete', '(', 'Dead']) {
    assert.equal(cmd(k), null, k);
  }
});

test('T-FR-13: keys with Ctrl, Alt or Meta are never intercepted (browser shortcuts keep working)', () => {
  for (const mod of ['ctrlKey', 'altKey', 'metaKey']) {
    for (const k of ['1', 'c', 'r', '+', 'Enter', 'Backspace', 'Escape']) {
      assert.equal(cmd(k, { [mod]: true }), null, `${mod} + ${k}`);
    }
  }
});

test('T-FR-13: Shift alone does not block a key (typing + needs Shift on many keyboards)', () => {
  assert.equal(cmd('+', { shiftKey: true }), '+');
  assert.equal(cmd('*', { shiftKey: true }), '*');
});

test('T-FR-13: bad input is safe', () => {
  assert.equal(CalcKeymap.commandForKey(undefined), null);
  assert.equal(CalcKeymap.commandForKey({}), null);
  assert.equal(CalcKeymap.commandForKey({ key: 5 }), null);
  assert.equal(CalcKeymap.commandForKey({ key: '5', isComposing: true }), null);
});

test('T-FR-13: every key name the keymap returns is understood by the engine', () => {
  const s = CalcEngine.initialState();
  for (const k of ['0', '5', '.', ',', '+', '-', '*', '/', 'Enter', '=', 'Backspace', 'Escape']) {
    const name = cmd(k);
    assert.ok(name, k);
    assert.ok(CalcEngine.KEYS.includes(name), `${k} -> ${name}`);
    assert.doesNotThrow(() => CalcEngine.press(s, name));
  }
});
