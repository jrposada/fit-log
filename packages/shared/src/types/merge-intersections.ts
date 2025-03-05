export type MergeIntersections<T> = T extends object
  ? { [K in keyof T]: MergeIntersections<T[K]> }
  : T;
