# Final Report Outline

**Status:** Outline **approved by the project lead on 2026-10-31**. The draft Word report is generated in the next step. Whatever is generated is a draft: **not signed off, not submission-ready**. The team and the professor have not approved anything.
**Last updated:** 2026-10-31
**Skill used:** `engineering:documentation` (structure: lead with the most useful information, link instead of duplicating). See the [tool log](../00-admin/tool-ai-usage-log.md).

## 0. What the professor's slides say, and what they do not

Source: "2026.10.02 Specialization project" (37 slides). The deck was re-read for this outline.

| Slide | What it says | Used for |
|---|---|---|
| 8 | The final result is "very simple working applications with documentation containing" five elements: (1) project card, (2) literature and assumption review, (3) design and prototyping, (4) implementation and testing, (5) documentation and defense: "report and presentation of the results. Each group has, for example, 10 minutes to present the project and a working demo" | The five main parts of the report and the presentation |
| 32 and 33 | "The draft should include" 17 items (list in section 3) | The checklist of what to cover, in proportion to a very simple application |
| 5 | Learning content: methodology, formal aspects such as the documentation structure, communication rules; work plan and schedule; project work, **security analyses**, implementation planning, documentation; presenting the system and handing over the documentation | Sections on management and security |
| 3 and 4 | Learning outcomes (for example P_U04: prepare and deliver a presentation and lead a discussion; P_U05: formulate a design specification; P_U02: estimate time) | A short "learning outcomes" reflection |
| 9, 10, 11 | Defense on 18 December 2026 in the last class (18:10 to 19:50); Team A builds the calculator; both applications must be "working applications" | Deadline and scope |
| 12 to 28 | Project-Based Learning: open-ended driving question, own solutions, reflection and revision, a final presentation to peers, clear assessment criteria | PBL section and reflection |

**What the deck does not say** (all are open questions, section 4): report format, language, length, citation style, grading rubric, submission method, whether the 17 items are required or guidance, the AI-assistance policy, whether 10 minutes is firm, and how Team A and Team B share the 100-minute class.

## 1. Structure

**The professor's mandatory elements.** Slide 8 says the final result is documentation "containing the following clearly defined and described elements". Elements 1 to 4 are the **four mandatory development sections**; element 5 is the report and presentation themselves. In the table below they are tagged **[Element 1]** to **[Element 4]** and carry the same tag in the Word report headings. Everything else (the 17-item list on slides 32 and 33, the PBL slides) is supplementary project-management material (the slides say "should include" and describe a method).

| Professor's element (slide 8) | Report chapter |
|---|---|
| **[Element 1]** Project card: purpose, scope, technologies and methodologies, schedule | Chapters 3 and 4 |
| **[Element 2]** Literature and assumption review: analysis of existing solutions, collection of requirements | Chapter 5 |
| **[Element 3]** Design and prototyping: architecture, schematics, first versions of code or models | Chapter 6 |
| **[Element 4]** Implementation and testing: the final solution and its verification | Chapters 7 and 8 |
| [Element 5] Documentation and defense: report and presentation (this report; the presentation; the demo) | The whole document, the slides, the demo |

Page counts are deliberately not proposed: the professor has not given a length (open question Q1).

