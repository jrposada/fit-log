import { Document, Model, Types } from 'mongoose';

export interface BatchUpsertItem<T> {
  id?: string;
  data: Partial<T>;
}

export async function batchUpsertDocument<T extends Document>(
  model: Model<T>,
  items: BatchUpsertItem<T>[]
) {
  const ids: Types.ObjectId[] = [];

  if (items.length === 0) {
    return ids;
  }

  const bulkOps = items.map<Parameters<Model<T>['bulkWrite']>[0][number]>(
    (item) => {
      const _id = item.id ? new Types.ObjectId(item.id) : new Types.ObjectId();
      ids.push(_id);

      return {
        updateOne: {
          filter: { _id },
          update: { $set: item.data },
          upsert: true,
        },
      };
    }
  );

  await model.bulkWrite(bulkOps, { ordered: false });

  return ids;
}
