# Test Report

**Status:** Initial verification, 2026-10-31. Results below were copied from real runs in the session. **They have not yet been re-run by a student.**
**Last updated:** 2026-10-31

## 1. What was run, where and by whom

| Item | Value |
|---|---|
| Date | 2026-10-31 |
| Run by | The AI assistant (Claude Code), in the project lead's session. No student has run these yet. Any student can repeat them (section 8) |
| Code state | Commit `2784c9a` (Phase 2) plus the uncommitted Phase 3 files |
| Computer | Windows 11 |
| Node.js | v24.21.0 |
| Browser | Microsoft Edge 156.0.4314.50 (headless), page opened from `file://` |
| Other browsers | **Chrome and Firefox: not tested** |

## 2. Commands and results

| # | Command | Result |
|---|---|---|
| 1 | `node --test` | **65 passed, 0 failed** (40 engine, 10 format, 9 keymap, 6 static/security), 0 cancelled, 0 skipped, about 0.4 s |
| 2 | `node tests/browser-check.js --shots` | **78 passed, 0 failed** (78 checks) |
| 3 | `node tests/docs-check.js --require-tests` | **PASSED: 0 errors, 0 warnings.** 17 Markdown files, 76 relative links, 27 requirement IDs, 4 test files, 17 functional requirements with a test |

Per-file results (each run separately): `engine.test.js` 40 of 40, `format.test.js` 10 of 10, `keymap.test.js` 9 of 9, `security.test.js` 6 of 6.

## 3. Test-first record (TDD)

| Step | What happened |
|---|---|
| Red | Before any source file existed, `node --test` failed: all test files crashed with `Cannot find module '../src/js/engine.js'` (or `keymap.js`). 0 passed |
| Green (units) | After writing `engine.js`, `format.js`, `keymap.js`: 58 of 59 unit tests passed; the one failure was a mistake in the test itself (see section 5) |
| Green (static) | After writing the page: 3 static tests failed for reasons described in section 5; fixed, then 65 of 65 |

## 4. Browser checks (78), by area

| Area | Checks | Result |
|---|---|---|
| Page load: no console errors, CSP allows the app, scripts defined, `file://` | 5 | pass |
| Mouse: 16 calculations (each operation, chained, decimals, negative, replace operator, 12-digit limit, sign, backspace, new number after result, no repeat-equals), expression line, Clear | 18 | pass |
| Division by zero: message, expression, no `NaN`/`Infinity`, keys do not move, recovery by digit, by Clear, calculation after recovery | 7 | pass |
| Large numbers and overflow with the keyboard (`9.99999999998e+23`, then "Number too large") | 2 | pass |
| Keyboard: operations, Escape, comma, Backspace, error recovery, browser shortcuts not blocked | 8 | pass |
| Focus: Tab order, 3 px focus ring, Enter and Space on a focused key, Enter after a mouse click means equals, summary reachable and operable | 7 | pass |
| Accessibility tree: 19 named buttons, operators named in words, `status` region, `alert`, `lang="en"` | 5 | pass |
| Responsive at 320, 360, 768, 1280 px (6 checks each): no horizontal scroll, all keys inside viewport, smallest key at least 48 x 48 px, 12-digit negative number fits, exponent result fits, display area does not overflow | 24 | pass |
| 400 random key presses in the real page | 1 | pass |
| Whole run: no console errors, warnings, exceptions or CSP violations | 1 | pass |

Smallest key measured: 61.5 x 56.0 px at 320 px width (design minimum 48 x 48).

## 5. Problems found while testing (and what was done)

These are listed on purpose. Finding and fixing problems is part of the work.

| # | Problem | Found by | Cause | Fix |
|---|---|---|---|---|
| 1 | A random test failed on its first run | Unit test | The test wrongly treated `null` (the normal "no error message") as a bad value | Test corrected. The engine was right |
| 2 | Static security tests failed on `app.js` and `engine.js` | Unit test | The tests also read **comments** such as "never innerHTML" and "no document" | Tests now strip comments before searching. The code had no real violation |
| 3 | Test expected 18 keys, page has 19 | Static test | Documentation error from Phase 2: four columns × five rows with a double-width zero is 19 keys, not 18 | Documents, comment and test corrected to 19 |
| 4 | Five browser checks failed on the Tab sequence | Browser check | The test, not the app: browsers start Tab from the last clicked element, and the summary is the 20th Tab stop, not the 19th | Test reloads the page first and counts 20. App unchanged |
| 5 | A requirement example could not be typed | Writing tests | `0.000000000001` has 13 digits, more than the 12-digit limit allows | Example in the requirements changed to `0.00000000001 ÷ 10 = 1e-12` |
| 6 | First mutation check was invalid ("0 passed" on every row) | Reading the output | The scratch folder inherited `"type": "module"` from a parent `package.json`, so every test crashed | Added a local `package.json` to the scratch copy; baseline then showed 65 passed |

