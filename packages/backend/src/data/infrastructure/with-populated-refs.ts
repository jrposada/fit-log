import type { RefsOf, WithBrand } from './with-refs.ts';

/**
 * Replaces the given reference properties with their populated shape. The
 * populated type for each key comes from the entity's own ref-map brand (see
 * `with-refs.ts`) via `RefsOf<T>`, so callers only name which refs are
 * populated — never what they populate to. This never strips `null`/
 * `undefined` itself: if a ref's populated type still includes them, that's
 * because the ref hasn't been proven present. Run `T` through
 * `WithRequiredRefs<T, K>` first to make a specific ref's populated type
 * non-null — it updates the ref-map brand for exactly that reason.
 *
 * `Overrides` lets a caller further restrict specific keys of `K` beyond
 * what `RefsOf<T>` says — typically to describe a ref whose own nested refs
 * are, in turn, required or populated (e.g. `sector` populated down to its
 * `images`, or `climb` with its own `location`/`sector` proven non-null via
 * `WithRequiredRefs`). Only the keys present in `Overrides` are replaced;
 * every other key in `K` still resolves to `RefsOf<T>[P]`. Its constraint is
 * a self-referential mapped type (not `Partial<Record<K, unknown>>`) so that
 * a key outside `K` — e.g. a typo — is rejected at the `Overrides` key
 * itself instead of silently ignored: `Partial<Record<K, unknown>>` has no
 * index signature, so plain width subtyping would let an object with extra
 * keys satisfy it.
 *
 * The result is restamped via `WithBrand` with `K` dropped from the ref-map:
 * once a ref is populated (default or overridden), there's nothing left to
 * look up for it, and leaving its old entry in the brand would wrongly
 * demand that a real, unbranded document (e.g. straight off a Mongoose
 * `.populate()`) match it.
 */
export type WithPopulatedRefs<
  T,
  K extends keyof RefsOf<T>,
  Overrides extends {
    [P in keyof Overrides]: P extends K ? unknown : never;
  } = Record<never, never>,
> = WithBrand<
  Omit<T, K> & {
    [P in K]: P extends keyof Overrides ? Overrides[P] : RefsOf<T>[P];
  },
  Omit<RefsOf<T>, K>
>;
