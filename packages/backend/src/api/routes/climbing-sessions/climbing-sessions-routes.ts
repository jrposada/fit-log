import { climbingSessionsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-delete';
import { climbingSessionsGetQuerySchema } from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-get';
import { climbingSessionsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-get-by-id';
import { climbingSessionsPutRequestSchema } from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-put';
import type { Router } from 'express';

import { authenticateKeycloak } from '../../middlewares/auth.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as climbingSessionsDelete } from './climbing-sessions-delete.ts';
import { handler as climbingSessionsGet } from './climbing-sessions-get.ts';
import { handler as climbingSessionsGetById } from './climbing-sessions-get-by-id.ts';
import { handler as climbingSessionsPut } from './climbing-sessions-put.ts';

export function registerClimbingSessionsRoutes(router: Router): void {
  router.get(
    '/climbing-sessions',
    authenticateKeycloak,
    validateQuery(climbingSessionsGetQuerySchema),
    climbingSessionsGet
  );
  router.get(
    '/climbing-sessions/:id',
    authenticateKeycloak,
    validateParams(climbingSessionsGetByIdParamsSchema),
    climbingSessionsGetById
  );
  router.put(
    '/climbing-sessions',
    authenticateKeycloak,
    validateBody(climbingSessionsPutRequestSchema),
    climbingSessionsPut
  );
  router.delete(
    '/climbing-sessions/:id',
    authenticateKeycloak,
    validateParams(climbingSessionsDeleteParamsSchema),
    climbingSessionsDelete
  );
}
