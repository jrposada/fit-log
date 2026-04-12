# Ticket 003: Spline Point Insertion Between Existing Points

## Summary

Allow users to tap on the spline curve (between two existing control points) to insert a new point at that position, splitting the segment.

## Why

Currently spline points can only be appended at the end. If the user realizes the route needs a detour mid-path, they must delete points back to that spot and re-draw. Insertion allows precise mid-path editing.

## Prerequisites

- Ticket 001 (selection system)

## Scope

- Hit-test taps against the rendered Catmull-Rom curve segments
- Insert a new spline point at the tapped position between the two surrounding control points
- Export a `closestPointOnCurve` helper from `catmull-rom.ts`

## Implementation

### Curve Hit-Testing

When in spline mode and nothing is selected, after checking existing control points for selection, check if the tap is near the curve itself.

For each segment (consecutive pair of spline points):
1. Sample ~20 points along the Catmull-Rom segment
2. Find the sample closest to the tap point
3. If the closest sample is within the hit radius threshold, insert a new point

The inserted point's position is the tap coordinates (not the closest curve point -- the user tapped where they want the point).

The `afterIndex` is the index of the segment's start point. The new point is inserted at `afterIndex + 1`.

### catmull-rom.ts Changes

Export a helper:

```typescript
export function closestSegmentToPoint(
  points: Point[],
  target: Point,
  samplesPerSegment?: number
): { segmentIndex: number; distance: number } | null
```

This reuses the same Catmull-Rom math already in `catmullRomToSvgPath` but evaluates parametric positions instead of generating SVG strings.

### ClimbImage Tap Logic Update

In `handleTap`, when in spline mode and no existing point was hit:

```
1. Check existing spline points for selection (existing logic)
2. If no point hit, check curve segments via closestSegmentToPoint
3. If curve hit, call onSplinePointInsert(afterIndex, tapPoint)
4. If nothing hit, add point at end (existing logic)
```

## Callback Changes

**ClimbImage props:**
- Add `onSplinePointInsert?: (afterIndex: number, point: SplinePoint) => void`

**useClimbDetail hook:**
- Add `handleSplinePointInsert(afterIndex, point)` -- splices point into the spline array at `afterIndex + 1`

## Files to Modify

- `packages/app-mobile/src/features/climbing/components/climb-detail/climb-image/catmull-rom.ts` -- closestSegmentToPoint
- `packages/app-mobile/src/features/climbing/components/climb-detail/climb-image/climb-image.tsx` -- curve hit-test in handleTap
- `packages/app-mobile/src/features/climbing/screens/climb-detail-screen/use-climb-detail.tsx` -- insert handler
- `packages/app-mobile/src/features/climbing/screens/climb-detail-screen/climb-detail-screen.tsx` -- wire callback

## Verification

1. Draw a spline with 3+ points -> tap on the curve between point 1 and 2 -> new point appears at tap location, curve reshapes
2. The new point is selectable, movable (if Ticket 002 is done), and deletable
3. Tap on empty space (not near curve) still appends a point at the end
4. Insertion works correctly when the curve has only 2 points
5. Hit detection works when zoomed in
