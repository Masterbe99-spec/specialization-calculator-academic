# Builds the JSON content file for the Word report. Facts come from the project's own documents and source files.
import json, os, re, sys, subprocess
sys.stdout.reconfigure(encoding='utf-8')
ROOT = sys.argv[1]
OUT = sys.argv[2]
FIG = ROOT.replace('\\', '/') + '/docs/05-final/figures/'
EVI = ROOT.replace('\\', '/') + '/evidence/screenshots/'
def rd(rel): return open(os.path.join(ROOT, rel), encoding='utf-8').read()

blocks = []
chapter = {'name': 'Front matter'}
placeholders = []   # (chapter, text)

def note_placeholders(text):
    for m in re.finditer(r'\[\[(.+?)\]\]', text):
        if m.group(1) == 'Yellow text in brackets': continue
        placeholders.append((chapter['name'], m.group(1)))
def add(b):
    for k in ('text', 'caption', 'tag', 'institution', 'status'):
        if k in b and isinstance(b[k], str): note_placeholders(b[k])
    for k in ('items', 'header'):
        if k in b: [note_placeholders(str(x)) for x in b[k]]
    if 'rows' in b:
        for r in b['rows']: [note_placeholders(str(c)) for c in r]
    if 'details' in b:
        for r in b['details']: [note_placeholders(str(c)) for c in r]
    blocks.append(b)
def H1(t, tag=None):
    chapter['name'] = t
    b = {'type': 'h1', 'text': t}
    if tag: b['tag'] = tag
    add(b)
def H2(t): add({'type': 'h2', 'text': t})
def H3(t): add({'type': 'h3', 'text': t})
def P(t): add({'type': 'p', 'text': t})
def B(items): add({'type': 'bullets', 'items': items})
def N(items): add({'type': 'numbered', 'items': items})
def T(caption, header, widths, rows, first_bold=False): add({'type': 'table', 'caption': caption, 'header': header, 'widths': widths, 'rows': rows, 'firstColBold': first_bold})
def IMG(path, w, alt, cap): add({'type': 'image', 'path': path, 'widthCm': w, 'alt': alt, 'caption': cap})
def ROW(images, cap): add({'type': 'imagerow', 'images': images, 'caption': cap})
def CODE(t): add({'type': 'code', 'text': t})
def CALL(t): add({'type': 'callout', 'text': t})
def NOTE(t): add({'type': 'note', 'text': t})

def extract(rel, start, end):
    s = rd(rel); a = s.index(start); b = s.index(end, a)
    lines = s[a:b].rstrip().split('\n')
    ind = min(len(l) - len(l.lstrip()) for l in lines if l.strip())
    return '\n'.join(l[ind:] for l in lines)

def count_lines(rel): return len(rd(rel).split('\n')) - (1 if rd(rel).endswith('\n') else 0)
LC = {f: count_lines(f) for f in ['src/index.html', 'src/css/styles.css', 'src/js/engine.js', 'src/js/format.js', 'src/js/keymap.js', 'src/js/app.js']}

# ============================================================== COVER AND FRONT MATTER
add({'type': 'cover', 'institution': '[[INSTITUTION NAME AND FACULTY]]', 'title': 'Basic Calculator Application', 'subtitle': 'Team A: Specialization Project Report',
     'course': 'Course: Specialization Project (IN.MSA.CBS.006), Project-Based Learning',
     'details': [['Team', 'Team A (five students)'],
                 ['Student 1', '[[STUDENT 1: full name, student number]]'], ['Student 2', '[[STUDENT 2: full name, student number]]'], ['Student 3', '[[STUDENT 3: full name, student number]]'],
                 ['Student 4', '[[STUDENT 4: full name, student number]]'], ['Student 5', '[[STUDENT 5: full name, student number]]'],
                 ['Teacher', '[[PROFESSOR NAME, as it should appear]]'], ['Final defence', '18 December 2026'], ['Submission date', '[[SUBMISSION DATE]]'],
                 ['Version', 'Draft 0.2, corrected on 31 October 2026 after the academic audit']],
     'status': '**DRAFT. NOT SIGNED OFF AND NOT READY FOR SUBMISSION.** This draft was prepared by an AI assistant (Claude Code) from the project documents and was **not yet reviewed by the five students or by the professor**. Yellow fields are missing information that only the students can supply. Human test results are marked PENDING.'})
add({'type': 'front', 'text': 'About this draft'})
P('This is a **draft** of the final project report. It is written so that the five students can read it, correct it, and then make it their own. Please read the following notes before you edit it.')
T('How to read this draft', ['Mark', 'Meaning'], [2, 8], [
    ['[[Yellow text in brackets]]', 'Information that is **missing** and must be supplied by the students or the professor (names, hours, reflections, dates, results of human tests). Appendix H lists all of them.'],
    ['**[Element 1] to [Element 4]**', 'The four mandatory development elements named on slide 8 of the professor\'s presentation: project card; literature and assumption review; design and prototyping; implementation and testing. The fifth element is this report and the presentation.'],
    ['**Automated**', 'A result produced by a program that anyone can run again (unit tests, browser checks, documentation checks).'],
    ['**AI review**', 'A review made by the AI assistant that also wrote the code. It is **not** independent.'],
    ['**PENDING**', 'A check that needs a person or equipment that was not available. Nothing marked PENDING has been done.'],
], True)
CALL('**Authorship and AI assistance.** The source code, the automated tests, the project documents and this draft were produced by an AI assistant (Claude Code) working on the instructions of the project lead. They are **not** the independent work of the students. The students must read, understand, test and be able to explain everything in it before they present it as their own. The students\' own contributions (hours, meetings, reviews, reflections) are **not yet recorded**; they appear here only as yellow placeholders. Whether and how AI assistance may be used is governed by the professor\'s policy, which is still unknown (open question Q4).')
add({'type': 'toc'})

# ============================================================== 1 INTRODUCTION
H1('1 Introduction and objectives')
H2('1.1 The assignment')
P('The course "Specialization Project" (IN.MSA.CBS.006) is taught with the Project-Based Learning (PBL) method [14]. The professor divided the student group into two teams. **Team A** was assigned the following application: *a calculator that allows the user to perform basic mathematical operations* (slide 10 [14]). The second team builds a notes application. The professor requires that the result is a **working application** and describes the final result as "very simple working applications with documentation" (slide 8 [14]).'.replace('*', ''))
P('The final defence takes place on **18 December 2026**, in the last class of the course (slides 9 and 11 [14]). The professor gives, as an example, ten minutes to present the project and show a working demonstration (slide 8 [14]).')
H2('1.2 The driving question')
P('Project-Based Learning starts from an open question [14]. The project is built around this question (set in the Phase 1 plan and approved by the project lead):')
CALL('**How can we build a calculator that a first-time user can trust to give correct results, and how can we prove it?**')
P('The question has two halves. The first half is about the product: a calculator must be simple to use and must not mislead. The second half is about evidence: it is not enough to say that the calculator works; the project must show how it was checked, and be honest about what was not checked.')
H2('1.3 Objectives')
T('Project objectives and where they are answered', ['No.', 'Objective', 'Chapter'], [1, 9, 2], [
    ['O1', 'Build a very simple working calculator for a web browser, with HTML, CSS and plain JavaScript, that runs offline.', '5, 6, 10'],
    ['O2', 'Study existing calculators, collect requirements and write them down so that they can be tested.', '4'],
    ['O3', 'Design the program so that the calculation rules are separate from the user interface, and document the design with diagrams.', '5'],
    ['O4', 'Verify the calculator with automated tests in several browsers, record real results and report problems honestly.', '7'],
    ['O5', 'Make the calculator usable with keyboard and touch, accessible, and secure to a level that fits a small page.', '5, 7'],
    ['O6', 'Organise the work as a team project, learn from the process (PBL) and present the results with a live demonstration.', '2, 3, 9, 11'],
], True)
H2('1.4 Scope')
T('What is and is not part of the calculator', ['In scope', 'Out of scope (decided)'], [1, 1], [
    ['Addition, subtraction, multiplication, division', 'Percent key (removed by decision D10)'],
    ['Decimal numbers, negative numbers, sign toggle', 'Operator precedence and brackets; scientific functions'],
    ['Clear and backspace; keyboard input', 'Memory keys, history, themes, dark mode'],
    ['Clear error messages and recovery (division by zero, too large, too small)', 'Repeat-equals, accounts, database, installable app'],
    ['Responsive layout down to 320 px; accessibility basics', 'Languages other than English; currency or unit conversion'],
])
H2('1.5 Structure of the report and the professor\'s required elements')
P('Slide 8 [14] says that the documentation must contain five clearly defined elements. Elements 1 to 4 are the four mandatory **development** sections. They are marked with a blue label at the start of the matching chapters. The fifth element is the report and the presentation themselves.')
T('The professor\'s five elements and the chapters of this report', ['Element on slide 8', 'What it asks for', 'Chapters'], [3, 6, 2], [
    ['**[Element 1]** Project card', 'Purpose, scope of work, technologies and methodologies used, schedule (for example a Gantt chart)', '2 (and 3)'],
    ['**[Element 2]** Literature and assumption review', 'Analysis of existing solutions and collection of requirements', '4'],
    ['**[Element 3]** Design and prototyping', 'Application architecture, schematics, first versions of code or models', '5'],
    ['**[Element 4]** Implementation and testing', 'Creating the final solution and its verification', '6 and 7'],
    ['[Element 5] Documentation and defence', 'Preparation of the report and presentation of the results, with a working demo', 'This report; the presentation; the demo'],
], False)
P('The other material (organisation, risks, PBL reflection, deployment) comes from the list "the draft should include" on slides 32 and 33 and from the PBL slides [14]. It is supplementary project-management material. Appendix A maps all 17 items of that list to the chapters.')
H2('1.6 How this report was prepared')
P('The report is based on the project documents in the Git repository (`docs/`), the source code (`src/`), the tests (`tests/`) and the evidence (`evidence/`). Every number comes from those files or from test runs recorded in them. Section 7.1 explains which results are automated, which are AI review and which are still waiting for a human.')

