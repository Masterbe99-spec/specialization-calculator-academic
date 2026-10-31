# Development Log

**Status:** Phase 3 (implementation), started and paused for review on 2026-10-31.
**Last updated:** 2026-10-31
**Purpose:** A factual record of what was built, in what order and why, for the final report. Entries are added by whoever does the work. **All entries below were done by the AI assistant (Claude Code) on the project lead's instruction. No student contribution is recorded yet**; students add their own entries (name, date, what they did, what they learned) in section 3.

## 1. Entries (Phase 3, 2026-10-31)

| # | Step | What was done | Why | Result |
|---|---|---|---|---|
| 1 | Finalise Phase 2 | Re-checked all 13 reference URLs and the quoted facts with `curl`; verified the 4 Mermaid diagrams render (Mermaid in headless Edge, scratch); applied the approved decisions to the requirements, decision log, architecture and UI design; regenerated prototype and screenshots (18 → 19 keys later corrected); added `tests/docs-check.js` | The project lead asked for verified references and rendered diagrams | Commit `2784c9a` (local, not pushed) |
| 2 | Test planning | Used the testing-strategy skill. Wrote `tests/engine.test.js`, `format.test.js`, `keymap.test.js`, `security.test.js` before the code, with requirement IDs in the test names | Test-first (TDD) | Red run: all files failed to load |
| 3 | Engine | Wrote `src/js/engine.js` as a pure state machine (`press(state, key)`), frozen states, no DOM | Design D14, NFR-08 | 58 of 59 unit tests passed at first run |
| 4 | Formatter and keymap | Wrote `format.js` (12 significant digits, fixed or exponential notation, error messages) and `keymap.js` (physical key to key name, comma alias, no Ctrl/Alt/Meta) | Separate display text and keyboard rules so they can be unit-tested | 59 of 59 after correcting one wrong test |
| 5 | User interface | Wrote `src/index.html`, `src/css/styles.css`, `src/js/app.js` from the approved prototype | Phase 3 step 3 | 3 static tests failed (see next entries) |
| 6 | Fix tests | Static tests ignore comments; key count corrected from 18 to 19 in code, tests and documents | Test and documentation mistakes, not application bugs | 65 of 65 |
| 7 | Browser verification | Wrote `tests/browser-check.js` (Node + installed Edge via DevTools Protocol; no installation). First run 73 of 78; failures were the test's Tab counting | Playwright is not installed or approved | 78 of 78 after correcting the test |
| 8 | Look at screenshots | Opened the 320 px error screenshot and the focus screenshot. Layout stable, ring visible | Passing checks can still hide visual problems | OK |
| 9 | Mutation check | Injected 8 bugs into a scratch copy. First attempt invalid, repeated correctly | See whether tests can fail | 8 of 8 caught |
| 10 | Documentation | Test plan, test report, this log, code walkthrough, traceability statuses, README run instructions, tool log, decision log | Phase 3 step 4 | See files |

## 2. Technical decisions made while implementing

| # | Decision | Reason | Where |
|---|---|---|---|
| T1 | `keymap.js` is a separate small file | The key map can be unit-tested in Node. D14 addendum | decision log |
| T2 | Error state keeps left number, operator and right number | The display can show `5 ÷ 0` after the error | engine.js |
| T3 | `Error` replaces the number on the main display; the message is on its own line | Shows nothing misleading (`0`) and works for screen readers. Small change from the static prototype, which showed `0` | format.js, prototype updated |
| T4 | Added an underflow error ("Number too small") | A non-zero product could silently become `0`, breaking the rule that non-zero is never shown as 0 | engine.js, FR-11 |
| T5 | After a mouse click the button is blurred | So that a following Enter means "equals" instead of repeating the button. Tab and Enter on a focused key still work natively | app.js, test-report limit L4 |
| T6 | Enter on a button or the help summary keeps its normal meaning | Keeps keyboard access to the help and to every key | app.js |
| T7 | Display font size steps down for long text (`data-size`) | A 17-character exponent result must fit at 320 px | app.js, styles.css |
| T8 | `package.json` has scripts only, no dependencies | `npm test` shortcut. Not required to run the app | package.json |
| T9 | No `eval`, no `Function`, no `innerHTML` anywhere; checked by a test | NFR-06 | tests/security.test.js |

## 3. Student contributions and learning (to be filled in by students)

Nothing has been recorded here by students yet. Suggested columns: date, student, what you read or changed, what you learned, questions.

| Date | Student | Activity | What I learned / questions |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

## 4. Open items

- A student must run the three commands in the [test report](test-report.md) section 8 and record the result.
- Chrome and Firefox checks, screen-reader test, Lighthouse, first-time-user check (test plan section 7).
- Review of every Phase 3 file by at least one student who did not write it (here: all of them, as the assistant wrote them).
- Phase 4 (report, presentation, user guide) has not started.
