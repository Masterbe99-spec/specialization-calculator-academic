// engine.js: the rules of the calculator.
//
// This file knows NOTHING about the web page (no document, no buttons).
// It is a "state machine": you give it the current state and a key name,
// and it gives you back the next state. See docs/03-design-prototype/architecture.md.
//
//   const next = CalcEngine.press(state, '7');
//
// Rules of the design:
//  - press() never changes the state it receives. It returns a new, frozen state.
//  - Keys that do nothing in the current situation return the SAME state object.
//  - Numbers are plain JavaScript numbers. They are never rounded here (decision D3);
//    rounding for display is done in format.js.
//  - There is no eval and no expression parser. Only two numbers are combined at a time.
(function (root) {
  'use strict';

  const MAX_DIGITS = 12; // requirement FR-12

  // Every key name the engine understands.
  const KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '=', 'CLEAR', 'BACKSPACE', 'NEGATE'];
  const OPERATORS = ['+', '-', '*', '/'];

  // A state has five fields:
  //   phase       'ready' | 'entering' | 'operatorPending' | 'result' | 'error'
  //   entry       the digits being typed, as text ("12.5"), so "0." and "1.50" are kept exactly
  //   accumulator the stored left-hand number (or the result), a JavaScript number, or null
  //   operator    the pending operator ('+', '-', '*', '/') or null
  //   error       null, 'DIV_ZERO', 'OVERFLOW' or 'UNDERFLOW'
  function makeState(phase, entry, accumulator, operator, error) {
    return Object.freeze({ phase, entry, accumulator, operator, error });
  }

  const INITIAL = makeState('ready', '0', null, null, null);

  function initialState() {
    return INITIAL;
  }

  // ---- small helpers -------------------------------------------------------

  function isDigit(key) {
    return key.length === 1 && key >= '0' && key <= '9';
  }

  // Digits only: the minus sign and the decimal point are not counted (FR-12).
  function countDigits(entry) {
    return entry.replace(/[^0-9]/g, '').length;
  }

  // "0", "0.", "0.0" are all zero. (Number('0.') is 0.)
  function isZeroEntry(entry) {
    return Number(entry) === 0;
  }

  // Combine two numbers. Returns { value } or { error }.
  function calculate(left, operator, right) {
    let result;
    if (operator === '+') result = left + right;
    else if (operator === '-') result = left - right;
    else if (operator === '*') result = left * right;
    else {
      if (right === 0) return { error: 'DIV_ZERO' };
      result = left / right;
    }
    if (!Number.isFinite(result)) return { error: 'OVERFLOW' };
    // Two non-zero numbers can multiply or divide to something too small to store: it would become 0.
    if (result === 0 && (operator === '*' || operator === '/') && left !== 0 && right !== 0) return { error: 'UNDERFLOW' };
    return { value: result === 0 ? 0 : result }; // never keep -0
  }

  // The Error state keeps the numbers that caused the error so that the display can show them.
  function errorState(state, code) {
    return makeState('error', state.entry, state.accumulator, state.operator, code);
  }

  // ---- one function per kind of key ---------------------------------------

  function pressDigit(state, digit) {
    if (state.phase === 'entering') {
      if (countDigits(state.entry) >= MAX_DIGITS) return state; // FR-12: the 13th digit is ignored
      const entry = state.entry === '0' ? digit : state.entry + digit; // a lone 0 is replaced
      return makeState('entering', entry, state.accumulator, state.operator, null);
    }
    return startNumber(state, digit);
  }

  function pressPoint(state) {
    if (state.phase === 'entering') {
      if (state.entry.includes('.')) return state; // FR-02: one point per number
      return makeState('entering', state.entry + '.', state.accumulator, state.operator, null);
    }
    return startNumber(state, '0.');
  }

  // Begin typing a new number from any phase except 'entering'.
  function startNumber(state, firstText) {
    if (state.phase === 'operatorPending') {
      return makeState('entering', firstText, state.accumulator, state.operator, null); // keep the left number and operator
    }
    return makeState('entering', firstText, null, null, null); // ready, result, error: a fresh start
  }

  function pressOperator(state, operator) {
    switch (state.phase) {
      case 'ready':
        return makeState('operatorPending', '0', 0, operator, null);
      case 'operatorPending':
        return makeState('operatorPending', '0', state.accumulator, operator, null); // FR-08: replace the operator
      case 'result':
        return makeState('operatorPending', '0', state.accumulator, operator, null); // continue from the result
      case 'entering': {
        const right = Number(state.entry);
        if (state.operator === null) return makeState('operatorPending', '0', right, operator, null);
        // Immediate execution (decision D1): finish the pending operation first.
        const outcome = calculate(state.accumulator, state.operator, right);
        if (outcome.error) return errorState(state, outcome.error);
        return makeState('operatorPending', '0', outcome.value, operator, null);
      }
      default:
        return state; // 'error': ignored
    }
  }

  function pressEquals(state) {
    if (state.phase !== 'entering') return state; // FR-18 and decision D11: nothing to calculate
    const right = Number(state.entry);
    if (state.operator === null) return makeState('result', '0', right === 0 ? 0 : right, null, null);
    const outcome = calculate(state.accumulator, state.operator, right);
    if (outcome.error) return errorState(state, outcome.error);
    return makeState('result', '0', outcome.value, null, null);
  }

  function pressBackspace(state) {
    if (state.phase !== 'entering') return state; // only typed digits can be deleted
    let entry = state.entry.slice(0, -1);
    if (entry === '' || entry === '-') entry = '0';
    return makeState('entering', entry, state.accumulator, state.operator, null);
  }

  function pressNegate(state) {
    if (state.phase === 'entering') {
      if (isZeroEntry(state.entry)) return state; // FR-15: zero stays 0
      const entry = state.entry.startsWith('-') ? state.entry.slice(1) : '-' + state.entry;
      return makeState('entering', entry, state.accumulator, state.operator, null);
    }
    if (state.phase === 'result' && state.accumulator !== 0) {
      return makeState('result', '0', -state.accumulator, null, null);
    }
    return state;
  }

  // ---- the public function --------------------------------------------------

  function press(state, key) {
    if (typeof key !== 'string') return state;
    if (isDigit(key)) return pressDigit(state, key);
    if (OPERATORS.includes(key)) return pressOperator(state, key);
    switch (key) {
      case '.': return pressPoint(state);
      case '=': return pressEquals(state);
      case 'CLEAR': return INITIAL;
      case 'BACKSPACE': return pressBackspace(state);
      case 'NEGATE': return pressNegate(state);
      default: return state; // unknown keys are ignored (FR-14: there is no percent key)
    }
  }

  const api = { initialState, press, KEYS, MAX_DIGITS };
  if (typeof module === 'object' && module.exports) module.exports = api; // for the Node tests
  else root.CalcEngine = api; // in the browser
})(typeof globalThis !== 'undefined' ? globalThis : this);