# ============================================================== 2 PROJECT CARD
H1('2 Project card', '[Element 1]  Professor\'s element 1 of 5 (slide 8): purpose, scope, technologies and methodologies, schedule')
H2('2.1 Purpose')
P('The purpose is to deliver a simple, reliable and accessible browser calculator, and to document honestly how it was researched, designed, built and verified. The project also trains the skills named in the course outcomes: working in a team, estimating time, leading a small team, and preparing and presenting a project (slide 3 [14]).')
H2('2.2 Scope of work')
P('The calculator has 19 keys: ten digits and a decimal point, four operators, equals, clear (`C`), backspace, and a sign key. It accepts the same operations from the keyboard. It shows the pending operation on a small line above the result, and it shows clear messages for errors. The requirements are listed in Chapter 4 and the exclusions in Section 1.4.')
H2('2.3 Technologies and methodologies')
T('Technologies and methods used', ['Area', 'Choice', 'Note'], [2, 4, 5], [
    ['Application', 'HTML, CSS and plain JavaScript', 'Team choice, not imposed by the professor. Classic scripts (no ES modules), so that the page opens by double-click without a server (decision D2).'],
    ['Unit testing', 'Node.js built-in test runner', 'Command `node --test`. No package is installed.'],
    ['Browser testing', 'A Node script that drives the browsers through their built-in protocols', '`tests/browser-check.js` for Edge, Chrome and Firefox. Playwright was not installed.'],
    ['Version control', 'Git', 'Five local commits. Nothing has been pushed to a remote repository.'],
    ['Diagrams and documents', 'Markdown and Mermaid sources; this Word report', 'The Markdown files are the editable source (decision D5).'],
    ['Project method', 'Project-Based Learning', 'Driving question, iteration with feedback, reflection (slides 12 to 28 [14]).'],
    ['Assistance', 'AI assistant (Claude Code), with several skills', 'Every use is recorded in the tool and AI usage log (Appendix C).'],
], True)
H2('2.4 Schedule')
P('The plan runs from 31 October to 18 December 2026, seven weeks. The table below shows the weekly focus and Figure 1 shows the Gantt chart. The chart was drawn from `docs/01-project-card/gantt.md`; the red line marks the day the chart was drawn.')
T('Weekly plan', ['Week', 'Dates', 'Main focus'], [1, 3, 8], [
    ['W1', '31 Oct - 6 Nov', 'Project card, plan, risks. Class on 6 November'],
    ['W2', '7 - 13 Nov', 'Research, requirements baseline'],
    ['W3', '14 - 20 Nov', 'Design, diagrams, prototype'],
    ['W4', '21 - 27 Nov', 'Engine (test-first), first interface, team retrospective (proposed 27 Nov)'],
    ['W5', '28 Nov - 4 Dec', 'Feature complete, test execution'],
    ['W6', '5 - 11 Dec', 'Bug fixing, code freeze on 9 December, report finished'],
    ['W7', '12 - 18 Dec', 'Buffer, rehearsals, defence on 18 December'],
], True)
IMG(FIG + 'fig-gantt.png', 16, 'Gantt chart of the project plan from 31 October to 18 December 2026', 'Gantt chart of the project plan (source: docs/01-project-card/gantt.md)')
T('Milestones', ['No.', 'Date', 'Milestone', 'Evidence expected'], [1, 2, 5, 5], [
    ['M1', '6 Nov (Fri)', 'Project card and plan reviewed (class day)', 'Reviewed documents, notes'],
    ['M2', '13 Nov (Fri)', 'Requirements baseline', 'Approved requirements specification'],
    ['M3', '20 Nov (Fri)', 'Design and prototype review', 'Diagrams, wireframes'],
    ['M4', '27 Nov (Fri)', 'First working version and team retrospective', 'Running build, retrospective notes'],
    ['M5', '4 Dec (Fri)', 'Feature complete', 'Tests passing for Must items'],
    ['M6', '9 Dec (Wed)', 'Code freeze and test report', 'Test report from real runs'],
    ['M7', '14 Dec (Mon)', 'Documentation complete', 'Final report draft'],
    ['M8', '16 Dec (Wed)', 'Dress rehearsal', 'Rehearsal notes'],
    ['M9', '18 Dec (Fri)', 'Defence', 'Presentation and live demo'],
], True)
H2('2.5 Plan compared with what actually happened')
CALL('**Important.** The schedule above is the plan made on 31 October 2026. The documents, code and tests were all produced on **31 October 2026** by the AI assistant, far ahead of the plan, in four review rounds with the project lead (Section 9.4). That is **not** a record of student work. The students\' own tasks (reviews, human tests, report writing, rehearsals, time log) are still ahead of them and are not shown by the chart. [[Students: add what really happened week by week, with dates, here.]]')
H2('2.6 Success criteria and their present status')
T('Success criteria', ['No.', 'Criterion (project card)', 'Status on 31 October 2026'], [1, 5, 6], [
    ['1', 'Every Must requirement is implemented', 'Done. 15 Must requirements pass the automated tests (Chapter 7). Not yet confirmed by human acceptance testing.'],
    ['2', 'Every planned test has been run with real results recorded', 'Automated tests: done and recorded. Human tests: **PENDING** (Appendix G).'],
    ['3', 'The live demo runs without errors on the defence day', 'Not yet possible to say. [[Students: rehearsal results and the computer used]]'],
    ['4', 'Each member can explain the code and documents they contributed to', '[[Each student: confirm after reading the code walkthrough]]'],
    ['5', 'Documentation reflects what was actually done, including problems', 'Done in the logs and in this report; review by the team **PENDING**.'],
], True)

# ============================================================== 3 ORGANISATION
H1('3 Project organization', 'Supplementary project-management material (slides 5, 32 and 33): organisation, communication, resources, budget')
H2('3.1 Work breakdown structure')
P('The work was divided into seven work packages (WBS level 1). The hours are **planning estimates**, not recorded work. Their total of 198 hours lies inside the planning assumption of about 5 to 6 hours per student per week for seven weeks (175 to 210 person-hours).')
T('Work breakdown structure, level 1', ['WBS', 'Work package', 'Planned effort (h)', 'Lead (provisional)', 'Slide 8 element'], [1, 4, 2, 3, 2], [
    ['1', 'Project management', '20', 'Student 1', '1'], ['2', 'Research and requirements', '28', 'Student 2', '2'], ['3', 'Design and prototype', '32', 'Student 3', '3'],
    ['4', 'Implementation', '40', 'Student 4', '4'], ['5', 'Testing and quality assurance', '30', 'Student 5', '4'], ['6', 'Documentation', '30', 'Student 5 (integration)', '5'],
    ['7', 'Presentation and defence', '18', 'Student 1', '5'], ['', '**Total**', '**198**', '', ''],
], False)
H2('3.2 Responsibilities')
P('Each student leads one area and supports another, so that nothing depends on one person. The roles are **provisional** and have not been confirmed by the students.')
T('Provisional responsibility by work package (L = lead, S = support, R = reviewer)', ['WBS', 'Work package', 'S1', 'S2', 'S3', 'S4', 'S5'], [1, 5, 1, 1, 1, 1, 1], [
    ['1', 'Project management', 'L', 'R', '', '', 'S'], ['2', 'Research and requirements', 'S', 'L', 'R', '', ''], ['3', 'Design and prototype', '', 'S', 'L', 'R', ''],
    ['4', 'Implementation', '', '', 'S', 'L', 'R'], ['5', 'Testing and QA', '', 'S', '', 'R', 'L'], ['6', 'Documentation', 'S', 'S', 'S', 'S', 'L'], ['7', 'Presentation and defence', 'L', 'S', 'S', 'S', 'S'],
], False)
NOTE('**Reality note.** The Phase 1 plan assigned code contributions to students. In fact, the code was written by the AI assistant. The students\' real role is now to review, understand, verify and explain the work, and to write the report. [[Students: describe who actually did what, in your own words.]]')
T('Student roles and names', ['Student', 'Provisional lead area', 'Name'], [2, 6, 4], [
    ['Student 1', 'Project management, project card, schedule', '[[STUDENT 1 NAME]]'], ['Student 2', 'Research, requirements, literature review', '[[STUDENT 2 NAME]]'],
    ['Student 3', 'UI/UX design, architecture, diagrams, prototype', '[[STUDENT 3 NAME]]'], ['Student 4', 'Engine, implementation, code quality', '[[STUDENT 4 NAME]]'],
    ['Student 5', 'Testing, quality assurance, documentation integration', '[[STUDENT 5 NAME]]'],
], True)
H2('3.3 Communication and meetings')
P('The team communication and meeting rules are a **proposal that the team has not yet agreed** (document `team-communication-rules.md`). The main ideas are listed below.')
B(['Decisions count only when they are written in the decision log; a chat message alone is not a decision.',
   'A weekly check-in of 30 to 45 minutes, a milestone review at each milestone, and a midpoint retrospective (proposed for 27 November).',
   'Meeting notes are written only for real meetings and saved with the real attendees.',
   'Every change is reviewed by another member; small, frequent commits; no secrets in the repository.',
   'Disagreements are decided by agreement, then by vote; the project manager decides a tie.'])
P('Facts the team must supply: the chat tool [[CHAT TOOL NAME]], the weekly meeting day and time [[MEETING DAY AND TIME]], and whether meetings are in person or online [[MEETING FORM]]. Meetings actually held: [[LIST OF REAL MEETINGS WITH DATES AND ATTENDEES, or "none yet"]].')
H2('3.4 Resources, effort, cost and expenses')
T('Resources', ['Resource', 'Detail'], [3, 8], [
    ['People', 'Five students.'],
    ['Equipment', "The team members' own computers and current browsers (Microsoft Edge, Google Chrome, Mozilla Firefox). No purchases are recorded in the project documents."],
    ['Software', "Node.js, Git, a text editor, the three browsers. All free to use. One program was installed during the project: Firefox 159.0, from the official Mozilla download, with the project lead's approval."],
], True)
P('Effort, financial cost and expenses are three different quantities. They are kept apart in this report and no figure was invented.')
T('Effort estimate, financial cost estimate and actual expenses', ['Quantity', 'What it means', 'Status on 31 October 2026'], [3, 5, 6], [
    ['Effort estimate (planned)', 'Person-hours of work planned in the work breakdown structure (Section 3.1).', '198 person-hours, about 40 per student. A planning estimate, not a measurement.'],
    ['Actual effort', 'Hours really worked, taken from the time log (Section 3.5).', 'None recorded. [[ACTUAL HOURS PER STUDENT, from the time log]]'],
    ['Financial cost estimate', 'The money the project would cost if the work were paid: hours multiplied by an hourly rate, plus equipment and licences.', 'Not prepared. No hourly rate was given. [[Team: decide with the professor whether a cost estimate with an hourly rate is expected (slide 32, item 10).]]'],
    ['Actual expenses', 'Money that was really spent on the project.', 'None are recorded in the project documents. [[Students: confirm that no money was spent, or list the real expenses]]'],
], True)
H2('3.5 Records of working time')
P('The professor\'s list asks for records of the working time of each member, kept by the project manager (slide 32, item 5 [14]). The time log exists as an **empty template**. No hours have been recorded, and none were invented. The weekly table is repeated in Appendix I.')

