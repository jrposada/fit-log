# Training Session: currentClimbId field

**Date:** 2026-09-06

## What to build

Add an optional `currentClimbId` field to `TrainingSession`, identifying which climb the flyover's quick-attempts stepper ([[active-session-flyover-stepper]]) and the Log-a-Try sheet ([[log-a-try-sheet]]) act on. No new endpoint — `TrainingSession` is already upserted whole via the existing generic PUT (`shared-react/api/training-sessions/use-training-sessions-put.ts`), following the same pattern already used by `use-start-training-session.ts` / `use-stop-training-session.ts` (map the full session into a `TrainingSessionsPutRequest` and call `useTrainingSessionsPut`).

Layers touched:

| Layer | File | Change |
|---|---|---|
| Shared type | `packages/shared/src/models/training-sessions/training-session.ts` | Add `currentClimbId?: string` |
| Shared PUT contract | `packages/shared/src/models/training-sessions/training-sessions-put.ts` | Add `currentClimbId` to `TrainingSessionsPutRequest` and to `trainingSessionsPutRequestSchema` (optional, `z.string().nonempty()`) |
| Backend DB model | Mongoose schema backing `TrainingSession` | Add optional `currentClimbId` field |
| Backend API | Training-session PUT route | No handler change expected — it already persists the request body against the schema; verify it doesn't strip unknown/new fields via a hardcoded allowlist |
| shared-react | none | Existing `useTrainingSessionsPut` already accepts arbitrary `TrainingSessionsPutRequest` fields |

Consumers set `currentClimbId` by resubmitting the full session (same shape `use-stop-training-session.ts` builds) with the field added/changed — no bespoke "set current climb" mutation.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Reuse generic PUT instead of a new endpoint | Yes | The session is already a full-document upsert with an established client-side mapping pattern; a dedicated endpoint would duplicate that for one field |
| Store a climb id, not a ClimbHistory id | `currentClimbId` references `climb`, not `ClimbHistory` | `session.climbHistories[].climb` is how a climb is looked up within the session; keying on climb id makes lookup direct and matches how the Log-a-Try sheet identifies climbs |
| Field is optional | Yes | Sessions with no logged tries yet (or ended sessions) have no current climb |

## Gotchas

- `TrainingSessionsPutRequest` requires the full session payload (`title`, `startedAt`, `climbHistories`, etc.) — every writer of `currentClimbId` must build that full payload, not a partial patch. Follow the mapping already done in `use-stop-training-session.ts`.
- `currentClimbId` can point at a climb with no `ClimbHistory` yet the instant a climb is picked in the Log-a-Try sheet before the try is saved; consumers (the stepper) must handle "current climb has zero tries" — see [[active-session-flyover-stepper]] Gotchas.
- Verify the backend PUT handler doesn't use a hardcoded allowlist of fields when building the Mongoose update — if it does, `currentClimbId` needs to be added there explicitly, not just to the schema.
