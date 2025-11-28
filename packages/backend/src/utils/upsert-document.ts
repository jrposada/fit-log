import { assert } from '@shared/utils/assert';
import { Document, Model } from 'mongoose';

/**
 * Create or update a Mongoose document based on whether an ID is provided.
 *
 * @param Model - The Mongoose model class
 * @param id - Optional document ID. If provided, updates existing document. If undefined, creates new document.
 * @param data - The data to set on the document (for both create and update)
 * @param createOnlyFields - Additional fields to set only when creating
 * @returns The created or updated document
 * @throws AssertionError if id is provided but document not found
 */
export async function upsertDocument<T extends Document>(
  Model: Model<T>,
  id: string | undefined,
  data: Partial<T>,
  createOnlyFields?: Partial<T>
): Promise<T> {
  if (id) {
    // Update existing document
    const doc = await Model.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    assert(doc, { msg: `${Model.modelName} with ID ${id} not found` });
    return doc;
  } else {
    // Create new document
    const doc = new Model({
      ...data,
      ...createOnlyFields,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await doc.save();
    return doc;
  }
}