# ============================================================== 4 LITERATURE REVIEW
H1('4 Literature and assumption review', '[Element 2]  Professor\'s element 2 of 5 (slide 8): analysis of existing solutions and collection of requirements')
H2('4.1 Method and honest limits')
P('The AI assistant studied three existing basic calculators by reading their official documentation and, where it is public, their source code. The sources were fetched with web tools on 31 October 2026 and every quoted fact was checked again against the raw pages. The references are in Chapter 12.')
CALL('**What this review is not.** No user research was done (no interviews, surveys or usability tests). The team members did not use the three calculators hands-on for this review, and the code of the open-source calculator was read but **not run**. Statements about it that come from reading code are marked "inferred". A short hands-on session by the students is proposed but **not done** [[Students: hands-on notes, with names and dates, if you do it]].')
H2('4.2 The three calculators')
T('The products studied', ['Product', 'What it is', 'Why it was chosen'], [3, 5, 5], [
    ['A. Windows Calculator (Microsoft) [1][2][3]', 'The calculator of Windows, open source (MIT licence). Standard mode, with other modes and converters.', 'A mature, widely used calculator. Its public source lets the review check behaviour and accessibility strings.'],
    ['B. Google Search calculator [4]', 'A calculator inside Google Search, described in Google\'s help page.', 'Many people meet it on the web. It shows a typed-expression model.'],
    ['C. Mar-Issah JavaScript-Calculator [5]', 'A small open-source calculator in HTML, CSS and plain JavaScript (MIT licence).', 'Same technology as this project. One example only, found by a web search; not a representative sample.'],
], True)
T('Comparison of the three calculators', ['Criterion', 'A. Windows (Standard)', 'B. Google', 'C. Open-source JS'], [2, 4, 4, 4], [
    ['Functionality', 'Basic operations plus modes, history, memory, converters [1]', 'Arithmetic and much more, including graphing [4]', 'Four operations, clear, delete, decimal [5]'],
    ['Evaluation model', 'Immediate execution in Standard mode [1]', 'Not documented', 'Immediate execution [5]'],
    ['Precision', 'Infinite precision for the four basic operations [1]', 'Not documented', 'Plain JavaScript numbers, no rounding [5]; float noise likely (inferred)'],
    ['Input', 'Buttons, keyboard, shortcuts [3]', 'Typed expression in the search box [4]', 'Buttons only; no keyboard handler [5]'],
    ['Input handling', 'Not examined in detail', 'Not documented', 'Ignores a second decimal point; ignores a second operator [5]'],
    ['Error handling', 'Messages such as "Calculation failed" [3]; text for 5 ÷ 0 in Standard mode not confirmed', 'The calculator does not appear for 7*9/0 [4]', 'No division-by-zero check [5]; `Infinity` or `NaN` likely (inferred)'],
    ['Accessibility', 'Screen-reader text such as "Display is %1" and "Minus" [3]', 'Not documented', 'No labels, no live region [5]'],
    ['Reuse', 'MIT, but too large to reuse [2]', 'Not reusable', 'MIT [5]. Not reused: the code of this project was written separately by the AI assistant.'],
], True)
H2('4.3 Design lessons')
T('Lessons from the review and what the project did with them', ['No.', 'Lesson', 'Decision taken'], [1, 6, 5], [
    ['L1', 'Windows Standard mode and the open-source example use immediate execution [1][5].', 'Keep immediate execution (D1): `2 + 3 × 4 =` gives 20. Say so in the help text.'],
    ['L2', 'Windows uses infinite precision [1]; the open-source example does not round at all.', 'An explicit number policy is needed (Section 5.5).'],
    ['L3', 'The open-source example has no division-by-zero check [5]; Google shows no result for it [4].', 'Division by zero is a defined state with a message and a way out.'],
    ['L4', 'The open-source example ignores a second operator [5].', 'Chosen: the second operator replaces the first.'],
    ['L5', 'The decimal-point rule must apply per number, not per calculation [5].', 'Reset the check when a new number starts; test `1.5 + 2.5`.'],
    ['L6', 'The open-source example has no keyboard support; WCAG 2.1.1 asks for full keyboard operation [5][9].', 'Keyboard input is a Must requirement.'],
    ['L7', 'The open-source example has unnamed buttons; Windows reads "-" as "Minus" [3][5]; WCAG 4.1.2 [12].', 'Every key has an accessible name in words.'],
    ['L8', 'Windows announces the display as "Display is %1" [3]; WCAG 4.1.3 [13].', 'The display is a live region (`<output>`).'],
    ['L9', 'Windows shows shortcuts in tooltips [3].', 'A short visible "Keyboard" help.'],
    ['L10', 'The other calculators offer far more than basic arithmetic [1][4].', 'Do not copy features: the professor asks for "very simple".'],
    ['L11', 'Google has no keypad and uses a typed expression [4].', 'The assignment is a button calculator that also accepts keys.'],
], True)
H2('4.4 Requirements')
P('The requirements were refined three times (v0.1 to v0.3) after the review and after the project lead\'s decisions. Priorities use MoSCoW: M must, S should, C could, W won\'t. Every requirement that was built has a named automated test (Appendix A).')
fr = [
 ['FR-01', 'Enter digits 0 to 9 with buttons; a leading zero is not repeated', 'M'], ['FR-02', 'One decimal point per number', 'M'], ['FR-03', 'Addition, subtraction, multiplication, division', 'M'],
 ['FR-04', 'Equals shows the result; a digit starts a new number; an operator continues from the result', 'M'], ['FR-05', 'Chained operations use immediate execution (`2+3×4=` gives 20)', 'M'],
 ['FR-06', 'Clear resets everything, including an error', 'M'], ['FR-07', 'Backspace deletes the last digit; a single digit becomes 0', 'M'], ['FR-08', 'A second operator replaces the first', 'M'],
 ['FR-09', 'Division by zero shows a clear message and the calculator recovers', 'M'], ['FR-10', 'Controlled display rounding; the stored value is never rounded (decision D3)', 'M'],
 ['FR-11', 'Very large and very small results are shown correctly; overflow and underflow are reported', 'M'], ['FR-12', 'Number entry is limited to 12 digits', 'M'],
 ['FR-13', 'Keyboard input; a comma works as a decimal point', 'M'], ['FR-14', '~~Percent~~ Retired on 31 Oct 2026 (decision D10); now out of scope', 'W'],
 ['FR-15', 'Sign toggle; zero stays 0', 'M'], ['FR-16', 'A small line shows the pending operation', 'S'], ['FR-17', 'Session history of calculations', 'C (not built)'],
 ['FR-18', '`=` with nothing pending, or an operator without a second number, is safe; no repeat-equals', 'M'],
]
fr = [[a, b.replace('~~Percent~~ ', 'Percent function. '), c] for a, b, c in fr]
T('Functional requirements (requirements specification v0.3)', ['ID', 'Requirement', 'Priority'], [1, 9, 2], fr, True)
nfr = [
 ['NFR-01', 'Correctness', 'Every planned test passes; every requirement is linked to at least one test'], ['NFR-02', 'Reliability', 'The display never shows `NaN`, `Infinity` or `undefined`; random key sequences cause no crash'],
 ['NFR-03', 'Usability', 'A first-time user can calculate without instructions; keys are at least 48 x 48 CSS px (design value)'], ['NFR-04', 'Accessibility', 'WCAG 2.1 AA checks: keyboard, focus, names, live display, contrast, reduced motion'],
 ['NFR-05', 'Compatibility', 'Edge, Chrome and Firefox; no horizontal scrolling at 320 CSS px'], ['NFR-06', 'Security', 'No `eval` or `Function`; no `innerHTML` with dynamic data; no outside scripts; a restrictive Content Security Policy'],
 ['NFR-07', 'Portability', 'Runs by opening `src/index.html`, with no build step or server'], ['NFR-08', 'Maintainability', 'Calculation separate from the interface; changes reviewed by a second member'],
 ['NFR-09', 'Legal and ethical', 'Only original or licensed code; no personal data; AI assistance recorded'],
]
T('Non-functional requirements', ['ID', 'Category', 'Requirement'], [1, 2, 9], nfr, True)
P('**Out of scope** (decided): scientific functions, memory keys, history and themes, backend, installable app, conversions, other languages, the percent key, repeat-equals, and snapping tiny results to zero.')
H2('4.5 Standards used and a correction')
T('WCAG criteria used (read from the W3C pages)', ['Criterion', 'Level', 'Threshold or rule', 'Ref.'], [4, 2, 6, 1], [
    ['1.4.3 Contrast (Minimum)', 'AA', 'Text contrast at least 4.5:1 (large text 3:1)', '[6]'], ['1.4.10 Reflow', 'AA', 'No two-dimensional scrolling at 320 CSS px width', '[7]'],
    ['1.4.11 Non-text Contrast', 'AA', 'Interface components at least 3:1', '[8]'], ['2.1.1 Keyboard', 'A', 'All functionality operable through a keyboard interface', '[9]'],
    ['2.5.5 Target Size (Enhanced)', 'AAA', '44 by 44 CSS pixels', '[10]'], ['2.5.8 Target Size (Minimum)', 'AA (WCAG 2.2)', '24 by 24 CSS pixels (with exceptions)', '[11]'],
    ['4.1.2 Name, Role, Value', 'A', 'Name and role can be determined by software', '[12]'], ['4.1.3 Status Messages', 'AA', 'Status messages can be determined without receiving focus', '[13]'],
], True)
P('**A correction made during the project.** The first plan treated a 44 px touch target as a Level AA rule. Reading the W3C pages showed that 44 px belongs to Level AAA (criterion 2.5.5) and that the AA minimum is 24 px (criterion 2.5.8 in WCAG 2.2). The keys are still designed at 48 px because large keys are good for touch use, but this is no longer called an AA requirement.')
H2('4.6 Assumptions and limits')
B(['**Users (assumed, not validated):** anyone who needs quick everyday arithmetic, on a laptop with keyboard or on a phone with touch.',
   'The sources were read on 31 October 2026 and may change. One Windows resource file is very long (about 275,000 characters); it was searched for the strings quoted here only.',
   'A student must still open every URL and confirm the facts [[Student 2: confirmation, with date]].'])

# ============================================================== 5 DESIGN
H1('5 Design and prototyping', '[Element 3]  Professor\'s element 3 of 5 (slide 8): application architecture, schematics, first versions of code or models')
H2('5.1 Design goals and constraints')
T('Constraints that shaped the design', ['Constraint', 'Effect on the design'], [5, 7], [
    ['The page must open by double-click, offline (NFR-07, decision D2)', 'Classic `<script>` files, no ES modules, no packages at run time'],
    ['The calculation must be testable without a browser (NFR-08)', 'The calculation code never touches the page: no `document`, no `window`'],
    ['Five students and seven weeks', 'Few files and few ideas, easy to explain in ten minutes'],
    ['Correct results are the heart of the project', 'Number and state rules are written down before the code'],
], True)
H2('5.2 Application architecture')
P('The program has **two layers**. The **interface layer** is everything the user sees or touches: the HTML page, the CSS style sheet, and two small scripts (`keymap.js` and `app.js`). The **calculation layer** has two scripts that do the thinking: `engine.js` holds the rules of the calculator, and `format.js` turns numbers into display text. Figure 2 shows how they are connected.')
IMG(FIG + 'fig-architecture.png', 16, 'Architecture diagram with the interface layer, the calculation layer and the tests', 'Application architecture: the calculation layer never touches the page')
P('The separation has three benefits. The rules can be tested from the command line with thousands of key sequences and no browser. A change of colours or layout cannot break the rules. And two students can work on different layers without editing the same file. The tests are not part of the product; they call the calculation files directly.')
T('Modules and their interfaces', ['Module', 'Public interface', 'Rule'], [2, 5, 6], [
    ['`engine.js`', '`initialState()` and `press(state, key)`', 'Pure: never changes the state it receives, no clock, no randomness, no page code, no `eval`'],
    ['`format.js`', '`formatNumber(value)` and `display(state)`', 'Pure. Contains the display rules of section 5.5'],
    ['`keymap.js`', '`commandForKey(event)`', 'Pure. Returns a key name or nothing. Ignores keys with Ctrl, Alt or Meta'],
    ['`app.js`', 'none (runs on page load)', 'The only file that touches the page. Holds one variable with the current state'],
], True)
P('The engine understands 19 key names: the digits `0`-`9`, `.`, `+`, `-`, `*`, `/`, `=`, `CLEAR`, `BACKSPACE` and `NEGATE`. Any other key name is ignored. The state is a small frozen object with five fields: `phase`, `entry` (the digits typed, kept as text), `accumulator` (the stored number), `operator` and `error`.')
H2('5.3 Data-flow diagram')
P('A data-flow diagram shows how information moves. Figure 3 is the level-1 diagram. A click or key press is captured, translated to a key name, applied to the state by the engine, formatted as text, and drawn on the page. The state (D1) is one variable in memory; it is never saved or sent anywhere, so the calculator collects no personal data.')
IMG(FIG + 'fig-dfd.png', 12.5, 'Level-1 data-flow diagram with five processes and one data store', 'Level-1 data-flow diagram')
H2('5.4 State diagram')
P('The calculator is in one of five situations (states). The same key means different things in different states, so the rules are drawn as a state diagram (Figure 4).')
IMG(FIG + 'fig-state.png', 16, 'State diagram with five states: Ready, Entering, OperatorPending, Result and Error', 'State diagram of the calculator')
T('The five states', ['State', 'Meaning', 'Display shows'], [3, 5, 5], [
    ['Ready', 'Just started or cleared', '`0`'], ['Entering', 'The user is typing a number', 'The digits typed so far'],
    ['OperatorPending', 'An operator was pressed; waiting for the second number', 'The left number; the small line shows, for example, `7 +`'],
    ['Result', 'An answer is on the screen after `=`', 'The result'], ['Error', 'Division by zero, overflow or underflow', '`Error` and a message line'],
], True)
P('The most important rules, each tested automatically:')
B(['**Immediate execution (D1).** With an operation pending, a new operator first calculates it. `2 + 3 ×` shows 5, then `4 =` gives 20.',
   '**Second operator replaces the first (FR-08).** `5 + ×` becomes `5 ×`.',
   '**Safe equals (FR-18).** `=` in Ready, in OperatorPending or after a result changes nothing.',
   '**Errors recover (FR-09).** In Error only a digit, a point or Clear is accepted.',
   '**12-digit limit (FR-12), one decimal point (FR-02), zero stays zero (FR-15).**'])
