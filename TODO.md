# TODO

## Home

- [ ] **Dashboard with real data** — Screen exists with 6 stat cards but all values are hardcoded mocks (42 workouts, 5 this week, 7-day streak, 24h 30m, 128 climbs, V7 PB). Needs API integration to pull real stats.

## Climbing

- [ ] **Logbook virtualization (FlashList)** — Today the list is a plain `.map` inside `Screen`'s `ScrollView`, so every loaded card mounts at once and pagination relies on a "Load more" button. A first attempt at swapping in `@shopify/flash-list` required removing the `ScrollView` from `Screen` and giving each existing screen its own `ScrollView`, plus encoding LocationSelector/filter/empty/loading as heterogeneous `FeedItem` rows so only the filter sticks. The mechanics worked and typecheck passed but the resulting LogbookTab felt over-engineered. Revisit with a simpler approach (e.g. keep `Screen`'s scroll, accept always-visible filter; or build a small `ScrollScreen`/`ListScreen` variant; or move sticky behavior to a wrapper component instead of stuffing chrome into the list data). Plan archive: `~/.claude/plans/mutable-waddling-sparkle.md`.
- [ ] **Mobile sharing UI** — backend exposes `PUT/DELETE /<resource>/:id/collaborators/:userId` for climb/location/sector/image. No UI yet — owners can't actually grant access. Build a "Manage collaborators" screen per resource (list members, search users, pick `edit` / `delete`, revoke).

## Training

- [ ] **Workout Plans** — Backend API (CRUD with exercises: name, description, sets, reps, rest, intensity) and shared types exist. Mobile UI is a placeholder card only. Needs full screens.
- [ ] **Sessions / Workout logging** — Backend API (CRUD with completedAt) and shared types exist. Mobile UI missing. Needs screens to log and review training sessions.
- [ ] **Strength Training** — Placeholder card on training screen. No backend or UI beyond the stub.
- [ ] **Endurance** — Placeholder card on training screen. No backend or UI beyond the stub.
- [ ] **Flexibility** — Placeholder card on training screen. No backend or UI beyond the stub.
- [ ] **Training Stats** — Placeholder card on training screen. No backend or UI beyond the stub.
- [ ] **Personal Records** — Placeholder card on training screen. No backend or UI beyond the stub.

## Backend

- [ ] **Split API and business layers** — structural pass DONE (`api/` is the transport layer: `api/routes/<resource>/` with handlers + `<resource>-routes.ts` registration composed in `api/router.ts`; `api/mappers/<entity>.ts`; `api/middlewares/`; `api/infrastructure/api-utils.ts`), with contracts documented in `api/routes/README.md` and `api/mappers/README.md`. Extraction pass in progress, resource by resource: move business logic into `src/services/` (services return model types, never import express or touch status codes, throw `src/infrastructure/` domain errors; handlers only parse params → call service → map via `toApi*`). DONE: climb-histories (`services/climb-history.ts` — guards/types from the old `climb-histories-utils.ts` plus all six endpoints' logic; cursor base64url codec stays in the handler pending the common pagination layer), feed (`services/feed.ts` — adapter contract, merge/sort, `getFeed` orchestration moved out of `feed-get.ts`; `services/feed-adapter-climbing.ts` moved as-is from `api/routes/feed/feed-adapter-climbing.ts`; cursor codec stays in the handler, same as climb-histories), climbing-sessions (`services/climbing-session.ts` — added `getClimbingSessions`/`getClimbingSessionById`/`upsertClimbingSession`/`deleteClimbingSession` alongside the existing summary-recompute logic; all four `climbing-sessions-*.ts` handlers are now parse → service → map), climbs-search (`services/climb.ts` — added `searchClimbs`, returning populated climbs plus a status-by-id map; handler just merges and maps), the single/batch puts (`services/climb.ts:upsertClimb`, new `services/location.ts:upsertLocation`, new `services/sector.ts:upsertSector`/`batchUpsertSectors` — the latter keeps the `mongoose` transaction/session handling that used to live in `sectors-batch-put.ts`), and the Training stubs (`services/workout.ts`, `services/session.ts` — no ownership on these two models, so it's a plain get/getById/upsert/delete extraction, no `owner` filtering). DONE: collaborator put/delete handlers for climbs/locations/sectors/images (`services/climb.ts:addClimbCollaborator`/`removeClimbCollaborator`, `services/location.ts:addLocationCollaborator`/`removeLocationCollaborator`, `services/sector.ts:addSectorCollaborator`/`removeSectorCollaborator`, new `services/image.ts:addImageCollaborator`/`removeImageCollaborator` — each wraps the existing `utils/collaborator-mutators.ts` query builders with the resource's populate chain and 404 handling; handlers are now parse → service → map, same shape as the other extractions). Extraction pass is now complete across all resources.
- [ ] **Common pagination layer** — Cursor pagination logic is duplicated across endpoints: `decodeCursor` (base64url + JSON parse + shape validation) and its matching encode/keyset-query logic exist in both `backend/src/api/climb-histories/climb-histories-get.ts` and `backend/src/api/feed/feed-get.ts`, differing only in cursor shape (`updatedAt`/`id` vs `startedAt`/`id`/`sport`). Extract a shared, generic cursor codec + pagination-result helper (encode/decode with per-endpoint schema validation, `items`/`nextCursor` envelope) into a common layer so new paginated endpoints don't re-implement it.

## App

- [ ] **User profile / Settings** — User model exists in backend (keycloakId, email, name, roles) but no profile screen or settings UI in the mobile app.

