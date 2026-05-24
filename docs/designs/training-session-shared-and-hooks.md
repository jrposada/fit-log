# Design: Training Session — Shared Types & React Hooks

## Context

With [`training-session-backend`](training-session-backend.md) landing the model, endpoints, and the coded-error convention, this package exposes typed contracts and React Query hooks the UI can consume — including the climb-creation hook update that surfaces `NO_ACTIVE_SESSION` / `STALE_SESSION` as actionable typed errors.

Depends on: [`training-session-backend`](training-session-backend.md).
Required by: [`training-session-overlay-ui`](training-session-overlay-ui.md).

---

## Problem

- No shared types describe a training session or the new session-related endpoints.
- The existing `ApiResponse` shape has no slot for an app-level error code, so the climb hook can't differentiate session-related failures from anything else.
- There is no hook driving an "active session" UI.

## Goal

- Mirror the backend model and endpoints with Zod-validated shared types.
- Extend `ApiResponse` to carry the optional `error.code` payload.
- Provide React Query hooks for active session, list, detail, mutations.
- Teach the climb hook to recognise and rethrow `NO_ACTIVE_SESSION` / `STALE_SESSION` as typed errors, and to accept an optional `sessionAction` hint.

---

## Architecture

### Shared types — `shared/src/models/training-session/`

Follows the climb pattern (per-operation files, Zod schemas, type tests).

- `training-session.ts` — base type:
  ```
  WithOwnership<WithTimestamps<{
    id, title, notes?, location?, startedAt, endedAt?, lastActivityAt, climbs
  }>>
  ```
  Plus a derived `isStale: boolean` field on read responses.
- `training-session-get.ts`, `training-session-get-by-id.ts`, `training-session-get-active.ts`, `training-session-put.ts`, `training-session-end.ts`, `training-session-delete.ts`.
- Test files (`*.test.ts`) validating shapes, matching the climb test layout.

### Updated `ApiResponse`

Convert the response type to a discriminated union:

```
ApiResponse<T> =
  | { success: true,  data: T }
  | { success: false, error?: { code: string, message?: string, meta?: object } }
```

Existing call sites stay valid: previous error responses just have an absent `error`.

### React hooks — `shared-react/src/api/training-sessions/`

Uses `@tanstack/react-query` and the existing `query()` / `mutation()` wrappers found in `shared-react/src/api/climbs/`.

- `useActiveSession()` — `useQuery`, refetch on focus. Drives the overlay.
- `useTrainingSessions()` — list.
- `useTrainingSession(id)` — detail.
- `usePutTrainingSession()`, `useEndSession(id)`, `useDeleteSession(id)` — mutations. Each invalidates `activeSession` (and the list, where relevant) on success.

### Climb hook update

The existing climb create/update hook under `shared-react/src/api/climbs/` is extended:

- On error, inspect `error.response.data.error?.code`. If it matches `NO_ACTIVE_SESSION` or `STALE_SESSION`, rethrow a **typed** error (e.g. `SessionPromptError`) carrying `code` and `meta` so the UI can branch in a single `try/catch` (or `onError`) without inspecting raw Axios shapes.
- Accept an optional `sessionAction: "start" | "resume" | "new"` mutate arg; pass it through as a query param.
- On success, invalidate the `activeSession` query.

**Why surface as typed errors rather than auto-prompting in the hook:** the prompt UI is owned by the overlay (next package). Hooks stay UI-agnostic.

---

## Files Touched

- New: `shared/src/models/training-session/*` (+ tests).
- New: `shared-react/src/api/training-sessions/*` (one hook per file, climb-style).
- Modified: `shared/src/models/api-response.ts` (or the equivalent shared response type).
- Modified: existing climb hook(s) under `shared-react/src/api/climbs/`.

---

## Verification

1. **Type tests pass** under `shared/src/models/training-session/*.test.ts`.
2. **Hook smoke test** in a throwaway page: `useActiveSession()` renders state changes after `usePutTrainingSession()` runs.
3. **Climb hook branching** — fire the climb create with no active session and confirm the caller receives a `SessionPromptError` with `code === "NO_ACTIVE_SESSION"`, not a generic Axios error.
4. **Retry path** — call the climb create with `sessionAction: "start"` and confirm it succeeds + invalidates `activeSession`.

## Open Questions / Lowest Confidence

- **Naming of the typed error class** (`SessionPromptError` vs `CodedError` on the client). Either works; pick what aligns with existing client error types if any.
- **Polling vs. focus-only refetch for `useActiveSession`** — defaulting to refetch-on-focus; revisit if the overlay feels stale during long sessions.
