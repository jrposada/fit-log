import { workoutsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/workout/workout-delete';
import { workoutsGetQuerySchema } from '@jrposada/fit-log-shared/models/workout/workout-get';
import { workoutsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/workout/workout-get-by-id';
import { workoutsPutRequestSchema } from '@jrposada/fit-log-shared/models/workout/workout-put';
import type { Router } from 'express';

import { authenticateKeycloak } from '../../middlewares/auth.ts';
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
    authenticateKeycloak,
    validateQuery(workoutsGetQuerySchema),
    workoutsGet
  );
  router.get(
    '/workouts/:id',
    authenticateKeycloak,
    validateParams(workoutsGetByIdParamsSchema),
    workoutsGetById
  );
  router.put(
    '/workouts',
    authenticateKeycloak,
    validateBody(workoutsPutRequestSchema),
    workoutsPut
  );
  router.delete(
    '/workouts/:id',
    authenticateKeycloak,
    validateParams(workoutsDeleteParamsSchema),
    workoutsDelete
  );
}
