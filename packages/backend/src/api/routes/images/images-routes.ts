import { collaboratorDeleteParamsSchema } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import {
  collaboratorPutParamsSchema,
  collaboratorPutRequestSchema,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import { imagesDeleteParamsSchema } from '@jrposada/fit-log-shared/models/images/images-delete';
import { imagesPostRequestSchema } from '@jrposada/fit-log-shared/models/images/images-post';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { logResponse } from '../../middlewares/log-response.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { handler as imagesCollaboratorsDelete } from './images-collaborators-delete.ts';
import { handler as imagesCollaboratorsPut } from './images-collaborators-put.ts';
import { handler as imagesDelete } from './images-delete.ts';
import { handler as imagesPost } from './images-post.ts';

export function registerImagesRoutes(router: Router): void {
  router.post(
    '/images',
    authenticate,
    logRequest,
    logResponse,
    validateBody(imagesPostRequestSchema),
    imagesPost
  );
  router.delete(
    '/images/:id',
    authenticate,
    logRequest,
    logResponse,
    validateParams(imagesDeleteParamsSchema),
    imagesDelete
  );
  router.put(
    '/images/:id/collaborators/:userId',
    authenticate,
    logRequest,
    logResponse,
    validateParams(collaboratorPutParamsSchema),
    validateBody(collaboratorPutRequestSchema),
    imagesCollaboratorsPut
  );
  router.delete(
    '/images/:id/collaborators/:userId',
    authenticate,
    logRequest,
    logResponse,
    validateParams(collaboratorDeleteParamsSchema),
    imagesCollaboratorsDelete
  );
}
