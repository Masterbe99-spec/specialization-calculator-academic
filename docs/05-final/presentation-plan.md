# Proposed 10-Minute Presentation and Live Demo

**Status:** Structure and speaking allocation **approved by the project lead on 2026-10-31**. A draft PowerPoint is generated in the next step; it will not have been rehearsed and will not be final. The speaker split follows the provisional roles of the [responsibility matrix](../01-project-card/responsibility-matrix.md); **no student has agreed to it yet**, and names are not known to the AI.
**Last updated:** 2026-10-31
**Skill used:** `engineering:documentation` (see the [tool log](../00-admin/tool-ai-usage-log.md)).

## 1. Facts and unknowns

| | |
|---|---|
| Slot | 18 December 2026, last class, 18:10 to 19:50 (slide 11). Both Team A and Team B "defend" in this class (slide 9) |
| Length | "for example, 10 minutes to present the project and a working demo" (slide 8). **Whether 10 minutes is firm, and how much time is for questions, is unknown (Q3)** |
| Learning outcome | P_U04: prepare and deliver a presentation and lead a discussion (slide 3), so every student should speak |
| Unknown | The projector and computer; whether Node.js is installed there; the order of Team A and Team B; the assessment criteria |

## 2. Message in one sentence

"We built a very simple calculator that a first-time user can trust, and we can show how we checked it, what we did not check, and what we learned."

This answers the PBL driving question: *How can we build a calculator that a first-time user can trust to give correct results, and how can we prove it?*

## 3. Structure and speaking time (approved by the project lead: 10:00 in total)

| Speaker (provisional role) | Time | Slides | Content |
|---|---|---|---|
| **Student 1** (project management) | **2:00** | 1, 2 and 9 | Title and team (0:20); problem, objectives, PBL method, how AI assistance was used (0:55); lessons learned and conclusion (0:45) |
| **Student 2** (research and requirements) | **1:30** | 3 | Three calculators studied and the lessons; main requirements; what was **not** researched (no user research) |
| **Student 3** (UI/UX and design) | **1:45** | 4 | Architecture, data-flow and state diagrams; interface and accessibility choices |
| **Student 4** (development) | **2:30** | 5 and 6 | Implementation and key design ideas (0:45), then the **live demo** (1:45) |
| **Student 5** (testing and QA) | **2:15** | 7 and 8 | Test results in three browsers and the negative-zero bug (1:20); security, limitations and improvements (0:55) |

Running order: Student 1 (slides 1 and 2, 1:15) then Student 2 (1:30), Student 3 (1:45), Student 4 (2:30), Student 5 (2:15), and Student 1 again for the conclusion (0:45). 1:15 + 1:30 + 1:45 + 2:30 + 2:15 + 0:45 = **10:00**.

**Questions:** all five students answer, each in their own area (section 6). The time for questions is unknown. If the professor asks for a different length, scale each block in proportion. If a student is absent, Student 1 decides the swap in advance (risk RK-09).

## 4. Live demo script (about 2 minutes inside Student 4's block)

Each step has the expected result, taken from the tests. **A student must rehearse these on the real computer; none has been rehearsed.**

| Step | Do | Expected | Say |
|---|---|---|---|
| 1 | Double-click `src/index.html` | The calculator opens, display `0` | "No installation, no internet: it is a local file" |
| 2 | Click `7` `+` `8` `=` | `15` | |
| 3 | Click `2` `+` `3` `×` `4` `=` | `20` | "It works step by step like a pocket calculator (decision D1)" |
| 4 | Type `0.1` `+` `0.2` `=` | `0.3` | "Computers store decimals approximately; we show 12 digits" |
| 5 | Click `5` `÷` `0` `=` | `Error`, `Cannot divide by zero` | "Not Infinity or NaN" |
| 6 | Press `7` | `7` | "A digit recovers" |
| 7 | Keyboard: `Esc`, type `12+30*2` then `Enter` | `84` | "Keyboard works too; Esc clears" |
| 8 | Click `±` then `⌫` | sign toggles; last digit deleted | |
| 9 | Narrow the window or press F12 and choose a phone size | Layout stays usable at 320 px | "Responsive, keys at least 48 px" |
| 10 | (If Node.js is available) in a terminal: `node --test` | `88 passed, 0 failed` in about a second | "Our tests run in a second" |
| 11 | (Optional, honest) `0.1` `+` `0.2` `-` `0.3` `=` | `5.55111512313e-17` | "A known limit we chose to keep and document (D3)" |

**Backups (none exist yet; the team must make them):** (a) screenshots from `evidence/screenshots/`; (b) a real recording of the demo made by the team, if the team decides to; (c) the project on a second laptop and on a USB stick; (d) the browser that was tested (Edge, Chrome or Firefox) open in advance. Risk RK-07 (live demo fails) is why this is planned.

## 5. Slide list (approved structure, 9 slides)

1. Project title and team (student names are placeholders in the draft).
2. Problem, objectives and the PBL methodology.
3. Requirements and research.
4. Architecture and design.
5. Calculator interface and implementation.
6. Live demo instructions.
7. Testing results and the negative-zero bug.
8. Security, limitations and improvements.
9. Lessons learned and conclusion.

Design rules: one idea per slide, large text, our own diagrams and real screenshots from `evidence/`, no number that is not in the [test report](../04-implementation-testing/test-report.md) Part A. Speaker notes will be in the PowerPoint file and in a separate speaker-notes and demo-script document.

## 6. Likely questions and where the answer is

| Question | Where | Who (proposed) |
|---|---|---|
| Why immediate execution and not operator precedence? | decision D1, architecture 8 | Student 4 |
| Why `0.1+0.2` gives `0.3` but `0.1+0.2-0.3` does not give `0`? | architecture 6, decision D3 and D17 | Student 4 |
| Why no framework? | architecture 8 | Student 3 or 4 |
| Why a state machine? | architecture 5 | Student 3 |
| How do you know it is correct? | test report A2 to A4 | Student 5 |
| What did you not test? | test report A5, A9 | Student 5 |
| Did you do user research? | calculator review section 0: **no** | Student 2 |
| What would you do with more time? | report outline section 1, row 13 | any |
| How did you use AI? Who wrote the code? | tool log, report outline section 5 | Student 1, then everyone must be able to explain their part |
| What did each of you do? | time log and development log (**currently empty**) | each student |
| Is it secure? | security analysis | Student 5 |
| Is it accessible? | UI design 6, test report A3 and A6 | Student 3 |

## 7. Rehearsal plan (proposal; nothing done yet)

| Rehearsal | Goal | Date | Timed result | Problems found |
|---|---|---|---|---|
| 1 | Walk through, check timing per speaker | | | |
| 2 | Full run with the live demo on the presentation computer | | | |
| 3 | Run with questions; swap one speaker to test the plan for absence | | | |

Rules: stay within the time of your block; do not read the slide; do not present anything you cannot explain; if the demo fails, switch to the screenshots without comment and continue.
