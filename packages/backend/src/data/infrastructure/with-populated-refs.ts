import type { RefsOf } from './with-refs.ts';

/**
 * Replaces the given reference properties with their populated shape. The
 * populated type for each key comes from the entity's own `Ref<...>` mixin
 * (see `ref.ts`) via `RefsOf<T>`, so callers only name which refs are
 * populated — never what they populate to. `null`/`undefined` are stripped
 * from the populated type: those variants exist to describe the depopulated
 * (unset) ref, but a successfully populated ref is always resolved.
 */
export type WithPopulatedRefs<T, K extends keyof RefsOf<T>> = Omit<T, K> & {
  [P in K]: NonNullable<RefsOf<T>[P]>;
};
