import { trainingSessionsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-delete';
import { trainingSessionsGetQuerySchema } from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get';
import { trainingSessionsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get-by-id';
import { trainingSessionsPutRequestSchema } from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-put';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as trainingSessionsDelete } from './training-sessions-delete.ts';
import { handler as trainingSessionsGet } from './training-sessions-get.ts';
import { handler as trainingSessionsGetById } from './training-sessions-get-by-id.ts';
import { handler as trainingSessionsPut } from './training-sessions-put.ts';

export function registerTrainingSessionsRoutes(router: Router): void {
  router.get(
    '/training-sessions',
    authenticate,
    validateQuery(trainingSessionsGetQuerySchema),
    trainingSessionsGet
  );
  router.get(
    '/training-sessions/:id',
    authenticate,
    validateParams(trainingSessionsGetByIdParamsSchema),
    trainingSessionsGetById
  );
  router.put(
    '/training-sessions',
    authenticate,
    validateBody(trainingSessionsPutRequestSchema),
    trainingSessionsPut
  );
  router.delete(
    '/training-sessions/:id',
    authenticate,
    validateParams(trainingSessionsDeleteParamsSchema),
    trainingSessionsDelete
  );
}
