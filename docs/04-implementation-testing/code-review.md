# Code Review (Phase 4)

**Status:** v0.2, final Phase 4 review of all source files, 2026-10-31 (first pass, then a final pass after Firefox testing). Done by the AI assistant that also wrote the code, so it is **not an independent review**. A student must repeat it (see the [team checklist](team-review-checklist.md)).
**Last updated:** 2026-10-31
**Method:** The checklist of the `engineering:code-review` skill (security, performance, correctness, maintainability) applied by hand to `engine.js`, `format.js`, `keymap.js`, `app.js`, `index.html` and `styles.css`, plus probing unusual key sequences. The built-in `security-review` skill did not run (it failed to start; see the [security analysis](security-analysis.md)). No automatic linter or static analyser was run: none is installed.

## 1. Findings

| # | File | Category | Finding | Severity | Action |
|---|---|---|---|---|---|
| 1 | `engine.js` | Correctness | **BUG-1.** Backspace on `-0.5` twice left the entry `-0`; the display showed `-0`, and typing `7` then showed `-07`. Also, a typed `-0.` could not lose its minus again and could store `-0` as the left number | Medium (wrong display) | **Fixed.** Backspace turns `-0` into `0`; negate may remove the sign of a typed `-0.`; entries become numbers through one function, `numberFromEntry`, which never returns `-0`. 5 regression tests, plus a random test that every entry has a valid shape |
| 2 | `engine.js` | Maintainability | The `operatorPending` and `result` cases of `pressOperator` were identical | Low | **Simplified**: the two case labels share one body |
| 3 | `engine.js` | Maintainability | `Number(entry)` and a `=== 0` check were repeated in three places | Low | **Simplified** into `numberFromEntry` (see 1) |
| 4 | `engine.js` | Maintainability | `MAX_DIGITS` is exported but used only inside the file | Info | Left as is: it documents the limit and is harmless |
| 5 | `format.js` | Correctness | Rounding up across a notation boundary (`999999999999.9` becomes `1e+12`; `0.00009999999999999` becomes `0.0001`) is handled because the notation is chosen from the rounded value | None | Covered by tests |
| 6 | `format.js` | Correctness | Entry text is shown exactly as typed, so a typed `-0.` appears as `-0.` | Info | Intended: it is what the user typed |
| 7 | `keymap.js` | Security | Ignores Ctrl, Alt, Meta and IME composition; unknown keys return `null` | None | Covered by tests |
| 8 | `app.js` | Security | Only `textContent`; no `innerHTML`; no storage; no network | None | Covered by static tests |
| 9 | `app.js` | Correctness | `event.target.closest` is guarded for events whose target is `document` | None | Covered by the browser check (synthetic events) |
| 10 | `app.js` | Usability | After a mouse click the button is blurred, so Tab restarts from the click position (browser default) | Info | Documented limit L4 |
| 11 | `app.js` | Accessibility | Both the live display and the `role="alert"` error line change when an error appears. **Investigated:** two different texts (`Error`, `Cannot divide by zero`), one polite and one assertive, so two announcements and no identical repeat; the accessibility tree was compared before and after each key (test report A6.3) | Low | Left unchanged, because the effect depends on the screen reader and none could be tested. Open for Student 3 |
| 12 | `styles.css` | Maintainability | Colours are defined once as variables; a unit test reads them and checks contrast | None | Good |
| 13 | all | Performance | Every key press is O(1); the 20,000-sequence random test (about 410,000 key presses) runs in a few hundred milliseconds | None | None needed |
| 14 | all | Complexity | The whole application is about 350 lines of JavaScript (about 240 without comments and blank lines) in four files; no framework | None | Appropriate for the course |

## 2. Simplification decisions

Changes were limited to the two cases above. Further "cleverness" (a table-driven state machine, for example) was **rejected**: the current `switch` statements read like the state diagram and are easy to explain to five students.

## 3. Test impact

All 65 Phase 3 tests still pass after the changes; 23 new tests were added (17 in `boundary.test.js`, 6 in `accessibility.test.js`), giving 88.

## 4. What a student reviewer should do

1. Read `engine.js` top to bottom and explain each function in one sentence.
2. Try to find a key sequence that breaks an invariant of the random test (`entry` shape, no `-0`, no `NaN`).
3. Re-check findings 1 to 3 and decide whether the fix is right.
4. Decide on finding 11 after listening with a screen reader.

## 5. Final pass (after Firefox testing, 2026-10-31)

`engine.js` was read again line by line, every JavaScript file was syntax-checked with `node --check`, and the three browser runs were compared. No new finding. The final pass is still **by the same assistant that wrote the code**; it is not independent and no human review has taken place.
