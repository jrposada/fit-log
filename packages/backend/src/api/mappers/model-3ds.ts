import type { WithDepopulatedOwnership } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { Model3d } from '@jrposada/fit-log-shared/models/model-3d/model-3d';

import type { WithPopulatedOwnership } from '../../auth/ownership-populate.ts';
import type { WithRequiredOwnership } from '../../data/models/_collaborator.ts';
import type { IModel3d } from '../../data/models/model-3d.ts';
import { resolveFileUrl } from '../infrastructure/resolve-file-url.ts';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from './collaborators.ts';
import { toApiUserSummary } from './user-summary.ts';

function toApiDepopulatedModel3d(
  model: WithRequiredOwnership<IModel3d>
): WithDepopulatedOwnership<Model3d> {
  return {
    /* Data */
    id: model._id.toString(),
    status: model.status,
    modelUrl: model.modelUrl ? resolveFileUrl(model.modelUrl) : undefined,
    mimeType: model.mimeType,
    fileSize: model.fileSize,
    error: model.error,

    /* Ownership */
    owner: model.owner._id.toString(),
    collaborators: model.collaborators.map(toApiDepopulatedCollaborator),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiModel3d(model: WithPopulatedOwnership<IModel3d>): Model3d {
  return {
    /* Data */
    id: model._id.toString(),
    status: model.status,
    modelUrl: model.modelUrl ? resolveFileUrl(model.modelUrl) : undefined,
    mimeType: model.mimeType,
    fileSize: model.fileSize,
    error: model.error,

    /* Ownership */
    owner: toApiUserSummary(model.owner),
    collaborators: model.collaborators.map(toApiCollaborator),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedModel3d, toApiModel3d };
