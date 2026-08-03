/**
 * Strips `null` from the given reference properties, leaving every other
 * property (including other nullable refs that are optional by design, e.g.
 * an unattached image) untouched. Use on model interfaces to express that
 * *specific* references are known to be populated and pointing at existing
 * documents — the caller names which refs are actually required.
 */
export type WithRequiredRefs<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: NonNullable<T[P]>;
};
