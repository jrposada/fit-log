# TODO

## Auth

- [x] **Keycloak OAuth with PKCE** — Login screen with Email/Password, Google, and Apple sign-in. Token persistence via expo-secure-store, automatic refresh.

## Home

- [ ] **Dashboard with real data** — Screen exists with 6 stat cards but all values are hardcoded mocks (42 workouts, 5 this week, 7-day streak, 24h 30m, 128 climbs, V7 PB). Needs API integration to pull real stats.
- [ ] **History screen** — No history/activity feed screen exists. TODO comment found in app-bar.

## Climbing

- [x] **Quick Log tab** — Shows last 3 climb attempts/projects for selected location. Location selector dropdown. Climb cards with quick status update (send, flash, attempt). "Log Custom Climb" button. Swipe hint animation.
- [x] **Browse tab** — Search climbs across all locations. Location filter dropdown. Grade filter chips (V0-V17). 300ms debounced search input. Climbs grouped by sector with collapsible sections. Climb cards showing user status.
- [x] **Climb detail / Create & Edit** — Create/update climb modal with name, grade (V0-V17), description. Interactive image with hold marking (tap to add/remove). Sector selector. Image selection (camera/library). History quick-log. Project/unproject toggle. Delete with confirmation.
- [x] **Location detail / Create & Edit** — Create/update location modal with name, description, lat/lng. Map point picker. Sectors CRUD (add/edit/delete with name, description, image). Image picker for sectors. Unsaved changes banner. Delete confirmation dialogs.
- [x] **Map point picker** — Modal with draggable map marker. Address search input. Confirm pin placement.
- [x] **Image upload & processing** — Camera/library picker. Image upload endpoint returning imageUrl, thumbnailUrl, width, height. Image gallery modal.
- [ ] **Projects tab** — Backend support exists (isProject flag, useClimbHistoryProject hook). UI is an empty placeholder. Needs UI to list/track active projects and progress.
- [ ] **Stats tab** — Empty placeholder. Needs UI for sends count, attempts count, grade distribution charts, session analytics.
- [ ] **User climb ownership** — Climbs are currently shared/global. Add user ownership so each user has their own climbs. Requires adding a user reference to the Climb model, filtering by authenticated user in API queries, and updating the frontend accordingly.

## Climb Image Editor

- [x] **Hold points misplaced when zoomed** _(bug)_ — Tapping to place holds does not position them correctly if the image is zoomed in. Tap coordinates are not properly translated to image-space at non-1x zoom levels.
- [x] **Edit mode renders at different scale than view mode** _(bug)_ — Edit mode does not display at full screen like view mode. Some holds fall outside the visible area. Needs analysis: fix scale or fix seeder data.
- [x] **Spline mode for hold connections** — Add a spline/path drawing mode so users can draw curved lines connecting holds, representing the climbing route/sequence.
- [ ] **Dot resizing** — Allow users to resize hold dots to visually represent different hold sizes.
- [ ] **Start/end/feet-only hold types** — Add hold type classification. Users mark holds as start, end, or feet-only with distinct visual indicators (color/shape). Requires updating the Hold model to include a type field.

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
