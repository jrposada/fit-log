import { Schema, Types } from 'mongoose';

export type CollaboratorPermission = 'edit';

export const COLLABORATOR_PERMISSIONS: CollaboratorPermission[] = ['edit'];

export interface ICollaborator {
  user: Types.ObjectId;
  permission: CollaboratorPermission;
}

export const collaboratorSchema = new Schema<ICollaborator>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permission: {
      type: String,
      enum: COLLABORATOR_PERMISSIONS,
      required: true,
    },
  },
  { _id: false }
);
