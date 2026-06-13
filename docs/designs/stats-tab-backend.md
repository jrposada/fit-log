# Climbing Stats — Backend aggregation endpoint & contract

**Date:** 2026-06-13

> Work package 1 of 2. The frontend (hook + Stats tab UI) is specified in [`stats-tab-ui.md`](./stats-tab-ui.md) and depends on the contract defined here. Build this first.

## What to build

A single read-only analytics endpoint that returns pre-aggregated climbing statistics for the authenticated user, computed in MongoDB rather than on the client. The Stats tab and (later) the Home dashboard both consume it.

**Endpoint:** `GET /climb-histories/stats`

It aggregates over the user's `ClimbHistory` documents (`packages/backend/src/models/climb-history.ts`), joining to `Climb` for grade and to `TrainingSession` for session analytics. It reuses the same optional filter vocabulary as the existing `GET /climb-histories` list endpoint so a user can scope stats to a location/sector/date range.

### Where it fits

| Layer | Location | What changes |
|-------|----------|--------------|
| Contract | `packages/shared/src/models/climb-histories/climb-histories-stats.ts` | New query type + zod schema, response type. Add a type-validation test alongside (`*.test.ts`) per repo convention. |
| Handler | `packages/backend/src/api/climb-histories/climb-histories-stats.ts` | New aggregation handler, wrapped in `toApiResponse` like the other handlers. |
| Route | `packages/backend/src/router.ts` | Mount **before** `/climb-histories/:id` (see Gotchas). |

### Query parameters (all optional)

Mirror the existing `ClimbHistoriesGetQuery` filter fields so the contract feels consistent:

| Param | Meaning |
|-------|---------|
| `locationId` | Scope to one location |
| `sectorId` | Scope to one sector |
| `startDate` / `endDate` | ISO datetime bounds (filter on `updatedAt`, consistent with the list endpoint) |
| `granularity` | `week` \| `month` — bucket size for the activity series. Default `month`. |

No `cursor`/`limit` — this endpoint returns a bounded summary, not a page.

### Response shape (contract)

The implementer owns exact TS, but the response must carry these four sections:

| Section | Fields | Source |
|---------|--------|--------|
| `summary` | `totalClimbs`, `sends`, `flashes`, `projects`, `totalAttempts`, `hardestGrade` (`ClimbGrade \| null`) | Counts over histories; `hardestGrade` = max grade among sent histories → feeds Home "PB" card |
| `gradeDistribution` | array of `{ grade, sends, attempts }` ordered by `GRADE_OPTIONS` | Grouped by joined climb grade |
| `activity` | array of `{ period, climbs, sends }` (period = `"2026-06"` or ISO week) | Histories bucketed by `granularity` |
| `progression` | array of `{ period, hardestGrade (`ClimbGrade \| null`) }` | Hardest grade *sent* in each period, same buckets as `activity` |
| `sessions` | `total`, `avgClimbsPerSession`, `avgDurationMinutes` (`number \| null`) | `TrainingSession` collection |

### Metric definitions (resolve ambiguity up front)

- **sends** = histories whose stored `status` is `send` **or** `flash`. **flashes** = `status === 'flash'` (subset of sends).
- **projects** = histories with `isProject === true`.
- **totalAttempts** = sum over all `tries` of `attempts ?? 1` (real effort count, not number of distinct climbs).
- **hardestGrade** (summary) = highest `GRADE_OPTIONS` index among **sent** histories (send/flash). Custom non-`V` grades (the `string & {}` escape hatch) are ignored for this max.
- **progression[].hardestGrade** = highest `GRADE_OPTIONS` index among histories **sent in that period** (period assigned by the same `granularity` bucket as `activity`). `null` for periods with no send. This is the *per-period* hardest, so the line reflects current form and may dip — see Gotchas for the cumulative-best alternative.
- **gradeDistribution[].sends** = sent histories at that grade; **.attempts** = histories at that grade that were *not* sent (project/attempt-only). Together they give a stacked bar per grade.
- **sessions.avgDurationMinutes** = mean of `(endedAt − startedAt)` over sessions that have an `endedAt`; `null` if none do.

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Compute location | Backend MongoDB aggregation pipeline | One bounded call; scales to hundreds of histories without the client paging through 50-at-a-time. (User-confirmed.) |
| Endpoint placement | Sub-route of `/climb-histories` | Stats are derived purely from climb histories; keeps the resource grouping. |
| Filter vocabulary | Reuse list endpoint's params (`locationId`, `sectorId`, `startDate`, `endDate`) | Consistency; lets the tab offer the same scoping the logbook already has. |
| Serves Home too | Response designed to cover Home's needs (`totalClimbs`, `hardestGrade`) | Home dashboard currently hardcodes "128 climbs / V7 PB"; this endpoint can replace those later. Home wiring is **out of scope** here — just don't shape the contract so narrowly that Home can't reuse it. |
| Grade source | `$lookup` from history → `climbs` | `grade` lives on `Climb`, not `ClimbHistory`. |
| Activity bucket key | `updatedAt` | Matches the date semantics the list endpoint already filters on; avoids `$unwind` over `tries`. See Gotchas for the alternative. |
| Progression metric | Per-period **hardest grade sent** (not avg, not cumulative-best) | The canonical "am I getting stronger" line; honest about current form. Cumulative-best is the alternative (Gotchas). Shares `activity`'s buckets so it's one extra `$group` branch, not a second pipeline. |

## Gotchas

- **Route ordering:** `GET /climb-histories/:id` already exists in `router.ts` (line ~333). Express matches top-down, so `/climb-histories/stats` **must be registered before** the `:id` route or `stats` is captured as an `:id`. Add `authenticateKeycloak` + `validateQuery(climbHistoriesStatsQuerySchema)` like the siblings.
- **Grade is not on the history.** The aggregation must `$lookup` into `climbs` to read `grade`. Histories whose `climb` reference was deleted (`climb: null`) have no grade — exclude them from `gradeDistribution`/`hardestGrade` but still count them in `summary.totalClimbs`.
- **`status` is already the aggregate top status** (`computeTopStatus` / `STATUS_PRIORITY` in the model). Group on `status` directly; don't recompute from `tries`.
- **Owner scoping is mandatory.** Match `owner: request.user._id` first in the pipeline, exactly like `climb-histories-get.ts`, before any `$lookup`.
- **Activity over time alternative:** bucketing by `updatedAt` reflects when a history was last touched, not every climbing day. True per-day activity would require `$unwind` over `tries` and bucketing `tries.date`. Chosen the simpler `updatedAt` bucket for v1; flagged so it can be revisited if the chart looks misleading.
- **Empty user:** a user with zero histories must get a well-formed response (zeros, empty arrays, `hardestGrade: null`), not an error — the UI renders an empty state from this.
- **Progression — per-period vs cumulative-best:** the chosen per-period hardest can dip in a low month, which can read as "regression." The alternative is a cumulative running max (best-ever-up-to-this-period), which only rises or holds and reads cleanly as progression but hides current-form dips. Chosen per-period for honesty; if the UX wants the always-rising line, the front-end can derive the cumulative max from this same series without a backend change.
- **Progression and the date filter:** when `startDate`/`endDate` scope the query, `progression` reflects only sends in-range, so its first point is the hardest in-range — not necessarily the user's all-time PB. Acceptable; just don't conflate `progression[0]` with `summary.hardestGrade`.
