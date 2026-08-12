# Navigation

Owns route definitions and the orchestration layer for each route: which
screen a route renders, its params, and its chrome (header, presentation,
tab bar entry). `features/<feature>/` is for feature-specific reusable
components — not screens; screens are routes and live here.

## Structure

```
navigation/
  root.tsx                       # NavigationContainer + gate (loading/auth) only
  tabs.tsx                       # the bottom Tab.Navigator
  routes/<route>/
    <route>-screen.tsx           # the route's screen: composes feature
                                 # components, owns the route's data/handlers
    <route>-options.tsx          # the route's chrome: header, presentation,
                                 # tab bar entry, params → title
    <route>.styles.ts            # optional, screen-local styles
  common/          # components shared across multiple routes
    ...
  sport-picker-modal.tsx
  types.ts         # RootParamList, RootStackParamList, screen props
```
