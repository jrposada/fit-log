import { UserSummary } from './user-summary';

export const ADMIN_ROLE = 'admin';

export const COLLABORATOR_PERMISSIONS = ['edit', 'delete'] as const;
export type CollaboratorPermission = (typeof COLLABORATOR_PERMISSIONS)[number];

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

type Viewer = {
  id: string;
  roles: string[];
};

type OwnershipBearer = {
  owner: { id: string };
  collaborators: { user: { id: string }; permission: CollaboratorPermission }[];
};

export function canEdit(viewer: Viewer, resource: OwnershipBearer): boolean {
  if (viewer.roles.includes(ADMIN_ROLE)) return true;
  if (resource.owner.id === viewer.id) return true;
  return resource.collaborators.some(
    (c) => c.user.id === viewer.id && c.permission === 'edit'
  );
}

export function canDelete(viewer: Viewer, resource: OwnershipBearer): boolean {
  if (viewer.roles.includes(ADMIN_ROLE)) return true;
  if (resource.owner.id === viewer.id) return true;
  return resource.collaborators.some(
    (c) => c.user.id === viewer.id && c.permission === 'delete'
  );
}
