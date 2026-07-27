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
