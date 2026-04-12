# Ticket 001: Selection + Removal + Hold Radius

## Summary

Change the climb image editor interaction paradigm from "tap to toggle" to "tap to select, then act." Add a `radius` field to holds for resizing. Add a floating action toolbar for delete and resize controls.

## Why

Currently tapping a hold removes it immediately with no way to resize, move, or inspect it. This is limiting for detailed route editing. A selection-based model enables future features (move, drag) and immediately enables resize and explicit delete.

## Scope

- Add `radius` to Hold data model across the full stack
- Implement selection state (tap hold/point to select, tap again or empty space to deselect)
- Floating action toolbar (delete, +/- resize for holds)
- Replace `onSplinePointRemoveLast` with `onSplinePointRemove(index)` to allow removing any spline point
- Render holds at their stored radius instead of a fixed constant
- Update hint text translations

## Data Model Changes

### Hold type (`packages/shared/src/models/climb/climb.ts`)

Add optional `radius` and a shared default constant:

```typescript
export const DEFAULT_HOLD_RADIUS = 0.03;

export type Hold = {
  x: number;
  y: number;
  radius?: number; // normalized 0-1 (fraction of image width), defaults to DEFAULT_HOLD_RADIUS
};
```

### Zod schemas

**`packages/shared/src/models/climb/climb-put.ts`** and **`packages/app-mobile/.../climb-detail-screen.types.ts`**:

Add `radius: z.number().min(0.01).max(0.15).optional()` to holdSchema.

### Mongoose schema (`packages/backend/src/models/climb.ts`)

Add `radius` (Number, not required) to `IHold` interface and mongoose holdSchema. Existing documents without `radius` will use the default on read -- no migration needed.

## Selection State

In `climb-image.tsx`, add:

```typescript
const [selection, setSelection] = useState<{
  type: 'hold' | 'spline';
  index: number;
} | null>(null);
```

Clear selection when:
- `editMode` changes (holds <-> spline)
- `editable` becomes false
- The selected item is removed

## Tap Interaction Model

Modify `handleTap` in `climb-image.tsx`:

**When nothing is selected:**
- Tap within hit radius of a hold/spline point -> **select** it
- Tap empty space -> **add** hold/spline point (unchanged)
- Spline mode: tap near last point still undoes

**When something is selected:**
- Tap the same item -> **deselect**
- Tap a different hold/point -> **select** that one instead
- Tap empty space -> **deselect** (does NOT add -- prevents accidental placements)

Hold hit detection should use the hold's actual radius for selection, not a fixed constant.

## Selection Visuals

In `climb-image-overlay.tsx`:
- Accept `selectedIndex` and `selectedType` props
- Selected hold: thicker stroke (3px), accent.primary stroke color, slightly larger radius (+2px)
- Selected spline point: larger radius (8 instead of 5), accent.primary stroke
- Remove the "X" marks in edit mode (no longer needed -- delete is via toolbar)
- Render hold circles using `(hold.radius ?? DEFAULT_HOLD_RADIUS) * width` instead of constant `HOLD_RADIUS`

## Floating Action Toolbar

New component: `climb-image-toolbar.tsx`

Absolutely-positioned at the bottom of the image area inside `ClimbImage`. Shows only when something is selected.

Contents:
- **Delete button** (trash icon) -- for both holds and spline points
- **Size - button** -- holds only, decreases radius by `0.005` (min `0.01`)
- **Size + button** -- holds only, increases radius by `0.005` (max `0.15`)

Semi-transparent background. Uses existing `IconButton` or `Pressable`.

## Callback Changes

**ClimbImage props:**
- Add `onHoldResize?: (index: number, radius: number) => void`
- Replace `onSplinePointRemoveLast` with `onSplinePointRemove?: (index: number) => void`

**useClimbDetail hook:**
- Add `handleHoldResize(index, radius)` -- updates the radius of a specific hold
- Replace `handleSplinePointRemoveLast` with `handleSplinePointRemove(index)`

**ClimbDetailScreen:**
- Wire new callbacks to both `ClimbImage` instances
- Update hint text

## Translation Keys

Update `packages/shared/src/localization/en.json`:
- `climbing.mark_holds_hint` -> reflect tap-to-select behavior
- `climbing.draw_spline_hint` -> similar

## Files to Modify

- `packages/shared/src/models/climb/climb.ts`
- `packages/shared/src/models/climb/climb-put.ts`
- `packages/backend/src/models/climb.ts`
- `packages/app-mobile/src/features/climbing/components/climb-detail/climb-image/climb-image.tsx`
- `packages/app-mobile/src/features/climbing/components/climb-detail/climb-image/climb-image-overlay.tsx`
- `packages/app-mobile/src/features/climbing/components/climb-detail/climb-image/climb-image-toolbar.tsx` (new)
- `packages/app-mobile/src/features/climbing/screens/climb-detail-screen/use-climb-detail.tsx`
- `packages/app-mobile/src/features/climbing/screens/climb-detail-screen/climb-detail-screen.tsx`
- `packages/app-mobile/src/features/climbing/screens/climb-detail-screen/climb-detail-screen.types.ts`
- `packages/shared/src/localization/en.json`

## Verification

1. Create a climb with holds -- verify `radius` is stored in MongoDB and returned by GET
2. Verify existing climbs without `radius` still render correctly (default radius)
3. Tap a hold -> selection ring appears; tap empty space -> deselects; tap another hold -> switches
4. Select a hold -> tap delete -> hold removed. Same for spline points
5. Select a hold -> tap + -> hold grows; tap - -> shrinks; save and reload -> radius persists
6. Switch holds<->spline while selected -> selection clears
7. Select any spline point (not just last) -> delete -> removed, curve updates
8. Adding holds/spline points by tapping empty space still works when nothing is selected
