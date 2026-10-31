# PBL Design Notes (material for the final report)

**Last updated:** 2026-10-31
**Status:** Draft v0.1. Written 2026-10-31 as raw material for the final academic report (professor's item 5, "documentation and defence"). Nothing here is final text.
**Rule:** Only things that actually happened are recorded as done. Everything else is labelled *proposed*, *planned* or *open*.

## 1. Project-Based Learning context

- **Driving question:** How can we build a calculator that a first-time user can trust to give correct results, and how can we prove it? (project card)
- **Phase 2 learning goal:** Learn from existing solutions before designing, and make design decisions that we can explain and defend.
- **Public product:** A working calculator, a documentation set, a 10-minute defence with a demo (slide 8, "for example").

## 2. What we did in Phase 2 (facts, 2026-10-31)

| Activity | Evidence |
|---|---|
| Read the primary sources for three calculators: Windows Calculator (README, licence, resource strings), the Google Search help page, and a small open-source JS calculator (HTML and JS) | [calculator-review.md](../02-research-requirements/calculator-review.md) section 8 |
| Read W3C pages for eight WCAG criteria | Same, section 5 |
| Derived 11 design lessons and 7 requirement changes | Review sections 4-5 |
| Designed architecture, data-flow and state diagrams | [architecture.md](architecture.md) |
| Compared four ways to handle floating-point numbers, using small Node scripts | architecture.md section 6 |
| Designed the wireframe, keyboard map and accessibility checks | [ui-design.md](ui-design.md) |
| Built a static visual mock-up and looked at it in Edge; fixed one layout problem | `visual-prototype.html`, `evidence/screenshots/` |

**Who did the work:** The documents were drafted by an AI assistant (Claude Code) on the project lead's instruction. **The team has not yet reviewed them.** Individual student contributions are not recorded here, because none are known yet. The [time log](../00-admin/time-log.md) is empty on purpose. Before the report is written, each student should read the documents, correct them, and record real contributions.

**What we did not do:** user interviews or surveys, hands-on use of the three calculators, screen-reader tests, tests in Firefox or Chrome, consultation with the professor.

## 3. Research and design decisions (summary)

| Decision | Chosen | Main reason | Evidence | Status |
|---|---|---|---|---|
| Evaluation model | Immediate execution | Same as Windows Standard mode and the open-source example; simplest | Review L1 | D1 accepted |
| Architecture | Pure engine and formatter plus UI glue | Testable without a browser; no dependency | architecture 2, 8 | D14 accepted |
| Script loading | Classic scripts | Works from `file://` | D2 | Accepted |
| Number policy | Preserve the raw result; format only the display (D3). The snap-to-zero idea was tested and **rejected by the project lead** | Simplest; never alters a result. Trade-off: `0.1+0.2-0.3` shows `5.55111512313e-17` | architecture 6.3 (scratch results) | **D9 rejected; D3 confirmed** |
| Error handling | Explicit Error state, plain-English message, recovery by digit or Clear | Open-source example has none; Google shows nothing | Review L3 | In requirements (FR-09) |
| Keyboard | Must have | WCAG 2.1.1 (A); example has none | Review L6 | D12 accepted |
| Target size | 48 px design value | 44 px is AAA; 24 px is the AA minimum (WCAG 2.2) | Review section 5 | In requirements (NFR-03) |
| Visual design | Neutral grey, one blue accent, light mode | Contrast checked by script | ui-design 6.1 | Proposed |
| Prototype format | Markdown wireframe + static HTML | Lives in Git; no account | D13 | D13 accepted |

## 4. Mistakes found and corrected (reflection material)

PBL values reflection, and honest reporting of problems is part of that. These really happened in this session:

1. **44 px labelled as WCAG AA.** Phase 1 text and a tool checklist treated a 44 px target as part of AA. Reading the W3C pages showed it is Level AAA (2.5.5), and the AA rule is 24 px in WCAG 2.2 (2.5.8). Corrected in the requirements and the review.
2. **A rounding rule fixed one case and broke another.** Normalising results to 15 digits fixed `0.1+0.2-0.3` but made `(1÷3)×3−1` wrong. We found this by testing before recommending it. A third rule (snap to zero) was tested on nine cases and worked on them, but the project lead decided to keep the raw result (D3) for simplicity and honesty. The trade-off is documented.
3. **Layout shift in the prototype.** The first mock-up moved the keys by about 9 px when the error message appeared. Found by looking at the screenshots, fixed with a fixed-height display.
4. **A suspicious screenshot.** The first 320 px screenshot looked as if the page overflowed. It was a limit of the headless browser window (a minimum window width), not a design problem. A second test used a real 320 px frame.
5. **Tools not loaded.** Superpowers and Context7 showed as enabled but were not available in the session. This is recorded in the [tool log](../00-admin/tool-ai-usage-log.md). Nothing in Phase 2 depended on them.

## 5. Skills and tools used

See [tool and AI usage log](../00-admin/tool-ai-usage-log.md), entries 9-18. In short: skills `engineering:system-design` and `design:accessibility-review` were invoked; `WebSearch` and four `web-fetch` helper agents read the sources; Node.js, Python and Microsoft Edge were used for small checks. Superpowers and Context7 were **not** used.

## 6. Draft text for the report (to be rewritten by students)

> **Review of existing solutions.** We examined three basic calculators: Windows Calculator, the Google Search calculator and a small open-source JavaScript calculator. We compared functionality, input handling, error handling and accessibility, using official documentation and source code. We did not conduct user research. We found that the Standard mode of Windows Calculator evaluates operations immediately as they are entered, which is the model we chose for our simple calculator. The open-source example showed three weaknesses that we set out to avoid: no handling of division by zero, no keyboard input and no accessible names for its buttons.
>
> **Design.** The application is split into a calculation layer, which has no knowledge of the web page, and an interface layer. We described its behaviour with a data-flow diagram and a state diagram before writing code. The calculation layer can be tested from the command line.

## 7. Questions for the report (open)

| # | Question |
|---|---|
| R1 | Required report length, language, citation style (decision log Q1) |
| R2 | Should the report include the contributions of each student? In what form? |
| R3 | Do we describe the AI assistance in the report body or in an appendix? Depends on the professor's AI policy (Q4) |
| R4 | Which of the screenshots and diagrams go into the 10-minute presentation? (Not created in this phase.) |

## 8. Phase 3 reflection material (2026-10-31)

Facts from the build, for the report. Full detail in the [test report](../04-implementation-testing/test-report.md) and [development log](../04-implementation-testing/development-log.md).

- **What worked:** writing tests first made the requirements concrete. Several ambiguities showed up while writing tests (for example a requirement example with 13 digits that the 12-digit limit would not allow).
- **What the tests caught about our documents:** the keypad has 19 keys, not 18 (a counting error in Phase 2 text).
- **What was surprising:** the tests for security (`no innerHTML`) first failed on comments that said "never use innerHTML". A check must look at code, not at explanations of code.
- **Honest limits:** only Edge was tested; no screen reader; no real user. The code and tests were written by an AI assistant, so the team's understanding is the main open risk (RK-10). The [code walkthrough](../04-implementation-testing/code-walkthrough.md) is meant to close that gap, but nobody has used it yet.
- **Learning questions the team can answer in the report:** Why is the engine pure? What does immediate execution mean for the user? Why does `0.1+0.2-0.3` show `5.55111512313e-17`, and was our decision right?

## 9. Phase 4 reflection material (2026-10-31)

- **A bug survived our own tests.** BUG-1 (`-0` shown and then `-07`) passed all 65 Phase 3 tests. It was found by reading the code and trying odd key sequences, then pinned with failing tests, then fixed. Lesson for the report: tests only check what someone thought of; random invariant tests ("every typed entry has a valid shape") find what nobody thought of.
- **Tests can be wrong too.** Several Phase 4 test mistakes are in the [bug log](../04-implementation-testing/bug-log.md): a 400 % zoom check that passed without testing anything (the keys were off-screen), and a model that forgot that a digit recovers from an error. Reading the test output ("what text is on the display?") exposed them.
- **Comparing options with data.** The floating-point question was decided by measuring: the current rule matches the exact answer in 99.96 % of random chains; the alternative is exact for `+ - ×` but is worse for `1 ÷ 3 × 3 - 1`. No option is perfect, so the decision stays with the team.
- **Honest limits:** Firefox, screen reader, phone and users are still untested. See the test report section 6.
- **Questions the team can answer in the report:** Which tests would you add? Which result surprised you? What does "ready for acceptance testing" mean compared with "finished"?

## 10. Phase 4 finalisation reflection material (2026-10-31)

- **A test can fail for a reason that has nothing to do with our code.** The first Firefox run showed nine failures. By trying the same keys on a page with a single plain button, we showed that the automated Firefox window simply has no keyboard focus. We then **skipped** those checks and said so, instead of hiding the failures or claiming they passed. Lesson for the report: "not tested" is a valid, honest result.
- **Different browsers expose different tools.** Edge and Chrome offer an accessibility tree through their protocol; Firefox does not. The test script now says SKIP when a tool is missing, so the same script can run everywhere.
- **Evidence must match the thing it describes.** The screenshots are tied to the current files with a hash, and `docs-check` fails if a file changes without new screenshots. We found that a screenshot can mislead (a Firefox focus picture without a ring), so it is not taken.
- **A possible accessibility problem was investigated, not "fixed" blindly.** An error changes two live regions. Without a screen reader we recorded what we know and what we do not know, and left the code unchanged.
- **Documents also need testing.** The test report mixed Phase 3 and Phase 4 results and was reorganised into "current" and "historical" parts; a script now checks links, IDs, counts and screenshots.
- **Honest limits:** no student has run the tests or done any manual verification. See the [test report](../04-implementation-testing/test-report.md) A5 for who verified what.
