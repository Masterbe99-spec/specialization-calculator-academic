# Live Demo Script (standalone)

**Last updated:** 2026-10-31
**Status:** DRAFT 0.2 for team review, corrected 31 October 2026 after the academic audit. Written by the AI assistant. **No student has rehearsed this yet.**
**Slot:** slide 6 of the presentation, presenter Student 4, 1 minute 45 seconds including set-up, inside a 9-minute plan for the whole talk (the professor's limit is 10 minutes) (professor's slide 8: "10 minutes to present the project and a working demo").
**Verified by the AI on 31 October 2026:** the whole script below, in this order, was run in one continuous real Edge session (clicks and key presses, one page load, state kept between steps, 18 checks, all passed, no console errors): `7+8=` 15; `2+3×4=` 20; `0.1+0.2=` 0.3; `5÷0=` Error with "Cannot divide by zero", then `7` recovers; `Esc`, `12+30*2` `Enter` 84; `C`, `1` `2`, sign gives -12, delete gives -1; all 19 keys visible at 320 and 360 px with no sideways scroll. **Not verified:** a human running the demo on the presentation computer, other browsers, a projector.

## Before the presentation (do this the day before and 10 minutes before)

| # | Task | Done by / date |
|---|---|---|
| 1 | Copy the whole project folder to the presentation laptop **and** a USB stick (the page needs only `src/`) | [[student, date]] |
| 2 | Open `src/index.html` by double-click in the browser you will use. Confirm display `0` | [[student, date]] |
| 3 | Run the whole demo once on the presentation laptop, with the projector connected | [[student, date]] |
| 4 | Browser zoom 100 %, window maximised, bookmarks bar and notifications hidden | [[student, date]] |
| 5 | Close all other windows. Turn off notifications. Charge the laptop | [[student, date]] |
| 6 | Open slide 5 (screenshots) and slide 6 in the deck, and the calculator in a second window, so you can switch with Alt+Tab | [[student, date]] |
| 7 | Make a 1-minute screen recording of the demo as backup (**does not exist yet**) | [[student, date]] |
| 8 | A second person has the calculator open on their own laptop | [[student, date]] |

## Script (about 12 seconds per step)

| Step | Do | Expect on screen | Say (own words, short) |
|---|---|---|---|
| 1 | Double-click `src/index.html` | Calculator, display `0` | "No installation, no internet." |
| 2 | Click `7` `+` `8` `=` | `15` | "A basic sum." |
| 3 | Click `2` `+` `3` `×` `4` `=` | `20` | "It works step by step, like a pocket calculator. This is our decision D1." |
| 4 | Type `0.1` `+` `0.2` `=` | `0.3` | "Computers store decimals approximately; we show 12 digits." |
| 5 | Click `5` `÷` `0` `=` | `Error`, `Cannot divide by zero` (red) | "Errors are a clear state." Then click `7`: display `7`. "And it recovers." |
| 6 | Press `Esc`, type `12+30*2`, press `Enter` | `84` | "The keyboard works too." |
| 7 | Press `C`. Click `1`, `2`, then the sign key `±`, then the delete key `⌫` | `0`, `12`, then `-12`, then `-1` | "Sign and delete, on a fresh number." |
| 8 | Make the browser window narrow (or F12, phone size) | All 19 keys visible, no sideways scrolling | "The layout works down to 320 pixels." |

## Optional extras (only if time remains; skip if behind)

* **Honest limit.** Type `0.1` `+` `0.2` `-` `0.3` `=`. It shows `5.55111512313e-17`. Say: "This is a known limit. We compared options and decided to keep the simple rule and document it (decision D3)."
* **The bug we found.** Press `C` first, then type `0.5`, sign key, delete key twice, then `7`. It now shows `7`. Say: "Before the fix this showed minus zero seven. It is fixed and has regression tests." (Student 5 explains on slide 7.)

**Why step 7 starts with `C`.** After a result (such as `84` from step 6) the sign key changes the result (`-84`) and the delete key does nothing, so the step would look broken. Always start with a fresh number. This behaviour was also checked in the browser run.

## If something goes wrong

1. **Do not debug in front of the audience.** Say: "We will show it from our screenshots."
2. Go to slide 5 (three real screenshots: typing `7 +`, result `20`, the error), then continue to slide 7.
3. Switch to the second laptop or the USB copy only if it takes less than 10 seconds.
4. Play the backup recording only if it exists and was tested.

| Failure | Likely cause | Quick fix |
|---|---|---|
| Page shows plain text, no keys | Opened a different file or the `css` folder is missing | Open `src/index.html` from the project copy |
| Keys do not respond | Browser blocked scripts, or the wrong file | Reload (F5); otherwise use the backup |
| Keyboard input does nothing | The page does not have focus | Click once on the page, then type |
| Projector shows a different layout | Display scaling | Browser zoom `Ctrl+0`, then `Ctrl` `+` or `-` |

## Questions the demo may trigger

* *Why 20 and not 14?* Immediate execution, like Windows Standard mode (D1).
* *Why not exactly 0?* `0.1+0.2-0.3` limit, decision D3, written in the report (section 5.5).
* *Does it work on a phone?* The layout was tested with an emulated 320 px width and zoom. **A real phone has not been tested.**
* *Did you test with a screen reader?* **Not yet.** It is on the human-test list (AT-25, AT-26).

## What this script does not claim

* No human has run the demo or the acceptance tests.
* The Firefox keyboard focus and screen-reader behaviour are unverified (see the report, section 7.3).
* The team recording and the second laptop are plans, not facts.
