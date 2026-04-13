import { Types } from 'mongoose';

/**
 * Strips `null` from every property whose type includes `Types.ObjectId | null`.
 * Use on model interfaces to express that all references are known to be populated
 * and pointing at existing documents.
 */
export type WithRequiredRefs<T> = {
  [K in keyof T]: Types.ObjectId | null extends T[K]
    ? NonNullable<T[K]>
    : T[K];
};
