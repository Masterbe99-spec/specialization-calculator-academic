# UI/UX Design: Wireframe, Prototype and Accessibility

**Status:** Draft v0.2, finalised 2026-10-31 after the project lead's decisions: 18-key layout without percent, light grey-and-blue theme, comma accepted as an alias for the period. The working calculator in `src/` is built from this design.
**Last updated:** 2026-10-31
**Skills used:** `design:accessibility-review` (WCAG 2.1 AA checklist applied to this *design*). See [tool log](../00-admin/tool-ai-usage-log.md).
**Related:** [architecture.md](architecture.md) (state rules), [calculator-review.md](../02-research-requirements/calculator-review.md) (lessons L1-L11).

## 0. Honest limits

- This is a **design-stage** review of a wireframe and a static mock-up. It is **not** an accessibility audit of working software.
- **No screen reader was used. No user was asked.** Statements about how assistive technology will behave are design intentions to be tested in Phase 3.
- The only checks that were actually run: contrast ratios were computed with a script (section 6), and the static mock-up was opened in headless Microsoft Edge to look at the layout (screenshots in `evidence/screenshots/`). Edge is one browser, so Firefox and Chrome are untested.
- Design principles below (clarity, feedback, forgiveness) are general good practice. We cite no book for them; if the report needs a citation, find and read one first.

## 1. Design goals

| Goal | Meaning for this calculator |
|---|---|
| Looks clean and modern | Few colours, rounded keys, generous spacing, one accent colour |
| Familiar | Standard phone/desktop calculator layout, so a first-time user needs no instructions (NFR-03) |
| Trustworthy | The display always shows what is happening: current number, pending operation, clear error text |
| Usable by keyboard and by touch | Real `<button>` elements, keys of 48 px or more, full keyboard map (FR-13) |
| Usable by everyone | WCAG 2.1 AA targets (NFR-04) |
| Simple to build | One page, one column, plain CSS grid, no icons or images (the `⌫` and `±` are text characters) |

## 2. Wireframe

### 2.1 Layout (desktop and phone use the same layout)

```
┌──────────────────────────────────────────┐
│                                      7 + │   expression line   (small, grey)
│                                        8 │   main display      (large, right-aligned, live region)
│                     Cannot divide by zero│   error line        (red, only in Error state)
│                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │  C   │ │  ⌫   │ │  ±   │ │  ÷   │     │   function keys (grey)   operator keys (light blue)
│  └──────┘ └──────┘ └──────┘ └──────┘     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │  7   │ │  8   │ │  9   │ │  ×   │     │   digit keys (white)
│  └──────┘ └──────┘ └──────┘ └──────┘     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │  4   │ │  5   │ │  6   │ │  −   │     │
│  └──────┘ └──────┘ └──────┘ └──────┘     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │  1   │ │  2   │ │  3   │ │  +   │     │
│  └──────┘ └──────┘ └──────┘ └──────┘     │
│  ┌─────────────────┐ ┌──────┐ ┌──────┐   │
│  │        0        │ │  .   │ │  =   │   │   zero is double width; equals is the only strong accent
│  └─────────────────┘ └──────┘ └──────┘   │
└──────────────────────────────────────────┘
  ▸ Keyboard                                   native <details> help, closed by default
```

4 columns × 5 rows = 18 keys (percent was removed by decision D10). This is the familiar layout of common phone and desktop calculators ([review](../02-research-requirements/calculator-review.md) L9, L11; the team has not compared screenshots of the other products).

### 2.2 Screen regions

| Region | Content | Behaviour |
|---|---|---|
| Expression line | The pending operation, for example `7 +` (FR-16, Should) | Visual only (`aria-hidden`), because the main display already announces the number |
| Main display | The current number or the result | An `<output>` element, which is a live region. One line, right-aligned, tabular figures so digits do not jump |
| Error line | A short message, for example `Cannot divide by zero` or `Number too large` | Only filled in the Error state. Announced (`role="alert"`) |
| Keys | 20 buttons in a grid | Described in section 4 |
| Help | `<details>` titled "Keyboard" | Lists the keys and states the rule `2 + 3 × 4 = 20` (D1) |

