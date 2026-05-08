import { Document, Model, Types } from 'mongoose';

import { editableBy } from '../auth/editable-filter';
import { IUser } from '../models/user';

/**
 * Upsert an ownership-aware document in a single DB roundtrip.
 *
 * Update path (`id` given): `findOneAndUpdate` filtered by `editableBy(user)`
 * — owner, edit-collaborator, or admin. Returns null if the doc doesn't
 * exist or the user isn't authorized — the caller decides 404 vs 403.
 *
 * Create path (no `id`): upsert with a fresh `_id` and `$setOnInsert` for
 * ownership. Returns the inserted doc.
 *
 * Returns a mongoose Query — chain `.populate(...)` and await as usual.
 *
 * NOTE: Collaborators are managed via dedicated endpoints
 * (`PUT/DELETE /<resource>/:id/collaborators/:userId`), not via this
 * helper — the put body never carries `collaborators`.
 */
export function upsertOwnedDocument<T extends Document>(
  model: Model<T>,
  id: string | undefined,
  user: IUser,
  data: Partial<T>
) {
  const userId = user._id as Types.ObjectId;

  if (id) {
    return model.findOneAndUpdate(
      { _id: id, ...editableBy(user) },
      { $set: { ...data } },
      { new: true, runValidators: true }
    );
  }

  const newId = new Types.ObjectId();
  return model.findOneAndUpdate(
    { _id: newId },
    {
      $set: { ...data },
      $setOnInsert: { owner: userId, collaborators: [] },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}
