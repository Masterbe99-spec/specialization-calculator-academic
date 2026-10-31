# Development Log

**Status:** Phases 3 and 4 complete (2026-10-31). Phase 3 is commit `602e34a`; the Phase 4 commit is `test: add QA tests and fix negative-zero entry bug` (see the Git log). Phase 5 drafts were prepared afterwards (see the Phase 5 files in `docs/05-final/`).
**Last updated:** 2026-10-31
**Purpose:** A factual record of what was built, in what order and why, for the final report. Entries are added by whoever does the work.

> **All entries in sections 1 and 2 were done by the AI assistant (Claude Code) on the project lead's instruction.** No student contribution is recorded yet. Students add their own entries (name, date, what they did, what they learned) in section 4. Do not describe AI-made work as made by students.

## 1. Phase 3: implementation (2026-10-31)

| # | Step | What was done | Result |
|---|---|---|---|
| 1 | Finalise Phase 2 | Re-checked all 13 reference URLs and quotes with `curl`; rendered the 4 Mermaid diagrams (scratch); applied the approved decisions D9 to D16 to the documents; retook the prototype screenshots; added `tests/docs-check.js` | Commit `2784c9a` (local) |
| 2 | Test planning | Testing-strategy skill; wrote four test files **before** the code, with requirement IDs in the test names | Red run: all files failed to load |
| 3 | Engine | `src/js/engine.js` as a pure state machine (`press(state, key)`), frozen states, no page code | 58 of 59 unit tests passed at the first run |
| 4 | Formatter and key map | `format.js` (12 significant digits, fixed or exponential notation, error messages) and `keymap.js` (physical key to key name, comma alias, no Ctrl/Alt/Meta) | 59 of 59 after correcting one wrong test |
| 5 | Interface | `index.html`, `styles.css`, `app.js` from the approved prototype | 3 static tests failed (next step) |
| 6 | Fix tests and documents | Static tests ignore comments; key count corrected from 18 to 19 | 65 of 65 |
| 7 | Browser checks | `tests/browser-check.js` (Node plus the installed Edge, DevTools Protocol, no installation). 73 of 78 at first run; the failures were the test's Tab counting | 78 of 78 |
| 8 | Look at screenshots | Opened the 320 px error and the focus screenshots | Layout stable, ring visible |
| 9 | Mutation check | 8 bugs injected into a scratch copy; the first attempt was invalid and was repeated | 8 of 8 caught |
| 10 | Documents | Test plan, test report, this log, code walkthrough, traceability, README | |
| 11 | Commit | Reviewed the working tree, scanned for secrets and temporary files, re-ran the checks, committed locally `602e34a feat: implement and test basic calculator` | 65 of 65 and 78 of 78 at that time |

## 2. Phase 4: quality assurance (2026-10-31)

