import { collaboratorDeleteParamsSchema } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import {
  collaboratorPutParamsSchema,
  collaboratorPutRequestSchema,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import { climbsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/climbs/climbs-delete';
import { climbsGetQuerySchema } from '@jrposada/fit-log-shared/models/climbs/climbs-get';
import { climbsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/climbs/climbs-get-by-id';
import { climbsPutRequestSchema } from '@jrposada/fit-log-shared/models/climbs/climbs-put';
import { climbsSearchQuerySchema } from '@jrposada/fit-log-shared/models/climbs/climbs-search';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { logResponse } from '../../middlewares/log-response.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as climbsCollaboratorsDelete } from './climbs-collaborators-delete.ts';
import { handler as climbsCollaboratorsPut } from './climbs-collaborators-put.ts';
import { handler as climbsDelete } from './climbs-delete.ts';
import { handler as climbsGet } from './climbs-get.ts';
import { handler as climbsGetById } from './climbs-get-by-id.ts';
import { handler as climbsPut } from './climbs-put.ts';
import { handler as climbsSearch } from './climbs-search.ts';

export function registerClimbsRoutes(router: Router): void {
  router.get(
    '/climbs',
    authenticate,
    logRequest,
    logResponse,
    validateQuery(climbsGetQuerySchema),
    climbsGet
  );
  // Must be registered before '/climbs/:id' so 'search' is not matched as an id.
  router.get(
    '/climbs/search',
    authenticate,
    logRequest,
    logResponse,
    validateQuery(climbsSearchQuerySchema),
    climbsSearch
  );
  router.get(
    '/climbs/:id',
    authenticate,
    logRequest,
    logResponse,
    validateParams(climbsGetByIdParamsSchema),
    climbsGetById
  );
  router.put(
    '/climbs',
    authenticate,
    logRequest,
    logResponse,
    validateBody(climbsPutRequestSchema),
    climbsPut
  );
  router.delete(
    '/climbs/:id',
    authenticate,
    logRequest,
    logResponse,
    validateParams(climbsDeleteParamsSchema),
    climbsDelete
  );
  router.put(
    '/climbs/:id/collaborators/:userId',
    authenticate,
    logRequest,
    logResponse,
    validateParams(collaboratorPutParamsSchema),
    validateBody(collaboratorPutRequestSchema),
    climbsCollaboratorsPut
  );
  router.delete(
    '/climbs/:id/collaborators/:userId',
    authenticate,
    logRequest,
    logResponse,
    validateParams(collaboratorDeleteParamsSchema),
    climbsCollaboratorsDelete
  );
}
