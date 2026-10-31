# Test Report

**Status:** Final Phase 4 report, 2026-10-31. **Part A is the current result. Part B is the superseded Phase 3 result, kept as history.**
**Last updated:** 2026-10-31

**Read this first.** Every run in this report was made by the AI assistant (Claude Code) in the project lead's session. **No student has run any test, and no human has verified anything yet.** Section A5 lists what is automated, what the AI reviewed, and what still needs people. Numbers in Part A come from the commands in A2 and were produced by real runs on 2026-10-31.

## Contents

- **Part A: Current results (Phase 4, final)**: A1 environment, A2 commands and results, A3 browser results, A4 unit tests, A5 who verified what, A6 Firefox and the accessibility investigation, A7 problems found, A8 requirement coverage, A9 limitations, A10 quality gate, A11 how to repeat
- **Part B: Historical Phase 3 results** (commit `602e34a`; superseded)

---

# Part A. Current results (Phase 4, final)

## A1. Environment

| Item | Value |
|---|---|
| Date | 2026-10-31 |
| Run by | The AI assistant, in the project lead's session |
| Code state | Commit `602e34a` (Phase 3) plus the Phase 4 changes, committed locally as `test: add QA tests and fix negative-zero entry bug` (see the Git log) |
| Computer, Node.js | Windows 11, Node.js v24.21.0 |
| Browser 1 | Microsoft Edge 156.0.4314.50 (headless) |
| Browser 2 | Google Chrome 156.0.8078.74 (headless). Same engine family as Edge (Chromium), so **not independent** of it |
| Browser 3 | **Mozilla Firefox 159.0** (headless), installed on 2026-10-31 with the project lead's approval (see A6.1) |
| All browsers | The page is opened directly from its local file (`file:///…/src/index.html`), no server |
| Not tested | Safari, mobile browsers, any real phone, any real screen reader |

## A2. Commands and results (final quality gate run)

| # | Command | Result |
|---|---|---|
| 1 | `node --test` | **88 passed, 0 failed**, 0 cancelled, 0 skipped, 0.45 s |
| 2 | `node tests/browser-check.js` (Edge) | **102 passed, 0 failed** |
| 3 | `BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"` then `node tests/browser-check.js` (Chrome) | **102 passed, 0 failed** |
| 4 | `node tests/browser-check.js --firefox` (Firefox) | **88 passed, 0 failed, 11 skipped** (A6.2 lists each skip and why) |
| 5 | `node tests/docs-check.js --require-tests` | **PASSED, 0 errors, 0 warnings.** 24 Markdown files, 130 relative links, 27 requirement IDs, 17 functional requirements with a named test, screenshot hashes match the current files |
| 6 | `node --check` on every JavaScript file in `src/` and `tests/` | No syntax errors |

## A3. Browser results

Each browser ran the same script, `tests/browser-check.js`, which clicks with the mouse, presses real keys, and reads the page. Totals differ because some checks use Chromium-only commands.

| Area | Edge | Chrome | Firefox |
|---|---|---|---|
| Page load without console errors, scripts defined, `file://`, CSP present | pass | pass | pass |
| 16 mouse calculations, expression line, Clear | pass | pass | pass |
| Division by zero: message, expression, keys do not move, recovery by digit and by Clear | pass | pass | pass |
| Overflow with the keyboard (`9.99999999998e+23`, then "Number too large") | pass | pass | pass |
| Keyboard typing, Escape, comma, Backspace, error recovery, browser shortcuts (Ctrl+C, F5) not blocked | pass | pass | pass |
| Tab order equals visual order; Tab reaches the help summary | pass | pass | pass |
| Focus ring, Enter and Space on a focused key, Enter on the help summary | pass | pass | **skipped** (no keyboard focus, A6.2) |
| Keyboard-only operation (Tab, Shift+Tab, Space, Enter): `7 + 8 = 15`, Clear, `9 ÷ 0` error and recovery | pass | pass | **skipped** (same reason) |
| Accessibility tree: 19 named buttons, operators named in words, `status` and `alert` roles | pass | pass | **skipped** (no tree command); replaced by a **markup** check: 19 labelled buttons, `<output aria-live="polite">`, `role="alert"`: pass |
| Live region properties (`polite`, `atomic`) and value in the tree | pass | pass | **skipped**; replaced by a markup check: pass |
| Layout at 320, 360, 768, 1280 px: no horizontal scroll, keys inside viewport, keys at least 48 x 48 px, long numbers fit | pass | pass | pass |
| Browser zoom 200 % and 400 % (emulated) and text size 150 % and 200 % at 320 px | pass | pass | pass |
| Offline: Edge and Chrome made at least 6 requests, all `file:` (Edge: exactly 6). Firefox: web access switched off in the test profile and the calculator still works | pass | pass | pass |
| CSP enforced: inline script blocked, outside script blocked, `securitypolicyviolation` events raised | pass | pass | pass |
| CSP: `eval()` blocked (`EvalError`) | pass | pass | **skipped** (a protocol evaluation may bypass the policy) |
| 1,000 random key presses never give an invalid display | pass | pass | pass |
| No console errors, warnings, exceptions or CSP violations in the whole run | pass | pass | pass |
| **Totals** | **102 of 102** | **102 of 102** | **88 passed, 0 failed, 11 skipped** |

