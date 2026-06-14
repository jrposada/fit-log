# Backend — Per-Sport Sessions & Cross-Sport Feed

**Date:** 2026-06-14

Part of the [multi-sport refactor](multi-sport-overview.md). This is the foundation package; packages 2–6 depend on it.

## What to build

Two things: (1) a **contract** that every per-sport session entity satisfies, and (2) a **cross-sport feed** read layer that fans out across those entities and merges them into one chronological list.

There is **no unified `Activity` collection.** `ClimbingSession` (already in `backend/src/models/climbing-session.ts`, renamed from the old training session) stays as-is and is the first entity to satisfy the contract. Future sports add their own collections (`GymSession`, `ApneaSession`, `PadelMatch`) — see [new-sports](multi-sport-new-sports.md).

`ClimbHistory` is unchanged: a per-route lifetime record keyed `(climb, owner)`, carrying the cross-session `isProject` flag and the full `tries[]` history, linked to a `ClimbingSession`. `Climb`, `Sector`, `Hold`/`Spline`, and `Image` remain climbing catalog objects, untouched. `Location` becomes **shared** across sports (climbing crags, padel courts, dive sites) — see [unified-map](multi-sport-unified-map.md).

### The per-sport session contract

Every sport's session entity must carry these **shared base fields**, on top of whatever sport-specific fields it needs. This is a shared *shape*, not a shared collection — enforced by convention (and ideally a reusable schema fragment, like the existing `ownershipFields` / `timestamps` mixins).

| Field | Type | Notes |
|-------|------|-------|
| `owner` | ref User | as today |
| `sport` | `'climbing' \| 'gym' \| 'apnea' \| 'padel'` | constant per collection; the feed adapter tags rows |
| `title` | string | user or auto-generated ("Evening session") |
| `notes?` | string | |
| `startedAt` | Date | indexed; the cross-collection merge/sort key |
| `endedAt?` | Date | |
| `location?` | ref Location \| null | optional for all sports |
| `summary` | object | denormalized headline metrics for feed/dashboard rendering — see below |
| `createdAt` / `updatedAt` | Date | timestamps |

`ClimbingSession` already has owner/title/notes/startedAt/endedAt/location/timestamps. The only additions for the contract are a constant `sport: 'climbing'` (or a per-adapter constant) and a denormalized `summary`.

### The `summary` contract

`summary` is a small denormalized object each sport's **logging flow writes** so the feed and dashboard can render rows **without** loading or interpreting each sport's deep data. Suggested shape:

```
{ headline: string, metric?: { label, value }, count?: number }
```

- Climbing → `count: 8`, `metric: { label: "hardest", value: "V6" }`, `headline: "8 routes"`
- Padel → `headline: "6-4 / 3-6 / 7-5"`, `metric: { label: "result", value: "W" }`

Readers never compute `summary`; the owning flow maintains it. This is also exactly the shape ElasticSearch will index later.

### Cross-sport feed read layer

Introduce a read-only feed API (e.g. under `backend/src/api/feed/`) that produces one merged, chronological list across all sport collections:

| Endpoint | Purpose |
|----------|---------|
| `GET /feed` | cursor-paginated merged list of sessions across all sports, newest (`startedAt`) first. Filters: `sport?`, `locationId?`, `startDate?`, `endDate?`. Each row is a `SessionSummary` DTO (base fields + `summary`); deep sport data is **not** included |

`GET /feed` is backed by a small set of **per-sport adapters**, one per collection, each of which: knows how to query its collection with the shared filters, and projects its documents into the common `SessionSummary` DTO (id, sport, title, startedAt, endedAt, location, summary). The feed endpoint composes the registered adapters, merges their results by `startedAt` (desc), and paginates. When `sport` is set, only that adapter runs — which is just a direct query on one collection.

**ElasticSearch is the planned replacement for the merge engine, not the contract.** Later, each sport's writes also index a `SessionSummary` document into ES; `GET /feed` then queries ES instead of fanning out across Mongo. The DTO, the endpoint, the filters, and the mobile hooks stay identical. Adapters and the denormalized `summary` are precisely the ES index source.

Per-sport detail is fetched from each sport's own endpoint (climbing already has `GET /climbing-sessions/:id`); the feed never returns deep payloads.

### Shared types & hooks

Mirror the existing `shared/models` + `shared-react/api` pattern:
- `shared/models/feed/*` — the `SessionSummary` DTO + `GET /feed` query/response Zod schemas, with type-validation tests (`IsEqual` pattern).
- `shared-react/api/feed/*` — a `useFeed` infinite query using the established Axios + TanStack Query + base64 cursor conventions (mirror `useClimbHistories`).

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Data model | One entity/collection per sport; no unified `Activity` | Each session is its sport's header/section, not a generic payload; a discriminated wrapper added complexity without value |
| Shared shape | Base fields enforced by convention/mixin, not a shared collection | Gives the feed a uniform projection without coupling the write models |
| Cross-sport reads | Fan-out + merge across per-sport collections behind `GET /feed` | Ships the unified feed now; the contract is stable |
| Aggregation engine | Mongo fan-out now → ElasticSearch later, same contract | Cross-sport merge/search is ES-shaped; don't distort write models for reads |
| Denormalized `summary` | Yes, written by each logging flow | Feed/dashboard render N rows across sports without interpreting N deep shapes; doubles as the ES index doc |
| ClimbHistory | Unchanged; stays linked to `ClimbingSession` | Preserves `(climb, owner)` uniqueness, cross-session `isProject`, lifetime `tries[]` |
| Cursor pagination | Reuse the climb-histories base64 keyset pattern, applied to the merged stream | Consistency with existing pagination |

## Gotchas

- **`summary` is a denormalized cache, not authoritative.** Detail screens and deep stats read the real data (climb histories, etc.), never `summary`.
- **Merged cursor pagination across N collections is the hard part of `GET /feed`.** A base64 `{startedAt, id, sport}` cursor must resume a *merged* stream deterministically. Simplest correct approach: over-fetch `limit+1` from each adapter past the cursor, merge-sort in memory, slice. Document the chosen approach; this is the piece ES later removes.
- The `(climb, owner)` unique index on `ClimbHistory` means a route logged in two sessions updates **one** history (adding a `try`), while each session is a distinct `ClimbingSession`. The climbing logging flow must upsert the history and append the session reference, not create duplicates — unchanged from today.
- `ClimbingSession` has `lastActivityAt` (a live-session concept). It's not part of the feed contract; leave it on the climbing entity only if the in-session UX still needs it. Don't promote it to the shared base fields.
- Keep route registration order if the feed lives under a path with an `:id` sibling — specific routes before dynamic ones, mirroring the existing climb-histories `/stats` before `/:id` ordering.
