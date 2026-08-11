import type { Types } from 'mongoose';

declare const refsBrand: unique symbol;

/**
 * Turns a map of ref field name -> populated type (e.g.
 * `{ images: IImage[]; climbs: IClimb[] }`) into the depopulated
 * `Types.ObjectId` shape those fields actually have on the Mongoose
 * document, and stashes the original map on a phantom, never-assigned
 * property. `RefsOf<T>` reads it back off, which is how `WithPopulatedRefs`
 * recovers each ref's populated type from the entity itself instead of
 * making callers restate it.
 */
export type WithRefs<T> = {
  [P in keyof T]: T[P] extends unknown[]
    ? Types.ObjectId[]
    : null extends T[P]
      ? Types.ObjectId | null
      : Types.ObjectId;
} & {
  [refsBrand]?: T;
};

export type RefsOf<T> = T extends { [refsBrand]?: infer R } ? R : never;

/**
 * Restamps `T` with a new ref-map brand `R`, discarding whatever brand `T`
 * carried before. `refsBrand` is only accessible inside this file, so callers
 * that need to adjust the ref-map (e.g. `WithRequiredRefs`, when it strips
 * `null` from a ref field and needs the populated-type map to agree) go
 * through this instead of writing the phantom property themselves.
 */
export type WithBrand<T, R> = Omit<T, typeof refsBrand> & {
  [refsBrand]?: R;
};
