# Human Acceptance Testing and Final Submission Checklist

**Status:** **Template. Every result, name and date is blank.** Nothing on this page has been done by a human. The expected results come from the requirements and from the automated tests, which the AI assistant ran; the point of this page is that **people** repeat them on real computers and phones.
**Last updated:** 2026-10-31

Fill a result only after you did the step yourself. Write what you saw, not what you expected. A failed step is a result: write a bug report (template in the [bug log](../04-implementation-testing/bug-log.md)).

## Part 1. Human acceptance tests

Tester, date, browser, computer and screen size go in the header of each run.

| Run | Tester | Date | Browser and version | Computer / phone | Screen size |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

### 1.1 Functional tests

| ID | Steps (press in order) | Expected | Related requirement | Run 1 | Run 2 | Run 3 |
|---|---|---|---|---|---|---|
| AT-01 | Open `src/index.html` by double-click | Calculator appears, display `0`, no error message | FR-01, NFR-07 | | | |
| AT-02 | `7` `+` `8` `=` | `15` | FR-03 | | | |
| AT-03 | `9` `-` `4` `=`; `6` `×` `7` `=`; `8` `÷` `2` `=` | `5`; `42`; `4` | FR-03 | | | |
| AT-04 | `1` `.` `5` `+` `2` `.` `2` `5` `=` | `3.75` | FR-02, FR-03 | | | |
| AT-05 | `2` `-` `5` `=`; then `±` | `-3`; then `3` | FR-03, FR-15 | | | |
| AT-06 | `2` `+` `3` `×` `4` `=` | `20` (step by step, not 14) | FR-05 | | | |
| AT-07 | `5` `+` `×` `3` `=` | `15` (second operator replaces the first) | FR-08 | | | |
| AT-08 | `5` `÷` `0` `=`; then `7`; then `C`, `5` `÷` `0` `=` again; then `C` | `Error` and `Cannot divide by zero`; `7`; the same error again; `0` | FR-09 | | | |
| AT-09 | `1` `2` `3` `⌫`; `5` `⌫` | `12`; `0` | FR-07 | | | |
| AT-10 | Type 13 digits `1234567890123` | `123456789012` (the 13th is ignored) | FR-12 | | | |
| AT-11 | `999999999999` `×` `999999999999` `=` | `9.99999999998e+23` | FR-11 | | | |
| AT-12 | `7` `+` `2` `=` `=` | `9` (no repeat) | FR-18 | | | |
| AT-13 | `0.1` `+` `0.2` `=` | `0.3` | FR-10 | | | |
| AT-14 | `0.1` `+` `0.2` `-` `0.3` `=` | `5.55111512313e-17` (a **documented known limit**, decision D3; write down your opinion) | FR-10 | | | |

### 1.2 Keyboard tests

| ID | Steps | Expected | Run 1 | Run 2 | Run 3 |
|---|---|---|---|---|---|
| AT-15 | Press `Esc`, then type `12+30*2` and `Enter` | `84`; `Esc` clears | | | |
| AT-16 | Type `1,5+1=` (a comma) | `2.5` | | | |
| AT-17 | **Keyboard only, no mouse:** `Tab` to the keys; press `Space` or `Enter` on `7`, `+`, `8`, `=` | `15` | | | |
| AT-18 | Look at the focused key while tabbing | A clear 3 px dark ring is always visible | | | |
| AT-19 | `Ctrl+R` (reload) and `F5` | The browser reloads (the calculator does not block them) | | | |
| AT-20 | Tab to "Keyboard" help, press `Enter` | The help opens and closes (it is not taken as "equals") | | | |

**Firefox:** AT-17, AT-18 and AT-20 are the ones the automated test could not check. Do them in a normal Firefox window.

### 1.3 Layout, zoom and device tests

| ID | Steps | Expected | Run 1 | Run 2 | Run 3 |
|---|---|---|---|---|---|
| AT-21 | Make the window narrow (about 320 px) or use the phone size in the browser tools | No sideways scrolling; all 19 keys visible and easy to hit | | | |
| AT-22 | Browser zoom 200 % and 400 % (browser menu) | Nothing cut off; you may need to scroll down | | | |
| AT-23 | Increase the browser font size (settings) | Still usable | | | |
| AT-24 | On a **real phone**: open the file (or a copy), tap `7` `+` `8` `=`, rotate | `15`; layout adapts; taps hit the right key | | | |