| # | Section | Content | Main source documents (existing) | Evidence | Status |
|---|---|---|---|---|---|
| | **Front matter** | Title page; team names, student numbers and roles (**names not known to the AI**); declaration of how AI assistance was used (section 5); table of contents | [tool and AI usage log](../00-admin/tool-ai-usage-log.md) | | Needs student input |
| 1 | **Introduction and project card** (slide 8, element 1) | Purpose, scope, technologies, methodology (PBL), driving question, schedule summary, resources, effort estimate | [project-card.md](../01-project-card/project-card.md), [wbs.md](../01-project-card/wbs.md), [gantt.md](../01-project-card/gantt.md) | | Drafted by AI; team review pending |
| 2 | **Project management and teamwork** (items 3, 4, 5, 12) | Method and justification, responsibilities, communication rules, meetings, real working time, retrospective | [responsibility-matrix.md](../01-project-card/responsibility-matrix.md), [team-communication-rules.md](../00-admin/team-communication-rules.md), [time-log.md](../00-admin/time-log.md) (**empty**), meeting notes (**none exist**) | | **Largely missing: students must supply** |
| 3 | **Literature and assumption review** (element 2, items 1 and 2) | Three existing calculators, comparison, lessons, assumptions, **what was not researched (no users)** | [calculator-review.md](../02-research-requirements/calculator-review.md) | W3C and vendor pages cited in it | Drafted by AI; references re-checked by the AI; **human check pending** (Q12) |
| 4 | **Requirements specification** (item 1) | Functional and non-functional requirements, MoSCoW, out of scope, traceability to the professor's slides and to tests | [requirements-specification.md](../02-research-requirements/requirements-specification.md), [traceability-matrix.md](../02-research-requirements/traceability-matrix.md) | | Drafted; reviewed by the project lead's decisions only |
| 5 | **Design and prototype** (element 3, items 7 and 14) | Architecture, data-flow diagram, state diagram (a class diagram was not planned, decision D4), number policy, UI design, accessibility, the static prototype | [architecture.md](../03-design-prototype/architecture.md), [ui-design.md](../03-design-prototype/ui-design.md), [visual-prototype.html](../03-design-prototype/visual-prototype.html), [decision log](../00-admin/decision-log.md) | prototype screenshots | Drafted; approved by the project lead |
| 6 | **Implementation** (element 4) | Structure of the code, key design ideas (pure engine, display policy, keyboard map), changes and reasons | `src/`, [development-log.md](../04-implementation-testing/development-log.md), [code-walkthrough.md](../04-implementation-testing/code-walkthrough.md) | application screenshots | Built by the AI assistant; **students must understand and be able to explain it** |
| 7 | **Testing and verification** (element 4, item 15) | Test plan, results in three browsers, bugs found and fixed, limitations; separate automated, AI-reviewed and human-verified | [test-plan.md](../04-implementation-testing/test-plan.md), [test-report.md](../04-implementation-testing/test-report.md), [bug-log.md](../04-implementation-testing/bug-log.md) | `evidence/screenshots/`, command output | Automated parts done; **human verification not done** |
| 8 | **Security analysis** (slide 5) | Threats, controls, CSP review, limits | [security-analysis.md](../04-implementation-testing/security-analysis.md) | tests and browser checks | AI review done; **human review pending** |
| 9 | **Risk assessment** (item 13) | Register of 14 risks, status, what happened | [risk-register.md](../00-admin/risk-register.md) | | Needs the real review history (**no weekly review is recorded**) |
| 10 | **Schedule, resources and budget** (items 9, 10, 11, 12) | Planned vs actual: Gantt, WBS, person-hours, resources | project card, WBS, Gantt, **time log** | | **Actual hours missing** |
| 11 | **Delivery and training** (items 16, 17) | How to run it, a one-page user guide (what `2 + 3 × 4` gives, the keys, the display rules), how the solution is handed over | README ("Running the application"); **a user guide has not been written** | | Partly missing |
| 12 | **PBL reflection** (slides 12 to 28) | The driving question answered with evidence; what each student learned; mistakes and corrections; the retrospective | [pbl-design-notes.md](../03-design-prototype/pbl-design-notes.md) (material), development log section 5 (**empty**) | | **Needs each student's own words** |
| 13 | **Conclusions, limitations, future work** | What works, what is not verified, what was left out on purpose (D3, D17, percent, history) | test report A9, decision log | | Draft possible after human tests |
| 14 | **References** | Only works the team actually read; style per the professor (unknown) | calculator review section 8; obligatory literature on slide 6 **only if read** | | Style unknown |
| A | **Appendices** | Decision log, tool and AI usage log, time log, test report, screenshots, meeting notes, acceptance results | links in this table | | |

## 2. How the report should be built (proposal)

1. The Markdown documents are the editable source (decision D5). The Word report is written **by the students** from them, in their own words, after the human tasks are done. The AI assistant may help with structure and language only if the professor's policy allows it, and every use is logged.
2. Every number in the report comes from the [test report](../04-implementation-testing/test-report.md) Part A or from a real run repeated by a student. Part B of that report is history and is not to be quoted as current.
3. Every statement about people (who did what, how long, who attended) must come from the time log, the meeting notes or the students themselves. **None exists yet.**

## 3. The professor's 17 draft items (slides 32 and 33), mapped

"Treatment" says how we cover each item in proportion to a very simple application. "Missing" is what only people can supply.

