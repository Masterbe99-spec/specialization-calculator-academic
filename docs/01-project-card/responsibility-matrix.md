# Responsibility Matrix (provisional)

**Status:** Draft v0.1 (Phase 1 plan, with a reality note added on 2026-10-31). These are **proposed** responsibilities. They are not evidence that any work has been done. Names are placeholders (Student 1-5) until the team supplies them.

> **Reality note.** The "Code contribution" column below is the **Phase 1 plan**. In fact the code, tests and documents were written by the AI assistant (Claude Code) on the project lead's instructions (see the [tool and AI usage log](../00-admin/tool-ai-usage-log.md)). The students' role has become: review, understand, verify and explain. What each student really did must be recorded by the students in the [time log](../00-admin/time-log.md) and the [development log](../04-implementation-testing/development-log.md).
**Last updated:** 2026-10-31

## Principles

- Each student **leads** one area and **supports** another, so nothing depends on a single person.
- Every student writes and reviews some code, writes a report chapter, and presents a segment, so each can explain the whole project at the defence.
- Roles can change by a recorded decision (see [decision log](../00-admin/decision-log.md)). Real contribution is shown by the time log and repository history, not by this table.
- Planned effort per student is about 40 hours (198 hours in the [WBS](wbs.md) divided by five, rounded). It is an estimate.

## Roles

| Student | Lead area | Supports | Report chapter | Code contribution | Presentation segment |
|---|---|---|---|---|---|
| Student 1 | Project management, project card, schedule | Documentation | Project card and plan | Repository set-up, README, keyboard map | Introduction and plan |
| Student 2 | Research, requirements, review | Testing | Literature review and requirements | Edge-case catalogue, display-formatting helper | Existing solutions and requirements |
| Student 3 | UI/UX, architecture, diagrams, prototype | Development | Design | HTML and CSS from their own prototype | Design |
| Student 4 | Engine, implementation, code quality | Design (reviewer) | Implementation | Calculation engine, wiring | Live demo |
| Student 5 | Testing, QA, documentation integration | Project management | Testing and results | Unit tests, test automation, bug triage | Results and verification |

The segment split is a proposal. The project lead approved this speaking allocation for the 10-minute presentation on 2026-10-31: Student 1 2:00, Student 2 1:30, Student 3 1:45, Student 4 2:30 (including the live demo), Student 5 2:15. See the [presentation plan](../05-final/presentation-plan.md). The draft slides exist; they have not been rehearsed.

## Responsibility by work package

L = lead, S = support, R = reviewer (checks the result before it is accepted), blank = no planned role beyond reading and feedback.

| WBS | Work package | S1 | S2 | S3 | S4 | S5 |
|---|---|---|---|---|---|---|
| 1 | Project management | L | R | | | S |
| 2 | Research and requirements | S | L | R | | |
| 3 | Design and prototype | | S | L | R | |
| 4 | Implementation | | | S | L | R |
| 5 | Testing and QA | | S | | R | L |
| 6 | Documentation | S | S | S | S | L |
| 7 | Presentation and defence | L | S | S | S | S |

Each row has exactly one lead and at most one reviewer.

## Team-wide duties

| Duty | Who | Frequency |
|---|---|---|
| Record weekly time spent | Each student records their own, Student 1 collects | Weekly |
| Meeting notes | Rotating: S1, S2, S3, S4, S5 in turn | Each meeting |
| Review another member's work | Reviewer in the table above | Each milestone |
| Retrospective contribution | All five | 27 Nov (planned) |
| Rehearsal participation | All five | 14-17 Dec (planned) |

## Open points

- Confirm the roles and effort with the real team.
- Confirm how the professor wants individual contribution shown, if at all.
