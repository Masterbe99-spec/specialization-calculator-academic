# Requirements Specification

**Status:** Draft v0.3, awaiting team review. v0.3 records the project lead's decisions of 2026-10-31 (D9-D16). v0.2 applies the lessons of the [calculator review](calculator-review.md) (L1-L11). **No user research has been done**; the user list below is still an assumption. Changes are recorded in the [decision log](../00-admin/decision-log.md).
**Last updated:** 2026-10-31

**Changes from v0.2 (2026-10-31, approved decisions):** FR-14 (percent) retired and moved to Won't have (W-08); FR-15 (sign toggle) raised to Must; FR-13 accepts a comma as an alias for the decimal point; section 4 confirms D3 and rejects the snap-to-zero proposal; FR-11 gains an underflow rule.

**Changes from v0.1:** FR-13 raised to Must; FR-14 defined; FR-12 counting rule made exact; FR-18 added; NFR-03, NFR-04, NFR-05 made testable and corrected (44 px is WCAG AAA, not AA); section 4 gains a Phase 2 finding that needs approval.

Priorities use MoSCoW: **M** Must have, **S** Should have, **C** Could have, **W** Won't have in this project.

## 1. Purpose and context

The product is a single-page calculator that runs in a web browser, offline, with no installation. The professor's brief is "Calculator that allows the user to perform basic mathematical operations" and the result must be a "very simple working application" (slides 10 and 8).

**Users (assumed, not validated; no user research has taken place):** anyone who needs quick everyday arithmetic, on a laptop with keyboard or on a phone with touch.

## 2. Functional requirements

| ID | Requirement | Pri | Acceptance criterion | Verification |
|---|---|---|---|---|
| FR-01 | The user can enter the digits 0-9 with on-screen buttons. | M | Each digit button appends its digit to the current number. A leading zero is not duplicated (`0` then `5` shows `5`). | Unit, Browser |
| FR-02 | The user can enter a decimal point, only one per number. | M | A second `.` in the same number is ignored. Starting with `.` shows `0.`. | Unit, Browser |
| FR-03 | The calculator provides addition, subtraction, multiplication and division. | M | `7+2=9`, `7-2=5`, `7×2=14`, `8÷2=4`. | Unit, Browser |
| FR-04 | Equals shows the result of the pending operation. | M | After `=` the display shows the result. A new digit then starts a new number. An operator pressed after `=` continues from the result. | Unit, Browser |
| FR-05 | Chained operations use immediate execution (decision D1). | M | `2+3×4=` gives `20`, because `2+3` is evaluated when `×` is pressed. This behaviour is stated in the user guide. | Unit, Browser |
| FR-06 | The user can clear everything. | M | Clear resets the number, pending operator, stored value and any error. | Unit, Browser |
| FR-07 | The user can delete the last entered digit. | M | Backspace removes one digit. Backspace on a single digit shows `0`. | Unit, Browser |
| FR-08 | Pressing a second operator in a row replaces the first. | M | `5+×3=` evaluates as `5×3 = 15`. | Unit |
| FR-09 | Division by zero shows a clear message and the calculator recovers. | M | `5÷0=` shows an error message, never `Infinity` or `NaN`. Clear, or entering a digit, returns the calculator to a usable state. | Unit, Browser |
| FR-10 | Display rounding is controlled and never changes the stored value (decision D3). | M | Results are shown with at most 12 significant digits and no trailing zeros. `0.1+0.2` shows `0.3`. The value kept for the next operation is the unrounded result. See section 4. | Unit |
| FR-11 | Very large and very small results are displayed correctly, and overflow is reported. | M | Results that do not fit the display are shown in exponential notation (e.g. `9.99999999998e+23`), not truncated. Non-zero results are never displayed as `0` because of rounding. A result beyond the largest representable number shows an overflow message (`Number too large`). A non-zero product or quotient that becomes too small to represent (it would become `0`) shows `Number too small`. The calculator recovers in both cases. See section 4. | Unit, Browser |
| FR-12 | Number entry is limited to 12 digits. | M | An entry may contain at most 12 digit characters (the `0` in `0.5` counts; the sign and the decimal point do not). Further digit presses are ignored, and this is documented. The display never overflows its container. | Unit, Browser |
| FR-13 | The user can type with the keyboard (raised from Should: lesson L6, WCAG 2.1.1). | M | Digits, `.`, `+ - * /`, `Enter` or `=`, `Backspace`, `Escape` (clear) work as the matching buttons. A comma `,` is accepted as an alias of `.` (the period is the primary decimal separator and the display always shows a period). Keys combined with Ctrl, Alt or Meta are not intercepted. Tab reaches every button and Enter or Space activates it. | Unit (key map), Browser |
| FR-14 | ~~Percent function.~~ **Retired 2026-10-31 (decision D10).** Moved to Won't have, see W-08. | W | Not applicable. The engine must ignore any unknown key, which is tested | Unit |
| FR-15 | The user can change the sign of the current number. | M | Pressing the key toggles between positive and negative. Zero stays `0`. Applies to the number being typed and to a result on screen. | Unit, Browser |
| FR-16 | A secondary line shows the pending operation. | S | After `7+` the secondary line shows `7 +`. | Browser |
| FR-17 | Session-only history of calculations. | C | Built only if the Must and Should items are done and tested. | Browser |
| FR-18 | `=` with no pending operation, or an operator with no second number, is safe. | M | `=` pressed when nothing is pending leaves the display unchanged. `5 + =` leaves the display at `5` with the `+` still pending. No error, no wrong result. Repeat-equals (pressing `=` again repeats the last operation) is not supported (proposed D11). | Unit |