| # | Item (slide wording, shortened) | Where it is covered | Missing |
|---|---|---|---|
| 1 | Specification and analysis of user requirements | requirements-specification, calculator-review | Real user input (none collected) |
| 2 | Study of solution possibilities, selection of software technology | calculator-review, architecture 8, decision log D1 to D17 | |
| 3 | Project management method and justification | project card (PBL), communication rules | Team's agreed rules (proposal not yet agreed) |
| 4 | Division of tasks among members | responsibility-matrix (provisional) | Real names; confirmed roles; who actually did what |
| 5 | Records of working time (kept by the project manager) | time-log (empty template) | **All hours** |
| 6 | WBS, project charter, project scope | wbs, project-card | Review by the team |
| 7 | Data-flow diagrams | architecture section 4 | |
| 8 | Class diagrams (object-oriented projects) | **Not planned**; state diagram instead (D4) | Professor's view (Q2) |
| 9 | Project schedule as a Gantt chart | gantt | Actual progress |
| 10 | Estimate of the project budget | person-hours only (project card section 7) | Whether a money estimate is expected; an hourly rate would be an assumption |
| 11 | List of necessary resources | project card section 7 | |
| 12 | Resource utilisation plan | responsibility-matrix, gantt | |
| 13 | Risk specification and assessment | risk-register | Real weekly reviews |
| 14 | Prototype of the solution | visual-prototype.html, ui-design, the working application | |
| 15 | Production-phase management plan and project documentation, including the test plan | test-plan, test-report, development-log | Human test results |
| 16 | Training plan for employees | **A one-page user guide is planned, not written** | Decide scope and write it |
| 17 | Method of delivery of the finished solution | README "Running the application" | Submission method (Q1) |

## 4. Information only the five students (or the professor) can provide

Everything in this list is **unknown to the AI assistant** and must not be invented.

**About the team**
1. Real names and student numbers of all five students; confirmation or change of the provisional roles.
2. Real working hours per student per week ([time log](../00-admin/time-log.md)) and who checked them.
3. Which meetings took place (date, attendees, decisions) and the real communication channel.
4. What each student actually did, in their own words; what each student learned (development log section 5, PBL reflection).
5. The outcome of the midpoint retrospective (planned for 27 November) if it takes place.
6. Whether the other four students agree with decisions D1 to D17 (open question Q7).

**About the course (ask the professor)**
7. Grading rubric, report format, language, length, citation style, submission method and deadline (Q1).
8. Whether the 17 items are required or guidance (Q2); whether 10 minutes is firm (Q3).
9. The policy on AI-tool assistance and how it must be declared (Q4).
10. How the 6 November class and consultations can be used (Q5); whether a security analysis is expected and how deep (Q9).
11. How Team A and Team B share the 18 December class; the exact time slot for Team A.

**About verification (human tasks)**
12. Results of the manual checks in the [test plan](../04-implementation-testing/test-plan.md) section 7 and the [acceptance checklist](acceptance-and-submission-checklist.md): Firefox keyboard focus, screen reader, Lighthouse, real phone, first-time users, independent code review.
13. A student's re-run of the three commands in the test report A11 (result, browser, computer).
14. A human check of every reference URL.
15. Whether to write the one-page user guide, and who.

**About the presentation**
16. Which student presents which part; the computer and projector used on 18 December; whether a recorded backup demo will be made (it does not exist).

## 5. Honest statement about AI assistance (to be adapted after the professor answers)

The documents, code and tests in this repository were produced by an AI assistant (Claude Code) working on the project lead's instructions, and every use is recorded in the [tool and AI usage log](../00-admin/tool-ai-usage-log.md). The students must review, understand and be able to explain all of it. **The report must not describe AI-made work as made independently by the students**, and must not claim any human review, human test, consultation or time that was not recorded. The exact wording of the declaration depends on the professor's policy (Q4).

## 6. Proposed order of work for Phase 5 (after approval)

1. Students complete the human tasks and fill the time log, meeting notes and development-log section 5.
2. Professor's answers (Q1 to Q5, Q9) are recorded in the decision log.
3. Students write their parts of the report; the project lead integrates; Student 1 runs `node tests/docs-check.js --require-tests`.
4. The Word report and the presentation are generated only after the project lead approves this outline.
