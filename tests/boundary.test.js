// Phase 4 quality-assurance tests: regression tests for bugs found, boundary conditions,
// unusual key sequences, a comparison against a simple reference model, and a check that the
// engine follows the transition table of docs/03-design-prototype/architecture.md section 5.2.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { CalcEngine, CalcFormat, run, view, shown } = require('./helpers.js');

// A small seeded random generator (mulberry32) so that every run is identical.
function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const ALL_KEYS = CalcEngine.KEYS;

// ---------------------------------------------------------------------------------------------
// BUG-1 (found in Phase 4 by reading the code and probing key sequences):
// backspacing "-0.5" down to "-0" showed "-0", and typing 7 next showed "-07".
// ---------------------------------------------------------------------------------------------
test('T-FR-07 BUG-1: backspace never leaves a "-0" entry', () => {
  assert.equal(shown('0.5nb'), '-0.', 'the typed text -0. is allowed');
  assert.equal(shown('0.5nbb'), '0', 'but -0 becomes plain 0');
  assert.equal(shown('0.5nbbb'), '0');
});

test('T-FR-01 BUG-1: no leading zero appears after a sign change and backspace', () => {
  assert.equal(shown('0.5nbb7'), '7');
  assert.equal(shown('0.5nbb70'), '70');
  assert.equal(shown('0.5nb3'), '-0.3', 'digits continue after -0.');
});

test('T-FR-15 BUG-1: the sign of a zero-valued entry can be removed again', () => {
  assert.equal(shown('0.5nbn'), '0.');
  assert.equal(shown('0n'), '0', 'but a plain zero still cannot become negative');
  assert.equal(shown('0.0n'), '0.0');
});

test('T-FR-04 BUG-1: a negative zero typed by the user calculates as 0 (never shows -0)', () => {
  assert.equal(shown('0.5nb='), '0');
  assert.equal(shown('0.5nb+5='), '5');
  assert.equal(view('0.5nb+').expression, '0 +');
  assert.equal(run('0.5nb=').accumulator, 0);
  assert.ok(Object.is(run('0.5nb=').accumulator, 0), 'the stored value is +0, not -0');
});

// ---------------------------------------------------------------------------------------------
// Invariants over random key sequences
// ---------------------------------------------------------------------------------------------
test('T-NFR-02: the typed entry always has a valid shape (no -0, no leading zeros)', () => {
  const random = rng(4242);
  const valid = /^-?(0|[1-9]\d*)(\.\d*)?$/;
  const invalidAllowed = /^-0$/; // must never occur
  let steps = 0;
  for (let n = 0; n < 20000; n++) {
    let s = CalcEngine.initialState();
    const length = 1 + Math.floor(random() * 40);
    for (let i = 0; i < length; i++) {
      s = CalcEngine.press(s, ALL_KEYS[Math.floor(random() * ALL_KEYS.length)]);
      steps++;
      assert.match(s.entry, valid, `entry "${s.entry}" after sequence #${n}`);
      assert.doesNotMatch(s.entry, invalidAllowed);
      const main = CalcFormat.display(s).main;
      assert.doesNotMatch(main, /^-0$|^-0\d|^0\d/, `display "${main}"`);
      if (s.accumulator !== null) assert.ok(!Object.is(s.accumulator, -0), 'stored value is never -0');
    }
  }
  assert.ok(steps > 100000);
});

test('T-NFR-02: every pressed key leaves the engine in a known phase with consistent fields', () => {
  const random = rng(777);
  const phases = ['ready', 'entering', 'operatorPending', 'result', 'error'];
  for (let n = 0; n < 5000; n++) {
    let s = CalcEngine.initialState();
    for (let i = 0; i < 30; i++) {
      s = CalcEngine.press(s, ALL_KEYS[Math.floor(random() * ALL_KEYS.length)]);
      assert.ok(phases.includes(s.phase), s.phase);
      if (s.phase === 'ready') assert.deepEqual(s, CalcEngine.initialState());
      if (s.phase === 'operatorPending') assert.ok(s.operator !== null && Number.isFinite(s.accumulator));
      if (s.phase === 'result') assert.ok(s.operator === null && Number.isFinite(s.accumulator));
      if (s.phase === 'error') assert.ok(s.error !== null && s.operator !== null && Number.isFinite(s.accumulator));
      if (s.phase !== 'error') assert.equal(s.error, null);
    }
  }
});

