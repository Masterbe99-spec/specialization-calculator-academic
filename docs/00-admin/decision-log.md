# Decision Log

**Last updated:** 2026-10-31 (Phase 2 decisions recorded)

Decisions are recorded in a short Architecture Decision Record style: context, decision, options, consequences. A decision is changed only by adding a new entry that supersedes it.

**Approval note:** Decisions D1-D4 and the confirmations below were given by the project lead (the person running this project session) when reviewing the plan on 2026-10-31. Whether the other four team members have discussed them is **not recorded** and should be confirmed.

## Confirmed facts (2026-10-31)

- We are Team A, with five students.
- The application is a browser calculator in HTML, CSS and vanilla JavaScript. This is the team's choice, not the professor's requirement.
- Deadline: 18 December 2026. Method: Project-Based Learning. Keep the application simple and aligned with the professor's requirements.

---

## D1: Immediate-execution arithmetic

**Status:** Accepted | **Date:** 2026-10-31

**Context.** `2+3×4` can be evaluated with operator precedence (14) or step by step as on a basic pocket calculator (20). The professor asks for a very simple calculator for basic operations.

**Decision.** Use immediate execution. Each operator press evaluates the pending operation.

| Option | Complexity | User expectation | Note |
|---|---|---|---|
| A. Immediate execution (chosen) | Low | Matches basic pocket calculators | Easy to explain and test |
| B. Operator precedence | Medium | Matches maths convention and phone calculators | Needs expression parsing, more edge cases |

**Consequences.** Simpler state machine. Users who expect precedence may be surprised, so the behaviour is stated in the user guide. Test T-FR-05 will check it.

---

## D2: Classic JavaScript scripts for offline use

**Status:** Accepted | **Date:** 2026-10-31

**Context.** Browsers block ES modules loaded from `file://`, so a double-clicked `index.html` could fail during the live demo.

**Decision.** Use classic `<script>` files. The calculation engine also exposes itself so Node tests can load it. No build step, no dependencies.

| Option | Offline from `file://` | Complexity |
|---|---|---|
| A. Classic scripts (chosen) | Works | Low |
| B. ES modules | Needs a local server | Medium |

**Consequences.** Slightly less modern structure. Demo risk is lower. Details are designed in Phase 2.

---

## D3: Controlled display rounding (provisional)

**Status:** Provisionally accepted, **confirmed 2026-10-31** (see Phase 2 decisions) | **Date:** 2026-10-31

**Context.** Binary floating point gives `0.1 + 0.2 = 0.30000000000000004`. Showing that is unhelpful. Hiding it carelessly could silently change results.

**Decision.** Round only the **displayed** text (at most 12 significant digits). Never change the stored value. Use exponential notation for large and small values and report overflow. Include tests for floating-point precision, large values, small values and overflow. Do not silently change mathematical results.

| Option | Dependency | Honest to the maths | Note |
|---|---|---|---|
| A. Display-only rounding (chosen) | None | Yes | A known trade-off exists (see consequences) |
| B. Round the stored value | None | No, errors compound silently | Rejected by the project lead's instruction |
| C. Decimal arithmetic library | Yes | Yes | Extra dependency, conflicts with the minimal-dependency rule |

**Consequences.** `0.1+0.2-0.3` would display about `5.55111512313e-17`. Phase 2 must decide whether this is acceptable, and document it. The decision stays provisional until those tests exist and pass. Rules are in requirements specification section 4.

---

## D4: Data-flow diagram and state diagram, no class diagram

**Status:** Accepted | **Date:** 2026-10-31

**Context.** The professor's list names data-flow diagrams for structured projects and class diagrams for object-oriented ones (slide 32). The calculator is small and the engine is mostly functions and state.

**Decision.** Draw a data-flow diagram and a state diagram in Phase 2. Do not draw a class diagram.

**Consequences.** Fewer diagrams to keep in step with the code. If the professor requires a class diagram, add one with a new entry here.

---

## D5: Markdown as the editable source

**Status:** Accepted | **Date:** 2026-10-31

