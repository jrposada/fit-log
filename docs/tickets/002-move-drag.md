# Ticket 002: Move / Drag for Holds and Spline Points

## Summary

Allow users to drag selected holds and spline points to new positions using single-finger pan gestures.

## Why

After Ticket 001 introduces selection, the natural next step is allowing repositioning. Currently, to move a hold the user must delete it and re-add it, which is tedious and imprecise.

## Prerequisites

- Ticket 001 (selection system must exist)

## Scope

- Add single-finger drag support to `InteractiveImage` (conditional, prop-controlled)
- In `ClimbImage`, enable drag when a hold/spline point is selected
- Show drag preview during drag, commit position on release
- Add `handleHoldMove` and `handleSplinePointMove` handlers

## Gesture Architecture

### InteractiveImage Changes

Add new props:

```typescript
dragEnabled?: boolean;
onDragStart?: (point: { x: number; y: number }) => void;
onDragMove?: (point: { x: number; y: number }) => void;
onDragEnd?: (point: { x: number; y: number }) => void;
```

Add a single-finger `Pan` gesture:

```typescript
const singleFingerPan = Gesture.Pan()
  .minPointers(1)
  .maxPointers(1)
  .minDistance(10) // prevents conflict with tap
  .enabled(!!dragEnabled)
  .onStart(handleDragStart)
  .onUpdate(handleDragUpdate)
  .onEnd(handleDragEnd);
```

Add to the composed gesture:

```typescript
const composedGesture = Gesture.Simultaneous(
  tapGestures,
  Gesture.Simultaneous(pinchGesture, twoFingerPanGesture),
  singleFingerPan
);
```

No conflict with existing gestures:
- Two-finger pan requires `minPointers(2)`, single-finger pan requires `maxPointers(1)` -- mutually exclusive
- Tap fires on finger-up with no movement; pan requires 10px movement -- naturally exclusive
- Pinch requires 2 fingers -- no conflict

### Coordinate Conversion

Extract existing inverse-transform logic from `handleTap` into a shared `screenToNormalized` helper:

```typescript
function screenToNormalized(
  screenX: number, screenY: number,
  containerW: number, containerH: number,
  naturalW: number, naturalH: number,
  scale: number, translateX: number, translateY: number
): { x: number; y: number } | null
```

During drag, clamp coordinates to 0-1 instead of returning null (don't lose the drag when finger briefly leaves image bounds).

### ClimbImage Changes

- Set `dragEnabled={selection !== null}`
- `onDragStart`: check if start position is within hit radius of the selected item. If not, ignore the drag.
- `onDragMove`: update a local `dragPreview` ref/state with the current position. The overlay renders the dragged item at the preview position. Use a ref to avoid re-renders on every frame -- only the SVG overlay needs to update.
- `onDragEnd`: commit the final position via `onHoldMove(index, position)` or `onSplinePointMove(index, position)`. Clear drag preview.

### Performance

- During drag, avoid calling `setValue` on react-hook-form every frame (triggers validation + re-render)
- Use a local `useRef` for preview position, force overlay update via a lightweight state toggle or `useAnimatedStyle`
- Commit to form only on `onDragEnd`

## Callback Changes

**ClimbImage props:**
- Add `onHoldMove?: (index: number, position: { x: number; y: number }) => void`
- Add `onSplinePointMove?: (index: number, position: { x: number; y: number }) => void`

**useClimbDetail hook:**
- Add `handleHoldMove(index, { x, y })` -- replaces hold at index with new coordinates, preserving radius
- Add `handleSplinePointMove(index, { x, y })` -- replaces spline point at index

## Files to Modify

- `packages/app-mobile/src/library/interactive-image/interactive-image.tsx` -- drag gesture + screenToNormalized extraction
- `packages/app-mobile/src/features/climbing/components/climb-detail/climb-image/climb-image.tsx` -- wire drag, preview state
- `packages/app-mobile/src/features/climbing/components/climb-detail/climb-image/climb-image-overlay.tsx` -- render at preview position during drag
- `packages/app-mobile/src/features/climbing/screens/climb-detail-screen/use-climb-detail.tsx` -- move handlers
- `packages/app-mobile/src/features/climbing/screens/climb-detail-screen/climb-detail-screen.tsx` -- wire new callbacks

## Verification

1. Select a hold -> drag it -> releases at new position -> hold persists at new location after save
2. Select a spline point -> drag -> curve updates in real-time during drag -> commits on release
3. Drag while zoomed in -> coordinates are correct (inverse transform works)
4. Quick tap (no movement) still fires tap/select, not drag
5. Two-finger pan still scrolls the zoomed image (no conflict)
6. Drag near image edge -> position clamps to 0-1 (doesn't go out of bounds)
