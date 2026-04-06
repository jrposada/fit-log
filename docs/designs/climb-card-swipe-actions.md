# Design: ClimbCard Gmail-Style Swipe Actions

## Problem

The current ClimbCard swipe UX lacks visual feedback. When the user swipes, small 72px action buttons slide in but there is no indication of **what will happen** — especially when crossing the long-swipe auto-trigger threshold (144px). The result feels disconnected: the user cannot tell whether releasing will trigger the action or just reveal a button.

## Goal

Adopt Gmail's swipe pattern: a full-width colored background with an icon is revealed behind the card as it slides. When the drag crosses the auto-trigger threshold, a visual state change signals "release to execute." This creates a clear distinction between *browsing the action* and *committing to it*.

## Reference: Gmail Behavior

1. Swipe begins — colored background fills the entire space behind the item.
2. An icon sits anchored near the leading edge of the revealed area.
3. The icon and background remain static while the card slides over them.
4. When the user drags past the trigger point, the icon subtly scales up / color intensifies — signaling the action will fire on release.
5. Releasing past threshold auto-triggers the action; releasing before threshold snaps the card back.

---

## Design Specification

### Swipe Directions & Actions

| Direction | Background Color | Label | Condition |
|-----------|-----------------|-------|-----------|
| Swipe left (reveals right side) | `semantic.success` (green `#2D6A4F`) | "Log" | `!isCompleted` |
| Swipe right (reveals left side) | `accent.primary` (blue `#2D6A4F`) | "Project" / "Unproject" | `!isCompleted` |

### Phase 1 — Swipe in Progress (drag < LONG_SWIPE_THRESHOLD)

```
┌──────────────────────────────────────────────────┐
│ ██████████████████████████████                    │  ← Card sliding left
│ ██████████████████████████████    ✓  Log          │  ← Green background revealed
│ ██████████████████████████████                    │     Icon + label anchored right
└──────────────────────────────────────────────────┘
```

- The background `View` fills 100% of the swipeable container, sits behind the card.
- Background color matches the action's semantic color.
- Icon + label are **anchored** to the exposed edge (not following the drag):
  - Left swipe → icon + label right-aligned with `paddingRight` from edge.
  - Right swipe → icon + label left-aligned with `paddingLeft` from edge.
