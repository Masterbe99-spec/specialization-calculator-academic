# Team Handover Guide

**Last updated:** 2026-11-01
**Status:** DRAFT 0.2. The report and the slides are **drafts**, not final and not ready for submission. They were prepared by an AI assistant (Claude Code); **no student contribution, working hour, meeting, reflection or human test is recorded yet**. Everything of that kind is a placeholder or marked PENDING until a person fills it in with real facts.

Project folder: the one that contains `src/`, `tests/` and `docs/`. All commands below are run from there.

## 1. What is in the package

| File | What it is |
|---|---|
| `docs/05-final/Team-A-Calculator-Report-DRAFT.docx` | The report (Word). Edit it directly in Word. |
| `docs/05-final/Team-A-Calculator-Presentation-DRAFT.pptx` | The 9 slides, with speaker notes for all five students |
| `docs/05-final/live-demo-script.md` | The live demo, step by step, with backups |
| `docs/05-final/acceptance-and-submission-checklist.md` | The 29 human acceptance tests and the final checklist |
| `docs/05-final/phase5-missing-info-and-verification.md` | Placeholders by class, requirement check, verification results |
| `docs/05-final/presentation-plan.md` | The 9-minute speaking plan and likely questions |
| `src/index.html` | The calculator |

## 2. Open and demonstrate the calculator

1. Double-click `src/index.html`. It opens in your browser; no installation, no internet, no server.
2. Follow [live-demo-script.md](live-demo-script.md). The eight steps give: `7+8=` 15; `2+3×4=` 20; `0.1+0.2=` 0.3; `5÷0=` Error and "Cannot divide by zero", then `7` recovers; `Esc`, `12+30*2` `Enter` 84; `C`, `1` `2`, sign key -12, delete key -1; a narrow window with all 19 keys visible.
3. Always start the sign and delete demo with `C` and a fresh number. After a result the sign key changes the result and the delete key does nothing.

## 3. Run the tests

Needs Node.js 22 or newer. From the project folder:

