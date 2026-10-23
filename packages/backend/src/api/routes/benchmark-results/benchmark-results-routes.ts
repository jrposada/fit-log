import { benchmarkResultsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-delete';
import { benchmarkResultsGetQuerySchema } from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-get';
import { benchmarkResultsPutRequestSchema } from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-put';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { logResponse } from '../../middlewares/log-response.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as benchmarkResultsDelete } from './benchmark-results-delete.ts';
import { handler as benchmarkResultsGet } from './benchmark-results-get.ts';
import { handler as benchmarkResultsPut } from './benchmark-results-put.ts';

export function registerBenchmarkResultsRoutes(router: Router): void {
  router.get(
    '/benchmark-results',
    authenticate,
    logRequest,
    logResponse,
    validateQuery(benchmarkResultsGetQuerySchema),
    benchmarkResultsGet
  );
  router.put(
    '/benchmark-results',
    authenticate,
    logRequest,
    logResponse,
    validateBody(benchmarkResultsPutRequestSchema),
    benchmarkResultsPut
  );
  router.delete(
    '/benchmark-results/:id',
    authenticate,
    logRequest,
    logResponse,
    validateParams(benchmarkResultsDeleteParamsSchema),
    benchmarkResultsDelete
  );
}
