import type { RefsOf } from './ref.ts';

/**
 * Replaces the given reference properties with their populated shape. The
 * populated type for each key comes from the entity's own `Ref<...>` mixin
 * (see `ref.ts`) via `RefsOf<T>`, so callers only name which refs are
 * populated — never what they populate to.
 */
export type WithPopulatedRefs<T, K extends keyof RefsOf<T>> = Omit<T, K> &
  Pick<RefsOf<T>, K>;
