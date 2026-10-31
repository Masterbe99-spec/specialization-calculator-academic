# Test Plan

**Status:** v0.3, final for Phase 4 (2026-10-31). This is the plan, not the results: results are in the [test report](test-report.md). History: v0.1 was written before the code (Phase 3); v0.2 added the Phase 4 tests; v0.3 (this version) merges them into one plan and adds Firefox.
**Last updated:** 2026-10-31
**Skill used:** `engineering:testing-strategy` (test pyramid, "what to cover", example cases), invoked in Phase 3. See the [tool log](../00-admin/tool-ai-usage-log.md).

## 1. Goals

1. Show that every active requirement in the [requirements specification](../02-research-requirements/requirements-specification.md) behaves as written.
2. Find problems early and cheaply: most tests run in under a second without a browser.
3. Make every result repeatable by any student with one command.
4. Keep three kinds of verification apart: **automated checks**, **AI review**, and **human verification**.

## 2. Strategy (test pyramid for a very small application)

| Level | What it tests | Tool | Count | Speed |
|---|---|---|---|---|
| Unit and static (automated) | Calculation rules, number formatting, keyboard map, boundaries, random sequences, comparison with a reference model, the design's transition table, colour contrast, rules about the source code (no `eval`, no `innerHTML`, no outside URLs, engine free of page code) | Node.js built-in test runner (`node --test`), no installs | 88 tests in 6 files | about 0.5 s |
| Browser (automated) | The real page from a local file: clicks, key presses, focus, layout at four widths, zoom, offline, CSP, console errors | `tests/browser-check.js` with two drivers in `tests/browser-backends.js`: DevTools Protocol for Edge and Chrome, WebDriver BiDi for Firefox. Node built-ins only | 102 checks in Edge and Chrome; 88 passed and 11 skipped in Firefox | about 15 seconds each |
| Documentation (automated) | Links, requirement IDs, test counts, planning figures and screenshot freshness agree between documents | `node tests/docs-check.js --require-tests` | 1 script | instant |
| AI review | Code review, security analysis, floating-point study, screen-reader investigation | The AI assistant, with the `engineering:code-review` checklist | See [code review](code-review.md) and [security analysis](security-analysis.md) | |
| Human verification | Things a script cannot judge: screen reader, Lighthouse, real phone, a person using the keyboard, Firefox keyboard focus, first-time users, independent code review | The five students | Section 7 and the [team checklist](team-review-checklist.md) | |

Playwright was considered (decision D7) but **not installed**: it needs a dependency and a browser download, which was not approved. The protocol scripts give similar control for one small page and need nothing beyond the browsers already present. Firefox was installed on 2026-10-31 with the project lead's approval (test report A6.1); no other tool was installed.

## 3. Approach: test first (TDD)

1. Write the test with the requirement ID in its name (`T-FR-05: ...`).
2. Run it and watch it **fail** (red).
3. Write the smallest code that passes (green).
4. Clean up and run everything again.

Used for the engine in Phase 3 and for BUG-1 in Phase 4 (failing regression tests first, then the fix). The Superpowers `test-driven-development` skill was **not available** in the sessions, so the steps were followed by hand.

## 4. What is covered, by requirement

Test IDs are the prefix of the test names; `docs-check.js --require-tests` fails if an active functional requirement has no test.

