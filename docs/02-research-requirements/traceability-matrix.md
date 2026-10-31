# Requirements Traceability Matrix

**Status:** Draft v0.3 (Phase 3, 2026-10-31). The application and its tests exist. The Status column of Part B shows what was **actually run**; items marked "not tested" or "pending" were not verified.
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
| P-07 | Implementation and testing: final solution and its verification | 8 (item 4) | Mandatory | `src/`, `tests/`, test plan and report | In progress: automated tests pass, test report started |
| P-08 | Documentation and defence: report and presentation of results | 8 (item 5) | Mandatory | `docs/05-final/` | Not started |
| P-09 | About 10 minutes to present, with a working demo | 8 (item 5, "for example") | Example | Presentation and live demo, 10 min planning target | Not started |
| P-10 | Defence on 18 December in the last class | 9, 11 | Mandatory | Presentation and demo on 18 Dec | Not started |
| P-11 | Documentation contains clearly defined and described elements | 8 | Mandatory | Document set in `docs/` | In progress |
| P-12 | Use Project-Based Learning | 7, 12-28 | Mandatory | PBL driving question, retrospectives, decision log | In progress |
| P-13 | Define work plan and schedule, documentation structure, communication rules | 5 | Course content | WBS, Gantt, folder structure. [team-communication-rules.md](../00-admin/team-communication-rules.md) (proposal, not yet agreed by the team) | Draft written |
| P-14 | Carry out security analyses | 5 | Course content | Security note (Phase 3) | Not started |
| P-15 | Present the designed system and hand over the documentation | 5 | Course content | Final package | Not started |
| P-16 | Records of working time of members, kept by the project manager | 32 (item 5) | Guidance | [time-log.md](../00-admin/time-log.md), empty template, no hours recorded | Template only |
| P-17 | The 17-item "draft should include" list | 32-33 | Guidance | Mapped in requirements specification section 6 | Mapped |
| P-18 | Grading rubric | 25 | Not provided | To request from the professor | Open question |
| P-19 | Obligatory literature (security books) | 6 | Guidance | Cite only works actually read | Open question |
| P-20 | Midpoint team retrospective and feedback, and teacher-approved summary of work | 13 (roadmap, in Polish) | Guidance | Retrospective planned 27 Nov | Planned |

## Part B. Our requirements to design and verification

Verification methods: **Unit** (Node test runner), **Browser** (automated, Playwright, planned for later), **Manual**, **Inspection**. Design element names refer to documents planned for Phase 2.

### Functional

| Req | Priority | Source | Planned design element | Planned test ID | Status |
|---|---|---|---|---|---|
| FR-01 | M | P-01 | Architecture 5.1: Ready, Entering | T-FR-01 | Unit and browser tests pass (2026-10-31) |
| FR-02 | M | P-01 | Architecture 5.1: Entering, one decimal point per number (L5) | T-FR-02 | Unit and browser tests pass (2026-10-31) |
| FR-03 | M | P-01 | Architecture 3: engine, arithmetic | T-FR-03 | Unit and browser tests pass (2026-10-31) |
| FR-04 | M | P-01 | Architecture 5.1: Result | T-FR-04 | Unit and browser tests pass (2026-10-31) |
| FR-05 | M | P-01, D1, L1 | Architecture 5.1: OperatorPending, immediate execution | T-FR-05 | Unit and browser tests pass (2026-10-31) |
| FR-06 | M | P-02 | Architecture 5.1: C returns to Ready | T-FR-06 | Unit and browser tests pass (2026-10-31) |
| FR-07 | M | P-02 | Architecture 5.1: Entering, backspace | T-FR-07 | Unit and browser tests pass (2026-10-31) |
| FR-08 | M | P-01, L4 | Architecture 5.1: OperatorPending, replace operator | T-FR-08 | Unit and browser tests pass (2026-10-31) |
| FR-09 | M | P-02, L3 | Architecture 5.1: Error | T-FR-09 | Unit and browser tests pass (2026-10-31) |
| FR-10 | M | D3, L2 | Architecture 6: number policy | T-FR-10 | Unit and browser tests pass (2026-10-31) |
| FR-11 | M | D3 | Architecture 6: formatting and overflow | T-FR-11 | Unit and browser tests pass (2026-10-31) |
| FR-12 | M | P-02 | Architecture 5.1: 12-digit entry limit | T-FR-12 | Unit and browser tests pass (2026-10-31) |
| FR-13 | M | L6 (review), D12 | UI design 5: key map; `keymap.js` | T-FR-13 | Unit and browser tests pass (2026-10-31) |
| FR-14 | W | Decision D10 | Retired: percent removed from scope (W-08) | T-FR-14 (unknown keys are ignored) | Unit test passes: unknown keys are ignored (2026-10-31) |
| FR-15 | M | D16 | Architecture 3: engine, negate | T-FR-15 | Unit and browser tests pass (2026-10-31) |
| FR-16 | S | Phase 2 research | UI design 3: expression line | T-FR-16 | Unit and browser tests pass (2026-10-31) |
| FR-17 | C | Stretch | Only if time allows | T-FR-17 | Not built (Could have) |
| FR-18 | M | State diagram review | Architecture 5.1: Ready, OperatorPending, Result rules | T-FR-18 | Unit and browser tests pass (2026-10-31) |

### Non-functional

| Req | Source | Planned design element | Planned test or check | Status |
|---|---|---|---|---|
| NFR-01 | P-07 | This matrix | Review: every FR has a test ID | Partly: every active FR has a test (`docs-check --require-tests` passes); results in the test report |
| NFR-02 | P-02, L3 | Architecture 5.1 Error state, section 6 formatting | T-NFR-02 (randomised key sequences) | Unit (20,000 random sequences) and browser (400 random keys) pass |
| NFR-03 | P-02 | UI design 2-3: 48 px keys | T-NFR-03 (manual user check) | Key size measured in Edge (at least 61 x 56 px at 320 px). First-time-user check **not done** |
| NFR-04 | L6-L8 | UI design 6: accessibility checklist | T-NFR-04 (keyboard, labels, contrast, Lighthouse) | Partly: automated checks pass. **Screen reader and Lighthouse not run** |
| NFR-05 | P-02 | UI design 4: responsive layout | T-NFR-05 (three browsers, 320 px) | Edge only, at 320, 360, 768, 1280 px: pass. Chrome and Firefox **not tested** |
| NFR-06 | P-14 | Architecture 7: security notes | T-NFR-06 (inspection, security note) | Static tests pass; the Content-Security-Policy works from `file://` in Edge. Security note **not written yet** |
| NFR-07 | D2 | Architecture 2: classic scripts | T-NFR-07 (open from `file://`) | Opens from `file://` in Edge: pass. Other browsers **not tested** |
| NFR-08 | P-06 | Architecture 2-3: engine/UI separation | T-NFR-08 (review) | Static and purity tests pass. Peer review **pending** |
| NFR-09 | P-12 | Tool and AI usage log | T-NFR-09 (inspection) | Inspection **pending** |

## Part C. Coverage summary

Counts are checked against the requirements specification. They describe **planned** coverage only.

| Item | Count |
|---|---|
| Functional requirements | 18 IDs: 15 Must, 1 Should, 1 Could, 1 retired (FR-14, Won't) |
| Non-functional requirements | 9 |
| Active requirements with a planned verification | 26 of 26 (17 functional + 9 non-functional) |
| Automated tests written | 65 (`node --test`) plus 78 browser checks (`tests/browser-check.js`) |
| Tests run | All of them, on 2026-10-31. Results in the [test report](../04-implementation-testing/test-report.md) |
