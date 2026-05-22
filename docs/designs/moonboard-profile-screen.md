# Design: Mobile Profile Screen

## Context

The current header avatar button opens a small modal with name/email, version, and logout. We want to expand this into a proper Profile screen. Moonboard problems appear in the existing Climbing tab automatically after the backend sync — no Moonboard UI is needed in the profile.

Depends on: none (independent of moonboard-backend)

---

## Problem

There is no profile or settings surface in the app. The current header modal is too cramped to grow.

## Goal

Replace the header modal with a navigable Profile screen showing user info and logout.

---

## Architecture

### Navigation

Replace the inline `Modal.Root` in `header.tsx` with a navigation push. Avatar button press navigates to `Profile`.

`Profile` is added as a native-stack modal screen at the root navigator level (`navigation/root.tsx`) — wrap the existing `Tab.Navigator` in a `Stack.Navigator` and add `Profile` as a `Stack.Screen` with `presentation: 'modal'`. `RootParamList` gains `Profile: undefined`.

The `Profile` route renders a new `ProfileScreen` inside `features/profile/`.

### Profile Screen Layout

Single scrollable view:
- Name and email from `useMe()` / `useAuth()`
- App version from `useVersion()`
- Logout button

### Reused Components

`Typography`, `Button`, `spacing`, `surfaces` from `library/`.

---

## Key Decision

**Native stack modal over in-place modal** — gives the profile room to grow (future settings, stats) without fighting modal sizing; back gesture is free.

---

## Critical Files

| File | Change |
|------|--------|
| `packages/app-mobile/src/types/root.ts` | Add `Profile: undefined` to `RootParamList` |
| `packages/app-mobile/src/navigation/root.tsx` | Wrap tabs in Stack; add Profile modal screen |
| `packages/app-mobile/src/navigation/header.tsx` | Replace modal toggle with `navigation.navigate('Profile')`; remove Modal.Root and menuVisible state |
| `packages/app-mobile/src/features/profile/profile-screen.tsx` | New screen (create) |

---

## Verification

1. Tapping avatar from any tab pushes Profile screen; back gesture returns to the previous tab.
2. Profile shows correct name, email, and app version.
3. Logout from Profile screen works correctly.
