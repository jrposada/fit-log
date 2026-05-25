# Design: Training Session — Shared Types & React Hooks

## Context

With [`training-session-backend`](training-session-backend.md) landing the model, endpoints, and the coded-error convention, this package exposes typed contracts and React Query hooks the UI can consume — including the climb-creation hook update that surfaces `NO_ACTIVE_SESSION` / `STALE_SESSION` as actionable typed errors.

Depends on: [`training-session-backend`](training-session-backend.md).
Required by: [`training-session-overlay-ui`](training-session-overlay-ui.md).

---

## Problem

- No shared types describe a training session or the new session-related endpoints.
- The climb-history hook can't yet differentiate the 428 precondition response from any other failure — it currently throws a generic `Api error`.
- There is no hook driving an "active session" UI.

## Goal

- Mirror the backend model and endpoints with Zod-validated shared types.
- Reuse the shared `ApiErrorCode` enum + `RelatedEntityRequired` body shape introduced by the backend package — no further changes to `ApiResponse`.
- Provide React Query hooks for training sessions (list, detail, mutations).
- Teach the climb-history hook to recognise 428 + `related_entity_required` and rethrow it as a **typed** error so the UI can branch without inspecting raw Axios shapes, and to accept optional `trainingSession` / `forced` mutate args.

---

## Architecture

### Shared types — `packages/shared/src/models/training-sessions/`

Follows the existing climb-histories pattern (per-operation files, Zod schemas, type tests).

- `training-session.ts` — base type:
  ```ts
  WithTimestamps<{
    id, owner, title, notes?, location, startedAt, endedAt?, lastActivityAt, climbHistories
  }>
  ```
- `training-sessions-get.ts`, `training-sessions-get-by-id.ts`, `training-sessions-put.ts`, `training-sessions-delete.ts`.
- Test files (`*.test.ts`) validating shapes, matching the climb-histories test layout.

These types must already exist for the backend handlers; this package focuses on the consumer-side hooks and on the climb-history hook update.

### Coded error payload (already shared)

The backend package already publishes:

- `packages/shared/src/models/api-error-code.ts` — `ApiErrorCode` enum.
- `packages/shared/src/models/errors/related-entity-required.ts` — `RelatedEntityRequired` body shape (`code`, `entity`, `forcible`).

`ApiResponse<T>` is **unchanged**. Coded failures arrive as `{ success: false, data: RelatedEntityRequired }` with HTTP 428.

### React hooks — `packages/shared-react/src/api/training-sessions/`

Uses `@tanstack/react-query` and the existing `query()` / `mutation()` wrappers under `shared-react/src/api/`.

- `useTrainingSessions({ active?, limit? })` — list. Passes `active=true` / `limit` through as query params. The "active session" is just `useTrainingSessions({ active: true, limit: 1 })` — no dedicated hook needed.
- `useTrainingSession(id)` — detail.
- `useTrainingSessionPut()`, `useTrainingSessionDelete(id)` — mutations. Invalidate the `training-sessions` query and (where the response affects them) `climb-histories`. Ending a session is a `useTrainingSessionPut` call with `endedAt` set — no dedicated `useEndSession`.

### Climb-history hook update

The existing `useClimbHistoriesPut` hook under `packages/shared-react/src/api/climb-histories/use-climb-histories-put.ts` is extended:

- Accept optional `trainingSession?: string` and `forced?: boolean` mutate args; pass them through in the request body (the shared request type already carries them).
- On Axios error with status **428** and `data.code === ApiErrorCode.RelatedEntityRequired`, rethrow a **typed** error (e.g. `RelatedEntityRequiredClientError`) carrying `entity` and `forcible` so the UI can branch in a single `onError` callback.
- On success, invalidate `climb-histories`, `climbs.search`, and `training-sessions`.

**Why surface as typed errors rather than auto-prompting in the hook:** the prompt UI is owned by the overlay (next package). Hooks stay UI-agnostic.

---

## Files Touched

- New: `packages/shared/src/models/training-sessions/*` (+ tests).
- New: `packages/shared-react/src/api/training-sessions/*` (one hook per file, matching the climb-histories style).
- Modified: `packages/shared-react/src/api/climb-histories/use-climb-histories-put.ts` — accept `trainingSession`/`forced`, recognise the 428 precondition response, rethrow as a typed error.

Not modified: `packages/shared/src/models/api-response.ts` — the existing shape already accommodates the coded error payload.

---

## Verification

1. **Type tests pass** under `packages/shared/src/models/training-sessions/*.test.ts`.
2. **Hook smoke test** — `useTrainingSessions()` updates after `useTrainingSessionPut()` runs.
3. **Climb-history hook branching** — fire `useClimbHistoriesPut` without `trainingSession` and without `forced`; confirm the caller's `onError` receives the typed `RelatedEntityRequiredClientError` (not a generic message).
4. **Retry paths** — call again with `trainingSession: <id>` and (separately) with `forced: true`; both succeed and invalidate the expected queries.

## Open Questions / Lowest Confidence

- **Naming of the typed client error** — `RelatedEntityRequiredClientError` is verbose; could shorten to `PreconditionError` if more cases land.
