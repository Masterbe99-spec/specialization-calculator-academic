# Basic Calculator Application

Specialization Project, Team A. Final defence: **18 December 2026**.

A browser-based calculator that lets the user perform basic mathematical operations. It is built with HTML, CSS and vanilla JavaScript and runs offline by opening `src/index.html`.

> **Status: Phase 4 (quality assurance) finished. Phase 5 (final report and presentation) is planned, not started.**
> A working calculator exists in `src/` with automated tests. It was tested by the AI assistant in **Edge, Chrome and Firefox** (headless). **No student has run the tests, and no human has verified anything yet:** screen reader, real phone, first-time users, Firefox keyboard focus and independent code review are still open. See the [test report](docs/04-implementation-testing/test-report.md), whose Part A is the current result.

## The assignment

The professor's presentation (2 October 2026) assigns Team A the application "Calculator that allows the user to perform basic mathematical operations" (slide 10). It must be a **working application**. The final result, per slide 8, is a very simple working application with documentation containing five clearly defined and described elements:

1. Project card: purpose, scope of work, technologies and methodologies, schedule (e.g. Gantt chart).
2. Literature and assumption review: analysis of existing solutions, collection of requirements.
3. Design and prototyping: architecture, schematics, first versions of code or models.
4. Implementation and testing: the final solution and its verification.
5. Documentation and defence: a report and a presentation of results, for example 10 minutes with a working demo.

The defence takes place on 18 December 2026, in the last class (slides 9 and 11). The course uses Project-Based Learning (slides 7 and 12-28).

**Driving question:** How can we build a calculator that a first-time user can trust to give correct results, and how can we prove it?

## Team

Five students. Real names will replace the placeholders once the team provides them.

| Placeholder | Provisional role |
|---|---|
| Student 1 | Project management, coordination, project card, schedule |
| Student 2 | Research, requirements analysis, literature review |
| Student 3 | UI/UX design, architecture, diagrams, prototype |
| Student 4 | Development, implementation, code quality |
| Student 5 | Testing, quality assurance, documentation integration |

Roles are provisional. Every member contributes to reviews and the final presentation. See [responsibility matrix](docs/01-project-card/responsibility-matrix.md).

## Project structure

```
specialization-calculator/
├─ README.md
├─ .gitignore
├─ package.json                      Scripts only (npm test); no dependencies
├─ src/                              The application
│  ├─ index.html                     The page
│  ├─ css/styles.css                 Look and layout
│  └─ js/
│     ├─ engine.js                   Calculator rules (no page code)
│     ├─ format.js                   Number and display text (no page code)
│     ├─ keymap.js                   Keyboard map (no page code)
│     └─ app.js                      Connects the page to the calculator
├─ tests/
│  ├─ engine, format, keymap, security, boundary, accessibility `.test.js`   `node --test`
│  ├─ browser-check.js, browser-backends.js   Real-browser checks (Edge, Chrome, Firefox; no packages)
│  └─ docs-check.js                  Documentation consistency check
├─ docs/
│  ├─ 00-admin/
│  │  ├─ decision-log.md             Project decisions and their reasons
│  │  ├─ risk-register.md            Risks and mitigations
│  │  ├─ time-log.md                 Working-time log (template, hours blank)
│  │  ├─ team-communication-rules.md Communication and meeting rules (proposal)
│  │  ├─ tool-ai-usage-log.md        Tools, skills and AI assistance actually used
│  │  └─ meeting-notes/              Real meeting notes only
│  ├─ 01-project-card/
│  │  ├─ project-card.md             Purpose, scope, technologies, schedule summary
│  │  ├─ wbs.md                      Work Breakdown Structure
│  │  ├─ gantt.md                    Schedule, 31 Oct - 18 Dec 2026
│  │  └─ responsibility-matrix.md    Provisional five-person responsibilities
│  ├─ 02-research-requirements/
│  │  ├─ requirements-specification.md   Functional and non-functional, MoSCoW
│  │  ├─ calculator-review.md            Review of three existing calculators, sources, lessons
│  │  └─ traceability-matrix.md          Professor requirements and requirement-to-verification links
│  ├─ 03-design-prototype/           Phase 2 (approved 2026-10-31)
│  │  ├─ architecture.md             Architecture, data-flow and state diagrams, number policy
│  │  ├─ ui-design.md                Wireframe, keyboard map, accessibility review
│  │  ├─ visual-prototype.html       Static mock-up (does not calculate)
│  │  └─ pbl-design-notes.md         Material for the final report
│  ├─ 04-implementation-testing/     Phase 3
│  │  ├─ test-plan.md, test-report.md   What is tested, and the real results
│  │  ├─ development-log.md          What was built, in order, and why
│  │  ├─ security-analysis.md, code-review.md, bug-log.md   Phase 4 quality assurance
│  │  ├─ team-review-checklist.md    What each student should verify (proposal)
│  │  └─ code-walkthrough.md         How the team can read and extend the code
│  └─ 05-final/                      Final report, presentation, demo script
└─ evidence/screenshots/             Real screenshots only
```

## How to read the documents

Start with the [project card](docs/01-project-card/project-card.md), then the [requirements specification](docs/02-research-requirements/requirements-specification.md). Phase 2 adds the [calculator review](docs/02-research-requirements/calculator-review.md), the [architecture](docs/03-design-prototype/architecture.md) and the [UI design](docs/03-design-prototype/ui-design.md). The [traceability matrix](docs/02-research-requirements/traceability-matrix.md) shows which professor slide supports each deliverable and which test will verify each requirement.

## Working rules

- Markdown is the editable source for planning documents. Final report and slides are produced later.
- Never record work, hours, consultations, test results or screenshots that did not happen. Entries marked **Planned** are plans, not results.
- Every test result, once it exists, is recorded from a real run, with date and who ran it.
- Cite only sources the team has actually read.
- Significant decisions go in the [decision log](docs/00-admin/decision-log.md). Use of tools and AI assistance goes in the [tool and AI usage log](docs/00-admin/tool-ai-usage-log.md).
- Git commits are made only with the project lead's approval. The first commit (Phase 1 documents, local only, not pushed) was approved by the project lead on 2026-10-31.

## Running the application

**Use it:** double-click `src/index.html`. It opens in your browser. No server, no internet, no installation.

**Run the checks** (needs only [Node.js](https://nodejs.org) 22 or newer; Edge, Chrome or Firefox for the browser check; set `BROWSER` or `FIREFOX` to the browser's `.exe` if it is not found):

```
node --test                                 88 automated unit and static tests
node tests/browser-check.js --shots         102 checks in a real browser (Edge or Chrome), saves screenshots
node tests/browser-check.js --firefox       the same checks in Firefox (88 pass, 11 skipped for stated reasons)
node tests/docs-check.js --require-tests    documentation consistency
```

`npm test` runs the first command if you have npm. Nothing needs to be installed with npm: the project has no dependencies.

**Keyboard:** digits, `.` (or `,`), `+ - * /`, `Enter` or `=`, `Backspace`, `Esc` (clear). The calculator works in the order you press keys: `2 + 3 × 4 =` gives `20`.
