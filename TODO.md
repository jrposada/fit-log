# TODO

## Auth

- [x] **Keycloak OAuth with PKCE** — Login screen with Email/Password, Google, and Apple sign-in. Token persistence via expo-secure-store, automatic refresh.

## Home

- [ ] **Dashboard with real data** — Screen exists with 6 stat cards but all values are hardcoded mocks (42 workouts, 5 this week, 7-day streak, 24h 30m, 128 climbs, V7 PB). Needs API integration to pull real stats.

## Climbing

- [x] **Logbook tab** — Paginated climb-history feed (cursor-based) with status filters (projects / in progress / completed / all) and optional location scoping. Location selector dropdown (clear = all locations). Climb cards with quick status update (send, flash, attempt). "Log Custom Climb" button (per-location). Swipe hint animation on first card. Projects tab collapsed here as a filter (`isProject: true`) instead of a separate tab.
- [ ] **Logbook virtualization (FlashList)** — Today the list is a plain `.map` inside `Screen`'s `ScrollView`, so every loaded card mounts at once and pagination relies on a "Load more" button. A first attempt at swapping in `@shopify/flash-list` required removing the `ScrollView` from `Screen` and giving each existing screen its own `ScrollView`, plus encoding LocationSelector/filter/empty/loading as heterogeneous `FeedItem` rows so only the filter sticks. The mechanics worked and typecheck passed but the resulting LogbookTab felt over-engineered. Revisit with a simpler approach (e.g. keep `Screen`'s scroll, accept always-visible filter; or build a small `ScrollScreen`/`ListScreen` variant; or move sticky behavior to a wrapper component instead of stuffing chrome into the list data). Plan archive: `~/.claude/plans/mutable-waddling-sparkle.md`.
- [x] **Browse tab** — Search climbs across all locations. Location filter dropdown. Grade filter chips (V0-V17). 300ms debounced search input. Climbs grouped by sector with collapsible sections. Climb cards showing user status.
- [x] **Climb detail / Create & Edit** — Create/update climb modal with name, grade (V0-V17), description. Interactive image with hold marking (tap to add/remove). Sector selector. Image selection (camera/library). History quick-log. Project/unproject toggle. Delete with confirmation.
- [x] **Location detail / Create & Edit** — Create/update location modal with name, description, lat/lng. Map point picker. Sectors CRUD (add/edit/delete with name, description, image). Image picker for sectors. Unsaved changes banner. Delete confirmation dialogs.
- [x] **Map point picker** — Modal with draggable map marker. Address search input. Confirm pin placement.
- [x] **Image upload & processing** — Camera/library picker. Image upload endpoint returning imageUrl, thumbnailUrl, width, height. Image gallery modal.
- [x] **Projects tab** — Collapsed into Logbook tab as a dedicated filter (`status: ['project']`). No separate tab needed since the backend already aggregates by climb; Projects filter surfaces `isProject: true` entries within the same paginated feed.
- [ ] **Stats tab** — Empty placeholder. Needs UI for sends count, attempts count, grade distribution charts, session analytics.
- [x] **User climb ownership** — `owner` + `collaborators` on climb/location/sector/image (public read, owner+collaborators+admin write). `admin` Keycloak role bypasses ownership. Collaborators are managed via dedicated endpoints `PUT/DELETE /<resource>/:id/collaborators/:userId` (owner-or-admin only). Run `dev-tools setup migrate-ownership` against existing data before deploying.
- [ ] **Mobile sharing UI** — backend exposes `PUT/DELETE /<resource>/:id/collaborators/:userId` for climb/location/sector/image. No UI yet — owners can't actually grant access. Build a "Manage collaborators" screen per resource (list members, search users, pick `edit` / `delete`, revoke).
- [x] **Owner-aware UI gating** — Mobile app currently lets every user see the edit/delete buttons; the server returns 403 if they're not allowed. Hide the buttons on the client by exposing the backend user id + roles via a `/me` endpoint.
- [x] **Expose user details on owner / collaborator.user** — API currently returns `owner` and `collaborator.user` as raw user id strings. Replace with a `UserSummary` shape (`{ id, name }` for now, room to grow). Requires: shared `UserSummary` type; updating `Collaborator` and `OwnedRecord` types; updating `canEdit` / `canDelete` / `isOwnerOrAdmin` to compare `record.owner.id` instead of `record.owner`; populating `owner` and `collaborators.user` in every GET/PUT/POST handler that returns climb / location / sector / image; updating each mapper and a new `toApiUserSummary` helper; updating frontend hooks/components that read `owner` as a string.

