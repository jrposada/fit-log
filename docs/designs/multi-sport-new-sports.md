# New Sports — "Add a Sport" Contract + Stubs

**Date:** 2026-06-14

Part of the [multi-sport refactor](multi-sport-overview.md). Depends on [feed](multi-sport-feed.md) and [nav-shell](multi-sport-nav-shell.md). Climbing ([climbing-port](multi-sport-climbing-port.md)) is the reference implementation.

## What to build

A documented, repeatable contract for adding a sport, plus three entity stubs (gym, apnea, padel) to validate the framework. These stubs intentionally stay at the contract level — full flows are follow-up work.

### The "add a sport" contract

Adding a sport means delivering a **self-contained sport package**, and nothing more:

1. **Session entity** — a new Mongoose model + collection in `backend/src/models/<sport>-session.ts` that fully models the sport, satisfying the [shared base-field contract](multi-sport-feed.md) (`owner`, `sport`, `title`, `startedAt`, `endedAt?`, `location?`, `summary`, timestamps) plus its own sport-specific fields. Public types + tests in `shared/models/<sport>-session/*`.
2. **CRUD + feed adapter** — the sport's own REST endpoints (`GET/PUT/DELETE /<sport>-sessions`), and a **feed adapter** that lets `GET /feed` query this collection and project it to `SessionSummary`. The adapter is the only thing the cross-sport read layer needs.
3. **Logging flow** — a screen/modal contributed into the shared mobile stack, reached from the FAB sport picker. Writes a session with its sport-specific fields **and a denormalized `summary`**.
4. **Session detail** — a screen contributed into the shared stack, opened from a History feed row.
5. **(Optional) deep stats** — a per-sport stats endpoint + panel; until present, the Stats tab shows only the cross-sport layer for that sport.

The sport must **not** touch the nav shell, the feed list renderer (it reads `SessionSummary`), or the cross-sport stats (they read base fields). If it does, the abstraction is leaking — fix the framework, not the sport.

### Stubs

Each stub is an **entity sketch** — the sport-specific fields its collection carries, plus its `summary` shape. (`owner`/`startedAt`/`location?`/etc. come from the shared base fields and are omitted here.)

**Gym** — `GymSession`, strength / calisthenics.

| Field | Notes |
|-------|-------|
| `exercises[]` | `{ name/exerciseId, sets: [{ reps, weight?, rpe? }] }` |
| `summary` | headline = e.g. "5 exercises · 18 sets"; metric = total volume |

No location. Likely needs an **exercise catalog** later (analogous to the climbing `Climb` catalog) — out of scope for the stub; flag it.

**Apnea** — `ApneaSession`, static/dynamic breath-hold tables.

| Field | Notes |
|-------|-------|
| `tableType` | `'CO2' \| 'O2' \| 'custom'` |
| `rounds[]` | `{ holdSeconds, restSeconds, completed }` |
| `summary` | headline = e.g. "CO2 table · 8 rounds"; metric = max hold |

No location. The logging flow is really a **timer/protocol runner**, not a form — the richest of the three; note it as its own sub-design when built.

**Padel** — `PadelMatch`, matches.

| Field | Notes |
|-------|-------|
| `result` | sets, e.g. `[{ us, them }]` |
| `partners[]` / `opponents[]` | free text or, later, contacts |
| `summary` | headline = the score line; metric = win/loss |

Has a location (courts) → appears on the [unified-map](multi-sport-unified-map.md).

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Sport packaging | Each sport is a self-contained package: own entity/collection + endpoints + feed adapter + log flow + detail (+ optional stats) | Keeps the framework closed for modification, open for extension |
| No shared session collection | Each sport owns its model; the feed merges them via adapters | The session is the sport's own header/section, not a generic payload |
| Stubs depth | Entity-field + summary sketches only | Don't design flows for unbuilt sports beyond proving the model fits |
| Catalogs | Per-sport, modeled on climbing's `Climb` catalog (e.g. gym exercises) | Reuse the proven catalog/log split; defer to each sport's full build |

## Gotchas

- Every logging flow **must write `summary`** — it's what the History feed and dashboard render, and what ES will index. A sport that forgets it produces blank rows.
- Every sport **must register a feed adapter** — otherwise its sessions are invisible to `GET /feed` and the cross-sport stats, even though its own detail screen works. This is the one wiring step that's easy to forget.
- Apnea's timer-driven logging is materially different from form-based gym/padel logging; don't assume one shared "log form" component covers all sports.
- Resist adding a map tab or sub-tabs for these sports — that's the exact regression this refactor removes. Map presence is derived from whether the sport has geolocated sessions ([unified-map](multi-sport-unified-map.md)).
