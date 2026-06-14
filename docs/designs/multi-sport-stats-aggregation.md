# Backend — Cross-Sport Stats & Aggregation

**Date:** 2026-06-13

Part of the [multi-sport refactor](multi-sport-overview.md). Depends on [activity-model](multi-sport-activity-model.md).

## What to build

The Stats tab now has two modes: a **cross-sport summary** (filter = "All") and **sport-specific panels** (filter = one sport). Today's `/climb-histories/stats` endpoint is deeply climbing-specific (grades, sends, flashes, grade distribution, progression). That stays — but it becomes the *climbing* panel, and a new sport-agnostic layer is added on top.

### Cross-sport layer — `GET /activities/stats`

Aggregates over the `Activity` collection regardless of sport. Filters: `sport?` (omit for All), `startDate?`, `endDate?`, `granularity? (week|month)`. Returns only metrics meaningful for *every* sport:

| Group | Contents |
|-------|----------|
| `summary` | total activities, total active days, current streak, longest streak, total duration |
| `activity` | sessions bucketed per period (the cross-sport "how often do I train" chart) |
| `bySport` | per-sport counts + share (powers the dashboard breakdown) |

### Sport-specific layer

Each sport keeps its own deep-stats endpoint, addressed by sport. Reuse the existing climbing aggregation as-is for the climbing panel — just relocate/alias it so it reads the new model:

- Climbing stats now read **`ClimbHistory`** (unchanged logic: grade distribution, send/flash counts, progression, hardest grade) plus session metrics derived from climbing `Activity` records (the old `sessions` block: avg climbs/session, avg duration).
- Gym/apnea/padel deep stats are stubbed ([new-sports](multi-sport-new-sports.md)) — the Stats tab shows only the cross-sport layer for those until each is built.

Add `shared/models/activity/activity-stats.ts` public types and a `useActivitiesStats` hook, alongside the retained climbing stats hook.

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Two-layer stats | Generic `/activities/stats` + per-sport deep endpoints | Cross-sport metrics must be comparable; sport metrics (grades, breath-hold times) aren't |
| Climbing stats | Keep existing aggregation, re-pointed at ClimbHistory + Activity | Already shipped and correct; no reason to rewrite |
| Streaks/active-days | Computed in the generic layer from `Activity.startedAt` | Sport-agnostic, wanted on the dashboard |
| New sports' deep stats | Stubbed | No data shape to aggregate yet |

## Gotchas

- The old `sessions` block in climbing stats (`avgClimbsPerSession`, `avgDurationMinutes`) now derives from `Activity`, not the dropped `climbingSession` — re-point that query.
- "Active days" and "streak" must de-dupe multiple activities on the same calendar day in the user's timezone; don't count two sessions as two days. Decide the timezone source (client-passed vs stored) before implementing.
- Keep route registration order: any `/activities/stats` must be registered **before** `/activities/:id`, mirroring the existing climb-histories ordering gotcha, or `stats` will be parsed as an id.
