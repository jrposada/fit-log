import {
  climbsDeleteParamsSchema,
  climbsGetByIdParamsSchema,
  climbsGetQuerySchema,
  climbsPutRequestSchema,
} from '@shared/models/climb';
import {
  locationsDeleteParamsSchema,
  locationsGetByIdParamsSchema,
  locationsGetQuerySchema,
  locationsPutRequestSchema,
} from '@shared/models/location';
import {
  sectorsDeleteParamsSchema,
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

import { handler as climbsDelete } from './api/climbs/climbs-delete';
import { handler as climbsGet } from './api/climbs/climbs-get';
import { handler as climbsGetById } from './api/climbs/climbs-get-by-id';
import { handler as climbsPut } from './api/climbs/climbs-put';
import { handler as locationsDelete } from './api/locations/locations-delete';
import { handler as locationsGet } from './api/locations/locations-get';
import { handler as locationsGetById } from './api/locations/locations-get-by-id';
import { handler as locationsPut } from './api/locations/locations-put';
import { handler as sectorsDelete } from './api/sectors/sectors-delete';
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
import { authenticateKeycloak } from './middleware/auth';
import { validateBody } from './middleware/validate-body';
import { validateParams } from './middleware/validate-params';
import { validateQuery } from './middleware/validate-query';

export const router = Router();

// Version
router.get('/version', versionGet);

// Workouts
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

// Sessions
router.get('/sessions', validateQuery(sessionsGetQuerySchema), sessionsGet);
router.get(
  '/sessions/:id',
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
  authenticateKeycloak,
  validateQuery(locationsGetQuerySchema),
  locationsGet
);
router.get(
  '/locations/:id',
  authenticateKeycloak,
  validateParams(locationsGetByIdParamsSchema),
  locationsGetById
);
router.put(
  '/locations',
  authenticateKeycloak,
  validateBody(locationsPutRequestSchema),
  locationsPut
);
router.delete(
  '/locations/:id',
  authenticateKeycloak,
  validateParams(locationsDeleteParamsSchema),
  locationsDelete
);

// Sectors
router.put(
  '/sectors',
  authenticateKeycloak,
  validateBody(sectorsPutRequestSchema),
  sectorsPut
);
router.delete(
  '/sectors/:id',
  authenticateKeycloak,
  validateParams(sectorsDeleteParamsSchema),
  sectorsDelete
);
router.post(
  '/sectors/upload-url',
  authenticateKeycloak,
  validateBody(sectorUploadUrlRequestSchema),
  sectorsUploadUrl
);

// Climbs
router.get(
  '/climbs',
  authenticateKeycloak,
  validateQuery(climbsGetQuerySchema),
  climbsGet
);
router.get(
  '/climbs/:id',
  authenticateKeycloak,
  validateParams(climbsGetByIdParamsSchema),
  climbsGetById
);
router.put(
  '/climbs',
  authenticateKeycloak,
  validateBody(climbsPutRequestSchema),
  climbsPut
);
router.delete(
  '/climbs/:id',
  authenticateKeycloak,
  validateParams(climbsDeleteParamsSchema),
  climbsDelete
);
