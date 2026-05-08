import { MergeType, PopulateOptions } from 'mongoose';

import { ICollaborator } from '../models/_collaborator';
import { IUser } from '../models/user';

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