The display has a **fixed height**, so the keys never move when an error appears. (A first version of the mock-up had a variable display height and the keys shifted by about 9 px between the normal and error frames; this was found by looking at the screenshots and was fixed.)

## 3. Visual prototype

The static mock-up is [`visual-prototype.html`](visual-prototype.html). Open it in a browser. It contains no JavaScript and does not calculate.

It shows three frames: **A** normal typing (`7 +`, display `8`), **B** the Error state, and **C** a 320 px wide phone frame. Screenshots taken on 2026-10-31 with headless Microsoft Edge:

- `evidence/screenshots/2026-10-31-visual-prototype-desktop.png`
- `evidence/screenshots/2026-10-31-visual-prototype-320px.png` (the page shown inside a 320 px wide frame)

What the screenshots confirm: the keys keep their positions between normal and error states; at a 320 px wide viewport there is no horizontal scrolling and all four columns are visible. What they do **not** confirm: behaviour in Firefox or Chrome, high zoom, touch use, a screen reader, or dark mode.

### 3.1 Visual design tokens (proposed)

| Token | Value | Use |
|---|---|---|
| Font | `system-ui, "Segoe UI", Roboto, Arial, sans-serif` | No web fonts, so it works offline and loads instantly |
| Display font size | `clamp(2rem, 9vw, 3rem)`, weight 600 | Large and legible; shrinks on small screens |
| Key font size | 1.375 rem | |
| Key size | Height at least 56 px, width at least 48 px, gap 8 px, radius 12 px | Target size, section 6 |
| Panel / page / digit / function / operator colours | `#F3F5F9` / `#DDE2EA` / `#FFFFFF` / `#E3E7EE` / `#DCE6FB` | |
| Text / secondary text / operator text / error | `#111827` / `#4B5563` / `#1E3A8A` / `#B91C1C` | |
| Equals key | `#1D4ED8` with white text | Single accent |
| Key border | 1 px `#6B7280` | Makes every key visible without relying on fill colour |
| Focus ring | 3 px `#111827`, offset 3 px | Visible on every key and on the page |
| Motion | None needed. A `prefers-reduced-motion` rule disables any transition | NFR-04(f) |

## 4. Interaction design

### 4.1 Key behaviour summary

