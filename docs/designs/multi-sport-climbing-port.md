# Mobile — Climbing Port

**Date:** 2026-06-13

Part of the [multi-sport refactor](multi-sport-overview.md). Depends on [activity-model](multi-sport-activity-model.md) and [nav-shell](multi-sport-nav-shell.md).

## What to build

Move the existing climbing experience out of its nested stack (`climbing-stack.tsx`, `climbing-screen.tsx`) and into the unified shell, with no loss of capability. Climbing becomes the **reference implementation** of a sport package — gym/apnea/padel are modeled on it.

Mapping of today's climbing UI onto the new shell:

| Today (Climbing nested stack) | New home |
|-------------------------------|----------|
| Logbook sub-tab (`logbook-tab.tsx`) | History tab, filtered to Climbing → row tap opens **climbing session detail** |
| Browse sub-tab (`browse-tab.tsx`) | [unified-map](multi-sport-unified-map.md) + existing location detail |
| Stats sub-tab (`stats-tab.tsx`) | Stats tab, Climbing panel (existing charts, [stats-aggregation](multi-sport-stats-aggregation.md)) |
| `ClimbDetail`, `LocationDetail`, `MapPointPicker`, `ImagePicker` (modals) | Contributed by the climbing package into the shared stack, unchanged |

New pieces:

- **Climbing logging flow** — reached via the FAB → sport picker → "Climbing". Orchestrates the existing climb/climb-history screens and writes a climbing `Activity` (the session) plus its `ClimbHistory` upserts. This formalizes what `climbingSession` did implicitly.
- **Climbing session detail** — opened from a History row: the session's routes, statuses, location, notes. Replaces the per-route-list mental model of the old Logbook with a session→routes drill-down.

Everything below the session — `Climb`, `Sector`, `Hold`/`Spline`, `Image`, grade logic — is unchanged.

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Logbook → History | Climbing rows live in the shared History list, filtered | One list across sports; no parallel climbing logbook |
| Logbook unit | Session detail drills into routes | Aligns climbing with the session-level model the other sports use |
| Reference sport | Climbing is the template package | It's the most complete; gym/apnea/padel copy its structure |
| Catalog screens | Reused as-is | Climb/Sector/Location detail are still correct; only their *entry points* change |

## Gotchas

- **Behavioral shift:** users who think in "ticked routes" now see sessions first, routes second. Make sure the session detail surfaces route status prominently, and consider a climbing-scoped "all my routes" view if the route-centric list is missed (can be a later add — note it, don't silently drop it).
- The climbing logging flow must reproduce the existing upsert semantics: one `ClimbHistory` per `(climb, owner)` with appended `tries`, linked to the new `Activity`. Don't create a fresh history per session.
- `ClimbHistory.climbingSession` → now an `Activity` reference; update all reads (e.g. the stats `sessions` block, any session grouping in `logbook-tab`).
- The retired local-state `<Tabs>` component may be used elsewhere — confirm before deleting it.
