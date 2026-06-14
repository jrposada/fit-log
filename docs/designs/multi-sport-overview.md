# Multi-Sport Architecture — Overview

**Date:** 2026-06-14

## What to build

Today the mobile app is organized **per sport**: a nested Climbing stack with home-grown sub-tabs (Logbook/Browse/Stats built on local `useState`, not real routes) and a bare Training screen. This doesn't scale — every new sport (gym, apnea, padel, later diving) would mean cloning a whole nested layout, and the sub-tabs already diverge in quality between Climbing and Training.

This effort restructures the app around **two orthogonal axes** instead of one per-sport axis:

| Axis | What it is | Where it lives |
|------|-----------|----------------|
| **Navigation surfaces** | Sport-*agnostic*, always present: Home, History, Stats, Profile | Flat bottom tabs + a central FAB |
| **Activity flows** | Sport-*specific*: log a climb, run an apnea table, record a padel match | Behind the FAB and inside session detail |

Sport stops being a top-level *layout* and becomes a **filter** (segmented control on History/Stats). Adding a sport then means "register a new sport package — its entity, its logging flow, its feed adapter," not "build a new layout."

### The data-model decision

Each sport keeps **its own entity and collection** that fully models that sport. `ClimbingSession` already exists (renamed from the old training session); future sports get `GymSession`, `ApneaSession`, `PadelMatch`, etc. There is **no unified `Activity` collection** — a generic session wrapper with a sport-discriminated payload added complexity without earning it, since each entity isn't a generic payload, it's the *header/section* around that sport's real data (climb histories, exercise sets, breath-hold rounds).

Cross-sport surfaces (the History feed, the Home dashboard, "All" Stats) are powered by a thin **read layer that fans out across the per-sport collections and merges by date** — behind a contract that **ElasticSearch will fulfill later** (planned offload) without any mobile changes. The fan-out is the interim engine; the contract is permanent.

Scope of this design set: the framework + the **climbing migration** are designed in full. Gym, apnea, and padel are captured as entity sketches against a documented "add a sport" contract — fleshed out later.

## Target architecture

```
Bottom tabs (flat, fixed):   Home · History · Stats · Profile      + central FAB

Home      → cross-sport dashboard (recent activity + per-sport summary cards)
History   → merged feed of sessions, segmented filter: All · Climbing · Gym · Apnea · Padel
Stats     → cross-sport summary when "All"; sport-specific panels when filtered
FAB       → sport picker → sport-specific logging flow (stack/modal)
Map       → single unified map, pins from Locations, type-filtered (reached from Home/Browse)

Backend:  one collection PER SPORT (ClimbingSession exists; GymSession/… later), each
          fully modelling its sport. A read layer fans out + merges across them for the
          cross-sport feed and stats — same contract ElasticSearch fills later.
          ClimbHistory stays as climbing-specific detail.
```

## Work packages

Implement roughly in this order; dependencies noted.

| # | Package | Depends on | Summary |
|---|---------|-----------|---------|
| 1 | [feed](multi-sport-feed.md) | — | Backend: per-sport session contract (shared base fields + denormalized `summary`); cross-sport fan-out **feed** endpoint with merged cursor pagination; ES-ready |
| 2 | [stats-aggregation](multi-sport-stats-aggregation.md) | 1 | Backend: cross-sport stats via fan-out; keep climbing deep-stats as the Climbing panel |
| 3 | [nav-shell](multi-sport-nav-shell.md) | 1 (feed contract) | Mobile: flat tabs + FAB + sport filter; remove nested Climbing sub-tabs; Home dashboard |
| 4 | [unified-map](multi-sport-unified-map.md) | 1 | Mobile: single type-filtered map replacing per-sport Browse |
| 5 | [climbing-port](multi-sport-climbing-port.md) | 1, 3 | Mobile: move existing climbing Logbook/Browse/Stats into the new shell; FAB → log-climb flow; ClimbingSession becomes the reference sport package |
| 6 | [new-sports](multi-sport-new-sports.md) | 1, 3 | The "add a sport" contract + gym / apnea / padel entity stubs |

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Data model | **One entity/collection per sport**, no unified `Activity` | Each session is the sport's own header/section over its real data, not a generic payload; a discriminated wrapper added complexity without value |
| Cross-sport reads | Thin **fan-out + merge** read layer over the per-sport collections, behind a stable contract | Ships the unified UX now; ElasticSearch (planned) swaps in behind the same contract with no mobile changes |
| Aggregation engine | Mongo fan-out now → **ElasticSearch** later | Cross-sport aggregation/search is an ES-shaped problem; don't distort the write model to serve reads |
| Sport selection UX | In-context segmented filter, **not** a global header mode | Avoids hidden-mode errors; sports don't map uniformly onto tabs (gym/apnea have no map) |
| Browse | One unified map with type-filtered pins | Three near-identical per-sport map tabs would be redundant; one map is a stronger feature |
| Migration | Greenfield — no reversible backfill; `ClimbingSession` already in place | User confirmed negligible existing data |
| Sport breadth now | Climbing fully ported; gym/apnea/padel stubbed as entity sketches | Locks the framework before investing in flows for unbuilt sports |
