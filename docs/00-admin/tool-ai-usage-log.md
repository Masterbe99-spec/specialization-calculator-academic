# Tool and AI Usage Log

**Purpose:** An honest record of the tools, skills and AI assistance used in this project, so the final documentation can say exactly how the work was done. Only things that actually happened are listed. Planned items are marked **Planned**.
**Last updated:** 2026-10-31

**AI assistant used:** Claude Code (model: Sonnet 5.5), working on the project lead's computer under the project lead's instructions. All AI output is a draft. The team must review, understand and be able to explain it, and the professor's AI policy (open question Q4) must be checked.

## 1. Usage entries

| # | Date | Tool or skill | Purpose | What it produced or did | Human review |
|---|---|---|---|---|---|
| 1 | 2026-10-31 | Claude Code, PowerShell and file-reading tools | Read the professor's presentation (copied the file to a temporary folder outside the project, unzipped it, read slide text and the images) | Extracted text of 37 slides and checked the images (university logo, a Polish PBL roadmap) | Project lead reviewed the resulting analysis |
| 2 | 2026-10-31 | Claude Code (AI assistant) | Analysis and project plan: requirements checklist, overview, project card, requirements, scope, WBS, schedule, architecture and testing approach, task split, risks, folder structure | A plan shown in the chat, not saved as a file | Project lead approved it with adjustments (D1-D4, skills, Playwright later) |
| 3 | 2026-10-31 | Claude Code, inspection of environment | Check available skills, plugins and servers | Found Superpowers v7.0.0 and Context7 v1.0.4 installed but disabled for this project. Found no installed `ui-ux-pro-max`, `web-design-guidelines`, `playwright-cli` or `design-taste-frontend` | Findings reported to the project lead |
| 4 | 2026-10-31 | `claude plugin enable ... --scope local` (run twice) | Enable Superpowers and Context7, as approved | Both reported as successfully enabled at local scope. `.claude/settings.local.json` was created | Approved by project lead beforehand |
| 5 | 2026-10-31 | Skill `engineering:documentation` (**invoked**) | Structure for README and planning documents | Guidance applied while writing Phase 1 documents | Pending team review |
| 6 | 2026-10-31 | Skill `engineering:architecture` (**invoked**) | Decision-record format for the decision log | ADR-style entries D1-D8 | Pending team review |
| 7 | 2026-10-31 | Claude Code, PowerShell | `git init -b main`, creation of the folder structure | Empty repository, folders, `.gitkeep` files, `.gitignore` | Pending project lead review |
| 8 | 2026-10-31 | Claude Code (AI assistant) | Write Phase 1 documents: README, project card, requirements specification, traceability matrix, WBS, Gantt, responsibility matrix, risk register, decision log, this log | The files listed in the Phase 1 report | **Pending review by all five team members** |
| 9 | 2026-10-31 | `claude plugin list` (CLI) | Verify Superpowers and Context7 after the restart requested by the project lead | Both listed as enabled (project and local scope). **But** Superpowers skills do not appear in this session's skill list, and a tool search for Context7 returned no Context7 tools. So they are enabled in settings but **not usable in this session** | Result reported to the project lead |
| 10 | 2026-10-31 | Git, PowerShell/Bash read-only checks | Git configuration, OneDrive risk, secrets and temporary-file check before the first commit | `.git` is inside OneDrive; user name and email set; `core.autocrlf=true`; `.claude/settings.local.json` is git-ignored; text search found no secrets. Added `.gitattributes` (`text=auto`) | Pending project lead review |
| 11 | 2026-10-31 | Claude Code (AI assistant) | Phase 1 finalisation: working-time log template, communication and meeting rules, consistency corrections | `time-log.md` (hours blank), `team-communication-rules.md` (proposal), edits to README, traceability, risk register, decision log | **Pending review by all five team members** |

## 2. Availability of tools and skills

Status is only "available" when it has been checked. "Not yet verified" means it has not been seen working.

| Tool or skill | Status | How it was checked | Used so far |
|---|---|---|---|
| Git 2.56 | Available | `git --version` | Yes (`git init`) |
| Node.js 24 | Available | Found on the system path | No |
| Claude Code skills `engineering:documentation`, `engineering:architecture` | Available | Listed in the session and invoked | Yes |
| Superpowers v7.0.0 (skills include `test-driven-development`, `systematic-debugging`, `verification-before-completion`) | **Enabled in settings; NOT available in the session checked (2026-10-31, after restart)** | `claude plugin list` shows enabled at project and local scope. The session's skill list contains no Superpowers skills. Cause not diagnosed | **No** |
| Context7 v1.0.4 (documentation server at `mcp.context7.com`) | **Enabled in settings; NOT available in the session checked (2026-10-31, after restart)** | `claude plugin list` shows enabled. A tool search for Context7 found no Context7 tools. No library-documentation query was made. Phase 2 needs no library documentation (no frameworks), so nothing was lost | **No** |
| Playwright | **Not installed. Planned** | Not checked, no installation was done | No |
| `ui-ux-pro-max`, `web-design-guidelines`, `playwright-cli`, `design-taste-frontend`, `frontend-design` | Not installed | Not found in the active session or the installed plugins | No |

### Verification checklist (to complete in the next session)

- [x] After restarting, check for Superpowers skills: **not found** in this session (2026-10-31).
- [x] Check for Context7 tools: **not found** in this session (2026-10-31).
- [ ] Next step for the project lead: run `/plugin` or `/mcp` in a fresh terminal session, or `claude --debug`, and report why they do not load. Then repeat this check.
- [ ] Record the new result here, with the date.
- [ ] Before using a skill for the first time, add an entry to section 1.

## 3. Rules for this log

1. Add an entry whenever a tool, skill or AI assistant is used for project work.
2. Never record a skill as used unless it was actually invoked.
3. Record human review honestly. "Pending" stays until a named team member has reviewed the output.
4. Do not paste secrets or personal data.
