# Active Session Dashboard on Home

**Date:** 2026-09-06

## What to build

Instead of a new screen, `home-screen.tsx` (`packages/app-mobile/src/navigation/stacks/main/routes/tabs/routes/home/home-screen.tsx`) conditionally renders the session dashboard in place of its normal idle content whenever there's an active session, matching the Stitch "Active Session - Live Logging" mock. This mirrors the pattern the flyover already uses (`ActiveTrainingSessionFlyover` branches on `activeSession` truthy/falsy) — Home does the same at a larger scale.

Read `useTrainingSessionsActive()` in `home-screen.tsx` (it doesn't today) and branch:

- **No active session (today's behavior, unchanged):** hero stat cards (total sessions, streak, total time) from `useFeedStats()`, "Recent sessions" section from `useTrainingSessions({ limit: 10 })`.
- **Active session:** replace that content with the session dashboard:
  - Header: location/gym name, session duration (reuse `use-active-training-session-timer.ts`), "End Session" action (reuse `useStopTrainingSession`).
  - Stats row: Climbs / Sends / Flashes / Rate%, derived client-side from `session.climbHistories` — no new backend aggregation. Climbs = `climbHistories.length`; Sends = count of histories with `status === 'send'`; Flashes = `status === 'flash'`; Rate = (Sends + Flashes) / total tries logged.
  - "Log a Climb" CTA — opens the Log-a-Try sheet ([[log-a-try-sheet]]).
  - Scrollable "Attempts this session" list — one row per try: climb name/grade, wall, relative time (from `tries[].date`), outcome badge, try count.

The bottom spacer for the flyover (`useTabBarOverlayHeight`) stays either way.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Conditional render inside `home-screen.tsx` vs. a new pushed screen | Conditional render on Home | Home is already the tab-bar landing screen and already reserves layout space for the flyover; a session dashboard is exactly "what Home is about" while a session is running. Avoids a new stack screen, a new nav registration, and a tab-vs-stack navigation split |
| Flyover's "open dashboard" action | Switch to the Home tab (`navigation.navigate('Home')` or equivalent tab jump), not a stack push | The dashboard now lives on the Home tab, not a dedicated route — see [[active-session-flyover-stepper]] |
| Stats/list computed client-side from `session.climbHistories` | Yes, no separate fetch | The active-session query already embeds every history and its tries |

## Gotchas

- `home-screen.tsx` currently has no active-session awareness at all (confirmed: 127 lines, no `useTrainingSessionsActive` call) — this is a genuinely new branch in that file, not a tweak to an existing conditional.
- If the user is already on the Home tab when they tap the flyover, "switch to Home tab" is a no-op navigation — make sure that doesn't produce a jarring re-render or double-toggle with the flyover's own expand/collapse tap.
- Same climb name/grade/wall lookup gap noted in [[active-session-flyover-stepper]] applies to the attempts list here too — resolve once, share it, don't duplicate.
- Losing "Recent sessions" while a session is active is intentional (focus on the current session), but confirm there's no other flow that expects `home-screen.tsx` to always show recent sessions (e.g. deep links landing on Home mid-session).
