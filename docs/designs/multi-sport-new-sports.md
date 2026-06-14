# New Sports — "Add a Sport" Contract + Stubs

**Date:** 2026-06-13

Part of the [multi-sport refactor](multi-sport-overview.md). Depends on [activity-model](multi-sport-activity-model.md) and [nav-shell](multi-sport-nav-shell.md). Climbing ([climbing-port](multi-sport-climbing-port.md)) is the reference implementation.

## What to build

A documented, repeatable contract for adding a sport, plus three stubs (gym, apnea, padel) to validate the framework. These stubs intentionally stay at the contract level — full flows are follow-up work.

### The "add a sport" contract

Adding a sport means delivering, and nothing more:

1. **Payload type** — `shared/models/activity/payloads/<sport>.ts`, the sport-specific `Activity.payload` shape (+ a type-validation test). Add the sport to the `sport` union.
2. **Logging flow** — a screen/modal contributed into the shared stack, reached from the FAB sport picker. Writes an `Activity` with `sport`, `payload`, and a denormalized `summary`.
3. **Session detail** — a screen contributed into the shared stack, opened from a History row.
4. **(Optional) deep stats** — a per-sport stats endpoint + panel; until present, the Stats tab shows only the cross-sport layer for that sport.

The sport must **not** touch the nav shell, History list renderer (it reads `summary`), or the cross-sport stats. If it does, the abstraction is leaking — fix the framework, not the sport.

### Stubs

**Gym** — strength / calisthenics sessions.

| Payload field | Notes |
|---------------|-------|
| `exercises[]` | `{ name/exerciseId, sets: [{ reps, weight?, rpe? }] }` |
| `summary` | headline = e.g. "5 exercises · 18 sets"; metric = total volume |

No location. Likely needs an **exercise catalog** later (analogous to the climbing `Climb` catalog) — out of scope for the stub; flag it.

**Apnea** — static/dynamic breath-hold training tables.

| Payload field | Notes |
|---------------|-------|
| `tableType` | `'CO2' \| 'O2' \| 'custom'` |
| `rounds[]` | `{ holdSeconds, restSeconds, completed }` |
| `summary` | headline = e.g. "CO2 table · 8 rounds"; metric = max hold |

No location. The logging flow is really a **timer/protocol runner**, not a form — the richest of the three; note it as its own sub-design when built.

**Padel** — matches.

| Payload field | Notes |
|---------------|-------|
| `result` | sets, e.g. `[{ us, them }]` |
| `partners[]` / `opponents[]` | free text or, later, contacts |
| `summary` | headline = the score line; metric = win/loss |

Has a location (courts) → appears on the [unified-map](multi-sport-unified-map.md).

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Sport packaging | Each sport is additive: payload + log flow + detail (+ optional stats) | Keeps the framework closed for modification, open for extension |
| Stubs depth | Contract-level payload + summary sketches only | Don't design flows for unbuilt sports beyond proving the model fits |
| Catalogs | Per-sport, modeled on climbing's `Climb` catalog (e.g. gym exercises) | Reuse the proven catalog/log split; defer to each sport's full build |

## Gotchas

- Every logging flow **must write `summary`** — it's what History and the dashboard render. A sport that forgets it produces blank rows.
- Apnea's timer-driven logging is materially different from form-based gym/padel logging; don't assume one shared "log form" component covers all sports.
- Resist adding a map tab or sub-tabs for these sports — that's the exact regression this refactor removes. Map presence is derived from whether the sport has geolocated activities ([unified-map](multi-sport-unified-map.md)).