H2('5.5 Number policy: rounding and display (decision D3)')
P('Computers store most decimals approximately. In JavaScript, `0.1 + 0.2` is `0.30000000000000004`. Showing that would confuse users; hiding it carelessly could change results. The policy:')
B(['The engine keeps the **full numeric result** and never rounds it.', 'Only the **display text** is formatted: at most 12 significant digits, trailing zeros removed, exponential notation for very large and very small numbers (outside 0.0001 to 999999999999).',
   'A non-zero number is never shown as `0`. Division by zero, overflow and underflow give an error state with a message.'])
T('Options for the number policy that were compared', ['Option', 'Idea', '`0.1+0.2-0.3`', '`(1÷3)×3-1`', 'Decision'], [4, 5, 3, 3, 4], [
    ['**A. Keep the raw result** (decision D3)', 'Never change the stored number', '`5.55111512313e-17`', '`0`', '**Adopted**'],
    ['B. Normalise to 15 digits after each step', 'Store `Number(r.toPrecision(15))`', '`0`', '`-9.99e-16`', 'Not adopted: fixes one case, breaks another'],
    ['D. Snap tiny add or subtract results to zero', 'Result 0 if tiny compared with the operands', '`0`', '`0`', 'Rejected by the project lead (D9)'],
    ['E. Exact decimal arithmetic for + - ×', 'Scaled integers (BigInt)', '`0`', '`-1e-16`', 'Rejected for now (D17)'],
    ['F. Decimal library', 'External dependency', '`0`', '(depends)', 'Rejected: conflicts with offline, no-dependency rule'],
], False)
P('The consequence is a **known and documented limit**: `0.1 + 0.2 - 0.3` shows `5.55111512313e-17`, because the stored value of `0.1 + 0.2` is slightly above 0.3. This behaviour has its own test. A measured comparison of options A and E is in Section 7.7.')
H2('5.6 User interface design and prototype')
P('The interface is a standard calculator grid: four columns and five rows, with a double-width zero, giving 19 keys. Function keys are grey, operators light blue, digits white, and the equals key is the only strong accent. The display has a fixed height so that the keys never move when an error message appears.')
IMG(EVI + '2026-10-31-visual-prototype-desktop.png', 16, 'Static visual prototype showing three frames: typing, error and a narrow phone frame', 'Static visual prototype (does not calculate): typing, error state and a 320 px frame')
T('Design choices for the interface', ['Topic', 'Choice'], [3, 9], [
    ['Colours', 'Light grey and blue. Text `#111827`, secondary text `#4B5563`, equals key `#1D4ED8` with white text; no dark mode (decision D15).'],
    ['Type', 'System font stack (no web fonts, so it works offline); display font steps down for long numbers.'],
    ['Keys', 'Real `<button>` elements, at least 48 x 56 px, 8 px gap.'],
    ['Focus', 'A 3 px dark ring, 3 px away from the key, on keyboard focus.'],
    ['Names', 'Words for symbols: "Times", "Divided by", "Minus", "Plus", "Equals", "Decimal point", "Clear", "Delete last digit", "Change sign".'],
    ['Live display', 'The display is an `<output>` element with `aria-live="polite"`; the error line has `role="alert"`.'],
    ['Motion', 'No animation; a reduced-motion rule is included.'],
], True)
T('Keyboard map', ['Physical key', 'Action'], [4, 8], [
    ['`0`-`9` (main row and numeric keypad)', 'Digit'], ['`.` or `,`', 'Decimal point (the comma is an alias; the display always shows a period)'],
    ['`+` `-` `*` `/`', 'Operators'], ['`Enter` or `=`', 'Equals (but `Enter` on a focused button presses that button)'], ['`Backspace`', 'Delete the last digit'], ['`Escape`', 'Clear'],
    ['`Tab`, `Shift+Tab`, `Space`', 'Move between keys and press the focused key (browser behaviour)'], ['Keys with Ctrl, Alt or Meta', 'Not taken; browser shortcuts keep working'],
], True)
T('Colour contrast of the design (calculated with a script)', ['Element', 'Foreground / background', 'Ratio', 'Required'], [4, 5, 2, 2], [
    ['Main display text', '`#111827` on `#F3F5F9`', '16.25 : 1', '4.5 : 1'], ['Expression line', '`#4B5563` on `#F3F5F9`', '6.92 : 1', '4.5 : 1'], ['Operator key text', '`#1E3A8A` on `#DCE6FB`', '8.26 : 1', '4.5 : 1'],
    ['Equals key text', '`#FFFFFF` on `#1D4ED8`', '6.70 : 1', '4.5 : 1'], ['Error text', '`#B91C1C` on `#F3F5F9`', '5.93 : 1', '4.5 : 1'],
    ['Key border on panel', '`#6B7280` on `#F3F5F9`', '4.43 : 1', '3 : 1'], ['Focus ring on panel', '`#111827` on `#F3F5F9`', '16.25 : 1', '3 : 1'],
], False)
H2('5.7 Alternatives considered')
T('Alternatives and why one was chosen', ['Decision', 'Chosen', 'Alternatives', 'Reason'], [3, 4, 4, 6], [
    ['Evaluation model', 'Immediate execution', 'Operator precedence with a parser', 'Windows Standard mode and the open-source example do the same; simpler state machine'],
    ['Calculation model', 'State machine over key presses', 'Build a text expression and evaluate it', 'No `eval` or parser; every situation is testable'],
    ['Code structure', 'Pure engine and formatter, interface glue', 'One mixed script; a framework', 'Testable without a browser; no dependency; fewer ideas'],
    ['Loading', 'Classic scripts', 'ES modules', 'Modules fail from `file://` in some browsers; risk for the live demo'],
    ['State', 'One frozen object, replaced on each key', 'Several global variables', 'Easier to test; bugs are easier to find'],
    ['Number entry', 'Keep the typed text', 'Keep a number while typing', 'Text keeps `0.` and `1.50` and the 12-digit limit exactly'],
    ['Prototype', 'Static HTML and Markdown wireframe', 'Figma', 'Lives in Git; no account (decision D13)'],
    ['Diagrams', 'Data-flow and state diagram', 'Class diagram', 'Few objects; behaviour is the hard part (decision D4)'],
], True)

# ============================================================== 6 IMPLEMENTATION
H1('6 Implementation', '[Element 4]  Professor\'s element 4 of 5 (slide 8): creating the final solution (this chapter) and its verification (Chapter 7)')
H2('6.1 Application components')
T('Files of the application', ['File', 'Lines', 'Responsibility'], [4, 1, 8], [
    ['`src/index.html`', str(LC['src/index.html']), 'The page: 19 buttons, the display, the help text, the Content Security Policy'],
    ['`src/css/styles.css`', str(LC['src/css/styles.css']), 'Colours, layout, focus ring, reduced motion'],
    ['`src/js/engine.js`', str(LC['src/js/engine.js']), 'The rules: states, key handling, arithmetic, errors'],
    ['`src/js/format.js`', str(LC['src/js/format.js']), 'Display text: significant digits, notation, error messages'],
    ['`src/js/keymap.js`', str(LC['src/js/keymap.js']), 'Which physical keys the calculator uses'],
    ['`src/js/app.js`', str(LC['src/js/app.js']), 'Connects buttons and keys to the engine and draws the result'],
], True)
P('The whole application is about 350 lines of JavaScript (about 240 without comments and blank lines) in four files. There is no framework and no package. The line counts include comments.')
H2('6.2 Development process')
P('The work was done in four phases on 31 October 2026, each ending with the project lead\'s review (Section 9.4):')
T('Phases and local Git commits', ['Phase', 'Content', 'Commit'], [2, 8, 4], [
    ['1', 'Project initialisation: project card, requirements v0.1, WBS, Gantt, responsibility matrix, risk register, decision log, tool log', '`9501afb docs: initialize specialization calculator project`'],
    ['2', 'Research and design: calculator review, requirements v0.3, architecture, UI design, static prototype', '`2784c9a docs: add phase 2 research and design`'],
    ['3', 'Implementation: engine, formatter, key map, page, tests written first', '`602e34a feat: implement and test basic calculator`'],
    ['4', 'Quality assurance: negative-zero bug fix, boundary and accessibility tests, Chrome and Firefox, security analysis', '`c76489f test: add QA tests and fix negative-zero entry bug`'],
    ['5 (planning)', 'Report outline, presentation plan, acceptance checklist; documentation audit', '`ac3fd76 docs: prepare final report and presentation plans`'],
], True)
P('**Test-first.** For the engine, the tests were written before the code and were seen to fail (all test files failed because the source files did not exist). The code was then written until they passed. The same method was used to fix the bug described in Section 7.5. The Superpowers test-driven-development skill was not available, so the steps were followed by hand.')
H2('6.3 Important design decisions')
P("The principal decisions are: immediate execution (D1), classic scripts so that the page opens from `file://` (D2), display-only rounding with the full value kept (D3, confirmed on 31 October), data-flow and state diagrams instead of a class diagram (D4), the percent key removed (D10), keyboard input as a Must with a comma alias (D12), separate engine, formatter and interface (D14) and the sign key kept (D16). Two options were rejected: snapping tiny results to zero (D9) and exact decimal arithmetic (D17). The summary table is in Appendix B; the full text is in the decision log.")
H2('6.4 Selected code examples')
P('Four short excerpts of the source are reproduced without change in Appendix K: the calculation of two numbers, the number formatting, the key map and the fix for the negative-zero bug. The engine reports errors instead of returning `Infinity` or `NaN`; the formatter chooses the notation from the rounded value and never shows a non-zero value as 0; the key map only reads the event and never takes keys with Ctrl, Alt or Meta.')
H2('6.5 The finished application')
ROW([{'path': FIG + 'shot-edge-typing.png', 'widthCm': 4.3, 'alt': 'Calculator after typing 7 plus 8'}, {'path': FIG + 'shot-edge-result.png', 'widthCm': 4.3, 'alt': 'Calculator showing the result 20'}, {'path': FIG + 'shot-edge-error.png', 'widthCm': 4.3, 'alt': 'Calculator showing the division by zero error'}],
    'The calculator in Microsoft Edge: after typing 7 + 8 (the small line shows the pending operation), after 2 + 3 × 4 = (result 20, immediate execution), and after 5 ÷ 0 = (error message)')
ROW([{'path': FIG + 'shot-edge-focus.png', 'widthCm': 4.3, 'alt': 'Calculator with the keyboard focus ring on the 7 key'}, {'path': FIG + 'shot-edge-exponent.png', 'widthCm': 4.3, 'alt': 'Calculator showing 9.99999999998e+23'}, {'path': FIG + 'shot-firefox-error.png', 'widthCm': 4.3, 'alt': 'The same error screen in Mozilla Firefox'}],
    'Keyboard focus ring on the 7 key (Edge); a very large result in exponential notation (Edge); the same error screen in Mozilla Firefox 159')
P('All screenshots are real captures of the application made on 31 October 2026 by the test tool. The application runs by double-clicking `src/index.html`; no installation is needed.')
H2('6.6 Who did what')
CALL('The code in `src/` and `tests/` was written by the AI assistant (Claude Code). The project lead gave instructions and approved each phase. The five students\' own contributions to the implementation are **not yet recorded**. [[Students: for each file, write who read it, who reviewed it, and what each student can explain. Do not claim authorship of code you did not write.]]')

