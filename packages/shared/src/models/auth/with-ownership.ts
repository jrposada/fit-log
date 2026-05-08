import { UserSummary } from './user-summary';

export const ADMIN_ROLE = 'admin';

export type CollaboratorPermission = 'edit' | 'delete';

export type Collaborator = {
  user: UserSummary;
  permission: CollaboratorPermission;
};

export type WithOwnership<T> = T & {
  owner: UserSummary;
  collaborators: Collaborator[];
};

export type DepopulatedCollaborator = {
  user: string;
  permission: CollaboratorPermission;
};

export type WithDepopulatedOwnership<T> = Omit<T, 'owner' | 'collaborators'> & {
  owner: string;
  collaborators: DepopulatedCollaborator[];
};
