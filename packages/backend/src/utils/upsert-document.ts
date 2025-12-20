import { Document, Model, Types } from 'mongoose';

export function upsertDocument<T extends Document>(
  model: Model<T>,
  id: string | undefined,
  data: Partial<T>
) {
  const _id = id ? new Types.ObjectId(id) : new Types.ObjectId();

  return model
    .findByIdAndUpdate(_id, data, {
      new: true,
      upsert: true,
      runValidators: true,
    })
    .orFail(
      new Error(
        `${model.modelName} with ID "${_id ?? ''}" could not be upsert.`
      )
    );
}
