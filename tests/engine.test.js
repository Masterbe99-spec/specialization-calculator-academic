// Unit tests for the calculation engine (src/js/engine.js) as the user sees it.
// Test names start with the planned test ID (see docs/02-research-requirements/traceability-matrix.md).
// Run:  node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { CalcEngine, run, view, shown } = require('./helpers.js');

const initial = CalcEngine.initialState();

test('T-FR-01: digit entry', () => {
  assert.equal(shown('7'), '7');
  assert.equal(shown('123'), '123');
  assert.equal(shown('05'), '5', 'a leading zero is replaced');
  assert.equal(shown('00'), '0', 'zeros do not pile up');
  assert.equal(shown('00005'), '5');
  assert.equal(shown('0'), '0');
});

test('T-FR-02: decimal point, only one per number', () => {
  assert.equal(shown('.'), '0.', 'starting with a point shows 0.');
  assert.equal(shown('.5'), '0.5');
  assert.equal(shown('1.5.2'), '1.52', 'the second point is ignored');
  assert.equal(shown('0.0'), '0.0');
  assert.equal(shown('1..'), '1.');
});

test('T-FR-02: the decimal-point rule restarts for each new number (lesson L5)', () => {
  assert.equal(shown('1.5+2.5='), '4');
  assert.equal(shown('1.5+2.'), '2.');
  assert.equal(shown('1.5+.5='), '2');
});

test('T-FR-03: addition', () => {
  assert.equal(shown('7+2='), '9');
  assert.equal(shown('1.5+2.25='), '3.75');
  assert.equal(shown('0+0='), '0');
});

test('T-FR-03: subtraction', () => {
  assert.equal(shown('7-2='), '5');
  assert.equal(shown('2-5='), '-3', 'a negative result is allowed');
  assert.equal(shown('0-0='), '0');
});

test('T-FR-03: multiplication', () => {
  assert.equal(shown('7*2='), '14');
  assert.equal(shown('0.5*0.5='), '0.25');
  assert.equal(shown('5*0='), '0');
});

test('T-FR-03: division', () => {
  assert.equal(shown('8/2='), '4');
  assert.equal(shown('1/8='), '0.125');
  assert.equal(shown('0/5='), '0');
});

test('T-FR-04: equals shows the result; a digit then starts a new number', () => {
  assert.equal(shown('7+2='), '9');
  assert.equal(shown('7+2=5'), '5');
  assert.equal(run('7+2=5').phase, 'entering');
});

test('T-FR-04: an operator after equals continues from the result', () => {
  assert.equal(shown('7+2=*3='), '27');
  assert.equal(shown('7+2=-'), '9');
});

test('T-FR-04: equals with no operator keeps the number', () => {
  assert.equal(shown('42='), '42');
  assert.equal(run('42=').phase, 'result');
});

test('T-FR-05: chained operations use immediate execution (decision D1)', () => {
  assert.equal(shown('2+3*4='), '20', '(2+3) x 4, not 2 + (3 x 4)');
  assert.equal(shown('2*3+4='), '10');
  assert.equal(shown('10-2-3='), '5', 'left to right');
  assert.equal(shown('100/5/2='), '10');
  assert.equal(shown('1+1+1+1='), '4');
});

test('T-FR-05: the pending operation is calculated as soon as the next operator is pressed', () => {
  assert.equal(shown('2+3*'), '5');
  assert.equal(view('2+3*').expression, '5 ×');
});

test('T-FR-06: clear resets number, operator, stored value and error', () => {
  assert.deepEqual(run('5+3c'), initial);
  assert.deepEqual(run('5/0=c'), initial);
  assert.deepEqual(run('9c'), initial);
  assert.deepEqual(run('7+2=c'), initial);
  assert.equal(shown('5+3c7='), '7', 'no operator is left over after clear');
});

test('T-FR-07: backspace removes the last digit', () => {
  assert.equal(shown('123b'), '12');
  assert.equal(shown('1.5b'), '1.');
  assert.equal(shown('5b'), '0', 'a single digit becomes 0');
  assert.equal(shown('5nb'), '0', 'a lone minus sign is removed too');
  assert.equal(shown('12bb'), '0');
  assert.equal(shown('5+3b='), '5', 'backspace to 0 then equals: 5 + 0');
});

test('T-FR-07: backspace is ignored when there is nothing typed', () => {
  assert.deepEqual(run('b'), initial);
  assert.equal(shown('7+2=b'), '9');
  assert.equal(shown('7+b'), '7');
});

test('T-FR-08: a second operator replaces the first', () => {
  assert.equal(shown('5+*3='), '15');
  assert.equal(shown('5+-3='), '2');
  assert.equal(view('5+*').expression, '5 ×');
});

