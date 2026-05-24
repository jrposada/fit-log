import type { MergeType, PopulateOptions } from 'mongoose';

import type { ICollaborator } from '../models/_collaborator.ts';
import type { IUser } from '../models/user.ts';

export type PopulatedOwnership = {
  owner: IUser;
  collaborators: MergeType<ICollaborator, { user: IUser }>[];
};

export type WithPopulatedOwnership<T> = MergeType<T, PopulatedOwnership>;

/**
 * Mongoose populate paths that resolve `owner` and every
 * `collaborators[].user` reference into full User docs. Spread into the
 * `populate` option of a parent path or chained on a query so API
 * mappers receive a populated `WithPopulatedOwnership` shape.
 */
export const OWNERSHIP_POPULATE: PopulateOptions[] = [
  { path: 'owner' },
  { path: 'collaborators.user' },
];
