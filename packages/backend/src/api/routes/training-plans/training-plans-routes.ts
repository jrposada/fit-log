import { trainingPlansGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/training-plans/training-plans-get-by-id';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { logResponse } from '../../middlewares/log-response.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { handler as trainingPlansGet } from './training-plans-get.ts';
import { handler as trainingPlansGetById } from './training-plans-get-by-id.ts';

export function registerTrainingPlansRoutes(router: Router): void {
  router.get(
    '/training-plans',
    authenticate,
    logRequest,
    logResponse,
    trainingPlansGet
  );
  router.get(
    '/training-plans/:id',
    authenticate,
    logRequest,
    logResponse,
    validateParams(trainingPlansGetByIdParamsSchema),
    trainingPlansGetById
  );
}