test('T-FR-09: division by zero shows a clear message, never Infinity or NaN', () => {
  for (const seq of ['5/0=', '0/0=', '5n/0=', '1/0.0=', '8/0+']) {
    const s = run(seq);
    const v = view(seq);
    assert.equal(s.phase, 'error', seq);
    assert.equal(s.error, 'DIV_ZERO', seq);
    assert.equal(v.main, 'Error', seq);
    assert.equal(v.errorMessage, 'Cannot divide by zero', seq);
    assert.doesNotMatch(JSON.stringify(v), /NaN|Infinity|undefined/);
  }
  assert.equal(view('5/0=').expression, '5 ÷ 0', 'the failed calculation stays visible');
});

test('T-FR-09: the calculator recovers from an error', () => {
  assert.equal(shown('5/0=7'), '7', 'a digit starts a fresh number');
  assert.equal(shown('5/0=7+1='), '8');
  assert.equal(shown('5/0=.'), '0.');
  assert.deepEqual(run('5/0=c'), initial);
  assert.equal(shown('5/0=c2*4='), '8');
});

test('T-FR-09: while in error, other keys change nothing', () => {
  const error = run('5/0=');
  for (const key of ['+', '-', '*', '/', '=', 'BACKSPACE', 'NEGATE']) {
    assert.deepEqual(CalcEngine.press(error, key), error, key);
  }
});

test('T-FR-10: the numeric result is preserved internally; only the display is rounded', () => {
  assert.equal(shown('0.1+0.2='), '0.3');
  assert.equal(run('0.1+0.2=').accumulator, 0.1 + 0.2, 'stored value is not rounded');
  assert.notEqual(run('0.1+0.2=').accumulator, 0.3);
  assert.equal(run('0.1+0.2+').accumulator, 0.1 + 0.2, 'also when chaining');
});

test('T-FR-10: ordinary decimal results look right', () => {
  assert.equal(shown('0.3-0.1='), '0.2');
  assert.equal(shown('1.1*3='), '3.3');
  assert.equal(shown('0.7+0.1='), '0.8');
  assert.equal(shown('1/3='), '0.333333333333');
  assert.equal(shown('2/3='), '0.666666666667');
  assert.equal(shown('1/3*3='), '1');
});

test('T-FR-10: documented trade-off (decision D3): tiny leftovers are shown, not hidden', () => {
  // 0.1 + 0.2 is stored as 0.30000000000000004, so subtracting 0.3 leaves about 5.55e-17.
  assert.equal(shown('0.1+0.2-0.3='), '5.55111512313e-17');
  assert.equal(run('0.1+0.2-0.3=').accumulator, 0.1 + 0.2 - 0.3);
});

test('T-FR-11: very large results use exponential notation', () => {
  assert.equal(shown('999999999999*999999999999='), '9.99999999998e+23');
  assert.equal(run('999999999999*999999999999=').phase, 'result');
});

test('T-FR-11: very small non-zero results are never shown as 0', () => {
  assert.equal(shown('0.00000000001/10='), '1e-12');
  assert.equal(shown('0.00000000001*0.00000000001='), '1e-22');
  assert.notEqual(shown('0.00000000001/10='), '0');
});

test('T-FR-11: overflow shows a message and the calculator recovers', () => {
  let s = run('999999999999*999999999999=');
  let guard = 0;
  while (s.phase !== 'error' && guard++ < 60) s = run('*999999999999=', s);
  assert.equal(s.phase, 'error');
  assert.equal(s.error, 'OVERFLOW');
  assert.ok(guard > 5, 'it takes many multiplications to overflow, got ' + guard);
  const v = view('', s);
  assert.equal(v.main, 'Error');
  assert.equal(v.errorMessage, 'Number too large');
  assert.equal(shown('7', s), '7', 'a digit recovers');
  assert.deepEqual(run('c', s), initial);
});

test('T-FR-11: underflow (a non-zero product that would become 0) shows a message', () => {
  let s = run('0.00000000001*0.00000000001=');
  let guard = 0;
  while (s.phase !== 'error' && guard++ < 80) s = run('*0.00000000001=', s);
  assert.equal(s.phase, 'error');
  assert.equal(s.error, 'UNDERFLOW');
  assert.equal(view('', s).errorMessage, 'Number too small');
  assert.equal(shown('3', s), '3');
});

test('T-FR-11: a zero operand is not underflow', () => {
  assert.equal(shown('0*0.00000000001='), '0');
  assert.equal(shown('0/7='), '0');
});

test('T-FR-12: number entry is limited to 12 digits', () => {
  assert.equal(shown('1234567890123'), '123456789012', 'the 13th digit is ignored');
  assert.equal(shown('1234567890123456'), '123456789012');
  assert.equal(shown('0.123456789012'), '0.12345678901', 'the 0 before the point counts as a digit');
  assert.equal(shown('123456789012n9'), '-123456789012', 'the minus sign does not count');
  assert.equal(shown('123456789012.'), '123456789012.', 'the point does not count');
});

test('T-FR-12: the limit applies to every new number', () => {
  assert.equal(shown('1+1234567890123'), '123456789012');
  assert.equal(shown('1+1234567890123='), '123456789013');
});

