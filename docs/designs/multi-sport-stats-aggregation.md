# Backend — Cross-Sport Stats & Aggregation

**Date:** 2026-06-14

Part of the [multi-sport refactor](multi-sport-overview.md). Depends on [feed](multi-sport-feed.md).

## What to build

The Stats tab now has two modes: a **cross-sport summary** (filter = "All") and **sport-specific panels** (filter = one sport). Today's `/climb-histories/stats` endpoint is deeply climbing-specific (grades, sends, flashes, grade distribution, progression). That stays — it becomes the *climbing* panel, and a sport-agnostic layer is added on top.

### Cross-sport layer — `GET /feed/stats`

Lives alongside the feed read layer ([feed](multi-sport-feed.md)) and is built the same way: **fan out across the per-sport session collections and aggregate** (now Mongo, ElasticSearch later, same contract). Filters: `sport?` (omit for All), `startDate?`, `endDate?`, `granularity? (week|month)`. Returns only metrics meaningful for *every* sport, derivable from the shared base fields:

| Group | Contents |
|-------|----------|
| `summary` | total sessions, total active days, current streak, longest streak, total duration |
| `activity` | sessions bucketed per period (the cross-sport "how often do I train" chart) |
| `bySport` | per-sport counts + share (powers the dashboard breakdown) |

Because every metric here comes from base fields (`startedAt`, `endedAt`, `sport`), the cross-sport layer needs **no knowledge of any sport's deep data** — it aggregates the same `SessionSummary`-shaped rows the feed projects. This is the layer ElasticSearch absorbs first.

### Sport-specific layer

Each sport keeps its own deep-stats endpoint, addressed by sport. Reuse the existing climbing aggregation as-is for the climbing panel:

- Climbing stats stay at `/climb-histories/stats` (unchanged logic: grade distribution, send/flash counts, progression, hardest grade), plus the existing `sessions` block (avg climbs/session, avg duration) which reads `ClimbingSession`.
- Gym deep stats are stubbed ([new-sports](multi-sport-new-sports.md)) — the Stats tab shows only the cross-sport layer for gym until it's built. Same applies to any later sport until it ships its own panel.

Add `shared/models/feed/feed-stats.ts` public types and a `useFeedStats` hook, alongside the retained `useClimbHistoriesStats` hook.

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Two-layer stats | Generic `/feed/stats` (fan-out) + per-sport deep endpoints | Cross-sport metrics must be comparable; sport metrics (grades, breath-hold times) aren't |
| Generic layer source | Aggregates shared base fields only, across all sport collections | Needs no per-sport deep knowledge; identical contract whether Mongo or ES backs it |
| Climbing stats | Keep existing `/climb-histories/stats` aggregation | Already shipped and correct; no reason to rewrite or relocate |
| Streaks/active-days | Computed in the generic layer from `startedAt` | Sport-agnostic, wanted on the dashboard |
| New sports' deep stats | Stubbed | No data shape to aggregate yet |

## Gotchas

- The climbing `sessions` block (`avgClimbsPerSession`, `avgDurationMinutes`) reads `ClimbingSession` — unchanged, since that collection wasn't renamed away. Just confirm the query still points at it.
- "Active days" and "streak" must de-dupe multiple sessions on the same calendar day in the user's timezone; don't count two sessions as two days. Decide the timezone source (client-passed vs stored) before implementing.
- Keep route registration order: `/feed/stats` must be registered **before** any `/feed/:id`, mirroring the existing climb-histories ordering gotcha, or `stats` will be parsed as an id.
- The cross-sport fan-out aggregation has the same merge cost as the feed list. Keep the per-sport pipelines simple (count/bucket on indexed `startedAt`) so the in-memory merge stays cheap until ES takes over.
