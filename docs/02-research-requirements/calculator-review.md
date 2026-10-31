# Review of Existing Calculators

**Last updated:** 2026-10-31
**Status:** Draft v0.2 (Phase 2, finalised 2026-10-31). References re-checked on 2026-10-31 (section 8). Still needs a human check by a team member.
**Purpose:** The professor's item 2 asks for an "analysis of existing solutions" (slide 8). This review compares three existing basic calculators and turns the findings into design lessons for our application.

## 0. Honesty statement: what this review is and is not

| Question | Answer |
|---|---|
| Was user research done (interviews, surveys, usability tests)? | **No.** None has taken place. |
| Did the team members use the three calculators hands-on for this review? | **No.** The findings below come from reading official documentation and source code. |
| Was any code of the open-source calculator run? | **No.** Its behaviour was read from its source code. Statements marked *inferred* follow from reading the code and must be confirmed by running it. |
| How were the sources read? | An AI assistant (Claude Code) fetched the pages with web tools on 2026-10-31 and reported them. See [tool log](../00-admin/tool-ai-usage-log.md) entries 14-15. **A team member must open each URL and check the quoted facts** (risk RK-11). |
| Is every fact verbatim? | Facts marked **[V]** were quoted from a page that was read. Facts marked **[S]** reached us through a model summary and were *not verified*. On 2026-10-31 the assistant downloaded the Windows resource file and the other pages directly with `curl` and checked each quote; the former [S] items are now **[V]**. No [S] items remain. Facts marked **[I]** are inferred from source code and not run. |

A short hands-on session by the team is proposed in section 7. Until it happens, usability statements about the three products are limited to what the sources document.

## 1. Method and selection

Three products were chosen to cover three different situations:

| # | Product | Why it was chosen |
|---|---|---|
| A | **Windows Calculator**, Microsoft (Standard mode) | A mature, widely used desktop calculator. Its source is public, so behaviour and accessibility strings can be checked. |
| B | **Google Search calculator** | A calculator many people meet on the web. It shows how a web-based calculator is described by its maker. |
| C | **Mar-Issah/JavaScript-Calculator**, a small open-source vanilla JS calculator (MIT) | Same technology as our project (HTML, CSS, vanilla JavaScript). A realistic example of what a student-level project looks like, including its weak points. It is **one example, not a representative sample**: it was found by a web search for "simple vanilla JavaScript calculator" and chosen because its licence is clearly stated. |

Comparison criteria: basic functionality, usability, input handling, error handling (as requested), plus accessibility and licence.

## 2. Product summaries

### A. Windows Calculator (Microsoft)

- **Scope.** "provides standard, scientific, and programmer calculator functionality, as well as a set of converters between various units of measurement and currencies" [V1]. It also has date calculation, history and memory, and unit and currency conversion [V1].
- **Standard mode.** "offers basic operations and evaluates commands immediately as they are entered" [V1]. Scientific mode instead "evaluates commands using order of operations" [V1]. This is exactly the choice our decision D1 makes for the basic mode.
- **Precision.** "Infinite precision for basic arithmetic operations (addition, subtraction, multiplication, division)" [V1]. We cannot copy this with plain JavaScript numbers (see lesson L2).
- **Keyboard.** The README has no shortcut list. The resource file shows tooltips such as "History (Ctrl+H)" and "Memory store (Ctrl+M)" [V3]. In the same file the Escape key is bound to the Clear button [V3].
- **Accessibility strings.** The resource file contains screen-reader text such as "Display is %1" and "Expression is %1", and a note that the minus sign is read as "Minus" so that "1 - 3 = -2" is spoken as "1 minus 3 = minus 2" [V3].
- **Error text.** "Calculation failed" is documented as "Text displayed when the application is not able to do a calculation" [V3]. The file also contains "Cannot divide by zero" and "Overflow (the number is too large)" [V3], but the comments of both entries say they are errors "during graphing", so **what Standard mode shows for 5 ÷ 0 is not confirmed** by this review.
- **Licence.** MIT [V2].

### B. Google Search calculator

- **Opening.** "Type your equation into the search box on google.com or Search for: Calculator" [V4].
- **Scope.** The help page lists "Arithmetic", "Functions", "Value of physical constants" and "Base and representative conversion" [V4]. It also describes graphing (trigonometric, exponential, logarithmic, 3D) [V4].
- **Input.** The only input method described is typing into the search box. The page says nothing about a keypad or shortcuts [V4].
- **Errors.** For division by zero the page does not show an error message. It says the calculator may not appear: `Make sure your equation is something that can be computed. For example, if you search for "7*9/0," you won't see the calculator pop up because dividing by zero doesn't create a value.` [V4]
- **History and memory.** The help page does not mention them [V4]. (Absence from the page is not proof that the feature does not exist.)
- **Licence.** Proprietary online service. Nothing can be reused.

### C. Mar-Issah/JavaScript-Calculator (open source)

Everything in this section is read from the source files `index.html` and `js/app.js` and was **not run** [V5].