All behaviour is defined by the [state diagram](architecture.md#5-state-diagram). The UI adds only feedback:

| Event | Visual feedback |
|---|---|
| Hover | Key becomes slightly darker |
| Press (`:active`) | Key becomes darker. No movement, no sound |
| Keyboard focus | Visible focus ring (`:focus-visible`), so mouse users do not see rings after a click |
| Error | Red message below the number, text only (colour is **not** the only signal) |
| Invalid key (for example a 13th digit) | Nothing happens. The unchanged display is the feedback |

### 4.2 Error messages (proposed wording, plain English)

| Situation | Text |
|---|---|
| Division by zero | `Cannot divide by zero` |
| Result too large | `Number too large` |

The text must say what happened, not use a code. After an error: a digit or `C` returns to normal ([architecture 5](architecture.md#5-state-diagram)).

## 5. Keyboard map (FR-13)

Physical key presses are translated to the engine's key names in `app.js` only. Keys combined with Ctrl, Alt or Meta are never intercepted, so browser shortcuts such as Ctrl+R still work.

| Physical key | Action | Notes |
|---|---|---|
| `0`-`9` (main row and numeric keypad) | Digit | |
| `.` | Decimal point | |
| `,` | Decimal point (alias) | Approved 2026-10-31 if safe. The display always shows a period. Tested in `tests/keymap.test.js` |
| `+` `-` `*` `/` | Operators | |
| `Enter` or `=` | Equals | `preventDefault` so that Enter does not also "click" a focused button a second time |
| `Backspace` | Delete last digit | |
| `Escape` | Clear | |
| `Tab` / `Shift+Tab` | Move focus between keys | Native, in visual order, left to right and top to bottom |
| `Space` / `Enter` on a focused key | Press that key | Native button behaviour |

**Known conflict to design for:** when a button has focus, pressing `Enter` normally clicks that button. If our code also handles `Enter` as "equals", a focused `7` key might type 7 *and* calculate. Resolution (to test in Phase 3): the global key handler ignores key events whose target is a button, so native button behaviour applies to a focused button, and the shortcut keys apply otherwise.

## 6. Accessibility review of the design (WCAG 2.1 AA)

Method: the checklist of the `design:accessibility-review` skill, applied to the wireframe and mock-up. Source thresholds are from the W3C pages listed in the [review](../02-research-requirements/calculator-review.md#8-references).

### 6.1 Colour contrast (calculated with a script on 2026-10-31)

Ratios use the WCAG relative-luminance formula. Values are unrounded in the script and shown here to two decimals.

| Element | Foreground | Background | Ratio | Required | Pass |
|---|---|---|---|---|---|
| Main display text | `#111827` | `#F3F5F9` | 16.25 : 1 | 4.5 : 1 (1.4.3) | Yes |
| Expression line | `#4B5563` | `#F3F5F9` | 6.92 : 1 | 4.5 : 1 | Yes |
| Digit key text | `#111827` | `#FFFFFF` | 17.74 : 1 | 4.5 : 1 | Yes |
| Function key text | `#111827` | `#E3E7EE` | 14.30 : 1 | 4.5 : 1 | Yes |
| Operator key text | `#1E3A8A` | `#DCE6FB` | 8.26 : 1 | 4.5 : 1 | Yes |
| Equals key text | `#FFFFFF` | `#1D4ED8` | 6.70 : 1 | 4.5 : 1 | Yes |
| Error text | `#B91C1C` | `#F3F5F9` | 5.93 : 1 | 4.5 : 1 | Yes |
| Page help text | `#111827` | `#DDE2EA` | 13.64 : 1 | 4.5 : 1 | Yes |
| Key border vs panel | `#6B7280` | `#F3F5F9` | 4.43 : 1 | 3 : 1 (1.4.11) | Yes |
| Key border vs function key | `#6B7280` | `#E3E7EE` | 3.90 : 1 | 3 : 1 | Yes |
| Key border vs operator key | `#6B7280` | `#DCE6FB` | 3.86 : 1 | 3 : 1 | Yes |
| Focus ring vs panel | `#111827` | `#F3F5F9` | 16.25 : 1 | 3 : 1 | Yes |
| Focus ring vs page | `#111827` | `#DDE2EA` | 13.64 : 1 | 3 : 1 | Yes |

These ratios are for the proposed colours only. They must be re-checked if a colour changes, and again on the built page (for example with Lighthouse, planned in Phase 3). Dark mode is not designed (open question O8).

### 6.2 Checklist

| WCAG criterion | Level | How the design meets it | Status |
|---|---|---|---|
| 1.4.3 Contrast (Minimum) | AA | Table above | Designed, calculated |
| 1.4.11 Non-text Contrast | AA | Key borders 3.86-4.43 : 1, focus ring above 13 : 1 | Designed, calculated |
| 1.4.10 Reflow (320 px) | AA | Fluid 4-column grid, no fixed widths, wrapping display | Looked at once in Edge; to test in all three browsers |
| 1.4.4 Resize text (200 %) | AA | `rem` units | **Not checked.** Phase 3 |
| 2.1.1 Keyboard | A | Native buttons plus key map | To test |
| 2.4.3 Focus Order | A | DOM order equals visual order (left to right, top to bottom) | Designed |
| 2.4.7 Focus Visible | AA | 3 px ring, `:focus-visible` | Designed |
| 2.5.5 Target Size (Enhanced) | **AAA** | Keys at least 48 × 56 px. Not required for AA; used as a quality target | Designed (the mock-up keys render about 59 × 56 px in the 320 px frame; not measured by a tool) |
| 2.5.8 Target Size (Minimum) | AA, WCAG 2.2 | 24 px minimum is exceeded | Designed |
| 3.3.1 Error Identification | A | Text message names the problem | Designed |
| 4.1.2 Name, Role, Value | A | `<button>`; names: "Clear", "Delete last digit", "Change sign", "Divided by", "Times", "Minus", "Plus", "Equals", "Decimal point". Digit keys use their digit as the name | Designed |
| 4.1.3 Status Messages | AA | Display is `<output>` (live region); error text has `role="alert"` | **To test with a screen reader** |
| Language | A | `<html lang="en">` | Designed |
| Colour not the only signal | A | Errors have words as well as red | Designed |
| Reduced motion | AAA-style good practice | No animation; rule included | Designed |

### 6.3 Risks and findings to carry into Phase 3

| # | Finding | Severity | Recommendation |
|---|---|---|---|
| A1 | A live region that speaks after every digit may be noisy, but a silent display would be useless to a blind user. Windows Calculator announces the display as "Display is %1" ([review](../02-research-requirements/calculator-review.md) L8) | Medium | Start with `aria-live="polite"` on the display and test with NVDA (Windows) and VoiceOver if available. Adjust only after real testing |
| A2 | `×`, `÷`, `−`, `⌫`, `±` may be read inconsistently by screen readers | High if unlabelled | Give them `aria-label` words (done in the mock-up) |
| A3 | Enter on a focused button vs shortcut `Enter` (section 5) | Medium | Handler rule + test |
| A4 | Display overflow with long numbers or large text sizes | Medium | Wrap rule in CSS; test with 12-digit numbers and 200 % zoom |
| A5 | Mock-up is light mode only. Users with a dark system theme may expect dark mode | Low | Out of scope (W-03, decision D15: light mode only) |
| A6 | `title` tooltips are not used (unreliable on touch and keyboard) | Info | The "Keyboard" `<details>` help replaces them |

## 7. Usability principles applied

General practice, not tied to a cited source:

1. **Recognition over recall.** The layout is the familiar calculator grid.
2. **Visible state.** The expression line shows what is pending; errors say what is wrong.
3. **Forgiveness.** Backspace and Clear exist; a second operator replaces the first; a repeated decimal point is ignored; recovery from an error needs one key.
4. **Consistency.** Same key, same colour group, same position at all times (fixed display height).
5. **Restraint.** No history, themes or memory keys (Won't have list), as the professor asks for a very simple application.
6. **Honest feedback.** Ignored keys do nothing silently; the state diagram says exactly which ones.

## 8. Alternatives considered

| # | Decision | Chosen | Alternatives | Why chosen |
|---|---|---|---|---|
| 1 | Layout | 4 × 5 standard grid | Wide scientific layout; a typed-expression box like Google's | Familiar; works at 320 px; matches "basic operations" |
| 2 | Key count | 18 keys (no percent, decision D10) | 20 keys with `%` | `%` has context-dependent behaviour on real calculators; the project lead removed it to keep the app very simple |
| 3 | Colours | Neutral + one blue accent | Many coloured keys; dark theme | Clean, high contrast, one theme to test |
| 4 | Icons | Text characters | SVG icons / icon font | No image or font files, no extra accessible-name work |
| 5 | Help | Native `<details>` | Modal dialog; tooltips | No focus trap, keyboard and screen-reader support are built in |
| 6 | Frameworks and CSS libraries | None | Bootstrap, Tailwind, React | Offline, zero dependencies (professor: very simple) |
| 7 | Display | `<output>` live region | Plain `<div>` | Built-in live-region semantics, less ARIA code |

## 9. Open questions and answers

| # | Question | Answer |
|---|---|---|
| O7 | Accept `,` as a decimal point? | **Yes, as a keyboard alias** (2026-10-31) |
| O8 | Dark mode? | **No** (D15) |
| O9 | Is the grey-and-blue scheme acceptable? | **Yes** (D15). Team review still welcome |
| O10 | Error wording (`Cannot divide by zero`, `Number too large`, `Number too small`) | Implemented as proposed. Open for team review |
| O11 | Figma? | **No**, static HTML (D13) |
