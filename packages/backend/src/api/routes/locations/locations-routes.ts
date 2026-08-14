import { collaboratorDeleteParamsSchema } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import {
  collaboratorPutParamsSchema,
  collaboratorPutRequestSchema,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import { locationsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/locations/locations-delete';
import { locationsGetQuerySchema } from '@jrposada/fit-log-shared/models/locations/locations-get';
import { locationsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/locations/locations-get-by-id';
import { locationsPutRequestSchema } from '@jrposada/fit-log-shared/models/locations/locations-put';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as locationsCollaboratorsDelete } from './locations-collaborators-delete.ts';
import { handler as locationsCollaboratorsPut } from './locations-collaborators-put.ts';
import { handler as locationsDelete } from './locations-delete.ts';
import { handler as locationsGet } from './locations-get.ts';
import { handler as locationsGetById } from './locations-get-by-id.ts';
import { handler as locationsPut } from './locations-put.ts';

export function registerLocationsRoutes(router: Router): void {
  router.get(
    '/locations',
    authenticate,
    logRequest,
    validateQuery(locationsGetQuerySchema),
    locationsGet
  );
  router.get(
    '/locations/:id',
    authenticate,
    logRequest,
    validateParams(locationsGetByIdParamsSchema),
    locationsGetById
  );
  router.put(
    '/locations',
    authenticate,
    logRequest,
    validateBody(locationsPutRequestSchema),
    locationsPut
  );
  router.delete(
    '/locations/:id',
    authenticate,
    logRequest,
    validateParams(locationsDeleteParamsSchema),
    locationsDelete
  );
  router.put(
    '/locations/:id/collaborators/:userId',
    authenticate,
    logRequest,
    validateParams(collaboratorPutParamsSchema),
    validateBody(collaboratorPutRequestSchema),
    locationsCollaboratorsPut
  );
  router.delete(
    '/locations/:id/collaborators/:userId',
    authenticate,
    logRequest,
    validateParams(collaboratorDeleteParamsSchema),
    locationsCollaboratorsDelete
  );
}
