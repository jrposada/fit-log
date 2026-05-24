# Design: Training Session — Backend

## Context

Today, climbs are logged individually with no concept of a "session." Climbers naturally train in bounded outings (a single visit to a gym/crag) and want their climbs grouped accordingly for review and stats. This package introduces the **TrainingSession** model, its CRUD endpoints, and the climb-attach logic that turns climb logging into a session-aware operation.

Low-friction UX is the goal: the user shouldn't have to remember to "start a session." The backend signals the app when to ask.

Required by: [`training-session-shared-and-hooks`](training-session-shared-and-hooks.md), [`training-session-overlay-ui`](training-session-overlay-ui.md).

---

## Problem

- No model exists to group climbs into outings.
- Climb creation can't currently express "no active session" vs. "session went stale" — the existing API returns `{ success, data }` with HTTP status only and no app-level error code.

## Goal

- A `TrainingSession` document, owned per-user, that holds an ordered set of climbs.
- A small, additive error-code convention so the client can branch UX on stable string codes.
- Climb creation auto-attaches to the active session or surfaces a coded error the client can act on.

---

## Architecture

### Cross-cutting: coded error convention

Error response body is extended to:

```
{ success: false, error?: { code: string, message?: string, meta?: object } }
```

- `code` is a stable string slug (e.g. `NO_ACTIVE_SESSION`, `STALE_SESSION`).
- `error` is optional — existing handlers stay unchanged.
- A new error class (e.g. `CodedError`) carries the code; `handleApiError` in `backend/src/api/api-utils.ts` is extended to serialize it.

**Why:** stable, parseable, additive — no breaking change to existing clients.

### Model — `TrainingSession`

Location: `backend/src/models/training-session.ts`. Follows the climb/location pattern (`WithTimestamps`, `WithOwnership`, `timestamps: true`).

Fields:
- `owner`, `collaborators[]` — via the existing `ownershipFields` mixin.
- `title: string` — defaults to the session's start date (e.g. `"2026-05-24"`), user-editable.
- `notes?: string`.
- `location?: ObjectId<Location>`.
- `startedAt: Date` — set at creation.
- `endedAt?: Date` — set on manual end or auto-stale close.
- `lastActivityAt: Date` — bumped on every climb attach. Drives staleness.
- `climbs: ObjectId<Climb>[]` — ordered by attach time.

A session is **active** iff `endedAt` is unset.

### Staleness

- Constant `SESSION_STALE_MS = 4 * 60 * 60 * 1000` (4h).
- Computed lazily at read time: `isStale = !endedAt && (now - lastActivityAt) > SESSION_STALE_MS`.
- No background job in v1. Staleness resolves when the user logs a climb or hits any session endpoint. When the user confirms "new session," the prior session is closed (`endedAt = lastActivityAt`).

**Why no cron:** lazy resolution is sufficient for correctness. A sweeper can land later if stats/exports need consistent state.

### Endpoints (`backend/src/api/training-sessions/`)

Follows the existing climbs API layout (`-get`, `-get-by-id`, `-put`, `-delete`, `-mapper`).

- `GET /training-sessions` — list owned sessions, sorted by `startedAt` desc.
- `GET /training-sessions/:id` — one session, climbs populated.
- `GET /training-sessions/active` — the user's active session if one exists. Includes `isStale` flag so the client can prompt without a second call.
- `PUT /training-sessions` — create-or-update (matches the climb PUT-as-upsert convention).
- `POST /training-sessions/:id/end` — manual end.
- `DELETE /training-sessions/:id` — owner only.

### Climb-attach behavior

The existing climb PUT handler (`backend/src/api/climbs/climbs-put.ts`) gains session-aware logic on **create** (not on edit). Before saving:

1. Find the caller's most recent active session.
2. **None found** → throw `CodedError("NO_ACTIVE_SESSION")`. Climb is not saved.
3. **Found and fresh** → save climb, push id into `session.climbs`, bump `lastActivityAt`. Response includes the session id.
4. **Found and stale** → throw `CodedError("STALE_SESSION", _, { sessionId, lastActivityAt })`.

The client retries with an explicit hint via query param:
- `?sessionAction=start` → create a new session, save the climb into it.
- `?sessionAction=resume` → refresh `lastActivityAt` on the stale session, save the climb.
- `?sessionAction=new` → close the stale session, create a new one, save the climb.

**Why query-param hints over a separate "start session" call:** keeps logging atomic from the user's perspective. No orphaned sessions if a second call fails.

---

## Files Touched

- New: `backend/src/models/training-session.ts`.
- New: `backend/src/api/training-sessions/*` (CRUD + active + end).
- New: `backend/src/infrastructure/coded-error.ts`.
- Modified: `backend/src/api/api-utils.ts` — `handleApiError` serializes `CodedError`.
- Modified: `backend/src/api/climbs/climbs-put.ts` — attach logic + `sessionAction` query param.

---

## Verification

1. **Unit tests for the climb PUT handler** covering the three branches (`NO_ACTIVE_SESSION`, fresh attach, `STALE_SESSION`) and each `sessionAction` variant.
2. **Endpoint tests** for the six new routes.
3. **Manual curl checks**:
   - `GET /training-sessions/active` with no session → `data: null`.
   - `PUT /climbs` with no session → 4xx + `error.code === "NO_ACTIVE_SESSION"`.
   - `PUT /climbs?sessionAction=start` → climb saved, session created, `/active` returns it.
   - Wait > 4h (or stub the constant) → second `PUT /climbs` returns `STALE_SESSION` with the session id.

## Open Questions / Lowest Confidence

- **Stale detection without a cron** — acceptable for v1; revisit if stats need consistent ended-at values.
- **`sessionAction` as query param vs. body field** — chose query param to keep the climb payload contract unchanged. Open to flipping.
