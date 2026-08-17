import { collaboratorDeleteParamsSchema } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import {
  collaboratorPutParamsSchema,
  collaboratorPutRequestSchema,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import { model3dsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/model-3d/model-3ds-delete';
import { model3dsFromVideoPostRequestSchema } from '@jrposada/fit-log-shared/models/model-3d/model-3ds-from-video-post';
import { model3dsPostRequestSchema } from '@jrposada/fit-log-shared/models/model-3d/model-3ds-post';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { logResponse } from '../../middlewares/log-response.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { handler as model3dsCollaboratorsDelete } from './model-3ds-collaborators-delete.ts';
import { handler as model3dsCollaboratorsPut } from './model-3ds-collaborators-put.ts';
import { handler as model3dsDelete } from './model-3ds-delete.ts';
import { handler as model3dsFromVideoPost } from './model-3ds-from-video-post.ts';
import { handler as model3dsPost } from './model-3ds-post.ts';

export function registerModel3dsRoutes(router: Router): void {
  router.post(
    '/model-3ds',
    authenticate,
    logRequest,
    logResponse,
    validateBody(model3dsPostRequestSchema),
    model3dsPost
  );
  router.post(
    '/model-3ds/from-video',
    authenticate,
    logRequest,
    logResponse,
    validateBody(model3dsFromVideoPostRequestSchema),
    model3dsFromVideoPost
  );
  router.delete(
    '/model-3ds/:id',
    authenticate,
    logRequest,
    logResponse,
    validateParams(model3dsDeleteParamsSchema),
    model3dsDelete
  );
  router.put(
    '/model-3ds/:id/collaborators/:userId',
    authenticate,
    logRequest,
    logResponse,
    validateParams(collaboratorPutParamsSchema),
    validateBody(collaboratorPutRequestSchema),
    model3dsCollaboratorsPut
  );
  router.delete(
    '/model-3ds/:id/collaborators/:userId',
    authenticate,
    logRequest,
    logResponse,
    validateParams(collaboratorDeleteParamsSchema),
    model3dsCollaboratorsDelete
  );
}
