/**
 * Replaces the given reference properties with their depopulated shape,
 * leaving every other property untouched. A ref typed as an array (e.g. a
 * Location's `sectors`) collapses to `string[]`. A scalar ref whose type
 * includes `null` (an optional ref) collapses to `string | null` rather
 * than losing the null case; every other scalar ref collapses to `string`.
 * Use on API model interfaces to express that *specific* references have
 * been depopulated down to their id(s) — the caller names which refs are
 * actually depopulated.
 */
export type WithDepopulatedRefs<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] extends unknown[]
    ? string[]
    : null extends T[P]
      ? string | null
      : string;
};
