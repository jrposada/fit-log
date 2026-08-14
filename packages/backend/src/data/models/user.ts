import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface IUser extends WithTimestamps<Document<Types.ObjectId>> {
  /* Data */
  keycloakId: string;
  email: string;
  name: string;
  roles: string[];
}

const userSchema = new Schema<IUser>(
  {
    keycloakId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', userSchema);
