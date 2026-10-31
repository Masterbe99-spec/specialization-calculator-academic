# Presentation and Live Demo Plan (9-minute plan inside the 10-minute example limit)

**Status:** Structure approved by the project lead on 2026-10-31; **revised to a 9:00 plan on 2026-10-31 after the academic audit (corrections approved by the project lead)**. A draft PowerPoint is generated in the next step; it will not have been rehearsed and will not be final. The speaker split follows the provisional roles of the [responsibility matrix](../01-project-card/responsibility-matrix.md); **no student has agreed to it yet**, and names are not known to the AI.
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

## 3. Structure and speaking time (revised to a 9:00 plan after the academic audit)

The first plan filled the whole 10 minutes. Counting only the words that are really spoken (about 1,200 words at about 130 words per minute) plus the demo actions left no buffer, so the plan was cut to **9:00**: 8:20 of speaking and demo, plus about 40 seconds for 8 slide changes and hand-overs, leaving about 1 minute inside the professor's example limit of 10 minutes. The speaker notes in the PowerPoint were rewritten to fit (estimate: about 7:40 of speaking and demo at 130 words per minute; **not measured, the team must time itself**).

| Speaker (provisional role) | Time | Slides | Content |
|---|---|---|---|
| **Student 1** (project management) | **2:05** | 1, 2 and 9 | Title and own names (0:20); problem, objectives, PBL method, how AI assistance was used (0:45); lessons learned and conclusion, with one sentence from each student (1:00) |
| **Student 2** (research and requirements) | **1:05** | 3 | Three calculators studied (by the AI assistant; say what you checked yourself) and the lessons; requirements; what was **not** researched (no user research) |
| **Student 3** (UI/UX and design) | **1:10** | 4 | Architecture (large diagram), state diagram, interface and accessibility choices |
| **Student 4** (development) | **2:15** | 5 and 6 | Implementation and key design ideas (0:30), then the **live demo** including set-up (1:45) |
| **Student 5** (testing and QA) | **1:45** | 7 and 8 | Test results in three browsers and the negative-zero bug (1:00); security, limitations and improvements (0:45) |

Running order: Student 1 (slides 1 and 2, 1:05), Student 2 (1:05), Student 3 (1:10), Student 4 (2:15), Student 5 (1:45), Student 1 again (slide 9, 1:00). 1:05 + 1:05 + 1:10 + 2:15 + 1:45 + 1:00 = **8:20**, plus about 0:40 for slide changes and hand-overs = **9:00**.

**Questions:** all five students answer, each in their own area (section 6). The time for questions is unknown (Q3); the 9:00 plan leaves about a minute of the example 10 minutes for them. If a student is absent, Student 1 decides the swap in advance (risk RK-05).

**Authorship in the notes.** The notes say what the AI assistant did (code, tests, first drafts, the automated runs, the code review that found the negative-zero bug) and what the team still has to do. Students may use "we" only for things they really did; each note has a bracketed prompt where a student adds their own real contribution.

## 4. Live demo script (1:45 inside Student 4's block, including set-up)

Each step has the expected result. The sequence was run from start to finish in a real browser with the state kept between steps (see [live-demo-script.md](live-demo-script.md)). **A student must still rehearse it on the real computer; none has.**

| Step | Do | Expected | Say |
|---|---|---|---|
| 1 | Open `src/index.html` (already open in a second window; Alt+Tab) | The calculator, display `0` | "No installation, no internet" |
| 2 | Click `7` `+` `8` `=` | `15` | |
| 3 | Click `2` `+` `3` `×` `4` `=` | `20` | "Step by step like a pocket calculator (decision D1)" |
| 4 | Type `0.1` `+` `0.2` `=` | `0.3` | "Decimals are stored approximately; we show 12 digits" |
| 5 | Click `5` `÷` `0` `=`, then `7` | `Error` and `Cannot divide by zero`; then `7` | "A clear error, and it recovers" |
| 6 | `Esc`, type `12+30*2`, `Enter` | `84` | "The keyboard works too" |
| 7 | `C`, then click `1` `2`, the sign key, the delete key | `0`, `12`, `-12`, `-1` | "Sign and delete, on a fresh number" |
| 8 | Make the window narrow | All 19 keys visible down to 320 px | |
| Optional | `0.1` `+` `0.2` `-` `0.3` `=` | `5.55111512313e-17` | "A known limit we documented (D3)" |

Step 7 starts with `C` because after a result the sign key changes the result and the delete key does nothing. Running `node --test` live was dropped from the demo to save time; the results are on slide 7.

**Backups (none exist yet; the team must make them):** (a) screenshots from `evidence/screenshots/` and the three screenshots on slide 5; (b) a real recording of the demo made by the team, if the team decides to; (c) the project on a second laptop and on a USB stick; (d) the browser that was tested.

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