Smallest key measured: 61.5 x 56.0 CSS px at 320 px width (design minimum 48 x 48). At 400 % zoom (320 x 256 CSS px) and at 200 % text size there is no horizontal scrolling and long numbers fit the display.

## A4. Unit and static tests (88)

| File | Tests | What it checks |
|---|---|---|
| `engine.test.js` | 40 | Every functional requirement from the user's side: digits, decimals, four operations, equals, chaining, Clear, Backspace, sign, errors and recovery, number formatting through the display, 12-digit limit, expression line, 20,000 random key sequences |
| `format.test.js` | 10 | Display policy: 12 significant digits, fixed or exponential notation, `0.1+0.2`, `1/3`, very small and very large numbers, never `0` for a non-zero value, non-finite numbers refused, error messages |
| `keymap.test.js` | 9 | Which physical keys the calculator uses, comma alias, Ctrl/Alt/Meta not taken, bad input safe |
| `security.test.js` | 6 | No `eval`, `Function`, `innerHTML`, storage, network or outside URLs; engine, format and keymap never touch the page; classic scripts in order; every button named |
| `boundary.test.js` | 17 | BUG-1 regression (4), typed-entry shape over about 410,000 random key presses, phase and field consistency over 150,000 presses, 2,000 random chains compared with a plain-JavaScript reference (all 2,000 equal), 500-digit input and 5,000 chained additions, overflow after exactly 309 multiplications by 10, underflow after exactly 1,075 halvings (last good value `4.94065645841e-324`, never `0`), 24 unusual key sequences, the design's transition table (42 cases) |
| `accessibility.test.js` | 6 | Colour contrast read from the real stylesheet (text at least 4.5:1; borders and focus ring at least 3:1), focus style present and never removed, reduced-motion rule, key size, page structure (title, one `h1`, zoom not disabled, live display, alert) |

Mutation check (scratch copy outside the repository, script not kept): 16 deliberate bugs injected one at a time; **15 of 16 were caught by `node --test`**, each by 1 to 8 failing tests. The one miss (focus not released after a mouse click, in `app.js`) is behaviour that only the browser check exercises; it passes on the real code but was not itself mutation-tested.

## A5. Who verified what

| Kind | What it covers | Status |
|---|---|---|
| **Automated checks** (A2 to A4) | Calculation rules, display text, key map, static code rules, contrast, behaviour in three browsers, layout, zoom, offline, CSP | **Done, all pass** (with the skips in A6.2) |
| **AI review** (not independent: the same assistant wrote the code) | [Code review](code-review.md) (findings and BUG-1 fix), [security analysis](security-analysis.md), floating-point study, screen-reader investigation (A6.3) | **Done by the AI**; needs human confirmation |
| **Human verification** | Screen reader, Lighthouse, real phone, a person using only the keyboard, **keyboard focus behaviour in Firefox**, first-time users, independent code review, re-running the commands, checking every reference URL | **Not done.** Tasks are in the [team checklist](team-review-checklist.md) and the [acceptance checklist](../05-final/acceptance-and-submission-checklist.md) |