// ---------------------------------------------------------------------------------------------
// Comparison with a very simple reference model
// ---------------------------------------------------------------------------------------------
test('T-FR-05: chained calculations equal left-to-right arithmetic on plain numbers (2,000 random chains)', () => {
  const random = rng(20261101);
  const ops = ['+', '-', '*', '/'];
  const randomNumber = () => {
    const digits = 1 + Math.floor(random() * 6);
    let intPart = '';
    for (let i = 0; i < digits; i++) intPart += Math.floor(random() * 10);
    intPart = String(Number(intPart)); // no leading zeros
    const decimals = random() < 0.5 ? '' : '.' + String(Math.floor(random() * 1000)).padStart(3, '0');
    return { text: intPart + decimals, negative: random() < 0.3 };
  };
  let compared = 0;
  for (let n = 0; n < 2000; n++) {
    const count = 2 + Math.floor(random() * 5);
    const numbers = [];
    const operators = [];
    for (let i = 0; i < count; i++) numbers.push(randomNumber());
    for (let i = 0; i < count - 1; i++) operators.push(ops[Math.floor(random() * 4)]);
    // Division by zero has its own tests (after an error, typing digits starts a new calculation), so avoid zero divisors here.
    for (let i = 1; i < count; i++) if (operators[i - 1] === '/' && Number(numbers[i].text) === 0) numbers[i] = { text: '7', negative: false };

    // The keys the user presses, and the answer of the simple reference model (plain JavaScript numbers, left to right).
    let keys = '';
    let expected = null;
    numbers.forEach((num, i) => {
      keys += num.text + (num.negative ? 'n' : '') + (i < operators.length ? operators[i] : '');
      const value = (num.negative ? -1 : 1) * Number(num.text);
      if (i === 0) { expected = value; return; }
      const op = operators[i - 1];
      expected = op === '+' ? expected + value : op === '-' ? expected - value : op === '*' ? expected * value : expected / value;
    });
    const sequence = keys + '=';
    const state = run(sequence);
    assert.equal(state.phase, 'result', sequence);
    assert.ok(Object.is(state.accumulator, expected === 0 ? 0 : expected), `${sequence}: engine ${state.accumulator}, reference ${expected}`);
    compared++;
  }
  assert.equal(compared, 2000);
});

// ---------------------------------------------------------------------------------------------
// Boundaries: long inputs, repeated operations, the ends of the number range
// ---------------------------------------------------------------------------------------------
test('T-FR-12: very long input is cut at 12 digits and the calculator stays responsive', () => {
  assert.equal(shown('9'.repeat(500)), '999999999999');
  assert.equal(shown('1' + '.'.repeat(500) + '5'), '1.5');
  assert.equal(shown('0'.repeat(500)), '0');
  assert.equal(shown('1' + '0'.repeat(500)), '100000000000');
  const s = run('7' + '+1'.repeat(5000) + '=');
  assert.equal(CalcFormat.display(s).main, '5007');
});

test('T-FR-11: repeated multiplication by 10 overflows at exactly the 309th step (1e308 is the last good value)', () => {
  let s = run('1*10=');
  let steps = 1;
  let last = CalcFormat.display(s).main;
  while (s.phase !== 'error' && steps < 400) {
    last = CalcFormat.display(s).main;
    s = run('*10=', s);
    steps++;
  }
  assert.equal(s.error, 'OVERFLOW');
  assert.equal(steps, 309);
  assert.equal(last, '1e+308');
});

test('T-FR-11: repeated halving underflows exactly after 1074 good steps; the last good value is the smallest number', () => {
  let s = run('1/2=');
  let steps = 1;
  let last = '';
  while (s.phase !== 'error' && steps < 1200) {
    last = CalcFormat.display(s).main;
    s = run('/2=', s);
    steps++;
  }
  assert.equal(s.error, 'UNDERFLOW');
  assert.equal(steps, 1075);
  assert.equal(last, '4.94065645841e-324');
  assert.notEqual(last, '0');
});

test('T-FR-11: no step before the end of the range ever shows 0 for a non-zero value', () => {
  let s = run('1/2=');
  for (let i = 0; i < 1073; i++) {
    s = run('/2=', s);
    assert.notEqual(CalcFormat.display(s).main, '0', 'step ' + i);
  }
});

test('T-FR-10: repeated additions of 0.1 stay close to the exact value and display cleanly', () => {
  let s = run('0+0.1=');
  for (let i = 1; i < 10; i++) s = run('+0.1=', s);
  assert.equal(CalcFormat.display(s).main, '1');
  assert.ok(Math.abs(s.accumulator - 1) < 1e-15);
  assert.notEqual(s.accumulator, 1, 'the stored value keeps the tiny error (decision D3)');
});