| # | Step | What was done | Result |
|---|---|---|---|
| 12 | Code review | Read all source files with the code-review checklist and probed unusual key sequences | BUG-1 found |
| 13 | BUG-1 | Wrote the failing regression tests first, then fixed `engine.js` and simplified two spots | Unit tests 88 of 88 |
| 14 | Boundary and random tests | `boundary.test.js` (17 tests: invariants, comparison with a reference model, boundaries, unusual sequences, the design's transition table) | All pass |
| 15 | Accessibility test | `accessibility.test.js`: contrast read from the real stylesheet | All pass |
| 16 | Browser checks extended | Zoom, enlarged text, live region, offline, CSP, key order, keyboard-only. Two flaws in the new checks found and corrected (TEST-6, TEST-7) | 101 of 101 in Edge |
| 17 | Chrome | Same script with `BROWSER` set to Chrome 156 | 101 of 101 |
| 18 | Floating-point study | Scratch comparison of rules A and E on 5,000 chains; **no change made** (D17 not approved to implement) | architecture 6.4 |
| 19 | Mutation check, second round | 16 deliberate bugs injected; 15 caught | test report A4 |
| 20 | Documents | Security analysis, code review, bug log, team checklist; updates to the plan, report, traceability and logs | |

## 3. Phase 4 finalisation (2026-10-31, after the project lead's provisional approval)

| # | Step | What was done | Result |
|---|---|---|---|
| 21 | Firefox installed | Official installer from `download.mozilla.org`, signature checked (Mozilla Corporation), per-user install, Firefox 159.0 | Test report A6.1 |
| 22 | Test infrastructure | Browser drivers moved to `tests/browser-backends.js` (Chromium: DevTools Protocol; Firefox: WebDriver BiDi); `browser-check.js` accepts `--firefox` and reports checks it cannot perform as SKIP. No dependency added | Edge and Chrome 102 of 102 (one added markup check) |
| 23 | Firefox run | First run: 86 passed, 9 failed. Probing showed the failures came from the automated window having no keyboard focus (a plain page behaves the same), from Firefox reporting no sub-resource network events for local files, and from CSP violations not appearing in the BiDi log. The checks were changed to use the standard `securitypolicyviolation` event, a blocked-network test profile, and a skip for focus-dependent checks | Firefox 88 passed, 0 failed, 11 skipped |
| 24 | Screen-reader investigation | Compared the live regions in the accessibility tree before and after each step | An error changes 2 live regions (A6.3); no code change |
| 25 | Screenshot freshness | All screenshots retaken; `docs-check` now compares recorded hashes with the current files | Passes |
| 26 | Final code and security review | Re-read `engine.js` and the remaining source; checked syntax of every JavaScript file | No new findings |
| 27 | Documentation clean-up | Test report rewritten as Part A (current) and Part B (historical Phase 3); test plan merged into one version; other documents corrected for Firefox, CSP and counts | `docs-check` passes |

## 4. Technical decisions made while implementing

| # | Decision | Reason | Where |
|---|---|---|---|
| T1 | `keymap.js` is a separate small file | The key map can be unit-tested in Node (decision D14 addendum) | `keymap.js` |
| T2 | The Error state keeps left number, operator and right number | The display can show `5 ÷ 0` after the error | `engine.js` |
| T3 | `Error` replaces the number on the main display; the message is on its own line | Nothing misleading (`0`), and it works for screen readers. Small change from the static prototype, which showed `0` | `format.js`, prototype updated |
| T4 | An underflow error ("Number too small") was added | A non-zero product could silently become `0` | `engine.js`, FR-11 |
| T5 | After a mouse click the button is blurred | So that a following Enter means "equals" instead of repeating the button | `app.js` |
| T6 | Enter on a button or the help summary keeps its normal meaning | Keeps keyboard access to every key and the help | `app.js` |
| T7 | The display font size steps down for long text (`data-size`) | A 17-character exponent result must fit at 320 px | `app.js`, `styles.css` |
| T8 | `package.json` has scripts only, no dependencies | `npm test` shortcut; not needed to run the app | `package.json` |
| T9 | No `eval`, `Function` or `innerHTML` anywhere, checked by a test | NFR-06 | `tests/security.test.js` |
| T10 | A typed `-0` is normalised: backspace turns `-0` into `0`, negate may remove the minus from `-0.`, entries become numbers through one function that never returns `-0` | BUG-1 | `engine.js` |
| T11 | Two identical switch cases were merged | Simpler code | `engine.js` |
| T12 | **No change** to the arithmetic or the display rounding | The project lead kept D3 and told us not to implement D17 | architecture 6.4 |
| T13 | Browser drivers live in `tests/browser-backends.js` | One test script can drive Edge, Chrome and Firefox | tests |
| T14 | The Firefox test profile blocks all web access and has update and telemetry features off | "Offline" must be real | `browser-backends.js` |

## 5. Student contributions and learning (to be filled in by students)

Nothing has been recorded here by students yet. Suggested columns: date, student, what you read or changed, what you learned, questions.

| Date | Student | Activity | What I learned / questions |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

## 6. Open items

- A student must run the commands in test report A11 and record the result.
- Human verification (test plan section 7): Firefox focus behaviour, screen reader, Lighthouse, real phone, first-time users, independent code review.
- Phase 5 (final report, presentation, demonstration): **draft deliverables prepared** on 31 October 2026 (draft 0.2) in `docs/05-final/`. They are drafts, not final; student review, human tests and rehearsal are still pending.
