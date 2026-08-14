import { workoutsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/workout/workout-delete';
import { workoutsGetQuerySchema } from '@jrposada/fit-log-shared/models/workout/workout-get';
import { workoutsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/workout/workout-get-by-id';
import { workoutsPutRequestSchema } from '@jrposada/fit-log-shared/models/workout/workout-put';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as workoutsDelete } from './workouts-delete.ts';
import { handler as workoutsGet } from './workouts-get.ts';
import { handler as workoutsGetById } from './workouts-get-by-id.ts';
import { handler as workoutsPut } from './workouts-put.ts';

export function registerWorkoutsRoutes(router: Router): void {
  router.get(
    '/workouts',
    authenticate,
    logRequest,
    validateQuery(workoutsGetQuerySchema),
    workoutsGet
  );
  router.get(
    '/workouts/:id',
    authenticate,
    logRequest,
    validateParams(workoutsGetByIdParamsSchema),
    workoutsGetById
  );
  router.put(
    '/workouts',
    authenticate,
    logRequest,
    validateBody(workoutsPutRequestSchema),
    workoutsPut
  );
  router.delete(
    '/workouts/:id',
    authenticate,
    logRequest,
    validateParams(workoutsDeleteParamsSchema),
    workoutsDelete
  );
}
