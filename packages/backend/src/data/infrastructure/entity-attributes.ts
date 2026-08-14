import type { Document, Types, WithTimestamps } from 'mongoose';

/**
 * Strips the Mongoose `Document`/`WithTimestamps` surface (`_id`, `save`,
 * `populate`, `createdAt`, ...) off an entity interface, leaving only its
 * schema-defined data fields. Use this to derive service create/update input
 * types from `I<Entity>` instead of hand-picking field names: a `Pick` list
 * silently stops covering a field the day someone adds it to the entity,
 * while `EntityAttributes<IEntity>` keeps including new fields automatically.
 */
export type EntityAttributes<
  T extends WithTimestamps<Document<Types.ObjectId>>,
> = Omit<T, keyof WithTimestamps<Document<Types.ObjectId>>>;