Planning documents are Markdown in the repository, with Mermaid for diagrams. The final report and slides are produced later from them. This keeps documents versioned and reviewable.

---

## D6: Enable Superpowers and Context7 at local scope

**Status:** Accepted, **enabled in settings, but not loaded in the session checked on 2026-10-31** (see tool log) | **Date:** 2026-10-31

The project lead approved enabling the already-installed plugins. Superpowers v7.0.0 and Context7 v1.0.4 were installed for a different project and disabled. They were enabled with `claude plugin enable <plugin> --scope local`, which writes to `.claude/settings.local.json` here (git-ignored, personal). Plugins load when a session starts, so their skills and tools are **not available until the session is restarted or reloaded**. Nothing unrelated was installed. See the [tool and AI usage log](tool-ai-usage-log.md).

---

## D7: Playwright is planned for a later phase

**Status:** Planned, not installed | **Date:** 2026-10-31

The project lead wants Playwright for automated browser tests later. Adding it needs a development dependency and a browser download, so it will be installed only when that phase starts and will be recorded in the tool log. Until then, unit tests use `node --test` and browser checks are manual.

---

## D8: Git initialised, no commits without approval

**Status:** Accepted | **Date:** 2026-10-31

A Git repository was created (`git init -b main`). No commit is made without the project lead's approval. On 2026-10-31 the project lead approved one commit of the Phase 1 documents (message `docs: initialize specialization calculator project`), local only, **no push**. Phase 2 work is not committed until approved separately.

---

## Phase 2 decisions (approved by the project lead on 2026-10-31)

The project lead reviewed the Phase 2 report and decided as follows. Whether the other four team members have discussed these decisions is still **not recorded** (Q7).

| ID | Decision | Outcome | Notes |
|---|---|---|---|
| D9 | Snap tiny add/subtract results to zero | **Rejected** | The numeric result is preserved internally. Nothing is snapped. D3 stays in force |
| D10 | Percent key | **Removed from scope** (now W-08) | FR-14 is retired. The keypad uses the 19-key layout |
| D11 | Repeat-equals | **Accepted: not supported** | `=` with nothing pending does nothing (FR-18) |
| D12 | Keyboard input is a Must | **Accepted** | Period is the primary decimal separator. Comma is accepted from the keyboard as an alias, only if it can be done safely (implemented in `keymap.js`, tested) |
| D13 | Static HTML prototype instead of Figma | **Accepted** | |
| D14 | Separate engine, number formatting and UI logic | **Accepted** | Phase 3 adds a fourth small file, `keymap.js` (pure, testable), see below |
| D15 | Light-mode grey-and-blue interface | **Accepted** | No dark mode (Q11 resolved) |
| D16 | Sign toggle (`±`) | **Kept, priority raised to Must** (FR-15) | Part of the approved Phase 3 engine list |

### D3 confirmed (replaces the "provisional" status)

**Status:** Accepted (confirmed 2026-10-31) | The engine preserves the numeric result. Only the display is formatted: at most 12 significant digits, trailing zeros removed, exponential notation for very large and very small values, a visible error for division by zero and overflow.

**Consequence the team must understand and explain.** `0.1+0.2-0.3` displays `5.55111512313e-17`, because the stored result of `0.1+0.2` is `0.30000000000000004`. This is documented behaviour, not a bug, and it has its own test (T-FR-10). The alternative rules compared in [architecture.md](../03-design-prototype/architecture.md) section 6 were not adopted. If testing later shows real users are confused, add a new decision that supersedes this one.

Dedicated tests are required (and written in Phase 3) for: `0.1+0.2`, `1/3`, very small numbers, large numbers, overflow, and division by zero.

### Keypad size (Phase 3 correction, 2026-10-31)

The Phase 2 documents said "18 keys". The correct count is **19** (four rows of four, and a bottom row of `0` (double width), `.` and `=`). Documents were corrected.

### D14 addendum (Phase 3, 2026-10-31)