# ============================================================== 7 TESTING
H1('7 Testing and verification', '[Element 4]  Professor\'s element 4 of 5 (slide 8): its verification')
H2('7.1 Test approach and who verified what')
T('Kinds of verification', ['Kind', 'What it covers', 'Status on 31 October 2026'], [3, 7, 4], [
    ['**Automated checks**', 'Calculation rules, display text, key map, source-code rules, contrast, behaviour in three browsers, layout, zoom, offline, CSP', '**Done. All pass**, with the skips in Section 7.3'],
    ['**AI review** (not independent)', 'Code review, security analysis, floating-point study, screen-reader investigation', 'Done by the AI; needs human confirmation'],
    ['**Human verification**', 'Screen reader, Lighthouse, real phone, a person using only the keyboard, Firefox keyboard focus, first-time users, independent code review, re-running the tests', '**PENDING.** Not done'],
], False)
P('The test plan follows the usual test pyramid: many fast **unit tests** (Node.js built-in runner), some **static checks** of the source code, a smaller set of **browser checks** in real browsers, and a **manual** level for what a program cannot judge. The tests were written first. Every test name starts with the ID of the requirement it checks (for example `T-FR-05`), and a script fails if an active requirement has no test.')
H2('7.2 Environment')
T('Test environment', ['Item', 'Value'], [3, 9], [
    ['Date', '31 October 2026'], ['Run by', 'The AI assistant, in the project lead\'s session. **No student has run the tests yet.**'], ['Computer', 'Windows 11; Node.js v24.21.0'],
    ['Browser 1', 'Microsoft Edge 156.0.4314.50 (headless)'], ['Browser 2', 'Google Chrome 156.0.8078.74 (headless). Same engine family as Edge, so not independent of it'],
    ['Browser 3', 'Mozilla Firefox 159.0 (headless), installed from the official Mozilla download with the project lead\'s approval'],
    ['How the page is opened', 'Directly from its local file, `file:///.../src/index.html`; no server'], ['Not tested', 'Safari, mobile browsers, any real phone, any real screen reader'],
], True)
H2('7.3 Results')
T('Final quality gate (31 October 2026)', ['Command', 'Result'], [6, 6], [
    ['`node --test`', '**88 passed, 0 failed** (engine 40, format 10, keymap 9, security 6, boundary 17, accessibility 6); 0.45 s'],
    ['`node tests/browser-check.js` (Edge)', '**102 passed, 0 failed**'], ['`node tests/browser-check.js` (Chrome)', '**102 passed, 0 failed**'],
    ['`node tests/browser-check.js --firefox`', '**88 passed, 0 failed, 11 skipped** (reasons below)'],
    ['`node tests/docs-check.js --require-tests`', 'Passed, 0 errors: links, requirement IDs, test counts, screenshot hashes agree'],
], False)
P('The table in Appendix J shows, area by area, what the browser checks cover in each browser.')
P('**Why 11 checks are skipped in Firefox.** The automated Firefox window never receives keyboard focus (`document.hasFocus()` is false). A plain page with one button behaves the same way, so this is a property of the automated window, not a calculator problem. Eight focus-dependent checks are therefore skipped, together with three checks that need a Chromium-only command. **The keyboard-focus behaviour of the calculator in Firefox is not verified.** A person must test it in a normal Firefox window (Appendix G, AT-17, AT-18, AT-20).')
H2('7.4 Requirement coverage')
T('Coverage after Phase 4', ['Requirements', 'Automated result', 'Not verified'], [4, 6, 5], [
    ['FR-01 to FR-12, FR-15, FR-16, FR-18', 'Unit, boundary and browser tests pass in Edge, Chrome and Firefox', 'Real users'],
    ['FR-13 Keyboard', 'Unit (key map) and browser typing pass in all three; keyboard-only script passes in Edge and Chrome', 'Focus behaviour in Firefox; a person using only the keyboard'],
    ['FR-14 (retired), FR-17 (not built)', 'Unknown keys, including `%`, are ignored', ''],
    ['NFR-02 Reliability', 'About 970,000 random key presses (unit) and 1,000 per browser', ''],
    ['NFR-03 Usability', 'Key size measured: at least 61 x 56 px at 320 px width', 'A first-time-user check'],
    ['NFR-04 Accessibility', 'Contrast, names, roles, live-region properties, focus order, keyboard-only script', 'Screen reader, Lighthouse, human keyboard test, Firefox focus'],
    ['NFR-05 Compatibility', '320, 360, 768, 1280 px; zoom 200 % and 400 %; text 150 % and 200 % in three browsers', 'Real devices; Safari'],
    ['NFR-06 Security, NFR-07 Portability', 'Static scan; CSP enforced in all three; no network; opens from `file://`', 'Independent human review'],
    ['NFR-08 Maintainability, NFR-09 Legal', 'Purity and separation tests; tool log kept', 'Independent review; human inspection'],
], False)
H2('7.5 The negative-zero bug: found, fixed and tested')
P('During the Phase 4 code review, the AI assistant tried unusual key sequences and found a defect that all 65 tests of Phase 3 had missed. After typing `0.5`, pressing the sign key and then backspace twice, the display showed `-0`; typing `7` next showed `-07` instead of `7`.')
T('Bug report BUG-1', ['Field', 'Content'], [3, 9], [
    ['Keys', '`0` `.` `5` `±` `⌫` `⌫` then `7`'], ['Expected', '`0` after the backspaces; `7` after the digit'], ['Actual', '`-0`, then `-07`'],
    ['Cause', 'Backspace handled an empty entry and a lone minus sign but not `-0`; a new digit replaced only an entry equal to `0`; the sign key refused to touch any zero entry, so a typed `-0.` could not lose its minus sign'],
    ['Fix', 'Backspace turns `-0` into `0`; the sign key may remove the minus from a typed `-0.`; one helper, `numberFromEntry`, converts an entry to a number and never returns `-0`'],
    ['Regression tests', 'Four tests named BUG-1 in `boundary.test.js`, and a random test that every typed entry has a valid shape (no `-0`, no leading zero) over about 410,000 key presses'],
    ['Method', 'The failing tests were written first (red), then the fix (green): 88 of 88 pass afterwards'],
], True)
P('The code of the fix, as it is in the source file, is reproduced in Appendix K (K.4).')
P('The lesson is that tests only check what someone thought of. The random test of the entry shape found the bug independently of the hand-written cases. The bug and the other mistakes found in tests and documents (for example a "400 % zoom" check that passed without testing anything because the keys were off-screen) are listed in Appendix F.')
H2('7.6 Boundary tests and a mutation check')
B(['**Boundaries:** a 500-digit input is cut to 12 digits; 5,000 chained additions; repeated multiplication by 10 overflows at exactly the 309th step (last good value `1e+308`); repeated halving underflows after exactly 1,074 good steps and the last good value is `4.94065645841e-324`, never `0`.',
   '**Reference model:** 2,000 random chains of operations give exactly the same results as plain left-to-right JavaScript arithmetic.',
   '**Transition table:** every key in every state moves to the state the design says (42 cases).',
   '**Mutation check:** 16 deliberate bugs were injected one at a time into a scratch copy; **15 of 16 were caught** by `node --test`. The one miss (focus not released after a mouse click) is covered by a browser check instead.'])
H2('7.7 The floating-point investigation')
P('The project lead asked in Phase 4 for a comparison of reasonable options, without silently turning genuinely small values into zero. A scratch study compared option A (raw numbers, adopted) with option E (exact decimal arithmetic for +, -, ×) on 5,000 random chains of four typed numbers.')
T('Option A compared with option E', ['Measure', 'A (adopted)', 'E (exact decimals)'], [5, 5, 5], [
    ['Display differs from the exact 12-digit answer', '2 of 5,000 (0.04 %); both differ in the 12th digit of a long product', '0 of 5,000'],
    ['Chains whose exact answer is 0', '11; A shows `0` in all 11', '`0` in all 11'], ['`0.1 + 0.2 - 0.3`', '`5.55111512313e-17`', '`0`'],
    ['`1 ÷ 3 × 3 - 1`', '`0`', '`-1e-16` (a new artifact)'], ['`1e-20 + 2e-20` (genuinely small)', '`3e-20`', '`3e-20`'], ['Cost', 'None', 'About 40 more lines and tests'],
], True)
P('Neither option is perfect. The project lead kept option A (decision D3) and rejected D17. No change was made to the arithmetic. If acceptance testing shows that the `0.1 + 0.2 - 0.3` display is unacceptable, the decision can be reopened.')
H2('7.8 Accessibility assessment')
B(['**Contrast:** all colour pairs pass (Section 5.6). A unit test now reads the real colours from the style sheet and checks the ratios, so a later colour change cannot break contrast unnoticed.',
   '**Keyboard:** every key is a real button; Tab order equals the visual order (checked in all three browsers); a calculation typed with Tab, Shift+Tab, Space and Enter alone gives the right answer in Edge and Chrome.',
   '**Names and roles:** the accessibility tree has 19 named buttons; the display is a polite, atomic live region; the error line is an alert (Edge and Chrome).',
   '**Zoom and size:** no horizontal scrolling at 320 px, at emulated 200 % and 400 % zoom, or with 200 % text size; keys stay at least 48 x 48 px.'])
P('**Possible double announcement of an error.** When an error occurs, two live regions change: the polite display (`Error`) and the assertive alert (`Cannot divide by zero`). The texts differ, so nothing is repeated, but a screen reader may speak twice. What a screen reader does with them could **not** be tested because no screen reader was available to the assistant. The code was left unchanged. This is a task for a student with NVDA or VoiceOver (Appendix G, AT-25 and AT-26).')
H2('7.9 Security assessment')
P('The application is a static page that is opened from disk. It has no server, no database, no account and no dependency, and it collects no personal data. The review (an AI review, not independent) found no injection path, data leak or dependency risk.')
T('Main threats and controls', ['Threat', 'Control', 'Evidence'], [4, 6, 5], [
    ['Code injection through input', 'No `eval`, no `Function`; arithmetic uses four small functions', 'Static test; the CSP blocks `eval` (Edge, Chrome)'],
    ['HTML injection', 'Text is written with `textContent` only', 'Static test: no `innerHTML`'],
    ['Third-party or injected scripts', 'No third-party code; CSP `script-src \'self\'`', 'Injected inline script and outside script blocked in all three browsers'],
    ['Data leakage', 'CSP `default-src \'none\'`; no storage or network APIs', 'Only local requests; works with all web access blocked'],
    ['Input flood', '12-digit limit; constant work per key', '500-digit input; 5,000 operations; random tests'],
    ['Wrong result', 'Error states; display formatter refuses non-finite numbers', '88 tests; reference-model comparison; BUG-1 fixed'],
], False)
P('The Content Security Policy is `default-src \'none\'; script-src \'self\'; style-src \'self\'; base-uri \'none\'; form-action \'none\'`. It worked from `file://` in all three browsers. It is defence in depth only. The built-in security-review skill could not run (Appendix C), so the review was manual. A student should repeat it [[Student 5: security review, with date]].')

# ============================================================== 8 RISK
H1('8 Risk assessment and limitations', 'Supplementary project-management material (slide 32, item 13)')
H2('8.1 Risk register')
P('The register has 14 risks. Likelihood (L) and impact (I) are scored 1 to 3; scores of 6 to 9 are high. The ratings are the author\'s first judgement and **have not been reviewed by the team**. No weekly review has taken place, so every status is still "Open". [[Students: review the register and record the date and the outcome of each review.]]')
rows = []
for l in rd('docs/00-admin/risk-register.md').split('\n'):
    if l.startswith('| RK-'):
        c = [x.strip() for x in l.strip().strip('|').split('|')]
        rows.append([c[0], c[1], f'{c[3]} x {c[4]} = {c[5]}', c[6], c[9]])
