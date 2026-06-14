# Backend — Unified Activity Model

**Date:** 2026-06-13

Part of the [multi-sport refactor](multi-sport-overview.md). This is the foundation package; packages 2–6 depend on it.

## What to build

Generalize the existing `TrainingSession` model into a single **`Activity`** model that represents one dated, sport-tagged session for any sport. This collection becomes the single source for the History tab, the Home dashboard, and cross-sport aggregation. Sport-specific richness lives in a `payload` that the discriminator selects.

**Crucially, `ClimbHistory` is *not* absorbed into the Activity payload.** It stays a climbing-specific structure: a per-route lifetime record keyed `(climb, owner)`, carrying the cross-session `isProject` flag and the full `tries[]` history. A climbing `Activity` *references* the climb histories touched during that session; it does not own them. Other sports may have no equivalent.

`Climb`, `Sector`, `Hold`/`Spline`, and `Image` remain climbing catalog objects, untouched. `Location` becomes **shared** across sports (climbing crags, padel courts, dive sites) — see [unified-map](multi-sport-unified-map.md).

### Activity — shared fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `owner` | ref User | ownership mixin, as today |
| `sport` | `'climbing' \| 'gym' \| 'apnea' \| 'padel'` | discriminator; indexed |
| `title` | string | user or auto-generated ("Evening session") |
| `notes?` | string | |
| `startedAt` | Date | indexed; primary sort/filter key |
| `endedAt?` | Date | |
| `location?` | ref Location \| null | optional for all sports |
| `summary` | object | denormalized, sport-agnostic headline metrics for list/dashboard rendering — see below |
| `payload` | sport-specific | shape selected by `sport`; see [new-sports](multi-sport-new-sports.md) and climbing below |
| `createdAt` / `updatedAt` | Date | timestamps mixin |

`summary` is a small denormalized object so History and the dashboard can render rows **without** loading or interpreting each sport's payload. Suggested shape: `{ headline: string, metric?: { label, value }, count?: number }` (e.g. climbing → `count: 8 routes, metric: "hardest V6"`; padel → `headline: "6-4 / 3-6 / 7-5"`). The owning logging flow writes `summary`; readers never compute it.

### Climbing payload

The climbing `Activity` payload references the existing climbing graph rather than duplicating it:

| Field | Type | Notes |
|-------|------|-------|
| `climbHistories` | ref ClimbHistory[] | the per-route records logged in this session (replaces `TrainingSession.climbHistories`) |
| `sector?` | ref Sector \| null | optional, as today |

`ClimbHistory` keeps its `trainingSession` link semantics but the field points at the `Activity` id now.

### API surface

Introduce an `Activity` API under `backend/src/api/activity/` following existing REST conventions:

| Endpoint | Purpose |
|----------|---------|
| `GET /activities` | cursor-paginated list; filters: `sport?`, `locationId?`, `startDate?`, `endDate?`. Returns rows with `summary` populated, payload depopulated/light |
| `GET /activities/:id` | single activity, payload fully populated for the sport |
| `PUT /activities` | create/update an activity (sport + payload) |
| `DELETE /activities/:id` | |

Keep the existing climb-histories, climbs, locations, and sectors endpoints — they're still the climbing catalog/detail layer. The climbing logging flow ([climbing-port](multi-sport-climbing-port.md)) orchestrates `PUT /climb-histories` (per route) + `PUT /activities` (the session wrapper). Stats moves to its own package ([stats-aggregation](multi-sport-stats-aggregation.md)).

Mirror the existing `shared/models` + `shared-react/api` pattern: add `shared/models/activity/*` public types (with type-validation tests) and `shared-react/api/activity/*` hooks (`useActivities` infinite query, `useActivitiesById`, `useActivitiesPut`, `useActivitiesDelete`) using the established Axios + TanStack Query + cursor-pagination conventions.

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Unification unit | `Activity` = generalized `TrainingSession` | The session is the unit common to every sport |
| ClimbHistory | Stays a separate climbing collection, referenced by climbing Activities | Preserves `(climb, owner)` uniqueness, cross-session `isProject`, and lifetime `tries[]` |
| Payload storage | Embedded sub-document, shape by `sport` | Sport payloads are read/written as a unit with their session; no cross-sport joins needed |
| Denormalized `summary` | Yes, written by the logging flow | History/dashboard render N rows across sports without interpreting N payload shapes |
| List pagination | Reuse the climb-histories cursor pattern (base64 `{startedAt,id}`) | Consistency with existing keyset pagination |
| Migration | Reshape `TrainingSession` → `Activity` in place, default existing rows to `sport:'climbing'`; no reversible backfill | Greenfield — negligible data |

## Gotchas

- **Don't model `summary` as authoritative.** It's a denormalized cache for list rendering. Detail screens and stats read the payload / climb-histories, never `summary`.
- The `(climb, owner)` unique index on `ClimbHistory` means a route logged in two sessions updates **one** history (adding a `try`), while each session is a distinct `Activity`. The climbing logging flow must upsert the history and append the session reference, not create duplicates.
- `TrainingSession` currently has `startedAt` / `endedAt` / `lastActivityAt`. Decide whether `lastActivityAt` survives on `Activity` — it's a live-session concept; keep only if the climbing in-session UX still needs it.
- Existing references to `TrainingSession` (model, types, hooks, the `trainingSession` field on ClimbHistory) all need renaming to `Activity`. Greenfield allows a hard rename; grep the monorepo before assuming a clean cut.