## Climb Image Editor

- [x] **Hold points misplaced when zoomed** _(bug)_ — Tapping to place holds does not position them correctly if the image is zoomed in. Tap coordinates are not properly translated to image-space at non-1x zoom levels.
- [x] **Edit mode renders at different scale than view mode** _(bug)_ — Edit mode does not display at full screen like view mode. Some holds fall outside the visible area. Needs analysis: fix scale or fix seeder data.
- [x] **Spline mode for hold connections** — Add a spline/path drawing mode so users can draw curved lines connecting holds, representing the climbing route/sequence.
- [x] **Selection + Removal + Hold Radius** — Tap-to-select interaction model, floating action toolbar (delete, resize), `radius` field on Hold type. See [`docs/tickets/001-selection-removal-hold-radius.md`](docs/tickets/001-selection-removal-hold-radius.md).
- [x] **Move / Drag** — Single-finger drag to reposition selected holds and spline points. See [`docs/tickets/002-move-drag.md`](docs/tickets/002-move-drag.md).
- [x] **Spline Point Insertion** — Tap on the spline curve between two points to insert a new control point. See [`docs/tickets/003-spline-point-insertion.md`](docs/tickets/003-spline-point-insertion.md).
- [x] **Start/end/feet-only hold types** — Add hold type classification. Users mark holds as start, end, or feet-only with distinct visual indicators (color/shape). Requires updating the Hold model to include a type field.
- [ ] **Change image during climb create** — Allow users to replace the selected image while creating a climb, rather than being locked into the first choice.

## Training

- [ ] **Workout Plans** — Backend API (CRUD with exercises: name, description, sets, reps, rest, intensity) and shared types exist. Mobile UI is a placeholder card only. Needs full screens.
- [ ] **Sessions / Workout logging** — Backend API (CRUD with completedAt) and shared types exist. Mobile UI missing. Needs screens to log and review training sessions.
- [ ] **Strength Training** — Placeholder card on training screen. No backend or UI beyond the stub.
- [ ] **Endurance** — Placeholder card on training screen. No backend or UI beyond the stub.
- [ ] **Flexibility** — Placeholder card on training screen. No backend or UI beyond the stub.
- [ ] **Training Stats** — Placeholder card on training screen. No backend or UI beyond the stub.
- [ ] **Personal Records** — Placeholder card on training screen. No backend or UI beyond the stub.

## App

- [ ] **User profile / Settings** — User model exists in backend (keycloakId, email, name, roles) but no profile screen or settings UI in the mobile app.

## Tooling

- [ ] **Bump mongoose to ^9.6.x** — currently pinned to `9.0.0` in `packages/backend` and `packages/dev-tools` because newer mongoose pulls in mongodb driver `~7.2`, whose stricter conditional types break `packages/backend/src/utils/batch-upsert-owned-document.ts` (`$setOnInsert` against generic `T` and `model.bulkWrite(ops, …)` overload mismatch) and `packages/dev-tools/src/commands/setup/nuke.ts` (`model.deleteMany({})` over a heterogeneous model array). Workarounds explored required `as unknown as Partial<T>` / `as Parameters<typeof model.bulkWrite>[0]` casts, which we don't want. Revisit when the mongoose/mongodb typings settle, or refactor the helper so the constraint propagates without casts (e.g. accept a concrete `Model<TConcrete>` per call site instead of generic).
