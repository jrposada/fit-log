import {
  AnyBulkWriteOperation,
  ClientSession,
  Document,
  Model,
  Types,
} from 'mongoose';

import { editableBy } from '../auth/editable-filter';
import { IUser } from '../models/user';

export interface BatchUpsertOwnedItem<T> {
  id?: string;
  data: Partial<T>;
}

/**
 * Batched ownership-aware upsert. One DB roundtrip via `bulkWrite`.
 *
 * Returns the resolved `_id`s in input order plus the count of ops that
 * matched or upserted. If `matchedCount < items.length` some item failed
 * to apply (didn't exist OR auth-blocked) — the caller decides how to
 * react (e.g. abort the surrounding transaction).
 *
 * NOTE: Collaborators are managed via dedicated endpoints, not via this
 * helper — the put body never carries `collaborators`.
 */
export async function batchUpsertOwnedDocument<T extends Document>(
  model: Model<T>,
  items: BatchUpsertOwnedItem<T>[],
  user: IUser,
  session?: ClientSession
): Promise<{ ids: Types.ObjectId[]; matchedCount: number }> {
  const userId = user._id as Types.ObjectId;
  const ids: Types.ObjectId[] = [];

  if (items.length === 0) {
    return { ids, matchedCount: 0 };
  }

  const ops = items.map<AnyBulkWriteOperation<T>>((item) => {
    if (item.id) {
      const _id = new Types.ObjectId(item.id);
      ids.push(_id);

      return {
        updateOne: {
          filter: { _id, ...editableBy(user) },
          update: { $set: { ...item.data } },
        },
      };
    }

    const _id = new Types.ObjectId();
    ids.push(_id);

    return {
      updateOne: {
        filter: { _id },
        update: {
          $set: { ...item.data },
          $setOnInsert: { owner: userId, collaborators: [] },
        },
        upsert: true,
      },
    };
  });

  const result = await model.bulkWrite(ops, { ordered: false, session });

  const matchedCount =
    (result.matchedCount ?? 0) + (result.upsertedCount ?? 0);

  return { ids, matchedCount };
}
