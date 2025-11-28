import { Document, model, Schema, WithTimestamps } from 'mongoose';

export interface IImage extends WithTimestamps<Document> {
  //////////
  // Data //
  //////////
  imageUrl: string;
  thumbnailUrl: string;
  imageWidth: number;
  imageHeight: number;

  ////////////////
  // References //
  ////////////////
}

const imageSchema = new Schema<IImage>(
  {
    //////////
    // Data //
    //////////
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    imageWidth: {
      type: Number,
      required: true,
    },
    imageHeight: {
      type: Number,
      required: true,
    },

    ////////////////
    // References //
    ////////////////
  },
  {
    timestamps: true,
  }
);

export const Image = model<IImage>('Image', imageSchema);
