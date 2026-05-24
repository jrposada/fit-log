# TODO

## Home

- [ ] **Dashboard with real data** — Screen exists with 6 stat cards but all values are hardcoded mocks (42 workouts, 5 this week, 7-day streak, 24h 30m, 128 climbs, V7 PB). Needs API integration to pull real stats.

## Climbing

- [ ] **Logbook virtualization (FlashList)** — Today the list is a plain `.map` inside `Screen`'s `ScrollView`, so every loaded card mounts at once and pagination relies on a "Load more" button. A first attempt at swapping in `@shopify/flash-list` required removing the `ScrollView` from `Screen` and giving each existing screen its own `ScrollView`, plus encoding LocationSelector/filter/empty/loading as heterogeneous `FeedItem` rows so only the filter sticks. The mechanics worked and typecheck passed but the resulting LogbookTab felt over-engineered. Revisit with a simpler approach (e.g. keep `Screen`'s scroll, accept always-visible filter; or build a small `ScrollScreen`/`ListScreen` variant; or move sticky behavior to a wrapper component instead of stuffing chrome into the list data). Plan archive: `~/.claude/plans/mutable-waddling-sparkle.md`.
- [ ] **Stats tab** — Empty placeholder. Needs UI for sends count, attempts count, grade distribution charts, session analytics.
- [ ] **Mobile sharing UI** — backend exposes `PUT/DELETE /<resource>/:id/collaborators/:userId` for climb/location/sector/image. No UI yet — owners can't actually grant access. Build a "Manage collaborators" screen per resource (list members, search users, pick `edit` / `delete`, revoke).

## Climb Image Editor

- [ ] **Start/end/feet-only hold types** — Add hold type classification. Users mark holds as start, end, or feet-only with distinct visual indicators (color/shape). Requires updating the Hold model to include a type field.
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