- Icon + label are vertically centered.
- Text uses `ink.inverse` (#FFFFFF), `typography.callout`, `fontWeight: '600'`.

### Phase 2 — Threshold Crossed (drag >= LONG_SWIPE_THRESHOLD)

```
┌──────────────────────────────────────────────────┐
│ █████████████████████████                         │  ← Card further left
│ █████████████████████████         ✓✓ Log          │  ← Icon scales up 1.2x
│ █████████████████████████                         │     Background darkens slightly
└──────────────────────────────────────────────────┘
```

- **Icon scale**: animates from `1.0` to `1.2` with `withSpring({ damping: 12 })`.
- **Background opacity**: shifts from `1.0` to a slightly darker variant. Use the `accent.emphasis` / a 15% darker tint of `semantic.success`.
- **Haptic feedback** (optional): trigger `Haptics.impactAsync(ImpactFeedbackStyle.Light)` once when crossing the threshold. Track with a `hasTriggeredHaptic` shared value to avoid repeated triggers.

If the user drags back below threshold, the icon scales back to `1.0` and the background returns to its base color — the threshold crossing is fully reversible.

### Phase 3a — Release Past Threshold

- Card slides fully off-screen with `withTiming(duration: 200)`.
- Action executes (existing `handleLog` / `handleToggleProject` logic).
- After mutation, the card can re-render in its new state.

### Phase 3b — Release Before Threshold

- Card snaps back to origin (existing `ReanimatedSwipeable` spring behavior).
- No action fires.

---

## Animation Details

### Shared Values

| Value | Purpose |
|-------|---------|
| `lastDrag` (existing) | Track current drag distance for threshold checks |
| `thresholdCrossed` | `useDerivedValue(() => Math.abs(lastDrag.value) >= LONG_SWIPE_THRESHOLD)` |

### Animated Styles

**Icon scale:**
```
useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(thresholdCrossed.value ? 1.2 : 1.0, { damping: 12 }) }]
}))
```

**Background color:** Use `interpolateColor` on `Math.abs(drag.value)` between `[0, LONG_SWIPE_THRESHOLD]` mapping from base color to darker variant.

---

## Peek Animation (First-Time Hint)

Existing behavior is preserved: on first use, the card auto-opens to reveal the right action for 800ms. With the new design, this will now show the full green background with "Log" label — much more informative than the old small button.

---

## Layout Structure

```
<View style={styles.container}>
  <ReanimatedSwipeable
    renderRightActions={renderRightBackground}   // Full green background
    renderLeftActions={renderLeftBackground}      // Full blue background
    ...
  >
    <Pressable style={styles.card}>
      {/* Card content unchanged */}
    </Pressable>
  </ReanimatedSwipeable>
</View>
```

Each background renderer returns:

```
<Animated.View style={[styles.swipeBackground, backgroundAnimatedStyle]}>
  <Animated.View style={[styles.swipeContent, iconAnimatedStyle]}>
    <Text style={styles.swipeIcon}>{icon}</Text>
    <Text style={styles.swipeLabel}>{label}</Text>
  </Animated.View>
</Animated.View>
```

---

## Style Changes

### New Styles (replace old action button styles)

```
swipeBackgroundRight: {
  flex: 1,
  backgroundColor: semantic.success,
  borderRadius: radii.card,
  justifyContent: 'center',
  alignItems: 'flex-end',
  paddingRight: spacing.lg,
}

swipeBackgroundLeft: {
  flex: 1,
  backgroundColor: accent.primary,
  borderRadius: radii.card,
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingLeft: spacing.lg,
}

swipeContent: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
}

swipeLabel: {
  ...typography.callout,
  fontWeight: '600',
  color: ink.inverse,
}

swipeIcon: {
  fontSize: 20,
  color: ink.inverse,
}
```

### Removed Styles

- `rightActions`, `actionButton`, `leftActions`, `projectActionButton` — replaced by full-background styles.
- `ACTION_BUTTON_WIDTH` constant can be removed (keep `ACTION_WIDTH` for threshold math).

---

## Files to Modify

| File | Changes |
|------|---------|
| `packages/app-mobile/src/features/climbing/components/common/climb-card.tsx` | Replace `RightAction`/`LeftAction` with full-background components; add threshold-crossing animation; add optional haptic trigger |
| `packages/app-mobile/src/features/climbing/components/common/climb-card.styles.ts` | Replace action button styles with full-background styles |

## Existing Code to Reuse

- `useAnimatedStyle` + `SharedValue<number>` drag tracking — already in `climb-card.tsx`
- `useSharedValue`, `useDerivedValue` — from `react-native-reanimated`
- `withSpring` — used in `interactive-image.tsx` for scale animations
- Theme tokens: `semantic.success`, `accent.primary`, `accent.emphasis`, `ink.inverse`, `radii.card`, `spacing.lg` — from `library/theme/tokens.ts`
- `interpolateColor` — from `react-native-reanimated`

## Verification

1. Swipe left on a non-completed climb -> full green background reveals with "Log" label anchored right
2. Swipe right on a non-completed climb -> full blue background reveals with "Project"/"Unproject" label anchored left
3. Cross the long-swipe threshold -> icon scales up (spring), background darkens
4. Drag back below threshold -> icon scales back down, background lightens (fully reversible)
5. Release past threshold -> action auto-triggers, card slides away
6. Release before threshold -> card snaps back, no action fires
7. Peek animation still works and now shows full colored background
8. Completed climbs show no swipe backgrounds
9. Loading state disables swipe interactions
10. Long-press action menu still works
