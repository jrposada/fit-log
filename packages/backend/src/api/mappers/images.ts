import type { WithDepopulatedOwnership } from '@jrposada/fit-log-shared/models/auth/with-ownership';
import type { Image } from '@jrposada/fit-log-shared/models/images/image';

import type { WithPopulatedOwnership } from '../../auth/ownership-populate.ts';
import type { IImage } from '../../data/models/image.ts';
import { resolveFileUrl } from '../infrastructure/resolve-file-url.ts';
import {
  toApiCollaborator,
  toApiDepopulatedCollaborator,
} from './collaborators.ts';
import { toApiUserSummary } from './user-summary.ts';

function toApiDepopulatedImage(model: IImage): WithDepopulatedOwnership<Image> {
  return {
    /* Data */
    id: model._id.toString(),
    imageUrl: resolveFileUrl(model.imageUrl),
    thumbnailUrl: resolveFileUrl(model.thumbnailUrl),
    imageWidth: model.imageWidth,
    imageHeight: model.imageHeight,

    /* Ownership */
    owner: model.owner._id.toString(),
    collaborators: model.collaborators.map(toApiDepopulatedCollaborator),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toApiImage(model: WithPopulatedOwnership<IImage>): Image {
  return {
    /* Data */
    id: model._id.toString(),
    imageUrl: resolveFileUrl(model.imageUrl),
    thumbnailUrl: resolveFileUrl(model.thumbnailUrl),
    imageWidth: model.imageWidth,
    imageHeight: model.imageHeight,

    /* Ownership */
    owner: toApiUserSummary(model.owner),
    collaborators: model.collaborators.map(toApiCollaborator),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export { toApiDepopulatedImage, toApiImage };
