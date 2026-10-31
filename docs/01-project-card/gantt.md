# Gantt Chart: 31 October - 18 December 2026

**Status:** Draft v0.1. This is a **plan**. Actual progress is recorded in the time log and weekly notes, not here.
**Last updated:** 2026-10-31

The project runs seven Saturday-to-Friday weeks. 31 October is a Saturday, 6 November, 27 November, 4 December and 18 December are Fridays.

Fixed dates from the professor's timetable (slide 11): project classes on **6 November** and **18 December 2026** (18:10-19:50). The 2 October class has already taken place.

## Chart (Mermaid)

```mermaid
gantt
    title Basic Calculator, Team A (plan)
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b
    section 1 Management
    Project card, WBS, Gantt, risks      :p1, 2026-10-31, 2026-11-06
    Weekly check-ins and logs            :p1b, 2026-11-07, 2026-12-18
    Midpoint retrospective               :milestone, m4, 2026-11-27, 0d
    section 2 Research and requirements
    Existing solutions review            :r1, 2026-11-02, 2026-11-09
    Requirements gathering and edge cases:r2, 2026-11-05, 2026-11-13
    section 3 Design and prototype
    Wireframes                           :d1, 2026-11-09, 2026-11-14
    Architecture, DFD, state diagram     :d2, 2026-11-12, 2026-11-20
    Display rules and prototype          :d3, 2026-11-14, 2026-11-22
    section 4 Implementation
    Engine, test-first                   :i1, 2026-11-16, 2026-11-27
    User interface                       :i2, 2026-11-20, 2026-12-01
    Keyboard and accessibility           :i3, 2026-11-28, 2026-12-04
    section 5 Testing and QA
    Test plan                            :t1, 2026-11-16, 2026-11-22
    Unit tests with the engine           :t2, 2026-11-16, 2026-12-04
    Test execution, browser, security    :t3, 2026-12-01, 2026-12-08
    Bug fixing and code freeze           :t4, 2026-12-05, 2026-12-09
    section 6 Documentation
    Chapter drafts, written as we go     :c1, 2026-11-09, 2026-12-04
    Report completion and review         :c2, 2026-12-05, 2026-12-14
    section 7 Presentation and defence
    Outline and demo script              :s1, 2026-12-07, 2026-12-13
    Slides, rehearsals                   :s2, 2026-12-10, 2026-12-17
    Buffer                               :crit, b1, 2026-12-10, 2026-12-13
    Defence                              :milestone, crit, m9, 2026-12-18, 0d
```

## Milestones

| # | Date | Weekday | Milestone | Evidence expected when reached |
|---|---|---|---|---|
| M1 | 6 Nov | Friday | Project card and plan reviewed (class day) | Reviewed documents, notes |
| M2 | 13 Nov | Friday | Requirements baseline | Approved requirements specification |
| M3 | 20 Nov | Friday | Design and prototype review | Diagrams, wireframes |
| M4 | 27 Nov | Friday | First working version and team retrospective | Running build, retrospective notes |
| M5 | 4 Dec | Friday | Feature complete | Tests passing for Must items |
| M6 | 9 Dec | Wednesday | Code freeze and test report | Test report from real runs |
| M7 | 14 Dec | Monday | Documentation complete | Final report draft |
| M8 | 16 Dec | Wednesday | Dress rehearsal | Rehearsal notes |
| M9 | 18 Dec | Friday | Defence | Presentation and live demo |

## Weekly view

| Week | Dates | Mgmt | Research | Design | Build | Test | Docs | Present |
|---|---|---|---|---|---|---|---|---|
| W1 | 31 Oct - 6 Nov | ● | ○ | | | | | |
| W2 | 7 - 13 Nov | ○ | ● | ○ | | | ○ | |
| W3 | 14 - 20 Nov | ○ | | ● | ○ | ○ | ○ | |
| W4 | 21 - 27 Nov | ● retro | | ○ | ● | ○ | ○ | |
| W5 | 28 Nov - 4 Dec | ○ | | | ● | ● | ○ | |
| W6 | 5 - 11 Dec | ○ | | | fixes | ● | ● | ○ |
| W7 | 12 - 18 Dec | ○ | | | | | ● | ● |

● main effort, ○ light effort.

## Notes

- Playwright browser tests (WBS 5.4) are not shown as a separate bar. They depend on a later approval to install them and would sit inside "Test execution" in W5-W6.
- The buffer of 10-13 December is deliberate. If work slips, it is used first.
- Slide 13 shows a midpoint team retrospective in the PBL process. Its exact date is the team's choice; 27 November is our proposal.
- This schedule is a proposal. Dates change only through a recorded decision.
