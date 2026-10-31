# Code Walkthrough for the Team

**Status:** Draft v0.1, 2026-10-31. Written so that five university students can read, run, question and extend the code. Nothing here says that any student has already done these tasks.
**Last updated:** 2026-10-31

## 1. Run it (no installation)

| What | How |
|---|---|
| Use the calculator | Double-click `src/index.html` (opens in your browser; no server, no internet) |
| Run the automated tests | Open a terminal in the project folder, run `node --test` (needs Node.js 22 or newer) |
| Run the browser test | `node tests/browser-check.js` (needs Edge or Chrome; add `--shots` to save screenshots) |
| Check the documents | `node tests/docs-check.js --require-tests` |

## 2. The project in one picture

```
src/index.html      the page: buttons and the display (structure)
src/css/styles.css  colours, sizes, layout (looks)
src/js/engine.js    THE RULES: what happens when a key is pressed          (no page code)
src/js/format.js    numbers and states to display text                      (no page code)
src/js/keymap.js    which physical keys we use                              (no page code)
src/js/app.js       glue: clicks and keys in, text out                      (only file that touches the page)
tests/              automated tests, one file per module
```

Full design: [architecture.md](../03-design-prototype/architecture.md) (diagrams explained in plain English).

## 3. What happens when you press a key (follow it through the code)

Example: press `7`, `+`, `8`, `=`.

1. **Click or key press.** `app.js` hears it (`click` on the keys, or `keydown` on the page).
2. **Which key is it?** A button knows its own name from `data-key="7"` in `index.html`. A physical key goes through `CalcKeymap.commandForKey(event)` in `keymap.js`, which returns `"7"` or `null` (null = not ours).
3. **Apply the rules.** `app.js` calls `CalcEngine.press(state, key)`. The engine **never changes** the old state; it returns a new one (`Object.freeze` blocks changes; in strict mode, which our files use, an attempt throws an error).
4. **Make text.** `CalcFormat.display(state)` returns `{ main, expression, errorMessage }`.
5. **Draw.** `app.js` writes these three texts into the page with `textContent`. The display is an `<output>` element, so screen readers announce the change.

The state is five small fields. After `7 + 8` it is:

```js
{ phase: 'entering', entry: '8', accumulator: 7, operator: '+', error: null }
```

## 4. Read the engine like a story

Open `src/js/engine.js` and find `press()` at the bottom. It sends each key to one small function (`pressDigit`, `pressOperator`, `pressEquals`, ...). Each function starts with "which phase are we in?" The phases are the boxes of the state diagram in [architecture.md section 5](../03-design-prototype/architecture.md#5-state-diagram). If you can explain that diagram, you can explain the code.

Three ideas to be able to explain in the defence:

1. **Immediate execution (D1).** When you press an operator while an operation is pending, `pressOperator` calculates it first (`calculate(...)`). So `2 + 3 × 4 =` is 20.
2. **The engine keeps the exact number; the display rounds (D3).** `format.js` only changes the text. Look at `tests/engine.test.js` test "documented trade-off" to see the one surprising result: `0.1 + 0.2 - 0.3`.
3. **Errors are states, not crashes.** Division by zero moves the engine to the `error` phase. A digit or Clear gets you out.

## 5. Questions to test your understanding (answers: read the code and run the tests)

1. What does `press(state, 'banana')` return? Why is that useful?
2. In which phase is the state after `5 + =`? What is shown on the display and on the small line?
3. Why does the engine store `entry` as text and not as a number?
4. Why does `formatNumber(999999999999.9)` return `1e+12`?
5. Which test fails if you change `MAX_DIGITS` to 13? (Try it, then undo it.)

## 6. How to contribute: first tasks by provisional role

Roles come from the [responsibility matrix](../01-project-card/responsibility-matrix.md) and are provisional. These are **suggestions for tasks, not records of work done**.

| Student (provisional role) | A good first task | A small real contribution |
|---|---|---|
| Student 1 (project management) | Run all three commands, record the results with your name and date in the [test report](test-report.md) and the [time log](../00-admin/time-log.md). Read `README.md` and the test plan | Fill in the weekly time summary; ask the professor the open questions (Q1-Q5, Q9) |
| Student 2 (research and requirements) | Open every URL in the [calculator review](../02-research-requirements/calculator-review.md) and confirm the quoted facts. Run the hands-on session script | Write `hands-on-notes.md` (only real observations) |
| Student 3 (UI/UX and design) | Open `src/index.html` in Chrome and Firefox; zoom to 200 % and 400 %; use Tab and Enter; check on a phone | Report layout problems with a screenshot; try a colour change in `styles.css` and run the contrast check in [ui-design.md](../03-design-prototype/ui-design.md) |
| Student 4 (development) | Read `engine.js` and `format.js` fully and explain them to the team. Review `keymap.js` and `app.js` | Write one extra test for an edge case you thought of; propose the first simplification |
| Student 5 (testing and documentation) | Read `tests/*.test.js`. Try breaking the code on purpose (see section 7) and watch the tests fail. Run Lighthouse and a screen reader | Fill in the manual checklist in the [test plan](test-plan.md) section 7 with real results |

Everyone: read the [decision log](../00-admin/decision-log.md), because you will be asked "why did you do it this way?".

## 7. Safe experiments

1. Change `MAX_DIGITS` in `engine.js` from 12 to 13, run `node --test`, read the failures, undo the change.
2. Remove the `if (right === 0)` line in `calculate()` and run the tests.
3. Add a test of your own to `tests/engine.test.js` (copy a small one; the name starts with the requirement ID).

Use Git to undo: `git checkout -- src/js/engine.js` restores the last committed version once the Phase 3 files are committed. Until then, copy the file before experimenting.

## 8. Glossary

| Word | Meaning here |
|---|---|
| State | The calculator's whole memory at one moment (five fields) |
| Pure function | Same input, same output, changes nothing else. `press()` is pure |
| Immutable / frozen | Cannot be changed after it is made |
| Live region | A part of the page whose changes a screen reader reads aloud (`<output>`) |
| Significant digits | Digits that carry meaning, ignoring leading zeros: `0.00123` has three |
| Floating point | How computers store most decimals approximately: `0.1 + 0.2` is `0.30000000000000004` |
| Mutation check | Put a bug in on purpose to see whether a test notices |
| TDD | Test-driven development: write the test first, see it fail, then write the code |