## 3. Non-functional requirements

| ID | Category | Requirement | Verification |
|---|---|---|---|
| NFR-01 | Correctness | Every planned test case passes. Every requirement is linked to at least one test (see [traceability matrix](traceability-matrix.md)). | Unit, Browser, Manual |
| NFR-02 | Reliability | The display never shows `NaN`, `Infinity` or `undefined`. A randomised key-sequence test finds no crash and no invalid display. | Unit (randomised) |
| NFR-03 | Usability | A first-time user completes a simple calculation without instructions. Keys are designed at **48 × 48 CSS px or larger** (WCAG 2.5.5 uses 44 px but is Level AAA; the AA minimum is 24 px, criterion 2.5.8 in WCAG 2.2). | Manual (team check, not user research), Inspection |
| NFR-04 | Accessibility | Checked against WCAG 2.1 AA: **(a)** all functions operable by keyboard (2.1.1, A); **(b)** visible focus indicator with at least 3:1 contrast (1.4.11); **(c)** every button has an accessible name, with `×`, `÷` and `−` named in words (4.1.2, A); **(d)** the display is a live region and error messages are announced (4.1.3); **(e)** text contrast at least 4.5:1 (1.4.3) and key outlines at least 3:1 (1.4.11); **(f)** any animation respects `prefers-reduced-motion`. | Manual, Lighthouse, Inspection |
| NFR-05 | Compatibility | Works in the current versions of Chrome, Firefox and Edge. At 320 CSS px width there is no horizontal scrolling and no loss of function (1.4.10, AA). | Browser, Manual |
| NFR-06 | Security | No `eval` or `Function`, no `innerHTML` with dynamic data, no third-party scripts or CDN assets, and a restrictive Content Security Policy. | Inspection, Security note |
| NFR-07 | Portability | Runs by opening `src/index.html`, with no build step, server or runtime dependency. | Manual |
| NFR-08 | Maintainability | Calculation engine separated from the user interface. Each change is reviewed by at least one other team member. | Inspection |
| NFR-09 | Legal and ethical | Only original or properly licensed code. No personal data is collected or stored. Use of AI assistance is recorded in the [tool and AI usage log](../00-admin/tool-ai-usage-log.md) and follows the professor's policy once known. | Inspection |

## 4. Numeric behaviour (decision D3, provisional)

D3 was confirmed on 2026-10-31. The rules:

1. **The stored value is never rounded.** The engine keeps the full-precision result. Only the display text is formatted.
2. **Display precision:** at most 12 significant digits, trailing zeros removed.
3. **Exponential notation** when the formatted number would not fit (very large, or very small non-zero values).
4. **Overflow:** if a result is not a finite number, show an overflow message instead of `Infinity`.
5. **No silent change of meaning:** a non-zero result is never shown as `0`, and rounding must not turn a different value into the same text without the tests noticing.

