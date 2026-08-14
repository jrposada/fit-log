import type { Document, Model } from 'mongoose';
import { Types } from 'mongoose';

/**
 * Upsert a document in a single DB roundtrip.
 *
 * Update path (`id` given): `findByIdAndUpdate` without `upsert` — returns
 * `null` if no document exists with that id, so the caller can 404 instead
 * of silently creating one.
 *
 * Create path (no `id`): upsert with a fresh, collision-proof `_id`.
 */
export function upsertDocument<T extends Document>(
  model: Model<T>,
  id: string | undefined,
  data: Partial<T>
) {
  if (id) {
    return model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  return model.findByIdAndUpdate(new Types.ObjectId(), data, {
    new: true,
    upsert: true,
    runValidators: true,
  });
}
