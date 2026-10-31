import json, sys
sys.stdout.reconfigure(encoding='utf-8')
SP = sys.argv[1]            # scratchpad folder
FIG = sys.argv[2]           # figures folder (forward slashes)
d = json.load(open(SP + '/deck.json', encoding='utf-8'))

TIMES = ['0:20', '0:45', '1:05', '1:10', '0:30', '1:45', '1:00', '0:45', '1:00']
for s, t in zip(d, TIMES):
    s['time'] = t

# slide 4: larger, simplified diagram made for the projector
d[3]['image'] = FIG + 'fig-architecture-slide.png'
d[3]['line'] = 'Rules separate from the page   |   5 states   |   keys 48 px or larger   |   works down to 320 px'

# slide 6: demo steps (step 7 now starts with a fresh number)
d[5]['steps'] = [
    ['Open src/index.html', 'calculator, display 0'],
    ['7  +  8  =', '15'],
    ['2  +  3  ×  4  =', '20 (step by step)'],
    ['0.1  +  0.2  =', '0.3'],
    ['5  ÷  0  =   then   7', 'Error and message; 7 recovers'],
    ['Esc, then type 12+30*2 Enter', '84 (keyboard)'],
    ['C,  1  2,  ±,  ⌫', '-12, then -1 (fresh number)'],
    ['Make the window narrow', 'all 19 keys, no sideways scroll'],
]
d[5]['fallback'] = ['Demo does not start?', 'Show the screenshots on slide 5', 'Use the second laptop or USB copy', 'Play the team recording (only if it exists)']

d[6]['bugtitle'] = 'Bug found by the AI code review: negative zero'

N = {}
N[0] = """STUDENT 1 (0:20)

Good evening. We are Team A. Our project is a basic calculator for the web browser, built with HTML, CSS and plain JavaScript. [Each student: say your own name and your part.]

You will hear the problem, the research, the design, a live demo, the tests and our lessons.

TIMING: the whole talk is planned for 9:00. That is about 8:20 of speaking and demo, plus about 40 seconds for hand-overs between speakers. Hand over by name: "Student 2, please."

NOTE FOR THE TEAM: the yellow boxes on this slide are placeholders for your real names. Delete this note before presenting."""

N[1] = """STUDENT 1 (0:45)

Our assignment is a calculator for basic mathematical operations: very simple, and it must work. Our driving question: how can we build a calculator a first-time user can trust, and prove it?

We use Project-Based Learning in three steps: investigate, decide, verify.

We want to be open about AI. An AI assistant, Claude Code, wrote the code, the tests and the first drafts of our documents, on our project lead's instructions. Our job is to review, verify and explain it, and to say clearly what is not yet verified. [Students: add what you personally did.]

IF ASKED: How was AI used? Every use is listed in the report, Appendix C, and in the tool and AI usage log. What is the professor's policy on AI? That is still an open question for the professor (Q4); we will follow the answer."""

N[2] = """STUDENT 2 (1:05)

Our AI assistant studied three calculators from their official documents and public code: the Windows Calculator, the Google Search calculator and a small open-source JavaScript calculator. [Student 2: add one sentence about what you checked yourself, or say that you have not yet.]

Three lessons shaped the design. First, Windows Standard mode calculates step by step, so 2 plus 3 times 4 gives 20, and we chose the same. Second, the open-source example has no check for division by zero, so errors became a clear state with a way out. Third, it has no keyboard input and unnamed buttons, so keyboard use and accessible names became requirements.

The result: eleven design lessons, and 18 functional and 9 non-functional requirements. The project lead removed the percent key to stay very simple. We did no user interviews.

IF ASKED: Why immediate execution? It matches Windows Standard mode and is the simplest correct model (decision D1). Did you check the sources? A team member must still open every link and confirm it (open item Q12)."""

N[3] = """STUDENT 3 (1:10)

The program has two layers. The interface layer is what the user sees: the page, the style sheet, a key map, and one script, app.js, that connects everything. The calculation layer has two files that never touch the page: the engine with the rules, and the formatter that turns numbers into text.

Why this split? The rules can be tested from the command line with no browser, and a change of colours cannot break the rules.

The behaviour is a state diagram with five states: Ready, Entering, Operator pending, Result and Error. It was drawn before the code, because the same key means different things in different states.

The keys are at least 48 pixels, every key has a name in words, and the layout works down to 320 pixels. [Student 3: say which diagrams you have checked against the code.]

IF ASKED: Why no framework? It would add dependencies and conflict with the offline, very simple goal. Did you test with a screen reader? Not yet; it is on the human test list (AT-25, AT-26)."""

