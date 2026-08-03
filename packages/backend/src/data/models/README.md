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
// climb.ts
export type ClimbRequiredRefs = 'location' | 'sector';

// climb-history.ts
export type ClimbHistoryRequiredRefs = 'climb' | 'location' | 'sector';
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