hi = [[r_[0], r_[1], r_[2]] for r_ in rows if int(r_[2].split('=')[-1].strip()) >= 6]
P(f'{len(hi)} of the {len(rows)} risks are rated high (score 6 to 9). They are listed below; the full register with mitigations and status is in Appendix L.')
T('High-rated risks (full register in Appendix L)', ['ID', 'Risk', 'L x I'], [1, 9, 2], hi, True)
H2('8.2 Limitations of the product and of the verification')
T('Known limitations (not bugs)', ['No.', 'Limitation'], [1, 11], [
    ['L1', '`0.1+0.2-0.3` shows `5.55111512313e-17` (decision D3). `1-0.9999999999` shows `1.00000008274e-10` instead of `1e-10`, because stored numbers are doubles.'],
    ['L2', 'The display shows at most 12 significant digits; the full value is kept internally.'],
    ['L3', 'A 13th typed digit is ignored. The `0` of `0.5` counts, so `0.` allows 11 decimals.'],
    ['L4', 'After a mouse click the keyboard focus is released, so that Enter then means "equals".'],
    ['L5', 'Key names are words ("Times") while the visible text is a symbol ("×"); voice-control users may need to say the word. Untested.'],
    ['L6', 'An error causes two screen-reader announcements; the behaviour with a real screen reader is unknown.'],
    ['L7', 'Firefox keyboard-focus behaviour and Safari are not verified.'],
    ['L8', 'Browser zoom and larger text were emulated with the browser protocol, not set through the browser menu. All browsers were headless, and Edge and Chrome share an engine.'],
    ['L9', 'The tests were written by the same assistant that wrote the code; independent human review is outstanding.'],
    ['L10', 'No user research and no hands-on use of the three reference calculators were done.'],
], True)

# ============================================================== 9 PBL
H1('9 Project-Based Learning', 'Supplementary: the method required by the course (slides 7 and 12 to 28)')
H2('9.1 PBL in this project')
P('The professor describes PBL as a student-focused method with an open-ended challenge, own solutions, a choice in how to learn, clear assessment criteria, reflection and revision, and a final presentation to peers (slides 16 to 26 [14]). The table shows how the project relates to these characteristics and what is still missing.')
T('PBL characteristics and this project', ['Characteristic (slides 21 to 26)', 'In this project', 'Missing'], [4, 6, 4], [
    ['An open-ended, appropriately complex question', 'The driving question in Section 1.2', ''],
    ['Relates to knowledge from the lessons', 'Design, testing, security and project-management topics of the course', '[[Students: link to course lessons]]'],
    ['Students find their own solutions', 'The technology and design were chosen by the team and the project lead after comparing alternatives (Section 5.7)', '[[Students: your own design contributions]]'],
    ['A choice in how to learn', 'The team chose the calculator\'s details and tools', ''],
    ['Clear assessment criteria', 'None given yet', '[[Professor\'s rubric (open question Q1)]]'],
    ['Reflection and revision, final presentation', 'Four review rounds; mistakes corrected (below); presentation planned', 'Retrospective; the students\' reflections'],
], False)
H2('9.2 Investigation')
P('The investigation had three parts: studying three existing calculators (Chapter 4), studying number representation to decide how to show results (Section 5.5), and studying accessibility standards (Section 4.5). The investigation produced eleven design lessons and one correction of the plan itself (the 44 px rule).')
H2('9.3 Choices')
P('The main choices (immediate execution, no framework, display-only rounding, keyboard as a must, no percent key) are recorded with options and reasons in the decision log (Appendix B). Each choice was compared with at least one alternative.')
H2('9.4 Feedback and iteration')
T('Feedback rounds and what changed', ['Round', 'Feedback from', 'What changed'], [2, 4, 9], [
    ['Phase 1', 'The project lead', 'Plan approved with adjustments (immediate execution, display rounding, state diagram, tools, browser tests later)'],
    ['Phase 2', 'The project lead', 'Decisions D9 to D16: percent removed, no snapping of tiny results, keyboard as a Must, static prototype, separate engine/formatter/interface, light theme'],
    ['Phase 3', 'The project lead', 'Approved implementation; asked for the Phase 2 clean-up and a local commit'],
    ['Phase 4', 'The project lead', 'Kept D3 and rejected D17; approved Firefox testing; asked for a clean test report; the negative-zero bug had been found and fixed'],
    ['Phase 5', 'The project lead', 'Approved the report outline and the 10-minute presentation structure'],
], True)
P('**Feedback from the professor:** [[Professor\'s feedback, if any, with date and form (class, consultation, written)]]. None has been received in the records so far.')
P('**Mistakes found and corrected** (reflection material): a 44 px target size wrongly called Level AA; a rounding rule that fixed one case and broke another; a prototype layout that shifted when an error appeared; a keypad described as 18 keys that has 19; tests that read comments instead of code; a zoom check that passed without testing; a negative-zero display bug; and several documents that said "planned" after the work was done. Each was found by checking, not by assumption.')
H2('9.5 Teamwork')
P('[[Students: describe how the team really worked: meetings held, how tasks were shared, how disagreements were solved, what went well and what did not. Use the meeting notes and the time log as evidence. Do not describe teamwork that did not take place.]]')
H2('9.6 Reflection of each student')
P('Each student writes a short personal reflection in their own words: what you did, what you learned, what was difficult, what you would do differently, and what you can explain without help.')
T('Individual reflections (to be written by the students)', ['Student', 'Reflection'], [3, 9], [
    ['Student 1 [[NAME]]', '[[Reflection of Student 1]]'], ['Student 2 [[NAME]]', '[[Reflection of Student 2]]'], ['Student 3 [[NAME]]', '[[Reflection of Student 3]]'],
    ['Student 4 [[NAME]]', '[[Reflection of Student 4]]'], ['Student 5 [[NAME]]', '[[Reflection of Student 5]]'],
], True)
H2('9.7 Course objectives and learning outcomes')
P("The professor's course objectives C1 to C4 (slide 2 [14]) are mapped below to the places where this project can show evidence. The table does not claim that any student has achieved an objective: that is for each student to show and for the professor to judge.")
T('Course objectives C1 to C4 (slide 2 [14]) and what the project can show', ['Objective', 'Where this project addresses it', 'Not yet shown'], [4, 6, 5], [
    ['C1 Practical verification of knowledge', 'Chapters 4 to 7: requirements, design, implementation and verification of a real application', "The students' own understanding of the code; human acceptance tests"],
    ['C2 Professional competences: planning, organisation, cooperation', 'Chapters 2, 3 and 9: schedule, work packages, rules, feedback rounds', 'Real working hours, real meetings and real teamwork (all placeholders)'],
    ['C3 Independence and creativity: critical thinking, design decisions', 'Sections 5.7 and 6.3 and Appendix B: alternatives compared and decisions recorded', 'Which decisions the students made themselves; the code and drafts were produced by the AI assistant'],
    ['C4 Documentation and public presentation', 'This report, the slides and the live demo', "The students' own writing, rehearsal and defence on 18 December"],
], True)
P('[[Students: confirm which objectives you can show you achieved, and give your own evidence]]')
T('Selected course learning outcomes (slide 3 [14]) and evidence', ['Outcome', 'Possible evidence in this project', 'Student confirmation'], [5, 6, 3], [
    ['P_U02 Estimate the time needed for a task', 'WBS with planned hours; comparison with the real time log', '[[after the time log is filled]]'],
    ['P_U04 Prepare and deliver a presentation and lead a discussion', 'The 10-minute presentation and the questions on 18 December', '[[after the defence]]'],
    ['P_U05 Formulate a design specification', 'Requirements specification and design documents', '[[students]]'],
    ['P_U06 Integrate knowledge from different fields, including non-technical aspects', 'Accessibility, security and legal and ethical requirements', '[[students]]'],
    ['P_K02 Be critical about knowledge and content received', 'Sources re-checked; AI output reviewed and corrected', '[[students]]'],
], False)
blocks[-1]['keep'] = True
P('This table is a **selection**: five of the eleven outcomes on slide 3. The others (P_W01, P_W02, P_U01, P_U03, P_K01, P_K03) are not mapped in this draft.')

H2('9.8 Relationship with the earlier Team Project')
P("The professor asked that this project be linked to the Team Project of the same group one year earlier (slide 7 [14]). The project documents do not describe that project. **Open item.** [[Students: describe the earlier Team Project and how this project continues it]]")

# ============================================================== 10 DEPLOYMENT
H1('10 Deployment and user instructions', 'Supplementary: method of delivery and training (slide 33, items 16 and 17)')
H2('10.1 How to run the calculator')
N(['Copy the project folder to your computer (or unpack the delivered archive). [[Delivery method: Git repository link, archive, or other, as the professor requires]]',
   'Open the folder `src` and double-click `index.html`. The calculator opens in your browser.',
   'No installation, no internet connection and no server are needed.'])
H2('10.2 How to use it')
T('Using the calculator', ['To do this', 'Click or type', 'Example'], [4, 5, 5], [
    ['Enter a number', 'Digits and `.` (a comma also works)', '`1` `2` `.` `5`'], ['Calculate', 'An operator, then a second number, then `=`', '`7` `+` `8` `=` gives 15'],
    ['Chain operations', 'Press the next operator instead of `=`', '`2` `+` `3` `×` `4` `=` gives 20'], ['Change the sign', '`±`', '`5` `±` gives -5'],
    ['Delete the last digit', '`⌫` or `Backspace`', '`123` `⌫` gives 12'], ['Clear everything, also an error', '`C` or `Esc`', ''], ['Use the keyboard', '`+` `-` `*` `/`, `Enter` or `=`, `Backspace`, `Esc`', '`12+30*2` `Enter` gives 84'],
], True)
H2('10.3 Things to know')
B(['**Order of operations.** The calculator works in the order you press the keys, like a pocket calculator: `2 + 3 × 4 =` gives 20, not 14.',
   '**Long numbers.** You can type at most 12 digits. Results show at most 12 significant digits; the calculator still remembers the full value.',
   '**Very large and very small results** use exponential notation, for example `9.99999999998e+23`.',
   '**Errors.** `Cannot divide by zero`, `Number too large` and `Number too small` appear on a red line. Press a digit or `C` to continue.',
   '**A small surprise.** `0.1 + 0.2 - 0.3` shows `5.55111512313e-17`, not 0, because computers store 0.1 and 0.2 approximately. This is a documented decision.'])
H2('10.4 For developers and examiners')
T('Commands (Node.js 22 or newer)', ['Command', 'Purpose'], [6, 6], [
    ['`node --test`', 'Run the 88 unit and static tests'], ['`node tests/browser-check.js`', 'Run the browser checks in Edge or Chrome (set `BROWSER` to another browser)'],
    ['`node tests/browser-check.js --firefox`', 'Run the browser checks in Firefox'], ['`node tests/docs-check.js --require-tests`', 'Check that the documents agree with each other and with the tests'],
], True)
P('Supported browsers: tested in Edge 156, Chrome 156 and Firefox 159 (headless). Safari and mobile browsers were not tested. A one-page user guide for first-time users has not been written yet [[Team: decide whether to write it, and who]].')

