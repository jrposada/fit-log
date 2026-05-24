# Design: Training Session — Overlay & UI

## Context

With the backend ([`training-session-backend`](training-session-backend.md)) and the shared types/hooks ([`training-session-shared-and-hooks`](training-session-shared-and-hooks.md)) in place, this package delivers the user-facing surface: a persistent overlay visible on every screen plus the dialog flows triggered by the new session-related error codes during climb logging.

Depends on: [`training-session-shared-and-hooks`](training-session-shared-and-hooks.md).

---

## Problem

- There is no global UI signalling whether a session is active.
- Climb logging currently has no way to ask the user "start a new session?" or "resume the stale session?" — there's no overlay/dialog wiring for it.
- No screens exist to browse past sessions.

## Goal

- A persistent overlay mounted in the root layout that reflects active-session state and lets the user start/end sessions.
- Modal flows for `NO_ACTIVE_SESSION` and `STALE_SESSION` triggered during climb creation.
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

The overlay owns a small context/controller that any screen can call to open the session prompts. The climb-logging screen catches `SessionPromptError` from the climb hook and delegates to this controller:

1. **`NO_ACTIVE_SESSION`** — modal:
   - Title: "Start a new training session?"
   - Buttons: **Start & save climb** (retries climb create with `sessionAction: "start"`), **Cancel** (climb is discarded — call this out explicitly).
2. **`STALE_SESSION`** — modal showing the stale session's last-activity timestamp and climb count:
   - Buttons: **Resume session** (`sessionAction: "resume"`), **Start new session** (`sessionAction: "new"`), **Cancel**.
3. **Manual end** from the overlay popover — confirmation modal, then `POST /training-sessions/:id/end` via `useEndSession`.

**Why a shared controller** instead of inline dialogs in the climb screen: the same prompts will be reusable as we add more session-aware actions later (workouts, etc.).

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
- Modified: the existing climb-create screen — catch `SessionPromptError`, delegate to the controller, retry with the chosen `sessionAction`.

---

## Verification

End-to-end manual flow (run after all three packages land):

1. **Cold path** — log a climb with no active session → "Start a new training session?" modal → confirming saves the climb and creates the session → overlay flips to the active state.
2. **Hot path** — log a second climb → no prompt, climb auto-attaches, overlay count increments.
3. **Stale path** — stub `SESSION_STALE_MS` or wait > 4h → log a climb → resume/new modal appears → both branches produce the expected sessions in `/training-sessions`.
4. **Manual end** — overlay popover → End session → overlay returns to "Start session" state; detail page shows `endedAt`.
5. **Cross-screen overlay** — confirm the overlay is visible on every route, including the new session detail screen.

## Open Questions / Lowest Confidence

- **Overlay vs. integrating into AppBar** — sibling chosen for clean separation; visual tightness may push us to embed it inside AppBar later.
- **Discarded-climb messaging on "Cancel"** in the `NO_ACTIVE_SESSION` modal — make sure the copy makes it clear nothing was saved. Could also offer "Save anyway without a session" later, but explicitly out of scope for v1.
