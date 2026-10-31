# Screenshot evidence

Real screenshots only, taken on **2026-10-31** from the **current** files. Each entry says how it was made so that anyone can repeat it.
The two hashes below identify the exact files that were photographed. `node tests/docs-check.js` fails if any of those files has changed since,
which means the screenshots must be retaken. To print the current hashes: `node tests/docs-check.js --print-hashes`.

APP-SOURCE-HASH: dc8a2164f5956733c09a4f30d4506ce9bd60548115e835e5e4396269f52b9658
PROTOTYPE-HASH: 2a96660d5b4a2a894387647f939f62f6ddb9745a7c01063fdf065bc26779556b

(APP-SOURCE-HASH covers `src/index.html`, `src/css/styles.css` and the four files in `src/js/`, with line endings normalised. PROTOTYPE-HASH covers `docs/03-design-prototype/visual-prototype.html`.)

## A. The working application (taken by `node tests/browser-check.js --shots`)

Edge 156 (headless) writes the files below. Firefox 159 (headless, `--firefox --shots`) writes the same names with `-firefox` before `.png`, except the focus picture (see the note).

| File | State shown | Viewport |
|---|---|---|
| `2026-10-31-app-typing-320px.png` | After `7 + 8`: display 8, small line `7 +` | 320 px wide |
| `2026-10-31-app-error-320px.png` | After `5 ÷ 0 =`: `Error` and `Cannot divide by zero` | 320 px wide |
| `2026-10-31-app-typing-desktop.png` | After `7 + 8` | 1280 px wide |
| `2026-10-31-app-error-desktop.png` | After `5 ÷ 0 =` | 1000 px wide |
| `2026-10-31-app-zoom400-320x256.png` | Emulated browser zoom 400 %: a 320 x 256 CSS-pixel viewport at 4x density, after `7 + 8`. The page scrolls vertically here, which is allowed | 320 x 256 |
| `2026-10-31-app-text200-320px.png` | Text size 200 % at 320 px width, after `7 + 8` | 320 px wide |
| `2026-10-31-app-focus-desktop.png` | Keyboard focus ring on the `7` key (a fresh page, so the display shows 0). **Edge only.** Not produced for Firefox: the automated Firefox window has no keyboard focus, so a picture without a ring would mislead | 1000 px wide |

The Firefox 159 files (same states and viewports as the rows above):
`2026-10-31-app-typing-320px-firefox.png`, `2026-10-31-app-error-320px-firefox.png`, `2026-10-31-app-typing-desktop-firefox.png`,
`2026-10-31-app-error-desktop-firefox.png`, `2026-10-31-app-zoom400-320x256-firefox.png`, `2026-10-31-app-text200-320px-firefox.png`.

Notes: zoom and text size are **emulated** (browser protocol and root font size), not set through the browser menu. Both browsers are headless.

## B. The static visual prototype (Phase 2, taken with headless Edge)

`msedge --headless --disable-gpu --hide-scrollbars --window-size=W,H --screenshot=FILE URL`

| File | What it shows |
|---|---|
| `2026-10-31-visual-prototype-desktop.png` | `docs/03-design-prototype/visual-prototype.html` at about 1150 px wide |
| `2026-10-31-visual-prototype-320px.png` | The same page inside a 320 px wide `<iframe>` (a headless window cannot be narrower than about 500 px, so a plain 320 px window would crop the page instead of reflowing it) |

## C. History

An earlier pair of prototype screenshots (with a percent key and a variable-height display) was replaced in Phase 2 because the design changed. Phase 3 and Phase 4 screenshots of the application were retaken in the final Phase 4 runs; nothing older is kept.
