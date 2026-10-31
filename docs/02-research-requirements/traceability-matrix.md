# Requirements Traceability Matrix

**Status:** v0.5, final for Phase 4 (2026-10-31). The application and its tests exist. The Status column of Part B shows what was **actually run**; items marked "not tested" or "pending" were not verified.
**Last updated:** 2026-10-31

Two links are tracked:

- **Part A:** professor's requirement (slide) → our deliverable.
- **Part B:** our requirement → planned design element → planned verification.

Test IDs in Part B (`T-...`) are **reserved names**. A test is only marked done when it has actually been written and run, with the result recorded in the test report.

## Part A. Professor's requirements to deliverables

Source: "2026.10.02 Specialization project" presentation. **Strength** shows how firmly the slide states the item: *Mandatory* (stated as what the final result is or must be), *Example* (the slide says "e.g." or "for example"), *Guidance* (appears in a general list, not clearly required for this course), *Not provided* (mentioned but absent from the deck).

| ID | Requirement | Slide | Strength | Deliverable | Status |
|---|---|---|---|---|---|
| P-01 | Team A builds a "calculator that allows the user to perform basic mathematical operations" | 10 (also 7) | Mandatory | Application in `src/` | Implemented, awaiting team review |
| P-02 | The application must be a "working application", very simple | 10, 8 | Mandatory | Working build, live demo | Works in Edge from `file://`. Live demo and other browsers not done |
| P-03 | Project card: purpose, scope of work, technologies/methodologies, schedule | 8 (item 1) | Mandatory | [project-card.md](../01-project-card/project-card.md) | Draft written |
| P-04 | Schedule, for example a Gantt chart | 8 (item 1, "e.g."), 32 (item 9) | Example, expected | [gantt.md](../01-project-card/gantt.md) | Draft written |
| P-05 | Literature and assumption review: analysis of existing solutions, collection of requirements | 8 (item 2) | Mandatory | [calculator-review.md](calculator-review.md), [requirements-specification.md](requirements-specification.md) | Draft written. Sources need team verification. No user research |
| P-06 | Design and prototyping: architecture, schematics, first versions of code or models | 8 (item 3) | Mandatory | [architecture.md](../03-design-prototype/architecture.md), [ui-design.md](../03-design-prototype/ui-design.md), [visual-prototype.html](../03-design-prototype/visual-prototype.html) | Design approved 2026-10-31; first working code exists |
| P-07 | Implementation and testing: final solution and its verification | 8 (item 4) | Mandatory | `src/`, `tests/`, [test plan](../04-implementation-testing/test-plan.md), [test report](../04-implementation-testing/test-report.md) | Automated verification done (Edge, Chrome). Human verification and Firefox open |
| P-08 | Documentation and defence: report and presentation of results | 8 (item 5) | Mandatory | `docs/05-final/` | Planning only: [report outline](../05-final/report-outline.md), [presentation plan](../05-final/presentation-plan.md), [acceptance checklist](../05-final/acceptance-and-submission-checklist.md). **No report or slides exist** |
| P-09 | About 10 minutes to present, with a working demo | 8 (item 5, "for example") | Example | Presentation and live demo, 9 min plan inside the 10 min example | Draft slides and demo script prepared; rehearsal pending |
| P-10 | Defence on 18 December in the last class | 9, 11 | Mandatory | Presentation and demo on 18 Dec | Not started |
| P-11 | Documentation contains clearly defined and described elements | 8 | Mandatory | Document set in `docs/` | In progress |
| P-12 | Use Project-Based Learning | 7, 12-28 | Mandatory | PBL driving question, retrospectives, decision log | In progress |
| P-13 | Define work plan and schedule, documentation structure, communication rules | 5 | Course content | WBS, Gantt, folder structure. [team-communication-rules.md](../00-admin/team-communication-rules.md) (proposal, not yet agreed by the team) | Draft written |
| P-14 | Carry out security analyses | 5 | Course content | [security-analysis.md](../04-implementation-testing/security-analysis.md) | Draft written; human review pending |
| P-15 | Present the designed system and hand over the documentation | 5 | Course content | Final package | Draft deliverables prepared; student review pending |
| P-16 | Records of working time of members, kept by the project manager | 32 (item 5) | Guidance | [time-log.md](../00-admin/time-log.md), empty template, no hours recorded | Template only |
| P-17 | The 17-item "draft should include" list | 32-33 | Guidance | Mapped in requirements specification section 6 | Mapped |
| P-18 | Grading rubric | 25 | Not provided | To request from the professor | Open question |
| P-19 | Obligatory literature (security books) | 6 | Guidance | Cite only works actually read | Open question |
| P-20 | Midpoint team retrospective and feedback, and teacher-approved summary of work | 13 (roadmap, in Polish) | Guidance | Retrospective planned 27 Nov | Planned |

## Part B. Our requirements to design and verification

Verification methods: **Unit** (Node test runner), **Browser** (automated: `tests/browser-check.js` in Edge, Chrome and Firefox; Playwright was not used), **Manual**, **Inspection**. Design element names refer to documents planned for Phase 2.

### Functional

