# Active Session Flyover: inline stepper + global quick-log entry

**Date:** 2026-09-06

## What to build

Redesign `ActiveTrainingSessionFlyover` and its children (`active-training-session-flyover.tsx`, `-content.tsx`, `-header.tsx`, `-details.tsx` in `packages/app-mobile/src/features/training-sessions/active-training-session/`) so the flyover:

1. Keeps its collapsed/expanded card behavior, but the expanded card also offers a way to jump to the session dashboard on the Home tab ([[active-session-home-dashboard]]) — see Decisions for how that's separated from expand/collapse.
2. Gains an inline attempts stepper (`-`, count, `+`) for the session's current climb (`session.currentClimbId`, from [[active-session-flyover-current-climb-field]]), visible whenever a current climb with at least one try exists — this is the highest-frequency interaction and must not require navigation.
3. Gains a persistent "+" affordance that opens the Log-a-Try sheet ([[log-a-try-sheet]]) as a global modal, reachable from any screen, for picking/switching climbs and recording outcome.

Data needed on the flyover beyond what `useTrainingSessionsActive` already returns: none — `session.climbHistories` (already included) has the current climb's `tries` array; resolve the current try as the last entry of `climbHistories.find(ch => ch.climb === session.currentClimbId)?.tries`.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Tap target for "open dashboard" vs "expand/collapse" | Collapsed card tap → expand (unchanged); an explicit affordance inside the expanded card → switch to the Home tab, where the dashboard now lives | Preserves today's glanceable expand behavior; avoids the whole card becoming a navigation trap that can no longer also expand |
| Stepper mutation path | Reuse `useClimbHistoriesPut` (`shared-react/api/climb-histories/use-climb-histories-put.ts`), passing the current climb's existing `tryId` and incremented/decremented `attempts` | Same endpoint the Log-a-Try sheet uses; no new mutation needed |
| Stepper visibility when there's no current climb, or current climb has no tries yet | Hide the stepper, show only the "+" (Log-a-Try) affordance | Nothing to increment yet; forces the first try through the sheet where outcome/climb selection happens |
| "+" affordance placement | On the flyover itself (both collapsed and expanded), not only inside the Home dashboard | This is the "reachable from anywhere" requirement — the flyover is already globally mounted in `bottom-tab-bar.tsx` |

## Gotchas

- Decrementing below the try's actual logged floor (e.g., stepping down attempts on a `send`/`flash` try) isn't a real undo mechanism. Clamp at 1, and the stepper should only ever change `attempts`, never `status`.
- `ActiveTrainingSessionDetails` currently shows a bare `climbsCount`; folding the stepper in changes this component's contract — it needs the resolved "current climb" (name/grade for display) alongside the count. **Open question:** `session.climbHistories[].climb` is a string id only (no denormalized name/grade) — confirm whether a climb lookup hook is needed to resolve display text, and if so, resolve it once and share it with [[active-session-home-dashboard]] rather than duplicating the lookup.
- `use-active-training-session-timer.ts` and `use-stop-training-session.ts` are unaffected — leave them as-is.
- Tapping "switch to Home tab" while already on Home is a no-op navigation — see [[active-session-home-dashboard]] Gotchas for the double-toggle risk with the flyover's own expand/collapse tap.
