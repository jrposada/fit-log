# Multi-Sport Architecture — Overview

**Date:** 2026-06-13

## What to build

Today the mobile app is organized **per sport**: a nested Climbing stack with home-grown sub-tabs (Logbook/Browse/Stats built on local `useState`, not real routes) and a bare Training screen. This doesn't scale — every new sport (gym, apnea, padel, later diving) would mean cloning a whole nested layout, and the sub-tabs already diverge in quality between Climbing and Training.

This effort restructures the app around **two orthogonal axes** instead of one per-sport axis:

| Axis | What it is | Where it lives |
|------|-----------|----------------|
| **Navigation surfaces** | Sport-*agnostic*, always present: Home, History, Stats, Profile | Flat bottom tabs + a central FAB |
| **Activity flows** | Sport-*specific*: log a climb, run an apnea table, record a padel match | Behind the FAB and inside session detail |

Sport stops being a top-level *layout* and becomes a **filter** (segmented control on History/Stats) and a **payload discriminator** on a unified data model. Adding a sport then means "register a new activity type + its logging flow," not "build a new layout."

Scope of this design set: the framework + the **climbing migration** are designed in full. Gym, apnea, and padel are captured as stubs against a documented "add a sport" contract — fleshed out later.

## Target architecture

```
Bottom tabs (flat, fixed):   Home · History · Stats · Profile      + central FAB

Home      → cross-sport dashboard (recent activity + per-sport summary cards)
History   → list of Activities, segmented filter: All · Climbing · Gym · Apnea · Padel
Stats     → cross-sport summary when "All"; sport-specific panels when filtered
FAB       → sport picker → sport-specific logging flow (stack/modal)
Map       → single unified map, pins from Locations, type-filtered (reached from Home/Browse)

Backend:  one Activity collection (sport discriminator + payload), generalized from
          climbingSession. ClimbHistory stays as climbing-specific detail.
```

## Work packages

Implement roughly in this order; dependencies noted.

| # | Package | Depends on | Summary |
|---|---------|-----------|---------|
| 1 | [activity-model](multi-sport-activity-model.md) | — | Backend: unified `Activity` model, sport discriminator, payload contract, CRUD + sport-filtered list, climbing migration |
| 2 | [stats-aggregation](multi-sport-stats-aggregation.md) | 1 | Backend: cross-sport stats endpoint; refactor climbing stats to be sport-scoped |
| 3 | [nav-shell](multi-sport-nav-shell.md) | 1 (API contract) | Mobile: flat tabs + FAB + sport filter; remove nested Climbing sub-tabs; Home dashboard |
| 4 | [unified-map](multi-sport-unified-map.md) | 1 | Mobile: single type-filtered map replacing per-sport Browse |
| 5 | [climbing-port](multi-sport-climbing-port.md) | 1, 3 | Mobile: move existing climbing Logbook/Browse/Stats into the new shell; FAB → log-climb flow |
| 6 | [new-sports](multi-sport-new-sports.md) | 1, 3 | The "add a sport" contract + gym / apnea / padel stubs |

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Unification unit | The **session** (`Activity` = generalized `climbingSession`), not the per-route entry | The session is the common unit across all sports; flattening climb-histories would destroy cross-session "project" tracking and `(climb, owner)` uniqueness |
| Sport selection UX | In-context segmented filter, **not** a global header mode | Avoids hidden-mode errors; sports don't map uniformly onto tabs (gym/apnea have no map) |
| Browse | One unified map with type-filtered pins | Three near-identical per-sport map tabs would be redundant; one map is a stronger feature |
| Migration | Greenfield — reshape in place, no reversible backfill | User confirmed negligible existing data |
| Sport breadth now | Climbing fully ported; gym/apnea/padel stubbed | Locks the framework before investing in flows for unbuilt sports |