| Req | Priority | Source | Planned design element | Planned test ID | Status |
|---|---|---|---|---|---|
| FR-01 | M | P-01 | Architecture 5.1: Ready, Entering | T-FR-01 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-02 | M | P-01 | Architecture 5.1: Entering, one decimal point per number (L5) | T-FR-02 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-03 | M | P-01 | Architecture 3: engine, arithmetic | T-FR-03 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-04 | M | P-01 | Architecture 5.1: Result | T-FR-04 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-05 | M | P-01, D1, L1 | Architecture 5.1: OperatorPending, immediate execution | T-FR-05 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-06 | M | P-02 | Architecture 5.1: C returns to Ready | T-FR-06 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-07 | M | P-02 | Architecture 5.1: Entering, backspace | T-FR-07 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31). BUG-1 fixed (regression tests) |
| FR-08 | M | P-01, L4 | Architecture 5.1: OperatorPending, replace operator | T-FR-08 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-09 | M | P-02, L3 | Architecture 5.1: Error | T-FR-09 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-10 | M | D3, L2 | Architecture 6: number policy | T-FR-10 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-11 | M | D3 | Architecture 6: formatting and overflow | T-FR-11 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-12 | M | P-02 | Architecture 5.1: 12-digit entry limit | T-FR-12 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-13 | M | L6 (review), D12 | UI design 5: key map; `keymap.js` | T-FR-13 | Unit and browser typing pass in Edge, Chrome and Firefox; the keyboard-only script passes in Edge and Chrome. **Not verified:** focus-dependent keyboard behaviour in Firefox, and a person using only the keyboard |
| FR-14 | W | Decision D10 | Retired: percent removed from scope (W-08) | T-FR-14 (unknown keys are ignored) | Unit test passes: unknown keys are ignored (2026-10-31) |
| FR-15 | M | D16 | Architecture 3: engine, negate | T-FR-15 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-16 | S | Phase 2 research | UI design 3: expression line | T-FR-16 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |
| FR-17 | C | Stretch | Only if time allows | T-FR-17 | Not built (Could have) |
| FR-18 | M | State diagram review | Architecture 5.1: Ready, OperatorPending, Result rules | T-FR-18 | Unit, boundary and browser tests pass in Edge, Chrome and Firefox (2026-10-31) |

### Non-functional

| Req | Source | Planned design element | Planned test or check | Status |
|---|---|---|---|---|
| NFR-01 | P-07 | This matrix | Review: every FR has a test ID | Partly: `docs-check --require-tests` passes (every active FR has a named test). Independent review pending |
| NFR-02 | P-02, L3 | Architecture 5.1 Error state, section 6 formatting | T-NFR-02 (randomised key sequences) | Unit (about 970,000 random key presses) and browser (1,000 per browser) pass |
| NFR-03 | P-02 | UI design 2-3: 48 px keys | T-NFR-03 (manual user check) | Key size measured at 6 viewport settings (at least 61 x 56 px at 320 px). First-time-user check **not done** |
| NFR-04 | L6-L8 | UI design 6: accessibility checklist | T-NFR-04 (keyboard, labels, contrast, Lighthouse) | Automated parts pass (contrast from the stylesheet, names, roles, live-region properties in Edge and Chrome, markup in Firefox, focus order, keyboard-only script in Edge and Chrome). **Screen reader, Lighthouse, human keyboard test and Firefox focus behaviour: not done** |
| NFR-05 | P-02 | UI design 4: responsive layout | T-NFR-05 (three browsers, 320 px) | Edge, Chrome and Firefox at 320, 360, 768, 1280 px, zoom 200 % and 400 %, text 150 % and 200 %: pass. **Firefox and real devices not tested** |
| NFR-06 | P-14 | Architecture 7: security notes | T-NFR-06 (inspection, security note) | Static scan, CSP enforced in all three browsers, no network, no storage: pass. See [security-analysis.md](../04-implementation-testing/security-analysis.md). **Human review not done** |
| NFR-07 | D2 | Architecture 2: classic scripts | T-NFR-07 (open from `file://`) | Opens from `file://`; Edge: exactly 6 local requests; Firefox: works with all web access blocked: pass |
| NFR-08 | P-06 | Architecture 2-3: engine/UI separation | T-NFR-08 (review) | Purity and separation tests pass; code review written by the author ([code-review.md](../04-implementation-testing/code-review.md)). **Independent review pending** |
| NFR-09 | P-12 | Tool and AI usage log | T-NFR-09 (inspection) | Inspection **pending** |

## Part C. Coverage summary

Counts are checked against the requirements specification. They describe **planned** coverage only.

| Item | Count |
|---|---|
| Functional requirements | 18 IDs: 15 Must, 1 Should, 1 Could, 1 retired (FR-14, Won't) |
| Non-functional requirements | 9 |
| Active requirements with a planned verification | 26 of 26 (17 functional + 9 non-functional) |
| Automated tests written | 88 (`node --test`) plus the browser script `tests/browser-check.js`: 102 checks in Edge and in Chrome, 88 passed and 11 skipped in Firefox |
| Tests run | All of them, on 2026-10-31. Results in the [test report](../04-implementation-testing/test-report.md) |
