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

Failure responses keep the existing `{ data, success: false }` shape. For coded errors, the structured payload rides in `data` instead of adding a new top-level field.

- `packages/shared/src/models/api-error-code.ts` — `ApiErrorCode` enum. First entry: `RelatedEntityRequired = 'related_entity_required'`.
- `packages/shared/src/models/errors/related-entity-required.ts` — body shape:
  ```ts
  type RelatedEntityRequired = {
    code: ApiErrorCode.RelatedEntityRequired;
    entity: string;     // e.g. 'trainingSession'
    forcible: boolean;  // can the client retry with forced=true?
  };
  ```
- `packages/backend/src/infrastructure/related-entity-required-error.ts` — throwable carrying `entity` + `forcible`.
- `packages/backend/src/api/api-utils.ts` — `handleApiError` maps the error to **HTTP 428 Precondition Required** with `data` populated from the payload above.

**Why this shape:** keeps the existing `ApiResponse<T>` contract untouched (no discriminated union, no new optional field); coded failures are additive. **Why 428:** the request *would* be valid once the named related entity exists — semantically a precondition, not a conflict or validation error.

**Why generic ("related entity required") rather than session-specific codes:** the same precondition pattern reappears any time a child resource needs a parent (e.g. climbs needing a sector). One code + an `entity` discriminator covers them all.

### Model — `TrainingSession`

Location: `packages/backend/src/models/training-session.ts`. Follows the existing model pattern (`WithTimestamps`, `timestamps: true`).

Fields:
- `owner: ObjectId<User>` — single-owner only; no collaborators.
- `title: string` — required.
- `notes?: string`.
- `location: ObjectId<Location>` — **required**.
- `startedAt: Date` — set at creation.
- `endedAt?: Date` — set on manual end (no endpoint yet; see "Not yet implemented" below).
- `lastActivityAt: Date` — bumped on activity. Drives staleness.
- `climbHistories: ObjectId<ClimbHistory>[]` — ordered by attach time. Sessions group **climb histories** (per-climb logs), not raw climbs.

A session is **active** iff `endedAt` is unset.

### Staleness

- Constant `SESSION_STALE_MS = 4 * 60 * 60 * 1000` (4h) lives on the model.
- Not enforced server-side at the climb-history write path in this iteration. Staleness will be surfaced by the read endpoints / client when needed.

### Endpoints (`packages/backend/src/api/training-sessions/`)

Plain CRUD — no special `/active` or `/end` routes. "Active" and "end" are expressed through the standard verbs:

- `GET /training-sessions` — list owned sessions, sorted by `startedAt` desc. Accepts `?limit` and `?active=true` (filters to sessions where `endedAt` is unset). To fetch the current active session: `GET /training-sessions?active=true&limit=1`.
- `GET /training-sessions/:id` — one session, location + climbHistories populated.
- `PUT /training-sessions` — create-or-update upsert. Ending a session is just a `PUT` with `endedAt` set (no dedicated `/end` action).
- `DELETE /training-sessions/:id` — owner only.

**Why CRUD-only:** every special-cased verb we considered (`/active`, `/end`) collapses cleanly into the existing list filter + `PUT`. Fewer endpoints, fewer hooks, one consistent shape.

### Climb-history-attach behavior

The handler is `packages/backend/src/api/climb-histories/climb-histories-put.ts` (training sessions group climb histories, not climbs directly). On **create** — i.e. when the request omits `tryId` — the handler enforces the precondition:

1. If `trainingSession` is provided in the body, persist it into the new climb history via `$setOnInsert`.
2. If `trainingSession` is missing **and** `forced !== true`, throw `RelatedEntityRequiredError('trainingSession', true)`. The handler returns **428** with `data: { code, entity: 'trainingSession', forcible: true }`. Nothing is written.
3. If `forced === true`, the climb history is created without a session reference.

Appending a try to an existing climb history (request includes `tryId`) skips the check — the parent record already has its session (or was explicitly forced earlier).

**Why a body field + `forced` flag instead of a query param:** the precondition pattern is generic, so the signaling lives next to the resource it gates. `forced` makes the bypass explicit and auditable. **Why no automatic stale handling here:** keeps the write path simple. The client decides whether to start, reuse, or end a session before retrying.

---

## Files Touched

- New: `packages/backend/src/models/training-session.ts`.
- New: `packages/backend/src/api/training-sessions/*` (get, get-by-id, put, delete, mapper).
- New: `packages/backend/src/infrastructure/related-entity-required-error.ts`.
- New: `packages/shared/src/models/api-error-code.ts`, `packages/shared/src/models/errors/related-entity-required.ts`.
- Modified: `packages/backend/src/api/api-utils.ts` — `handleApiError` maps `RelatedEntityRequiredError` to 428 with the payload in `data`.
- Modified: `packages/backend/src/api/climb-histories/climb-histories-put.ts` — precondition check + `trainingSession`/`forced` request fields.
- Modified: `packages/shared/src/models/climb-histories/climb-histories-put.ts` — adds optional `trainingSession` and `forced` (with zod schema).

---

## Verification

Manual checks against the implemented endpoints:

- `PUT /climb-histories` with no `trainingSession` and `forced !== true` → 428, body `data.code === "related_entity_required"`, `data.entity === "trainingSession"`, `data.forcible === true`. Nothing persisted.
- `PUT /climb-histories` with `trainingSession: <id>` → 200, climb history created with `trainingSession` populated.
- `PUT /climb-histories` with `forced: true` → 200, climb history created with `trainingSession: null`.
- `PUT /climb-histories` with `tryId` set → precondition skipped regardless of `trainingSession`.

## Not Yet Implemented

- `?active=true` filter on `GET /training-sessions` — needs to be added to the existing list handler (one-line predicate on `endedAt`).
- Server-side staleness handling on the climb-history write path. The 4h constant exists on the model for future use.
- Auto-bumping `lastActivityAt` on the session when a climb history attaches.

## Open Questions / Lowest Confidence

- **Where staleness should be enforced** — at the climb-history write (auto-end + re-prompt) or only surfaced via reads. Current iteration takes the latter, simpler route.
- **`forced` semantics** — currently a hard bypass. If we ever want richer reasons (e.g. "user dismissed prompt" vs "background sync"), it may need to grow into an enum.
