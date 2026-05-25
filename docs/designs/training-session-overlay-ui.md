# Design: Training Session — Overlay & UI

## Context

With the backend ([`training-session-backend`](training-session-backend.md)) and the shared types/hooks ([`training-session-shared-and-hooks`](training-session-shared-and-hooks.md)) in place, this package delivers the user-facing surface: a persistent overlay visible on every screen plus the dialog flows triggered by the new session-related error codes during climb logging.

Depends on: [`training-session-shared-and-hooks`](training-session-shared-and-hooks.md).

---

## Problem

- There is no global UI signalling whether a session is active.
- Climb-history logging currently has no way to ask the user "start a new session?" or "resume an existing one?" — the backend's `related_entity_required` (HTTP 428) precondition is surfaced but unhandled in the UI.
- No screens exist to browse past sessions.

## Goal

- A persistent overlay mounted in the root layout that reflects active-session state and lets the user start/end sessions.
- A modal flow triggered when a climb-history create returns the 428 `related_entity_required` precondition for `entity: "trainingSession"`, offering "Start session" or "Save without session" (forced).
- List and detail routes for past sessions.

---

## Architecture

### Overlay placement

Mounted alongside `<AppBar />` in `app-web/src/routes/__root.tsx`. Sibling, not a child of `AppBar`, to keep concerns separate. Driven by `useActiveSession()` from the previous package.

### Overlay states

- **No active session** — compact pill: "Start session" button.
- **Active session (fresh)** — pill showing session title (defaults to start date) + climb count + **running total time**. Click → expanded popover (see metrics below) with "End session" and a link to the detail route.
- **Active session (stale)** — pill rendered with warning styling. Clicking surfaces the resume-or-new prompt directly (same modal as the stale-climb branch below).

### In-session metrics

A small ticking clock (1s interval, paused when the tab is hidden) drives live values without any extra backend calls — all metrics derive from `startedAt`, `lastActivityAt`, and the climbs already in the session payload.

**Pill (always visible while active):**
- Total session time: `now - startedAt`, formatted `H:MM`.
- Climb count.

**Expanded popover (on click):**
- Total session time (larger).
- **Time since last climb**: `now - lastActivityAt`, formatted `M:SS` under ~10 min, otherwise `H:MM`. Turns amber as it approaches the 4h stale threshold (e.g. > 3h).
- **Climbs logged**: total count, plus a small breakdown by grade if grades are present on the climbs.
- **Average rest between climbs**: total time / (climbs - 1), computed from climb `createdAt` timestamps when ≥ 2 climbs exist.
- **Hardest grade** sent so far (max grade in the session).
- "End session" button + link to the detail route.

The detail route (`/training-sessions/$id`) shows the same metrics in a fuller layout — the overlay popover is a glanceable subset.

**Why derive on the client:** all the inputs already ship with the active-session payload (climbs are populated). Avoids extra round-trips and keeps the clock smooth.

### Dialog controller

The overlay owns a small context/controller that any screen can call to open the session prompts. The climb-history logging screen catches the typed `RelatedEntityRequiredClientError` (raised by `useClimbHistoriesPut` on a 428 with `entity === "trainingSession"`) and delegates to this controller:

1. **`related_entity_required` for `trainingSession`** — modal:
   - Title: "Start a new training session?"
   - Buttons:
     - **Start & save climb** — opens a quick session-create flow, then retries the climb-history create with `trainingSession: <newId>`.
     - **Save without session** — only shown when the response's `forcible === true`. Retries with `forced: true`.
     - **Cancel** — climb-history discarded (call this out explicitly).
2. **Stale-session UX** — deferred. The backend doesn't yet enforce staleness on the write path; when it does (or surfaces it via `GET /training-sessions/active`), add a resume/new variant here.
3. **Manual end** from the overlay popover — confirmation modal, then `POST /training-sessions/:id/end` via `useEndSession`. **Endpoint not yet implemented** — block end-from-overlay until it lands, or fall back to a `PUT` that sets `endedAt`.

**Why a shared controller** instead of inline dialogs in the climb-history screen: the same precondition prompt will be reusable for any future `related_entity_required` case (other entities, other endpoints).

### New screens

- `/training-sessions` — list of past + current sessions, newest first. Each row: title, date, location, climb count.
- `/training-sessions/$id` — detail. Shows climbs in attach order, editable title and notes, "End session" if still active.

Both routes live under `app-web/src/routes/training-sessions/` and follow the existing TanStack Router file-based pattern.

---

## Files Touched

- New: `app-web/src/features/training-sessions/session-overlay.tsx` (pill + popover).
- New: `app-web/src/features/training-sessions/session-dialog-controller.tsx` (context + prompt modals).
- New: `app-web/src/routes/training-sessions/index.tsx`, `app-web/src/routes/training-sessions/$id.tsx`.
- Modified: `app-web/src/routes/__root.tsx` — mount overlay + dialog controller provider.
- Modified: the existing climb-history create screen — catch `RelatedEntityRequiredClientError`, delegate to the controller, retry with either `trainingSession: <id>` or `forced: true`.

---

## Verification

End-to-end manual flow (run after all three packages land):

1. **Cold path** — log a climb-history with no active session → "Start a new training session?" modal → confirming creates a session and retries the climb-history create with `trainingSession: <newId>` → overlay flips to the active state.
2. **Hot path** — log a second climb-history while the session is active → no prompt, request includes `trainingSession`, overlay count increments.
3. **Forced path** — log a climb-history and choose "Save without session" → request retries with `forced: true`, climb-history is created with `trainingSession: null`.
4. **Manual end** — overlay popover → End session → overlay returns to "Start session" state; detail page shows `endedAt`. *(Blocked on the end endpoint — see backend doc.)*
5. **Cross-screen overlay** — confirm the overlay is visible on every route, including the new session detail screen.

## Open Questions / Lowest Confidence

- **Overlay vs. integrating into AppBar** — sibling chosen for clean separation; visual tightness may push us to embed it inside AppBar later.
- **Discarded-climb messaging on "Cancel"** — make sure the copy makes clear nothing was saved. "Save without session" is now first-class via `forced: true`, so the modal should pair it with the start-session option rather than save-on-cancel.
- **Active-session source** — until `GET /training-sessions/active` exists, the overlay derives it from the sessions list. Revisit once the endpoint lands.
