# Screenshot evidence

Real screenshots only. Each entry says how it was made, so anyone can repeat it.

## Phase 2: static visual prototype (2026-10-31)

| File | What it shows |
|---|---|
| `2026-10-31-visual-prototype-desktop.png` | `docs/03-design-prototype/visual-prototype.html` at about 1150 px wide |
| `2026-10-31-visual-prototype-320px.png` | The same page inside a 320 px wide `<iframe>` (a headless browser window cannot be narrower than about 500 px, so a plain 320 px window would crop the page instead of reflowing it) |

- **Made with:** headless Microsoft Edge, `msedge --headless --disable-gpu --hide-scrollbars --window-size=W,H --screenshot=FILE URL`.
- **Prototype version shown:** `visual-prototype.html` with SHA-256 `23561e24e5d335c07390eea0dc4c165e750fb85bf2d15e4b1d8de1747b7e2b8e` (18-key layout, no percent key, error state shows `Error`). If `sha256sum docs/03-design-prototype/visual-prototype.html` gives a different value, the screenshots are out of date and must be taken again.
- An earlier pair of screenshots with a percent key and a variable-height display was replaced on 2026-10-31 because the design changed.