# ============================================================== 11 CONCLUSIONS
H1('11 Conclusions')
H2('11.1 What was achieved')
B(['A very simple working calculator for the browser, with 19 keys, keyboard input, clear errors, and a layout that works down to 320 px. It opens by double-click and works offline.',
   'Requirements based on a review of three existing calculators: 18 functional requirement IDs (one retired, one not built) and 9 non-functional requirements. Every requirement that was built has a named automated test.',
   'A design in which the calculation rules are separate from the page, documented with an architecture diagram, a data-flow diagram and a state diagram.',
   '88 automated unit and static tests and 102 browser checks that pass in Edge and Chrome, and 88 that pass in Firefox with 11 skipped for stated reasons.',
   'One real bug (negative zero) found by review, fixed with tests written first, and recorded honestly.',
   'Records of decisions, tools and AI assistance, risks, and limitations.'])
H2('11.2 What is not finished')
B(['The human verification: Firefox keyboard focus, screen reader, Lighthouse, a real phone, first-time users, independent code review, and a student re-running the tests (Appendix G).',
   'The students\' own records: time log, meeting notes, reflections, and who did what.',
   'The professor\'s answers on format, rubric, AI policy and the 17-item list.',
   'The one-page user guide, if the team decides to write it.'])
H2('11.3 Lessons learned')
B(['Tests only check what someone thought of; random tests and code review find the rest.',
   'A passing test must be checked for meaning: two of the checks passed without testing anything until the AI review looked at what they typed.',
   'Say "not tested" when something is not tested. Honest limits are part of the result.',
   'Small, written decisions with alternatives made it easy to change course (for example removing the percent key).',
   'AI assistance is fast, but the team must still understand, verify and be able to explain everything.'])
H2('11.4 Possible future work')
B(['Exact decimal arithmetic for addition, subtraction and multiplication (option E), if the display of `0.1 + 0.2 - 0.3` proves unacceptable.',
   'A screen-reader test and, if needed, a change so that an error is announced only once.',
   'A short user guide; session history (FR-17, Could); optional dark mode.'])
H2('11.5 Final statement')
P('[[Students: write your own concluding statement after you have completed the human verification, reviewed this report and rehearsed the presentation.]]')

# ============================================================== 12 REFERENCES
H1('12 References')
P('All web pages were accessed on 31 October 2026. Only sources that were actually read are listed. The citation style required by the professor is unknown [[citation style, open question Q1]]; these entries contain author, title, address and access date, so they can be reformatted.')
refs = [
 ['[1]', 'Microsoft. Windows Calculator. README, microsoft/calculator repository (branch main). https://github.com/microsoft/calculator/blob/main/README.md'],
 ['[2]', 'Microsoft. Windows Calculator. LICENSE (MIT). https://raw.githubusercontent.com/microsoft/calculator/main/LICENSE'],
 ['[3]', 'Microsoft. Windows Calculator. English resource strings, Resources.resw. https://raw.githubusercontent.com/microsoft/calculator/main/src/Calculator/Resources/en-US/Resources.resw'],
 ['[4]', 'Google. Manage calculator, unit converter & color codes. Google Search Help. https://support.google.com/websearch/answer/3284611'],
 ['[5]', 'Mar-Issah (Siya). JavaScript-Calculator. GitHub repository, index.html, js/app.js, LICENSE (MIT). https://github.com/Mar-Issah/JavaScript-Calculator'],
 ['[6]', 'W3C. Understanding Success Criterion 1.4.3: Contrast (Minimum). WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html'],
 ['[7]', 'W3C. Understanding Success Criterion 1.4.10: Reflow. WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/reflow.html'],
 ['[8]', 'W3C. Understanding Success Criterion 1.4.11: Non-text Contrast. WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html'],
 ['[9]', 'W3C. Understanding Success Criterion 2.1.1: Keyboard. WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html'],
 ['[10]', 'W3C. Understanding Success Criterion 2.5.5: Target Size (Enhanced). WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/target-size.html'],
 ['[11]', 'W3C. Understanding Success Criterion 2.5.8: Target Size (Minimum). WCAG 2.2. https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html'],
 ['[12]', 'W3C. Understanding Success Criterion 4.1.2: Name, Role, Value. WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html'],
 ['[13]', 'W3C. Understanding Success Criterion 4.1.3: Status Messages. WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html'],
 ['[14]', 'Course material: "Specialization project", presentation of 2 October 2026 (37 slides), Specialization Project IN.MSA.CBS.006. Not publicly available. [[Professor: how this source should be cited]]'],
]
T('References', ['No.', 'Reference'], [1, 11], refs, True)
P('The obligatory literature on slide 6 of the professor\'s presentation (security books) is **not cited**, because nobody on the team has read it. [[Students: add it only if you have read the relevant parts.]] Web-security terms used in Section 7.9 (CSP, XSS) should be backed by an official source (for example the W3C Content Security Policy specification) that a student has read before the final report.')

# ============================================================== APPENDICES
H1('Appendices')
P("A. Traceability of requirements and the professor's list · B. Decision log summary · C. Tools, skills and AI assistance · D. Test commands and results · E. Screenshots · F. Bug log · G. Human acceptance tests (pending) · H. Placeholder register · I. Time-log template · J. Browser check matrix · K. Code excerpts · L. Risk register")
H2('Appendix A. Traceability')
T('The professor\'s 17 draft items (slides 32 and 33) and where they are covered', ['No.', 'Item', 'Chapter or file', 'Missing'], [1, 5, 4, 4], [
    ['1', 'Specification and analysis of user requirements', 'Chapter 4', 'Real user input (none collected)'], ['2', 'Study of solutions, selection of technology', 'Chapters 4 and 5', ''],
    ['3', 'Project management method and justification', 'Chapter 2, Section 3.3', 'Team\'s agreed rules'], ['4', 'Division of tasks', 'Section 3.2', 'Real names, confirmed roles'],
    ['5', 'Records of working time', 'Section 3.5, Appendix I', '**All hours**'], ['6', 'WBS, project charter, scope', 'Sections 2.2 and 3.1', ''],
    ['7', 'Data-flow diagrams', 'Section 5.3', ''], ['8', 'Class diagrams', 'Not planned; state diagram instead (D4)', 'Professor\'s view'],
    ['9', 'Gantt chart', 'Section 2.4', 'Actual progress'], ['10', 'Budget estimate', 'Section 3.4 (effort in person-hours; no financial estimate yet)', 'Whether a money estimate is expected'],
    ['11', 'List of resources', 'Section 3.4', ''], ['12', 'Resource utilisation plan', 'Sections 3.1 and 3.2', ''], ['13', 'Risks', 'Chapter 8', 'Real weekly reviews'],
    ['14', 'Prototype', 'Section 5.6; the working application', ''], ['15', 'Production management plan, test plan', 'Chapters 6 and 7', 'Human test results'],
    ['16', 'Training plan', 'Section 10.2 (a one-page guide is planned, not written)', 'Decide scope and write it'], ['17', 'Method of delivery', 'Section 10.1', 'Submission method'],
], True)
trace = [['FR-01 to FR-12', 'Digits, decimals, four operations, equals, chaining, clear, backspace, operator replacement, errors, rounding, limits', '`engine.test.js`, `format.test.js`, browser checks'],
         ['FR-13', 'Keyboard and comma alias', '`keymap.test.js`, browser keyboard checks'], ['FR-14 (retired)', 'Unknown keys, including `%`, are ignored', '`engine.test.js`'],
         ['FR-15, FR-16, FR-18', 'Sign toggle, expression line, safe equals', '`engine.test.js`, `boundary.test.js`, browser checks'],
         ['NFR-02', 'Random key sequences', '`engine.test.js`, `boundary.test.js`, browser (1,000 keys)'], ['NFR-03, NFR-05', 'Key size, layout, zoom', 'browser checks at four widths, zoom and text size'],
         ['NFR-04', 'Contrast, names, roles, focus, keyboard-only', '`accessibility.test.js`, `security.test.js`, browser checks'], ['NFR-06, NFR-07, NFR-08', 'Security, portability, separation', '`security.test.js`, browser checks (CSP, offline)']]
T('Requirements and the tests that check them (summary)', ['Requirements', 'What is checked', 'Where'], [3, 6, 5], trace, True)
H2('Appendix B. Decision log summary')
P('The decision log records each decision with context, options and consequences. The first table summarises the decisions (Section 6.3 explains the principal ones). The second table lists the open questions that still wait for answers; Q10 and Q11 were answered on 31 October 2026 and are not listed.')
T('Decision summary (full text in the decision log)', ['ID', 'Decision', 'Status'], [1, 9, 3], [
    ['D1', 'Immediate-execution arithmetic, not operator precedence', 'Accepted'], ['D2', 'Classic scripts so that the page works from `file://`', 'Accepted'],
    ['D3', 'Display-only rounding; the numeric result is preserved', 'Confirmed 31 Oct'], ['D4', 'Data-flow and state diagrams; no class diagram', 'Accepted'],
    ['D9', 'Snap tiny add or subtract results to zero', 'Rejected'], ['D10', 'Percent key removed from scope', 'Accepted'], ['D11', 'No repeat-equals', 'Accepted'],
    ['D12', 'Keyboard input is a Must; comma accepted as an alias', 'Accepted'], ['D13', 'Static HTML prototype instead of Figma', 'Accepted'],
    ['D14', 'Separate engine, formatting and interface (plus `keymap.js`)', 'Accepted'], ['D15', 'Light grey-and-blue interface, no dark mode', 'Accepted'],
    ['D16', 'Sign toggle kept and raised to Must', 'Accepted'], ['D17', 'Exact decimal arithmetic for + - ×', 'Rejected (kept D3)'],
], True)
T('Open questions (from the decision log)', ['No.', 'Question', 'For'], [1, 9, 2], [
    ['Q1', 'Grading rubric; required report format, length, language, citation style, submission method and deadline', 'Professor'],
    ['Q2', 'Are the 17 items on slides 32 and 33 required or guidance?', 'Professor'], ['Q3', 'Is the 10-minute presentation limit firm?', 'Professor'],
    ['Q4', 'What is the policy on AI-tool assistance?', 'Professor'], ['Q5', 'How should the 6 November class and consultations be used?', 'Professor'],
    ['Q6', 'Real names of the five students and confirmation of roles', 'Team'], ['Q7', 'Do the other four students agree with decisions D1 to D17?', 'Team'],
    ['Q8', 'Should the working copy move out of OneDrive to protect `.git`?', 'Project lead'], ['Q9', 'Is a security analysis expected for the calculator, and how deep?', 'Professor'],
    ['Q12', 'A student must open every URL in the calculator review and confirm the facts', 'Student 2'],
    ['Q13', 'Did the professor expect a specific citation style or a specific diagram notation?', 'Professor'],
], True)
H2('Appendix C. Tools, skills and AI assistance used')
T('What was actually used (from the tool and AI usage log)', ['Tool or skill', 'Used for', 'Status'], [4, 7, 3], [
    ['Claude Code (AI assistant, model Sonnet 5.5)', 'Analysis, documents, code, tests, this draft', 'Used throughout; all output needs human review'],
    ['Skills `engineering:documentation`, `engineering:architecture`, `engineering:system-design`, `engineering:testing-strategy`, `engineering:code-review`, `design:accessibility-review`', 'Structure and checklists for documents, design, tests, review and accessibility', 'Invoked; they provide instructions, not results'],
    ['Skills `anthropic-skills:docx` and `anthropic-skills:pptx`', 'Guidance for this report and the slides', '`pptx` was invoked again in Phase 5 (31 October 2026); `docx` was not invoked in Phase 5. Their preferred libraries (docx-js, pptxgenjs, LibreOffice) were **not installed**, so Microsoft Word and PowerPoint were driven directly'],
    ['Skill `security-review`', 'Intended security review', '**Did not run** (failed to start: no remote repository)'],
    ['Superpowers plugin: skill `superpowers:verification-before-completion`', 'Guidance for the final checks of this report, the slides and the demo', '**Invoked** in the Phase 5 audit and correction sessions (31 October 2026). No other Superpowers skill was used'],
    ['Context7 plugin', 'Enabled in settings', '**Not used**'],
    ['Node.js test runner, `tests/browser-check.js`, `tests/docs-check.js`', 'Automated verification', 'Written in this project; run by the AI'],
    ['Edge, Chrome, Firefox 159', 'Browsers under test', 'Firefox was installed from the official download with the project lead\'s approval'],
    ['Mermaid (scratch)', 'Checking that the Mermaid diagrams in the Markdown files render', 'Downloaded to a scratch folder, not installed in the project'],
    ['Microsoft Word and PowerPoint (COM automation)', 'Producing this report and the slides', 'Used'],
], False)
H2('Appendix D. Test commands and results')
P('See Section 7.3. To repeat everything, run from the project root: `node --test`; `node tests/browser-check.js`; `node tests/browser-check.js --firefox`; `node tests/docs-check.js --require-tests`. A student\'s repeat run is recorded here: [[Date, student, commands, browser and computer, result]].')
T('Firefox: the 11 skipped checks', ['Skipped check', 'Reason'], [6, 6], [
    ['Focus ring; Enter on a focused key; Space on a focused key; Enter on the help summary (4)', 'The automated Firefox window has no keyboard focus'],
    ['Keyboard-only operation (4)', 'Same reason'], ['Accessibility tree (2) and `eval()` blocked by CSP (1)', 'No accessibility-tree command in Firefox\'s protocol; evaluation through the protocol may bypass the policy'],
], False)
H2('Appendix E. Screenshots')
P('All screenshots were made by the test tool from the current files on 31 October 2026. The full set, with hashes that tie them to the source files, is in `evidence/screenshots/`.')
ROW([{'path': EVI + '2026-10-31-app-typing-320px.png', 'widthCm': 4.0, 'alt': 'Calculator at 320 pixels width'}, {'path': EVI + '2026-10-31-app-error-320px.png', 'widthCm': 4.0, 'alt': 'Error state at 320 pixels width'}, {'path': EVI + '2026-10-31-app-zoom400-320x256.png', 'widthCm': 4.0, 'alt': 'Emulated 400 percent zoom'}, {'path': EVI + '2026-10-31-app-text200-320px.png', 'widthCm': 4.0, 'alt': 'Text size 200 percent at 320 pixels'}],
    'At 320 px width: typing, error, emulated 400 % browser zoom (320 x 256 px viewport), and 200 % text size')
