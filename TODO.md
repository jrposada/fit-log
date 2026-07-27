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

- [ ] **Split API and business layers** — `backend/src/api/` currently owns both HTTP route handlers and business logic, which forces business-layer modules into api folders (e.g. `climbing-sessions-summary.ts`, `feed-adapter-climbing.ts` / `feed-adapters.ts`, none of which are endpoints). Agreed target structure:
  - `api/routes/<resource>/` — handlers, each with its `<resource>-mapper.ts` colocated. `api/routes/_shared/` for the cross-resource auth mappers (current `api/auth/`).
  - `api/middlewares/` — current `src/middleware/` (keycloak auth, validate-body/params/query).
  - `api/infrastructure/` — current `api-utils.ts` (`toApiResponse` wrapper, error→status mapping). Distinct from `src/infrastructure/` (domain errors), which stays.
  - `api/router.ts` — moved from `src/router.ts`.
  - `src/auth/` (Mongo filter builders) stays outside `api/` — it's authorization/data-access logic consumed by the business layer.
  - `src/services/` becomes the business layer: services return model types (populated Mongoose docs / lean domain shapes), never import express or touch status codes, and throw `src/infrastructure/` domain errors. Handlers only parse params → call service → map to api response via `toApi*`.
  - `api/routes/README.md` documents the handler contract; note the services contract too.
  - Sequencing: (1) structural pass — `git mv` + import fixes + READMEs, no behavior change; (2) extraction pass, resource by resource, starting with climbing-sessions summary recompute and feed adapters/merge, then fat handlers (`climbs-search.ts`, `climb-histories-stats.ts`, the puts).
- [ ] **Common pagination layer** — Cursor pagination logic is duplicated across endpoints: `decodeCursor` (base64url + JSON parse + shape validation) and its matching encode/keyset-query logic exist in both `backend/src/api/climb-histories/climb-histories-get.ts` and `backend/src/api/feed/feed-get.ts`, differing only in cursor shape (`updatedAt`/`id` vs `startedAt`/`id`/`sport`). Extract a shared, generic cursor codec + pagination-result helper (encode/decode with per-endpoint schema validation, `items`/`nextCursor` envelope) into a common layer so new paginated endpoints don't re-implement it.

## App

- [ ] **User profile / Settings** — User model exists in backend (keycloakId, email, name, roles) but no profile screen or settings UI in the mobile app.

