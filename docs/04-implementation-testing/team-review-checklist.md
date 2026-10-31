# Team Verification Checklist (proposal)

**Status:** **Proposal. Nothing on this page has been done by any student.** Every box is empty. A box is ticked only by the student who really did the task, with the date, and the result goes into the [test report](test-report.md) or the [time log](../00-admin/time-log.md). The roles are the provisional ones of the [responsibility matrix](../01-project-card/responsibility-matrix.md).
**Last updated:** 2026-10-31

**How to use it:** do your tasks, write down what you really found (including "I did not understand X"), then be ready to explain your part in the defence. If something fails, write a bug report using the template in the [bug log](bug-log.md). The AI assistant wrote the code and documents, so **your review is the independent check that is still missing**.

## Before you start (everyone, about 30 minutes)

- [ ] Pull the repository and open the folder (outside OneDrive if possible, risk RK-08).
- [ ] Run `node --test`, `node tests/browser-check.js` and `node tests/docs-check.js --require-tests`. Write your result (pass counts, your browser, your computer) in the test report section "Runs by students".
- [ ] Open `src/index.html` and use the calculator for five minutes.
- [ ] Read the [code walkthrough](code-walkthrough.md) sections 1 to 4.

## Student 1: project plan, requirements and documentation consistency

You must be able to explain: what the professor asked for, what we promised, and whether the documents agree with each other and with the application.

- [ ] Check the [requirements specification](../02-research-requirements/requirements-specification.md) against what you see in the application: pick 5 requirements and test each by hand. Note any disagreement.
- [ ] Read the [traceability matrix](../02-research-requirements/traceability-matrix.md). For 5 rows, find the named test in `tests/` and confirm it exists and checks the right thing.
- [ ] Check dates, hours and numbers that appear in more than one place (project card, WBS, Gantt). Run `node tests/docs-check.js` and read what it does not check.
- [ ] Check that no document claims a result that was not produced (look for "pass", "done", "verified" and ask "who ran it?").
- [ ] Fill in the [time log](../00-admin/time-log.md) honestly for your own hours; agree the weekly meeting time (communication rules C1-C3).
- [ ] Ask the professor the open questions Q1-Q5 and Q9 in the [decision log](../00-admin/decision-log.md) and record the real answers.
- **Questions you should be able to answer:** Which professor requirements (P-01 to P-20) are Mandatory? Which are only guidance? Which are not met yet and why?

## Student 2: research references and functional requirements

- [ ] Open every URL in the [calculator review](../02-research-requirements/calculator-review.md) section 8 and confirm each quote or fact. Write "confirmed" or "not found" per reference, with the date. (The assistant re-checked them on 2026-10-31; a human has not.)
- [ ] Run the hands-on session described in review section 7 on Windows Calculator and Google's calculator, then write `hands-on-notes.md` with real observations only.
- [ ] Walk through every functional requirement FR-01 to FR-18 with the application and mark pass or fail in your own words.
- [ ] Decide whether the lessons L1 to L11 are fairly derived from the sources.
- [ ] Check that the report will not need a source that has not been read (RK-11).
- **Questions you should be able to answer:** Why did we choose immediate execution? What did the three existing calculators teach us? What was not researched (users)?

## Student 3: UI/UX, accessibility, mobile and browser testing

- [ ] Open `src/index.html` in **Firefox** and run `node tests/browser-check.js` if you can use a Chromium browser. In Firefox, repeat by hand: `7 + 8 =`, `5 ÷ 0 =`, keyboard typing, Tab and Space, zoom 200 % and 400 %. **This is the open CSP-from-`file://` risk (security F2).**
- [ ] Test on a real phone (touch, rotation, 320 px–400 px wide).
- [ ] Screen reader: NVDA (Windows) or VoiceOver (Mac). Listen to a calculation and an error. Is the announcement clear? Is the error announced twice? (code review finding 11)
- [ ] Zoom to 200 % and 400 %, and set a larger browser font size. Nothing should be cut off. Look at the screenshots in `evidence/screenshots/` and compare with what you see.
- [ ] Run Lighthouse (accessibility) in Chrome DevTools and record the score and every warning.
- [ ] Ask two people outside the team to do `12 + 30 × 2` without help. Record what they did. (A tiny usability check, not research.)
- **Questions you should be able to answer:** Which colour pairs did we calculate and what are the ratios? Why are the keys 48 px? What does `aria-live` do?

## Student 4: calculator engine, formatting and implementation explanation

- [ ] Read `engine.js`, `format.js`, `keymap.js` and `app.js` completely.
- [ ] Explain to the team, with the state diagram open: what happens for the keys `5`, `+`, `3`, `=`.
- [ ] Explain why `press()` never changes the old state, and why `entry` is text.
- [ ] Explain the display policy: why does `0.1 + 0.2` show `0.3` while `0.1 + 0.2 - 0.3` shows `5.55111512313e-17`? Read the floating-point study in [architecture.md](../03-design-prototype/architecture.md) section 6.4 and say what you would recommend.
- [ ] Review BUG-1 and its fix in the [code review](code-review.md). Do you agree? Can you find another input that breaks the invariants?
- [ ] Run the three safe experiments in the code walkthrough section 7.
- **Questions you should be able to answer:** What are the five phases? What is underflow? Why do we ignore `=` after a result?

## Student 5: tests, QA, security and bug reporting

- [ ] Read all test files. For five tests, say what bug each one would catch.
- [ ] Do your own mutation check: change one line in `engine.js`, run `node --test`, confirm a test fails, undo the change (Git or a copy).
- [ ] Read the [security analysis](security-analysis.md) against the code. Do you agree with every row? Add what is missing and record the review.
- [ ] Try to break the calculator: unusual key sequences, very fast typing, key repeat, paste, drag and drop, the browser's back button.
- [ ] Check `git status`: no secrets, no local settings, no temporary files. Review `.gitignore`.
- [ ] Complete the [test plan](test-plan.md) section 7 manual items with real results and names.
- [ ] Write bug reports (template in the bug log) for everything you find.
- **Questions you should be able to answer:** What did the automated tests prove and not prove? What does the CSP block, and what did we test about it? What is the known limit L1?

## Sign-off (empty)

A student signs only after doing the tasks. The date and a one-line result are required.

| Student | Part reviewed | Date | Result in one line | Signature (name) |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
