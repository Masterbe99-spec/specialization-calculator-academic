// format.js: turns numbers and calculator states into display text.
//
// Like engine.js, this file knows nothing about the web page.
//
// DISPLAY POLICY (decision D3, tested in tests/format.test.js):
//  1. Show at most 12 significant digits. Remove trailing zeros.   0.30000000000000004 -> 0.3
//  2. Use normal notation from 0.0001 up to (but not including) 1e12.
//  3. Use exponential notation outside that range.                 9.99999999998e+23, 1e-13
//  4. Zero is shown as 0 (never -0). A non-zero number is never shown as 0.
//  5. Only the TEXT is rounded. The engine keeps the full number.
(function (root) {
  'use strict';

  const SIGNIFICANT_DIGITS = 12;
  const FIXED_MIN = 1e-4; // smaller non-zero numbers use exponential notation
  const FIXED_MAX = 1e12; // this and larger numbers use exponential notation

  const OPERATOR_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  const ERROR_MESSAGES = {
    DIV_ZERO: 'Cannot divide by zero',
    OVERFLOW: 'Number too large',
    UNDERFLOW: 'Number too small',
  };

  // "1.50000" -> "1.5", "100" stays "100" (only decimals lose their zeros).
  function trimZeros(text) {
    return text.includes('.') ? text.replace(/0+$/, '').replace(/\.$/, '') : text;
  }

  function formatNumber(value) {
    if (typeof value !== 'number') throw new TypeError('formatNumber needs a number');
    if (!Number.isFinite(value)) throw new RangeError('formatNumber needs a finite number');
    if (value === 0) return '0';

    // Round to 12 significant digits first, so that the choice of notation matches what the user will see.
    const rounded = Math.abs(Number(value.toPrecision(SIGNIFICANT_DIGITS)));
    if (rounded >= FIXED_MAX || rounded < FIXED_MIN) {
      const [mantissa, exponent] = value.toExponential(SIGNIFICANT_DIGITS - 1).split('e'); // "1.00000000000", "+12"
      return trimZeros(mantissa) + 'e' + exponent;
    }
    return trimZeros(value.toPrecision(SIGNIFICANT_DIGITS));
  }

  // What the user sees: { main, expression, errorMessage }.
  function display(state) {
    let main;
    let expression = '';
    let errorMessage = null;

    switch (state.phase) {
      case 'entering':
        main = state.entry; // exactly as typed
        if (state.operator !== null) expression = formatNumber(state.accumulator) + ' ' + OPERATOR_SYMBOLS[state.operator];
        break;
      case 'operatorPending':
        main = formatNumber(state.accumulator);
        expression = main + ' ' + OPERATOR_SYMBOLS[state.operator];
        break;
      case 'result':
        main = formatNumber(state.accumulator);
        break;
      case 'error':
        main = 'Error';
        errorMessage = ERROR_MESSAGES[state.error];
        expression = formatNumber(state.accumulator) + ' ' + OPERATOR_SYMBOLS[state.operator] + ' ' + state.entry;
        break;
      default: // 'ready'
        main = state.entry;
    }
    return { main, expression, errorMessage };
  }

  const api = { formatNumber, display, ERROR_MESSAGES, OPERATOR_SYMBOLS };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CalcFormat = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
