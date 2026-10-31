// Unit tests for number formatting and the display text (src/js/format.js).
// Display policy (decision D3): at most 12 significant digits, trailing zeros removed,
// fixed notation from 0.0001 up to (not including) 1e12, exponential notation otherwise.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { CalcFormat, run } = require('./helpers.js');
const f = CalcFormat.formatNumber;

test('T-FR-10: floating-point noise is hidden in the display', () => {
  assert.equal(f(0.1 + 0.2), '0.3');
  assert.equal(f(0.3 - 0.1), '0.2');
  assert.equal(f(1.1 * 3), '3.3');
  assert.equal(f(0.7 + 0.1), '0.8');
  assert.equal(f((0.1 + 0.7) * 10), '8');
});

test('T-FR-10: repeating decimals show 12 significant digits', () => {
  assert.equal(f(1 / 3), '0.333333333333');
  assert.equal(f(2 / 3), '0.666666666667');
  assert.equal(f(10 / 3), '3.33333333333');
  assert.equal(f(100 / 3), '33.3333333333');
  assert.equal(f(123456.789012345), '123456.789012');
});

test('T-FR-10: trailing zeros and the sign of zero', () => {
  assert.equal(f(100), '100');
  assert.equal(f(1.5), '1.5');
  assert.equal(f(1.50), '1.5');
  assert.equal(f(0), '0');
  assert.equal(f(-0), '0');
  assert.equal(f(-1234.5), '-1234.5');
  assert.equal(f(123456789012), '123456789012');
});

test('T-FR-11: large numbers', () => {
  assert.equal(f(999999999999), '999999999999', 'the largest fixed number');
  assert.equal(f(1e12), '1e+12');
  assert.equal(f(999999999999.9), '1e+12', 'rounding up to 1e12 switches to exponential');
  assert.equal(f(999999999999 * 999999999999), '9.99999999998e+23');
  assert.equal(f(-1.5e300), '-1.5e+300');
  assert.equal(f(Number.MAX_VALUE), '1.79769313486e+308');
});

test('T-FR-11: small numbers', () => {
  assert.equal(f(0.0001), '0.0001', 'the smallest fixed number');
  assert.equal(f(0.00009), '9e-5');
  assert.equal(f(1e-13), '1e-13');
  assert.equal(f(-1e-13), '-1e-13');
  assert.equal(f(5.55111512312578e-17), '5.55111512313e-17');
  assert.equal(f(Number.MIN_VALUE), '4.94065645841e-324');
});

test('T-FR-11: a non-zero number is never displayed as 0', () => {
  for (let e = -323; e <= 308; e += 7) {
    for (const m of [1, 1.5, 9.999999999999, 3.14159]) {
      const v = m * Math.pow(10, e);
      if (v === 0 || !Number.isFinite(v)) continue;
      const text = f(v);
      assert.notEqual(text, '0', `value ${v}`);
      assert.ok(Math.abs(Number(text) / v - 1) < 1e-10 || Math.abs(v) < 1e-300, `${v} shown as ${text}`);
    }
  }
});

test('T-FR-11: formatNumber refuses numbers that are not finite', () => {
  assert.throws(() => f(Infinity), RangeError);
  assert.throws(() => f(-Infinity), RangeError);
  assert.throws(() => f(NaN), RangeError);
  assert.throws(() => f('5'), TypeError);
  assert.throws(() => f(undefined), TypeError);
});

test('T-FR-09/T-FR-11: error messages are plain English', () => {
  assert.equal(CalcFormat.ERROR_MESSAGES.DIV_ZERO, 'Cannot divide by zero');
  assert.equal(CalcFormat.ERROR_MESSAGES.OVERFLOW, 'Number too large');
  assert.equal(CalcFormat.ERROR_MESSAGES.UNDERFLOW, 'Number too small');
});

test('T-FR-16: display() has exactly the fields main, expression, errorMessage', () => {
  const d = CalcFormat.display(run('7+8'));
  assert.deepEqual(Object.keys(d).sort(), ['errorMessage', 'expression', 'main']);
  assert.deepEqual(d, { main: '8', expression: '7 +', errorMessage: null });
  assert.deepEqual(CalcFormat.display(run('5/0=')), { main: 'Error', expression: '5 ÷ 0', errorMessage: 'Cannot divide by zero' });
});

test('T-FR-01: the number being typed is shown exactly as typed', () => {
  assert.equal(CalcFormat.display(run('1.50')).main, '1.50');
  assert.equal(CalcFormat.display(run('0.')).main, '0.');
  assert.equal(CalcFormat.display(run('007')).main, '7');
});