| Command | What it checks | Expected (the AI's run, 31 October 2026) |
|---|---|---|
| `node --test` | Unit and static tests | 88 passed, 0 failed |
| `node tests/browser-check.js` | Real browser (Edge or Chrome) | 102 passed, 0 failed |
| `node tests/browser-check.js --firefox` | Firefox | 88 passed, 0 failed, 11 skipped |
| `node tests/docs-check.js --require-tests` | Documents agree with each other | PASSED, 0 errors |

If your result differs, do not change the numbers in the documents: write a bug report (template in [bug-log](../04-implementation-testing/bug-log.md)). Record your own run in the report, Appendix D (placeholder "Date, student, commands, browser and computer, result").

## 4. Who reviews what (provisional roles; the team decides, question Q6)

Everyone reads the whole report once and fixes mistakes. Then, as a minimum:

| Student | Report | Slides | Also verify for real |
|---|---|---|---|
| 1 (project management) | Chapters 1, 2, 3, 11; Sections 9.1 to 9.5 and 9.8; Appendix I | 1, 2, 9 | The roles table (3.2), the plan against reality (2.5), the AI wording with the team |
| 2 (research) | Chapters 4 and 12; Appendices A and B | 3 | Open every reference link and confirm the facts (open question Q12); use the three calculators hands-on |
| 3 (design) | Chapter 5; Appendix E | 4 | Check the diagrams against the code; layout and zoom tests (AT-21 to AT-23) |
| 4 (development) | Chapters 6 and 10; Appendix K | 5, 6 | Read `src/js/app.js` and `src/index.html`; tests AT-01 to AT-14; rehearse the demo |
| 5 (testing) | Chapters 7 and 8; Appendices D, F, G, J, L | 7, 8 | Re-run the tests; screen reader and Firefox keyboard tests; repeat the security review (7.9) |

## 5. Where to record real work

| What | Where |
|---|---|
| Working hours (only your own real time, rounded to 15 minutes) | [docs/00-admin/time-log.md](../00-admin/time-log.md); the project manager copies the weekly totals into report Appendix I and Section 3.4 |
| Real meetings (date, attendees, decisions) | `docs/00-admin/meeting-notes/` (one file per real meeting); list them in report Section 3.3 |
| Who did what, in your own words | Report Sections 3.2 and 6.6. **Do not claim code you did not write**: the code was written by the AI assistant |
| Which code you read and can explain | [code-walkthrough](../04-implementation-testing/code-walkthrough.md) and [team-review-checklist](../04-implementation-testing/team-review-checklist.md) |
| Your reflection | Report Section 9.6 (your row of the table). Write what you did, learned, found difficult, and can explain without help |
| Which course objectives you can show | Report Section 9.7 (placeholder below the objectives table) |
| Real expenses | Report Section 3.4, "Actual expenses" (confirm none, or list them) |

## 6. Complete the 29 human acceptance tests

File: [acceptance-and-submission-checklist.md](acceptance-and-submission-checklist.md), Part 1.

1. Fill the header of a run: tester, date, browser and version, computer, screen size.
2. Do each step yourself, in order. Write **what you saw**, not what you expected. A failed step is a result: write a bug report.
3. Do the ones that need a person: AT-17, AT-18, AT-20 (Firefox keyboard, in a normal window), AT-24 (a real phone), AT-25 and AT-26 (a screen reader), AT-27 (Lighthouse), AT-28 (two first-time users outside the team).
4. Do Part 2 (repeat the automated commands) and Part 3 (final checklist).
5. Only then change "PENDING" to a real result in report Appendix G. Never mark a test done on someone else's behalf.

## 7. Fill the outstanding placeholders

* In the Word report every placeholder is yellow text in square brackets. The full list, with a class for each, is **Appendix H** (58 rows). Classes: **A** essential before submission (27); **B** needed from individual students (22); **C** needed from the professor (6); **D** optional or removable (3).
* Replace the bracketed text with your real information and remove the yellow highlight. Leave the placeholder if you do not have the information yet.
* After editing: press Ctrl+A then F9 to update the table of contents and page numbers.
* Slides: replace the 10 yellow boxes (five names on slide 1, five lessons on slide 9). Edit the speaker notes into your own words and delete the bracketed prompts.
* `live-demo-script.md`: fill the preparation table (who did it, when).
* Keep the AI-assistance disclosure (cover note, Sections 1.6 and 6.6, Appendix C, slide 2). Change it only if the professor's policy (Q4) requires different wording, and agree the new wording as a team.
* Do not rename the files or remove "DRAFT" until the project lead approves the final version.

## 8. Questions still open for the professor

| No. | Question |
|---|---|
| Q1 | Grading rubric; required report format, length, language, citation style, submission method and deadline |
| Q2 | Are the 17 items on slides 32 and 33 required, or guidance only? |
| Q3 | Is the 10-minute presentation limit firm, and how much time is for questions? |
| Q4 | What is the policy on AI-tool assistance? |
| Q5 | How should the 6 November class and consultations be used? |
| Q9 | Is a security analysis expected for the calculator, and how deep? |
| Q13 | Is a specific citation style or diagram notation expected? |
| Also | Is a financial cost estimate (hours times an hourly rate) expected? What was the earlier Team Project, and how should this project link to it (slide 7)? |

Team questions: Q6 (real names and roles), Q7 (do all five agree with decisions D1 to D17), Q8 (move the working copy out of OneDrive), Q12 (Student 2 confirms the references).

## 9. Rehearse and prepare the backup demo

**Speaking plan, 9:00 in total** (8:20 speaking and demo, about 40 seconds for slide changes and hand-overs): Student 1 slides 1, 2, 9 (2:05); Student 2 slide 3 (1:05); Student 3 slide 4 (1:10); Student 4 slides 5 and 6 (2:15, the demo is 1:45); Student 5 slides 7 and 8 (1:45). The professor's example limit is 10 minutes. The times are estimates from word counts, not measurements.

1. **Rehearsal 1:** read your notes aloud with a stopwatch; cut words until you are inside your time. Put the notes into your own words.
2. **Rehearsal 2:** all five, full run, with the live demo on the presentation computer and the projector.
3. **Rehearsal 3:** run with questions (the list is in [presentation-plan.md](presentation-plan.md), section 6); each student answers in their own area; test what happens if one speaker is absent.
4. **Backups, made before the day:** (a) a second laptop with the project folder; (b) a USB stick with the project folder; (c) a short screen recording of the whole demo (does not exist yet); (d) the three screenshots on slide 5. If the demo fails, say "We will show it from our screenshots", go to slide 5 and continue. Do not debug in front of the audience.
5. **On the day:** open the calculator in a second window before you start (display `0`, zoom 100 %), switch with Alt+Tab, close other programs, turn off notifications.

## 10. Before anything is called final

- [ ] Every class A and B placeholder is filled with real information, or the item is deliberately removed with the project lead's approval
- [ ] The professor's answers (class C) are in, or the report says they are still open
- [ ] The 29 acceptance tests have real results
- [ ] Each student has read the whole report and can explain their part
- [ ] The presentation has been rehearsed and timed with all five speakers
- [ ] The project lead approves, and only then are the files renamed and submitted
