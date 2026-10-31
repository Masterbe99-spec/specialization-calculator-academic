// Small helpers shared by the test files. This file is not a test itself.
'use strict';
const CalcEngine = require('../src/js/engine.js');
const CalcFormat = require('../src/js/format.js');

// In a key sequence string, most characters are key names themselves
// ('7', '.', '+', '-', '*', '/', '='). Three letters stand for longer key names:
const LETTER_KEYS = { c: 'CLEAR', b: 'BACKSPACE', n: 'NEGATE' };

// Press every key of `sequence`, starting from `start` (default: a fresh state).
function run(sequence, start) {
  let state = start || CalcEngine.initialState();
  for (const ch of sequence) state = CalcEngine.press(state, LETTER_KEYS[ch] || ch);
  return state;
}

// What the user would see after pressing the keys.
function view(sequence, start) {
  return CalcFormat.display(run(sequence, start));
}
const shown = (sequence, start) => view(sequence, start).main;

module.exports = { CalcEngine, CalcFormat, run, view, shown };
