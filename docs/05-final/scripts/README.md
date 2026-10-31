# Phase 5 build and check scripts

**Last updated:** 2026-11-01
**Status:** Tooling written by the AI assistant (Claude Code) to produce and check the DRAFT report and slides. Not part of the calculator. Windows only, with Microsoft Word and PowerPoint installed (they are driven through COM automation). Not needed to run or test the calculator.

| Script | What it does |
|---|---|
| `report_spec.py` | Reads the project documents, source and tests and writes the report content as a JSON file. Run: `python report_spec.py <project folder> <output.json>` |
| `build_docx.ps1` | Builds the Word report from that JSON through Word, and writes a PDF copy. Parameters: `-SpecPath`, `-OutDocx`, `-OutPdf` |
| `deck_spec.py`, `deck_corrections.py` | Write the slide content and speaker notes as JSON (`deck_spec.py` first, then `deck_corrections.py <folder> <figures folder>`) |
| `build_pptx.ps1` | Builds the PowerPoint from that JSON through PowerPoint and exports slide images. Parameters: `-SpecPath`, `-OutPptx`, `-PngDir` |
| `demo-check.cjs` | Runs the live-demo script in order in one real Edge session and checks every result. Run: `node demo-check.cjs <project folder>` (Edge must be installed) |
| `word_pagefill.ps1`, `pptx_check.ps1` | Report pages and fill per page in Word; slide count, notes, font sizes and bounds in PowerPoint |

The diagrams and screenshots in `../figures/` are already produced; their generator scripts are not included. The generated files are the deliverables; editing them directly in Word and PowerPoint is the normal way to finish them. Rebuilding with these scripts would overwrite any edits the students have made.
