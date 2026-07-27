import { collaboratorDeleteParamsSchema } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import {
  collaboratorPutParamsSchema,
  collaboratorPutRequestSchema,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import { imagesDeleteParamsSchema } from '@jrposada/fit-log-shared/models/images/images-delete';
import { imagesPostRequestSchema } from '@jrposada/fit-log-shared/models/images/images-post';
import type { Router } from 'express';

import { authenticateKeycloak } from '../../middlewares/auth.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { handler as imagesCollaboratorsDelete } from './images-collaborators-delete.ts';
import { handler as imagesCollaboratorsPut } from './images-collaborators-put.ts';
import { handler as imagesDelete } from './images-delete.ts';
import { handler as imagesPost } from './images-post.ts';

export function registerImagesRoutes(router: Router): void {
  router.post(
    '/images',
    authenticateKeycloak,
    validateBody(imagesPostRequestSchema),
    imagesPost
  );
  router.delete(
    '/images/:id',
    authenticateKeycloak,
    validateParams(imagesDeleteParamsSchema),
    imagesDelete
  );
  router.put(
    '/images/:id/collaborators/:userId',
    authenticateKeycloak,
    validateParams(collaboratorPutParamsSchema),
    validateBody(collaboratorPutRequestSchema),
    imagesCollaboratorsPut
  );
  router.delete(
    '/images/:id/collaborators/:userId',
    authenticateKeycloak,
    validateParams(collaboratorDeleteParamsSchema),
    imagesCollaboratorsDelete
  );
}
