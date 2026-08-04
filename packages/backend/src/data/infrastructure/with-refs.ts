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
