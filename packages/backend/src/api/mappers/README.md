# API Mappers

One file per entity. Mappers convert backend model types (Mongoose docs) into
the API response types defined in `shared/models/`, and are the only place that
conversion happens — handlers call them, nothing else formats responses.
Cross-resource shapes (collaborators, user summaries) have their own files.

## The two variants

Each entity exports up to two mappers, which differ in how first-level
references are rendered:

- **`toApi<Entity>`** — the full shape. Expects first-level references
  (location, sector, image, owner, collaborators…) to be populated and embeds
  them in the response.
- **`toApiDepopulated<Entity>`** — the reference shape. References are rendered
  as id strings, not embedded documents.

The two compose to "break" nested references: `toApi<Entity>` maps each of its
populated references with that entity's `toApiDepopulated*` variant, so a
response embeds direct references exactly one level deep and the recursion
stops there (e.g. a Climb response embeds its Sector, but that Sector's own
references stay ids). `toApiDepopulated*` is likewise what other entities'
mappers use when this entity appears as a reference.

Consequently: use `toApi<Entity>` for the endpoint's primary resource (and
populate accordingly), and `toApiDepopulated<Entity>` whenever the entity is
nested inside another response.

## Typing `toApiDepopulated<Entity>` with the ref helper types

`toApiDepopulated<Entity>` has two ends that both talk about "which refs", and
each end has its own aux type in `data/infrastructure/`. Don't hand-roll
`Omit<...> & { ref: string }` for new mappers — use these instead.

- **Input (the Mongoose model)** — `WithRequiredRefs<T, K>`. A DB model types
  every ref as `ObjectId | null` (a referenced doc may have been deleted). By
  the time a mapper runs, the caller has already validated the refs it relies
  on are present (e.g. via a `hasValidRefs`/`hasRequired<Entity>Refs` guard in
  the service layer), so the mapper's signature should say that instead of
  re-checking null. `WithRequiredRefs<IEntity, EntityRequiredRefs>` strips
  `null` from just the named keys — every other field, including refs that are
  optional _by design_ (e.g. an unattached image), is untouched.

- **Output (the API shape)** — `WithDepopulatedRefs<T, K>`. Start from the
  full API type (`shared/models/<entity>.ts`) and collapse the named refs down
  to id strings: `Omit<T, K> & { [P in K]: string }`. A ref whose type
  includes `null` depopulates to `string | null` — the null case survives, it
  isn't dropped. This means `K` should be _every_ ref on the entity, not just
  the required ones, or a ref will silently disappear from the return type
  instead of becoming a string.

### Naming convention

Each model file (`data/models/<entity>.ts`) exports two key-union types next
to the interface:

- `<Entity>Refs` — all refs on the entity. Feed this to `WithDepopulatedRefs`
  for the return type.
- `<Entity>RequiredRefs` — the subset that's mandatory (a strict subset of
  `<Entity>Refs`, or equal to it if the entity has no optional refs). Feed
  this to `WithRequiredRefs` for the input model type.

```ts
function toApiDepopulatedClimbHistory(
  model: WithRequiredRefs<IClimbHistory, ClimbHistoryRequiredRefs>
): WithDepopulatedRefs<ClimbHistory, ClimbHistoryRefs> {
  /* ... */
}
```

If an entity's API type needs a ref removed entirely (not depopulated to a
string) for a given call site — rather than every ref in `<Entity>Refs` — Omit
it from the API type before handing the result to `WithDepopulatedRefs`, e.g.
`WithDepopulatedRefs<Omit<Entity, 'someRef'>, EntityRequiredRefs>`.
