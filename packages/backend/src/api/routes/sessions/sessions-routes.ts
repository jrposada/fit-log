import { sessionsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/sessions/sessions-delete';
import { sessionsGetQuerySchema } from '@jrposada/fit-log-shared/models/sessions/sessions-get';
import { sessionsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/sessions/sessions-get-by-id';
import { sessionsPutRequestSchema } from '@jrposada/fit-log-shared/models/sessions/sessions-put';
import type { Router } from 'express';

import { authenticateKeycloak } from '../../middlewares/auth.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as sessionsDelete } from './sessions-delete.ts';
import { handler as sessionsGet } from './sessions-get.ts';
import { handler as sessionsGetById } from './sessions-get-by-id.ts';
import { handler as sessionsPut } from './sessions-put.ts';

export function registerSessionsRoutes(router: Router): void {
  router.get(
    '/sessions',
    authenticateKeycloak,
    validateQuery(sessionsGetQuerySchema),
    sessionsGet
  );
  router.get(
    '/sessions/:id',
    authenticateKeycloak,
    validateParams(sessionsGetByIdParamsSchema),
    sessionsGetById
  );
  router.put(
    '/sessions',
    authenticateKeycloak,
    validateBody(sessionsPutRequestSchema),
    sessionsPut
  );
  router.delete(
    '/sessions/:id',
    authenticateKeycloak,
    validateParams(sessionsDeleteParamsSchema),
    sessionsDelete
  );
}