Four source files instead of three: `engine.js` (state and arithmetic), `format.js` (numbers to text), `keymap.js` (keyboard event to key name; pure so that it can be unit-tested) and `app.js` (the only file that touches the page). No file uses `eval` or `Function` (NFR-06, checked by an automated test).

---

## Phase 4 (quality assurance, 2026-10-31)

| ID | Decision or change | Status | Reason |
|---|---|---|---|
| C1 | BUG-1 fix in `engine.js` (no `-0` entry; negate may remove the sign of `-0.`; one helper converts entries to numbers) | **Implemented**, with regression tests. Behaviour change is limited to the display of an entry that used to look wrong | Wrong display `-0` and `-07` |
| C2 | Two identical switch cases merged; `numberFromEntry` helper added | Implemented | Simpler code, same behaviour (all earlier tests unchanged) |
| D17 | Exact decimal arithmetic for `+ - ×` (option E) so that `0.1+0.2-0.3` shows `0` | **Rejected by the project lead on 2026-10-31: keep D3, do not implement D17.** Measured in [architecture.md](../03-design-prototype/architecture.md) section 6.4 for the record | E keeps small values but changes `1 ÷ 3 × 3 - 1` from `0` to `-1e-16` and adds code. D3 stays in force. Reopen only if acceptance testing shows the `0.1+0.2-0.3` display is unacceptable |
| C3 | Browser testing in Chrome 156 (already installed) and in **Firefox 159, installed on 2026-10-31 with the project lead's approval** from Mozilla's official download (signature checked, per-user install, no admin rights) | **Done.** Edge and Chrome 102 of 102; Firefox 88 passed, 0 failed, 11 skipped. Focus-dependent behaviour in Firefox is **not verified** (the automated window has no keyboard focus); a human must test it | Part B of the Phase 4 request. See test report A6 |
| C4 | Playwright still **not** installed. Test infrastructure change: `tests/browser-backends.js` (new) holds the Chromium and Firefox drivers; `tests/browser-check.js` uses it. No dependency added | Unchanged approval status | The two browser protocols are built into the browsers, so no package is needed |
| C5 | The possible duplicate screen-reader announcement of an error was **investigated** (two live regions change: polite `Error`, assertive `Cannot divide by zero`). **No code change** | Recorded; needs a human with a screen reader | Without a real screen-reader test a change could make things worse. Test report A6.3 |
| C6 | The Phase 4 approval of the project lead (2026-10-31): keep D3; approve Firefox installation; approve a local Phase 4 commit; no push; no new features | Followed | |

---

## Open questions (not yet answered)

| # | Question | For | Affects |
|---|---|---|---|
| Q1 | Is there a grading rubric? Required report format, length, language and deadline? Submission by Moodle? | Professor | Documentation, risk RK-03 |
| Q2 | Are the 17 items on slides 32-33 required, or guidance only? | Professor | Scope of documents |
| Q3 | Is the 10-minute presentation limit firm? | Professor | Presentation |
| Q4 | What is the policy on AI-tool assistance? | Professor | Risk RK-10 |
| Q5 | How should the 6 Nov class be used, and are consultation slots available? | Professor | Schedule |
| Q6 | Real names of the five students, and confirmation of roles | Team | All documents |
| Q7 | Do the other four members agree with D1-D8? | Team | Decision log |
| Q8 | Should the working copy move out of OneDrive to protect `.git`? | Project lead | Risk RK-08 |
| Q9 | Is the "security analysis" in slide 5 expected for the calculator, and how deep? | Professor | Test and security note |
| Q10 | ~~Approve D9-D14~~ **Answered 2026-10-31**, see Phase 2 decisions | Project lead | Done |
| Q11 | ~~Comma and dark mode~~ **Answered 2026-10-31**: comma optional alias if safe, no dark mode | Project lead | Done |
| Q12 | A **team member** must still open every URL in the calculator review and confirm the quoted facts. The assistant re-checked all URLs and quotes on 2026-10-31 (all HTTP 200) but a human check is not recorded | Student 2 (provisional) | RK-11 |
| Q13 | Did the professor's course expect a citation style or a specific diagram notation? (architecture O5, review reference note) | Professor | Report |