### Runs by students (to be filled in)

| Date | Student | Commands run | Browser, computer | Result |
|---|---|---|---|---|
| | | | | |

## A6. Firefox and the accessibility investigation

### A6.1 How Firefox was added (approved by the project lead)

- The installer was downloaded from Mozilla's official download service (`download.mozilla.org`, product `firefox-latest-ssl`, Windows 64-bit, English). **Authenticode signature: valid, signed by "Mozilla Corporation"** (issuer DigiCert). SHA-256 of the installer: `8776887B79925ABBDD407FCDFE257D8382B54E24BE52A6466426B95A804D6790`.
- It was installed **per user** (no administrator rights) into `%LOCALAPPDATA%\Programs\Mozilla Firefox`, silently, with no desktop, taskbar or start-menu shortcuts and without the maintenance service. Installed version **159.0**; `firefox.exe` signature valid (Mozilla Corporation).
- Nothing else was installed. No driver program (such as geckodriver) was needed: Firefox has a built-in remote protocol, WebDriver BiDi.
- **Changes to the test infrastructure (minimal, in the repository):** new file `tests/browser-backends.js` (204 lines, Node built-ins only) holding the two browser drivers; `tests/browser-check.js` now uses a driver object instead of calling the protocol directly, accepts `--firefox`, and can skip checks that a driver cannot perform. There is **no new dependency**; `package.json` is unchanged.
- Each Firefox run uses a throw-away profile in the temporary folder, with first-run, update and telemetry features switched off and **all web access blocked** (a proxy on a dead port), so that "offline" is real.

### A6.2 Firefox: what passed and what was skipped

Firefox 159.0, headless, from the local file: **88 passed, 0 failed, 11 skipped.** The calculations, keyboard typing, Escape, comma, Backspace, error recovery, console, layout at four widths, zoom, offline, CSP and random keys all pass.

| Skipped (11) | Why |
|---|---|
| Focus ring; Enter on a focused key; Space on a focused key; Enter on the help summary (4) | The automated Firefox window **has no keyboard focus**: `document.hasFocus()` is `false`. A **plain page with a bare button** behaves identically (no focus ring, Enter and Space do nothing), so this is a property of the automated window, **not evidence of a calculator problem**. A visible window, `browsingContext.activate` and an operating-system activation call were all tried; none gave focus |
| Keyboard-only operation (4) | Same reason (it needs Space and Enter on focused keys) |
| Accessibility tree (2) and `eval()` blocked by CSP (1) | Firefox's remote protocol has no accessibility-tree command, and evaluating code through it may bypass the page's policy |

**Therefore the keyboard-focus behaviour of the calculator in Firefox is not verified.** It is Student 3's task (checklist): Tab to a key, press Enter and Space, look for the focus ring, in a normal Firefox window. The firefox-specific screenshots omit the focus picture for the same reason.

### A6.3 Possible duplicate screen-reader announcement: investigation

- **Question.** When an error occurs, the display text changes to `Error` (a polite live region) and the error line shows `Cannot divide by zero` (an alert). Could a screen reader speak this twice?
- **Method.** A scratch script (not kept in the repository) read the browser's accessibility tree before and after each step in Edge and compared the two live regions. This shows which live regions change; it does **not** show what a screen reader says.
- **Result.** The display is `status`, `live=polite`, `atomic=true`. The error line is `alert`, `live=assertive`, `atomic=true`.

| Step | Live regions whose text changed |
|---|---|
| press `7` | 1 (display `0` → `7`) |
| `+ 8 =` | 1 (display → `15`) |
| Escape | 1 |
| `5 ÷ 0 =` | **2**: display `0` → `Error` (polite) and error line `` → `Cannot divide by zero` (assertive) |
| a digit after the error | 2: display → `3`, error line emptied |

