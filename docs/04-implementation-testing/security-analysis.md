# Security Analysis (short)

**Status:** v0.2, final for Phase 4 (2026-10-31). Written from the source code, the automated tests and browser checks (Edge, Chrome, Firefox) listed below. **This is an AI review. No human security review has taken place yet** (see section 8). It answers the professor's request for "security analyses" (slide 5) in proportion to a small offline page.
**Last updated:** 2026-10-31
**Scope:** `src/` as committed in `602e34a` plus the Phase 4 fix (BUG-1), in the Phase 4 commit. Not in scope: the operating system, the browser itself, the team's laptops.

## 1. What is being protected

| Asset | Value | Where it lives |
|---|---|---|
| Correct results | The product's purpose (driving question) | `engine.js`, `format.js` |
| The user's browser session | Must not be harmed by our page | n/a |
| Personal data | **None is collected, stored or sent** | n/a |
| The team's repository | Source integrity, no secrets | Git |

## 2. The application's shape (why the attack surface is small)

- Static files opened from disk. No server, no database, no accounts, no network requests (tested: reloading made 6 requests, all to local files).
- No dependencies at run time or in `package.json`. The test tools use only Node.js built-ins and the browser already installed. So there is **no third-party code** to be compromised and nothing for `npm audit` to check.
- The only input is key presses and clicks. They are turned into one of 19 known key names; anything else is ignored.
- Nothing is stored: no cookies, no `localStorage`, no files.

## 3. Threat review