### 1.4 Accessibility and usability tests

| ID | Steps | Expected | Run 1 | Run 2 | Run 3 |
|---|---|---|---|---|---|
| AT-25 | **Screen reader** (NVDA or VoiceOver): `7` `+` `8` `=` | The result `15` is read; keys are named ("Times", "Divided by" ...). Note exactly what is read | | | |
| AT-26 | Screen reader: `5` `÷` `0` `=` | Note whether the error is read once or twice, and in which order (`Error`, `Cannot divide by zero`) | | | |
| AT-27 | Chrome DevTools, Lighthouse, Accessibility | Record the score and every warning | | | |
| AT-28 | **First-time user** (two people outside the team): "calculate 12 + 30 × 2" without help | They get `84` (or `72` if they expect normal maths: write down what they said) | | | |

### 1.5 Offline test

| ID | Steps | Expected | Run 1 |
|---|---|---|---|
| AT-29 | Turn off Wi-Fi or unplug the network, open `src/index.html`, do AT-02 | Works exactly the same | |

## Part 2. Repeat the automated checks (a student, not the AI)

| Command | Expected (what the AI saw on 2026-10-31) | Your result |
|---|---|---|
| `node --test` | 88 passed, 0 failed | |
| `node tests/browser-check.js` | 102 passed (Edge or Chrome) | |
| `node tests/browser-check.js --firefox` | 88 passed, 0 failed, 11 skipped | |
| `node tests/docs-check.js --require-tests` | PASSED, 0 errors | |

If your numbers differ, **do not change this page**: report it as a bug.

## Part 3. Final submission checklist

Items marked **(?)** depend on the professor's answers (open questions Q1 to Q5, Q9).

### 3.1 Documents and evidence

- [ ] The final report is written by the students from the [outline](report-outline.md), in the required format and language **(?)**
- [ ] Every number in the report comes from the [test report](../04-implementation-testing/test-report.md) Part A or from a student's own run
- [ ] The time log is filled with real hours by each student, and the weekly checks are recorded
- [ ] Meeting notes exist for real meetings only
- [ ] Each student's own reflection and contribution statement is written by that student
- [ ] The tool and AI usage log is complete and the AI-use declaration follows the professor's policy **(?)**
- [ ] The decision log records the professor's answers (Q1 to Q5, Q9) and the team's agreement (Q7)
- [ ] Every reference was opened by a student (Q12) and cited in the required style **(?)**
- [ ] All human tests in Part 1 are done, with names and dates, and failures are in the bug log
- [ ] The traceability matrix statuses match reality (no "pass" without a recorded run)
- [ ] The one-page user guide is written (if the team decides to) and tested by someone who did not write it
- [ ] Screenshots are current (`node tests/docs-check.js` passes)

### 3.2 The application and the repository

- [ ] The calculator opens from the delivered files by double-click, offline
- [ ] The tests pass on a student's computer (Part 2)
- [ ] `git status` is clean; no secrets, no `.claude/` folder, no installers, no temporary files are in the repository
- [ ] The project lead decides if and when to create a remote repository and push (nothing has been pushed so far)
- [ ] The delivered package matches the Git commit (note the commit identifier)
- [ ] It is clear to the students that they must be able to explain every file (see the [code walkthrough](../04-implementation-testing/code-walkthrough.md))

### 3.3 Presentation and demo

- [ ] Slides created by the team after the project lead approves the [presentation plan](presentation-plan.md); every slide checked against the evidence
- [ ] Speaker split agreed by all five students; timing rehearsed at least twice on the real computer
- [ ] Demo script rehearsed; backups made (screenshots, a team-made recording if wanted, second laptop, USB)
- [ ] The presentation computer and projector tested; the tested browser is open in advance; Node.js available if `node --test` is shown
- [ ] Questions rehearsed (list in the presentation plan)

### 3.4 Submission

- [ ] Submission method, deadline, file names and format confirmed **(?)**
- [ ] Final files checked for personal data and for anything the team cannot explain
- [ ] Submitted by: ______ on: ______ (to be filled in by the person who submits)

## Part 4. Sign-off (empty)

A student signs only for tasks they really did. One line of result is required.

| Student | Tasks done (IDs) | Date | Result in one line | Name |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

**Decision after acceptance testing (project lead):** ☐ accepted ☐ accepted with listed issues ☐ not accepted. Date and reason: ______
