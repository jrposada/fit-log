import { Document, model, Schema, WithTimestamps } from 'mongoose';

export interface IUser extends WithTimestamps<Document> {
  //////////
  // Data //
  //////////
  keycloakId: string;
  email: string;
  name: string;
  roles: string[];
  emailVerified: boolean;

  ////////////////
  // References //
  ////////////////
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

// Index for querying users by Keycloak ID
userSchema.index({ keycloakId: 1 });

export const User = model<IUser>('User', userSchema);