| # | Threat | How it could happen | Control in the design | Evidence | Residual risk |
|---|---|---|---|---|---|
| S1 | Code injection through input | Input evaluated as code (`eval`, `Function`) | Arithmetic uses four small functions. No parser, no `eval`, no `Function` | `security.test.js` scans all JS (comments excluded). Browser check: `eval()` is blocked by the CSP (Edge, Chrome; not testable through the Firefox driver) | Low |
| S2 | Cross-site scripting (HTML injection) | Dynamic text written with `innerHTML` | Display text is written with `textContent` only. All text comes from our own formatter | `security.test.js` (no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`) | Low |
| S3 | Malicious or tampered third-party script | CDN script, library | None are used. CSP allows only our own files | `security.test.js` (no outside URLs); browser check: a script from another site is blocked (Edge, Chrome, Firefox) | Low |
| S4 | Injected inline script | Attacker edits the DOM or page | CSP `script-src 'self'` blocks inline scripts | Browser check in all three browsers: the injected inline script did not run and the browser raised a `securitypolicyviolation` event | Low (local file, no remote attacker model) |
| S5 | Data leakage | Network calls, storage | `default-src 'none'` forbids connections; no storage APIs | `security.test.js`; Edge and Chrome: only local requests; Firefox: works with all web access blocked | None found |
| S6 | Denial of service by input flood | Holding a key, very long input, thousands of operations | Entry limited to 12 digits; each key is O(1); state is replaced, not grown | Tests: 500-digit input, 5,000 chained additions, repeated overflow and underflow; about 970,000 random key presses | Low |
| S7 | Wrong result presented as right (integrity of results) | Floating-point artifacts, overflow, underflow, `-0`, `NaN` | Error states with messages; formatter refuses non-finite numbers; rounding only for display | 88 unit tests, 2,000 random chains compared with a reference model, boundary tests, three browsers; BUG-1 (`-07` display) found and fixed | **Known limit L1** (`0.1+0.2-0.3` shows `5.55e-17`): a documented display effect, not a vulnerability |
| S8 | Keyboard hijacking | Page intercepts browser shortcuts | Key map ignores keys with Ctrl, Alt or Meta; unused keys are left to the browser | `keymap.test.js`; browser check (Ctrl+C and F5 not blocked) | Low |
| S9 | Clickjacking | Page framed by another site | Not applicable for a local file. A `<meta>` CSP cannot set `frame-ancestors` | n/a | Not applicable now; if the page is ever hosted, set the header on the server |
| S10 | Supply-chain risk from development tools | Installing packages | Nothing installed. No packages were added in any phase | `package.json` has no dependencies | None |
| S11 | Secrets committed to Git | Keys, tokens | None exist. `.gitignore` excludes local settings | Text search before each commit; `git status` review | Low (human check recommended) |

## 4. Content Security Policy review

Policy in `src/index.html` (a `<meta>` tag):

```
default-src 'none'; script-src 'self'; style-src 'self'; base-uri 'none'; form-action 'none'
```

| Directive | Effect | Assessment |
|---|---|---|
| `default-src 'none'` | Everything not listed is forbidden: images, fonts, connections, frames, objects, media | Good: the page needs none of them |
| `script-src 'self'` | Only scripts loaded from our own files; no inline scripts; no `eval` | Good. Verified in the browser |
| `style-src 'self'` | Only our stylesheet; inline `style=""` attributes blocked | Good. The app sets no inline styles (it toggles classes and `data-` attributes) |
| `base-uri 'none'` | No `<base>` tag can redirect relative URLs | Good |
| `form-action 'none'` | No form submissions | Good (no forms exist) |

Observations and limits:

1. **`'self'` from `file://`:** it worked in Microsoft Edge 156, Google Chrome 156 **and Mozilla Firefox 159**: the page loaded, all scripts ran, the policy blocked an injected inline script and a script from another site, and the browsers raised `securitypolicyviolation` events. All three were headless and automated. Safari was not tested, and a human should repeat the check in a normal Firefox window.
2. A `<meta>` policy applies only to content after the tag. Our scripts are all after it. If the page were hosted, an HTTP header is stronger and could add `frame-ancestors`.
3. The CSP is **defence in depth**: the code has no known injection path even without it.
4. The help text and all labels are static HTML; none comes from user input.

## 5. Input limits and error handling

| Control | Value | Where |
|---|---|---|
| Typed number | at most 12 digits (sign and point not counted) | `engine.js`, FR-12 |
| One decimal point per number | enforced | `engine.js`, FR-02 |
| Allowed key names | 19; others ignored (no exception) | `engine.js` `press()` |
| Division by zero | Error state, message, recovery | `engine.js`, FR-09 |
| Overflow and underflow | Error state (`Number too large`, `Number too small`) | `engine.js`, FR-11 |
| Non-finite number to the display | throws `RangeError` (cannot happen through the engine; tested) | `format.js` |
| Keys with Ctrl, Alt, Meta | not handled | `keymap.js` |

No `try/catch` is needed because no function throws in normal use. If an unexpected exception did occur, the browser would show it in the console and the calculator would keep its last state.

## 6. Offline operation

Checked in the browser: in Edge, opening the page and reloading it made exactly 6 requests (`index.html`, `styles.css`, four scripts), all `file:` URLs; Chrome made at least 6, all local. No fonts, images, icons or analytics are requested. Firefox does not report sub-resource requests for local files, so its test profile **blocks all web access** (a proxy on a dead port); the calculator loads and calculates normally there. The page therefore works without internet.

## 7. Findings from this review

| # | Finding | Severity | Status |
|---|---|---|---|
| F1 | BUG-1: backspacing `-0.5` to `-0` showed `-0` and then `-07` after typing 7 | Low (wrong display, not a vulnerability) | **Fixed** with regression tests |
| F2 | Firefox CSP behaviour from `file://` unknown | Medium | **Resolved by test in Firefox 159 (headless)**: the page works and the policy is enforced. A human should repeat it in a normal window |
| F3 | Screen-reader behaviour of `aria-live` and `role="alert"`. Investigated: an error changes two live regions (polite `Error`, assertive `Cannot divide by zero`); different texts, so not a repeat, but two announcements (test report A6.3) | Low | **Open**: needs a human with NVDA or VoiceOver; code unchanged |
| F4 | No `frame-ancestors` (cannot be set in a meta tag) | Info | Not applicable for a local file |

No injection path, data leak or dependency risk was found. A final review pass (Phase 4 finalisation) found nothing new.

## 8. What this analysis is not

- **Not a penetration test.** Nobody tried to attack the page except through the checks listed.
- **Not a human review.** The AI assistant wrote the code and this analysis. A student (provisionally Student 5, see the [team checklist](team-review-checklist.md)) must read the code against this table and sign it off.
- **The built-in `security-review` skill did not run** in this session: it failed to start because the repository has no `origin` remote. The review above was done manually with the `engineering:code-review` checklist and the automated tests. It is not a result of that skill.
- Sources for the web-security terms used (CSP, XSS) were not part of the Phase 2 reading list. Before the final report cites them, read and cite an official source (for example the W3C CSP specification or MDN).