| Requirement | Tests | Level |
|---|---|---|
| FR-01 Digits | digit entry, leading zero, display of typed text | Unit, browser |
| FR-02 Decimal point | one point per number; restarts per number (lesson L5) | Unit, browser |
| FR-03 Four operations | add, subtract, multiply, divide; negative and decimal results; largest typeable numbers | Unit, boundary, browser |
| FR-04 Equals | result; new number after result; operator continues from result | Unit, boundary, browser |
| FR-05 Immediate execution | `2+3*4=20`; left-to-right chains; 2,000 random chains against a reference model | Unit, boundary, browser |
| FR-06 Clear | resets number, operator, error | Unit, browser |
| FR-07 Backspace | delete digit; single digit becomes 0; ignored when nothing typed; **BUG-1 regression** | Unit, boundary, browser |
| FR-08 Operator replaced | `5+*3=15` | Unit, browser |
| FR-09 Division by zero | message, never `NaN` or `Infinity`, recovery by digit or Clear, other keys ignored | Unit, browser |
| FR-10 Display rounding | `0.1+0.2`, `1/3`, preserved internal value, documented `0.1+0.2-0.3` trade-off | Unit, format, browser |
| FR-11 Large, small, overflow | exponential notation; small never `0`; overflow after exactly 309 steps; underflow after exactly 1,075 steps | Unit, format, boundary, browser |
| FR-12 12-digit limit | 13th digit ignored; `0` counts; sign and point do not; 500-digit input | Unit, boundary, browser |
| FR-13 Keyboard | key map; comma alias; modifier keys not taken; Tab, Enter and Space on focused keys; keyboard-only script | Unit, browser |
| FR-14 (retired) | unknown keys, including `%`, are ignored | Unit |
| FR-15 Sign toggle | typed number, result, zero, ignored while waiting, `-0.` handling | Unit, boundary, browser |
| FR-16 Expression line | `7 +`, `5 ÷ 0` | Unit, browser |
| FR-17 History (Could) | not built | |
| FR-18 Safe equals | `=` with nothing pending, `5+=`, no repeat-equals, 24 unusual sequences | Unit, boundary, browser |
| NFR-02 Reliability | seeded random sequences (about 970,000 key presses in unit tests; 1,000 in each browser) | Unit, boundary, browser |
| NFR-03 Usability | key size at six viewport settings | Browser; a user check is human |
| NFR-04 Accessibility | contrast from the stylesheet, names, roles, live-region properties, focus order, focus ring, keyboard-only script | Unit, browser; screen reader is human |
| NFR-05 Compatibility | 320, 360, 768, 1280 px; zoom 200 % and 400 % (emulated); text size 150 % and 200 % | Browser (3 browsers) |
| NFR-06 Security | no `eval`, `Function`, `innerHTML`, storage, network; CSP present and enforced | Unit (static), browser |
| NFR-07 Portability | opens from `file://`; offline; classic scripts in order | Unit (static), browser |
| NFR-08 Maintainability | engine, format, keymap never touch the page; `press()` is pure | Unit (static); peer review is human |
| NFR-09 Legal and ethical | tool log kept | Human inspection |

## 5. Test data and edge cases

Zero as operand, negative numbers in every operation, 12-digit limits, exponent boundaries (`1e12`, `0.0001`), maximum and minimum numbers, overflow and underflow loops, repeated errors, `-0` entries, 500-digit input, 5,000 chained operations, and every key in every phase (random tests and the transition table).

## 6. Entry and exit criteria

- **Enter:** the requirement is written and approved; the test is written first.
- **Exit for acceptance testing (reached on 2026-10-31):** all automated checks pass in the available browsers; failures found along the way are listed in the [bug log](bug-log.md); known limitations are listed, not hidden.
- **Exit for the final report:** the human verification tasks in section 7 are done and recorded with names and dates.

## 7. Human verification checklist (**none of this has been done**)

A box is ticked, with name and date, in the [test report](test-report.md) only after it really happened.

- [ ] Open `src/index.html` in **Firefox in a normal window**. Tab to a key and press Enter and Space; look for the focus ring. (Automated Firefox cannot test this: test report A6.2.)
- [ ] Repeat the calculator review's 10-minute script ([review section 7](../02-research-requirements/calculator-review.md#7-proposed-next-step-not-done-hands-on-session)) on our calculator, in each browser the students use.
- [ ] Screen reader (NVDA on Windows or VoiceOver on Mac): listen to `7 + 8 =` and to `5 ÷ 0 =`. Note what is read, in which order, and whether the error is announced twice (test report A6.3).
- [ ] Browser-menu zoom to 200 % and 400 %, and a larger browser font size, in each browser.
- [ ] A real phone: touch size, layout, rotation, on-screen keyboard.
- [ ] Lighthouse accessibility audit in Chrome DevTools: record the score and every warning.
- [ ] First-time-user check: two people outside the team do `12 + 30 × 2` without help. Record what they did (a small usability check, not research).
- [ ] Peer review of `engine.js` and the tests by a student who did not write them (here: all students, as the assistant wrote them).
- [ ] A student re-runs the commands in test report A11 and records the result.

## 8. Risks to the test process

| Risk | Handling |
|---|---|
| Tests that always pass | Mutation checks were run twice in scratch copies (8 and 16 injected bugs; 15 of 16 caught in the final round). Repeat after big changes |
| Same assistant wrote code and tests | Human review is required before the report (section 7) |
| Browsers are headless, and Edge and Chrome share an engine | Stated in every result; Firefox adds an independent engine; real windows are in the human list |
| Firefox cannot be given keyboard focus by the driver | Those checks are skipped, not passed; a human tests them |
| Floating-point behaviour surprises users | `0.1+0.2-0.3` shows `5.55111512313e-17` by decision D3 (kept; D17 not implemented); it has its own test and a user-guide note is planned |
| Documents drift from reality | `docs-check.js` checks links, IDs, counts, planning figures, and that the screenshots match the current files |
