# Data Models

One file per entity. Each file defines a Mongoose interface (`I<Entity>`) and
schema, and exports the compiled model. Ownership (`owner`/`collaborators`) is
mixed in via `WithOwnership`/`ownershipFields` from `_collaborator.ts`; combine
with `WithTimestamps<Document>` for the interface.

## Nullable refs

A reference field is typed `Types.ObjectId | null` for one of two distinct
reasons, and the schema tells you which:

- **Required ref, nullable only in TS** — `required: true` at the schema
  level. The document always has this ref; the interface allows `null` purely
  to express "populated and the referenced doc was since deleted."
- **Optional ref** — `required: false` (usually with `default: null`). The
  document may legitimately never have had this ref set.

Both look identical in the interface (`foo: Types.ObjectId | null`). The
schema's `required` flag is the source of truth for which case you're in —
don't infer it from the TS type alone.

## Expressing "required" to consumers: `<Entity>RequiredRefs`

Services and mappers frequently need a type where the _required_ refs are
known non-null (after checking) while optional refs stay untouched. Use
`WithRequiredRefs<T, K>` (`data/infrastructure/with-required-refs.ts`) for
this — it strips `null` only from the keys in `K`, leaving every other
property (including optional refs) exactly as declared:

```ts
WithRequiredRefs<IClimb, 'location' | 'sector'>;
// => location/sector are non-null; image/model3d stay Types.ObjectId | null
```

`K` is deliberately explicit rather than auto-detected from the `ObjectId |
null` shape — auto-detection can't distinguish "required ref, nullable due to
deletion" from "optional ref," and would wrongly force optional refs non-null
too.

Export that key union as `<Entity>RequiredRefs` next to the model interface
instead of repeating the literal union at every call site:

```ts
// climb.ts — no `<Entity>Refs` export yet, so this is a plain literal union
export type ClimbRequiredRefs = 'location' | 'sector';

// climb-history.ts — `ClimbHistoryRefs` already exists (see below), so the
// required set is derived from it rather than re-listed
export type ClimbHistoryRequiredRefs = Exclude<
  ClimbHistoryRefs,
  'trainingSession'
>;
```

Every type guard and mapper that needs "this entity with its required refs
populated" should reference `WithRequiredRefs<IEntity, EntityRequiredRefs>`
(e.g. `WithRequiredRefs<IClimb, ClimbRequiredRefs>`), so which refs are
mandatory is decided in exactly one place — the model file — and never
re-declared downstream.

This only applies to entities that actually mix required and optional
nullable refs. An entity whose only nullable ref is optional (e.g.
`WithSessionBase.location`) has nothing to make "required," so it has no
`<Entity>RequiredRefs` export — don't add one just for the sake of the
pattern.

## Expressing "all refs" to API mappers: `<Entity>Refs`

`<Entity>RequiredRefs` narrows nullability on the model side. The API mapper
side (`api/mappers/`, see its README) has a different need: a union of
_every_ ref key on the entity, required and optional alike, so it can
collapse each one down to an id string via `WithDepopulatedRefs<T, K>`
(`data/infrastructure/with-depopulated-refs.ts`) when building the
`toApiDepopulated<Entity>` return type.

Export that as `<Entity>Refs` next to `<Entity>RequiredRefs` once a mapper
needs it — not speculatively:

```ts
// climb-history.ts
export type ClimbHistoryRefs =
  | 'climb'
  | 'location'
  | 'sector'
  | 'trainingSession';

export type ClimbHistoryRequiredRefs = Exclude<
  ClimbHistoryRefs,
  'trainingSession'
>;
```

Once both exist, derive `<Entity>RequiredRefs` from `<Entity>Refs` via
`Exclude`, naming only the refs that are genuinely optional — don't re-list
the required ones by hand. This makes `RequiredRefs` a subset of `Refs` by
construction: a new ref added to `<Entity>Refs` is required by default unless
you explicitly `Exclude` it, which is the safer direction to forget in (an
optional ref wrongly treated as required fails loudly via `WithRequiredRefs`
at the first null; a required ref missing from a hand-maintained list fails
silently).

## Expressing "populated" to services and mappers: `Ref<T>`

`<Entity>Refs`/`<Entity>RequiredRefs` above are about the _depopulated_
direction: a ref that's a full document collapsing down to an id string.
Services and mappers also need the opposite direction just as often — a ref
typed `Types.ObjectId`/`Types.ObjectId[]` on the interface temporarily holding
a full populated document after a `.populate()` call. Before `Ref<T>`
existed, every call site re-declared this by hand:

```ts
// repeated at every service/mapper that populates a Sector's images
MergeType<ISector, { images: IImage[] }>;
```

which works, but means the populated type of `images` (`IImage[]`) is
decided anew at each call site instead of by `ISector` itself. `Ref<T>`
(`data/infrastructure/ref.ts`) and `WithPopulatedRefs<T, K>`
(`data/infrastructure/with-populated-refs.ts`) let the model file be the one
place that decides what each ref populates to.

`Ref<T>` takes a map of ref field name -> populated type and does two things:
it derives the actual depopulated field types the interface needs
(`Types.ObjectId`/`Types.ObjectId[]`, array-ness read off the map), and it
stashes the original map on a phantom, `unique symbol`-keyed property that's
optional and never assigned — it exists purely for other types to read back,
never at runtime.

```ts
// sector.ts
type SectorPopulatedRefs = {
  images: IImage[];
  climbs: IClimb[];
};

export interface ISector
  extends WithTimestamps<Document>, WithOwnership, Ref<SectorPopulatedRefs> {
  /* Data */
  name: string;
  /* ... */
  /* `images`/`climbs` are NOT listed here — Ref<SectorPopulatedRefs> supplies
     them as Types.ObjectId[] */
}
```

`WithPopulatedRefs<T, K extends keyof RefsOf<T>>` reads that map back off `T`
via `RefsOf<T>` and swaps in the populated type for the named keys, leaving
every other field (including other refs, still depopulated) untouched:

```ts
WithPopulatedRefs<ISector, 'images'>;
// => images: IImage[]; climbs stays Types.ObjectId[]; everything else untouched
```

Because the populated type comes from `ISector` itself, the caller only
names _which_ ref is populated, never _what_ it populates to — there is
nothing left to get out of sync.

### Naming convention

Name the map `<Entity>PopulatedRefs` and keep it **unexported**, next to the
interface. Nothing outside the model file should ever need it by name —
`WithPopulatedRefs<IEntity, K>` recovers it automatically via `RefsOf<T>`, so
exporting it would just be a second, redundant way to say the same thing:

```ts
type SectorPopulatedRefs = {
  images: IImage[];
  climbs: IClimb[];
};
```

List every ref the entity has, even ones `<Entity>Refs` leaves out (e.g.
`images`, which the API shape always embeds fully and therefore never
appears in `SectorRefs`) — `<Entity>PopulatedRefs` and `<Entity>Refs` answer
different questions about the same ref set and shouldn't be conflated into
one type: a ref can need collapsing to an id string in one context and
population with the full document in another, independently.