- **Structure.** `index.html`, `css/`, `js/app.js`. A `Calculator` class with methods `appendNumber`, `operationSign`, `compute`, `formatNumber`, `updateOutput`, `delete`, `clear`. Licence: MIT, "Copyright (c) 2021 Siya" [V5].
- **No `eval`.** The file contains no `eval()` or `Function()` call [V5].
- **Chained operations.** `operationSign` calls `compute()` when a previous operand exists, so `2 + 3 * 4 =` gives (2+3)×4 = 20: immediate execution [V5].
- **Repeated decimal point.** `if (num === "." && this.currentOperand.includes(".")) return;` ignores a second dot in the same number [V5].
- **Two operators in a row.** `operationSign` returns early if no number has been entered, so the second operator is ignored and the first stays [V5].
- **Division by zero.** No zero check: `result = previous / current;` [V5]. *Inferred [I]:* `1 ÷ 0` produces `Infinity` and `0 ÷ 0` produces `NaN`; how these are displayed was not observed.
- **Floating point.** No rounding in `compute`. *Inferred [I]:* `0.1 + 0.2` would be stored and shown as `0.30000000000000004`.
- **Keyboard.** `app.js` has no `keydown`, `keypress` or `keyup` listener [V5].
- **Accessibility.** The buttons have no `aria-label`. The output has no `aria-live` [V5].

## 3. Comparison

| Criterion | A. Windows Calculator (Standard) | B. Google Search calculator | C. Open-source JS calculator |
|---|---|---|---|
| **Basic functionality** | Basic operations, plus modes, history, memory, converters [V1] | Arithmetic and much more, including graphing [V4] | Four operations, clear, delete, decimal [V5] |
| **Evaluation model** | Immediate execution in Standard mode [V1] | Not documented on the help page | Immediate execution [V5] |
| **Precision** | Infinite precision for the four basic operations [V1] | Not documented | Plain JS numbers, no rounding [V5]. Float noise likely visible [I] |
| **Input method** | Buttons, keyboard, shortcuts [V3] | Typed expression in the search box [V4]; the page does not document a keypad | Buttons only (no key handler) [V5] |
| **Input handling** | Not examined in detail | Not documented | Ignores a second `.` in one number; ignores a second operator [V5] |
| **Error handling** | Has messages such as "Calculation failed" [V3]. Standard-mode divide-by-zero text unconfirmed | No error shown for `7*9/0`: the calculator does not appear [V4] | None for division by zero [V5]. Likely `Infinity` or `NaN` shown [I] |
| **Accessibility** | Screen-reader strings: "Display is %1", "Minus" [V3] | Not documented on the help page | No labels, no live region [V5] |
| **Usability observations** | Not collected (no hands-on test) | Not collected (no hands-on test) | Not collected (code not run) |
| **Reusability** | MIT [V2], but too large to reuse | Not reusable | MIT [V5]. We will write our own code and will not copy it |

## 4. Design lessons for our calculator

| ID | Lesson (what the sources show) | What we do about it | Affects |
|---|---|---|---|
| L1 | The Standard mode of Windows Calculator and the open-source example both use immediate execution [V1, V5]. | Keep decision D1. State clearly in the help text that `2 + 3 × 4 =` gives 20. | FR-05, D1 |
| L2 | Windows uses infinite precision [V1]. The open-source example does not round at all [V5, I]. Plain JavaScript numbers cannot be infinitely precise. | We need an explicit number policy, not an accident. Rounding options are compared in `docs/03-design-prototype/architecture.md` and need approval (proposed D9). | FR-10, FR-11, D3 |
| L3 | The open-source example has no division-by-zero check [V5]. Google does not display a result for it [V4]. | Division by zero is a defined state with a visible message and recovery. Never show `Infinity` or `NaN`. | FR-09, NFR-02 |
| L4 | The open-source example ignores a second operator [V5]. We could not confirm what the other two do. | Replace the operator instead: if a user hits `×` after `+` they most likely corrected a mistake. This is **our design choice**, not a copied behaviour. | FR-08 |
| L5 | The decimal-point rule must apply per number, not per calculation [V5]. | Reset the "has a decimal point" check whenever a new number starts. Test: `1.5 + 2.5`. | FR-02 |
| L6 | The open-source example has no keyboard support [V5]. Windows has keyboard shortcuts [V3]. WCAG 2.1.1 requires that "All functionality of the content is operable through a keyboard interface" [V6]. | Make keyboard input a **Must**. Use real `<button>` elements so Tab and Enter/Space also work. | FR-13 (raised to Must), NFR-04 |
| L7 | The open-source example's buttons have no accessible names [V5]. `×` and `÷` are symbols that screen readers may read badly. Windows replaces "-" by "Minus" for speech [V3]. | Every button gets an accessible name ("times", "divided by", "minus", "delete last digit"). WCAG 4.1.2 requires name and role to be programmatically determinable [V6]. | NFR-04 |
| L8 | Windows announces the display as "Display is %1" [V3]. Google and the open-source example have no documented announcements. | The display is an `<output>` element, which is a live region. Announcements are kept short. WCAG 4.1.3 asks that status messages can be determined programmatically without receiving focus [V6]. | NFR-04 |
| L9 | Windows shows shortcuts in tooltips [V3]. Our app has no menus. | Add a short, visible "Keyboard" help (a native `<details>` element). | UI design |
| L10 | Windows and Google offer far more than basic arithmetic [V1, V4]. | Do not copy features. The professor asks for "very simple" (slide 8). Our Won't-have list (W-01 to W-07) stays. | Scope |
| L11 | Google has no keypad and a very different model (typed expression) [V4]. | Our assignment is a button calculator that also accepts keys. We keep this model because it matches "perform basic mathematical operations" without a parser. | D1, D2 |

