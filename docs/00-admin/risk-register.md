# Risk Register

**Status:** Draft v0.1. All ratings are the author's initial judgement and need team review. Reviewed weekly (planned).
**Last updated:** 2026-10-31

Scoring: Likelihood (L) and Impact (I) each 1 (low), 2 (medium), 3 (high). Score = L × I. Scores of 6-9 are **high** and are watched every week.

| ID | Risk | Category | L | I | Score | Mitigation | Early warning sign | Owner (prov.) | Status |
|---|---|---|---|---|---|---|---|---|---|
| RK-01 | Not enough time: seven weeks and only one project class before the defence | Schedule | 3 | 3 | 9 | Small scope (MoSCoW), weekly milestones, buffer 10-13 Dec, code freeze 9 Dec | A milestone missed by more than 2 days | Student 1 | Open |
| RK-02 | Unequal contribution among members | Team | 2 | 3 | 6 | Everyone codes, reviews, writes a chapter and presents. Time log and repository history reviewed weekly | One person's tasks stay open for two weeks | Student 1 | Open |
| RK-03 | Grading rubric, report format or deadline unknown | Requirements | 3 | 2 | 6 | Ask the professor at the 6 Nov class or in a consultation. Build to slide 8 until answered | Rubric still missing on 13 Nov | Student 1 | Open |
| RK-04 | Documentation written at the end and not matching what was done | Quality | 3 | 3 | 9 | Write chapters as work happens, review documents at each milestone, record real dates | No chapter draft by 4 Dec | Student 5 | Open |
| RK-05 | Floating-point and display-rounding errors produce wrong or misleading results | Technical | 3 | 3 | 9 | Rules in the requirements (D3). Tests for precision, large, small and overflow values written before the code | A failing precision test | Student 4 | Open |
| RK-06 | Scope creep (extra features) | Scope | 2 | 2 | 4 | MoSCoW list, Could items only when Must and Should are tested | Features added without a decision log entry | Student 1 | Open |
| RK-07 | Live demo fails (browser, projector, laptop) | Delivery | 2 | 3 | 6 | Offline build (D2), rehearsals on the real set-up, second laptop, a backup recording made by the team | Any failure during rehearsal | Student 4 | Open |
| RK-08 | Lost work or merge conflicts, including problems from keeping the repository inside a OneDrive folder | Technical | 2 | 3 | 6 | Push to a remote repository early, small commits, avoid editing the same file at once. The working copy is inside OneDrive (checked 2026-10-31). Do not run git while OneDrive is mid-sync, never edit the same file from two machines, and check for conflict copies such as `file-DESKTOP-xxxx.md`. Preferred fix, pending project lead decision (Q8): move the working copy outside OneDrive and push to a remote | Sync conflict files, git errors | Student 1 | Open |
| RK-09 | A member is unavailable for a period | Team | 2 | 2 | 4 | Support roles (responsibility matrix), shared repository, notes in `docs/` | Missed two check-ins | Student 1 | Open |
| RK-10 | AI assistance used in a way the course does not allow, or work presented as the team's own when it was not | Academic integrity | 2 | 3 | 6 | Ask for the AI policy. Record every use in the tool and AI usage log. Humans review and understand all content. Only real results go in documents | AI use not logged | Student 1 | Open |
| RK-11 | Fabricated, wrong or unread sources in the literature review | Academic integrity | 2 | 3 | 6 | Cite only sources the team actually opened. Reviewer checks each reference exists | A reference nobody can show | Student 2 | Open |
| RK-12 | Enabled tools do not work as expected (plugins load only after a restart, Playwright needs a download) | Tooling | 2 | 2 | 4 | Check availability before claiming use. Plan fallbacks: `node --test` and manual browser checks work without extra tools | A tool is missing at the time of use | Student 5 | Open |
| RK-13 | Accessibility, security or compatibility problems found late | Quality | 2 | 2 | 4 | Requirements NFR-04 to NFR-06 from the start, early checks in W5, buffer before freeze | Problems first seen after 9 Dec | Student 5 | Open |
| RK-14 | Requirements misunderstood: the professor expects more (for example the 17-item list) than planned | Requirements | 2 | 2 | 4 | Proportionate coverage already planned, ask for clarification | Professor's answer asks for more | Student 2 | Open |

## Summary

| Score band | Count | IDs |
|---|---|---|
| High (6-9) | 9 | RK-01, 02, 03, 04, 05, 07, 08, 10, 11 |
| Low (1-5) | 5 | RK-06, 09, 12, 13, 14 |
| **Total** | **14** | |

## Review history

No weekly reviews have taken place yet. Each review will be added here with its real date and outcome.