- **Conclusion.** There is **no identical text spoken twice** by design: the two messages differ (`Error` and `Cannot divide by zero`). But an error causes **two announcements** (one polite, one assertive). Whether a screen reader reads both, in which order, or interrupts one with the other depends on the screen reader and browser and **could not be tested** (no screen reader is available to the assistant; Narrator's speech cannot be captured by a script; the browser did not emit accessibility update events in headless mode).
- **Decision.** The code was **not** changed, because a change without a real screen-reader test could make things worse. A possible later change (not made): make the error line the only announcement by silencing the display's live region while in the Error state. Student 3 should test with NVDA or VoiceOver and the project lead decides afterwards.

## A7. Problems found and fixed

See the [bug log](bug-log.md). **One application bug was found in Phase 4 (BUG-1) and fixed**: after `0.5`, `±`, backspace twice, the display showed `-0` and then `-07` after typing 7. It passed all Phase 3 tests, was found by code review and probing, and was fixed with regression tests written first. All other entries are mistakes in tests, scripts or documents. **No other failing application behaviour was found in Edge, Chrome or Firefox.**

## A8. Requirement coverage (final)

| Requirement | Automated result | Not verified |
|---|---|---|
| FR-01 to FR-12, FR-15, FR-16, FR-18 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox | Real users |
| FR-13 Keyboard | Unit (key map), browser typing in all three browsers; keyboard-only script in Edge and Chrome | Focus-dependent keyboard behaviour in Firefox; a person using only the keyboard |
| FR-14 (retired, percent) | Unknown keys, including `%`, are ignored: pass | |
| FR-17 History (Could) | Not built | |
| NFR-02 Reliability | About 970,000 random key presses (unit: about 410,000 + 410,000 + 150,000) and 1,000 (browser, each browser) | |
| NFR-03 Usability | Key size measured at 6 viewport settings | A first-time-user check |
| NFR-04 Accessibility | Contrast, names, roles, live-region properties (Edge, Chrome), markup (Firefox), focus order, keyboard-only script (Edge, Chrome) | Screen reader, Lighthouse, human keyboard test, Firefox focus |
| NFR-05 Compatibility | 320, 360, 768, 1280 px; zoom 200 % and 400 %; text 150 % and 200 % in all three browsers | Real devices; Safari |
| NFR-06 Security | Static scan, CSP enforced in all three browsers, no network, no storage | Independent human review |
| NFR-07 Portability | `file://`, offline, classic scripts, in all three browsers | |
| NFR-08 Maintainability | Purity and separation tests; code review by the author | Independent review |
| NFR-09 Legal and ethical | Tool log kept | Human inspection |

## A9. Known limitations (not bugs)

| # | Item |
|---|---|
| L1 | `0.1+0.2-0.3` shows `5.55111512313e-17` (decision D3, kept by the project lead; D17 not implemented). `1-0.9999999999` shows `1.00000008274e-10` instead of `1e-10`, because stored numbers are doubles |
| L2 | The display shows at most 12 significant digits. The full value is kept internally |
| L3 | A 13th typed digit is silently ignored (FR-12). The `0` of `0.5` counts, so `0.` allows 11 decimals |
| L4 | After a mouse click the keyboard focus is released so that Enter means "equals" |
| L5 | Key names are words ("Times") while the visible text is a symbol ("×"); voice-control users may need to say the word. Untested |
| L6 | An error causes two screen-reader announcements (A6.3). Behaviour with a real screen reader is unknown |
| L7 | Mermaid state-diagram labels overlap in automatic layout (documentation only) |
| L8 | Firefox focus behaviour (A6.2) and Safari are not verified |
| L9 | Browser "zoom" and "larger text" were **emulated** with the browser protocol and a root font size, not set through the browser's menu |
| L10 | The tests were written by the same assistant that wrote the code; independent human review is outstanding |
| L11 | All browsers were headless, and Chrome and Edge share an engine |

## A10. Quality gate

| Question | Answer |
|---|---|
| All automated tests pass? | **Yes**: 88 of 88 unit and static tests; 102 of 102 browser checks in Edge and in Chrome; 88 passed, 0 failed, 11 skipped in Firefox |
| Any known failing behaviour? | **No** |
| Unresolved issues | Firefox keyboard-focus behaviour unverified; screen-reader behaviour unknown; human reviews not started; D17 deliberately not implemented |
| Ready for **student acceptance testing**? | **Yes.** Use the [acceptance and submission checklist](../05-final/acceptance-and-submission-checklist.md) and the [team checklist](team-review-checklist.md) |
| Ready for the final report and defence? | **Not yet.** The human tasks above should be done and recorded first |

## A11. How to repeat everything

From the project root (Node.js 22 or newer):

```
node --test
node tests/browser-check.js --shots                   Edge or Chrome (first one found)
BROWSER="path\to\chrome.exe" node tests/browser-check.js
node tests/browser-check.js --firefox --shots         Firefox (set FIREFOX="path\to\firefox.exe" if not in the default place)
node tests/docs-check.js --require-tests
```

Screenshots: [evidence/screenshots/README.md](../../evidence/screenshots/README.md). Their hashes tie them to the current files.

---

# Part B. Historical Phase 3 results (superseded)

**Status:** Superseded by Part A. Kept because it is valid evidence of what the project looked like at commit `602e34a` (Phase 3). Not to be quoted as current.

## B1. What was run

| Item | Value |
|---|---|
| Date, run by | 2026-10-31, the AI assistant |
| Code state | Commit `2784c9a` (Phase 2) plus the uncommitted Phase 3 files, later committed as `602e34a` |
| Browser | Microsoft Edge 156.0.4314.50 headless, from `file://`. Chrome and Firefox: not tested at that time |

## B2. Results at that time

| Command | Result |
|---|---|
| `node --test` | 65 passed, 0 failed (engine 40, format 10, keymap 9, security 6) |
| `node tests/browser-check.js --shots` | 78 passed, 0 failed |
| `node tests/docs-check.js --require-tests` | PASSED, 0 errors, 0 warnings |

## B3. Test-first record

| Step | What happened |
|---|---|
| Red | Before any source file existed, `node --test` failed: all test files crashed with `Cannot find module '../src/js/engine.js'` (or `keymap.js`). 0 passed |
| Green (units) | After writing the engine, formatter and key map: 58 of 59 passed; the failure was a mistake in the test itself |
| Green (static) | After writing the page: 3 static tests failed for the reasons in B5; fixed, then 65 of 65 |

## B4. Browser checks at that time (78)

Page load (5), 16 mouse calculations with expression line and Clear (18), division by zero and recovery (7), overflow with the keyboard (2), keyboard (8), focus and Tab (7), accessibility tree (5), responsive layout at 320, 360, 768, 1280 px (24), 400 random key presses (1), console (1).

## B5. Problems found in Phase 3

| # | Problem | Cause | Fix |
|---|---|---|---|
| 1 | A random test failed on its first run | The test treated `null` (no error message) as invalid | Test corrected |
| 2 | Static security tests failed on `app.js` and `engine.js` | They also read comments such as "never innerHTML" | Tests strip comments |
| 3 | Test expected 18 keys, page has 19 | Documentation error from Phase 2 | Documents, comment and test corrected to 19 |
| 4 | Five browser checks failed on Tab order | Test error: Tab starts at the last clicked element; the summary is the 20th stop | Test reloads first, counts 20 |
| 5 | A requirement example could not be typed | `0.000000000001` has 13 digits; the limit is 12 | Example changed to `0.00000000001 ÷ 10 = 1e-12` |
| 6 | First mutation check was invalid ("0 passed") | Scratch folder inherited `"type": "module"` | Local `package.json` in the scratch copy |

## B6. Mutation check at that time

Eight bugs were injected one at a time into a scratch copy; all 8 were caught (1 to 6 failing tests each): division-by-zero check removed, second operator ignored, 13-digit limit, chaining ignores the pending operation, 15 display digits, several decimal points, negating zero, Ctrl/Alt/Meta shortcuts taken over. This was a smaller sample than the Phase 4 check in A4.

## B7. Limitations recorded at that time (all still true unless Part A says otherwise)

Display limited to 12 significant digits; 13th digit ignored; focus released after a mouse click; symbol vs word key names; screen-reader behaviour unknown; only Edge tested (**Chrome and Firefox have since been tested, see Part A**); Mermaid label overlap; no 200 %/400 % text-zoom test (**done in Phase 4**).
