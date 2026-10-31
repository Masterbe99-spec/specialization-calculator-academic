# Team Communication and Meeting Rules

**Status:** Proposal v0.1. **Not yet agreed by the team.** The project lead should confirm each rule with all five members, then change the status to "Agreed" with the real date.
**Last updated:** 2026-10-31
**Source:** Slide 5 of the professor's presentation lists "communication rules" as part of the work plan (traceability item P-13). The deck gives no specific rules, so everything below is the team's own proposal.

## 1. Facts we do not know yet (do not assume)

| # | Unknown | Who decides |
|---|---|---|
| C1 | Which chat tool the team uses (name and group) | Team |
| C2 | Weekly meeting day and time that suits all five | Team |
| C3 | Whether meetings are in person, online, or both | Team |
| C4 | Real names and contact routes of the five students | Team (Q6) |
| C5 | Where the shared remote repository will live | Project lead (no remote exists yet) |

## 2. Channels (proposal)

| Purpose | Channel | Rule |
|---|---|---|
| Quick questions and reminders | Team chat (tool to be chosen, C1) | Answer within 24 hours on weekdays, even if only "seen, will answer on <day>" |
| Decisions | [Decision log](decision-log.md) | A decision counts only when it is written there. A chat message alone is not a decision |
| Tasks and status | [WBS](../01-project-card/wbs.md) and the weekly meeting | Each task has one named owner |
| Work and review | Git repository (commits and, later, pull requests) | Each change is reviewed by another member |
| Contact with the professor | Class on 6 Nov, consultations (face to face or WEBEX, slide 9) | Questions are collected first (open questions Q1-Q5, Q9) and asked together |
| Files | Git repository only | No final documents sent as chat attachments |

## 3. Meetings (proposal)

| Meeting | Frequency | Length | Purpose |
|---|---|---|---|
| Weekly check-in | Once a week, day and time to be agreed (C2) | 30-45 min | Progress against the [Gantt chart](../01-project-card/gantt.md), blockers, task assignment, risk review |
| Milestone review | At each milestone in the Gantt chart | 45-60 min | Review documents together, confirm decisions |
| Midpoint retrospective | Planned for 27 Nov | 45 min | What works, what to change (PBL, slides 12-28) |
| Ad-hoc | When a blocker needs several people | As short as possible | One topic only |

**Roles per meeting (rotating):** a chair (keeps time and agenda) and a note-taker. Rotation order is agreed by the team.

**Attendance:** If you cannot attend, tell the team in chat before the meeting and read the notes afterwards. Missing two check-ins in a row is an early-warning sign for risk RK-09 and triggers a private conversation with the project manager.

## 4. Agenda and minutes

Meeting notes are saved in `docs/00-admin/meeting-notes/` as `YYYY-MM-DD-topic.md`. **Only real meetings are recorded**, with the real attendees.

Template:

```markdown
# Meeting: <topic>
Date: YYYY-MM-DD | Chair: <name> | Note-taker: <name>
Present: <names> | Absent: <names>

## Agenda
1.
2.

## Decisions (also copy to the decision log)
-

## Actions
| Action | Owner | Due |
|---|---|---|

## Open questions
-
```

## 5. Working agreements (proposal)

1. **Respect and openness.** Disagree with ideas, not people. Say early when you are stuck.
2. **Equal share.** Every member writes code or tests, reviews someone else's work, writes part of the report and speaks in the defence (risk RK-02).
3. **Honest records.** Never record work, hours, tests or consultations that did not happen (README working rules).
4. **Small, frequent changes.** Commit small. Pull before you start. Do not edit the same file as someone else at the same time (risk RK-08).
5. **Review before merge.** No document or code is final until a second member has read it.
6. **AI assistance.** Every use is logged in the [tool and AI usage log](tool-ai-usage-log.md). You must understand and be able to explain anything you submit.
7. **No secrets in the repository.** Passwords, tokens and personal data are never committed.
8. **Deadlines.** If you will miss a deadline, say so at least one day before it, so the team can re-plan.

## 6. Decisions and conflicts

1. Try to decide by agreement at the meeting.
2. If there is no agreement, vote. Each member has one vote. A tie is decided by the project manager.
3. If a conflict affects the work and the team cannot solve it, the project manager raises it with the professor (consultation).
4. All decisions go into the decision log with date and reason.

## 7. Escalation of risks

Any member can add a risk to the [risk register](risk-register.md). The register is reviewed at the weekly check-in.

## 8. Review of these rules

These rules are reviewed at the midpoint retrospective. Changes are listed here with the date.

| Date | Change | Agreed by |
|---|---|---|
| | | |
