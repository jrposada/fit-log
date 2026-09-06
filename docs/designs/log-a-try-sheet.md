# Log-a-Try Bottom Sheet

**Date:** 2026-09-06

## What to build

A new global bottom-sheet component matching the Stitch "Log a Try - Quick Input" mock, built on the existing `packages/app-mobile/src/library/modal/modal.tsx` (already renders as a bottom-anchored sheet with a drag handle when `fullscreen` is false — no new sheet primitive needed).

Opened from the flyover's "+" affordance ([[active-session-flyover-stepper]]) and from the Home dashboard's "Log a Climb" CTA ([[active-session-home-dashboard]]); both call the same component/hook so there's one implementation of the save flow.

Contents:
- Current boulder header: name, grade, zone/wall, "Active" badge if it's the session's `currentClimbId`.
- Chips row to switch between climbs already worked this session (`session.climbHistories`), plus an entry point to search for a new climb (reuse whatever climb-search UI `climb-log-screen.tsx` already uses, rather than rebuilding search).
- Outcome picker: single-tap Flash / Send / Try (Attempt) — new UI atom, nothing reusable exists today (`climb-detail-screen.tsx`'s current logging UI is two flat buttons, not a picker).
- Attempts stepper — same stepper UI as the flyover's inline one ([[active-session-flyover-stepper]]); share the component rather than building two.
- "Mark Project" toggle — wire to `useClimbHistoryProject` (`shared-react/api/climb-histories/use-climb-history-project.ts`), the same mutation `climb-detail-screen.tsx`'s project toggle already uses.
- Optional beta/note field.
- Save — calls `useClimbHistoriesPut` with `climb`, `location`, `sector`, `status`, `attempts`, `trainingSession: session.id`, and `tryId` if editing an existing try; on success, also sets `session.currentClimbId` to the picked climb via the mechanism from [[active-session-flyover-current-climb-field]].

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Sheet primitive | Existing `library/modal/modal.tsx` in bottom-sheet mode | Already behaves like a bottom sheet; avoids pulling in a new dependency |
| Component/hook shared between flyover "+" and dashboard CTA | Yes, single sheet + single save hook, two trigger points | Both must produce identical saved data; two implementations would drift |
| Climb switch UI | Chips of recently-worked climbs in this session, with fallback to existing climb search | Matches the mock; avoids rebuilding climb search that `climb-log-screen.tsx` already has |
| Relationship to `climb-detail-screen.tsx`'s existing "Log Send" button | Leave as-is, out of scope | That flow is currently non-functional — its `climbHistoriesPut.mutate` call is commented out and hardcoded to `status: 'send'`/`attempts: 1`. Fixing or superseding it is a separate concern from building the new global sheet; revisit once this sheet exists |
| Saving a try also sets `currentClimbId` | Yes, in the same user action | Otherwise the flyover stepper would have nothing to act on immediately after logging the first try |

## Gotchas

- `ClimbHistoriesPutRequest` needs `location` and `sector` ids, not just `climb`. When switching to a climb already in `session.climbHistories` these are already known; when picking a brand-new climb via search, confirm the search result carries its location/sector ids (check what `climb-log-screen.tsx` currently passes when navigating into logging).
- Saving a try (`useClimbHistoriesPut`) and setting `currentClimbId` (`useTrainingSessionsPut`) are two separate network calls against two different resources. If the first succeeds and the second fails, fail soft — the try is still saved; only the flyover's "current climb" pointer is stale until the next try.
- The project toggle in the sheet must reflect whichever climb is currently selected there, not the session's previous current climb, if the user switches climbs via chips before saving.
