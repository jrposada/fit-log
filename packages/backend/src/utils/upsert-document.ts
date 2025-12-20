import { Document, Model } from 'mongoose';

export function upsertDocument<T extends Document>(
  model: Model<T>,
  id: string | undefined,
  data: Partial<T>
) {
  return model
    .findByIdAndUpdate(id, data, {
      new: true,
      upsert: true,
      runValidators: true,
    })
    .orFail(
      new Error(`${model.modelName} with ID "${id ?? ''}" could not be upsert.`)
    );
}
