import {
  climbHistoriesDeleteParamsSchema,
  climbHistoriesDeleteQuerySchema,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-delete';
import { climbHistoriesGetQuerySchema } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-get';
import { climbHistoriesGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-get-by-id';
import { climbHistoryProjectRequestSchema } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-project';
import { climbHistoriesPutRequestSchema } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-put';
import { climbHistoriesStatsQuerySchema } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-stats';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as climbHistoriesDelete } from './climb-histories-delete.ts';
import { handler as climbHistoriesGet } from './climb-histories-get.ts';
import { handler as climbHistoriesGetById } from './climb-histories-get-by-id.ts';
import { handler as climbHistoriesProject } from './climb-histories-project.ts';
import { handler as climbHistoriesPut } from './climb-histories-put.ts';
import { handler as climbHistoriesStats } from './climb-histories-stats.ts';

export function registerClimbHistoriesRoutes(router: Router): void {
  router.get(
    '/climb-histories',
    authenticate,
    validateQuery(climbHistoriesGetQuerySchema),
    climbHistoriesGet
  );
  // Must be registered before '/climb-histories/:id' so 'stats' is not matched as an id.
  router.get(
    '/climb-histories/stats',
    authenticate,
    validateQuery(climbHistoriesStatsQuerySchema),
    climbHistoriesStats
  );
  router.get(
    '/climb-histories/:id',
    authenticate,
    validateParams(climbHistoriesGetByIdParamsSchema),
    climbHistoriesGetById
  );
  router.put(
    '/climb-histories',
    authenticate,
    validateBody(climbHistoriesPutRequestSchema),
    climbHistoriesPut
  );
  router.put(
    '/climb-histories/project',
    authenticate,
    validateBody(climbHistoryProjectRequestSchema),
    climbHistoriesProject
  );
  router.delete(
    '/climb-histories/:id',
    authenticate,
    validateParams(climbHistoriesDeleteParamsSchema),
    validateQuery(climbHistoriesDeleteQuerySchema),
    climbHistoriesDelete
  );
}
