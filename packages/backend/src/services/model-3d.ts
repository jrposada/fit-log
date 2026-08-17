import type { CollaboratorPermission } from '@jrposada/fit-log-shared/models/auth/with-ownership';

import { deletableBy } from '../auth/deletable-filter.ts';
import type {
  PopulatedOwnership,
  WithPopulatedOwnership,
} from '../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../auth/ownership-populate.ts';
import { removeCollaborator } from '../data/infrastructure/remove-collaborator.ts';
import { upsertCollaborator } from '../data/infrastructure/upsert-collaborator.ts';
import { upsertOwnedDocument } from '../data/infrastructure/upsert-owned-document.ts';
import type { IModel3d } from '../data/models/model-3d.ts';
import { Model3d } from '../data/models/model-3d.ts';
import type { IUser } from '../data/models/user.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import { enqueueModel3dReconstruction } from '../jobs/queues/model-3d-reconstruction-queue.ts';
import type { ProcessedModel3d } from './model-3d-processor.ts';
import { Model3dProcessor } from './model-3d-processor.ts';
import { VideoProcessor } from './video-processor.ts';

/** Fully populated 3D model, as returned to API mappers. */
type ValidModel3d = WithPopulatedOwnership<IModel3d>;

type CreateModel3dInput = {
  base64: string;
  mimeType: string;
};

async function createModel3d(
  user: IUser,
  input: CreateModel3dInput
): Promise<ValidModel3d> {
  const model3dProcessor = new Model3dProcessor();
  const processedModel3d = await model3dProcessor.processModelFromBase64(
    input.base64,
    input.mimeType
  );

  const model3d = await upsertOwnedDocument(Model3d, undefined, user, {
    /* Data */
    status: 'ready',
    modelUrl: processedModel3d.modelUrl,
    mimeType: processedModel3d.mimeType,
    fileSize: processedModel3d.fileSize,
  }).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!model3d) {
    throw new ResourceNotFound('Model3d creation failed');
  }

  return model3d;
}

type CreateModel3dFromVideoInput = {
  base64: string;
  mimeType: string;
};

/**
 * Stores the source video and creates a `Model3d` in 'processing' status,
 * then queues the reconstruction job. The worker (see
 * `jobs/workers/model-3d-reconstruction-worker/model-3d-reconstruction-worker.ts`)
 * fills in `modelUrl` and
 * flips `status` to 'ready'/'failed' once the job finishes.
 */
async function createModel3dFromVideo(
  user: IUser,
  input: CreateModel3dFromVideoInput
): Promise<ValidModel3d> {
  const videoProcessor = new VideoProcessor();
  const { videoPath } = await videoProcessor.processVideoFromBase64(
    input.base64,
    input.mimeType
  );

  const model3d = await upsertOwnedDocument(Model3d, undefined, user, {
    /* Data */
    status: 'processing',
  }).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!model3d) {
    throw new ResourceNotFound('Model3d creation failed');
  }

  await enqueueModel3dReconstruction({
    model3dId: model3d._id.toString(),
    videoPath,
  });

  return model3d;
}

/** Called by the reconstruction worker once a job succeeds. */
async function completeModel3dReconstruction(
  id: string,
  processed: ProcessedModel3d
): Promise<void> {
  await Model3d.updateOne(
    { _id: id },
    {
      status: 'ready',
      modelUrl: processed.modelUrl,
      mimeType: processed.mimeType,
      fileSize: processed.fileSize,
    }
  );
}

/** Called by the reconstruction worker once a job fails. */
async function failModel3dReconstruction(
  id: string,
  error: string
): Promise<void> {
  await Model3d.updateOne({ _id: id }, { status: 'failed', error });
}

async function addModel3dCollaborator(
  user: IUser,
  id: string,
  granteeId: string,
  permission: CollaboratorPermission
): Promise<ValidModel3d> {
  const model3d = await upsertCollaborator(
    Model3d,
    id,
    granteeId,
    permission,
    user
  ).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!model3d) {
    throw new ResourceNotFound(`Model3d ${id} not found or not editable`);
  }

  return model3d;
}

async function removeModel3dCollaborator(
  user: IUser,
  id: string,
  granteeId: string
): Promise<ValidModel3d> {
  const model3d = await removeCollaborator(
    Model3d,
    id,
    granteeId,
    user
  ).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!model3d) {
    throw new ResourceNotFound(`Model3d ${id} not found or not editable`);
  }

  return model3d;
}

async function deleteModel3d(user: IUser, id: string): Promise<void> {
  const result = await Model3d.deleteOne({ _id: id, ...deletableBy(user) });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(`Model3d ${id} not found or not deletable`);
  }
}

export {
  addModel3dCollaborator,
  completeModel3dReconstruction,
  createModel3d,
  createModel3dFromVideo,
  deleteModel3d,
  failModel3dReconstruction,
  removeModel3dCollaborator,
};
export type { ValidModel3d };
