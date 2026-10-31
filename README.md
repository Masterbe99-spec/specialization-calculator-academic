# Basic Calculator Application

Specialization Project, Team A. Final defence: **18 December 2026**.

A browser-based calculator that lets the user perform basic mathematical operations. It is built with HTML, CSS and vanilla JavaScript and runs offline by opening `src/index.html`.

> **Status: Phase 1 finalised, Phase 2 (research and design) in progress.**
> No calculator code exists yet, and Phase 3 has not started. Everything in `docs/` is a planning draft awaiting team review. Nothing in this repository records work that has not actually been done.

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
├─ src/                              Application (empty until implementation phase)
│  ├─ css/
│  └─ js/
├─ tests/                            Automated tests (empty until implementation phase)
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
│  ├─ 04-implementation-testing/     Phase 3 (test plan, test report, security note)
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

Not available yet. When implemented, the calculator will run by opening `src/index.html` in a browser, with no build step, server or dependencies. Automated tests will use the Node.js built-in test runner (`node --test`).
