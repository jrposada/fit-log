import type { RefsOf, WithBrand } from './with-refs.ts';

/**
 * Strips `null` from the given reference properties, leaving every other
 * property (including other nullable refs that are optional by design, e.g.
 * an unattached image) untouched. Use on model interfaces to express that
 * *specific* references are known to be populated and pointing at existing
 * documents — the caller names which refs are actually required.
 *
 * Also strips `null` from the same keys in the entity's ref-map brand (see
 * `RefsOf`/`WithBrand`), so a later `WithPopulatedRefs` sees the populated
 * type as non-null too — `WithPopulatedRefs` itself never strips `null`, that
 * responsibility belongs entirely to `WithRequiredRefs`.
 *
 * `Overrides` lets a caller replace the default `NonNullable<T[P]>` for
 * specific keys of `K` — mirrors `WithPopulatedRefs`'s `Overrides` (see
 * `with-populated-refs.ts` for why the constraint is this self-referential
 * mapped type rather than `Partial<Record<K, unknown>>`). This is how a
 * nested, non-ref field can be required "deeper" than plain `NonNullable`
 * gets you — e.g. `collaborators: ICollaborator[]` isn't part of any entity's
 * ref map (it's a `WithOwnership` field, not a `RefsOf<T>` entry), so
 * `NonNullable<T['collaborators']>` is a no-op; overriding it with
 * `WithRequiredRefs<ICollaborator, CollaboratorRequiredRefs>[]` is how a
 * caller states each collaborator's own `user` FK is required too.
 */
export type WithRequiredRefs<
  T,
  K extends keyof T,
  Overrides extends {
    [P in keyof Overrides]: P extends K ? unknown : never;
  } = Record<never, never>,
> = WithBrand<
  Omit<T, K> & {
    [P in K]: P extends keyof Overrides ? Overrides[P] : NonNullable<T[P]>;
  },
  RefsOf<T> extends never
    ? never
    : Omit<RefsOf<T>, K & keyof RefsOf<T>> & {
        [P in K & keyof RefsOf<T>]: NonNullable<RefsOf<T>[P]>;
      }
>;
