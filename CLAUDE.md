# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The website for the **Semiconductor Chip Design Club (SCDC)** at SRM Institute of Science
and Technology, Kattankulathur. It combines a public club site with a set of interactive
semiconductor learning activities and time-gated weekly challenges backed by Supabase.

## Commands

```bash
npm run dev        # start dev server (Vite HMR)
npm run build      # production build
npm run preview    # preview production build
npm run lint       # ESLint
```

There is no test suite.

Stack: React 19 + Vite + Tailwind CSS v3 + React Router v7. Supabase for challenge results
only. Deployed on Vercel, auto-deploys from `main`.

---

## HARD RULES — do not violate

1. **Never invent factual content.** No event names, dates, member names, roles, statistics,
   or claims about the club, its history, or its achievements. Where real copy is needed,
   insert `{/* TODO: content pending */}` and stop. All factual content comes from the user
   and lives in `src/data/`.

2. **Never modify challenge scoring or submission logic.** Files under
   `src/activities/week-activities/` are live — students have already submitted results
   against them. Layout and styling changes are fine; scenario arrays, score weights,
   Supabase inserts, and the one-attempt `localStorage` guard are not.

3. **Never change `/challenges` routes.** Those URLs have been shared with students and
   must keep working.

4. **Never commit new secrets.** The Supabase anon key in `src/lib/supabase.js` is public
   by design; do not add service-role keys or any other credentials.

5. **Every page must render gracefully when its data array is empty.** No crashes on
   `EVENTS = []` or `TEAM = []`.

---

## Route map

```
PUBLIC CLUB SITE                  PLAYGROUND
/            Home                 /playground                        Activity index
/about       About                /playground/binary-blitz
/domains     Four domains         /playground/tapeout-calculator
/programs    Programs             /playground/wafer-defect-map
/events      Event archive        /playground/size-of-transistor
/team        Faculty / core / heads
/join        Join us

CHALLENGES — LOCKED, DO NOT CHANGE THESE PATHS
/challenges                       weekly challenge hub (requires student entry)
/challenges/foundry-ceo
/challenges/tapeout-sprint
/challenges/silicon-detective
/challenges/leaderboard           public student-facing leaderboard
/challenges/dashboard             instructor results view (dark theme, no auth gate)
```

---

## Design system

Tokens live in `src/theme.js` — always import from there, never hardcode hex values in
new code.

| Token | Value |
|---|---|
| cream (page bg) | `#F7F6F2` |
| card | `#E8E2D5` |
| ink (text) | `#14140F` |
| muted | `#6B6B60` |
| accent | `#2563EB` |
| line | `rgba(20,20,15,0.12)` |

**Fonts:** Archivo (display / UI), Newsreader (body serif), IBM Plex Mono (data, labels,
metadata). Loaded globally via Google Fonts in `index.html`.

**Never use Space Grotesk or Space Mono** — they were removed from the project.

**Design direction:** restrained, generous whitespace, near-monochrome. Electronics motifs
should be subtle — PCB-trace dividers, chamfered card corners, monospace figures. No
circuit-board wallpaper.

**Styling approach:** existing activity and challenge files use inline styles. New club
pages should use Tailwind classes. Do not refactor the old inline styles to Tailwind
unless explicitly asked.

---

## Architecture

### Weekly challenge flow

1. `/challenges` renders `WeekHub`, which first gates entry through `StudentEntry`
2. `StudentEntry` inserts a row into the Supabase `students` table and returns
   `{ id, name, roll_number }`
3. The student object is passed to weekly activities via React Router `state`
   (`useLocation().state.student`)
4. Each activity submits a result row to its own Supabase table on completion
5. A `localStorage` key per activity per roll number enforces one attempt

Week schedule is defined in `src/lib/weekConfig.js` — update dates there to change
unlock/deadline timing. `getWeekStatus()` returns `'locked' | 'unlocked' | 'expired'`
based on current time.

### Supabase tables (`src/lib/supabase.js`)

| Table | Scored by |
|---|---|
| `students` | — (name, roll_number) |
| `foundry_ceo_results` | `final_valuation` (dollar amount) |
| `tapeout_sprint_results` | `total_score` (0–10) |
| `silicon_detective_results` | `total_score` (0–100) |

Row Level Security policies allow public insert and select on all four tables.

### Activity types

**Standalone (no Supabase):**
- `BinaryBlitz` — timed binary-to-decimal quiz, 3 progressive levels (4/6/8-bit)
- `TapeoutCalculator` — live NRE + per-unit cost calculator
- `WaferDefectMap` — canvas-based defect and yield simulation
- `SizeOfTransistor` — scroll-driven scale visualization

**Weekly challenges (submit to Supabase):**
- `FoundryCEO` — 5-scenario decision tree; each choice adjusts
  `{ valuation, yield, satisfaction, risk }` from a base; final valuation stored
- `TapeoutSprint` — 5-decision chip design exercise scored across
  `{ battery, cost, area, time }`; averaged total stored
- `SiliconDetective` — 3-round diagnostic challenge; rounds award partial scores
  summed to a total out of 100

### Libraries

- `framer-motion` — animations
- `konva` / `react-konva` — canvas rendering
- `d3` — data utilities

---

## Conventions

- Content data lives in plain JS arrays in `src/data/` (`events.js`, `team.js`)
- Images go in `public/images/` and are referenced as `/images/...`
- File names: lowercase-with-hyphens, no spaces
- Pages in `src/pages/`, shared components in `src/components/`
- `vercel.json` rewrites all paths to `index.html` for client-side routing — do not remove

## Git

Commit after each completed task with a descriptive message, then push to `main`.
Vercel deploys automatically from `main`.