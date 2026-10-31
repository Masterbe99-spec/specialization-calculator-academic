# Test Plan

**Status:** Draft v0.1 (Phase 3), written 2026-10-31 before the code. Results are **not** in this file: they are in the [test report](test-report.md).
**Last updated:** 2026-10-31
**Skill used:** `engineering:testing-strategy` (test pyramid, "what to cover", example cases). See [tool log](../00-admin/tool-ai-usage-log.md).

## 1. Goals

1. Prove that every active requirement in the [requirements specification](../02-research-requirements/requirements-specification.md) behaves as written.
2. Find problems early and cheaply: most tests run in a fraction of a second without a browser.
3. Make every result repeatable by any student with one command.

## 2. Strategy (test pyramid for a very small application)

| Level | What it tests | Tool | Count (2026-10-31) | Speed |
|---|---|---|---|---|
| **Unit** | Calculation rules, number formatting, keyboard map | Node.js built-in test runner (`node --test`), no installs | 59 tests in 3 files | about 0.4 s |
| **Static inspection (automated)** | No `eval`, no `innerHTML`, no outside URLs, engine free of page code, every button named | Same runner, reads the source files | 6 tests | included above |
| **Browser (automated)** | The real page: clicks, key presses, focus, layout at four widths, console errors, accessibility tree | `tests/browser-check.js`: Node + the installed Edge or Chrome, controlled through the DevTools Protocol. **No installation, no dependency** | 78 checks | about 1 minute |
| **Manual** | Things a script cannot judge: screen reader, first-time-user check, Chrome/Firefox, Lighthouse | Humans | Checklist in section 7 | |
| **Documentation** | Links, IDs and counts agree between documents | `node tests/docs-check.js --require-tests` | 1 script | instant |

Playwright was considered (decision D7) but **not installed**: it needs a dependency and a browser download, which was not approved. The DevTools-Protocol script gives similar control for this small page. It tests one browser at a time (here: Edge).

## 3. Approach: test first (TDD)

1. Write the test with the requirement ID in its name (`T-FR-05: ...`).
2. Run it and watch it **fail** (red). Phase 3 record: with no source files, all test files failed to load.
3. Write the smallest code that passes (green).
4. Clean up, run everything again.

The Superpowers `test-driven-development` skill was **not available** in this session (see tool log), so the steps were followed by hand.

## 4. What is covered, by requirement

Test IDs are the prefix of the test names. Names are searched by `docs-check.js`, which fails if an active functional requirement has no test.

| Requirement | Planned tests | Level |
|---|---|---|
| FR-01 Digits | digit entry, leading zero, display of typed text | Unit, browser |
| FR-02 Decimal point | one point per number, point restarts per number (lesson L5) | Unit, browser |
| FR-03 Four operations | add, subtract, multiply, divide, negative and decimal results | Unit, browser |
| FR-04 Equals | result, new number after result, operator continues from result | Unit, browser |
| FR-05 Immediate execution | `2+3*4=20`, left-to-right chains | Unit, browser |
| FR-06 Clear | resets number, operator, error | Unit, browser |
| FR-07 Backspace | delete digit, single digit becomes 0, ignored when nothing typed | Unit, browser |
| FR-08 Operator replaced | `5+*3=15` | Unit, browser |
| FR-09 Division by zero | message, never `NaN`/`Infinity`, recovery by digit or Clear, other keys ignored | Unit, browser |
| FR-10 Display rounding | `0.1+0.2`, `1/3`, preserved internal value, documented `0.1+0.2-0.3` trade-off | Unit, browser |
| FR-11 Large, small, overflow | exponential notation, small never `0`, overflow and underflow messages and recovery | Unit, browser |
| FR-12 12-digit limit | 13th digit ignored, `0` counts, sign and point do not | Unit, browser |
| FR-13 Keyboard | key map, comma alias, modifier keys not taken, Tab, Enter and Space on focused keys | Unit, browser |
| FR-14 (retired) | unknown keys, including `%`, are ignored | Unit |
| FR-15 Sign toggle | typed number, result, zero, ignored while waiting | Unit, browser |
| FR-16 Expression line | `7 +`, `5 ÷ 0` | Unit, browser |
| FR-17 History (Could) | not built | |
| FR-18 Safe equals | `=` with nothing pending, `5+=`, no repeat-equals | Unit, browser |
| NFR-02 Reliability | 20,000 seeded random key sequences (engine) and 400 random keys (browser) | Unit, browser |
| NFR-03 Usability | key size at four widths (smallest key measured) | Browser |
| NFR-04 Accessibility | keys named, `status` and `alert` roles, focus ring, language | Static, browser; **screen reader manual** |
| NFR-05 Compatibility | no horizontal scroll and everything inside the viewport at 320, 360, 768, 1280 px | Browser (Edge only) |
| NFR-06 Security | no `eval`/`Function`/`innerHTML`/storage/network, CSP present and working from `file://` | Static, browser |
| NFR-07 Portability | opens from `file://`, classic scripts in order | Static, browser |
| NFR-08 Maintainability | engine, format, keymap never touch the page; `press()` is pure | Static, unit; **peer review manual** |
| NFR-09 Legal and ethical | tool log inspection | Manual |

## 5. Test data and edge cases

Chosen with the testing strategy's "business-critical paths, error handling, edge cases": zero as operand, negative results, 12-digit limits, exponent boundaries (`1e12`, `0.0001`), maximum and minimum doubles, overflow and underflow loops, repeated errors, and keys pressed in the wrong state (every key in every state is covered by the random test and the state table).

## 6. Entry and exit criteria

- **Enter:** requirement is written and approved; test written first.
- **Exit for Phase 3 review:** all automated checks pass; failures found along the way are listed in the test report; known limitations are listed, not hidden.
- **Not an exit criterion yet:** the manual checks in section 7.

## 7. Manual checklist (for the team; **not yet done**)

Each box is ticked, with name and date, in the test report only after it really happened.

- [ ] Open `src/index.html` in Chrome and Firefox. Repeat the 10-minute script in the [calculator review](../02-research-requirements/calculator-review.md#7-proposed-next-step-not-done-hands-on-session) on our calculator.
- [ ] Run `node tests/browser-check.js` with `BROWSER` set to Chrome (a Chrome-based browser works).
- [ ] Screen reader: NVDA (Windows) or VoiceOver (Mac). Listen to `7 + 8 =`, `5 ÷ 0 =`, and Tab through the keys. Note anything unclear (design note A1).
- [ ] Zoom to 200 % and 400 % in each browser. Check that nothing is cut off.
- [ ] Phone: open the file or a copy on a real phone. Check touch size and layout.
- [ ] Lighthouse accessibility audit (Chrome DevTools).
- [ ] First-time-user check: ask two people outside the team to do `12 + 30 × 2` without help. Record what happened. This is a small usability test, not research.
- [ ] Peer review of `engine.js` by a student who did not write it.

## 8. Risks to the test process

| Risk | Handling |
|---|---|
| Tests that always pass | A scratch **mutation check** (eight injected bugs) was run once; see the test report. Repeat after big changes |
| One browser only | Stated openly in every result; manual items above |
| Tests written by the same tool as the code | The team must read the tests and challenge them. See the [code walkthrough](code-walkthrough.md) |
| Floating-point behaviour surprises users | `0.1+0.2-0.3` shows `5.55111512313e-17` by decision D3; it has its own test and a user-guide note is planned |