test('T-FR-03: negative numbers in every operation', () => {
  assert.equal(shown('5n+3='), '-2');
  assert.equal(shown('5n-3='), '-8');
  assert.equal(shown('5n*3n='), '15');
  assert.equal(shown('6n/3='), '-2');
  assert.equal(shown('6n/3n='), '2');
  assert.equal(shown('0.5n*0.5='), '-0.25');
  assert.equal(shown('3-5n='), '8');
});

test('T-FR-03: the largest typeable numbers calculate correctly', () => {
  assert.equal(shown('999999999999+1='), '1e+12');
  assert.equal(shown('999999999999-999999999999='), '0');
  assert.equal(shown('999999999999/999999999999='), '1');
  assert.equal(shown('0.00000000001+0.00000000001='), '2e-11');
});

// ---------------------------------------------------------------------------------------------
// Unusual key sequences (the user hammers keys in odd orders)
// ---------------------------------------------------------------------------------------------
test('T-FR-18: unusual sequences are safe and give the documented result', () => {
  const cases = [
    ['===', '0'], ['=+=*', '0'], ['+++5=', '5'], ['5***2=', '10'], ['...5', '0.5'], ['bbb', '0'], ['nnn', '0'],
    ['5+=', '5'], ['5+*=', '5'], ['5+n', '5'], ['5=+3=', '8'], ['5=5', '5'], ['5+3=+', '8'], ['5+3==+2=', '10'],
    ['1+2c3', '3'], ['1+2cb', '0'], ['9/0=c9', '9'], ['9/0=9/3=', '3'], ['5/0=.5', '0.5'], ['2*3=n*2=', '-12'],
    ['7.n.n.', '7.'], ['.n', '0.'], ['.5n+.5=', '0'], ['0.1+0.2=n', '-0.3'],
  ];
  for (const [keys, expected] of cases) assert.equal(shown(keys), expected, keys);
});

// ---------------------------------------------------------------------------------------------
// The engine follows the transition table of architecture.md section 5.2
// ---------------------------------------------------------------------------------------------
test('T-FR-04 state table: the next phase for every key in every phase matches the design', () => {
  const samples = {
    ready: run(''),
    entering: run('5'),
    enteringWithOperator: run('5+3'),
    operatorPending: run('5+'),
    result: run('5+3='),
    error: run('5/0='),
  };
  const keyGroups = { digit: '4', point: '.', operator: '*', equals: '=', backspace: 'BACKSPACE', negate: 'NEGATE', clear: 'CLEAR' };
  // [phase of the sample] -> expected phase after each key group (from the design table)
  const expected = {
    ready: { digit: 'entering', point: 'entering', operator: 'operatorPending', equals: 'ready', backspace: 'ready', negate: 'ready', clear: 'ready' },
    entering: { digit: 'entering', point: 'entering', operator: 'operatorPending', equals: 'result', backspace: 'entering', negate: 'entering', clear: 'ready' },
    enteringWithOperator: { digit: 'entering', point: 'entering', operator: 'operatorPending', equals: 'result', backspace: 'entering', negate: 'entering', clear: 'ready' },
    operatorPending: { digit: 'entering', point: 'entering', operator: 'operatorPending', equals: 'operatorPending', backspace: 'operatorPending', negate: 'operatorPending', clear: 'ready' },
    result: { digit: 'entering', point: 'entering', operator: 'operatorPending', equals: 'result', backspace: 'result', negate: 'result', clear: 'ready' },
    error: { digit: 'entering', point: 'entering', operator: 'error', equals: 'error', backspace: 'error', negate: 'error', clear: 'ready' },
  };
  for (const [name, state] of Object.entries(samples)) {
    for (const [group, key] of Object.entries(keyGroups)) {
      assert.equal(CalcEngine.press(state, key).phase, expected[name][group], `${name} + ${group}`);
    }
  }
});

test('T-FR-04 state table: ignored keys return the very same state object', () => {
  const same = [['ready', '='], ['ready', 'BACKSPACE'], ['ready', 'NEGATE'], ['operatorPending', '='], ['operatorPending', 'BACKSPACE'],
    ['operatorPending', 'NEGATE'], ['result', '='], ['result', 'BACKSPACE'], ['error', '+'], ['error', '='], ['error', 'BACKSPACE'], ['error', 'NEGATE']];
  const samples = { ready: run(''), operatorPending: run('5+'), result: run('5+3='), error: run('5/0=') };
  for (const [phase, key] of same) assert.strictEqual(CalcEngine.press(samples[phase], key), samples[phase], `${phase} + ${key}`);
});
