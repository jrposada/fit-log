/**
 * Replaces the given reference properties with their id string, leaving
 * every other property untouched. A ref whose original type includes
 * `null` (an optional ref) depopulates to `string | null` rather than
 * losing the null case. Use on API model interfaces to express that
 * *specific* references have been depopulated down to their id — the
 * caller names which refs are actually depopulated.
 */
export type WithDepopulatedRefs<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: null extends T[P] ? string | null : string;
};
