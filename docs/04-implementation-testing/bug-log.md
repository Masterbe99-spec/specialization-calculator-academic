# Bug Log

**Status:** Final for Phase 4, 2026-10-31. Lists every defect found in the **application** and every significant mistake found in the **tests or documents**, with what was done. Add real findings only.
**Last updated:** 2026-10-31

## 1. Application bugs

| ID | Found | Found by | Description | Cause | Fix | Regression tests | Status |
|---|---|---|---|---|---|---|---|
| BUG-1 | 2026-10-31 (Phase 4) | Code review and probing of key sequences (AI assistant) | After `0.5`, `±`, backspace, backspace the display showed `-0`; typing `7` then showed `-07`. A typed `-0.` could not lose its minus sign | `pressBackspace` only handled the entries `''` and `-`, not `-0`; `pressDigit` only replaced an entry equal to `0`. `pressNegate` refused to touch any zero entry | `engine.js`: backspace turns `-0` into `0`; negate may remove the minus from a typed `-0.`; one helper `numberFromEntry` never returns `-0` | `boundary.test.js`: four named BUG-1 tests and the random "entry shape" test | **Fixed**, unit tests 88 of 88 |

No other failing behaviour has been found. That does not prove there are none: see the limits in the [test report](test-report.md).

## 2. Mistakes found in tests and documents (not application bugs)

| ID | Found | Description | Fix |
|---|---|---|---|
| DOC-1 | Phase 3 | Documents said the keypad has 18 keys; it has 19 | Corrected everywhere |
| DOC-2 | Phase 3 | A requirement example needed 13 digits but entry is limited to 12 | Example changed to `0.00000000001 ÷ 10 = 1e-12` |
| TEST-1 | Phase 3 | Random test treated `null` as invalid | Test corrected |
| TEST-2 | Phase 3 | Static security tests read comments | Tests strip comments |
| TEST-3 | Phase 3 | Browser test counted Tab stops from the wrong start | Test reloads the page first |
| TEST-4 | Phase 3 | First mutation check was invalid ("0 passed") | Scratch copy given its own `package.json` |
| TEST-5 | Phase 4 | The random "chained calculations" comparison treated a recovered division-by-zero as still being an error | Chains avoid zero divisors (zero division has its own tests) |
| TEST-6 | Phase 4 | The 400 % zoom check passed vacuously: keys below the visible area were not clicked, so the display stayed `0` | Clicks scroll the key into view first; the check now asserts the typed text |
| TEST-7 | Phase 4 | Expected 3 CSP violation reports; the browser reports 2 (the `eval()` block appears as an `EvalError`) | Expectation changed to 2, `eval` checked separately |
| TEST-8 | Phase 4 | A scratch mutation script had two outdated patterns (code had been changed) and was rewritten | New script; 15 of 16 injected bugs caught |
| TEST-9 | Phase 4 finalisation | First Firefox run: 9 failures. Focus ring, Enter and Space did nothing | **Not a calculator bug.** The automated Firefox window has no keyboard focus (`document.hasFocus()` is `false`); a plain page with one button behaves identically. Those 8 checks are skipped in Firefox, with the reason printed, and left to a human |
| TEST-10 | Phase 4 finalisation | Firefox reported 0 sub-resource network requests, so "offline" could not be counted | Firefox gives no per-request events for local files. The Firefox profile now blocks all web access and the check proves the calculator still works |
| TEST-11 | Phase 4 finalisation | Firefox did not log CSP violations through the driver | The check now listens for the standard `securitypolicyviolation` event in the page, in every browser |
| TEST-12 | Phase 4 finalisation | A Firefox screenshot of the focus ring would have shown no ring (no focus) and misled | That screenshot is not taken for Firefox; the screenshot README says why |

## 3. Investigation (not a bug)

| ID | Question | Finding |
|---|---|---|
| INV-1 | Could a screen reader announce an error twice? | An error changes two live regions with different texts (`Error` polite, `Cannot divide by zero` assertive). No identical repeat, but two announcements. Needs a human with a screen reader. Details: test report A6.3. No code change |

## 4. Limitations (not bugs): see the [test report](test-report.md) section A9

## 5. How to report a bug (for the team)

Copy this block into a new row or an issue:

```
ID:            BUG-n
Date, who:
Browser, version, screen size:
Keys pressed (exactly, in order):
Expected (cite requirement ID or document):
Actual (include a screenshot name if any):
Seen once or every time:
```

A good bug report can be turned into a test: put the keys into `shown('...')` in `tests/` and make it fail first.
