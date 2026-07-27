# New Sports — "Add a Sport" Contract + Gym Stub

**Date:** 2026-06-14

Part of the [multi-sport refactor](multi-sport-overview.md). Depends on [feed](multi-sport-feed.md) and [nav-shell](multi-sport-nav-shell.md). Climbing ([climbing-port](multi-sport-climbing-port.md)) is the reference implementation.

## What to build

A documented, repeatable contract for adding a sport, plus a gym entity stub to validate the framework. The stub intentionally stays at the contract level — full flows are follow-up work. Sports beyond climbing and gym are not designed yet; add them the same way once they're in scope.

### The "add a sport" contract

Adding a sport means delivering a **self-contained sport package**, and nothing more:

1. **Session entity** — a new Mongoose model + collection in `backend/src/models/<sport>-session.ts` that fully models the sport, satisfying the [shared base-field contract](multi-sport-feed.md) (`owner`, `sport`, `title`, `startedAt`, `endedAt?`, `location?`, `summary`, timestamps) plus its own sport-specific fields. Public types + tests in `shared/models/<sport>-session/*`.
2. **CRUD + feed adapter** — the sport's own REST endpoints (`GET/PUT/DELETE /<sport>-sessions`), and a **feed adapter** that lets `GET /feed` query this collection and project it to `SessionSummary`. The adapter is the only thing the cross-sport read layer needs.
3. **Logging flow** — a screen/modal contributed into the shared mobile stack, reached from the FAB sport picker. Writes a session with its sport-specific fields **and a denormalized `summary`**.
4. **Session detail** — a screen contributed into the shared stack, opened from a History feed row.
5. **(Optional) deep stats** — a per-sport stats endpoint + panel; until present, the Stats tab shows only the cross-sport layer for that sport.

The sport must **not** touch the nav shell, the feed list renderer (it reads `SessionSummary`), or the cross-sport stats (they read base fields). If it does, the abstraction is leaking — fix the framework, not the sport.

### Stub

An **entity sketch** — the sport-specific fields its collection carries, plus its `summary` shape. (`owner`/`startedAt`/`location?`/etc. come from the shared base fields and are omitted here.)

**Gym** — `GymSession`, strength / calisthenics.

| Field | Notes |
|-------|-------|
| `exercises[]` | `{ name/exerciseId, sets: [{ reps, weight?, rpe? }] }` |
| `summary` | headline = e.g. "5 exercises · 18 sets"; metric = total volume |

No location. Likely needs an **exercise catalog** later (analogous to the climbing `Climb` catalog) — out of scope for the stub; flag it.

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Sport packaging | Each sport is a self-contained package: own entity/collection + endpoints + feed adapter + log flow + detail (+ optional stats) | Keeps the framework closed for modification, open for extension |
| No shared session collection | Each sport owns its model; the feed merges them via adapters | The session is the sport's own header/section, not a generic payload |
| Stub depth | Entity-field + summary sketch only | Don't design flows for unbuilt sports beyond proving the model fits |
| Catalogs | Per-sport, modeled on climbing's `Climb` catalog (e.g. gym exercises) | Reuse the proven catalog/log split; defer to each sport's full build |
| Sport breadth | Only gym stubbed for now; other sports undesigned | Climbing + gym is the current scope; more sports follow this same contract later |

## Gotchas

- Every write path that touches a session's derived data **must recompute `summary`**, not just the initial logging flow — it's what the History feed and dashboard render, and what ES will index. A sport that only sets it at creation produces rows that go stale the moment the session is edited (see [feed](multi-sport-feed.md)).
- Every sport **must register a feed adapter** — otherwise its sessions are invisible to `GET /feed` and the cross-sport stats, even though its own detail screen works. This is the one wiring step that's easy to forget.
- Resist adding a map tab or sub-tabs for gym — that's the exact regression this refactor removes. Map presence is derived from whether the sport has geolocated sessions ([unified-map](multi-sport-unified-map.md)); gym doesn't, so it never appears there.