test('T-FR-14: percent was removed from scope (decision D10); unknown keys are ignored', () => {
  const s = run('50');
  assert.deepEqual(CalcEngine.press(s, 'PERCENT'), s);
  assert.deepEqual(CalcEngine.press(s, '%'), s);
  assert.deepEqual(CalcEngine.press(s, 'banana'), s);
  assert.deepEqual(CalcEngine.press(s, undefined), s);
  assert.deepEqual(CalcEngine.press(s, ''), s);
});

test('T-FR-15: sign toggle on the number being typed', () => {
  assert.equal(shown('5n'), '-5');
  assert.equal(shown('5nn'), '5');
  assert.equal(shown('5n+3='), '-2');
  assert.equal(shown('5n3'), '-53', 'digits keep being added after the sign changed');
  assert.equal(shown('1.5n'), '-1.5');
});

test('T-FR-15: zero stays 0', () => {
  assert.equal(shown('0n'), '0');
  assert.equal(shown('0.0n'), '0.0');
  assert.deepEqual(run('n'), initial);
});

test('T-FR-15: sign toggle on a result', () => {
  assert.equal(shown('2+3=n'), '-5');
  assert.equal(shown('2+3=n+1='), '-4');
  assert.equal(shown('2-2=n'), '0', 'a zero result stays 0');
});

test('T-FR-15: sign toggle is ignored while waiting for the second number', () => {
  assert.equal(shown('7+n'), '7');
  assert.equal(shown('7+n3='), '10');
});

test('T-FR-16: the expression line shows the pending operation', () => {
  assert.equal(view('7+').expression, '7 +');
  assert.equal(view('7+8').expression, '7 +');
  assert.equal(view('7-').expression, '7 −');
  assert.equal(view('7*').expression, '7 ×');
  assert.equal(view('7/').expression, '7 ÷');
  assert.equal(view('').expression, '');
  assert.equal(view('7+8=').expression, '');
  assert.equal(view('12.5*').expression, '12.5 ×');
});

test('T-FR-18: equals with nothing pending does nothing', () => {
  assert.deepEqual(run('='), initial);
  assert.equal(shown('7+2=='), '9');
  assert.deepEqual(run('7+2=='), run('7+2='), 'no repeat-equals (decision D11)');
  assert.deepEqual(run('5/0=='), run('5/0='));
});

test('T-FR-18: an operator with no second number is safe', () => {
  assert.equal(shown('5+='), '5');
  assert.equal(view('5+=').expression, '5 +', 'the plus is still pending');
  assert.equal(shown('5+=3='), '8');
  assert.equal(shown('+'), '0', 'an operator first uses 0 as the left number');
  assert.equal(shown('+3='), '3');
});

test('T-NFR-08: press() never changes the state it receives, and states are frozen', () => {
  const before = run('12+3');
  const copy = JSON.parse(JSON.stringify(before));
  CalcEngine.press(before, '4');
  CalcEngine.press(before, '=');
  CalcEngine.press(before, 'CLEAR');
  assert.deepEqual(before, copy);
  assert.ok(Object.isFrozen(before));
  assert.ok(Object.isFrozen(initial));
  assert.throws(() => { 'use strict'; before.entry = 'x'; }, TypeError);
});

test('T-NFR-08: the same input always gives the same output', () => {
  const a = run('12.5*3-4=');
  const b = run('12.5*3-4=');
  assert.deepEqual(a, b);
});

test('T-NFR-02: random key sequences never crash or show NaN, Infinity or undefined', () => {
  // mulberry32: a tiny seeded random generator, so that every run is the same.
  function rng(seed) {
    let t = seed >>> 0;
    return () => {
      t = (t + 0x6d2b79f5) >>> 0;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  const random = rng(20261031);
  const pool = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '9', '.', '+', '-', '*', '/', '=', 'CLEAR', 'BACKSPACE', 'NEGATE', 'PERCENT', 'x'];
  const allowed = /^(Error|-?\d+(\.\d*)?|-?\d(\.\d+)?e[+-]\d+)$/;
  const { CalcFormat } = require('./helpers.js');
  let pressed = 0;
  for (let n = 0; n < 20000; n++) {
    let s = CalcEngine.initialState();
    const length = 1 + Math.floor(random() * 40);
    for (let i = 0; i < length; i++) {
      const key = pool[Math.floor(random() * pool.length)];
      s = CalcEngine.press(s, key);
      pressed++;
      const d = CalcFormat.display(s);
      assert.match(d.main, allowed, `sequence #${n}, after key "${key}": "${d.main}"`);
      assert.doesNotMatch(JSON.stringify(d), /NaN|Infinity|undefined/, `sequence #${n}`);
      assert.equal(s.phase === 'error', d.errorMessage !== null, 'an error message appears exactly in the Error state');
      assert.ok((s.entry.match(/\d/g) || []).length <= 12, 'entry has at most 12 digits');
      assert.ok(Object.isFrozen(s));
    }
  }
  assert.ok(pressed > 100000, 'pressed ' + pressed + ' keys');
});