H2('Appendix F. Bug log')
T('Application bug', ['ID', 'Description', 'Status'], [1, 10, 2], [['BUG-1', 'After `0.5`, `±`, backspace, backspace the display showed `-0`; typing 7 then showed `-07`. Fixed in Phase 4 with regression tests.', 'Fixed']], True)
T('Mistakes found in tests, scripts and documents (not application bugs)', ['ID', 'Phase', 'What happened'], [2, 2, 9], [
    ['DOC-1', '3', 'Documents said the keypad has 18 keys; it has 19. Corrected.'], ['DOC-2', '3', 'A requirement example needed 13 digits but entry is limited to 12. Example changed.'],
    ['TEST-1', '3', 'A random test treated `null` (no error message) as invalid.'], ['TEST-2', '3', 'Static security tests read comments such as "never innerHTML".'],
    ['TEST-3', '3', 'A browser test counted Tab stops from the wrong start.'], ['TEST-4', '3', 'The first mutation check was invalid ("0 passed" on every row).'],
    ['TEST-5', '4', 'A random comparison treated a recovered division by zero as still an error.'], ['TEST-6', '4', 'The 400 % zoom check passed without testing: keys below the visible area were not clicked.'],
    ['TEST-7', '4', 'Three CSP reports were expected; the browser reports two (the `eval` block is an `EvalError`).'], ['TEST-8', '4', 'A scratch mutation script had outdated patterns and was rewritten.'],
    ['TEST-9', '4', 'First Firefox run: focus-dependent checks failed. **Not a calculator bug**: the automated window has no keyboard focus.'], ['TEST-10', '4', 'Firefox reports no sub-resource requests for local files; the offline check was changed.'],
    ['TEST-11', '4', 'Firefox did not log CSP violations through the driver; the check now listens for `securitypolicyviolation`.'], ['TEST-12', '4', 'A Firefox focus screenshot would have shown no ring and misled; it is not taken.'],
], True)
H2('Appendix G. Human acceptance tests (PENDING)')
CALL('**None of these tests has been done by a human.** The expected results come from the requirements and from the automated tests. Each student or tester must perform the steps and write what they saw. The full template, with run columns and a sign-off table, is `docs/05-final/acceptance-and-submission-checklist.md`.')
at = []
for l in rd('docs/05-final/acceptance-and-submission-checklist.md').split('\n'):
    if l.startswith('| AT-'):
        c = [x.strip() for x in l.strip().strip('|').split('|')]
        if len(c) >= 3:
            exp = c[2]
            at.append([c[0], c[1], exp, '**PENDING**'])
T('Human acceptance tests', ['ID', 'Steps', 'Expected result', 'Result'], [1, 5, 5, 2], at, True)
placeholders_at = len(placeholders)
H2('Appendix H. Placeholder register')
PLACEHOLDER_MARK = {'type': 'placeholder-register'}
blocks.append(PLACEHOLDER_MARK)
H2('Appendix I. Time-log template (empty)')
P('Each student records only their own real working time, rounded to 15 minutes. **No hours have been recorded.** The weekly summary is filled in by the project manager from the entries after the weekly check.')
T('Weekly summary of working time (hours)', ['Week', 'Dates', 'Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Team total'], [2, 3, 2, 2, 2, 2, 2, 2], [
    ['W1', '31 Oct - 6 Nov', '', '', '', '', '', ''], ['W2', '7 - 13 Nov', '', '', '', '', '', ''], ['W3', '14 - 20 Nov', '', '', '', '', '', ''], ['W4', '21 - 27 Nov', '', '', '', '', '', ''],
    ['W5', '28 Nov - 4 Dec', '', '', '', '', '', ''], ['W6', '5 - 11 Dec', '', '', '', '', '', ''], ['W7', '12 - 18 Dec', '', '', '', '', '', ''], ['**Total**', '', '', '', '', '', '', ''],
], True)

add({'type': 'pagebreak'})
H2('Appendix J. Browser check matrix')
P('Technical evidence moved from Section 7.3. A skipped check was not run and is not counted as passed.')
T('What the browser checks cover, per browser', ['Area', 'Edge', 'Chrome', 'Firefox'], [7, 1, 2, 2], [
    ['Page load without console errors; `file://`; CSP present', 'pass', 'pass', 'pass'], ['16 mouse calculations, the expression line, Clear', 'pass', 'pass', 'pass'],
    ['Division by zero: message, keys do not move, recovery by digit and by Clear', 'pass', 'pass', 'pass'], ['Overflow with the keyboard ("Number too large")', 'pass', 'pass', 'pass'],
    ['Keyboard typing, Escape, comma, Backspace, browser shortcuts not blocked', 'pass', 'pass', 'pass'], ['Layout at 320, 360, 768 and 1280 px: no sideways scrolling, keys at least 48 x 48 px, long numbers fit', 'pass', 'pass', 'pass'],
    ['Browser zoom 200 % and 400 % (emulated); text size 150 % and 200 %', 'pass', 'pass', 'pass'], ['Offline: only local files; CSP blocks inline and outside scripts', 'pass', 'pass', 'pass'],
    ['1,000 random key presses never give an invalid display; no console errors', 'pass', 'pass', 'pass'],
    ['Focus ring; Enter and Space on a focused key; keyboard-only calculation', 'pass', 'pass', '**skipped**'],
    ['Accessibility tree: 19 named buttons, status and alert roles; live-region properties', 'pass', 'pass', '**skipped** (replaced by a markup check: pass)'],
], False)
H2('Appendix K. Code excerpts')
P('The excerpts are copied from the source files without change (`src/js/engine.js`, `src/js/format.js`, `src/js/keymap.js`).')
P('**K.1 The engine combines two numbers** and reports errors instead of returning `Infinity` or `NaN`:')
CODE(extract('src/js/engine.js', 'function calculate(left, operator, right)', '  // The Error state keeps'))
P('**K.2 Number formatting** chooses the notation from the rounded value, so that `999999999999.9` becomes `1e+12`, and never shows a non-zero value as 0:')
CODE(extract('src/js/format.js', 'function formatNumber(value)', '  // What the user sees'))
P('**K.3 The key map** only reads the event; it does not touch the page, so it can be unit-tested. Keys with Ctrl, Alt or Meta are never taken:')
CODE(extract('src/js/keymap.js', 'function commandForKey(event)', '  const api'))
P('**K.4 The fix for BUG-1** (Section 7.5): backspace and the sign key no longer produce `-0`:')
CODE(extract('src/js/engine.js', '  function pressBackspace(state)', '  function pressNegate'))

H2('Appendix L. Risk register')
P('The full register from `docs/00-admin/risk-register.md`. Likelihood (L) and impact (I) are scored 1 to 3. The ratings have not been reviewed by the team.')
T('Risk register', ['ID', 'Risk', 'L x I', 'Mitigation', 'Status'], [1, 4, 1.4, 7, 1], rows, True)

# ---- build the placeholder register (a table of all [[...]] items by chapter, with a class) ----
def classify(t):
    low = t.lower()
    if any(k in low for k in ('decide whether to write', 'add it only if', 'if you do it')): return 'D'
    if any(k in t for k in ('Professor', 'PROFESSOR')) or 'open question' in low or 'citation style' in low or 'cost estimate' in low: return 'C'
    if t in ('NAME', 'students') or t.startswith('Reflection of') or t.startswith('Each student') or t.startswith('Student 2:') or t.startswith('Student 5:') \
       or 'your own design contributions' in t or 'link to course lessons' in t or 'for each file, write who read it' in t \
       or t.startswith('after the') or 'which objectives you can show' in t: return 'B'
    return 'A'
reg = {}
for ch, t in placeholders: reg.setdefault(ch, []).append(t)
reg_rows = []
n = 0
counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
for ch, items in reg.items():
    for t in items:
        n += 1
        c = classify(t); counts[c] += 1
        reg_rows.append([str(n), c, ch if len(ch) < 40 else ch[:37] + '...', t if len(t) < 120 else t[:117] + '...'])
idx = blocks.index(PLACEHOLDER_MARK)
blocks[idx:idx + 1] = [
    {'type': 'p', 'text': f'There are **{n} placeholders** in this draft (yellow text in square brackets). Each is missing information that only a student or the professor can supply. The legend row in "How to read this draft" is not counted. Classes: **A** essential before submission ({counts["A"]}); **B** needed from individual students ({counts["B"]}); **C** needed from the professor ({counts["C"]}); **D** optional or removable ({counts["D"]}).'},
    {'type': 'table', 'caption': 'Placeholders to fill in before submission', 'header': ['No.', 'Class', 'Where', 'What is needed'], 'widths': [1, 1, 4, 8], 'rows': reg_rows, 'firstColBold': False}]
print('placeholder classes', counts)

spec = {'properties': {'title': 'Basic Calculator Application: Team A Specialization Project Report (DRAFT)', 'subject': 'Specialization Project IN.MSA.CBS.006',
                       'author': 'Team A (names to be added by the students)', 'comments': 'Draft 0.2, corrected on 31 October 2026 after the academic audit. Prepared with an AI assistant. Not signed off.',
                       'header': 'Team A: Basic Calculator Application', 'footer': 'DRAFT 0.2: not signed off, not ready for submission'}, 'blocks': blocks}
json.dump(spec, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('blocks:', len(blocks), ' placeholders:', n, ' tables:', sum(1 for b in blocks if b['type'] == 'table'), ' figures:', sum(1 for b in blocks if b['type'] in ('image', 'imagerow')))
