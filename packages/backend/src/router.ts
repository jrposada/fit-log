import {
  climbsDeleteParamsSchema,
  climbsGetByIdParamsSchema,
  climbsGetQuerySchema,
  climbsPutRequestSchema,
} from '@shared/models/climb';
import {
  favoriteWorkoutsDeleteParamsSchema,
  favoriteWorkoutsPutRequestSchema,
} from '@shared/models/favorite-workout';
import {
  locationsDeleteParamsSchema,
  locationsGetByIdParamsSchema,
  locationsGetQuerySchema,
  locationsPutRequestSchema,
} from '@shared/models/location';
import {
  sectorsDeleteParamsSchema,
  sectorsGetQuerySchema,
  sectorsPutRequestSchema,
  sectorUploadUrlRequestSchema,
} from '@shared/models/sector';
import {
  sessionsDeleteParamsSchema,
  sessionsGetByIdParamsSchema,
  sessionsGetQuerySchema,
  sessionsPutRequestSchema,
} from '@shared/models/session';
import {
  usersAuthorizeRequestSchema,
  usersPostRequestSchema,
} from '@shared/models/users';
import {
  workoutsDeleteParamsSchema,
  workoutsGetByIdParamsSchema,
  workoutsGetQuerySchema,
  workoutsPutRequestSchema,
} from '@shared/models/workout';
import { Router } from 'express';

import {
  requireAuth,
  validateBody,
  validateParams,
  validateQuery,
} from './api/api-utils';
import { handler as climbsDelete } from './api/climbs/climbs-delete';
import { handler as climbsGet } from './api/climbs/climbs-get';
import { handler as climbsGetById } from './api/climbs/climbs-get-by-id';
import { handler as climbsPut } from './api/climbs/climbs-put';
import { handler as favoriteWorkoutsDelete } from './api/favorite-workouts/favorite-workouts-delete';
import { handler as favoriteWorkoutsPut } from './api/favorite-workouts/favorite-workouts-put';
import { handler as locationsDelete } from './api/locations/locations-delete';
import { handler as locationsGet } from './api/locations/locations-get';
import { handler as locationsGetById } from './api/locations/locations-get-by-id';
import { handler as locationsPut } from './api/locations/locations-put';
import { handler as sectorsDelete } from './api/sectors/sectors-delete';
import { handler as sectorsGet } from './api/sectors/sectors-get';
import { handler as sectorsPut } from './api/sectors/sectors-put';
import { handler as sectorsUploadUrl } from './api/sectors/sectors-upload-url';
import { handler as sessionsDelete } from './api/sessions/sessions-delete';
import { handler as sessionsGet } from './api/sessions/sessions-get';
import { handler as sessionsGetById } from './api/sessions/sessions-get-by-id';
import { handler as sessionsPut } from './api/sessions/sessions-put';
import { handler as usersAuthorize } from './api/users/users-authorize';
import { handler as usersPost } from './api/users/users-post';
import { handler as versionGet } from './api/version/version-get';
import { handler as workoutsDelete } from './api/workouts/workouts-delete';
import { handler as workoutsGet } from './api/workouts/workouts-get';
import { handler as workoutsGetById } from './api/workouts/workouts-get-by-id';
import { handler as workoutsPut } from './api/workouts/workouts-put';

export const router = Router();

// Version
router.get('/version', versionGet);

// Workouts
router.get(
  '/workouts',
  requireAuth,
  validateQuery(workoutsGetQuerySchema),
  workoutsGet
);
router.get(
  '/workouts/:id',
  requireAuth,
  validateParams(workoutsGetByIdParamsSchema),
  workoutsGetById
);
router.put(
  '/workouts',
  requireAuth,
  validateBody(workoutsPutRequestSchema),
  workoutsPut
);
router.delete(
  '/workouts/:id',
  requireAuth,
  validateParams(workoutsDeleteParamsSchema),
  workoutsDelete
);

// Sessions
router.get('/sessions', validateQuery(sessionsGetQuerySchema), sessionsGet);
router.get(
  '/sessions/:id',
  validateParams(sessionsGetByIdParamsSchema),
  sessionsGetById
);
router.put(
  '/sessions',
  requireAuth,
  validateBody(sessionsPutRequestSchema),
  sessionsPut
);
router.delete(
  '/sessions/:id',
  requireAuth,
  validateParams(sessionsDeleteParamsSchema),
  sessionsDelete
);

// Favorite Workouts
router.put(
  '/favorite-workouts',
  requireAuth,
  validateBody(favoriteWorkoutsPutRequestSchema),
  favoriteWorkoutsPut
);
router.delete(
  '/favorite-workouts/:id',
  requireAuth,
  validateParams(favoriteWorkoutsDeleteParamsSchema),
  favoriteWorkoutsDelete
);

// Users
router.post('/users', validateBody(usersPostRequestSchema), usersPost);
router.post(
  '/users/authorize',
  validateBody(usersAuthorizeRequestSchema),
  usersAuthorize
);

// Locations
router.get(
  '/locations',
  requireAuth,
  validateQuery(locationsGetQuerySchema),
  locationsGet
);
router.get(
  '/locations/:id',
  requireAuth,
  validateParams(locationsGetByIdParamsSchema),
  locationsGetById
);
router.put(
  '/locations',
  requireAuth,
  validateBody(locationsPutRequestSchema),
  locationsPut
);
router.delete(
  '/locations/:id',
  requireAuth,
  validateParams(locationsDeleteParamsSchema),
  locationsDelete
);

// Sectors
router.get(
  '/sectors',
  requireAuth,
  validateQuery(sectorsGetQuerySchema),
  sectorsGet
);
router.put(
  '/sectors',
  requireAuth,
  validateBody(sectorsPutRequestSchema),
  sectorsPut
);
router.delete(
  '/sectors/:id',
  requireAuth,
  validateParams(sectorsDeleteParamsSchema),
  sectorsDelete
);
router.post(
  '/sectors/upload-url',
  requireAuth,
  validateBody(sectorUploadUrlRequestSchema),
  sectorsUploadUrl
);

// Climbs
router.get(
  '/climbs',
  requireAuth,
  validateQuery(climbsGetQuerySchema),
  climbsGet
);
router.get(
  '/climbs/:id',
  requireAuth,
  validateParams(climbsGetByIdParamsSchema),
  climbsGetById
);
router.put(
  '/climbs',
  requireAuth,
  validateBody(climbsPutRequestSchema),
  climbsPut
);
router.delete(
  '/climbs/:id',
  requireAuth,
  validateParams(climbsDeleteParamsSchema),
  climbsDelete
);
