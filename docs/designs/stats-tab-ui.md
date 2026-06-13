# Climbing Stats — Tab UI & data hook

**Date:** 2026-06-13

> Work package 2 of 2. Depends on the contract and endpoint from [`stats-tab-backend.md`](./stats-tab-backend.md). The response shape there is the source of truth for everything this package renders.

## What to build

Replace the Stats tab placeholder with a real, visual analytics screen, fed by a new React Query hook that calls `GET /climb-histories/stats`.

Today the tab is a stub in `packages/app-mobile/src/features/climbing/screens/climbing-screen.tsx`:

```
{ id: 'stats', label: t('climbing.stats'),
  content: <EmptyState message={t('climbing.stats_content')} /> }
```

It becomes `content: <StatsTab />`, mirroring how `LogbookTab` and `BrowseTab` are wired.

### Where it fits

| Layer | Location | What changes |
|-------|----------|--------------|
| Hook | `packages/shared-react/src/api/climb-histories/use-climb-histories-stats.ts` | New `useClimbHistoriesStats(params)` hook. |
| Tab component | `packages/app-mobile/src/features/climbing/components/stats-tab/stats-tab.tsx` | New component (sibling of `browse-tab/`, `logbook-tab/`). |
| Screen wiring | `climbing-screen.tsx` | Swap the `EmptyState` for `<StatsTab />`. |
| Dependency | `packages/app-mobile/package.json` | Add `react-native-gifted-charts` (builds on the already-installed `react-native-svg`). |
| i18n | translation files | Replace `climbing.stats_content` usage with the new labels/titles. |

### The hook

Follows the existing `useClimbHistories` pattern (`packages/shared-react/src/api/climb-histories/use-climb-histories.ts`) but with **`useQuery`, not `useInfiniteQuery`** — this is a single bounded summary, not a paged list. Same auth plumbing (`useAuth`, `getEnvVariable('PUBLIC_API_BASE_URL')`, the shared `query()` wrapper, bearer token). Query key `['climb-histories-stats', params]`. Accepts the optional filter params from the contract (`locationId`, `sectorId`, `startDate`, `endDate`, `granularity`).

### The tab — sections (top to bottom)

| Section | Component | Maps to contract |
|---------|-----------|------------------|
| Summary cards | Reuse `IconCard variant="stat"` (as on Home) in a grid | `summary` — sends, flashes, projects, total attempts, hardest grade (PB) |
| Grade distribution | `gifted-charts` **stacked BarChart**, one bar per grade | `gradeDistribution` — sends vs attempts stacked |
| Progression | `gifted-charts` **LineChart**, Y = grade ladder, X = period | `progression` — hardest grade sent per period, trending up |
| Activity over time | `gifted-charts` **LineChart** (area) over periods | `activity` — climbs/sends per period |
| Session analytics | A small stat row (reuse `IconCard`) | `sessions` — total, avg climbs/session, avg duration |

Loading → `LoadingState` (`packages/app-mobile/src/library/loading-state`). Error or zero-data → `EmptyState` (`.../empty-state`), reusing the existing components rather than new ones.

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Charting library | `react-native-gifted-charts` | User wants a "fancy/visual" result; it's the most popular RN chart lib, animates out of the box, and builds on the already-present `react-native-svg` (no Skia/native-build overhead). |
| Hook fetch primitive | `useQuery` (not infinite) | Endpoint returns one bounded summary; pagination is meaningless here. |
| Stat cards | Reuse `IconCard variant="stat"` | Already used by the Home dashboard; keeps the summary visually consistent across the app. |
| Loading / empty | Reuse `LoadingState` / `EmptyState` | Match the rest of the climbing feature; no bespoke states. |
| Filter UI | **Out of scope for v1** — call the hook with no filters (all-time, all locations) | Ship the visuals first; the endpoint already supports scoping, so a location/date filter can be layered on later without backend change. |

## Gotchas

- **Theme, not raw values.** Chart colors must come from `palette` and spacing from `spacing` (`packages/app-mobile/src/library/theme`), the same tokens the stat cards use — don't hardcode hex/sizes, so the charts read as on-brand.
- **`Typography` `style` prop is layout-only.** Per project convention, never pass `fontSize`/`lineHeight` through `Typography`'s `style` prop — use its `size` variants. Applies to every label/heading in the tab.
- **Grades are sparse and ordered.** `gradeDistribution` may skip grades the user hasn't climbed. Order bars by `GRADE_OPTIONS` index (not response order, not alphabetical — `V10` must sit after `V9`), and decide whether to show only grades with data or the full ladder. Recommend: only grades present, to keep bars readable.
- **Progression Y-axis is a grade ladder, not a number.** Map each period's `hardestGrade` to its `GRADE_OPTIONS` index for the line's `value`, and label the Y-axis ticks back with the grade string (`V0`, `V1`…) — don't plot a raw index with numeric ticks. Periods with `hardestGrade: null` (no send that period) should break the line / be skipped, not plotted as 0 (which would read as "sent V0").
- **Optional always-rising variant.** If the per-period line looks discouraging (dips in quiet months), the tab can derive a cumulative running max from the same `progression` array client-side — no backend change. Out of scope for v1 unless the dips test poorly.
- **`hardestGrade` can be `null`** (new user, or only custom grades) — render the PB card with a placeholder, not a crash.
- **gifted-charts data format** differs per chart type (`stackData` for stacked bars, `{value,label}` arrays for lines). Map the contract arrays into each chart's expected shape inside the tab; keep the contract clean.
- **Don't block the tab on Home.** Home dashboard reuse is noted in the backend design but is a separate effort — this package only renders the Stats tab.
