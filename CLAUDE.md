# CLAUDE.md

## Project Overview

This repository contains a **Monte Carlo (Labouchère) Betting Tool** — a single-page, self-contained HTML application that implements the Monte Carlo (cancellation) betting system. The UI is in Japanese. The tool runs entirely in the browser with no server-side dependencies.

### What the Tool Does

The Labouchère system works as follows:
1. The user provides an initial number sequence (e.g., `1 2 3 4`) and a unit bet amount.
2. Each round, the bet is the sum of the first and last numbers in the sequence (or the single remaining number).
3. On a **win**, the first and last numbers are removed from the sequence.
4. On a **loss**, the bet amount (in units) is appended to the end of the sequence.
5. The process repeats until the sequence is empty (target profit achieved).

## Repository Structure

```
depa/
├── CLAUDE.md                              # This file
└── モンテカルロ法ベッティングツール.html     # The entire application (single HTML file)
```

This is a single-file project. All HTML, CSS, and JavaScript are contained in one `.html` file.

## Technology Stack

- **Pure HTML5 / CSS / vanilla JavaScript** — no frameworks, no build tools, no dependencies
- The JavaScript uses an IIFE pattern `(function() { ... })()` to avoid polluting the global scope
- ES5-compatible syntax (`var`, `function`, `.forEach`) — no ES6+ features used
- Mobile-responsive design via CSS media queries (`@media (max-width: 600px)`)

## Key Code Sections (within the HTML file)

| Section | Lines | Description |
|---------|-------|-------------|
| `<style>` | ~21–109 | All CSS — responsive layout, button styles, table styles |
| Setup form | ~119–125 | Initial input form (sequence + unit value) |
| Betting area | ~127–154 | Main game UI — current state, bet display, win/lose/reset buttons, history table |
| `<script>` | ~157–281 | All application logic |

### Important JavaScript Functions

- **`parseSequence(str)`** — Parses comma/space-separated input into an array of positive integers
- **`getNextBetUnits()`** — Returns the next bet: sum of first + last element (or single element)
- **`updateDisplay()`** — Refreshes all UI elements and disables buttons when the sequence is empty
- **`recordHistory(betUnits, outcome)`** — Appends a row to the history table and updates cumulative profit

### Event Handlers

- **Start button** — Validates inputs, initializes state, switches from setup form to betting area
- **Win button** — Removes first and last sequence elements, records win
- **Lose button** — Appends bet to sequence, records loss
- **Reset button** — Clears all state, returns to the setup form

## Development Workflow

### No Build Step Required

This is a zero-dependency, single-file application. To develop or test:

1. Open the `.html` file directly in a browser
2. Edit the file in any text editor
3. Refresh the browser to see changes

There is no package manager, bundler, linter, test suite, or CI/CD pipeline.

### File Naming

The HTML file uses a Japanese filename (`モンテカルロ法ベッティングツール.html`). Note that this uses Unicode (UTF-8) characters with NFD normalization, which can cause issues with some shells and tools. Use glob patterns (`*.html`) when referencing the file in shell commands to avoid encoding problems.

## Conventions

- **Language**: All user-facing text is in **Japanese**. Maintain this convention when modifying UI text.
- **Code style**: ES5 syntax, `var` declarations, no semicolons omitted, 4-space indentation.
- **No external dependencies**: The application is fully self-contained and works offline. Do not introduce external libraries, CDNs, or build tools without explicit approval.
- **DOM access**: Elements are cached in variables at the top of the IIFE for reuse throughout the script.
- **State management**: Application state (`sequence`, `unitValue`, `totalProfit`, `stepCount`) is managed via closure variables within the IIFE.

## Common Tasks

### Adding a new feature to the UI
1. Add HTML markup inside the appropriate `<div>` (`setupForm` or `bettingArea`)
2. Add styling in the `<style>` block
3. Add JavaScript logic inside the existing IIFE in the `<script>` block
4. Cache any new DOM element references alongside the existing `var` declarations (~lines 164–175)

### Modifying the betting algorithm
The core logic is in `getNextBetUnits()` (~line 184) and the win/lose click handlers (~lines 224–245). Changes to the Labouchère rules should be made there.
