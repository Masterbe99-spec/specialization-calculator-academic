# Project Card: Basic Calculator Application

**Status:** Draft v0.1, awaiting team review
**Last updated:** 2026-10-31
**Source of requirements:** Professor's presentation "Specialization project", 2 October 2026 (slides 8 and 10)

## 1. Overview

| Field | Content |
|---|---|
| Project title | Basic Calculator Application |
| Course | Specialization Project (IN.MSA.CBS.006) |
| Team | Team A: Student 1, Student 2, Student 3, Student 4, Student 5 (placeholders) |
| Assignment | "Calculator that allows the user to perform basic mathematical operations" (slide 10) |
| Methodology | Project-Based Learning (PBL) |
| Start of planned work | 31 October 2026 |
| Final defence | 18 December 2026, last class (18:10-19:50, slide 11) |

## 2. Purpose

Deliver a simple, reliable and accessible browser calculator, and document honestly how it was researched, designed, built and verified.

**Driving question (PBL):** How can we build a calculator that a first-time user can trust to give correct results, and how can we prove it?

The project also serves the course learning outcomes: working in a team, estimating time, leading a small team, and preparing and presenting a project (slide 4 and slide 3 outcomes).

## 3. Scope

**In scope**

- Four operations: addition, subtraction, multiplication, division.
- Decimal numbers, clear, backspace.
- Immediate-execution arithmetic as on a basic pocket calculator (decision D1).
- Clear handling of division by zero and of very large or very small results.
- Controlled display rounding with automated tests (decision D3).
- Keyboard input, responsive layout, accessibility basics.
- Planning, research, design, test and security documentation proportionate to a small project.

**Out of scope** (see [requirements specification](../02-research-requirements/requirements-specification.md) section 5)

- Scientific functions, parentheses, expression parsing.
- Memory keys, persistent history, themes and settings.
- Backend, accounts, databases, installable app.
- Currency or unit conversion, languages other than English.

Full requirements: [requirements-specification.md](../02-research-requirements/requirements-specification.md).

## 4. Technologies and methodologies

| Area | Choice | Note |
|---|---|---|
| Application | HTML, CSS, vanilla JavaScript | Team choice, not imposed by the professor. Classic scripts, no ES modules, so it works offline from `file://` (D2) |
| Unit testing | Node.js built-in test runner (`node --test`) | No dependency to install |
| Browser testing | A Node script (`tests/browser-check.js`) that drives Edge, Chrome and Firefox through their built-in protocols | As built in Phases 3 and 4. **Playwright was not installed** (it would need a dependency and a browser download; not approved) |
| Version control | Git | Repository initialised; commits only with project lead approval |
| Diagrams | Mermaid in Markdown: data-flow diagram, state diagram | A class diagram is not planned (D4) |
| Planning documents | Markdown | Editable source (D5) |
| Methodology | Project-Based Learning with weekly checkpoints and retrospectives | Slides 12-28 |

## 5. Schedule summary

31 October to 18 December 2026, seven weeks. Details in [gantt.md](gantt.md).

| Week | Dates | Main focus |
|---|---|---|
| W1 | 31 Oct - 6 Nov | Project card, plan, risks. Class on 6 Nov |
| W2 | 7 - 13 Nov | Research, requirements baseline |
| W3 | 14 - 20 Nov | Design, diagrams, prototype |
| W4 | 21 - 27 Nov | Engine (test-first), first UI, team retrospective |
| W5 | 28 Nov - 4 Dec | Feature complete, test execution |
| W6 | 5 - 11 Dec | Bug fixing, code freeze on 9 Dec, report finished |
| W7 | 12 - 18 Dec | Buffer, rehearsals, defence on 18 Dec |

Only one project class falls between now and the defence (6 November, slide 11). Other contact is by consultation, face to face or on WEBEX (slide 9). The class on 6 November and any consultations are **planned opportunities**; none has taken place yet.

## 6. Deliverables

| # | Deliverable (slide 8) | Where it will live | Phase |
|---|---|---|---|
| 1 | Project card (this document, WBS, Gantt) | `docs/01-project-card/` | 1 |
| 2 | Literature and assumption review, requirements | `docs/02-research-requirements/` | 1-2 |
| 3 | Design and prototype | `docs/03-design-prototype/` | 2 |
| 4 | Working application and its verification | `src/`, `tests/`, `docs/04-implementation-testing/` | 3 |
| 5 | Final report, presentation, live demo | `docs/05-final/` | 4 |

## 7. Resources and effort

- **People:** five students.
- **Equipment:** team members' own laptops and a current browser. No purchases are planned.
- **Cost:** no monetary budget. Effort is estimated in person-hours only.
- **Effort estimate (planning assumption, to be confirmed by the team):** about 5-6 hours per student per week over seven weeks, which is roughly 175-210 person-hours in total. The WBS plans 198 hours. Actual hours will be recorded only from real time logs.

## 8. Success criteria

1. Every **Must** requirement is implemented.
2. Every planned test has been run, with real results recorded.
3. The live demo runs without errors on the defence day.
4. Each team member can explain the code and documents they contributed to.
5. Documentation reflects what was actually done, including problems and changes.

## 9. Assumptions, constraints and open questions

**Assumptions:** the team can meet weekly; the professor's rubric, once provided, will not remove any planned deliverable.

**Constraints:** fixed defence date; one project class in the period; the calculator must stay simple (slide 8: "very simple working applications").

**Open questions for the professor** (not yet asked): grading rubric, required report format, length and language, submission deadline and place (Moodle?), whether the 17-item list on slides 32-33 is required, whether 10 minutes is firm, AI-tool policy. See [decision log](../00-admin/decision-log.md), section Open questions.

## 10. Related documents

[WBS](wbs.md) · [Gantt](gantt.md) · [Responsibility matrix](responsibility-matrix.md) · [Requirements](../02-research-requirements/requirements-specification.md) · [Traceability](../02-research-requirements/traceability-matrix.md) · [Risks](../00-admin/risk-register.md) · [Decisions](../00-admin/decision-log.md) · [Tool and AI log](../00-admin/tool-ai-usage-log.md)
