# Data Models

One file per entity, each exporting a Mongoose schema, model, and an `I<Entity>`
document interface. Files prefixed with `_` (`_collaborator.ts`) aren't
entities themselves — they're fragments (marker interfaces + field
definitions) that multiple entities mix into their own schema, e.g.
`WithOwnership`/`ownershipFields` for owner + collaborators.

## The Ref pattern

A reference field (`location`, `sector`, `climbHistories`, …) has two shapes
depending on whether Mongoose has populated it:

- **Depopulated** (as stored / as read by default): `Types.ObjectId`, or
  `Types.ObjectId[]` for an array ref. A scalar ref that's optional or whose
  target may have been deleted is `Types.ObjectId | null`.
- **Populated**: the referenced document itself — `IOtherEntity`, or
  `IOtherEntity[]` for an array ref.

Hand-rolling both shapes per entity (and keeping them in sync) is error-prone,
so every entity that has refs declares them once, as populated types, and
derives the depopulated document interface from that.

### Declaring refs on an entity

```ts
export type ClimbPopulatedRefs = {
  image: IClimb | null;
  location: ILocation | null;
  sector: ISector | null;
  model3d: IModel3d | null;
};

export type ClimbRequiredRefs = Exclude<
  keyof ClimbPopulatedRefs,
  'image' | 'model3d'
>;

export interface IClimb
  extends
    WithTimestamps<Document<Types.ObjectId>>,
    WithOwnership,
    WithRefs<ClimbPopulatedRefs> {
  /* Data */
  name: string;
  grade: string;
  /* ... */
}
```

- **`<Entity>PopulatedRefs`** — every ref on the entity, typed as it looks
  once populated. Array refs are typed as plain arrays (`IImage[]`), never
  `| null` — they default to `[]`, not `null`. Scalar refs are typed
  `| null` when the reference can be legitimately absent (unset, or pointing
  at a document that's since been deleted).

- **`WithRefs<ClimbPopulatedRefs>`** (`data/infrastructure/with-refs.ts`),
  mixed into `IClimb`, does two things: it turns each entry of the populated
  map into the depopulated `ObjectId`/`ObjectId[]`/`ObjectId | null` shape the
  Mongoose document actually has, and it stashes the original populated map
  on a phantom property keyed by a private brand symbol. `IClimb` itself ends
  up with `location: Types.ObjectId | null`, etc. — nothing about the
  populated types needs to be repeated at the interface level.

- **`<Entity>RequiredRefs`** — the subset of `<Entity>PopulatedRefs`' keys
  that are mandatory, i.e. always set to a real `ObjectId` at the DB level
  (or equal to the full key set if the entity has no optional refs). This is
  a statement about presence of the reference, not about population
  succeeding — `location` is required on every climb, but _populating_ it can
  still yield `null` if the referenced `Location` was deleted, which is why
  `ClimbPopulatedRefs` types it `| null` regardless. Array refs are never
  listed here: they default to `[]`, never `null`, so there's nothing
  optional about them to exclude.

Every entity with refs follows this shape: `sector.ts`, `location.ts`,
`climb-history.ts`, `training-session.ts`, `_collaborator.ts`. An entity with
no refs (`user.ts`) skips `WithRefs` and the two exported types entirely.

## Expressing "populated" to services and mappers

`WithRefs`/`RefsOf` (`data/infrastructure/with-refs.ts`) exist so that
downstream code — service guards, API mappers — can say "this ref is
populated" or "this ref is required" without restating what it populates to.
Two helpers build on top of them:

- **`WithPopulatedRefs<T, K>`** (`data/infrastructure/with-populated-refs.ts`)
  — replaces ref `K` on entity `T` with its populated type, read back off `T`
  via `RefsOf<T>` (the brand `WithRefs` stashed). It never strips `null`/
  `undefined` itself — if the map still has them for `K`, that's because
  nothing has proven that ref present yet.

  ```ts
  function toApiDepopulatedSector(model: WithPopulatedRefs<ISector, 'images'>) {
    /* model.images: IImage[] */
  }
  ```

  Pass a union (`WithPopulatedRefs<IEntity, 'refA' | 'refB'>`) when more than
  one ref needs to be populated.

- **`WithRequiredRefs<T, K>`**
  (`data/infrastructure/with-required-refs.ts`) — strips `null` from the
  named keys of `T` (leaving everything else, including other nullable refs
  that are optional _by design_, untouched), and is where null-stripping for
  populated refs actually happens: it also restamps `T`'s ref-map brand,
  stripping `null` from the same keys in `RefsOf<T>`. That's what lets a
  later `WithPopulatedRefs<T, K>` resolve those keys to a non-null populated
  type without doing any stripping of its own. Used to type a value whose
  refs are still `ObjectId`s (not populated) but are known — because a
  caller checked, e.g. via a `hasRequired<Entity>Refs`/`hasValidRefs` guard in
  the service layer — to be actually present rather than the field's nominal
  `| null` type:

  ```ts
  function hasRequiredRefs(
    model: IClimb
  ): model is WithRequiredRefs<IClimb, ClimbRequiredRefs> {
    return model.location != null && model.sector != null;
  }
  ```

The two compose at the mapper boundary: `WithRequiredRefs<IEntity,
EntityRequiredRefs>` types a mapper's input when it expects ids (already
validated non-null) — and, because it also updates the ref-map brand, is a
prerequisite for `WithPopulatedRefs<IEntity, 'someRef'>` to type a nested ref
as non-null when it expects a full document. See `api/mappers/README.md` for
how mappers use both together.
