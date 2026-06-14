# Mobile — Unified Map (Browse)

**Date:** 2026-06-14

Part of the [multi-sport refactor](multi-sport-overview.md). Depends on [feed](multi-sport-feed.md) (shared Location).

## What to build

Replace the climbing-only Browse tab (`browse-tab.tsx`) with a **single map** showing every place the user trains, with pins typed by sport and a **type filter** to show/hide sports. The map is not a bottom tab — it's reached from Home (a "Map" card/quick-action) and/or surfaced within the Browse context; it shares the unified-shell stack ([nav-shell](multi-sport-nav-shell.md)).

`Location` is now shared across sports. A location's relevant sport(s) are derived from the sessions that reference it (a crag accrues climbing sessions; a court accrues padel matches) — so the map can color/icon each pin by sport and filter without a manual per-location sport tag. Deriving this across the per-sport collections is the same fan-out shape as the [feed](multi-sport-feed.md); if it proves expensive, denormalize a `sports: string[]` summary onto `Location` (maintained when sessions are written).

Behavior:

- Pins for all the user's locations, icon/color by sport.
- A filter chip row (`All · Climbing · Padel · …`) — only sports that actually have geolocated activity appear (gym/apnea typically have no location).
- Tapping a pin → location detail (existing `location-detail-screen.tsx`, generalized to show sessions of any sport at that location, not just climbs — e.g. via a location-filtered `useFeed`).

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| One map, not per-sport | Type-filtered single map | A unified "where I've trained" map is a stronger feature than N near-identical tabs |
| Pin sport | Derived from referencing sessions across sport collections (denormalize only if slow) | Avoids a manual per-location sport field that drifts from reality |
| Placement | Reached from Home / Browse context, not its own tab | Keeps the bottom tab set at 4; map is sport-conditional and would be a dead tab for gym/apnea users |

## Gotchas

- Map is meaningless for gym/apnea — never let the map filter imply those sports exist there. Only show sports with geolocated sessions.
- Existing climbing Browse logic (location list, sectors, climbs under a location) must remain reachable — folding Browse into a map shouldn't drop the ability to drill crag → sector → climb. The map is an *entry point* to existing location detail, not a replacement for it.
- Reuse the existing `MapPointPicker` map component/stack rather than introducing a second mapping dependency.