N[4] = """STUDENT 4 (0:30)

The finished application is four JavaScript files, about 350 lines, no framework and no packages. The screenshots show 7 plus 8, the result 20, and the error for 5 divided by zero.

The engine is a function: it takes a state and a key and returns a new state, never changing the old one. It opens by double-click and works offline. Now the demonstration. [Student 4: say which parts of the code you have read and can explain.]"""

N[5] = """STUDENT 4 (1:45): LIVE DEMO, including set-up

BEFORE THE TALK: the calculator is already open in a second browser window, display 0, zoom 100 percent. On this slide, switch to it (Alt+Tab). Say one short sentence per step.

SAY FIRST: It needs no installation and no internet.

STEPS (about 10 seconds each; this sequence was run from start to finish in a real browser, keeping the state between steps):
1. Show the calculator: display 0.
2. Click 7 + 8 =. Expected: 15.
3. Click 2 + 3 x 4 =. Expected: 20. Say: it works step by step, like a pocket calculator (decision D1).
4. Type 0.1 + 0.2 =. Expected: 0.3. Say: decimals are stored approximately; we show 12 digits.
5. Click 5 / 0 =. Expected: Error and "Cannot divide by zero". Click 7: display 7. Say: the calculator recovers.
6. Press Esc, then type 12+30*2 and Enter. Expected: 84. Say: the keyboard works too.
7. Press C. Click 1, then 2, then the sign key: -12. Click the delete key: -1. (Always start with a fresh number: after a result, the sign key changes the result and the delete key does nothing.)
8. Make the window narrow. Say: all 19 keys stay visible down to 320 pixels.

OPTIONAL, only if time remains: 0.1 + 0.2 - 0.3 shows 5.55111512313e-17. Say: a known limit that we decided to document (decision D3).

IF THE DEMO FAILS: do not debug in front of the class. Say: "We will show it from our screenshots." Go to slide 5 and continue. Backup, prepared BEFORE the presentation: a second laptop with the project, a USB copy, and a short screen recording made by the team (this recording does not exist yet)."""

N[6] = """STUDENT 5 (1:00)

These results come from commands that anyone can run again. The AI assistant ran them on 31 October. 88 unit and static tests pass. 102 browser checks pass in Edge and in Chrome. In Firefox, 88 pass, none fail, and 11 are skipped because the automated Firefox window has no keyboard focus; we report them as skipped, not passed. The AI also injected 16 deliberate bugs, and the tests caught 15.

One real bug: after 0.5, the sign key and delete twice, the display showed minus zero, and typing 7 then showed minus zero seven. The AI's code review found it after all earlier tests had passed. Failing tests were written first, then the fix.

Our own re-runs and the human tests are still to do. [Student 5: if you have re-run the tests, say the result and the date.]

IF ASKED: What is the difference between automated and human verification? Automated: scripts anyone can re-run. Human: screen reader, real phone, first-time users, independent review; none of these has been done yet."""

N[7] = """STUDENT 5 (0:45)

Security: a static page. It never evaluates typed text, never inserts HTML, makes no network requests and stores nothing. A Content Security Policy is tested in three browsers. The AI made this review; a student must still repeat it.

Limits: 0.1 plus 0.2 minus 0.3 shows 5.55e-17, because computers store decimals approximately; the project lead decided to document it. Firefox keyboard focus and screen readers are not verified. No user research.

Next: human acceptance tests, a screen-reader check and a short user guide.

IF ASKED: Is it accessible? The automated checks for contrast, names, roles, focus order and keyboard operation pass; the human checks are pending."""

N[8] = """STUDENT 1 (1:00)

To finish: a very simple, working, offline calculator, with its evidence and its limits documented. Three lessons: tests only check what someone thought of, because the negative-zero bug passed every early test; say "not tested" when something is not tested; and write decisions down with the alternatives.

[Each student: one sentence about your own lesson, about 8 seconds each. Replace the yellow boxes with your sentences. Say only what you really did and learned.]

Thank you. We are happy to answer questions, each in our own area.

QUESTIONS (full list in the presentation plan): why no framework; why immediate execution; why 0.1 + 0.2 - 0.3 is not 0; did you do user research (no); how was AI used; what did you not test."""

for i, t in N.items():
    d[i]['notes'] = t
json.dump(d, open(SP + '/deck2.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok')