## 6. Mutation check (does a test fail when the code is wrong?)

A one-time manual check in a **scratch copy outside the repository** (script not kept). One bug was injected at a time, then `node --test` was run. The unmutated copy first passed 65 of 65.

| Injected bug | Tests that failed |
|---|---|
| Remove the division-by-zero check | 2 |
| Second operator ignored instead of replacing the first | 1 |
| Digit limit 13 instead of 12 | 3 |
| Chained operations ignore the pending operation | 6 |
| Display 15 digits instead of 12 | 5 |
| Allow several decimal points | 2 |
| Allow negating zero | 1 |
| Take over Ctrl, Alt and Meta shortcuts | 2 |

All 8 injected bugs were caught. This is a small sample, not proof that the tests are complete.

## 7. Requirement coverage

| Requirement | Unit tests | Browser checks | Status |
|---|---|---|---|
| FR-01 to FR-12, FR-15, FR-16, FR-18 | Yes | Yes | Pass |
| FR-13 Keyboard | Yes (key map) | Yes | Pass (Edge) |
| FR-14 retired (percent) | Yes (unknown keys ignored) | none needed | Pass |
| FR-17 History (Could) | not built | | |
| NFR-02 | 20,000 random sequences (the test asserts more than 100,000 key presses) | 400 random keys | Pass |
| NFR-03 | | key size at 4 widths | Pass for size. **User check not done** |
| NFR-04 | static (names, `lang`) | tree, focus, roles | Pass for automated parts. **Screen reader and Lighthouse not done** |
| NFR-05 | | 4 widths, Edge | Pass in Edge. **Chrome, Firefox not tested** |
| NFR-06 | static | CSP active | Pass. **Security note not written** |
| NFR-07 | static | `file://` | Pass in Edge |
| NFR-08 | purity and static | | Pass. **Peer review pending** |
| NFR-09 | | | Pending (inspection) |

## 8. How to repeat everything

From the project root (needs only Node.js 22 or newer and Edge or Chrome):

```
node --test
node tests/browser-check.js --shots
node tests/docs-check.js --require-tests
```

Set `BROWSER` to the browser's `.exe` if it is not found. `--shots` re-takes the screenshots in `evidence/screenshots/`.

## 9. Known bugs and limitations

| # | Item | Type |
|---|---|---|
| L1 | `0.1+0.2-0.3` shows `5.55111512313e-17` (decision D3). Same for similar subtraction of nearly equal numbers, for example `1-0.9999999999` shows `1.00000008274e-10` instead of `1e-10` | Documented design limit |
| L2 | The display shows at most 12 significant digits, so very precise results look rounded. The full value is kept internally | Design |
| L3 | A number typed with more than 12 digits is silently cut (the 13th digit is ignored) | Design (FR-12) |
| L4 | After a mouse click the keyboard focus is released (so that Enter means "equals"). A keyboard user who clicks and then presses Tab starts again from the click position, which is the normal browser behaviour | Design choice |
| L5 | Accessible names are words ("Times"), the visible text is a symbol ("×"). Voice-control users may need to say "click times" | Possible accessibility issue, untested |
| L6 | Screen-reader behaviour of the live display (whether each digit is announced pleasantly) is **unknown** | Not tested |
| L7 | Only Edge was tested | Not tested |
| L8 | Mermaid state diagram labels overlap in automatic layout (documentation only) | Cosmetic |
| L9 | The browser check only models one browser. Its random test uses 400 keys; the unit test uses far more | Limit of the test |
| L10 | No test for text zoom at 200 % or 400 % | Not tested |
| L11 | The 12-digit limit counts the zero in `0.5`, so only 11 decimals can be typed after `0.` | Design (FR-12) |

No known **failing** requirement at this time. "Not known" does not mean "no bugs": the unlisted areas above have not been tested.

## 10. Screenshots

All taken on 2026-10-31 by `node tests/browser-check.js --shots` (Edge headless). See [evidence/screenshots/README.md](../../evidence/screenshots/README.md).