**Known trade-off to resolve:** because the stored value is unrounded, `0.1+0.2-0.3` would display about `5.55111512313e-17`, not `0`. This is mathematically honest but may surprise users. 

**Decision (2026-10-31, D9 rejected, D3 confirmed):** the engine preserves the full numeric result and never snaps tiny non-zero results to zero. With rule 1, `0.1+0.2-0.3` therefore displays `5.55111512313e-17`. This is documented, intentional behaviour with its own test. The options that were compared (and not adopted) are in [architecture.md](../03-design-prototype/architecture.md) section 6.

### Required tests for D3

Expected displays below are the targets of the automated tests in `tests/`. Actual results are recorded in the [test report](../04-implementation-testing/test-report.md), not here.

| Area | Example case | Intended behaviour |
|---|---|---|
| Floating-point precision | `0.1+0.2` | Displays `0.3` |
| Floating-point precision | `0.3-0.1`, `1.1×3`, `0.7+0.1` | Display `0.2`, `3.3`, `0.8` |
| Repeating decimals | `1÷3` | Displays 12 significant digits, e.g. `0.333333333333` |
| Large values | `999999999999×999999999999` | Exponential notation, no truncation |
| Small values | `0.00000000001÷10` (the smallest typeable number is 0.00000000001, 12 digits, so `0.000000000001` cannot be entered) | Displays `1e-12`, not `0` |
| Overflow | Repeated multiplication beyond the largest number | Overflow message, calculator recovers |
| Stored value | `0.1+0.2` then `-0.3` | Follows rule 1 and the trade-off above |
| Input limit | 13th digit pressed | Ignored, display unchanged |

## 5. Out of scope (Won't have)

| ID | Item | Reason |
|---|---|---|
| W-01 | Scientific functions, parentheses, operator precedence parsing | Beyond "basic operations", adds risk |
| W-02 | Memory keys (M+, MR, MC) | Not required |
| W-03 | Persistent history, settings, themes | Needs storage and more testing |
| W-04 | Backend, accounts, database | Not needed, adds security surface |
| W-05 | Installable app (PWA), offline caching logic | Plain files already work offline |
| W-06 | Currency or unit conversion | Different product |
| W-07 | Languages other than English | Time |
| W-08 | Percent key (former FR-14), repeat-equals, dark mode, snapping of tiny results to zero | Decisions D9, D10, D11, D15 (2026-10-31): keep the application very simple |

## 6. Mapping to the professor's 17-item list (guidance, pending clarification)

Slides 32-33 list items a project draft "should include". Until the professor confirms they are required, they are treated as guidance and covered in proportion to a very simple application.

| # | Item | Treatment |
|---|---|---|
| 1 | Specification and analysis of user requirements | This document, plus Phase 2 user research |
| 2 | Study of solution possibilities, selection of software technology | Phase 2 review, decision log D2 |
| 3 | Project management method and justification | PBL, project card |
| 4 | Division of tasks | [Responsibility matrix](../01-project-card/responsibility-matrix.md) |
| 5 | Records of working time | [Time log template](../00-admin/time-log.md) created, no hours recorded; only genuine entries will be added |
| 6 | WBS, project charter, scope | [WBS](../01-project-card/wbs.md), [project card](../01-project-card/project-card.md) |
| 7 | Data flow diagrams | Phase 2 (D4) |
| 8 | Class diagrams | Not planned (D4). State diagram instead |
| 9 | Gantt chart | [Gantt](../01-project-card/gantt.md) |
| 10 | Budget estimation | Effort in person-hours only, in project card |
| 11 | List of resources | Project card section 7 |
| 12 | Resource utilisation plan | Responsibility matrix and Gantt |
| 13 | Risk specification and assessment | [Risk register](../00-admin/risk-register.md) |
| 14 | Prototype | Phase 2 |
| 15 | Production management plan, test plan | Phase 3 test plan |
| 16 | Training plan | One-page user guide in Phase 4 |
| 17 | Delivery method | README: how to open the app |
