import { WithDepopulatedOwnership } from '@shared/models/auth/with-ownership';
import { Model3D } from '@shared/models/model3d/model3d';

import { WithPopulatedOwnership } from '../../auth/ownership-populate';
import { IModel3D } from '../../models/model3d';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from '../auth/collaborators-mapper';
import { toApiUserSummary } from '../auth/user-summary-mapper';

function toApiDepopulatedModel3D(
  model: IModel3D
): WithDepopulatedOwnership<Model3D> {
  return {
    /* Data */
    id: model._id.toString(),
    modelUrl: model.modelUrl,
    fileSize: model.fileSize,

    /* Ownership */
    owner: model.owner._id.toString(),
    collaborators: model.collaborators.map(toApiDepopulatedCollaborator),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiModel3D(model: WithPopulatedOwnership<IModel3D>): Model3D {
  return {
    /* Data */
    id: model._id.toString(),
    modelUrl: model.modelUrl,
    fileSize: model.fileSize,

    /* Ownership */
    owner: toApiUserSummary(model.owner),
    collaborators: model.collaborators.map(toApiCollaborator),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedModel3D, toApiModel3D };
