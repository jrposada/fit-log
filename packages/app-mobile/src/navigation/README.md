# Navigation

Owns route definitions and the orchestration layer for each route: which
screen a route renders, its params, and its chrome (header, presentation,
tab bar entry). `features/<feature>/` is for feature-specific reusable
components — not screens; screens are routes and live here.

## Structure

```
navigation/
  root.tsx                # NavigationContainer + gate (loading/auth) only
  tabs.tsx                # the bottom Tab.Navigator
  routes/<route>.tsx      # the route's screen: composes feature components,
                          # owns the route's data/handlers, and declares its
                          # Stack.Screen options (header, presentation, params → title)
  header.tsx
  fab.tsx
  sport-picker-modal.tsx
  types.ts         # RootParamList, RootStackParamList, screen props
```
