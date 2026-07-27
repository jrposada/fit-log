# Mobile — Navigation Shell

**Date:** 2026-06-14

Part of the [multi-sport refactor](multi-sport-overview.md). Depends on the [feed](multi-sport-feed.md) API contract.

## What to build

Replace the per-sport navigation with a flat, sport-agnostic shell. Concretely, in `packages/app-mobile/src`:

- **Bottom tabs become fixed and sport-agnostic:** `Home · History · Stats · Profile`, with a **central FAB** for logging. Today's tabs are `Home · Climbing · Training` (`src/navigation/root.tsx`); Climbing's nested stack and its local-`useState` sub-tabs (`climbing-screen.tsx`) go away as *navigation structure* (the screens themselves are re-homed in [climbing-port](multi-sport-climbing-port.md)).
- **History** = a single screen listing the cross-sport **feed** (via `useFeed`), newest first, rendered from each row's denormalized `summary`. The feed merges every sport's sessions server-side ([feed](multi-sport-feed.md)); the list itself is sport-agnostic. A **segmented control** at the top filters by sport: `All · Climbing · Gym` (a `sport` filter on the feed query, extended as more sports are added). Tapping a row opens the sport's session-detail screen.
- **Stats** = one screen driven by the same segmented filter: cross-sport panels when "All", sport-specific panels when a sport is selected (data from [stats-aggregation](multi-sport-stats-aggregation.md)).
- **FAB** opens a **sport picker** → routes into that sport's logging flow (a stack/modal owned by the sport package). This is the *only* entry point that is sport-specific in the shell.
- **Home** = the cross-sport dashboard: recent activity across sports + per-sport summary cards (the existing `home-screen.tsx` stat cards, currently static, generalize to read `useFeedStats` + a short `useFeed` slice). Ship a sensible **default** layout; customization is a later iteration, explicitly out of scope here.

Sport-specific detail screens and logging modals are **registered by each sport package** into a shared stack, not hard-coded into the shell. The shell exposes: the four tabs, the FAB + sport picker, and a registry/convention for sports to contribute their `log` flow and `detail` screen.

### Navigation structure

```
Root Stack
 ├── Tabs (Home · History · Stats · Profile)  + FAB overlay
 ├── Profile (modal, unchanged)
 └── Sport screens (contributed per sport):
       climbing/log, climbing/detail, gym/log, gym/detail, ...
```

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Tab set | Fixed 4 tabs + FAB | Sport-agnostic; never grows when a sport is added |
| Sport selection | Segmented control on History/Stats | Discoverable; avoids hidden-mode errors; tolerates sports that lack a map |
| Sub-tabs | Removed | Climbing's Logbook/Browse/Stats are subsumed by History/Map/Stats; the local-state `<Tabs>` mechanism is retired |
| Sport flows | Registered by sport packages into a shared stack | Adding a sport touches its own package + the picker list, not the shell |
| History unit | Feed (session) rows, uniform across sports | One list renderer over `SessionSummary`; per-sport richness is in the detail screen |
| Dashboard customization | Out of scope; ship a fixed default | Avoids gold-plating before the model is proven |

## Gotchas

- **The segmented filter is shared state between History and Stats.** Decide whether the selected sport persists across tabs and app launches (recommended: persist; a user who climbs mostly wants climbing pre-selected). Don't store it as isolated local state in two places.
- History lists **sessions**, not per-route entries — a behavioral shift for climbing (today's Logbook lists climb histories). Covered in [climbing-port](multi-sport-climbing-port.md); flag in UX review.
- The FAB overlaps tab content; ensure list screens add bottom padding so the last row isn't hidden behind it.
- Don't let the shell `import` sport screens directly — that recreates the coupling we're removing. Use the registry/contribution convention so sports remain additive.
