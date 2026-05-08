export const ADMIN_ROLE = 'admin';

export type CollaboratorPermission = 'edit' | 'delete';

export type Collaborator = {
  user: string;
  permission: CollaboratorPermission;
};

export type WithOwnership<T> = T & {
  /* Ownership */
  owner: string;
  collaborators: Collaborator[];
};