## 5. Requirement changes derived from the review

Applied in [requirements-specification.md](requirements-specification.md) v0.2.

| Change | Reason |
|---|---|
| FR-13 (keyboard) raised from Should to **Must** | L6, WCAG 2.1.1 (Level A) |
| FR-14 (percent) was defined as ÷ 100, then **removed from scope by the project lead (D10, 2026-10-31)** | Keep the application very simple |
| FR-18 added (Must): `=` with nothing pending, or an operator without a second number, never produces an error or a wrong result | Closes a gap found while designing the state diagram |
| FR-12 counting rule made exact | Needed for a test |
| NFR-03: touch target design value **48 × 48 px**; the old "at least 44 px" cited no source | See the WCAG note below |
| NFR-04 split into numbered WCAG checks | Checks must be testable |
| NFR-05: no horizontal scrolling at 320 px width | WCAG 1.4.10 [V6] |

### WCAG facts used (all read from W3C pages, [V6])

| Criterion | Level | Threshold |
|---|---|---|
| 1.4.3 Contrast (Minimum) | AA | Text contrast at least 4.5:1; large text 3:1 |
| 1.4.11 Non-text Contrast | AA | UI components at least 3:1 against adjacent colours |
| 1.4.10 Reflow | AA | No two-dimensional scrolling at 320 CSS px width |
| 2.1.1 Keyboard | A | All functionality operable through a keyboard interface |
| 4.1.2 Name, Role, Value | A | Name and role programmatically determinable |
| 4.1.3 Status Messages | AA | Status messages programmatically determinable |
| 2.5.5 Target Size (Enhanced) | **AAA** | 44 by 44 CSS pixels |
| 2.5.8 Target Size (Minimum) | AA, **WCAG 2.2** | 24 by 24 CSS pixels (with exceptions) |

**Correction to Phase 1.** Our Phase 1 documents and one tool checklist described a 44 px target as part of "AA". The W3C pages show that 44 px is Level **AAA** (2.5.5) and that the AA rule is 24 px (2.5.8, WCAG 2.2). We still design for 48 px because large keys are good for touch use, but we no longer claim it is an AA requirement.

## 6. Limitations

- Three products is a small sample. One of them (C) is a single example found by search.
- No hands-on use, no user research, no performance tests.
- Google's help page is short; unknown behaviours are not assumed.
- Windows Calculator's resource file is long (about 275,000 characters). It was searched with `grep` for the strings quoted here; other behaviour in the file was not examined.
- Web pages can change. Access date for all URLs: 2026-10-31.

## 7. Proposed next step (not done): hands-on session

Each student spends about 10 minutes on each of the three products, following the same script, and records what happens:

`7 + 8 =`, `0.1 + 0.2 =`, `2 + 3 × 4 =`, `5 ÷ 0 =`, `5 + × 3 =`, press `.` twice, type `1234567890123456`, `999999999999 × 999999999999 =`, use only the keyboard, use Tab to move through the keys.

Results are written in `docs/02-research-requirements/hands-on-notes.md` **only after the session happens**, with names and dates. This is also a small, honest version of user research, but it is *team testing*, not user research.

## 8. References

All accessed on 2026-10-31.

| Ref | Source | URL |
|---|---|---|
| V1 | Microsoft. *Windows Calculator*, README (microsoft/calculator, branch main) | https://github.com/microsoft/calculator/blob/main/README.md |
| V2 | Microsoft. *Windows Calculator*, LICENSE (MIT) | https://raw.githubusercontent.com/microsoft/calculator/main/LICENSE |
| V3 | Microsoft. *Windows Calculator*, English resource strings `Resources.resw` (checked directly on 2026-10-31) | https://raw.githubusercontent.com/microsoft/calculator/main/src/Calculator/Resources/en-US/Resources.resw |
| V4 | Google. *Manage calculator, unit converter & color codes*, Google Search Help | https://support.google.com/websearch/answer/3284611 |
| V5 | Mar-Issah. *JavaScript-Calculator*, repository, `index.html`, `js/app.js`, LICENSE (MIT) | https://github.com/Mar-Issah/JavaScript-Calculator |
| V6 | W3C. *Understanding WCAG 2.1* pages: [1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html), [1.4.10](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html), [1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html), [2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html), [2.5.5](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html), [4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html), [4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html). And *Understanding WCAG 2.2*: [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | (links in the cell) |

*Reference style note:* the report's required citation style is unknown (open question Q1). These entries have author, title, URL and access date, so they can be reformatted later.
