# Mobile — Climbing Port

**Date:** 2026-06-14

Part of the [multi-sport refactor](multi-sport-overview.md). Depends on [feed](multi-sport-feed.md) and [nav-shell](multi-sport-nav-shell.md).

## What to build

Move the existing climbing experience out of its nested stack (`climbing-stack.tsx`, `climbing-screen.tsx`) and into the unified shell, with no loss of capability. Climbing becomes the **reference implementation** of a sport package — gym/apnea/padel are modeled on it.

Because `ClimbingSession` already exists and stays as its own entity, there is **no data migration here** — this package is the framework wiring (feed adapter + `summary`) plus the mobile re-homing.

Mapping of today's climbing UI onto the new shell:

| Today (Climbing nested stack) | New home |
|-------------------------------|----------|
| Logbook sub-tab (`logbook-tab.tsx`) | History tab (feed), filtered to Climbing → row tap opens **climbing session detail** |
| Browse sub-tab (`browse-tab.tsx`) | [unified-map](multi-sport-unified-map.md) + existing location detail |
| Stats sub-tab (`stats-tab.tsx`) | Stats tab, Climbing panel (existing charts, [stats-aggregation](multi-sport-stats-aggregation.md)) |
| `ClimbDetail`, `LocationDetail`, `MapPointPicker`, `ImagePicker` (modals) | Contributed by the climbing package into the shared stack, unchanged |

New pieces:

- **Feed adapter + `summary`** — register `ClimbingSession` with the cross-sport feed ([feed](multi-sport-feed.md)) and start writing the denormalized `summary` (e.g. "8 routes · hardest V6") whenever a session is logged. This is the wiring that makes climbing appear in the unified History/Stats.
- **Climbing logging flow** — reached via the FAB → sport picker → "Climbing". Orchestrates the existing climb/climb-history screens and writes a `ClimbingSession` (the session, with its `summary`) plus its `ClimbHistory` upserts. This formalizes what session creation did implicitly.
- **Climbing session detail** — opened from a History feed row: the session's routes, statuses, location, notes. Replaces the per-route-list mental model of the old Logbook with a session→routes drill-down.

Everything below the session — `Climb`, `Sector`, `Hold`/`Spline`, `Image`, grade logic — is unchanged, as is the `ClimbingSession` ↔ `ClimbHistory` link.

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Logbook → History | Climbing rows live in the shared History feed, filtered | One list across sports; no parallel climbing logbook |
| Logbook unit | Session detail drills into routes | Aligns climbing with the session-level model the other sports use |
| Reference sport | Climbing is the template package | It's the most complete; gym/apnea/padel copy its structure |
| Catalog screens | Reused as-is | Climb/Sector/Location detail are still correct; only their *entry points* change |

## Gotchas

- **Behavioral shift:** users who think in "ticked routes" now see sessions first, routes second. Make sure the session detail surfaces route status prominently, and consider a climbing-scoped "all my routes" view if the route-centric list is missed (can be a later add — note it, don't silently drop it).
- The climbing logging flow must reproduce the existing upsert semantics: one `ClimbHistory` per `(climb, owner)` with appended `tries`, linked to its `ClimbingSession`. Don't create a fresh history per session.
- The `ClimbHistory.climbingSession` link is **unchanged** (no rename) — the only new write obligation is maintaining the session's `summary`. Don't re-point existing reads (stats `sessions` block, session grouping in `logbook-tab`) — they still target `ClimbingSession`.
- The retired local-state `<Tabs>` component may be used elsewhere — confirm before deleting it.
